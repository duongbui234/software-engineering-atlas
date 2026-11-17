// JWT HS256 tự viết bằng node:crypto + refresh token rotation có phát hiện reuse.
// Chạy: node tokens.ts
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto"

const SECRET = "dev-secret-chi-de-demo"
const b64url = (v: string | Buffer) => Buffer.from(v).toString("base64url")
let now = 1_800_000_000 // đồng hồ giả (giây) để output ổn định

function sign(payload: object, ttlSec: number): string {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = b64url(JSON.stringify({ ...payload, iat: now, exp: now + ttlSec }))
  const sig = createHmac("sha256", SECRET).update(`${header}.${body}`).digest("base64url")
  return `${header}.${body}.${sig}`
}

function verify(token: string): { ok: true; claims: any } | { ok: false; reason: string } {
  const [h, b, s] = token.split(".")
  const header = JSON.parse(Buffer.from(h, "base64url").toString())
  if (header.alg !== "HS256") return { ok: false, reason: `alg ${header.alg} không được chấp nhận` }
  const expected = createHmac("sha256", SECRET).update(`${h}.${b}`).digest()
  const got = Buffer.from(s ?? "", "base64url")
  if (got.length !== expected.length || !timingSafeEqual(got, expected)) return { ok: false, reason: "chữ ký sai" }
  const claims = JSON.parse(Buffer.from(b, "base64url").toString())
  if (claims.exp <= now) return { ok: false, reason: "token hết hạn" }
  return { ok: true, claims }
}

console.log("===== 1. JWT chỉ được ký, không được mã hóa =====")
const access = sign({ sub: "user_42", role: "BUYER", sid: "s1" }, 15 * 60)
console.log("access token:", access.slice(0, 40) + "…")
console.log("ai cũng đọc được payload:", Buffer.from(access.split(".")[1], "base64url").toString())

console.log("\n===== 2. Sửa payload hoặc đổi alg đều bị chặn =====")
const [h, b, s] = access.split(".")
const evil = b64url(JSON.stringify({ ...JSON.parse(Buffer.from(b, "base64url").toString()), role: "ADMIN" }))
console.log("đổi role thành ADMIN  →", verify(`${h}.${evil}.${s}`))
const none = `${b64url(JSON.stringify({ alg: "none", typ: "JWT" }))}.${evil}.`
console.log("alg: none, bỏ chữ ký  →", verify(none))
console.log("token hợp lệ          →", verify(access).ok)
now += 16 * 60
console.log("16 phút sau           →", verify(access))

console.log("\n===== 3. Refresh token rotation + phát hiện reuse =====")
// Giống flash-sale: Redis lưu hash của refresh token hiện hành theo sid, GETDEL khi dùng.
const store = new Map<string, string>() // refresh_token:{sid} -> sha256(token)
const sessions = new Set<string>() // session:{sid}
const sha = (t: string) => createHash("sha256").update(t).digest("hex")

function login(sid: string) {
  sessions.add(sid)
  const refresh = `rt_${randomBytes(6).toString("hex")}`
  store.set(sid, sha(refresh))
  return refresh
}
function refresh(sid: string, token: string, who: string) {
  if (!sessions.has(sid)) return console.log(`${who}: 401, phiên đã bị thu hồi`)
  const stored = store.get(sid)
  store.delete(sid) // GETDEL: token chỉ dùng được một lần
  if (stored !== sha(token)) {
    sessions.delete(sid) // reuse → thu hồi cả phiên
    return console.log(`${who}: 401, refresh token đã dùng rồi → REUSE, thu hồi phiên ${sid}`)
  }
  const next = `rt_${randomBytes(6).toString("hex")}`
  store.set(sid, sha(next))
  console.log(`${who}: 200, nhận refresh token mới`)
  return next
}

const r1 = login("s1")
const stolen = r1 // kẻ gian chép được r1 (XSS, log, máy bị nhiễm…)
const r2 = refresh("s1", r1, "người dùng refresh") as string
refresh("s1", stolen, "kẻ gian dùng r1")
refresh("s1", r2, "người dùng refresh lần sau")

console.log("\n===== 4. API key: lưu hash, so khớp bằng hash =====")
const apiKey = "sk_demo_" + "a1b2c3d4e5f6"
const keyDb = new Map([[sha(apiKey), { owner: "shop_7", scopes: ["orders:read"] }]])
console.log("key đúng →", keyDb.get(sha(apiKey)))
console.log("key sai  →", keyDb.get(sha("sk_demo_000000000000")) ?? "401")

console.log("\n===== 5. CORS chỉ là luật của trình duyệt =====")
const ALLOWED = new Set(["https://shop.example.com"])
function preflight(origin: string, method: string) {
  if (!ALLOWED.has(origin)) return "không trả Access-Control-Allow-Origin → trình duyệt chặn JS đọc response"
  return `Access-Control-Allow-Origin: ${origin}, Allow-Methods: ${method}, Allow-Credentials: true`
}
console.log("từ shop.example.com →", preflight("https://shop.example.com", "POST"))
console.log("từ evil.example     →", preflight("https://evil.example", "POST"))
console.log("curl/Postman        → không gửi preflight; server vẫn nhận request như thường")
