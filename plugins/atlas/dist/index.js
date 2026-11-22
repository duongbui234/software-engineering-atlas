// Entry của plugin Atlas. Plugin khai báo hai loại (package.json → quartz.category):
// - emitter: copy nguyên vẹn content/diagrams/** và content/code/** ra public/, và ghi các file
//   feed/<lang>/after-<slug>.json cho phần "tải thêm bài" ở trang chủ (phân trang bằng con trỏ).
//   Asset emitter của Quartz bỏ đuôi .html và đổi tên file trùng tên thư mục thành index,
//   nên sơ đồ archify (.html) và file code ví dụ phải đi đường riêng. Hai thư mục này
//   nằm trong configuration.ignorePatterns để Quartz không copy lần nữa.
// - pageType: trang thẻ tiếng Anh en/tags/<tag> (plugin tag-page chỉ tạo tags/<tag>).
// Quartz gọi cùng factory mặc định cho từng loại, nên instance trả về có đủ phương thức của cả hai.
// Frame "atlas" (frames.js) được Quartz nạp qua manifest `quartz.frames`.
import fs from "node:fs"
import path from "node:path"
import { h } from "preact"
import { fm, langOf, forLang, isListed, STR, rel, postsNewestFirst, gazItem, feedCursor, FEED_PAGE, homeSlug, LANGS } from "./shared.js"

export * from "./components.js"
export { AtlasFrame } from "./frames.js"

const VERBATIM_DIRS = ["diagrams", "code"]
// receipt của archify là bằng chứng build, không phải nội dung
const SKIP = /\.(finalize|finalize-summary|browser-check|delivery)\.json$/

function* walk(dir) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.isFile() && !SKIP.test(entry.name)) yield full
  }
}

async function* copyVerbatim(ctx) {
  const contentDir = ctx.argv.directory
  for (const sub of VERBATIM_DIRS) {
    const root = path.join(contentDir, sub)
    for (const src of walk(root)) {
      const dest = path.join(ctx.argv.output, path.relative(contentDir, src))
      await fs.promises.mkdir(path.dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  }
}

// Trang chủ hiện FEED_PAGE bài đầu; mỗi file feed chứa FEED_PAGE bài kế tiếp sau "con trỏ"
// (bài cuối của trang trước) và tên file kế tiếp. href tính từ trang chủ của ngôn ngữ đó.
async function* emitFeeds(ctx, content) {
  const allFiles = (content || []).map(([, file]) => file.data).filter((d) => d && d.slug && isListed(d))
  for (const L of LANGS) {
    const files = forLang(allFiles, L)
    const posts = postsNewestFirst(files)
    const dir = path.join(ctx.argv.output, "feed", L)
    await fs.promises.rm(dir, { recursive: true, force: true })
    await fs.promises.mkdir(dir, { recursive: true })
    for (let start = FEED_PAGE; start < posts.length; start += FEED_PAGE) {
      const chunk = posts.slice(start, start + FEED_PAGE)
      const end = start + chunk.length
      const body = {
        items: chunk.map((p) => gazItem(files, p, homeSlug(L), STR[L])),
        next: end < posts.length ? feedCursor(posts[end - 1]) : null,
      }
      const dest = path.join(dir, feedCursor(posts[start - 1]))
      await fs.promises.writeFile(dest, JSON.stringify(body))
      yield dest
    }
  }
}

// ── Trang thẻ tiếng Anh ───────────────────────────────────────────────────────
const tagPrefixes = (t) => String(t).split("/").map((_, i, a) => a.slice(0, i + 1).join("/"))
const tagsOf = (f) => (Array.isArray(fm(f).tags) ? fm(f).tags : []).flatMap(tagPrefixes)

function EnTagBody() {
  const Component = ({ fileData, allFiles }) => {
    const S = STR.en
    const slug = fileData.slug
    const files = forLang(allFiles, "en").filter(isListed)
    const tag = slug.replace(/^en\/tags\/?/, "").replace(/\/?index$/, "")
    if (!tag) {
      const counts = new Map()
      for (const f of files) for (const t of tagsOf(f)) counts.set(t, (counts.get(t) || 0) + 1)
      const tags = [...counts.keys()].sort((a, b) => a.localeCompare(b))
      return h("div", { class: "popover-hint atlas-tags" }, [
        h("p", { class: "tag-count" }, S.tagTotal(tags.length)),
        h(
          "ul",
          { class: "tag-index" },
          tags.map((t) =>
            h("li", null, [h("a", { class: "internal tag-link", href: rel(slug, `en/tags/${t}`) }, `#${t}`), ` (${counts.get(t)})`]),
          ),
        ),
      ])
    }
    const pages = files
      .filter((f) => tagsOf(f).includes(tag))
      .sort((a, b) => String(fm(a).title || "").localeCompare(String(fm(b).title || "")))
    return h("div", { class: "popover-hint atlas-tags" }, [
      h("p", { class: "tag-count" }, S.tagCount(pages.length)),
      h(
        "ul",
        { class: "section-ul" },
        pages.map((f) =>
          h("li", { class: "section-li" }, [
            h("h3", null, h("a", { class: "internal", href: rel(slug, f.slug) }, fm(f).title || f.slug)),
            fm(f).description && h("p", { class: "tag-desc" }, fm(f).description),
          ]),
        ),
      ),
    ])
  }
  return Component
}

export default function AtlasPlugin() {
  return {
    name: "AtlasPlugin",
    // emitter
    async *emit(ctx, content) {
      yield* copyVerbatim(ctx)
      yield* emitFeeds(ctx, content)
    },
    async *partialEmit(ctx, content) {
      yield* copyVerbatim(ctx)
      yield* emitFeeds(ctx, content)
    },
    // pageType: en/tags/<tag> và en/tags (mục lục thẻ). Ưu tiên cao hơn folder-page (10),
    // vì "en/tags/index" kết thúc bằng /index và sẽ bị coi là trang thư mục.
    priority: 20,
    match: ({ slug }) => slug === "en/tags" || slug.startsWith("en/tags/"),
    generate({ content }) {
      const files = content.map(([, file]) => file.data).filter((d) => d && d.slug && langOf(d) === "en" && isListed(d))
      const tags = new Set(files.flatMap(tagsOf))
      const pages = [{ slug: "en/tags/index", title: STR.en.tagIndex, data: {} }]
      for (const t of [...tags].sort()) pages.push({ slug: `en/tags/${t}`, title: t, data: {} })
      return pages
    },
    layout: "tag",
    body: () => EnTagBody(),
  }
}
