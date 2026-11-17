// Component của theme Atlas. Mỗi export là một constructor (opts) => Component;
// frame "atlas" (frames.js) gọi trực tiếp chúng, vì Quartz chỉ đặt một component cho mỗi plugin.
import { h } from "preact"
import {
  fm,
  rel,
  pad,
  fmtDay,
  fmtFull,
  pageDate,
  isIndex,
  isPost,
  isHub,
  isListed,
  hubs,
  hubFor,
  lineState,
  coordOf,
  readingMinutes,
  hasMargin,
  conceptBySlugTitle,
  TYPE_LABEL,
  LEVEL_LABEL,
} from "./shared.js"
import { KnowledgeMap } from "./map.js"

const sym = (type, label) =>
  h("span", {
    class: `sym ${type || "learn"}`,
    ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" }),
  })

// ── Đồng bộ theme cho iframe archify (?embed=1&theme=light|dark) ─────────────
export const ARCHIFY_SCRIPT = `
function atlasArchifySync() {
  var theme = document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light";
  document.querySelectorAll("iframe[data-archify]").forEach(function (f) {
    var path = f.getAttribute("data-archify");
    var src = path + "?embed=1&theme=" + theme;
    if (f.getAttribute("src") !== src) f.setAttribute("src", src);
    // Quartz bỏ đuôi .html khi viết lại link; đặt lại link "Mở toàn màn hình" theo iframe
    var fig = f.closest(".figure-map");
    var open = fig && fig.querySelector("figcaption a");
    if (open) open.setAttribute("href", path + "?theme=" + theme);
  });
}
document.addEventListener("nav", atlasArchifySync);
document.addEventListener("themechange", atlasArchifySync);
`

// ── Masthead brand ────────────────────────────────────────────────────────────
export const AtlasBrand = (opts = {}) => {
  const Component = ({ fileData, cfg, allFiles }) => {
    const slug = fileData.slug
    const firstHub = hubs(allFiles)[0]
    return h("div", { class: "atlas-brand" }, [
      h("a", { class: "brand", href: rel(slug, "index") }, [
        cfg.pageTitle,
        h("small", null, opts.tagline || "Sổ tay học kỹ thuật phần mềm"),
      ]),
      firstHub &&
        h("nav", { class: "brand-nav", "aria-label": "Điều hướng chính" }, [
          h("a", { href: rel(slug, firstHub.slug), class: "internal" }, "Lộ trình"),
        ]),
    ])
  }
  return Component
}

// ── Trang chủ: tiêu đề lớn + thước tỉ lệ ────────────────────────────────────
export const AtlasHomeHead = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!isIndex(fileData)) return null
    const posts = allFiles.filter((f) => isPost(f) && isListed(f)).length
    const span = Math.max(20, Math.ceil(posts / 10) * 10)
    const at = Math.min(100, (posts / span) * 100)
    return h("section", { class: "atlas-intro" }, [
      h("h1", null, fm(fileData).headline || fm(fileData).title),
      h("div", { class: "scalebar", "aria-label": `Thước tỉ lệ: đã viết ${posts} bài` }, [
        h("span", null, `Đã đi ${posts} bài`),
        h("span", { class: "bar", "aria-hidden": "true", style: `--at: ${at}%` }, [
          h("i"),
          h("i"),
          h("i"),
          h("i"),
          h("b"),
        ]),
        h("span", { class: "ticks", "aria-hidden": "true" }, [
          h("span", null, "0"),
          h("span", null, String(span / 2)),
          h("span", null, String(span)),
        ]),
      ]),
    ])
  }
  return Component
}

