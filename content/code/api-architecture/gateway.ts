// API Gateway, versioning, OpenAPI và cái giá của một lần gọi qua mạng. Chạy: node gateway.ts
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

console.log("===== 1. API Gateway: một cửa vào, nhiều service phía sau =====")
const services: Record<string, (path: string) => Promise<unknown>> = {
  catalog: async (p) => { await sleep(40); return { service: "catalog", path: p } },
  order: async (p) => { await sleep(60); return { service: "order", path: p } },
  iam: async (p) => { await sleep(30); return { service: "iam", path: p } },
}
const routes: [string, string][] = [["/api/v1/products", "catalog"], ["/api/v1/orders", "order"], ["/api/v1/auth", "iam"]]
async function gateway(path: string, token?: string) {
  const route = routes.find(([prefix]) => path.startsWith(prefix))
  if (!route) return { status: 404 }
  if (route[1] !== "iam" && token !== "valid") return { status: 401, note: "chặn ngay ở gateway, service không phải tự kiểm tra" }
  return { status: 200, body: await services[route[1]](path.slice(route[0].length) || "/") }
}
for (const [path, token] of [["/api/v1/products/42", "valid"], ["/api/v1/orders", undefined], ["/api/v2/unknown", "valid"]] as const)
  console.log(path.padEnd(20), "→", JSON.stringify(await gateway(path, token)))

// Backend-for-frontend: trang chi tiết đơn cần cả order lẫn product
let t = Date.now()
await services.order("/1"); await services.catalog("/42")
const seq = Date.now() - t
t = Date.now()
await Promise.all([services.order("/1"), services.catalog("/42")])
const par = Date.now() - t
console.log(`client tự gọi lần lượt: ~${Math.round(seq / 10) * 10}ms | gateway gọi song song rồi gộp: ~${Math.round(par / 10) * 10}ms`)

console.log("\n===== 2. Versioning kiểu Stripe: theo ngày, chuyển đổi ở rìa =====")
// Code lõi chỉ biết dạng mới nhất. Mỗi thay đổi phá vỡ đi kèm một hàm "hạ cấp" response.
const latest = { id: "ord_1", total: { amount: "1990000", currency: "VND" }, status: "PAID" }
const changes = [
  { version: "2026-06-01", desc: "total thành object {amount, currency}", down: (o: any) => ({ ...o, total: Number(o.total.amount) }) },
  { version: "2026-09-01", desc: "status PAID đổi tên từ COMPLETED", down: (o: any) => ({ ...o, status: o.status === "PAID" ? "COMPLETED" : o.status }) },
]
function render(clientVersion: string) {
  return changes
    .filter((c) => c.version > clientVersion) // áp ngược các thay đổi mới hơn version của client
    .reverse()
    .reduce((o, c) => c.down(o), latest as any)
}
for (const v of ["2026-01-15", "2026-07-01", "2026-10-01"]) console.log(`Api-Version: ${v} →`, JSON.stringify(render(v)))

console.log("\n===== 3. OpenAPI: hợp đồng máy đọc được =====")
const spec = {
  openapi: "3.1.0",
  paths: {
    "/checkout": {
      post: {
        parameters: [{ name: "Idempotency-Key", in: "header", required: true, schema: { type: "string", maxLength: 255 } }],
        requestBody: { content: { "application/json": { schema: { type: "object", required: ["items"], properties: { items: { type: "array", minItems: 1 } } } } } },
        responses: { "201": {}, "400": {}, "401": {}, "409": {}, "422": {} },
      },
    },
  },
}
function check(headers: Record<string, string>, body: any): string[] {
  const op = spec.paths["/checkout"].post
  const errs: string[] = []
  for (const p of op.parameters) if (p.required && !headers[p.name.toLowerCase()]) errs.push(`thiếu header ${p.name}`)
  const schema = op.requestBody.content["application/json"].schema
  for (const f of schema.required) if (!(f in (body ?? {}))) errs.push(`thiếu field ${f}`)
  if (Array.isArray(body?.items) && body.items.length < schema.properties.items.minItems) errs.push("items cần ít nhất 1 phần tử")
  return errs
}
console.log("request đúng →", check({ "idempotency-key": "k1" }, { items: ["SKU-1"] }))
console.log("request sai  →", check({}, { items: [] }))
console.log("status code đã khai báo:", Object.keys(spec.paths["/checkout"].post.responses).join(", "))

console.log("\n===== 4. Microservices: mỗi JOIN cũ giờ là một lần gọi mạng =====")
// Khi tách IAM khỏi monolith, "orders JOIN users" thành gọi GetUser qua gRPC.
let rpcCalls = 0
const getUser = async (id: string) => { rpcCalls++; await sleep(5); return { id, name: `User ${id}` } }
const getUsersByIds = async (ids: string[]) => { rpcCalls++; await sleep(5); return ids.map((id) => ({ id, name: `User ${id}` })) }
const orders = Array.from({ length: 20 }, (_, i) => ({ id: `ord_${i}`, userId: `u${i % 7}` }))

for (const o of orders) await getUser(o.userId) // N+1
console.log(`N+1:   ${rpcCalls} lần gọi gRPC, tối thiểu ${rpcCalls * 5}ms chỉ riêng độ trễ mạng`)
rpcCalls = 0
const users = await getUsersByIds([...new Set(orders.map((o) => o.userId))]) // batch
console.log(`batch: ${rpcCalls} lần gọi gRPC cho ${users.length} user khác nhau, tối thiểu ${rpcCalls * 5}ms`)
