// Mô phỏng pipeline của một request NestJS bằng node:http thuần (không cần cài gì).
// Chạy: node pipeline.ts   (Node 22.6+ có type stripping)
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { randomUUID } from "node:crypto"

class HttpError extends Error {
  status: number
  body: { code?: string; message: string | string[] }
  constructor(status: number, body: { code?: string; message: string | string[] }) {
    super(Array.isArray(body.message) ? body.message[0] : body.message)
    this.status = status
    this.body = body
  }
}

type Ctx = { req: IncomingMessage; res: ServerResponse; body: any; correlationId: string }

// 1. Middleware: gắn correlation id, đọc từ header nếu upstream đã gửi
function correlationId(ctx: Ctx) {
  ctx.correlationId = (ctx.req.headers["x-correlation-id"] as string) || `req-${randomUUID().slice(0, 8)}`
  ctx.res.setHeader("X-Correlation-ID", ctx.correlationId)
}

// 2. Guard: không có Bearer token thì dừng ngay với 401
function authGuard(ctx: Ctx) {
  const [type, token] = (ctx.req.headers.authorization ?? "").split(" ")
  if (type !== "Bearer" || token !== "demo-token") throw new HttpError(401, { code: "UNAUTHENTICATED", message: "Token không tồn tại" })
}

// 3. Pipe: validate body, gom mọi lỗi vào một mảng
function validate(ctx: Ctx) {
  const errors: string[] = []
  if (!Array.isArray(ctx.body?.items) || ctx.body.items.length === 0) errors.push("items không được rỗng")
  for (const key of Object.keys(ctx.body ?? {})) if (key !== "items") errors.push(`property ${key} should not exist`)
  if (errors.length) throw new HttpError(400, { message: errors })
}

// 4. Handler: nghiệp vụ checkout
const stock: Record<string, number> = { "SKU-1": 3, "SKU-2": 0 }
function checkout(ctx: Ctx) {
  for (const sku of ctx.body.items) {
    if (!stock[sku]) throw new HttpError(409, { code: "OUT_OF_STOCK", message: "Rất tiếc, sản phẩm đã hết hàng" })
  }
  return { orderId: "ord_1", total: "1990000.00" } // tiền gửi dạng string, không dùng number
}

// 5a. Filter giống flash-sale: chỉ giữ message (phần tử đầu), làm rơi code
function envelopeFilter(err: unknown) {
  const status = err instanceof HttpError ? err.status : 500
  const m = err instanceof HttpError ? err.body.message : "Internal server error"
  return { status, type: "application/json", body: { success: false, data: null, msg: Array.isArray(m) ? m[0] : m } }
}

// 5b. Filter theo RFC 9457 (Problem Details): giữ code và toàn bộ lỗi
function problemFilter(err: unknown, ctx: Ctx) {
  const status = err instanceof HttpError ? err.status : 500
  const m = err instanceof HttpError ? err.body.message : "Internal server error"
  return {
    status,
    type: "application/problem+json",
    body: {
      type: `https://example.com/problems/${(err as HttpError).body?.code ?? "error"}`,
      title: Array.isArray(m) ? "Validation failed" : m,
      status,
      code: (err as HttpError).body?.code ?? (status === 400 ? "VALIDATION_FAILED" : "ERROR"),
      errors: Array.isArray(m) ? m : undefined,
      correlationId: ctx.correlationId,
    },
  }
}

function app(filter: typeof problemFilter) {
  return createServer(async (req, res) => {
    let raw = ""
    for await (const chunk of req) raw += chunk
    const ctx: Ctx = { req, res, body: raw ? JSON.parse(raw) : undefined, correlationId: "" }
    try {
      correlationId(ctx)
      if (req.method !== "POST" || req.url !== "/api/v1/checkout") throw new HttpError(404, { code: "NOT_FOUND", message: "Not Found" })
      authGuard(ctx)
      validate(ctx)
      const data = checkout(ctx)
      // 6. Interceptor: bọc kết quả vào envelope thành công
      res.writeHead(201, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ success: true, data, msg: "Đặt hàng thành công" }))
    } catch (err) {
      const out = filter(err, ctx)
      res.writeHead(out.status, { "Content-Type": out.type })
      res.end(JSON.stringify(out.body))
    }
  })
}

// Logic hiển thị lỗi của frontend (giống trang vouchers trong flash-sale)
function getErrorMessage(status: number, data: any): string {
  if (typeof data?.message === "string") return data.message
  if (data?.code) return data.code
  return `Request failed with status code ${status}` // message mặc định của axios
}

// Frontend sau khi sửa: dịch theo code, không phụ thuộc câu chữ của backend
const MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: "Bạn cần đăng nhập lại",
  OUT_OF_STOCK: "Sản phẩm vừa hết hàng, bạn chọn sản phẩm khác nhé",
}
function getProblemMessage(data: any): string {
  return MESSAGES[data?.code] ?? data?.title ?? "Có lỗi xảy ra"
}

let n = 0
async function call(port: number, label: string, init: { auth?: boolean; body: unknown }, problem = false) {
  const res = await fetch(`http://localhost:${port}/api/v1/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Correlation-ID": `req-demo-${++n}`,
      ...(init.auth === false ? {} : { Authorization: "Bearer demo-token" }),
    },
    body: JSON.stringify(init.body),
  })
  const data = await res.json()
  console.log(`\n# ${label}`)
  console.log(`${res.status} ${res.statusText} | ${res.headers.get("content-type")} | X-Correlation-ID: ${res.headers.get("x-correlation-id")}`)
  console.log(JSON.stringify(data))
  if (!res.ok) console.log(`→ người dùng thấy: "${problem ? getProblemMessage(data) : getErrorMessage(res.status, data)}"`)
}

for (const [name, filter] of [["Filter kiểu flash-sale", envelopeFilter], ["Filter RFC 9457", problemFilter]] as const) {
  const server = app(filter as typeof problemFilter).listen(0)
  const port = (server.address() as { port: number }).port
  console.log(`\n========== ${name} ==========`)
  if (name.startsWith("Filter kiểu")) await call(port, "Thành công", { body: { items: ["SKU-1"] } })
  const problem = name === "Filter RFC 9457"
  await call(port, "Thiếu token", { auth: false, body: { items: ["SKU-1"] } }, problem)
  await call(port, "Body sai", { body: { items: [], coupon: "X" } }, problem)
  await call(port, "Hết hàng", { body: { items: ["SKU-2"] } }, problem)
  server.close()
}

// JSON chỉ có một kiểu number (IEEE 754 double)
console.log("\n========== JSON và tiền ==========")
console.log("0.1 + 0.2 =", 0.1 + 0.2)
console.log('JSON.parse(\'{"id": 9007199254740993}\').id =', JSON.parse('{"id": 9007199254740993}').id)
console.log('JSON.parse(\'{"total": "1990000.00"}\').total =', JSON.parse('{"total": "1990000.00"}').total)
