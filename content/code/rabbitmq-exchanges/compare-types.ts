// So sánh bốn kiểu exchange chuẩn trên cùng một bộ tin.
// Mỗi kiểu có ba queue: email, hoàn kho, audit. Cả bốn lần gửi đúng 4 tin giống nhau,
// chỉ khác kiểu exchange và cách bind, rồi in xem mỗi queue nhận gì.
// Chạy: docker run -d --rm --name atlas-rabbit -p 5673:5672 rabbitmq:4-management
//       npm i amqplib && node compare-types.ts
import amqp from 'amqplib';

const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createConfirmChannel();

// 4 tin: routing key + headers (headers exchange chỉ đọc headers)
const messages: Array<{ key: string; headers: Record<string, string> }> = [
  { key: 'order.placed', headers: { entity: 'order', action: 'placed' } },
  { key: 'order.cancelled', headers: { entity: 'order', action: 'cancelled' } },
  { key: 'refund.cancelled', headers: { entity: 'refund', action: 'cancelled' } },
  { key: 'payment.paid', headers: { entity: 'payment', action: 'paid' } },
];

type Bind = { queue: string; key?: string; args?: Record<string, string> };
const setups: Array<{ type: string; binds: Bind[] }> = [
  {
    type: 'direct', // khớp nguyên văn: muốn nhận 2 khóa thì bind 2 lần
    binds: [
      { queue: 'email', key: 'order.placed' },
      { queue: 'email', key: 'payment.paid' },
      { queue: 'hoan-kho', key: 'order.cancelled' },
      { queue: 'audit', key: 'order.placed' }, // audit muốn "tất cả": phải liệt kê từng khóa
    ],
  },
  {
    type: 'fanout', // bỏ qua key: ai bind cũng nhận hết
    binds: [{ queue: 'email' }, { queue: 'hoan-kho' }, { queue: 'audit' }],
  },
  {
    type: 'topic', // khớp theo mẫu
    binds: [
      { queue: 'email', key: 'order.placed' },
      { queue: 'email', key: 'payment.paid' },
      { queue: 'hoan-kho', key: '*.cancelled' },
      { queue: 'audit', key: '#' },
    ],
  },
  {
    type: 'headers', // bỏ qua key, so headers
    binds: [
      { queue: 'email', args: { 'x-match': 'any', action: 'placed', entity: 'payment' } },
      { queue: 'hoan-kho', args: { 'x-match': 'all', action: 'cancelled' } },
      { queue: 'audit', args: { 'x-match': 'all' } }, // all mà không có điều kiện nào: khớp mọi tin
    ],
  },
];

for (const { type, binds } of setups) {
  const ex = `demo.cmp.${type}`;
  await ch.deleteExchange(ex);
  await ch.assertExchange(ex, type, { durable: false });
  const queues = [...new Set(binds.map((b) => b.queue))];
  for (const q of queues) {
    await ch.deleteQueue(`demo.cmp.${type}.${q}`);
    await ch.assertQueue(`demo.cmp.${type}.${q}`, { durable: true });
  }
  for (const b of binds) await ch.bindQueue(`demo.cmp.${type}.${b.queue}`, ex, b.key ?? '', b.args);

  for (const m of messages) ch.publish(ex, m.key, Buffer.from(m.key), { headers: m.headers });
  await ch.waitForConfirms();

  console.log(`\n${type.toUpperCase()}`);
  for (const q of queues) {
    const got: string[] = [];
    let msg;
    while ((msg = await ch.get(`demo.cmp.${type}.${q}`, { noAck: true }))) got.push(msg.content.toString());
    console.log(`  ${q.padEnd(9)} <- ${got.join(', ') || '(không có)'}`);
    await ch.deleteQueue(`demo.cmp.${type}.${q}`);
  }
  await ch.deleteExchange(ex);
}
await conn.close();
