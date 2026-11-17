// Helpers dùng chung cho component và frame của theme Atlas.
// Viết bằng ESM thuần (không cần bước build) để Quartz nạp trực tiếp như plugin cục bộ.

export const fm = (f) => (f && f.frontmatter) || {}

export const TYPE_LABEL = { learn: "Bài học", code: "Đọc code dự án", note: "Ghi chú ngắn" }
export const LEVEL_LABEL = { beginner: "Cơ bản", intermediate: "Trung bình", advanced: "Nâng cao" }

/** Đường dẫn tương đối từ trang `from` tới trang `to` (theo quy ước slug của Quartz). */
export function pathToRoot(slug) {
  const depth = String(slug).split("/").length - 1
  return depth === 0 ? "." : Array(depth).fill("..").join("/")
}
export function simplifySlug(slug) {
  if (slug === "index") return ""
  if (slug.endsWith("/index")) return slug.slice(0, -"index".length)
  return slug
}
export function rel(from, to) {
  const target = simplifySlug(to)
  return `${pathToRoot(from)}/${target}`
}

export const pad = (n, width = 2) => String(n).padStart(width, "0")

export function toDate(value) {
  if (!value) return undefined
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d
}
export function pageDate(f) {
  return toDate(fm(f).date) || toDate(f.dates && f.dates.created)
}
export const fmtDay = (d) => (d ? `${pad(d.getDate())}.${pad(d.getMonth() + 1)}` : "")
export const fmtFull = (d) => (d ? `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}` : "")

export const isIndex = (f) => f.slug === "index"
const isFolderIndex = (f) => typeof f.slug === "string" && f.slug.endsWith("/index")
export const isPost = (f) => typeof f.slug === "string" && f.slug.startsWith("posts/") && !isFolderIndex(f)
export const isConcept = (f) => typeof f.slug === "string" && f.slug.startsWith("concepts/") && !isFolderIndex(f)
export const isHub = (f) => Array.isArray(fm(f).stations) && !!fm(f).series
// draft đã bị Quartz loại khỏi build (trừ khi drafts.publish bật để xem trước)
export const isListed = (f) => f.unlisted !== true

export function hubs(allFiles) {
  return allFiles.filter(isHub)
}
export function hubFor(allFiles, seriesId) {
  return hubs(allFiles).find((h) => fm(h).series === seriesId)
}

/** Các bài (posts/) của một series, theo số ga. */
export function seriesParts(allFiles, seriesId) {
  return allFiles
    .filter((f) => isPost(f) && isListed(f) && fm(f).series === seriesId && fm(f).part)
    .sort((a, b) => Number(fm(a).part) - Number(fm(b).part))
}

/** Trạng thái tuyến: ga nào đã đi, ga hiện tại (ga đã viết mới nhất). */
export function lineState(allFiles, hub) {
  const id = fm(hub).series
  const stations = fm(hub).stations || []
  const parts = seriesParts(allFiles, id)
  const byPart = new Map(parts.map((p) => [Number(fm(p).part), p]))
  let latest
  for (const p of parts) {
    if (!latest || (pageDate(p) || 0) >= (pageDate(latest) || 0)) latest = p
  }
  const herePart = latest ? Number(fm(latest).part) : undefined
  return {
    id,
    code: fm(hub).code || String(id).toUpperCase(),
    stations: stations.map((s, i) => {
      const n = i + 1
      const station = typeof s === "string" ? { name: s } : s
      const post = byPart.get(n)
      return {
        n,
        name: station.name,
        concepts: station.concepts || [],
        post,
        state: post ? (n === herePart ? "now" : "done") : "ahead",
      }
    }),
    visited: parts.length,
    herePart,
    latest,
    // số ga đã đi liên tiếp từ ga 1: đường đỏ đặc chỉ vẽ qua đoạn này
    reached: (() => {
      let k = 0
      while (byPart.has(k + 1)) k++
      return k
    })(),
  }
}

/** Mã tọa độ: <SERIES>-<NN> cho bài series, ngược lại lấy `code` trong frontmatter. */
export function coordOf(allFiles, f) {
  const m = fm(f)
  if (m.series && m.part) {
    const hub = hubFor(allFiles, m.series)
    const code = hub ? fm(hub).code || String(m.series).toUpperCase() : String(m.series).toUpperCase()
    return `${code}-${pad(m.part)}`
  }
  return m.code || null
}

export function readingMinutes(f) {
  const words = String(f.text || "").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

/** Trang có cột lề dữ liệu (tọa độ, loại, ngày…) hay không. */
export function hasMargin(f) {
  return !isIndex(f) && !isHub(f) && (isPost(f) || isConcept(f) || !!fm(f).type)
}

export function conceptBySlugTitle(allFiles) {
  const map = new Map()
  for (const f of allFiles) {
    if (!isConcept(f) || !isListed(f)) continue
    map.set(String(fm(f).title || "").toLowerCase(), f)
    for (const a of fm(f).aliases || []) map.set(String(a).toLowerCase(), f)
  }
  return map
}

/** Hash ổn định để tạo hình dạng đường đồng mức không đổi giữa các lần build. */
export function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}
