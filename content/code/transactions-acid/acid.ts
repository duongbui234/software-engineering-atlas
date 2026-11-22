// Transaction trong Postgres: tất cả hoặc không gì cả, phiên bản dòng (MVCC) và WAL.
// Chạy: npm i pg && node acid.ts   (cần Postgres, xem DATABASE_URL)
import pg from 'pg';

const URL = process.env.DATABASE_URL ?? 'postgres://postgres:atlas@localhost:55432/postgres';
const pool = new pg.Pool({ connectionString: URL, max: 5 });

async function reset() {
  await pool.query(`
    DROP TABLE IF EXISTS ledger, orders, inventories;
    CREATE TABLE inventories (sku text PRIMARY KEY, reserved int NOT NULL DEFAULT 0, total int NOT NULL);
    CREATE TABLE orders      (id serial PRIMARY KEY, sku text NOT NULL, status text NOT NULL);
    CREATE TABLE ledger      (id serial PRIMARY KEY, sku text NOT NULL, delta int NOT NULL, order_id int NOT NULL);
    INSERT INTO inventories VALUES ('A', 0, 10);`);
}
const state = async () => {
  const { rows: [r] } = await pool.query(`SELECT
    (SELECT reserved FROM inventories WHERE sku = 'A') AS reserved,
    (SELECT count(*)::int FROM orders) AS orders,
    (SELECT count(*)::int FROM ledger) AS ledger`);
  return `giữ ${r.reserved} suất, ${r.orders} đơn, ${r.ledger} dòng sổ kho`;
};

// Đặt hàng = 3 câu lệnh. Câu thứ ba lỗi (giả lập crash / bug / mất kết nối).
async function placeOrder(c: pg.PoolClient | pg.Pool, failAtStep3: boolean) {
  await c.query(`UPDATE inventories SET reserved = reserved + 1 WHERE sku = 'A' AND total >= reserved + 1`);
  const { rows: [o] } = await c.query(`INSERT INTO orders (sku, status) VALUES ('A', 'PENDING') RETURNING id`);
  if (failAtStep3) throw new Error('crash giữa chừng');
  await c.query(`INSERT INTO ledger (sku, delta, order_id) VALUES ('A', -1, $1)`, [o.id]);
}

console.log('A. Đặt hàng 3 bước, lỗi ở bước 3');
await reset();
await placeOrder(pool, true).catch(() => {}); // mỗi câu tự commit riêng (autocommit)
console.log(`   không transaction: ${await state()}   ← kho bị giữ, đơn mồ côi, sổ kho lệch`);

await reset();
const c = await pool.connect();
try {
  await c.query('BEGIN');
  await placeOrder(c, true);
  await c.query('COMMIT');
} catch { await c.query('ROLLBACK'); } finally { c.release(); }
console.log(`   có transaction   : ${await state()}   ← ROLLBACK xóa sạch cả 3 bước`);

// ── B. MVCC: UPDATE tạo phiên bản dòng mới, người đọc thấy bản đã commit ──
console.log('\nB. Phiên bản dòng (MVCC)');
await reset();
const row = async (who: pg.PoolClient | pg.Pool) =>
  (await who.query(`SELECT xmin, xmax, ctid, reserved FROM inventories WHERE sku = 'A'`)).rows[0];
console.log('   ban đầu                   ', JSON.stringify(await row(pool)));
const W = await pool.connect(), R = await pool.connect();
await W.query('BEGIN');
const { rows: [x] } = await W.query('SELECT txid_current() AS id');
await W.query(`UPDATE inventories SET reserved = 5 WHERE sku = 'A'`);
console.log(`   W (txid ${x.id}) thấy, chưa commit`, JSON.stringify(await row(W)));
let t = Date.now();
console.log(`   R đọc cùng lúc            `, JSON.stringify(await row(R)), `← bản cũ, không chờ (${Date.now() - t} ms)`);
await W.query('COMMIT');
console.log('   R đọc sau khi W commit    ', JSON.stringify(await row(R)));
W.release(); R.release();

// ── C. WAL: commit = ghi nhật ký xuống đĩa trước, dữ liệu bảng ghi sau ──────
console.log('\nC. Write-Ahead Log');
const lsn = async () => (await pool.query('SELECT pg_current_wal_lsn() AS l')).rows[0].l;
const before = await lsn();
await pool.query(`UPDATE inventories SET reserved = reserved + 1 WHERE sku = 'A'`);
const after = await lsn();
const { rows: [d] } = await pool.query('SELECT pg_wal_lsn_diff($1, $2)::int AS bytes', [after, before]);
const { rows: [s] } = await pool.query(`SELECT current_setting('synchronous_commit') AS sc, current_setting('fsync') AS fs`);
console.log(`   một UPDATE nhỏ đẩy WAL từ ${before} tới ${after}: ${d.bytes} byte nhật ký`);
console.log(`   synchronous_commit = ${s.sc}, fsync = ${s.fs}: COMMIT chỉ trả lời sau khi WAL đã xuống đĩa`);
await pool.end();
