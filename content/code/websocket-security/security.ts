// Bốn chuyện an toàn và vận hành của kết nối sống lâu:
// 1) Cross-Site WebSocket Hijacking, 2) token hết hạn giữa chừng,
// 3) giới hạn kích thước tin, 4) backpressure với client đọc chậm.
// Chạy: npm i socket.io socket.io-client ws && node security.ts
import http from 'node:http';
import { Server, type ServerOptions } from 'socket.io';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { WebSocketServer, WebSocket as WsClient } from 'ws';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const SHOP = 'https://shop.example';

async function start(opts: Partial<ServerOptions>, setup: (io: Server) => void) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, opts);
  setup(io);
  await new Promise<void>((r) => httpServer.listen(0, r));
  return { io, url: `http://localhost:${(httpServer.address() as { port: number }).port}` };
}
// kết quả của một lần kết nối: vào được hay bị chặn
const attempt = (c: ClientSocket) => new Promise<string>((r) => {
  c.on('connect', () => r('VÀO ĐƯỢC'));
  c.on('connect_error', (e) => r(`bị chặn (${e.message})`));
});

// ── 1. CSWSH: trang lạ mở WebSocket, trình duyệt tự gửi cookie ───────────
console.log('1) Trang evil.example mở WebSocket tới server, trình duyệt tự đính kèm cookie phiên');
const cookieAuth = (io: Server) => io.use((s, next) => {
  const session = /session=(\w+)/.exec(s.handshake.headers.cookie ?? '')?.[1];
  session ? next() : next(new Error('UNAUTHORIZED'));
});
const evil = { transports: ['websocket'], reconnection: false,
  extraHeaders: { origin: 'https://evil.example', cookie: 'session=abc123' } }; // trình duyệt làm việc này
for (const [label, opts] of [
  ['chỉ cấu hình cors', { cors: { origin: SHOP, credentials: true } }],
  ['cors + allowRequest kiểm Origin', {
    cors: { origin: SHOP, credentials: true },
    allowRequest: (req: http.IncomingMessage, cb: (err: string | null | undefined, ok: boolean) => void) =>
      cb(null, req.headers.origin === SHOP),
  }],
] as const) {
  const { io, url } = await start(opts as Partial<ServerOptions>, cookieAuth);
  const c = ioc(url, evil);
  console.log(`   ${label.padEnd(32)} → ${await attempt(c)}`);
  c.close(); io.close();
}
{
  // xác thực bằng token trong gói CONNECT: trang lạ không đọc được token
  const { io, url } = await start({}, (io) => io.use((s, next) =>
    s.handshake.auth.token === 'jwt-of-u1' ? next() : next(new Error('UNAUTHORIZED'))));
  const c = ioc(url, evil);
  console.log(`   ${'token trong auth thay cho cookie'.padEnd(32)} → ${await attempt(c)}`);
  c.close(); io.close();
}

// ── 2. Token hết hạn nhưng kết nối vẫn sống ──────────────────────────────
console.log('\n2) Token sống 1 giây, chỉ được kiểm lúc bắt tay');
for (const enforce of [false, true]) {
  const { io, url } = await start({}, (io) => {
    io.use((s, next) => {
      const exp = Number(s.handshake.auth.exp);
      if (Date.now() >= exp) return next(new Error('TOKEN_EXPIRED'));
      // cách vá: hẹn giờ ngắt đúng lúc token hết hạn
      if (enforce) setTimeout(() => s.disconnect(true), exp - Date.now());
      next();
    });
  });
  const c = ioc(url, { auth: { exp: Date.now() + 1000 }, transports: ['websocket'], reconnection: false });
  let pushes = 0;
  c.on('order_result', () => pushes++);
  await attempt(c);
  await sleep(2000);
  io.emit('order_result', { ok: true });
  await sleep(100);
  console.log(`   ${enforce ? 'có hẹn giờ ngắt' : 'không làm gì   '}: 2 giây sau, connected=${c.connected}, vẫn nhận tin=${pushes > 0}`);
  c.close(); io.close();
}

// ── 3. Giới hạn kích thước tin ──────────────────────────────────────────
console.log('\n3) Client gửi một tin 2 MB, server để maxHttpBufferSize mặc định 1 MB');
{
  let received = 0;
  const { io, url } = await start({}, (io) => io.on('connection', (s) => s.on('cart_note', () => received++)));
  const c = ioc(url, { transports: ['websocket'], reconnection: false });
  await attempt(c);
  c.emit('cart_note', 'x'.repeat(2_000_000));
  const reason = await new Promise<string>((r) => c.on('disconnect', r));
  console.log(`   server không xử lý (${received} tin), cắt kết nối; client thấy "${reason}"`);
  c.close(); io.close();
}

// ── 4. Backpressure: client đọc chậm, server cứ gửi ──────────────────────
console.log('\n4) Server gửi 20.000 tin 1 KB cho một client đã ngừng đọc');
for (const guard of [false, true]) {
  const httpServer = http.createServer();
  const wss = new WebSocketServer({ server: httpServer });
  await new Promise<void>((r) => httpServer.listen(0, r));
  const port = (httpServer.address() as { port: number }).port;
  const slow = new WsClient(`ws://localhost:${port}`);
  const serverSide = await new Promise<WsClient>((r) => wss.on('connection', r));
  await new Promise((r) => slow.on('open', r));
  (slow as unknown as { _socket: { pause(): void } })._socket.pause(); // client "treo": không đọc nữa
  const msg = Buffer.alloc(1024, 'x');
  let sent = 0, dropped = 0;
  for (let i = 0; i < 20_000; i++) {
    // bufferedAmount: số byte đã gọi send() nhưng chưa ghi được xuống mạng
    if (guard && serverSide.bufferedAmount > 1_000_000) { dropped++; continue; }
    serverSide.send(msg); sent++;
  }
  await sleep(200);
  const mb = (serverSide.bufferedAmount / 1e6).toFixed(1);
  console.log(`   ${guard ? 'bỏ tin khi đệm > 1 MB' : 'không kiểm tra       '}: gửi ${sent}, bỏ ${dropped}, RAM server đang giữ cho client này ≈ ${mb} MB`);
  slow.terminate(); wss.close(); httpServer.close();
}
