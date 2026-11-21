// Origin của một shop nhỏ, viết theo vài thói quen phổ biến (và nguy hiểm khi đứng sau cache):
//  - /account/... trả trang tài khoản của người đang đăng nhập (đọc cookie), phần đuôi URL bị bỏ qua;
//  - trang chủ in link tuyệt đối dựng từ header X-Forwarded-Host nếu có.
import http from 'node:http';

http.createServer((req, res) => {
  const url = new URL(req.url!, 'http://shop');
  if (url.pathname.startsWith('/account')) {
    const user = /session=(\w+)/.exec(req.headers.cookie ?? '')?.[1];
    res.setHeader('Cache-Control', 'private, no-store'); // origin đã nói rõ: không được cache
    res.setHeader('Content-Type', 'text/html');
    res.end(user ? `<h1>Tài khoản của ${user}</h1><p>Địa chỉ: 12 Lý Thường Kiệt, SĐT 09xx</p>` : '<h1>Mời đăng nhập</h1>');
    return;
  }
  if (url.pathname === '/') {
    const host = req.headers['x-forwarded-host'] ?? 'shop.example';
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.setHeader('Content-Type', 'text/html');
    res.end(`<script src="https://${host}/app.js"></script><h1>Flash sale 21:00</h1>`);
    return;
  }
  res.statusCode = 404; res.end();
}).listen(3000);
