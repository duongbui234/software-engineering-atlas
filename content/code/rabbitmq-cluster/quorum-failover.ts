// Quorum queue trên cụm 3 node: mất 1 node vẫn chạy, mất 2 node thì ngừng nhận tin.
// Chuẩn bị: docker compose -p atlas-cluster up -d   (compose.yaml cùng thư mục, chờ ~30 giây)
// Chạy:     npm i amqplib && node quorum-failover.ts
// Dọn:      docker compose -p atlas-cluster down
import amqp from 'amqplib';
import { execSync } from 'node:child_process';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const docker = (cmd: string) => execSync(`docker ${cmd}`, { stdio: 'pipe' }).toString();
const node = (n: number) => `atlas-cluster-rmq${n}-1`;
const Q = 'demo.qq.orders';

function leader(): string {
  const out = docker(`exec ${node(1)} rabbitmqctl list_queues name leader online --formatter json -q`);
  const q = (JSON.parse(out) as Array<{ name: string; leader: string; online: string[] }>).find((x) => x.name === Q);
  return q ? `leader=${q.leader}, đang sống=${q.online.join(', ')}` : '(không đọc được)';
}

// Gửi một tin và chờ broker xác nhận tối đa `ms` mili giây.
function publish(ch: amqp.ConfirmChannel, body: string, ms: number): Promise<string> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(`${body}: CHƯA được xác nhận sau ${ms}ms`), ms);
    ch.sendToQueue(Q, Buffer.from(body), { persistent: true }, (err) => {
      clearTimeout(timer);
      resolve(`${body}: ${err ? 'bị từ chối (nack)' : 'đã xác nhận (ack)'}`);
    });
  });
}

const conn = await amqp.connect('amqp://guest:guest@localhost:5674'); // nối vào rmq1, node này không bị tắt
const ch = await conn.createConfirmChannel();
await ch.deleteQueue(Q);
await ch.assertQueue(Q, { durable: true, arguments: { 'x-queue-type': 'quorum', 'x-quorum-initial-group-size': 3 } });
await sleep(1000);
console.log('0) quorum queue 3 bản sao:', leader());
console.log('  ', await publish(ch, 'don-1', 3000));

docker(`stop ${node(3)}`);
await sleep(3000);
console.log('1) tắt rmq3, còn 2/3 node (vẫn là đa số):', leader());
console.log('  ', await publish(ch, 'don-2', 3000));

docker(`stop ${node(2)}`);
await sleep(3000);
console.log('2) tắt thêm rmq2, còn 1/3 node (mất đa số)');
const pending = publish(ch, 'don-3', 30000);
console.log('  ', await Promise.race([pending, sleep(5000).then(() => 'don-3: sau 5 giây vẫn chưa có xác nhận, publisher phải chờ')]));

docker(`start ${node(2)}`);
console.log('3) bật lại rmq2, có lại đa số...');
console.log('  ', await pending);
await sleep(2000);
console.log('   số tin trong queue:', (await ch.checkQueue(Q)).messageCount, '|', leader());

docker(`start ${node(3)}`);
await sleep(8000);
console.log('4) bật lại rmq3:', leader());
await ch.deleteQueue(Q);
await conn.close();
