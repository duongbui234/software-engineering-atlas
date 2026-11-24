// Trường log có cấu trúc, mức log, và bộ đệm khi kho log chết. Chạy thật: node structured-fields.ts

// Bộ sinh ngẫu nhiên mulberry32: trạng thái là số nguyên 32 bit, mọi phép nhân qua Math.imul nên không mất chính xác.
let seed = 42;
function mix32(a: number): number { let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (t ^ (t >>> 14)) >>> 0; }
const rand = () => ((seed = (seed + 0x6d2b79f5) | 0), mix32(seed) >>> 1) / 2 ** 31;

// 1) duration lưu dạng chuỗi "12ms" (như interceptor) và dạng số durationMs.
const N = 10_000;
const ms = Array.from({ length: N }, () => Math.round(rand() < 0.9 ? 5 + rand() * 40 : 80 + rand() * 900));
const asString = ms.map((d) => `${d}ms`);
const p95 = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length * 0.95)];
const p95str = [...asString].sort()[Math.floor(N * 0.95)]; // kho log coi trường chuỗi là keyword: so theo chữ
console.log(`p95 đúng (số):           ${p95(ms)} ms`);
console.log(`p95 khi sắp xếp chuỗi:  ${p95str}`);
console.log(`"100ms" < "20ms" theo chữ? ${'100ms' < '20ms'}`);

// 2) Mức log: winston mặc định level 'info' (thứ tự npm: error 0, warn 1, info 2, http 3, verbose 4, debug 5, silly 6).
const LEVELS = { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 } as const;
const passes = (threshold: keyof typeof LEVELS, lvl: keyof typeof LEVELS) => LEVELS[lvl] <= LEVELS[threshold];
for (const t of ['info', 'debug'] as const)
  console.log(`ngưỡng ${t.padEnd(5)}: ` + (Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map((l) => `${l}=${passes(t, l) ? 'ghi' : 'bỏ'}`).join(' '));

// 3) Kho log chết 60 giây, app vẫn ghi 2000 dòng/giây, mỗi dòng ~400 byte.
const RATE = 2000, BYTES = 400, OUTAGE = 60, CAP = 20_000;
let unbounded = 0, bounded = 0, dropped = 0;
for (let s = 0; s < OUTAGE; s++) for (let i = 0; i < RATE; i++) {
  unbounded++;
  if (bounded < CAP) bounded++; else dropped++;
}
const mb = (n: number) => ((n * BYTES) / 1024 / 1024).toFixed(1);
console.log(`đệm không giới hạn: ${unbounded} dòng ≈ ${mb(unbounded)} MB trong RAM, vẫn tăng tiếp`);
console.log(`đệm giới hạn ${CAP}: ${bounded} dòng ≈ ${mb(bounded)} MB, bỏ ${dropped} dòng và đếm được số bỏ`);
