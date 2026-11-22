// Deadlock khi hai giỏ hàng khóa SKU theo thứ tự ngược nhau, cách sắp xếp để tránh,
// transaction dài giữ khóa, lock_timeout và retry có jitter.
// Chạy: npm i pg && node deadlock.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 20 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let t0 = Date.now();
const at = () => `${String(Date.now() - t0).padStart(5)} ms`;

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS inventories;
    CREATE TABLE inventories (sku text PRIMARY KEY, reserved int NOT NULL DEFAULT 0, total int NOT NULL);
    INSERT INTO inventories VALUES ('A', 0, 10), ('B', 0, 10);`);
}

// Giữ hàng cho cả giỏ trong một transaction: mỗi SKU một câu UPDATE có điều kiện.
async function reserveCart(name: string, skus: string[], gapMs = 100) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    for (const sku of skus) {
      await c.query('UPDATE inventories SET reserved = reserved + 1 WHERE sku = $1 AND total >= reserved + 1', [sku]);
      console.log(`${at()}  ${name}: đã khóa ${sku}`);
      await sleep(gapMs); // làm việc khác giữa hai SKU (tính giá, voucher…)
    }
    await c.query('COMMIT');
    console.log(`${at()}  ${name}: COMMIT`);
  } catch (e: any) {
    await c.query('ROLLBACK').catch(() => {});
    console.log(`${at()}  ${name}: lỗi ${e.code}: ${e.message.split('\n')[0]}`);
  } finally { c.release(); }
}

console.log('A. Giỏ X = [A, B], giỏ Y = [B, A], không sắp xếp');
await reset(); t0 = Date.now();
await Promise.all([reserveCart('giỏ X', ['A', 'B']), reserveCart('giỏ Y', ['B', 'A'])]);

console.log('\nB. Cùng hai giỏ, nhưng sắp xếp SKU tăng dần trước khi khóa');
await reset(); t0 = Date.now();
await Promise.all([reserveCart('giỏ X', ['A', 'B'].sort()), reserveCart('giỏ Y', ['B', 'A'].sort())]);

// ── C. Transaction dài: gọi cổng thanh toán khi đang giữ khóa ─────────────
console.log('\nC. Một request giữ khóa SKU A trong 3 giây (gọi API ngoài trong transaction)');
await reset(); t0 = Date.now();
const slow = (async () => {
  const c = await pool.connect();
  await c.query('BEGIN');
  await c.query(`UPDATE inventories SET reserved = reserved + 1 WHERE sku = 'A'`);
  console.log(`${at()}  chậm: đã khóa A, đang chờ cổng thanh toán…`);
  await sleep(3000);
  await c.query('COMMIT');
  console.log(`${at()}  chậm: COMMIT`);
  c.release();
})();
await sleep(50);
async function buyer(name: string, lockTimeout?: string) {
  const c = await pool.connect();
  const start = Date.now();
  try {
    await c.query('BEGIN');
    if (lockTimeout) await c.query(`SET LOCAL lock_timeout = '${lockTimeout}'`);
    await c.query(`UPDATE inventories SET reserved = reserved + 1 WHERE sku = 'A'`);
    await c.query('COMMIT');
    console.log(`${at()}  ${name}: mua được sau ${Date.now() - start} ms`);
  } catch (e: any) {
    await c.query('ROLLBACK').catch(() => {});
    console.log(`${at()}  ${name}: lỗi ${e.code} sau ${Date.now() - start} ms (${e.message})`);
  } finally { c.release(); }
}
await Promise.all([buyer('người 1'), buyer('người 2'), buyer('người 3, lock_timeout 500ms', '500ms')]);
await slow;

// ── D. Retry có jitter cho lỗi "thử lại là được" ───────────────────────────
console.log('\nD. 20 giỏ cùng lúc, xen kẽ [A, B] và [B, A]');
const RETRYABLE = new Set(['40001', '40P01']); // serialization failure, deadlock
async function withRetry<T>(fn: () => Promise<T>, stats: { retries: number }, max = 5): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await fn(); } catch (e: any) {
      if (!RETRYABLE.has(e.code) || attempt >= max) throw e;
      stats.retries++;
      await sleep(Math.random() * 50 * 2 ** attempt); // full jitter, lùi lũy thừa
    }
  }
}
async function cartTx(skus: string[]) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    for (const sku of skus) {
      await c.query('UPDATE inventories SET reserved = reserved + 1 WHERE sku = $1', [sku]);
      await sleep(20);
    }
    await c.query('COMMIT');
  } catch (e) { await c.query('ROLLBACK').catch(() => {}); throw e; } finally { c.release(); }
}
const cases: [string, boolean, boolean][] = [
  ['không sắp xếp, không retry', false, false],
  ['không sắp xếp, retry tối đa 5', false, true],
  ['sắp xếp SKU, không retry', true, false],
];
for (const [name, sorted, retry] of cases) {
  await reset();
  const stats = { retries: 0 };
  const errors = new Map<string, number>();
  const carts = Array.from({ length: 20 }, (_, i) => (i % 2 ? ['A', 'B'] : ['B', 'A'])).map((c) => (sorted ? [...c].sort() : c));
  await Promise.all(carts.map((skus) => (retry ? withRetry(() => cartTx(skus), stats) : cartTx(skus))
    .catch((e) => errors.set(e.code, (errors.get(e.code) ?? 0) + 1))));
  const failed = [...errors.values()].reduce((a, b) => a + b, 0);
  const codes = [...errors].map(([k, v]) => `${v}× ${k}`).join(', ') || 'không lỗi';
  console.log(`   ${name.padEnd(30)}: ${20 - failed}/20 giỏ xong (${codes}), ${stats.retries} lần thử lại`);
}
await pool.end();
