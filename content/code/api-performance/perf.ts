// Pagination, caching, filtering và load balancing qua bốn thí nghiệm nhỏ. Chạy: node perf.ts

console.log("===== 1. Offset vs cursor khi có sản phẩm mới chen vào =====")
type P = { id: string; createdAt: number }
let products: P[] = Array.from({ length: 7 }, (_, i) => ({ id: `p${i + 1}`, createdAt: 100 + i }))
const newestFirst = () => [...products].sort((a, b) => b.createdAt - a.createdAt || b.id.localeCompare(a.id))
const offsetPage = (offset: number, limit: number) => newestFirst().slice(offset, offset + limit)
// Keyset giống flash-sale: WHERE (createdAt < c.createdAt) OR (createdAt = c.createdAt AND id < c.id)
const cursorPage = (c: P | null, limit: number) =>
  newestFirst().filter((p) => !c || p.createdAt < c.createdAt || (p.createdAt === c.createdAt && p.id < c.id)).slice(0, limit)

const o1 = offsetPage(0, 3)
const c1 = cursorPage(null, 3)
products.push({ id: "p8", createdAt: 200 }) // seller đăng sản phẩm mới khi user đang đọc trang 1
const o2 = offsetPage(3, 3)
const c2 = cursorPage(c1.at(-1)!, 3)
console.log("offset: trang 1", o1.map((p) => p.id).join(","), "| trang 2", o2.map((p) => p.id).join(","), "← p5 lặp lại")
console.log("cursor: trang 1", c1.map((p) => p.id).join(","), "| trang 2", c2.map((p) => p.id).join(","), "← không lặp")

console.log("\n===== 2. Cache-aside và cache stampede =====")
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function run(withLock: boolean) {
  const cache = new Map<string, string>()
  const locks = new Set<string>()
  let dbQueries = 0
  const queryDb = async () => { dbQueries++; await sleep(50); return "kết quả tìm kiếm" }
  async function getOrFetch(key: string) {
    const hit = cache.get(key)
    if (hit) return hit
    if (withLock) {
      if (locks.has(key)) { // như SET lock NX thất bại: chờ người đang lấy
        for (let i = 0; i < 10; i++) { await sleep(20); const v = cache.get(key); if (v) return v }
      }
      locks.add(key)
    }
    const v = await queryDb()
    cache.set(key, v)
    locks.delete(key)
    return v
  }
  await Promise.all(Array.from({ length: 100 }, () => getOrFetch("search:tai nghe")))
  await getOrFetch("search:tai nghe") // request thứ 101 sau khi cache đã ấm
  return dbQueries
}
console.log("100 request đồng thời khi cache trống, không lock →", await run(false), "query xuống DB")
console.log("100 request đồng thời khi cache trống, có lock   →", await run(true), "query xuống DB")

console.log("\n===== 3. Filtering: query string luôn là string =====")
const qs = new URLSearchParams("isFlashSale=false&minPrice=100000&sort=price_asc")
const naive = Boolean(qs.get("isFlashSale")) // @Type(() => Boolean) làm đúng việc này
const strict = qs.get("isFlashSale") === "true"
console.log(`?isFlashSale=false → Boolean("false") = ${naive}, so sánh === "true" = ${strict}`)
console.log(`?minPrice=100000 → typeof = ${typeof qs.get("minPrice")}, Number() = ${Number(qs.get("minPrice"))}`)
const SORTS: Record<string, (a: any, b: any) => number> = {
  price_asc: (a, b) => a.price - b.price,
  newest: (a, b) => b.createdAt - a.createdAt,
}
const sortKey = qs.get("sort")!
console.log(`sort=${sortKey} có trong whitelist?`, sortKey in SORTS, "| sort=password?", "password" in SORTS)

console.log("\n===== 4. Load balancing: round robin vs least connections =====")
// Request đến mỗi 10ms; cứ request thứ 3 là request nặng 300ms (vd export báo cáo), còn lại 20ms.
const reqs = Array.from({ length: 30 }, (_, i) => ({ at: i * 10, dur: i % 3 === 0 ? 300 : 20 }))
function simulate(pick: (active: number[][], i: number, at: number) => number) {
  const busy: number[][] = [[], [], []] // thời điểm kết thúc của các request đang chạy trên mỗi pod
  let peak = [0, 0, 0]
  reqs.forEach((r, i) => {
    busy.forEach((b, k) => (busy[k] = b.filter((end) => end > r.at)))
    const pod = pick(busy, i, r.at)
    busy[pod].push(r.at + r.dur)
    peak = peak.map((p, k) => Math.max(p, busy[k].length))
  })
  return peak
}
const rr = simulate((_, i) => i % 3)
const lc = simulate((busy) => busy.map((b) => b.length).indexOf(Math.min(...busy.map((b) => b.length))))
console.log("round robin       → số request đồng thời cao nhất mỗi pod:", rr.join(" / "))
console.log("least connections → số request đồng thời cao nhất mỗi pod:", lc.join(" / "))
