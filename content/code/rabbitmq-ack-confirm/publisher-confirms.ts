// Publisher confirms: broker trả ack (đã nhận trách nhiệm) hoặc nack (không nhận) cho từng tin.
// Phần 1: so sánh chờ confirm từng tin vs gửi cả lô rồi chờ một lần.
// Phần 2: queue giới hạn 3 tin + overflow=reject-publish → tin thứ 4, 5 bị nack.
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createConfirmChannel();
const Q = 'demo.confirms';
await ch.deleteQueue(Q);
await ch.assertQueue(Q, { durable: true });
const N = 2000;

let t = performance.now();
for (let i = 0; i < N; i++) {
  ch.sendToQueue(Q, Buffer.from(`m${i}`), { persistent: true });
  await ch.waitForConfirms(); // chờ từng tin
}
console.log(`chờ từng tin : ${N} tin trong ${(performance.now() - t).toFixed(0)} ms`);

t = performance.now();
for (let i = 0; i < N; i++) ch.sendToQueue(Q, Buffer.from(`m${i}`), { persistent: true });
await ch.waitForConfirms(); // chờ cả lô
console.log(`chờ theo lô  : ${N} tin trong ${(performance.now() - t).toFixed(0)} ms`);
await ch.deleteQueue(Q);

const QL = 'demo.confirms.limited';
await ch.deleteQueue(QL);
await ch.assertQueue(QL, { durable: true, arguments: { 'x-max-length': 3, 'x-overflow': 'reject-publish' } });
const results = await Promise.all([1, 2, 3, 4, 5].map((i) => new Promise<string>((resolve) => {
  ch.sendToQueue(QL, Buffer.from(`don-${i}`), { persistent: true }, (err) => resolve(`don-${i}: ${err ? 'NACK' : 'ack'}`));
})));
console.log(results.join(' | '));
const info = await ch.checkQueue(QL);
console.log('messageCount trong queue =', info.messageCount);
await ch.deleteQueue(QL);
await conn.close();
