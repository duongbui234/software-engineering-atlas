// Khóa bi quan, khóa lạc quan và UPDATE có điều kiện trên cùng một dòng "nóng";
// rồi NOWAIT, SKIP LOCKED và advisory lock.
// Chạy: npm i pg && node locking.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 50 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS orders, items, jobs;
    CREATE TABLE items  (id int PRIMARY KEY, stock int NOT NULL, version int NOT NULL DEFAULT 0);
    CREATE TABLE orders (id serial PRIMARY KEY, item_id int NOT NULL, buyer int NOT NULL);
    INSERT INTO items VALUES (1, 100, 0);`);
}

async function tx<T>(fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const r = await fn(c);
    await c.query('COMMIT');
    return r;
  } catch (e) {
    await c.query('ROLLBACK').catch(() => {});
    throw e;
  } finally { c.release(); }
}

const WORK_MS = 2; // việc làm thêm trong transaction (tính giá, ghi đơn…)
let attempts = 0;

// Bi quan: khóa dòng trước khi đọc, ai đến sau thì xếp hàng chờ.
const pessimistic = (buyer: number) => tx(async (c) => {
  attempts++;
  const { rows } = await c.query('SELECT stock FROM items WHERE id = 1 FOR UPDATE');
  if (rows[0].stock < 1) return false;
  await sleep(WORK_MS);
  await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
  await c.query('UPDATE items SET stock = $1 WHERE id = 1', [rows[0].stock - 1]);
  return true;
});

// Lạc quan: đọc không khóa, ghi kèm "version vẫn như lúc tôi đọc"; thua thì đọc lại và thử lại.
async function optimistic(buyer: number) {
  for (;;) {
    attempts++;
    const won = await tx(async (c) => {
      const { rows } = await c.query('SELECT stock, version FROM items WHERE id = 1');
      if (rows[0].stock < 1) return 'hết';
      await sleep(WORK_MS);
      const u = await c.query(
        'UPDATE items SET stock = $1, version = version + 1 WHERE id = 1 AND version = $2',
        [rows[0].stock - 1, rows[0].version]);
      if (u.rowCount === 0) throw new Error('version-mismatch'); // ai đó ghi trước: hủy cả transaction
      await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
      return 'được';
    }).catch((e) => { if (e.message === 'version-mismatch') return 'thua'; throw e; });
    if (won !== 'thua') return won === 'được';
    await sleep(Math.random() * 5);
  }
}

// UPDATE có điều kiện (ga 4): khóa dòng chỉ trong một câu, kiểm tra và trừ cùng lúc.
const conditional = (buyer: number) => tx(async (c) => {
  attempts++;
  const u = await c.query('UPDATE items SET stock = stock - 1 WHERE id = 1 AND stock >= 1');
  if (u.rowCount === 0) return false;
  await sleep(WORK_MS);
  await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
  return true;
});

async function compare(name: string, buy: (b: number) => Promise<boolean>) {
  await reset();
  attempts = 0;
  const t0 = Date.now();
  await Promise.all(Array.from({ length: 300 }, (_, i) => buy(i + 1)));
  const ms = Date.now() - t0;
  const { rows: [r] } = await pool.query('SELECT (SELECT count(*)::int FROM orders) AS sold, (SELECT stock FROM items) AS stock');
  console.log(`${name.padEnd(22)} ${String(r.sold).padStart(5)} ${String(r.stock).padStart(9)} ${String(attempts).padStart(10)} ${String(ms).padStart(8)} ms`);
}

console.log('A. 100 suất, 300 người, cùng một dòng tồn kho\n');
console.log(`${'cách'.padEnd(22)} ${'đơn'.padStart(5)} ${'tồn cuối'.padStart(9)} ${'transaction'.padStart(10)} ${'thời gian'.padStart(11)}`);
await compare('bi quan (FOR UPDATE)', pessimistic);
await compare('lạc quan (version)', optimistic);
await compare('UPDATE có điều kiện', conditional);

// ── B. NOWAIT và SKIP LOCKED: hàng đợi việc "hủy đơn quá hạn" ─────────────
const resetJobs = () => pool.query(`
  DROP TABLE IF EXISTS jobs;
  CREATE TABLE jobs (id int PRIMARY KEY, status text NOT NULL DEFAULT 'PENDING');
  INSERT INTO jobs SELECT g FROM generate_series(1, 9) g;`);

console.log('\nB. Ba worker cùng lấy tối đa 3 việc PENDING, mỗi worker giữ transaction 200 ms');
async function worker(name: string, mode: '' | 'NOWAIT' | 'SKIP LOCKED') {
  const t0 = Date.now();
  try {
    return await tx(async (c) => {
      const { rows } = await c.query(
        `SELECT id FROM jobs WHERE status = 'PENDING' ORDER BY id LIMIT 3 FOR UPDATE ${mode}`);
      await sleep(200); // xử lý việc
      await c.query(`UPDATE jobs SET status = 'DONE' WHERE id = ANY($1)`, [rows.map((r) => r.id)]);
      return `${name}: lấy [${rows.map((r) => r.id).join(', ')}] sau ${Date.now() - t0} ms`;
    });
  } catch (e: any) {
    return `${name}: lỗi ${e.code} sau ${Date.now() - t0} ms (${e.message})`;
  }
}
for (const mode of ['', 'NOWAIT', 'SKIP LOCKED'] as const) {
  await resetJobs();
  console.log(`   FOR UPDATE ${mode || '(chờ)'}`);
  const out = await Promise.all(['w1', 'w2', 'w3'].map(async (w, i) => { await sleep(i * 10); return worker(w, mode); }));
  for (const line of out) console.log(`     ${line}`);
}

// ── C. Advisory lock: hai pod chạy cùng một cron, chỉ một pod được làm ──────
console.log('\nC. Hai pod cùng chạy cron dọn dẹp, giành pg_try_advisory_xact_lock');
const cron = (pod: string) => tx(async (c) => {
  const { rows: [r] } = await c.query(`SELECT pg_try_advisory_xact_lock(hashtext('cleanup-cron')) AS locked`);
  if (!r.locked) return `${pod}: pod khác đang chạy, bỏ qua lượt này`;
  await sleep(200);
  return `${pod}: giành được khóa, dọn xong, khóa tự nhả khi COMMIT`;
});
for (const line of await Promise.all([cron('pod-a'), cron('pod-b')])) console.log(`   ${line}`);
await pool.end();
