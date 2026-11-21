// Topic exchange: '*' khớp đúng 1 từ, '#' khớp 0..n từ.
// Thêm: tin không khớp binding nào → bị bỏ im lặng, trừ khi publish với mandatory (basic.return)
// hoặc exchange có alternate-exchange.
// Lưu ý RabbitMQ 4.x: queue durable:false mà không exclusive bị từ chối (feature transient_nonexcl_queues deprecated) → dùng durable:true.
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createChannel();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const EX = 'demo.orders';
const AE = 'demo.unrouted';
for (const q of ['q.placed-any', 'q.all-cancelled', 'q.audit-all', 'q.vn-anything', 'q.unrouted']) await ch.deleteQueue(q);
await ch.deleteExchange(EX); await ch.deleteExchange(AE);

await ch.assertExchange(AE, 'fanout', { durable: false });
await ch.assertExchange(EX, 'topic', { durable: false, alternateExchange: AE });
const bindings: Array<[string, string]> = [
  ['q.placed-any', 'order.placed'],
  ['q.all-cancelled', '*.cancelled'],
  ['q.audit-all', '#'],
  ['q.vn-anything', 'order.vn.#'],
];
for (const [q, key] of bindings) { await ch.assertQueue(q, { durable: true }); await ch.bindQueue(q, EX, key); }
await ch.assertQueue('q.unrouted', { durable: true }); await ch.bindQueue('q.unrouted', AE, '');

for (const key of ['order.placed', 'order.cancelled', 'refund.cancelled', 'order.vn.hcm.placed', 'order.vn', 'payment.paid'])
  ch.publish(EX, key, Buffer.from(key));
await sleep(300);
for (const [q] of [...bindings, ['q.unrouted', '(AE)'] as [string, string]]) {
  const got: string[] = [];
  let m; while ((m = await ch.get(q, { noAck: true }))) got.push(m.content.toString());
  console.log(q.padEnd(16), (bindings.find((b) => b[0] === q)?.[1] ?? 'alternate-exch').padEnd(14), '->', got.join(', '));
}

// Gỡ binding '#' rồi gửi lại một khóa không ai nghe → rơi sang alternate exchange
await ch.unbindQueue('q.audit-all', EX, '#');
ch.publish(EX, 'payment.paid', Buffer.from('payment.paid (lần 2)'));
await sleep(300);
const lost = await ch.get('q.unrouted', { noAck: true });
console.log("sau khi gỡ '#': q.unrouted nhận ->", lost ? lost.content.toString() : '(trống)');

// mandatory + basic.return trên exchange KHÔNG có AE
await ch.assertExchange('demo.direct', 'direct', { durable: false });
ch.on('return', (msg) => console.log('basic.return:', msg.fields.replyCode, msg.fields.replyText, 'key =', msg.fields.routingKey));
ch.publish('demo.direct', 'khong-ai-nghe', Buffer.from('x'), { mandatory: true });
ch.publish('demo.direct', 'khong-ai-nghe-2', Buffer.from('x')); // không mandatory → mất im lặng
await sleep(300);
await ch.deleteExchange('demo.direct');
for (const q of ['q.placed-any', 'q.all-cancelled', 'q.audit-all', 'q.vn-anything', 'q.unrouted']) await ch.deleteQueue(q);
await ch.deleteExchange(EX); await ch.deleteExchange(AE);
await conn.close();
