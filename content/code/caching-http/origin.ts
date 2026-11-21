// Origin server: "cửa hàng" thật đằng sau CDN. Mỗi request tới đây tốn 300ms và được đếm.
// Chạy trong compose.yaml (cùng thư mục), sau lưng nginx proxy_cache.
import http from 'node:http';

let hits = 0;
let price = 199_000; // đổi qua POST /admin/price để thấy ETag đổi theo
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

http.createServer(async (req, res) => {
  const url = new URL(req.url!, 'http://origin');
  if (url.pathname === '/stats') { res.end(JSON.stringify({ hits })); return; }
  if (url.pathname === '/admin/price' && req.method === 'POST') { price += 1_000; res.end('ok'); return; }
  hits++;
  await sleep(300); // làm việc thật: query DB, render…

  if (url.pathname === '/products/42') {
    // Ai cũng thấy như nhau → cho mọi cache giữ 5 giây, hết hạn thì còn được trả bản cũ thêm 10 giây
    // trong lúc đi lấy bản mới ở nền.
    const body = JSON.stringify({ id: 42, name: 'Tai nghe', price, at: new Date().toISOString().slice(11, 23) });
    const tag = `W/"v${price}"`; // weak ETag: cùng giá là "tương đương", dù giờ render trong body khác
    res.setHeader('Cache-Control', 'public, max-age=5, stale-while-revalidate=10');
    res.setHeader('ETag', tag);
    if (req.headers['if-none-match'] === tag) { res.statusCode = 304; res.end(); return; }
    res.setHeader('Content-Type', 'application/json');
    res.end(body);
    return;
  }
  if (url.pathname === '/me') {
    // Dữ liệu riêng của từng người: chỉ trình duyệt được giữ, cache dùng chung thì không
    res.setHeader('Cache-Control', 'private, max-age=60');
    res.end(JSON.stringify({ user: req.headers['x-user'] ?? 'khách' }));
    return;
  }
  if (url.pathname === '/greeting') {
    // Cùng URL, khác ngôn ngữ: Vary đưa Accept-Language vào khóa cache
    const vi = String(req.headers['accept-language'] ?? '').startsWith('vi');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Vary', 'Accept-Language');
    res.end(vi ? 'Xin chào' : 'Hello');
    return;
  }
  res.statusCode = 404;
  res.end();
}).listen(3000, () => console.log('origin :3000'));
