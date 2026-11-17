// Ba thí nghiệm nhỏ về các kiểu API. Chạy: node styles.ts
import { createHmac, timingSafeEqual } from "node:crypto"

// ---------- 1. REST vs GraphQL: lấy đúng phần mình cần ----------
const order = {
  id: "ord_1", status: "PAID", total: "1990000.00", currency: "VND",
  shippingAddress: { line1: "12 Nguyễn Huệ", ward: "Bến Nghé", city: "TP.HCM", phone: "0900000000" },
  items: [
    { sku: "SKU-1", name: "Tai nghe", price: "990000.00", qty: 1, images: ["a.jpg", "b.jpg", "c.jpg"] },
    { sku: "SKU-2", name: "Ốp lưng", price: "500000.00", qty: 2, images: ["d.jpg", "e.jpg"] },
  ],
  createdAt: "2026-11-18T08:00:00Z", updatedAt: "2026-11-18T08:05:00Z",
}
type Selection = { [k: string]: true | Selection }
function select(value: any, sel: Selection): any {
  if (Array.isArray(value)) return value.map((v) => select(v, sel))
  return Object.fromEntries(Object.entries(sel).map(([k, s]) => [k, s === true ? value[k] : select(value[k], s)]))
}
// query { order(id: "ord_1") { status items { name qty } } }
const gql = select(order, { status: true, items: { name: true, qty: true } })
console.log("REST    GET /orders/ord_1 →", Buffer.byteLength(JSON.stringify(order)), "bytes")
console.log("GraphQL { status items { name qty } } →", Buffer.byteLength(JSON.stringify(gql)), "bytes:", JSON.stringify(gql))

// ---------- 2. gRPC: protobuf mã hóa nhị phân ----------
function varint(n: number): number[] {
  const out: number[] = []
  while (n > 127) { out.push((n & 127) | 128); n >>>= 7 }
  out.push(n)
  return out
}
// message OrderStatus { uint32 id = 1; Status status = 2; }  với enum Status { PENDING = 0; PAID = 2; }
const proto = Buffer.from([(1 << 3) | 0, ...varint(150), (2 << 3) | 0, ...varint(2)])
const json = JSON.stringify({ id: 150, status: "PAID" })
console.log(`\nprotobuf: ${proto.length} bytes [${[...proto].map((b) => b.toString(16).padStart(2, "0")).join(" ")}]`)
console.log(`JSON:     ${Buffer.byteLength(json)} bytes ${json}`)

// ---------- 3. Webhook: xác thực chữ ký và chống giao trùng ----------
const SECRET = "whsec_demo"
const sign = (raw: string) => createHmac("sha256", SECRET).update(raw).digest("hex")
const processed = new Set<string>() // flash-sale dùng UNIQUE(providerRef) trong DB
let paidOrders = 0

function receiveWebhook(raw: string, signature: string): number {
  const expected = Buffer.from(sign(raw), "hex")
  const got = Buffer.from(signature, "hex")
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return 401
  const event = JSON.parse(raw)
  if (processed.has(event.transId)) return 204 // đã xử lý: vẫn ACK để bên gửi thôi retry
  processed.add(event.transId)
  paidOrders++
  return 204
}

const raw = JSON.stringify({ transId: "T-9001", orderId: "ord_1", amount: 1990000, resultCode: 0 })
const sig = sign(raw)
console.log("\ngiao lần 1           →", receiveWebhook(raw, sig))
console.log("giao lại (retry)     →", receiveWebhook(raw, sig))
const forged = raw.replace("1990000", "1000")
console.log("body bị sửa số tiền  →", receiveWebhook(forged, sig))
console.log("số đơn được đánh dấu đã trả:", paidOrders)

// ---------- 4. Polling vs WebSocket push trong hàng chờ flash sale ----------
// Vị trí của user đổi ở giây 10, 20, 30 (mỗi lần worker gọi một batch). Theo dõi 60 giây.
const changesAt = [10, 20, 30]
const pollEvery = 2
const polls = 60 / pollEvery
const useful = changesAt.length
console.log(`\npolling mỗi ${pollEvery}s: ${polls} request, ${useful} lần có tin mới, ${polls - useful} lần thừa`)
console.log(`WebSocket: 1 kết nối, ${useful} message, độ trễ ~0s thay vì tới ${pollEvery}s`)
