// Timeout, retry + backoff + jitter, circuit breaker, token bucket và hàng chờ (throttling).
// Đồng hồ và số ngẫu nhiên đều giả lập để output lần nào chạy cũng giống nhau. Chạy: node resilience.ts

// PRNG có seed (mulberry32) thay cho Math.random
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

console.log("===== 1. Timeout: không chờ vô hạn =====")
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timeout sau ${ms}ms`)), ms))])
}
const slowProvider = () => new Promise<string>((r) => setTimeout(() => r("ok"), 300))
const t0 = Date.now()
await withTimeout(slowProvider(), 100).catch((e) => console.log("gọi cổng thanh toán:", e.message))
console.log(`→ trả lỗi sau ~${Math.round((Date.now() - t0) / 100) * 100}ms thay vì giữ thread/connection 300ms`)

console.log("\n===== 2. Retry: exponential backoff, có và không có jitter =====")
// Công thức giống RetryService của flash-sale: min(max, base * 2^(n-1)), full jitter = random * exp
const base = 200, max = 5000
const expDelay = (n: number) => Math.min(max, base * 2 ** (n - 1))
const rand = rng(42)
for (const client of ["A", "B", "C"]) {
  const plain = [1, 2, 3, 4].map(expDelay)
  const jitter = [1, 2, 3, 4].map((n) => Math.round(rand() * expDelay(n)))
  console.log(`client ${client}: không jitter ${plain.join("/")}ms | full jitter ${jitter.join("/")}ms`)
}
const retryable = (status: number) => status >= 500 || status === 429 || status === 408
console.log("retry 503?", retryable(503), "| retry 400?", retryable(400), "| retry 409?", retryable(409))

console.log("\n===== 3. Circuit breaker =====")
type State = "CLOSED" | "OPEN" | "HALF_OPEN"
let clock = 0
class Breaker {
  state: State = "CLOSED"
  failures = 0
  openedAt = 0
  calls = 0 // số lần thật sự gọi xuống dependency
  threshold: number
  resetMs: number
  constructor(threshold: number, resetMs: number) {
    this.threshold = threshold
    this.resetMs = resetMs
  }
  fire(dependencyUp: boolean): string {
    if (this.state === "OPEN") {
      if (clock - this.openedAt < this.resetMs) return "fail fast (không gọi)"
      this.state = "HALF_OPEN"
    }
    this.calls++
    const trial = this.state === "HALF_OPEN" ? " (thử 1 request)" : ""
    if (dependencyUp) {
      this.state = "CLOSED"
      this.failures = 0
      return "ok" + trial
    }
    this.failures++
    if (this.state === "HALF_OPEN" || this.failures >= this.threshold) {
      this.state = "OPEN"
      this.openedAt = clock
    }
    return "lỗi" + trial
  }
}
const cb = new Breaker(3, 30_000)
const timeline: [number, boolean][] = [[0, false], [1, false], [2, false], [3, false], [10, false], [33, false], [64, true], [65, true]]
for (const [sec, up] of timeline) {
  clock = sec * 1000
  const r = cb.fire(up)
  console.log(`t=${String(sec).padStart(2)}s dependency ${up ? "sống" : "chết"} → ${r.padEnd(24)} state=${cb.state}`)
}
console.log(`8 request, chỉ ${cb.calls} lần gọi thật xuống dependency`)

console.log("\n===== 4. Rate limiting: token bucket (như token-bucket.lua) =====")
const bucket = { capacity: 10, rate: 0.166, tokens: 10, updated: 0 }
function consume(nowMs: number) {
  const elapsed = Math.max(0, (nowMs - bucket.updated) / 1000)
  bucket.tokens = Math.min(bucket.capacity, bucket.tokens + elapsed * bucket.rate)
  bucket.updated = nowMs
  if (bucket.tokens >= 1) { bucket.tokens -= 1; return { allowed: true, retryAfter: 0 } }
  return { allowed: false, retryAfter: Math.ceil((1 - bucket.tokens) / bucket.rate) }
}
const burst = Array.from({ length: 12 }, () => consume(0))
console.log(`12 request cùng lúc: ${burst.filter((r) => r.allowed).length} qua, ${burst.filter((r) => !r.allowed).length} bị 429, Retry-After: ${burst.at(-1)!.retryAfter}s`)
console.log("sau 7 giây:", consume(7000).allowed ? "qua (đã hồi 1 token)" : "429")

console.log("\n===== 5. Throttling: hàng chờ flash sale, mỗi 5s cho 50 người vào =====")
let queue = 120
const batch = 50, intervalSec = 5
const estimate = (pos: number) => Math.ceil(pos / batch) * intervalSec
console.log(`người thứ 1 chờ ~${estimate(1)}s, người thứ 51 ~${estimate(51)}s, người thứ 120 ~${estimate(120)}s`)
for (let tick = 1; queue > 0; tick++) {
  const admitted = Math.min(batch, queue)
  queue -= admitted
  console.log(`tick ${tick} (t=${tick * intervalSec}s): cho ${admitted} người vào checkout, còn ${queue} người chờ`)
}
console.log("không ai bị từ chối; tải vào checkout luôn ≤ 50 người / 5s")
