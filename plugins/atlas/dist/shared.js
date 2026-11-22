// Helpers dùng chung cho component và frame của theme Atlas.
// Viết bằng ESM thuần (không cần bước build) để Quartz nạp trực tiếp như plugin cục bộ.

import { catalogEntry, lcCode } from "./neetcode.js"

export const fm = (f) => (f && f.frontmatter) || {}

// ── Song ngữ ─────────────────────────────────────────────────────────────────
// Tiếng Việt là bản gốc ở gốc content/; bản tiếng Anh là cây song song content/en/ cùng tên file.
// Mọi danh sách (bản đồ, tuyến, bài mới) chỉ lấy trang cùng ngôn ngữ với trang đang xem.
export const LANGS = ["vi", "en"]
const slugOf = (f) => (typeof f === "string" ? f : (f && f.slug) || "")
export const langOf = (f) => (slugOf(f).startsWith("en/") || slugOf(f) === "en" ? "en" : "vi")
/** Slug bỏ tiền tố ngôn ngữ: "en/posts/x" → "posts/x". */
export const baseSlug = (f) => slugOf(f).replace(/^en\//, "")
/** Slug của cùng trang ở ngôn ngữ `lang`. */
export const slugIn = (f, lang) => (lang === "en" ? `en/${baseSlug(f)}` : baseSlug(f))
export const homeSlug = (lang) => (lang === "en" ? "en/index" : "index")
export const forLang = (allFiles, lang) => allFiles.filter((f) => langOf(f) === lang)

export const STR = {
  vi: {
    locale: "vi-VN",
    tagline: "Sổ tay học kỹ thuật phần mềm",
    route: "Lộ trình",
    mainNav: "Điều hướng chính",
    langNav: "Ngôn ngữ",
    otherLang: "English",
    otherLangShort: "EN",
    otherLangTitle: "Read this page in English",
    otherLangMissing: "Trang này chưa có bản tiếng Anh, mở trang chủ tiếng Anh",
    type: { learn: "Bài học", code: "Đọc code dự án", note: "Ghi chú ngắn", problem: "Bài luyện" },
    difficulty: { easy: "Dễ", medium: "Trung bình", hard: "Khó" },
    difficultyLabel: "Độ khó",
    stationLabel: "Ga",
    stationN: (n) => `Ga ${n}`,
    leetcode: "Đề trên LeetCode",
    stationProblems: "Các bài trong ga này",
    stationProblemsLede: (w, n) => `${w}/${n} bài đã viết. Bài mờ là bài chưa viết; link dẫn tới đề gốc trên LeetCode.`,
    notWritten: "chưa viết",
    problemSet: "Kho bài NeetCode 150",
    problemSetShort: "Kho bài",
    problemSetLink: (w, n) => `Kho bài luyện: ${w}/${n} bài đã viết`,
    problemsWritten: (w, n) => `Đã viết ${w}/${n} bài`,
    filterLine: "Tuyến",
    filterDiff: "Độ khó",
    filterAll: "Tất cả",
    filterShown: (k, n) => `Đang hiện ${k}/${n} bài.`,
    colCode: "Mã",
    colTitle: "Bài",
    colGroup: "Nhóm NeetCode",
    colStation: "Ga",
    level: { beginner: "Cơ bản", intermediate: "Trung bình", advanced: "Nâng cao" },
    walked: (n) => `Đã đi ${n} bài`,
    scaleAria: (n) => `Thước tỉ lệ: đã viết ${n} bài`,
    currentLine: (t) => `Đang đi ${t}`,
    currentState: (v, here, n, concepts) => `Đã qua ${v} ga, đang ở ga ${here} trên ${n}${concepts ? `: ${concepts}` : ""}.`,
    seeRoute: "Xem lộ trình",
    newPosts: "Bài mới",
    noPosts: "Chưa có bài nào. Bài đầu tiên sẽ xuất hiện ở đây.",
    allPosts: (n) => `Xem tất cả ${n} bài`,
    showing: (n) => ` · đang hiện ${n} bài mới nhất`,
    postInfo: "Thông tin bài",
    coord: "Tọa độ",
    kind: "Loại",
    written: "Ngày viết",
    read: "Đọc",
    minutes: (n) => `${n} phút`,
    levelLabel: "Mức",
    tags: "Thẻ",
    prevStation: (n) => `Ga trước: ${n}`,
    firstStation: "Ga đầu tiên",
    wholeLine: (v, n) => `Cả tuyến (${v}/${n})`,
    walkedStations: (v, n) => `${v} / ${n} ga`,
    walkedLabel: "Đã đi",
    concepts: "Khái niệm",
    nextStation: "Ga tiếp theo",
    lineDone: "Đã hết tuyến",
    stationsOf: (t) => `Các ga trên ${t}`,
    youAreHere: "Bạn đang ở đây",
    youAreHereLower: "bạn đang ở đây",
    visitedOn: (d) => `Đã đi${d ? ` ngày ${d}` : ""}`,
    ahead: "Chưa đi",
    legendLearn: "Bài học",
    legendCode: "Đọc code dự án",
    legendNote: "Ghi chú ngắn",
    mapTitle: "Bản đồ kiến thức",
    mapLine: (t, v, n, here) => `Tuyến ${t} đã đi ${v} trên ${n} ga${here ? `, đang ở ga ${here}` : ""}.`,
    sheetsTitle: "Mục lục bản đồ",
    sheetsLede: (n) => `${n} tuyến, mỗi tuyến một mảnh. Bản đồ phía trên là mảnh vừa đi.`,
    sheetsAll: (n) => `Xem tất cả ${n} mảnh`,
    sheetStations: (v, n) => `${v}/${n} ga`,
    sheetDone: " · đã đi hết",
    sheetHere: (n) => ` · đang ở ga ${n}`,
    looseCode: "LẺ",
    looseCount: (n) => `${n} địa danh rời`,
    looseMore: (n) => `và ${n} địa danh khác`,
    regionFromTag: (t) => `Vùng ${t}`,
    otherRegion: "Vùng khác",
    lineTitleShort: (t) => String(t || "").replace(/^Tuyến\s+/i, ""),
    updated: (d) => `Cập nhật ${d}`,
    drawnWith: "Vẽ bằng Quartz và archify",
    hubCorner: (t, n) => `${t}, ${n} ga`,
    writtenOn: (d) => `Viết ${d}`,
    railNav: "Điều hướng phụ",
    loadMore: "Tải thêm bài",
    loading: "Đang tải thêm bài…",
    loadError: "Không tải được, bấm để thử lại",
    allShown: (n) => `Đã hiện đủ ${n} bài.`,
    tagIndex: "Mục lục thẻ",
    tagCount: (n) => `${n} trang có thẻ này.`,
    tagTotal: (n) => `${n} thẻ.`,
  },
  en: {
    locale: "en-US",
    tagline: "A software engineering learning journal",
    route: "Route",
    mainNav: "Main navigation",
    langNav: "Language",
    otherLang: "Tiếng Việt",
    otherLangShort: "VI",
    otherLangTitle: "Đọc trang này bằng tiếng Việt",
    otherLangMissing: "This page has no Vietnamese version; open the Vietnamese home page",
    type: { learn: "Lesson", code: "Code walkthrough", note: "Short note", problem: "Practice problem" },
    difficulty: { easy: "Easy", medium: "Medium", hard: "Hard" },
    difficultyLabel: "Difficulty",
    stationLabel: "Station",
    stationN: (n) => `Station ${n}`,
    leetcode: "Problem on LeetCode",
    stationProblems: "Problems at this station",
    stationProblemsLede: (w, n) => `${w}/${n} written. Greyed rows are not written yet; their link goes to the original problem on LeetCode.`,
    notWritten: "not written yet",
    problemSet: "NeetCode 150 Problem Set",
    problemSetShort: "Problem set",
    problemSetLink: (w, n) => `Problem set: ${w}/${n} written`,
    problemsWritten: (w, n) => `${w}/${n} problems written`,
    filterLine: "Line",
    filterDiff: "Difficulty",
    filterAll: "All",
    filterShown: (k, n) => `Showing ${k}/${n} problems.`,
    colCode: "Code",
    colTitle: "Problem",
    colGroup: "NeetCode group",
    colStation: "Station",
    level: { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" },
    walked: (n) => `${n} posts walked`,
    scaleAria: (n) => `Scale bar: ${n} posts written`,
    currentLine: (t) => `Now traveling ${String(t).replace(/^The /, "the ")}`,
    currentState: (v, here, n, concepts) =>
      `${v} ${v === 1 ? "station" : "stations"} visited, now at station ${here} of ${n}${concepts ? `: ${concepts}` : ""}.`,
    seeRoute: "See the route",
    newPosts: "Latest posts",
    noPosts: "No posts yet. The first one will show up here.",
    allPosts: (n) => `See all ${n} posts`,
    showing: (n) => ` · showing the ${n} newest`,
    postInfo: "About this post",
    coord: "Coordinates",
    kind: "Type",
    written: "Written",
    read: "Reading",
    minutes: (n) => `${n} min`,
    levelLabel: "Level",
    tags: "Tags",
    prevStation: (n) => `Previous station: ${n}`,
    firstStation: "First station",
    wholeLine: (v, n) => `Whole line (${v}/${n})`,
    walkedStations: (v, n) => `${v} / ${n} stations`,
    walkedLabel: "Visited",
    concepts: "Concepts",
    nextStation: "Next station",
    lineDone: "End of the line",
    stationsOf: (t) => `Stations on ${t}`,
    youAreHere: "You are here",
    youAreHereLower: "you are here",
    visitedOn: (d) => `Visited${d ? ` ${d}` : ""}`,
    ahead: "Not yet visited",
    legendLearn: "Lesson",
    legendCode: "Code walkthrough",
    legendNote: "Short note",
    mapTitle: "Knowledge map",
    mapLine: (t, v, n, here) => `${t}: ${v} of ${n} stations visited${here ? `, now at ${here}` : ""}.`,
    sheetsTitle: "Map index",
    sheetsLede: (n) => `${n} ${n === 1 ? "line" : "lines"}, one sheet each. The map above is the sheet you visited last.`,
    sheetsAll: (n) => `See all ${n} sheets`,
    sheetStations: (v, n) => `${v}/${n} stations`,
    sheetDone: " · line complete",
    sheetHere: (n) => ` · at station ${n}`,
    looseCode: "MISC",
    looseCount: (n) => `${n} standalone ${n === 1 ? "place" : "places"}`,
    looseMore: (n) => `and ${n} more`,
    regionFromTag: (t) => `${t} Region`,
    otherRegion: "Other Region",
    lineTitleShort: (t) =>
      String(t || "")
        .replace(/^The\s+/i, "")
        .replace(/\s+Line(?=$|:)/, ""),
    updated: (d) => `Updated ${d}`,
    drawnWith: "Drawn with Quartz and archify",
    hubCorner: (t, n) => `${t}, ${n} stations`,
    writtenOn: (d) => `Written ${d}`,
    railNav: "Secondary navigation",
    loadMore: "Load more posts",
    loading: "Loading more posts…",
    loadError: "Could not load; click to try again",
    allShown: (n) => `All ${n} posts shown.`,
    tagIndex: "Tag index",
    tagCount: (n) => `${n} ${n === 1 ? "page has" : "pages have"} this tag.`,
    tagTotal: (n) => `${n} ${n === 1 ? "tag" : "tags"}.`,
  },
}
export const strFor = (f) => STR[langOf(f)]

// giữ cho mã cũ: nhãn tiếng Việt
export const TYPE_LABEL = STR.vi.type
export const LEVEL_LABEL = STR.vi.level

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

export const isIndex = (f) => f.slug === "index" || f.slug === "en/index"
const isFolderIndex = (f) => typeof f.slug === "string" && f.slug.endsWith("/index")
export const isPost = (f) => typeof f.slug === "string" && baseSlug(f).startsWith("posts/") && !isFolderIndex(f)
export const isConcept = (f) => typeof f.slug === "string" && baseSlug(f).startsWith("concepts/") && !isFolderIndex(f)
export const isProblem = (f) => typeof f.slug === "string" && baseSlug(f).startsWith("problems/") && !isFolderIndex(f)
export const isProblemSet = (f) => baseSlug(f) === "problems/index"
/** Mục danh mục NeetCode của một trang bài (theo `lc`), hoặc undefined. */
export const problemEntry = (f) => (isProblem(f) && fm(f).lc ? catalogEntry(fm(f).lc) : undefined)
/** Trang bài đã viết, theo số LeetCode. */
export function problemsByLc(allFiles) {
  const map = new Map()
  for (const f of allFiles) if (isProblem(f) && isListed(f) && fm(f).lc) map.set(Number(fm(f).lc), f)
  return map
}
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
  if (m.lc) return lcCode(m.lc)
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

// ── Danh mục bài (gazetteer) và phân trang bằng con trỏ ───────────────────────
export const FEED_PAGE = 20
/** Bài của một ngôn ngữ, mới nhất trước (cùng thứ tự ở HTML trang chủ và ở file feed JSON). */
export function postsNewestFirst(allFiles) {
  return allFiles
    .filter((f) => isPost(f) && isListed(f))
    .sort((a, b) => (pageDate(b) || 0) - (pageDate(a) || 0) || (Number(fm(b).part) || 0) - (Number(fm(a).part) || 0))
}
/** Dữ liệu một dòng danh mục, đã tính sẵn: trang chủ render từ đây, feed JSON cũng ghi đúng các trường này. */
export function gazItem(allFiles, p, fromSlug, S) {
  const m = fm(p)
  const type = m.type || "learn"
  return {
    href: rel(fromSlug, p.slug),
    coord: coordOf(allFiles, p) || "",
    type,
    typeLabel: S.type[type] || S.type.learn,
    title: String(m.title || ""),
    date: fmtDay(pageDate(p)),
    desc: m.description ? String(m.description) : "",
  }
}
/** Con trỏ = tên file của bài cuối cùng đã hiện; file feed kế tiếp là after-<con trỏ>.json. */
export const feedCursor = (p) => `after-${baseSlug(p).split("/").pop()}.json`
