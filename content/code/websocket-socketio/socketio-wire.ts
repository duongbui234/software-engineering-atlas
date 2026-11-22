// Socket.IO không phải WebSocket: nhìn những gì thật sự chạy trên dây.
// 1) bắt tay Engine.IO bằng HTTP long polling, 2) nâng cấp lên WebSocket bằng tay,
// 3) gói tin Socket.IO "42[...]" và ack, 4) hai bên nói khác thứ tiếng.
// Chạy: npm i socket.io socket.io-client ws && node socketio-wire.ts
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ioc } from 'socket.io-client';
import { WebSocketServer } from 'ws';

const httpServer = http.createServer();
const io = new Server(httpServer, { pingInterval: 1500, pingTimeout: 1000 }); // rút ngắn để thấy ping
io.of('/flash-sale').on('connection', (socket) => {
  socket.on('subscribe_campaign', (body: { campaignId: string }, ack: (r: unknown) => void) => {
    socket.join(`campaign:${body.campaignId}`);
    ack({ event: 'subscribed', data: body });                       // trả lời cho đúng lần emit này
    io.of('/flash-sale').to(`campaign:${body.campaignId}`).emit('stock_update', { sku: 'A1', left: 41 });
  });
});
await new Promise<void>((r) => httpServer.listen(0, r));
const port = (httpServer.address() as { port: number }).port;
const base = `http://localhost:${port}/socket.io/?EIO=4`;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

console.log('1) Bắt tay Engine.IO: một GET HTTP thường, chưa có WebSocket nào');
const open = await (await fetch(`${base}&transport=polling`)).text();
console.log(`   GET /socket.io/?EIO=4&transport=polling\n   ← ${open}`);
const { sid } = JSON.parse(open.slice(1));
console.log('   chữ "0" đầu = gói OPEN của Engine.IO; sid = mã phiên, phải gửi kèm mọi request sau\n');

console.log('2) Nâng cấp lên WebSocket, làm bằng tay');
const pending = fetch(`${base}&transport=polling&sid=${sid}`).then((r) => r.text()); // long poll đang treo
const ws = new WebSocket(`ws://localhost:${port}/socket.io/?EIO=4&transport=websocket&sid=${sid}`);
const inbox: string[] = [];
ws.onmessage = (m) => inbox.push(m.data as string);
await new Promise((r) => (ws.onopen = r));
ws.send('2probe');                              // "2" = PING, kèm chữ probe: thử đường mới
await sleep(50);
console.log(`   → 2probe   ← ${inbox.shift()}   (3 = PONG: đường WebSocket dùng được)`);
console.log(`   long poll đang treo được server trả về: "${await pending}"   (6 = NOOP: polling, nghỉ đi)`);
ws.send('5');                                   // "5" = UPGRADE: từ giờ chỉ dùng WebSocket
console.log('   → 5        (UPGRADE: từ giờ chỉ dùng WebSocket)\n');

console.log('3) Gói tin Socket.IO đi bên trong gói MESSAGE (4) của Engine.IO');
ws.send('40/flash-sale,');                      // 4 MESSAGE + 0 CONNECT vào namespace
await sleep(100);
console.log(`   → 40/flash-sale,   ← ${inbox.shift()}`);
ws.send('42/flash-sale,7["subscribe_campaign",{"campaignId":"c-21h"}]'); // 2 EVENT, 7 = mã ack
await sleep(100);
for (const m of inbox.splice(0)) console.log(`   ← ${m}`);
console.log('   43/…7[…] = ACK cho lần emit số 7;  42/…["stock_update",…] = sự kiện server đẩy xuống');
await sleep(1600);
console.log(`   … ${inbox.length ? `server tự gửi "${inbox.shift()}" (PING), client phải trả "3" trong pingTimeout` : '(không thấy ping)'}`);
ws.send('3');
ws.close();
await sleep(100);

console.log('\n4) Hai bên nói khác thứ tiếng');
// 4a. client WebSocket thuần gửi chữ thường tới server Socket.IO
const plain = new WebSocket(`ws://localhost:${port}/socket.io/?EIO=4&transport=websocket`);
const plainMsgs: string[] = [];
plain.onmessage = (m) => plainMsgs.push(m.data as string);
await new Promise((r) => (plain.onopen = r));
plain.send('{"type":"subscribe","campaignId":"c-21h"}');
await new Promise((r) => (plain.onclose = r));
console.log(`   WebSocket thuần → server Socket.IO: nhận được ${JSON.stringify(plainMsgs[0])} rồi bị đóng; handler "subscribe" không bao giờ chạy`);

// 4b. client Socket.IO tới server WebSocket thuần
const wsOnly = http.createServer();
const wss = new WebSocketServer({ server: wsOnly });
let rawConnections = 0;
wss.on('connection', (s) => { rawConnections++; s.on('message', () => {}); });
await new Promise<void>((r) => wsOnly.listen(0, r));
const wsPort = (wsOnly.address() as { port: number }).port;
const client = ioc(`http://localhost:${wsPort}`, { transports: ['websocket'], timeout: 1500, reconnection: false });
const err: Error = await new Promise((r) => client.on('connect_error', r));
console.log(`   client Socket.IO → server ws thuần: kết nối TCP mở được (${rawConnections} kết nối), nhưng connect_error: "${err.message}"`);
console.log('   (server ws thuần không bao giờ gửi gói OPEN "0{…}" nên client Socket.IO cứ chờ rồi bỏ cuộc)');

client.close(); wss.close(); wsOnly.close(); io.close();
