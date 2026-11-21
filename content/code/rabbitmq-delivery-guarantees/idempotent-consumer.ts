// Consumer idempotent: RabbitMQ giao "ít nhất một lần", nên cùng một sự kiện có thể tới 2 lần
// (publisher gửi lại sau khi mất confirm, hoặc consumer chết trước khi ack).
// Ta ghi event_id vào bảng "đã xử lý" CÙNG giao dịch với việc nghiệp vụ; lần sau gặp lại thì bỏ qua.
// "DB" ở đây là Map trong bộ nhớ để ví dụ chạy độc lập.
import amqp from 'amqplib';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const ch = await conn.createConfirmChannel();
const Q = 'demo.idem';
await ch.deleteQueue(Q);
await ch.assertQueue(Q, { durable: true });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const db = { processed: new Set<string>(), stock: 100 };
function transaction(fn: (tx: typeof db) => void) { // giả lập: lỗi thì không đổi gì
  const snap = { processed: new Set(db.processed), stock: db.stock };
  try { fn(snap); db.processed = snap.processed; db.stock = snap.stock; } catch (e) { throw e; }
}

let crashOnce = true;
async function startConsumer(label: string) {
  const c = await conn.createChannel();
  await c.prefetch(1);
  await c.consume(Q, (msg) => {
    if (!msg) return;
    const id = msg.properties.messageId as string;
    const { qty } = JSON.parse(msg.content.toString());
    let skipped = false;
    transaction((tx) => {
      if (tx.processed.has(id)) { skipped = true; return; }
      tx.processed.add(id);
      tx.stock -= qty;
    });
    console.log(`[${label}] ${id} redelivered=${msg.fields.redelivered} → ${skipped ? 'ĐÃ XỬ LÝ, bỏ qua' : `trừ kho ${qty}`}; kho còn ${db.stock}`);
    if (label === 'A' && crashOnce) { crashOnce = false; c.close(); return; } // chết sau khi commit, trước khi ack
    c.ack(msg);
  });
}
await startConsumer('A');
const send = (id: string, qty: number) => ch.sendToQueue(Q, Buffer.from(JSON.stringify({ qty })), { messageId: id, persistent: true });
send('evt-1', 2);
send('evt-1', 2); // publisher gửi lại (ví dụ outbox chưa kịp đánh dấu PUBLISHED)
send('evt-2', 5);
await ch.waitForConfirms();
await sleep(300);
await startConsumer('B'); // consumer thay thế nhận lại tin A chưa ack
await sleep(500);
console.log('Kết quả cuối: kho =', db.stock, '(đúng phải là 100 - 2 - 5 = 93)');
await ch.deleteQueue(Q);
await conn.close();
