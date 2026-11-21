// Retry có độ trễ bằng DLX + TTL, rồi "bãi đỗ" (parking lot) sau 3 lần thử.
//   work queue --nack(requeue=false)--> retry exchange --> retry queue (TTL 500ms, không consumer)
//   retry queue hết TTL --dead-letter--> work exchange --> work queue (thử lại)
//   sau 3 lần thất bại: consumer tự publish sang parking queue rồi ack.
// Phần 2: quorum queue với x-delivery-limit=2: chặn vòng requeue vô hạn (poison message), tin đi DLX.
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createChannel();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now();
const at = () => `+${String(Date.now() - t0).padStart(4)}ms`;

const names = ['demo.work.q', 'demo.retry.q', 'demo.parking.q', 'demo.quorum.q', 'demo.quorum.dlq'];
for (const q of names) await ch.deleteQueue(q);
for (const e of ['demo.work.x', 'demo.retry.x', 'demo.quorum.dlx']) await ch.deleteExchange(e);

await ch.assertExchange('demo.work.x', 'direct', { durable: true });
await ch.assertExchange('demo.retry.x', 'direct', { durable: true });
await ch.assertQueue('demo.work.q', { durable: true, deadLetterExchange: 'demo.retry.x' });
await ch.bindQueue('demo.work.q', 'demo.work.x', 'pay');
await ch.assertQueue('demo.retry.q', { durable: true, messageTtl: 500, deadLetterExchange: 'demo.work.x' });
await ch.bindQueue('demo.retry.q', 'demo.retry.x', 'pay');
await ch.assertQueue('demo.parking.q', { durable: true });

const MAX = 3;
let done = false;
await ch.consume('demo.work.q', (msg) => {
  if (!msg) return;
  const xdeath = (msg.properties.headers?.['x-death'] ?? []) as Array<{ queue: string; reason: string; count: number }>;
  const fromWork = xdeath.find((d) => d.queue === 'demo.work.q');
  const attempt = (fromWork?.count ?? 0) + 1;
  console.log(`${at()} lần thử ${attempt}: ${msg.content} (x-death: ${xdeath.map((d) => `${d.queue}/${d.reason}/${d.count}`).join(', ') || 'không có'})`);
  if (attempt >= MAX) {
    ch.sendToQueue('demo.parking.q', msg.content, { headers: msg.properties.headers, persistent: true });
    ch.ack(msg);
    console.log(`${at()} quá ${MAX} lần → chuyển sang parking queue`);
    done = true;
    return;
  }
  ch.nack(msg, false, false); // KHÔNG requeue → dead-letter sang retry exchange
});
ch.publish('demo.work.x', 'pay', Buffer.from('goi-cong-thanh-toan #42'), { persistent: true });
while (!done) await sleep(50);
await sleep(200);
console.log('parking queue có', (await ch.checkQueue('demo.parking.q')).messageCount, 'tin');

// Phần 2: quorum queue + delivery-limit
await ch.assertExchange('demo.quorum.dlx', 'fanout', { durable: true });
await ch.assertQueue('demo.quorum.dlq', { durable: true });
await ch.bindQueue('demo.quorum.dlq', 'demo.quorum.dlx', '');
await ch.assertQueue('demo.quorum.q', {
  durable: true,
  arguments: { 'x-queue-type': 'quorum', 'x-delivery-limit': 2, 'x-dead-letter-exchange': 'demo.quorum.dlx' },
});
const ch2 = await conn.createChannel();
let n = 0;
// RabbitMQ 4.3+: basic.nack(requeue) KHÔNG tính vào delivery-limit, basic.reject(requeue) CÓ tính.
// 5 lần đầu dùng nack, sau đó chuyển sang reject để thấy giới hạn có hiệu lực.
await ch2.consume('demo.quorum.q', (msg) => {
  if (!msg) return;
  n++;
  const h = msg.properties.headers ?? {};
  const how = n <= 5 ? 'nack' : 'reject';
  console.log(`quorum: lần giao ${n}, x-delivery-count=${h['x-delivery-count'] ?? '-'}, x-acquired-count=${h['x-acquired-count'] ?? '-'} → ${how}(requeue=true)`);
  if (how === 'nack') ch2.nack(msg, false, true); else ch2.reject(msg, true);
});
ch.sendToQueue('demo.quorum.q', Buffer.from('tin-doc'), { persistent: true });
await sleep(1500);
const dead = await ch.get('demo.quorum.dlq', { noAck: true });
console.log('DLQ của quorum nhận:', dead ? `${dead.content} (x-death reason = ${(dead.properties.headers?.['x-death'] as any)?.[0]?.reason})` : '(trống)');
await ch2.close();
for (const q of names) await ch.deleteQueue(q);
for (const e of ['demo.work.x', 'demo.retry.x', 'demo.quorum.dlx']) await ch.deleteExchange(e);
await conn.close();
