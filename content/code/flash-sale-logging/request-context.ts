// Mã theo dõi request (correlation id) bằng AsyncLocalStorage, chạy thật: node request-context.ts
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

type Ctx = { correlationId: string };
const als = new AsyncLocalStorage<Ctx>();
const lines: string[] = [];

// Logger kiểu interceptor: chỉ có mã khi người gọi tự truyền vào.
const plainLog = (msg: string, meta: object = {}) => lines.push(JSON.stringify({ msg, ...meta }));
// Logger tự đọc mã từ ngữ cảnh: mọi dòng đều có mã, người gọi không phải nhớ.
const ctxLog = (msg: string) => lines.push(JSON.stringify({ msg, correlationId: als.getStore()?.correlationId ?? 'unknown' }));

const DELAY: Record<string, number> = { 'SKU-A': 4, 'SKU-B': 1, 'SKU-C': 2 };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Một "service" sâu bên trong: không nhận tham số nào về request.
async function reserveStock(sku: string) {
  await sleep(DELAY[sku]); // độ trễ cố định để thứ tự in ra lặp lại được
  plainLog(`giữ kho ${sku}`);
  ctxLog(`giữ kho ${sku}`);
  await Promise.all([sleep(1), sleep(2)]);
  ctxLog(`ghi đơn ${sku}`);
}

// Middleware: lấy mã từ header nếu hợp lệ, không thì tự sinh; chạy phần còn lại trong ngữ cảnh.
const VALID = /^[A-Za-z0-9-]{8,64}$/;
function handle(headerId: string | undefined, sku: string) {
  const correlationId = headerId && VALID.test(headerId) ? headerId : `req-${randomUUID().slice(0, 8)}`;
  return als.run({ correlationId }, () => reserveStock(sku));
}

// Một timer đặt ở NGOÀI mọi request (ví dụ job dọn dẹp lúc khởi động).
const batch: string[] = [];
const flusher = setInterval(() => { if (batch.length) ctxLog(`flush ${batch.splice(0).join(',')}`); }, 3);

await Promise.all([
  handle('client-abc-12345', 'SKU-A'),
  handle(undefined, 'SKU-B'),
  handle('xin chào\n{"level":"error"}', 'SKU-C'), // header bẩn: bị bỏ, sinh mã mới
]);
batch.push('SKU-A', 'SKU-B');
await sleep(10);
clearInterval(flusher);
console.log(lines.join('\n'));

// Chi phí: 100 000 "request" có một await, có và không có als.run.
async function work() { await null; return als.getStore()?.correlationId; }
for (const [name, run] of [
  ['không ALS', () => work()],
  ['có ALS   ', () => als.run({ correlationId: 'x' }, work)],
] as const) {
  for (let i = 0; i < 20_000; i++) await run();
  const t = performance.now();
  for (let i = 0; i < 100_000; i++) await run();
  console.log(`${name}: ${((performance.now() - t) * 1000 / 100_000).toFixed(2)} µs mỗi request`);
}
