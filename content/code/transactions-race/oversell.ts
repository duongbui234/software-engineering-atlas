// Tái hiện bán quá số hàng: 300 người cùng mua 1 sản phẩm còn 100 suất.
// Chạy: docker run -d --name tx-pg -e POSTGRES_PASSWORD=atlas -p 55432:5432 postgres:16-alpine
//       npm i pg && node oversell.ts
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const STOCK = 100;
const BUYERS = 300;
const pool = new pg.Pool({ connectionString: URL, max: 50 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS orders, items;
    CREATE TABLE items  (id int PRIMARY KEY, stock int NOT NULL);
    CREATE TABLE orders (id serial PRIMARY KEY, item_id int NOT NULL, buyer int NOT NULL);
    INSERT INTO items VALUES (1, ${STOCK});`);
}

// Cách 1: đọc tồn kho, kiểm tra ở app, rồi ghi lại con số app tự tính.
async function buyReadModifyWrite(buyer: number) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const { rows } = await c.query('SELECT stock FROM items WHERE id = 1');
    const stock: number = rows[0].stock;
    if (stock < 1) { await c.query('ROLLBACK'); return false; }
    await sleep(2); // kiểm tra giá, voucher, giới hạn mỗi người… mất vài mili giây
    await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
    await c.query('UPDATE items SET stock = $1 WHERE id = 1', [stock - 1]);
    await c.query('COMMIT');
    return true;
  } finally { c.release(); }
}

// Cách 2: vẫn kiểm tra ở app, nhưng trừ bằng stock = stock - 1 trong database.
async function buyCheckThenDecrement(buyer: number) {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    const { rows } = await c.query('SELECT stock FROM items WHERE id = 1');
    if (rows[0].stock < 1) { await c.query('ROLLBACK'); return false; }
    await sleep(2);
    await c.query('INSERT INTO orders (item_id, buyer) VALUES (1, $1)', [buyer]);
    await c.query('UPDATE items SET stock = stock - 1 WHERE id = 1');
    await c.query('COMMIT');
    return true;
  } finally { c.release(); }
}

async function run(name: string, buy: (b: number) => Promise<boolean>) {
  await reset();
  await Promise.all(Array.from({ length: BUYERS }, (_, i) => buy(i + 1)));
  const { rows: [r] } = await pool.query(
    'SELECT (SELECT count(*)::int FROM orders) AS sold, (SELECT stock FROM items WHERE id = 1) AS stock');
  const lost = STOCK - r.stock - r.sold; // số lần trừ kho bị ghi đè mất
  console.log(`${name.padEnd(26)} ${String(r.sold).padStart(6)} ${String(r.stock).padStart(10)} ` +
    `${String(Math.max(r.sold - STOCK, 0)).padStart(9)} ${String(-lost).padStart(14)}`);
}

console.log(`${STOCK} suất, ${BUYERS} người mua cùng lúc, Read Committed (mặc định)\n`);
console.log(`${'cách'.padEnd(26)} ${'đơn'.padStart(6)} ${'tồn cuối'.padStart(10)} ${'bán quá'.padStart(9)} ${'lần trừ bị mất'.padStart(14)}`);
await run('đọc rồi ghi số app tính', buyReadModifyWrite);
await run('kiểm tra rồi stock - 1', buyCheckThenDecrement);
await pool.end();
