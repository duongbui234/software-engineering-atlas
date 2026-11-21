// Vì sao cần hàng đợi: bên gửi không phải chờ bên nhận.
// 1) Bên nhận đang "sập" (chưa chạy). Bên gửi vẫn gửi xong 5 đơn trong vài mili giây.
// 2) Bên nhận sống lại, xử lý từ từ (200ms/đơn) theo tốc độ của nó.
// So sánh: nếu gọi thẳng (đồng bộ) thì bên gửi phải chờ 5 × 200ms, và thất bại ngay khi bên nhận sập.
// Chạy: docker run -d --rm --name atlas-rabbit -p 5673:5672 rabbitmq:4-management
//       npm i amqplib && node buffering.ts
import amqp from 'amqplib';

const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createConfirmChannel();
const Q = 'demo.orders.to-email';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t0 = performance.now();
const at = () => `+${(performance.now() - t0).toFixed(0).padStart(4)}ms`;

await ch.deleteQueue(Q);
await ch.assertQueue(Q, { durable: true });

// --- Bên gửi: dịch vụ đặt hàng. Bên nhận (gửi email) chưa chạy.
for (let i = 1; i <= 5; i++) {
  ch.sendToQueue(Q, Buffer.from(`don-${i}`), { persistent: true });
}
await ch.waitForConfirms(); // broker xác nhận đã nhận giữ cả 5 tin
console.log(`${at()} bên gửi: đã giao 5 đơn cho broker, đi làm việc khác`);
console.log(`${at()} trong hàng đang chờ:`, (await ch.checkQueue(Q)).messageCount, 'tin');

// --- Một lúc sau bên nhận mới chạy và xử lý theo tốc độ của nó.
await sleep(500);
console.log(`${at()} bên nhận (gửi email) bắt đầu chạy`);
const worker = await conn.createChannel();
await worker.prefetch(1);
let done = 0;
await worker.consume(Q, async (msg) => {
  if (!msg) return;
  await sleep(200); // gửi email mất 200ms
  worker.ack(msg);
  done++;
  console.log(`${at()} bên nhận: đã gửi email cho ${msg.content}`);
});
while (done < 5) await sleep(20);

await ch.deleteQueue(Q);
await conn.close();
