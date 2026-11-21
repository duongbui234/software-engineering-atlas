// Ba tính năng nhỏ: priority queue, single active consumer, per-message TTL (expiration).
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createChannel();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// 1) Priority queue (classic, x-max-priority=5): tin ưu tiên cao ra trước khi đang có hàng đợi tồn
const PQ = 'demo.prio';
await ch.deleteQueue(PQ);
await ch.assertQueue(PQ, { durable: true, maxPriority: 5 });
[['thuong-1', 0], ['thuong-2', 0], ['VIP', 5], ['thuong-3', 0], ['uu-tien-vua', 2]].forEach(([b, p]) =>
  ch.sendToQueue(PQ, Buffer.from(String(b)), { priority: Number(p) }));
await sleep(200);
const order: string[] = []; let m;
while ((m = await ch.get(PQ, { noAck: true }))) order.push(m.content.toString());
console.log('priority queue lấy ra theo thứ tự:', order.join(' > '));

// 2) Single active consumer: 2 consumer đăng ký, chỉ 1 nhận; consumer đó hủy thì cái kia lên thay
const SQ = 'demo.sac';
await ch.deleteQueue(SQ);
await ch.assertQueue(SQ, { durable: true, arguments: { 'x-single-active-consumer': true } });
const seen: string[] = [];
const c1 = await conn.createChannel(); const c2 = await conn.createChannel();
const t1 = await c1.consume(SQ, (x) => { if (x) { seen.push(`c1:${x.content}`); c1.ack(x); } });
await c2.consume(SQ, (x) => { if (x) { seen.push(`c2:${x.content}`); c2.ack(x); } });
for (const i of [1, 2, 3]) ch.sendToQueue(SQ, Buffer.from(`m${i}`));
await sleep(300);
await c1.cancel(t1.consumerTag);
for (const i of [4, 5]) ch.sendToQueue(SQ, Buffer.from(`m${i}`));
await sleep(300);
console.log('single active consumer:', seen.join(', '));

// 3) Per-message TTL: tin hết hạn trong queue không có consumer
const TQ = 'demo.ttl';
await ch.deleteQueue(TQ);
await ch.assertQueue(TQ, { durable: true });
ch.sendToQueue(TQ, Buffer.from('song-lau'));
ch.sendToQueue(TQ, Buffer.from('het-han-200ms'), { expiration: '200' });
await sleep(400);
const left: string[] = [];
while ((m = await ch.get(TQ, { noAck: true }))) left.push(m.content.toString());
console.log('sau 400ms, queue TTL còn:', left.join(', '));

for (const q of [PQ, SQ, TQ]) await ch.deleteQueue(q);
await conn.close();
