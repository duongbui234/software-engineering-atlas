// Mô hình AMQP 0-9-1 qua code: connection, channel, exchange, queue, binding, routing key.
// 1) Khai báo tường minh: exchange "buu-dien" → binding "thu.hcm" → queue "hoc-thu-hcm".
// 2) sendToQueue thật ra là publish vào default exchange ("") với routing key = tên queue.
// 3) Lỗi "mềm" (publish vào exchange không tồn tại) chỉ đóng channel, connection vẫn sống.
// 4) Khai báo lại queue với thuộc tính khác → 406 PRECONDITION_FAILED, cũng chỉ đóng channel.
// Chạy: docker run -d --rm --name atlas-rabbit -p 5673:5672 rabbitmq:4-management
//       npm i amqplib && node model.ts
import amqp from 'amqplib';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
// Một connection (một kết nối TCP) cho cả chương trình, đặt tên để dễ tìm trong management UI.
const conn = await amqp.connect('amqp://guest:guest@localhost:5673', {
  clientProperties: { connection_name: 'atlas-demo' },
});
const ch = await conn.createChannel(); // channel: "làn" logic bên trong connection

const EX = 'demo.buu-dien';
const Q = 'demo.hoc-thu-hcm';
await ch.deleteQueue(Q);
await ch.deleteExchange(EX);

// 1) Exchange + queue + binding
await ch.assertExchange(EX, 'direct', { durable: true });
await ch.assertQueue(Q, { durable: true });
await ch.bindQueue(Q, EX, 'thu.hcm'); // binding key
ch.publish(EX, 'thu.hcm', Buffer.from('thư gửi HCM'), {
  persistent: true,
  contentType: 'text/plain',
  messageId: 'thu-001',
  headers: { 'nguoi-gui': 'Hà Nội' },
}); // routing key
ch.publish(EX, 'thu.danang', Buffer.from('thư gửi Đà Nẵng')); // không binding nào khớp → mất im lặng
await sleep(200);
let m = await ch.get(Q, { noAck: true });
console.log('1) hộc thư HCM nhận:', m && m.content.toString(), '| routingKey =', m && m.fields.routingKey,
  '| exchange =', m && m.fields.exchange, '| messageId =', m && m.properties.messageId,
  '| header nguoi-gui =', m && m.properties.headers?.['nguoi-gui']);
console.log('   hộc thư HCM còn lại:', (await ch.checkQueue(Q)).messageCount, 'tin (thư Đà Nẵng không vào đâu cả)');

// 2) sendToQueue = default exchange
ch.sendToQueue(Q, Buffer.from('gửi thẳng tên hộc'));
ch.publish('', Q, Buffer.from('publish vào exchange "" với key = tên queue'));
await sleep(200);
while ((m = await ch.get(Q, { noAck: true }))) {
  console.log(`2) nhận: "${m.content}" qua exchange = "${m.fields.exchange}", routingKey = ${m.fields.routingKey}`);
}

// 3) Lỗi mềm: publish vào exchange không tồn tại
const ch2 = await conn.createChannel();
ch2.on('error', (e: Error) => console.log('3) channel 2 bị đóng:', e.message.split(' - ')[1] ?? e.message));
ch2.publish('khong-co-exchange-nay', 'x', Buffer.from('?'));
await sleep(200);
console.log('   connection vẫn sống? channel 1 vẫn dùng được:', (await ch.checkQueue(Q)).queue === Q);

// 4) Khai báo lại cùng tên nhưng khác thuộc tính
const ch3 = await conn.createChannel();
ch3.on('error', (e: Error) => console.log('4) channel 3 bị đóng:', e.message.split(' - ')[1]?.slice(0, 80) ?? e.message));
await ch3.assertQueue(Q, { durable: true, arguments: { 'x-max-length': 10 } }).catch(() => {});
await sleep(200);

await ch.deleteQueue(Q);
await ch.deleteExchange(EX);
await conn.close();
