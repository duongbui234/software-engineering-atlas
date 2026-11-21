// Stream queue: tin KHÔNG bị xóa khi đọc; mỗi consumer chọn chỗ bắt đầu bằng x-stream-offset.
// Qua AMQP 0-9-1: phải đặt prefetch và ack (ack chỉ để điều tiết, không xóa tin).
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createChannel();
const S = 'demo.stream.orders';
await ch.deleteQueue(S);
await ch.assertQueue(S, { durable: true, arguments: { 'x-queue-type': 'stream', 'x-max-age': '1D' } });
for (let i = 1; i <= 5; i++) ch.sendToQueue(S, Buffer.from(`don-${i}`));
await new Promise((r) => setTimeout(r, 300));

async function readFrom(label: string, offset: unknown) {
  const c = await conn.createChannel();
  await c.prefetch(10);
  const got: string[] = [];
  const { consumerTag } = await c.consume(S, (m) => { if (m) { got.push(`${m.content}@${m.properties.headers?.['x-stream-offset']}`); c.ack(m); } },
    { noAck: false, arguments: { 'x-stream-offset': offset } });
  await new Promise((r) => setTimeout(r, 400));
  await c.cancel(consumerTag); await c.close();
  console.log(label.padEnd(26), '->', got.join(', ') || '(chưa có gì)');
}
await readFrom("offset='first'", 'first');
await readFrom('offset=3 (số thứ tự)', 3);
await readFrom("offset='last' (chunk cuối)", 'last');
await readFrom("offset='next' (chỉ tin mới)", 'next');
await readFrom("đọc lại 'first' lần nữa", 'first');
await ch.deleteQueue(S);
await conn.close();
