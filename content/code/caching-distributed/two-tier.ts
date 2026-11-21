// Cache trên nhiều máy: hai tầng (L1 trong RAM + L2 Redis), báo hủy qua Pub/Sub,
// Redis client-side caching, và chia key cho nhiều node.
// Chạy: docker run -d --rm --name atlas-redis -p 6380:6379 redis:8
//       npm i ioredis && node two-tier.ts
import Redis from 'ioredis';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const CHANNEL = 'cache:invalidate';
const db = new Map<string, string>([['flag:new-checkout', 'off']]); // nguồn sự thật

// Một "pod" của ứng dụng: L1 = Map trong RAM, L2 = Redis dùng chung, nghe kênh báo hủy
class Pod {
  name: string; l1 = new Map<string, { v: string; until: number }>();
  redis = new Redis(6380); sub = new Redis(6380); l1TtlMs: number;
  constructor(name: string, l1TtlMs = Infinity) { this.name = name; this.l1TtlMs = l1TtlMs; }
  async start() {
    await this.sub.subscribe(CHANNEL);
    this.sub.on('message', (_c, key) => this.l1.delete(key));
  }
  async get(key: string) {
    const e = this.l1.get(key);
    if (e && e.until > Date.now()) return `${e.v} (L1)`;
    let v = await this.redis.get(key), from = 'L2';
    if (v === null) { v = db.get(key)!; from = 'DB'; await this.redis.set(key, v, 'EX', 60); }
    this.l1.set(key, { v, until: Date.now() + this.l1TtlMs });
    return `${v} (${from})`;
  }
  async write(key: string, v: string) {
    db.set(key, v);
    this.l1.delete(key);
    await this.redis.del(key);
    await this.redis.publish(CHANNEL, key); // báo các pod khác bỏ L1
  }
  async stop() { this.redis.disconnect(); this.sub.disconnect(); }
}

const K = 'flag:new-checkout';
const admin = new Redis(6380);
await admin.flushall();

console.log('1) Hai pod, L1 không có TTL, báo hủy qua Pub/Sub');
let a = new Pod('A'), b = new Pod('B');
await a.start(); await b.start();
console.log(`   B đọc: ${await b.get(K)}, B đọc lại: ${await b.get(K)}`);
await a.write(K, 'on'); await sleep(50);
console.log(`   A bật cờ "on" và publish → B đọc: ${await b.get(K)}`);

console.log('2) Kết nối Pub/Sub của B rớt đúng lúc A ghi (tin Pub/Sub không được lưu lại)');
await b.sub.unsubscribe(CHANNEL);           // giả lập rớt mạng: B không nhận tin nào
await a.write(K, 'off'); await sleep(50);
await b.sub.subscribe(CHANNEL);              // B nối lại, nhưng tin đã trôi qua
await sleep(3000);
console.log(`   3 giây sau, DB = off, B đọc: ${await b.get(K)} ← sai mãi tới khi B khởi động lại`);
await a.stop(); await b.stop();

console.log('3) Cùng sự cố, nhưng L1 có TTL 2 giây làm lưới an toàn');
await admin.flushall(); db.set(K, 'on');
a = new Pod('A', 2000); b = new Pod('B', 2000);
await a.start(); await b.start();
await b.get(K);
await b.sub.unsubscribe(CHANNEL);
await a.write(K, 'off'); await sleep(50);
console.log(`   ngay sau khi A ghi: B đọc ${await b.get(K)}`);
await sleep(2100);
console.log(`   2 giây sau: B đọc ${await b.get(K)} ← tự đúng lại khi L1 hết hạn`);
await a.stop(); await b.stop();

console.log('4) Redis client-side caching: Redis tự nhớ client đã đọc key nào và báo khi key đổi');
const tracked = new Redis(6380), inbox = new Redis(6380), other = new Redis(6380);
const inboxId = await inbox.client('ID');
await inbox.subscribe('__redis__:invalidate');
inbox.on('message', (_c, keys) => console.log(`   tin báo hủy gửi tới client: ${keys}`));
await tracked.call('CLIENT', 'TRACKING', 'on', 'REDIRECT', String(inboxId));
await other.set('price:42', '199000');
console.log(`   client đọc price:42 = ${await tracked.get('price:42')} (Redis ghi nhớ)`);
await other.set('price:42', '189000'); await sleep(50);
await other.set('price:43', '1'); await sleep(50);
console.log('   (đổi price:43 không sinh tin vì client chưa từng đọc key đó)');
tracked.disconnect(); inbox.disconnect(); other.disconnect(); admin.disconnect();

console.log('5) Chia 100.000 key cho 4 node, rồi thêm node thứ 5');
const hash = (s: string) => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
const keys = Array.from({ length: 100_000 }, (_, i) => `product:${i}`);
const modulo = (n: number) => (k: string) => hash(k) % n;
function ring(nodes: number, vnodes = 100) {   // consistent hashing: mỗi node có 100 điểm trên vòng
  const points = Array.from({ length: nodes }, (_, n) => Array.from({ length: vnodes }, (_, v) => [hash(`node${n}#${v}`), n])).flat()
    .sort((x, y) => x[0] - y[0]);
  return (k: string) => { const h = hash(k); return (points.find(([p]) => p >= h) ?? points[0])[1]; };
}
for (const [name, mk] of [['hash % số node', modulo], ['consistent hashing', ring]] as const) {
  const before = mk(4), after = mk(5);
  const moved = keys.filter((k) => before(k) !== after(k)).length;
  console.log(`   ${name.padEnd(19)} → ${((moved / keys.length) * 100).toFixed(1)}% key phải đổi node (cache trượt)`);
}

console.log('6) Redis Cluster: slot = CRC16(key) mod 16384, hash tag {…} ép các key về cùng slot');
function crc16(s: string) {   // CRC16-XMODEM, đúng biến thể Redis Cluster dùng
  let crc = 0;
  for (const byte of Buffer.from(s)) { crc ^= byte << 8; for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff; }
  return crc;
}
const slot = (key: string) => { const m = key.match(/\{([^}]+)\}/); return crc16(m ? m[1] : key) % 16384; };
for (const k of ['product:{42}:price', 'product:{42}:stock', 'product:42:price', 'somekey'])
  console.log(`   ${k.padEnd(19)} → slot ${slot(k)}`);
