// Bộ che PII của flash-sale (rút gọn) và bốn chỗ nó để lọt, chạy thật: node pii-mask.ts
const PII = new Set(['email', 'phone', 'password', 'token', 'refreshToken']);
const LEVEL = Symbol.for('level'); // winston giữ mức log ở một khóa Symbol như thế này

function maskValue(key: string, value: unknown): string {
  if (typeof value === 'string' && /email/i.test(key) && value.includes('@')) {
    const [local, domain] = value.split('@');
    return `${local.slice(0, 2)}***@${domain}`;
  }
  return '********';
}

// Bản gốc: duyệt bằng Object.entries, tạo object mới.
function maskPiiDeep(input: unknown): unknown {
  if (input === null || typeof input !== 'object') return input;
  if (Array.isArray(input)) return input.map(maskPiiDeep);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) out[k] = PII.has(k) ? maskValue(k, v) : maskPiiDeep(v);
  return out;
}

// Bản sửa: giữ khóa Symbol, đọc được Error, chịu được vòng tham chiếu, quét cả chuỗi message.
const EMAIL_RE = /([A-Za-z0-9._%+-]{1,2})[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
function maskSafe(input: unknown, seen = new WeakSet<object>()): unknown {
  if (typeof input === 'string') return input.replace(EMAIL_RE, '$1***@$2');
  if (input === null || typeof input !== 'object') return input;
  if (seen.has(input)) return '[vòng tham chiếu]';
  seen.add(input);
  if (input instanceof Error) return { name: input.name, message: maskSafe(input.message, seen) };
  if (Array.isArray(input)) return input.map((v) => maskSafe(v, seen));
  const out: Record<string | symbol, unknown> = {};
  for (const k of Reflect.ownKeys(input)) {
    const v = (input as Record<string | symbol, unknown>)[k];
    out[k] = typeof k === 'string' && PII.has(k) ? maskValue(k, v) : maskSafe(v, seen);
  }
  return out;
}

function show(title: string, info: Record<string | symbol, unknown>) {
  console.log(`\n${title}`);
  for (const [name, fn] of [['gốc', maskPiiDeep], ['sửa', maskSafe]] as const) {
    try {
      const r = fn(info) as Record<string | symbol, unknown>;
      console.log(`  ${name}: ${JSON.stringify(r)}  | level Symbol: ${String(r[LEVEL])}`);
    } catch (e) {
      console.log(`  ${name}: NÉM ${(e as Error).constructor.name}: ${(e as Error).message}`);
    }
  }
}

show('1) PII nằm trong metadata', { [LEVEL]: 'info', level: 'info', message: 'login', email: 'an.nguyen@example.com', token: 'eyJhbGci' });
show('2) PII nằm trong chính câu message', { [LEVEL]: 'warn', level: 'warn', message: 'gửi mail tới an.nguyen@example.com thất bại' });
show('3) Error làm metadata', { [LEVEL]: 'error', level: 'error', message: 'lưu đơn lỗi', err: new Error('timeout khi ghi bảng orders') });
const order: Record<string, unknown> = { id: 'o-1' };
order.self = order;
show('4) Object có vòng tham chiếu', { [LEVEL]: 'info', level: 'info', message: 'đơn mới', order });

// Đo chi phí: 200 000 lần che một object log cỡ thường.
const sample = { [LEVEL]: 'info', level: 'info', message: 'HTTP Request', method: 'POST', url: '/orders', statusCode: 201, durationMs: 12, user: { id: 'u-9', email: 'an.nguyen@example.com' } };
for (const [name, fn] of [['gốc', maskPiiDeep], ['sửa', maskSafe]] as const) {
  for (let i = 0; i < 20_000; i++) fn(sample); // làm nóng
  const t = performance.now();
  for (let i = 0; i < 200_000; i++) fn(sample);
  const ms = performance.now() - t;
  console.log(`\n${name}: ${(ms * 1000 / 200_000).toFixed(2)} µs mỗi dòng log`);
}