// ── Trang chủ: bản đồ + tuyến đang đi + danh mục bài ────────────────────────
export const AtlasHome = (opts = {}) => {
  const limit = opts.limit || 20
  const Component = ({ fileData, allFiles }) => {
    if (!isIndex(fileData)) return null
    const slug = fileData.slug
    const posts = allFiles
      .filter((f) => isPost(f) && isListed(f))
      .sort((a, b) => (pageDate(b) || 0) - (pageDate(a) || 0) || (Number(fm(b).part) || 0) - (Number(fm(a).part) || 0))
    const current = hubs(allFiles)
      .map((hub) => ({ hub, state: lineState(allFiles, hub) }))
      .filter((x) => x.state.latest)
      .sort((a, b) => (pageDate(b.state.latest) || 0) - (pageDate(a.state.latest) || 0))[0]

    const map = KnowledgeMap({ slug, allFiles })
    return h("div", { class: "atlas-home" }, [
      map &&
        h("figure", { class: "atlas-map" }, [
          ...map,
          h("figcaption", { class: "map-foot" }, [
            h("ul", { class: "legend" }, [
              h("li", null, [sym("learn"), "Bài học"]),
              h("li", null, [sym("code"), "Đọc code dự án"]),
              h("li", null, [sym("note"), "Ghi chú ngắn"]),
            ]),
          ]),
        ]),
      current &&
        (() => {
          const here = current.state.stations.find((s) => s.state === "now")
          return h("section", { class: "current", "aria-labelledby": "cur-h" }, [
            h("span", { class: "pin", "aria-hidden": "true" }),
            h("div", null, [
              h("h2", { id: "cur-h" }, `Đang đi ${fm(current.hub).title}`),
              h(
                "p",
                null,
                `Đã qua ${current.state.visited} ga, đang ở ga ${here ? here.n : "?"} trên ${current.state.stations.length}${
                  here && here.concepts.length ? `: ${here.concepts.join(", ")}` : ""
                }.`,
              ),
            ]),
            h("a", { class: "go internal", href: rel(slug, current.hub.slug) }, "Xem lộ trình"),
          ])
        })(),
      h("section", { class: "gazetteer", "aria-labelledby": "gz-h" }, [
        h("h2", { id: "gz-h" }, "Bài mới"),
        posts.length === 0
          ? h("p", { class: "empty" }, "Chưa có bài nào. Bài đầu tiên sẽ xuất hiện ở đây.")
          : h(
              "ul",
              { class: "gz" },
              posts.slice(0, limit).map((p) => {
                const m = fm(p)
                return h(
                  "li",
                  null,
                  h("a", { class: "row internal", href: rel(slug, p.slug) }, [
                    h("span", { class: "coord" }, coordOf(allFiles, p) || ""),
                    sym(m.type, TYPE_LABEL[m.type] || TYPE_LABEL.learn),
                    h("span", { class: "t" }, m.title),
                    h("span", { class: "date" }, fmtDay(pageDate(p))),
                    m.description && h("span", { class: "d" }, m.description),
                  ]),
                )
              }),
            ),
      ]),
    ])
  }
  return Component
}

// ── Cột lề: dữ liệu của bài ─────────────────────────────────────────────────
export const PostMargin = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!hasMargin(fileData)) return null
    const m = fm(fileData)
    const slug = fileData.slug
    const code = coordOf(allFiles, fileData)
    const type = m.type || (fileData.slug.startsWith("concepts/") ? "note" : "learn")
    const tags = Array.isArray(m.tags) ? m.tags : []
    const row = (dt, dd, cls) => h("div", null, [h("dt", null, dt), h("dd", cls ? { class: cls } : null, dd)])
    return h("dl", { class: "post-margin", "aria-label": "Thông tin bài" }, [
      code && row("Tọa độ", code, "big"),
      row("Loại", [sym(type), TYPE_LABEL[type] || type], "kind"),
      pageDate(fileData) && row("Ngày viết", fmtFull(pageDate(fileData))),
      row("Đọc", `${readingMinutes(fileData)} phút`),
      m.level && row("Mức", LEVEL_LABEL[m.level] || m.level),
      tags.length > 0 &&
        row(
          "Thẻ",
          tags.map((t, i) => [
            i ? " " : "",
            h("a", { class: "internal", href: rel(slug, `tags/${t}`) }, `#${t}`),
          ]),
        ),
    ])
  }
  return Component
}

// ── Mô tả dưới tiêu đề ──────────────────────────────────────────────────────
export const Standfirst = () => {
  const Component = ({ fileData }) => {
    const d = fm(fileData).description
    if (!d || isIndex(fileData)) return null
    return h("p", { class: "standfirst" }, d)
  }
  return Component
}

