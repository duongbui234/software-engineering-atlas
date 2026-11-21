// RPC qua RabbitMQ với Direct Reply-to: client gửi request kèm replyTo='amq.rabbitmq.reply-to'
// và correlationId; server trả lời vào default exchange với routing key = replyTo.
// Client phải consume 'amq.rabbitmq.reply-to' với noAck=true TRƯỚC khi publish.
import amqp from 'amqplib';
import { randomUUID } from 'node:crypto';
const conn = await amqp.connect('amqp://guest:guest@localhost:5673');
const Q = 'demo.rpc.price';
const server = await conn.createChannel();
await server.deleteQueue(Q);
await server.assertQueue(Q, { durable: true });
await server.consume(Q, (msg) => {
  if (!msg) return;
  const { sku } = JSON.parse(msg.content.toString());
  const price = sku === 'AO-THUN' ? 99000 : 0;
  server.publish('', msg.properties.replyTo, Buffer.from(JSON.stringify({ sku, price })), { correlationId: msg.properties.correlationId });
  server.ack(msg);
});

const client = await conn.createChannel();
const pending = new Map<string, (v: string) => void>();
await client.consume('amq.rabbitmq.reply-to', (msg) => {
  if (!msg) return;
  pending.get(msg.properties.correlationId)?.(msg.content.toString());
  pending.delete(msg.properties.correlationId);
}, { noAck: true });
async function call(sku: string) {
  const id = randomUUID();
  const p = new Promise<string>((res, rej) => { pending.set(id, res); setTimeout(() => rej(new Error('timeout')), 2000); });
  client.sendToQueue(Q, Buffer.from(JSON.stringify({ sku })), { replyTo: 'amq.rabbitmq.reply-to', correlationId: id });
  return p;
}
const t = performance.now();
console.log(await call('AO-THUN'), `(${(performance.now() - t).toFixed(1)} ms)`);
console.log(await call('KHONG-CO'));
await server.deleteQueue(Q);
await conn.close();
