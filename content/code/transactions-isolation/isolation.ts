// Cùng một đoạn code "đọc, kiểm tra, ghi" chạy ở ba mức isolation của Postgres,
// rồi một ca write skew: giới hạn "mỗi người tối đa 2 suất" kiểm tra bằng COUNT.
// Chạy: npm i pg && node isolation.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 50 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
type Level = 'READ COMMITTED' | 'REPEATABLE READ' | 'SERIALIZABLE';

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS orders, items;
    CREATE TABLE items  (id int PRIMARY KEY, stock int NOT NULL);
    CREATE TABLE orders (id serial PRIMARY KEY, item_id int NOT NULL, buyer int NOT NULL);
    INSERT INTO items VALUES (1, 100);`);
}

// Lỗi 40001 = serialization failure: Postgres hủy transaction thay vì để dữ liệu sai.
const isSerializationFailure = (e: any) => e?.code === '40001';

async function buy(level: Level, buyer: number, retry: boolean, stats: { failed: number; retries: number }) {
  for (let attempt = 0; ; attempt++) {
    const c = await pool.connect();
    try {
      await c.query(`BEGIN ISOLATION LEVEL ${level}`);
      const { rows } = await c.query('SELECT stock FROM items WHERE id = 1');
      if (rows[0].stock < 1) { await c.query('ROLLBACK'); return; }
      await sleep(2);
      await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
      await c.query('UPDATE items SET stock = $1 WHERE id = 1', [rows[0].stock - 1]);
      await c.query('COMMIT');
      return;
    } catch (e) {
      await c.query('ROLLBACK').catch(() => {});
      if (!isSerializationFailure(e)) throw e;
      if (!retry || attempt >= 50) { stats.failed++; return; }
      stats.retries++;
      await sleep(Math.random() * 10 * (attempt + 1)); // lùi lại có jitter rồi thử lại
    } finally { c.release(); }
  }
}

async function oversell(level: Level, retry: boolean) {
  await reset();
  const stats = { failed: 0, retries: 0 };
  const t0 = Date.now();
  await Promise.all(Array.from({ length: 300 }, (_, i) => buy(level, i + 1, retry, stats)));
  const { rows: [r] } = await pool.query(
    'SELECT (SELECT count(*)::int FROM orders) AS sold, (SELECT stock FROM items) AS stock');
  console.log(`${level.padEnd(16)} ${(retry ? 'có' : 'không').padEnd(8)} ${String(r.sold).padStart(5)} ` +
    `${String(r.stock).padStart(9)} ${String(stats.failed).padStart(10)} ${String(stats.retries).padStart(9)} ${String(Date.now() - t0).padStart(7)} ms`);
}

// Write skew: mỗi transaction đọc COUNT đơn của user rồi INSERT một đơn mới.
// Hai transaction ghi vào hai DÒNG KHÁC NHAU, nên không có xung đột ghi trên cùng một dòng.
async function writeSkew(level: Level) {
  await reset();
  await pool.query('INSERT INTO orders (item_id, buyer) VALUES (1, 7)'); // user 7 đã có 1 đơn
  const attempt = async () => {
    const c = await pool.connect();
    try {
      await c.query(`BEGIN ISOLATION LEVEL ${level}`);
      const { rows } = await c.query('SELECT count(*)::int AS n FROM orders WHERE buyer = 7');
      await sleep(50); // hai tab cùng bấm "mua" gần như một lúc
      if (rows[0].n >= 2) { await c.query('ROLLBACK'); return 'từ chối'; }
      await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, 7)');
      await c.query('COMMIT');
      return 'ok';
    } catch (e: any) {
      await c.query('ROLLBACK').catch(() => {});
      return `lỗi ${e.code}`;
    } finally { c.release(); }
  };
  const results = await Promise.all([attempt(), attempt()]);
  const { rows: [r] } = await pool.query('SELECT count(*)::int AS n FROM orders WHERE buyer = 7');
  console.log(`${level.padEnd(16)} ${results.join(' | ').padEnd(22)} user 7 có ${r.n} đơn (giới hạn 2)`);
}

console.log('A. 100 suất, 300 người, code "đọc, kiểm tra, ghi số app tính"\n');
console.log(`${'mức'.padEnd(16)} ${'retry'.padEnd(8)} ${'đơn'.padStart(5)} ${'tồn cuối'.padStart(9)} ${'bỏ cuộc'.padStart(10)} ${'lần retry'.padStart(9)} ${'thời gian'.padStart(10)}`);
for (const level of ['READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'] as Level[]) await oversell(level, false);
for (const level of ['REPEATABLE READ', 'SERIALIZABLE'] as Level[]) await oversell(level, true);

console.log('\nB. Write skew: user 7 đã có 1 đơn, hai tab cùng mua thêm 1\n');
for (const level of ['READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'] as Level[]) await writeSkew(level);
await pool.end();
