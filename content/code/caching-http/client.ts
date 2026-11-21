// Đi qua CDN (nginx, cổng 8088) và xem cache làm gì với từng request.
// Chuẩn bị: docker compose -p atlas-http up -d   (compose.yaml cùng thư mục)
// Chạy:     node client.ts
const EDGE = 'http://localhost:8088';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const t0 = performance.now();
const at = () => `${((performance.now() - t0) / 1000).toFixed(1).padStart(4)}s`;
const originHits = async () => (await (await fetch(`${EDGE}/stats`)).json()).hits as number;

async function get(path: string, headers: Record<string, string> = {}, note = '') {
  const start = performance.now();
  const res = await fetch(EDGE + path, { headers });
  const body = res.status === 304 ? '(304, không có body)' : await res.text();
  const ms = (performance.now() - start).toFixed(0).padStart(4);
  console.log(`${at()}  ${path.padEnd(13)} ${String(res.headers.get('x-cache-status') ?? '-').padEnd(9)} ${ms}ms  ${body.slice(0, 58)} ${note}`);
  return res;
}

console.log('1) max-age=5, stale-while-revalidate=10 qua CDN');
const first = await get('/products/42', {}, '← lần đầu: CDN đi hỏi origin');
await get('/products/42', {}, '← trong 5 giây: CDN tự trả');
await sleep(6500);
await get('/products/42', {}, '← quá 5 giây: trả bản cũ ngay, cập nhật ở nền');
await sleep(800);
await get('/products/42', {}, '← nền đã hỏi lại origin: 304, bản cũ được gia hạn');

console.log('\n2) 200 request cùng lúc vào một URL chưa có trong cache');
const before = await originHits();
await Promise.all(Array.from({ length: 200 }, () => fetch(`${EDGE}/greeting`, { headers: { 'accept-language': 'en' } })));
console.log(`   origin nhận thêm ${(await originHits()) - before} request (proxy_cache_lock gom lại)`);

console.log('\n3) Vary: Accept-Language');
await get('/greeting', { 'accept-language': 'vi-VN' });
await get('/greeting', { 'accept-language': 'en-US' });
await get('/greeting', { 'accept-language': 'vi-VN' });

console.log('\n4) private: CDN không giữ dữ liệu riêng của từng người');
await get('/me', { 'x-user': 'an' });
await get('/me', { 'x-user': 'binh' });

console.log('\n5) ETag: trình duyệt hỏi lại "bản tôi đang có còn đúng không?"');
const tag = first.headers.get('etag')!;
const r1 = await fetch(`${EDGE}/products/42`, { headers: { 'if-none-match': tag } });
console.log(`   If-None-Match: ${tag} → ${r1.status} ${r1.status === 304 ? '(dùng tiếp bản đang có, không tải lại body)' : ''}`);
await fetch(`${EDGE}/admin/price`, { method: 'POST' });
await sleep(6500);
await fetch(`${EDGE}/products/42`); // CDN thấy hết hạn, lấy bản mới ở nền
await sleep(800);
const r2 = await fetch(`${EDGE}/products/42`, { headers: { 'if-none-match': tag } });
console.log(`   giá đã đổi, hỏi lại với ETag cũ → ${r2.status}, ETag mới ${r2.headers.get('etag')}: ${await r2.text()}`);
console.log(`\norigin nhận tổng cộng ${await originHits()} request`);
