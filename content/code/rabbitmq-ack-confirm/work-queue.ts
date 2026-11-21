// Work queue: 2 worker cạnh tranh, ack thủ công, prefetch 1.
// Worker "chậm" mất 300ms/việc, worker "nhanh" 50ms. Với prefetch=1 broker
// chỉ giao việc mới khi worker đã ack việc cũ → worker nhanh làm nhiều hơn.
// Phần 2: worker nhận việc rồi "chết" (đóng channel) trước khi ack → việc được giao lại (redelivered=true).
import amqp from 'amqplib';
const URL = 'amqp://guest:guest@localhost:5673';
const Q = 'demo.work';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const conn = await amqp.connect(URL);
const pub = await conn.createChannel();
await pub.deleteQueue(Q);
await pub.assertQueue(Q, { durable: true });

const count: Record<string, number> = { cham: 0, nhanh: 0 };
async function worker(name: 'cham' | 'nhanh', ms: number) {
  const ch = await conn.createChannel();
  const pf = Number(process.env.PREFETCH ?? 1);
  if (pf > 0) await ch.prefetch(pf); // tối đa pf tin chưa ack trên consumer này (0 = không giới hạn)
  await ch.consume(Q, async (msg) => {
    if (!msg) return;
    await sleep(ms);
    count[name]++;
    ch.ack(msg);
  }, { noAck: false });
  return ch;
}
const c1 = await worker('cham', 300);
const c2 = await worker('nhanh', 50);
for (let i = 1; i <= 20; i++) pub.sendToQueue(Q, Buffer.from(`viec-${i}`), { persistent: true });
while (count.cham + count.nhanh < 20) await sleep(50);
console.log(`prefetch=${process.env.PREFETCH ?? 1}, 20 việc ->`, count);
await c1.close(); await c2.close();

// Phần 2: consumer nhận nhưng không ack, rồi chết
const crash = await conn.createChannel();
await crash.prefetch(1);
pub.sendToQueue(Q, Buffer.from('viec-quan-trong'), { persistent: true });
await new Promise<void>((resolve) => {
  crash.consume(Q, (msg) => {
    console.log('worker A nhận:', msg!.content.toString(), 'redelivered =', msg!.fields.redelivered);
    resolve(); // không ack!
  });
});
await crash.close(); // channel đóng → tin chưa ack quay lại hàng
const again = await pub.get(Q, { noAck: false });
if (again) {
  console.log('worker B nhận lại:', again.content.toString(), 'redelivered =', again.fields.redelivered);
  pub.ack(again);
}
await pub.deleteQueue(Q);
await conn.close();
