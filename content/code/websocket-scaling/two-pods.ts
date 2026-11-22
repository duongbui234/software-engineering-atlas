// Hai "pod" Socket.IO trong cùng một tiến trình: phát tin không có adapter và có
// Redis adapter, polling không có sticky session, hai kiểu ngắt kết nối,
// và vì sao thời gian chờ kết nối lại phải có jitter.
// Chạy:
//   docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//   npm i socket.io socket.io-client @socket.io/redis-adapter redis && node two-pods.ts
import http from 'node:http';
import { Server } from 'socket.io';
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const once = <T>(s: ClientSocket, ev: string) => new Promise<T>((r) => s.once(ev, r as never));
const redisClients: ReturnType<typeof createClient>[] = [];

async function pod(withRedis: boolean) {
  const httpServer = http.createServer();
  const io = new Server(httpServer);
  if (withRedis) {
    // mỗi pod hai kết nối riêng: một để PUBLISH, một ở chế độ SUBSCRIBE
    const pub = createClient({ url: 'redis://localhost:6380' });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    redisClients.push(pub, sub);
    io.adapter(createAdapter(pub, sub));
  }
  io.of('/flash-sale').on('connection', (s) => {
    s.on('subscribe_campaign', (cid: string, ack: () => void) => { s.join(`campaign:${cid}`); ack(); });
  });
  await new Promise<void>((r) => httpServer.listen(0, r));
  return { io, httpServer, url: `http://localhost:${(httpServer.address() as { port: number }).port}` };
}

async function broadcast(withRedis: boolean) {
  const p1 = await pod(withRedis), p2 = await pod(withRedis);
  const a = ioc(`${p1.url}/flash-sale`, { transports: ['websocket'] }); // load balancer đưa A vào pod 1
  const b = ioc(`${p2.url}/flash-sale`, { transports: ['websocket'] }); // và B vào pod 2
  await Promise.all([once(a, 'connect'), once(b, 'connect')]);
  await Promise.all([a, b].map((c) => c.emitWithAck('subscribe_campaign', 'c-21h')));
  const got: string[] = [];
  a.on('stock_update', () => got.push('A (pod 1)'));
  b.on('stock_update', () => got.push('B (pod 2)'));
  p1.io.of('/flash-sale').to('campaign:c-21h').emit('stock_update', { left: 12 }); // worker chạy ở pod 1
  await sleep(300);
  a.close(); b.close(); p1.io.close(); p2.io.close();
  return got.join(', ') || '(không ai)';
}

console.log('1) Worker ở pod 1 phát stock_update cho phòng campaign:c-21h');
console.log(`   không có adapter: ${await broadcast(false)}`);
console.log(`   Redis adapter:    ${await broadcast(true)}`);

console.log('\n2) Long polling không có sticky session');
{
  const p1 = await pod(false), p2 = await pod(false);
  const open = await (await fetch(`${p1.url}/socket.io/?EIO=4&transport=polling`)).text();
  const { sid } = JSON.parse(open.slice(1));
  console.log(`   request 1 → pod 1: bắt tay, sid=${sid}`);
  const r = await fetch(`${p2.url}/socket.io/?EIO=4&transport=polling&sid=${sid}`);
  console.log(`   request 2 → pod 2: HTTP ${r.status} ${await r.text()}`);
  const r1 = await fetch(`${p1.url}/socket.io/?EIO=4&transport=polling&sid=${sid}`, { method: 'POST', body: '40/flash-sale,' });
  console.log(`   cùng request đó tới đúng pod 1: HTTP ${r1.status} ${await r1.text()}`);
  p1.io.close(); p2.io.close();
}

console.log('\n3) Hai kiểu ngắt kết nối từ phía server');
for (const how of ['socket.disconnect(true)', 'io.close() khi pod tắt']) {
  const p = await pod(false);
  const c = ioc(`${p.url}/flash-sale`, { transports: ['websocket'], reconnectionDelay: 100, reconnectionAttempts: 2 });
  await once(c, 'connect');
  let attempts = 0;
  c.io.on('reconnect_attempt', () => attempts++);
  if (how.startsWith('socket')) for (const s of await p.io.of('/flash-sale').fetchSockets()) s.disconnect(true);
  else { p.io.close(); p.httpServer.closeAllConnections(); }
  const reason = await once<string>(c, 'disconnect');
  await sleep(500);
  console.log(`   ${how.padEnd(26)} → client thấy "${reason}", số lần tự thử lại: ${attempts}`);
  c.close(); p.io.close();
}

console.log('\n4) Pod tắt, 10.000 client cùng mất kết nối: lần thử lại đầu tiên rơi vào đâu?');
// cùng công thức với socket.io-client (contrib/backo2): min 1000 ms, jitter = randomizationFactor
function firstDelay(jitter: number) {
  const ms = 1000, rand = Math.random();
  const dev = Math.floor(rand * jitter * ms);
  return (Math.floor(rand * 10) & 1) === 0 ? ms - dev : ms + dev;
}
for (const jitter of [0, 0.5]) {
  const buckets = new Map<number, number>();
  for (let i = 0; i < 10_000; i++) {
    const b = Math.floor(firstDelay(jitter) / 100);
    buckets.set(b, (buckets.get(b) ?? 0) + 1);
  }
  const peak = Math.max(...buckets.values());
  console.log(`   randomizationFactor ${String(jitter).padEnd(3)}: trải trên ${buckets.size} khung 100 ms, khung đông nhất ${peak} kết nối`);
}

await Promise.all(redisClients.map((c) => c.quit()));
