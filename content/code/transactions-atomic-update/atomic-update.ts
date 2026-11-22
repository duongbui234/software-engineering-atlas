// Trừ kho bằng một câu UPDATE có điều kiện, rồi xem từng bước vì sao nó đúng.
// Chạy: npm i pg && node atomic-update.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 50 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let t0 = Date.now();
const log = (who: string, msg: string) => console.log(`${String(Date.now() - t0).padStart(5)} ms  ${who.padEnd(3)} ${msg}`);

async function reset(stock: number) {
  await pool.query(`
    DROP TABLE IF EXISTS orders, items;
    CREATE TABLE items  (id int PRIMARY KEY, stock int NOT NULL);
    CREATE TABLE orders (id serial PRIMARY KEY, item_id int NOT NULL, buyer int NOT NULL);
    INSERT INTO items VALUES (1, ${stock});`);
}

// Một câu duy nhất: chỉ trừ khi còn đủ hàng. Không có dòng nào khớp = hết hàng.
async function buy(buyer: number) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const r = await c.query('UPDATE items SET stock = stock - 1 WHERE id = 1 AND stock >= 1 RETURNING stock');
    if (r.rowCount === 0) { await c.query('ROLLBACK'); return false; }
    await sleep(2);
    await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
    await c.query('COMMIT');
    return true;
  } finally { c.release(); }
}

// ── A. 300 người, 100 suất ───────────────────────────────────────────────
await reset(100);
let started = Date.now();
const ok = (await Promise.all(Array.from({ length: 300 }, (_, i) => buy(i + 1)))).filter(Boolean).length;
const { rows: [a] } = await pool.query('SELECT (SELECT count(*)::int FROM orders) AS sold, (SELECT stock FROM items) AS stock');
console.log(`A. UPDATE có điều kiện: ${ok} người mua được, ${a.sold} đơn, tồn cuối ${a.stock}, ${Date.now() - started} ms\n`);

// ── B. Chậm lại để xem: còn 1 suất, hai người cùng trừ ────────────────────
async function race(level: string) {
  await reset(1);
  t0 = Date.now();
  console.log(`B. Còn 1 suất, hai session cùng trừ (${level})`);
  const A = await pool.connect(), B = await pool.connect();
  try {
    await A.query(`BEGIN ISOLATION LEVEL ${level}`);
    await B.query(`BEGIN ISOLATION LEVEL ${level}`);
    await B.query('SELECT 1'); // B lấy snapshot ngay bây giờ (quan trọng với Repeatable Read)
    const ra = await A.query('UPDATE items SET stock = stock - 1 WHERE id = 1 AND stock >= 1 RETURNING stock');
    log('A', `UPDATE xong, ${ra.rowCount} dòng, stock = ${ra.rows[0]?.stock}; chưa COMMIT nên vẫn giữ khóa dòng`);
    log('B', 'gửi cùng câu UPDATE…');
    const pb = B.query('UPDATE items SET stock = stock - 1 WHERE id = 1 AND stock >= 1 RETURNING stock')
      .then((r) => log('B', `xong: ${r.rowCount} dòng khớp → hết hàng, không trừ`))
      .catch((e) => log('B', `lỗi ${e.code}: ${e.message}`));
    await sleep(300);
    log('B', '…vẫn đang chờ khóa dòng của A');
    log('A', 'gửi COMMIT, nhả khóa');
    await A.query('COMMIT');
    await pb;
    await B.query('ROLLBACK').catch(() => {});
  } finally { A.release(); B.release(); }
  const { rows: [r] } = await pool.query('SELECT stock FROM items');
  console.log(`   tồn cuối: ${r.stock}\n`);
}
await race('READ COMMITTED');
await race('REPEATABLE READ');

// ── C. Lưới cuối cùng: CHECK trong database ──────────────────────────────
await reset(1);
await pool.query('ALTER TABLE items ADD CONSTRAINT items_stock_nonneg CHECK (stock >= 0)');
console.log('C. Thêm CHECK (stock >= 0), rồi một đoạn code quên điều kiện "AND stock >= 1"');
for (const n of [1, 2]) {
  try {
    await pool.query('UPDATE items SET stock = stock - 1 WHERE id = 1');
    console.log(`   lần ${n}: trừ được`);
  } catch (e: any) {
    console.log(`   lần ${n}: lỗi ${e.code}: ${e.message}`);
  }
}
await pool.end();
