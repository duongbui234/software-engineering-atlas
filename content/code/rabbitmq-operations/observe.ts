// Đọc "đồng hồ đo" của một queue khi consumer chậm hơn producer.
// Producer gửi 200 tin/giây trong 4 giây; consumer xử lý ~50 tin/giây (20 tin song song, mỗi tin 400ms).
// Mỗi giây in ra: ready (tin đang chờ trong queue, hỏi broker bằng queue.declare passive)
// và unacked (tin consumer đã nhận nhưng chưa ack, đếm phía client).
// Chạy: docker run -d --rm --name atlas-rabbit -p 5673:5672 rabbitmq:4-management
//       npm i amqplib && node observe.ts
import amqp from 'amqplib';

const Q = 'demo.observe';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const pub = await conn.createChannel();
await pub.deleteQueue(Q);
await pub.assertQueue(Q, { durable: true });

// Consumer chậm: mỗi tin 400ms, giữ tối đa 20 tin chưa ack cùng lúc → ~50 tin/giây
const sub = await conn.createChannel();
await sub.prefetch(20);
let acked = 0;
let inflight = 0;
let stopping = false;
await sub.consume(Q, async (m) => {
  if (!m) return;
  inflight++;
  await sleep(400);
  if (stopping) return;
  sub.ack(m);
  inflight--;
  acked++;
});

// Producer nhanh: 200 tin/giây trong 4 giây, rồi dừng
let sent = 0;
const timer = setInterval(() => {
  for (let i = 0; i < 20; i++) { pub.sendToQueue(Q, Buffer.from('x'), { persistent: true }); sent++; }
}, 100);
setTimeout(() => clearInterval(timer), 4000);

console.log(' giây | đã gửi | đã ack | ready | unacked');
for (let s = 1; s <= 16; s++) {
  await sleep(1000);
  const { messageCount: ready } = await pub.checkQueue(Q); // số tin ready, theo thời gian thực
  console.log(`  ${String(s).padStart(2)}  |  ${String(sent).padStart(4)}  |  ${String(acked).padStart(4)}  | ${String(ready).padStart(5)} | ${String(inflight).padStart(5)}`);
  if (sent > 0 && acked === sent) break;
}
stopping = true;
await pub.deleteQueue(Q);
await conn.close();
