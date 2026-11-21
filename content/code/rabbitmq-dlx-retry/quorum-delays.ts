// RabbitMQ 4.3+/4.4+: quorum queue tự làm "retry có độ trễ" và "giao tin hẹn giờ", không cần plugin.
//  - 4.3: x-delayed-retry-type/min/max: tin bị trả lại phải chờ min(min*delivery_count, max) ms
//  - 4.4: header x-opt-delivery-time (epoch ms, kiểu long): tin vào queue ngay nhưng chỉ được giao đúng giờ
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createChannel();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t0 = Date.now(); const at = () => `+${String(Date.now() - t0).padStart(4)}ms`;

const RQ = 'demo.qq.delayed-retry';
await ch.deleteQueue(RQ);
await ch.assertQueue(RQ, { durable: true, arguments: {
  'x-queue-type': 'quorum', 'x-delayed-retry-type': 'all', 'x-delayed-retry-min': 300, 'x-delayed-retry-max': 1000 } });
let n = 0; let done = false;
const c = await conn.createChannel();
await c.consume(RQ, (m) => {
  if (!m) return; n++;
  console.log(`${at()} delayed-retry: lần ${n}, x-delivery-count=${m.properties.headers?.['x-delivery-count'] ?? '-'}`);
  if (n < 4) c.reject(m, true); else { c.ack(m); done = true; }
});
ch.sendToQueue(RQ, Buffer.from('x'));
while (!done) await sleep(20);
await c.close();

const DQ = 'demo.qq.delivery-time';
await ch.deleteQueue(DQ);
await ch.assertQueue(DQ, { durable: true, arguments: { 'x-queue-type': 'quorum' } });
const c2 = await conn.createChannel();
let got = false;
await c2.consume(DQ, (m) => { if (!m) return; console.log(`${at()} nhận tin hẹn giờ: ${m.content}`); c2.ack(m); got = true; });
console.log(`${at()} gửi tin hẹn giao sau 800ms`);
ch.sendToQueue(DQ, Buffer.from('nhac-thanh-toan'), { headers: { 'x-opt-delivery-time': { '!': 'long', value: Date.now() + 800 } } });
const deadline = Date.now() + 3000;
while (!got && Date.now() < deadline) await sleep(20);
if (!got) console.log('không nhận được trong 3s');
await ch.deleteQueue(RQ); await ch.deleteQueue(DQ);
await conn.close();
