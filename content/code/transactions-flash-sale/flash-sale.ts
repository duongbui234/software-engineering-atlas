// Flash sale: Redis chặn trước bằng Lua nguyên tử, Postgres giữ sự thật,
// bù trừ khi DB lỗi, đối soát khi process chết giữa chừng, CHECK làm lưới cuối.
// Chạy: docker run -d --name tx-redis -p 56379:6379 redis:7-alpine
//       npm i pg ioredis && node flash-sale.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';
import Redis from 'ioredis';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 40 });
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:56379');
const ALLOCATED = 100, BUYERS = 3000, MAX_PER_USER = 1;
const STOCK_KEY = 'flash:stock:c1:sku1';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Cùng ý với flash_purchase.lua: kiểm tra giới hạn mỗi người, trừ kho, cộng quota,
// tất cả trong một lần chạy Lua. Redis chạy từng script một nên không ai chen giữa.
const PURCHASE = `
local bought = tonumber(redis.call('GET', KEYS[2]) or '0')
if bought + tonumber(ARGV[1]) > tonumber(ARGV[2]) then return -2 end
if redis.call('DECRBY', KEYS[1], ARGV[1]) < 0 then
  redis.call('INCRBY', KEYS[1], ARGV[1])
  return -1
end
redis.call('INCRBY', KEYS[2], ARGV[1])
return 1`;
const COMPENSATE = `redis.call('INCRBY', KEYS[1], ARGV[1]); redis.call('DECRBY', KEYS[2], ARGV[1]); return 1`;

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS flash_orders, flash_items;
    CREATE TABLE flash_items (id int PRIMARY KEY, allocated int NOT NULL, sold int NOT NULL DEFAULT 0,
      CONSTRAINT sold_le_allocated CHECK (sold <= allocated));
    CREATE TABLE flash_orders (id serial PRIMARY KEY, item_id int NOT NULL, buyer int NOT NULL,
      CONSTRAINT one_per_buyer UNIQUE (item_id, buyer));
    INSERT INTO flash_items VALUES (1, ${ALLOCATED}, 0);`);
  const keys = await redis.keys('flash:*');
  if (keys.length) await redis.del(...keys);
  await redis.set(STOCK_KEY, ALLOCATED);
}

let dbTx = 0;
// Ghi đơn vào Postgres: một transaction, UPDATE có điều kiện + INSERT.
async function writeOrder(buyer: number, failRate: number) {
  const c = await pool.connect();
  dbTx++;
  try {
    await c.query('BEGIN');
    const u = await c.query('UPDATE flash_items SET sold = sold + 1 WHERE id = 1 AND sold < allocated');
    if (u.rowCount === 0) { await c.query('ROLLBACK'); return false; }
    await c.query('INSERT INTO flash_orders (item_id, buyer) VALUES (1, $1)', [buyer]);
    if (Math.random() < failRate) throw new Error('DB lỗi giữa chừng');
    await c.query('COMMIT');
    return true;
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally { c.release(); }
}

async function viaRedisGate(buyer: number, failRate: number, stats: { compensated: number }) {
  const userKey = `flash:user:c1:${buyer}:sku1`;
  const r = await redis.eval(PURCHASE, 2, STOCK_KEY, userKey, 1, MAX_PER_USER);
  if (r !== 1) return false; // hết hàng hoặc vượt giới hạn: không chạm DB
  try {
    return await writeOrder(buyer, failRate);
  } catch {
    await redis.eval(COMPENSATE, 2, STOCK_KEY, userKey, 1); // trả suất lại cho Redis
    stats.compensated++;
    return false;
  }
}

const summary = async () => {
  const { rows: [r] } = await pool.query(
    'SELECT (SELECT sold FROM flash_items) AS sold, (SELECT count(*)::int FROM flash_orders) AS orders');
  return { ...r, redis: Number(await redis.get(STOCK_KEY)) };
};

// ── A. Có và không có cổng Redis ─────────────────────────────────────────
console.log(`A. ${ALLOCATED} suất, ${BUYERS} người bấm mua cùng lúc\n`);
for (const gate of [false, true]) {
  await reset();
  dbTx = 0;
  const stats = { compensated: 0 };
  const t0 = Date.now();
  await Promise.all(Array.from({ length: BUYERS }, (_, i) =>
    gate ? viaRedisGate(i + 1, 0, stats) : writeOrder(i + 1, 0)));
  const s = await summary();
  console.log(`   ${gate ? 'có cổng Redis   ' : 'thẳng vào DB    '}: ${s.orders} đơn, sold = ${s.sold}, ` +
    `${String(dbTx).padStart(4)} transaction tới Postgres, ${Date.now() - t0} ms`);
}

// ── B. DB lỗi 10%: bù trừ trả suất về Redis ──────────────────────────────
await reset();
dbTx = 0;
const stats = { compensated: 0 };
// Ai chưa mua được thì bấm lại, tới khi Redis hết suất (suất bị lỗi được trả về và bán lại).
let rounds = 0;
do {
  rounds++;
  await Promise.all(Array.from({ length: BUYERS }, (_, i) => viaRedisGate(i + 1, 0.1, stats)));
} while (Number(await redis.get(STOCK_KEY)) > 0 && rounds < 10);
let s = await summary();
console.log(`\nB. DB lỗi ngẫu nhiên 10%, người chưa mua được bấm lại (${rounds} lượt)`);
console.log(`   ${stats.compensated} lần bù trừ; DB: ${s.orders} đơn, sold = ${s.sold}; Redis còn ${s.redis}; ` +
  `Redis + sold = ${s.redis + s.sold} (phải bằng ${ALLOCATED})`);

// ── C. Process chết sau khi Redis đã trừ, trước khi DB kịp ghi ────────────
await reset();
await Promise.all(Array.from({ length: BUYERS }, (_, i) => {
  const buyer = i + 1;
  if (buyer % 30 === 0 && buyer <= 90) { // 3 request: Redis trừ xong thì pod bị kill, không kịp bù trừ
    return redis.eval(PURCHASE, 2, STOCK_KEY, `flash:user:c1:${buyer}:sku1`, 1, MAX_PER_USER);
  }
  return viaRedisGate(buyer, 0, { compensated: 0 });
}));
s = await summary();
console.log(`\nC. 3 pod chết giữa Redis và DB`);
console.log(`   trước đối soát                    : Redis còn ${s.redis}, DB sold = ${s.sold} → ${ALLOCATED - s.redis - s.sold} suất "bốc hơi"`);
// Đối soát: DB là sự thật. Chỉ an toàn khi không còn request nào đang ở giữa Redis và DB
// (flash-sale làm việc này lúc chiến dịch kết thúc, sau khi dừng worker).
const { rows: [it] } = await pool.query('SELECT allocated - sold AS remaining FROM flash_items WHERE id = 1');
await redis.set(STOCK_KEY, it.remaining);
s = await summary();
console.log(`   đối soát (lúc không còn request dở): Redis còn ${s.redis}, DB sold = ${s.sold}; bán tiếp được ${s.redis} suất`);

// ── D. Lưới cuối: code bỏ qua cổng Redis và quên điều kiện ───────────────
try {
  await pool.query('UPDATE flash_items SET sold = allocated + 1 WHERE id = 1');
} catch (e: any) {
  console.log(`\nD. Một đoạn code lỗi ghi sold vượt allocated → ${e.code}: ${e.message}`);
}
await pool.end();
redis.disconnect();
