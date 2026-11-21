// Bốn thí nghiệm so cách Shopify xử lý flash sale với dự án flash-sale của mình.
// Mọi thứ đều giả lập trong bộ nhớ, số ngẫu nhiên có seed nên lần nào chạy cũng ra cùng kết quả.
// Chạy: node sim.ts  (Node 22.6+)

// PRNG có seed (mulberry32) thay cho Math.random
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor((p / 100) * xs.length))]

// ---------------------------------------------------------------------------
console.log("===== 1. Hàng chờ kiểu xổ số (Shopify 2016) và hàng chờ theo giờ đến (Shopify 2017) =====")
// 2.000 người đến trong 60 giây đầu. Mỗi 5 giây cửa chỉ nhận 50 người (leaky bucket).
// Xổ số: ai đang chờ cũng hỏi lại, cửa nhận ngẫu nhiên 50 người trong số đó.
// Theo giờ đến: cửa nhận 50 người có dấu thời gian sớm nhất (giống ZPOPMIN trong flash-sale).
function simulateQueue(mode: "lottery" | "fifo") {
  const rand = rng(7)
  const arrivals = Array.from({ length: 2000 }, () => Math.floor(rand() * 60))
  const waiting: number[] = [] // lưu giờ đến
  const waits: number[] = []
  let next = 0
  const order = arrivals.map((t, i) => ({ t, i })).sort((a, b) => a.t - b.t)
  for (let tick = 5; waits.length < arrivals.length; tick += 5) {
    while (next < order.length && order[next].t < tick) waiting.push(order[next++].t)
    let admit = Math.min(50, waiting.length)
    while (admit-- > 0) {
      const idx = mode === "fifo" ? 0 : Math.floor(rand() * waiting.length)
      const [arrivedAt] = waiting.splice(idx, 1)
      waits.push(tick - arrivedAt)
    }
  }
  return waits
}
for (const mode of ["lottery", "fifo"] as const) {
  const w = simulateQueue(mode)
  const label = mode === "lottery" ? "xổ số        " : "theo giờ đến "
  console.log(`${label}: trung vị ${pct(w, 50)}s | p95 ${pct(w, 95)}s | lâu nhất ${Math.max(...w)}s`)
}

// ---------------------------------------------------------------------------
console.log("\n===== 2. Hết hàng mà hàng chờ vẫn phát vé =====")
// 300 suất, 2.000 người đã xếp hàng, mỗi 5 giây phát 50 vé. Một nửa số người được vé thì mua.
function soldOutQueue(closeWhenSoldOut: boolean) {
  let stock = 300
  let queue = 2000
  let wastedWaitSeconds = 0
  let soldOutAt = -1
  const rand = rng(11)
  for (let tick = 5; queue > 0; tick += 5) {
    if (closeWhenSoldOut && stock === 0) {
      return { soldOutAt, told: `${queue} người còn lại được báo "hết hàng" ngay ở giây ${tick - 5}`, wastedWaitSeconds }
    }
    const batch = Math.min(50, queue)
    queue -= batch
    for (let i = 0; i < batch; i++) {
      if (stock === 0) wastedWaitSeconds += tick // chờ tới lượt chỉ để nghe "hết hàng"
      else if (rand() < 0.5) {
        stock--
        if (stock === 0) soldOutAt = tick
      }
    }
  }
  return { soldOutAt, told: "người cuối hàng tới lượt rồi mới biết hết hàng", wastedWaitSeconds }
}
const open = soldOutQueue(false)
const closed = soldOutQueue(true)
console.log(`hết hàng ở giây ${open.soldOutAt}`)
console.log(`không đóng hàng chờ: ${open.told}; tổng thời gian chờ vô ích ${Math.round(open.wastedWaitSeconds / 60)} phút-người`)
console.log(`đóng hàng chờ khi hết: ${closed.told}`)

// ---------------------------------------------------------------------------
console.log("\n===== 3. Ghi hai nơi: Redis trừ kho rồi DB tạo đơn, pod chết ở giữa =====")
// Giống flash-sale: Lua trừ kho trong Redis, sau đó transaction DB tạo đơn.
// Nếu pod chết sau Lua và trước DB, khối catch bù trừ (compensate) không bao giờ chạy.
const allocated = 100
let redisStock = allocated
const dbOrders: string[] = []
const rand3 = rng(3)
for (let i = 0; i < 100; i++) {
  redisStock-- // Lua: DECRBY thành công
  const podKilled = rand3() < 0.03 // 3% request trúng lúc pod bị tắt (deploy, OOM, node chết)
  if (!podKilled) dbOrders.push(`ord_${i}`)
}
const redisSold = allocated - redisStock
console.log(`Redis nói đã bán ${redisSold}, DB có ${dbOrders.length} đơn thật`)
console.log(`đối soát tin Redis (như hiện tại): ghi soldCount=${redisSold}, trả về kho 0 suất → ${redisSold - dbOrders.length} suất "bán ma"`)
console.log(`đối soát tin đơn trong DB:        ghi soldCount=${dbOrders.length}, trả về kho ${allocated - dbOrders.length} suất`)

// ---------------------------------------------------------------------------
console.log("\n===== 4. Trả hàng vào nhầm kệ khi đơn flash sale bị hủy =====")
// Một SKU có hai "kệ": kệ thường (total, reserved) và kệ flash sale (flashReserved, flashSold).
// Đơn thường giữ chỗ ở kệ thường; đơn flash sale đi qua kệ flash sale.
const inv = { total: 10, reserved: 0, flashReserved: 5, flashSold: 0 }
const available = () => inv.total - inv.reserved
// 3 khách thường đặt hàng, mỗi người giữ 3 cái: còn bán được 1
for (let i = 0; i < 3; i++) inv.reserved += 3
// 1 đơn flash sale được tạo: kệ flash sale ghi nhận
inv.flashReserved -= 1
inv.flashSold += 1
console.log(`trước khi hủy: kệ thường còn bán được ${available()}, kệ flash sale đã bán ${inv.flashSold}`)
// Đơn flash sale quá 15 phút chưa trả tiền → hủy → luồng chung gọi releaseStock trên KỆ THƯỜNG
inv.reserved = Math.max(inv.reserved - 1, 0)
console.log(`sau khi hủy:   kệ thường còn bán được ${available()} (tăng 1 dù không ai trả hàng), kệ flash sale vẫn ghi đã bán ${inv.flashSold}`)
console.log("→ kệ thường có thể bán quá số hàng thật; suất flash sale bị hủy thì mất luôn")