// ── Dải metro mini ở đầu bài series ─────────────────────────────────────────
export const SeriesLine = () => {
  const Component = ({ fileData, allFiles }) => {
    const m = fm(fileData)
    if (!m.series || !m.part || isHub(fileData)) return null
    const hub = hubFor(allFiles, m.series)
    if (!hub) return null
    const state = lineState(allFiles, hub)
    const slug = fileData.slug
    const me = Number(m.part)
    const n = state.stations.length
    const doneUpTo = state.reached
    const prev = [...state.stations].reverse().find((s) => s.n < me && s.post)
    return h("nav", { class: "series-line", "aria-label": fm(hub).title, style: `--n: ${n}; --done: ${doneUpTo}` }, [
      h(
        "ol",
        null,
        state.stations.map((s) => {
          const cls = s.n === me ? "now" : s.state === "ahead" ? "" : "done"
          const label = h("span", { class: "name" }, s.name)
          return h("li", { class: cls, ...(s.n === me ? { "aria-current": "step" } : {}) }, [
            h("span", { class: "st", "aria-hidden": "true" }),
            s.post && s.n !== me ? h("a", { class: "internal", href: rel(slug, s.post.slug) }, label) : label,
          ])
        }),
      ),
      h("div", { class: "line-cap" }, [
        prev
          ? h("a", { class: "internal", href: rel(slug, prev.post.slug) }, `Ga trước: ${prev.name}`)
          : h("span", null, "Ga đầu tiên"),
        h("a", { class: "internal", href: rel(slug, hub.slug) }, `Cả tuyến (${state.visited}/${n})`),
      ]),
    ])
  }
  return Component
}

// ── Hub series: số liệu + bản đồ metro ──────────────────────────────────────
export const SeriesHub = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!isHub(fileData)) return null
    const slug = fileData.slug
    const state = lineState(allFiles, fileData)
    const concepts = conceptBySlugTitle(allFiles)
    const total = state.stations.reduce((a, s) => a + s.concepts.length, 0)
    const learned = state.stations.filter((s) => s.state !== "ahead").reduce((a, s) => a + s.concepts.length, 0)
    const next = state.stations.find((s) => s.state === "ahead")
    const doneUpTo = state.reached
    const fact = (dt, dd) => h("div", null, [h("dt", null, dt), h("dd", null, dd)])
    return h("div", { class: "series-hub" }, [
      h("dl", { class: "facts" }, [
        fact("Đã đi", `${state.visited} / ${state.stations.length} ga`),
        total > 0 && fact("Khái niệm", `${learned} / ${total}`),
        fact("Ga tiếp theo", next ? next.name : "Đã hết tuyến"),
      ]),
      h(
        "nav",
        {
          class: "metro",
          "aria-label": `Các ga trên ${fm(fileData).title}`,
          style: `--n: ${state.stations.length}; --done: ${Math.max(doneUpTo - 1, 0)}`,
        },
        h(
          "ol",
          null,
          state.stations.map((s) => {
            const status =
              s.state === "now"
                ? "Bạn đang ở đây"
                : s.state === "done"
                  ? `Đã đi${s.post && pageDate(s.post) ? ` ngày ${fmtDay(pageDate(s.post))}` : ""}`
                  : "Chưa đi"
            return h("li", { class: `stop ${s.state}`, ...(s.state === "now" ? { "aria-current": "step" } : {}) }, [
              h("span", { class: "dot", "aria-hidden": "true" }, String(s.n)),
              h(
                "h2",
                null,
                s.post ? h("a", { class: "internal", href: rel(slug, s.post.slug) }, s.name) : s.name,
              ),
              h("span", { class: "status" }, status),
              s.concepts.length > 0 &&
                h(
                  "ul",
                  null,
                  s.concepts.map((c) => {
                    const note = concepts.get(String(c).toLowerCase())
                    return h("li", null, note ? h("a", { class: "internal", href: rel(slug, note.slug) }, c) : c)
                  }),
                ),
            ])
          }),
        ),
      ),
    ])
  }
  return Component
}

