// Namespace, room, multiplexing, tự kết nối lại, tin bị mất khi đứt kết nối
// và connection state recovery của Socket.IO.
// Chạy: npm i socket.io socket.io-client && node rooms.ts
import http from 'node:http';
import { Server, type Socket } from 'socket.io';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const once = <T>(s: ClientSocket, ev: string) => new Promise<T>((r) => s.once(ev, r as never));

async function start(opts: ConstructorParameters<typeof Server>[1] = {}) {
  const httpServer = http.createServer();
  const io = new Server(httpServer, opts);
  // "đăng nhập" bằng auth.user (thật ra là JWT), rồi vào phòng riêng của user
  const auth = (s: Socket, next: (e?: Error) => void) => {
    s.data.user = s.handshake.auth.user;
    s.data.user ? next() : next(new Error('UNAUTHORIZED'));
  };
  for (const nsp of ['/flash-sale', '/notifications']) {
    io.of(nsp).use(auth).on('connection', (s) => {
      if (!s.recovered) s.join(`user:${s.data.user}`);
      s.on('subscribe_campaign', (cid: string) => s.join(`campaign:${cid}`));
      s.on('cart_add', (sku: string) => console.log(`   server nhận cart_add ${sku} từ ${s.data.user}`));
    });
  }
  await new Promise<void>((r) => httpServer.listen(0, r));
  const url = `http://localhost:${(httpServer.address() as { port: number }).port}`;
  return { io, httpServer, url };
}

// ── 1. Multiplexing: hai namespace, một kết nối ─────────────────────────
{
  const { io, url } = await start();
  const notif = ioc(`${url}/notifications`, { auth: { user: 'u1' } });          // mặc định: polling rồi nâng cấp
  const flash = ioc(`${url}/flash-sale`, { auth: { user: 'u1' }, transports: ['websocket'] });
  await Promise.all([once(notif, 'connect'), once(flash, 'connect')]);
  console.log('1) Hai lời gọi io() tới hai namespace của cùng một origin');
  console.log(`   dùng chung Manager: ${notif.io === flash.io};  số kết nối Engine.IO ở server: ${io.engine.clientsCount}`);
  console.log(`   transports mà lời gọi thứ hai thật sự dùng: ${JSON.stringify((flash.io.engine as unknown as { transports: string[] }).transports)} ← option ['websocket'] bị bỏ qua`);
  notif.close(); flash.close(); io.close();
}

// ── 2. Room: gửi cho một user (mọi tab) hoặc một chiến dịch ─────────────
{
  const { io, url } = await start();
  const tab = (user: string) => ioc(`${url}/flash-sale`, { auth: { user }, forceNew: true, transports: ['websocket'] });
  const [u1a, u1b, u2] = [tab('u1'), tab('u1'), tab('u2')];
  await Promise.all([u1a, u1b, u2].map((s) => once(s, 'connect')));
  u2.emit('subscribe_campaign', 'c-21h');
  await sleep(100);
  const got: string[] = [];
  for (const [name, s] of [['u1 tab A', u1a], ['u1 tab B', u1b], ['u2', u2]] as const)
    s.onAny((ev) => got.push(`${name} ← ${ev}`));
  const nsp = io.of('/flash-sale');
  nsp.to('user:u1').emit('order_result', { ok: true });
  nsp.to('campaign:c-21h').emit('stock_update', { left: 40 });
  await sleep(100);
  const [one] = await nsp.in('user:u2').fetchSockets();
  console.log('\n2) Room chỉ tồn tại ở server');
  console.log(`   phòng của một socket u2: ${JSON.stringify([...one.rooms])}`);
  for (const g of got.sort()) console.log(`   ${g}`);
  [u1a, u1b, u2].forEach((s) => s.close()); io.close();
}

// ── 3. Đứt kết nối: tin client buffer lại, tin server thì mất ─────────────
async function dropScenario(title: string, opts: ConstructorParameters<typeof Server>[1]) {
  const { io, url } = await start(opts);
  const c = ioc(`${url}/flash-sale`, { auth: { user: 'u1' }, transports: ['websocket'], reconnectionDelay: 300, randomizationFactor: 0 });
  await once(c, 'connect');
  const got: string[] = [];
  c.on('order_result', (p: { n: number }) => got.push(`order_result #${p.n}`));
  io.of('/flash-sale').to('user:u1').emit('order_result', { n: 1 });   // tin đầu: khởi tạo offset
  await sleep(100);
  console.log(`\n${title}`);
  const firstId = c.id;
  for (const s of await io.of('/flash-sale').fetchSockets()) (s as unknown as { conn: { close(): void } }).conn.close(); // cắt đường truyền
  await once(c, 'disconnect');
  console.log(`   client: mất kết nối, connected=${c.connected}`);
  c.emit('cart_add', 'SKU-9');                               // client gửi khi đang mất kết nối
  io.of('/flash-sale').to('user:u1').emit('order_result', { n: 2 }); // server gửi khi client vắng mặt
  await once(c, 'connect');
  await sleep(150);
  console.log(`   client: nối lại, recovered=${Boolean(c.recovered)}, giữ id cũ=${c.id === firstId}`);
  console.log(`   client đã nhận: ${got.join(', ')}`);
  c.close(); io.close();
}
await dropScenario('3) Mặc định: at most once', {});
await dropScenario('4) Bật connectionStateRecovery (adapter trong RAM)', {
  connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000 },
});

// ── 5. Tự kết nối lại có giới hạn số lần ────────────────────────────────
{
  const { io, httpServer, url } = await start();
  const c = ioc(`${url}/flash-sale`, {
    auth: { user: 'u1' }, transports: ['websocket'],
    reconnectionAttempts: 5, reconnectionDelay: 100, reconnectionDelayMax: 500, // flash-sale: 5 lần, 1000 ms
  });
  await once(c, 'connect');
  console.log('\n5) Server tắt hẳn (deploy lâu), client đặt reconnectionAttempts: 5');
  c.io.on('reconnect_attempt', (n) => console.log(`   thử lại lần ${n}`));
  io.close(); httpServer.closeAllConnections();
  await once(c.io as unknown as ClientSocket, 'reconnect_failed');
  console.log('   reconnect_failed: client bỏ cuộc vĩnh viễn, server có lên lại cũng không tự nối nữa');
  c.close();
}
