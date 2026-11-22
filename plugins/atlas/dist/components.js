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
  langOf,
  forLang,
  strFor,
  homeSlug,
  slugIn,
  STR,
  postsNewestFirst,
  gazItem,
  feedCursor,
  FEED_PAGE,
} from "./shared.js"
import { KnowledgeMap, sheetIndex } from "./map.js"

const sym = (type, label) =>
  h("span", {
    class: `sym ${type || "learn"}`,
    ...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" }),
  })

// ── Đồng bộ theme cho iframe archify (?embed=1&theme=light|dark) ─────────────
// Viewer archify co sơ đồ cho vừa bề ngang và đặt body overflow:hidden, nên sơ đồ cao
// (sequence) bị cắt mất phần dưới nếu khung iframe thấp hơn. Viewer cùng origin với trang,
// nên đo chiều cao thật của nội dung và đặt chiều cao iframe theo đó; theo dõi lại khi bề
// ngang đổi. Không đọc được (file://, khác origin) thì giữ tỉ lệ --ar như cũ.
export const ARCHIFY_SCRIPT = `
function atlasArchifyFit(f) {
  try {
    var d = f.contentDocument;
    var c = d && (d.querySelector(".container") || d.body);
    var svg = d && d.querySelector("svg");
    if (!c || !svg) return;
    var h = Math.ceil(c.getBoundingClientRect().height);
    if (h < 120) return;
    f.style.aspectRatio = "auto";
    f.style.minHeight = "0";
    f.style.maxHeight = "none";
    f.style.height = h + "px";
  } catch (e) {}
}
function atlasArchifyWatch(f) {
  if (f.dataset.atlasFit) return;
  f.dataset.atlasFit = "1";
  f.addEventListener("load", function () {
    atlasArchifyFit(f);
    try {
      var w = f.contentWindow, d = f.contentDocument;
      var c = d.querySelector(".container") || d.body;
      if (w.ResizeObserver) new w.ResizeObserver(function () { atlasArchifyFit(f); }).observe(c);
      if (d.fonts) d.fonts.ready.then(function () { atlasArchifyFit(f); });
    } catch (e) {}
  });
}
function atlasArchifySync() {
  var theme = document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light";
  document.querySelectorAll("iframe[data-archify]").forEach(function (f) {
    atlasArchifyWatch(f);
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

// ── Mermaid: tự render thay cho renderer của obsidian-flavored-markdown ──────
// Renderer của plugin chạy mermaid.run hai lần chồng nhau (nav + render), hai sơ đồ
// có thể nhận cùng id và vẽ đè lên nhau. Ở đây: render tuần tự bằng mermaid.render với
// id riêng cho từng khối; lượt render mới (nav, đổi theme) hủy lượt cũ. Không có JS thì
// khối code Mermaid vẫn hiện nguyên văn.
export const MERMAID_SCRIPT = `
var atlasMermaidLib = null;
var atlasMermaidRun = 0;
function atlasMermaidVar(name) {
  // Token màu của Atlas khai báo trên .page (theo theme Quartz), không phải :root
  var el = document.querySelector('.page[data-frame="atlas"]') || document.documentElement;
  return getComputedStyle(el).getPropertyValue(name).trim();
}
async function atlasRenderMermaid() {
  document.querySelectorAll('pre[data-language="mermaid"]').forEach(function (pre) {
    var box = document.createElement("div");
    box.className = "atlas-mermaid";
    box.setAttribute("data-src", pre.textContent);
    var fig = pre.closest("figure[data-rehype-pretty-code-figure]") || pre;
    fig.replaceWith(box);
  });
  var boxes = document.querySelectorAll(".atlas-mermaid[data-src]");
  if (boxes.length === 0) return;
  var run = ++atlasMermaidRun;
  if (!atlasMermaidLib) {
    atlasMermaidLib = (await import("https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs")).default;
  }
  if (run !== atlasMermaidRun) return;
  var dark = document.documentElement.getAttribute("saved-theme") === "dark";
  atlasMermaidLib.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    themeVariables: {
      darkMode: dark,
      fontFamily: atlasMermaidVar("--bodyFont") || "Be Vietnam Pro, sans-serif",
      fontSize: "15px",
      background: atlasMermaidVar("--code-bg"),
      primaryColor: atlasMermaidVar("--paper"),
      primaryTextColor: atlasMermaidVar("--ink"),
      primaryBorderColor: atlasMermaidVar("--contour"),
      secondaryColor: atlasMermaidVar("--code-bg"),
      tertiaryColor: atlasMermaidVar("--paper-2"),
      lineColor: atlasMermaidVar("--ink-2"),
      textColor: atlasMermaidVar("--ink"),
      clusterBkg: atlasMermaidVar("--paper-2"),
      clusterBorder: atlasMermaidVar("--grid"),
      edgeLabelBackground: atlasMermaidVar("--paper"),
      actorBkg: atlasMermaidVar("--paper"),
      actorBorder: atlasMermaidVar("--contour"),
      actorTextColor: atlasMermaidVar("--ink"),
      signalColor: atlasMermaidVar("--ink"),
      signalTextColor: atlasMermaidVar("--ink"),
      noteBkgColor: atlasMermaidVar("--paper-2"),
      noteBorderColor: atlasMermaidVar("--grid"),
      noteTextColor: atlasMermaidVar("--ink"),
      labelBoxBkgColor: atlasMermaidVar("--paper"),
      labelBoxBorderColor: atlasMermaidVar("--contour"),
      loopTextColor: atlasMermaidVar("--ink"),
    },
    // Cột bài chỉ ~40rem: thu hẹp ô và khoảng cách giữa các bên tham gia để sequence
    // diagram không bị co nhỏ chữ (mặc định 150px + 50px mỗi bên).
    sequence: { width: 110, actorMargin: 24, boxMargin: 8, noteMargin: 8, messageMargin: 32 },
  });
  for (var i = 0; i < boxes.length; i++) {
    try {
      var out = await atlasMermaidLib.render("atlas-mermaid-" + run + "-" + i, boxes[i].getAttribute("data-src"));
      if (run !== atlasMermaidRun) return;
      boxes[i].innerHTML = out.svg;
      // Không cho sơ đồ co dưới 75% cỡ thật (chữ sẽ quá nhỏ); khung hẹp hơn thì cuộn ngang trong khung.
      var svg = boxes[i].querySelector("svg");
      var vb = svg && svg.viewBox && svg.viewBox.baseVal;
      if (vb && vb.width) svg.style.minWidth = Math.round(vb.width * 0.75) + "px";
    } catch (err) {
      if (run !== atlasMermaidRun) return;
      var pre = document.createElement("pre");
      pre.textContent = boxes[i].getAttribute("data-src");
      boxes[i].replaceChildren(pre);
      console.error("Mermaid:", err);
    }
  }
}
document.addEventListener("nav", atlasRenderMermaid);
document.addEventListener("themechange", atlasRenderMermaid);
`

// ── Tab code: các khối code liền nhau, khác ngôn ngữ → một thanh tab ngang ──────
// Viết bài: chỉ cần đặt các khối ```ts, ```python, ```go… liền nhau (không xen đoạn văn).
// Script gom chúng thành một nhóm tab, xếp theo thứ tự TS · Python · Go · Java · JS.
// Chọn một ngôn ngữ thì mọi nhóm trên trang cùng chuyển, và lựa chọn được nhớ (localStorage).
// Không có JS: các khối vẫn hiện dọc như cũ.
export const CODETABS_SCRIPT = `
var ATLAS_TAB_LANGS = {
  ts: ["ts", "TypeScript"], typescript: ["ts", "TypeScript"], tsx: ["ts", "TypeScript"],
  python: ["python", "Python"], py: ["python", "Python"],
  go: ["go", "Go"],
  java: ["java", "Java"],
  js: ["js", "JavaScript"], javascript: ["js", "JavaScript"], jsx: ["js", "JavaScript"],
  rust: ["rust", "Rust"], rs: ["rust", "Rust"], kotlin: ["kotlin", "Kotlin"],
  c: ["c", "C"], cpp: ["cpp", "C++"], csharp: ["csharp", "C#"], cs: ["csharp", "C#"],
  ruby: ["ruby", "Ruby"], swift: ["swift", "Swift"], php: ["php", "PHP"],
};
var ATLAS_TAB_ORDER = ["ts", "python", "go", "java", "js"];
var ATLAS_TAB_KEY = "atlas-code-lang";
function atlasTabLang(fig) {
  var pre = fig.matches && fig.matches("figure[data-rehype-pretty-code-figure]") && fig.querySelector(":scope > pre[data-language]");
  return pre ? ATLAS_TAB_LANGS[pre.getAttribute("data-language")] || null : null;
}
function atlasTabRank(id) {
  var i = ATLAS_TAB_ORDER.indexOf(id);
  return i < 0 ? 99 : i;
}
function atlasTabSelect(group, id, focus) {
  var tabs = group.querySelectorAll(":scope > .code-tabs-bar > [role=tab]");
  var hit = false;
  tabs.forEach(function (t) { if (t.getAttribute("data-lang") === id) hit = true; });
  if (!hit) return false;
  tabs.forEach(function (t) {
    var on = t.getAttribute("data-lang") === id;
    t.setAttribute("aria-selected", on ? "true" : "false");
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    if (on && focus) t.focus();
  });
  return true;
}
function atlasTabSelectAll(id, except) {
  document.querySelectorAll(".code-tabs").forEach(function (g) { if (g !== except) atlasTabSelect(g, id, false); });
}
function atlasSetupCodeTabs() {
  var article = document.querySelector('.page[data-frame="atlas"] article');
  if (!article) return;
  var saved = null;
  try { saved = localStorage.getItem(ATLAS_TAB_KEY); } catch (e) {}
  var en = (document.documentElement.lang || "").indexOf("en") === 0;
  var figs = Array.prototype.slice.call(article.querySelectorAll("figure[data-rehype-pretty-code-figure]"));
  var seen = new Set();
  var n = 0;
  figs.forEach(function (fig) {
    if (seen.has(fig) || !atlasTabLang(fig) || fig.closest(".code-tabs")) return;
    // gom dãy khối code anh em liền nhau, mỗi ngôn ngữ một lần
    var run = [fig];
    var ids = [atlasTabLang(fig)[0]];
    var next = fig.nextElementSibling;
    while (next && atlasTabLang(next) && ids.indexOf(atlasTabLang(next)[0]) < 0) {
      run.push(next); ids.push(atlasTabLang(next)[0]); next = next.nextElementSibling;
    }
    run.forEach(function (f) { seen.add(f); });
    if (run.length < 2) return;
    n++;
    var group = document.createElement("div");
    group.className = "code-tabs";
    var bar = document.createElement("div");
    bar.className = "code-tabs-bar";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", en ? "Language" : "Ngôn ngữ");
    group.appendChild(bar);
    fig.before(group);
    run.sort(function (a, b) { return atlasTabRank(atlasTabLang(a)[0]) - atlasTabRank(atlasTabLang(b)[0]); });
    run.forEach(function (f, i) {
      var L = atlasTabLang(f);
      var tab = document.createElement("button");
      tab.type = "button";
      tab.setAttribute("role", "tab");
      tab.setAttribute("data-lang", L[0]);
      tab.id = "code-tab-" + n + "-" + i;
      f.id = f.id || "code-panel-" + n + "-" + i;
      tab.setAttribute("aria-controls", f.id);
      f.setAttribute("role", "tabpanel");
      f.setAttribute("aria-labelledby", tab.id);
      tab.textContent = L[1];
      bar.appendChild(tab);
      group.appendChild(f);
    });
    if (!(saved && atlasTabSelect(group, saved, false))) atlasTabSelect(group, atlasTabLang(run[0])[0], false);
    bar.addEventListener("click", function (ev) {
      var t = ev.target.closest("[role=tab]");
      if (!t) return;
      var id = t.getAttribute("data-lang");
      // giữ khối đang bấm đứng yên trên màn hình khi các nhóm phía trên đổi chiều cao
      var top = group.getBoundingClientRect().top;
      atlasTabSelect(group, id, false);
      atlasTabSelectAll(id, group);
      window.scrollBy(0, group.getBoundingClientRect().top - top);
      try { localStorage.setItem(ATLAS_TAB_KEY, id); } catch (e) {}
    });
    bar.addEventListener("keydown", function (ev) {
      var tabs = Array.prototype.slice.call(bar.querySelectorAll("[role=tab]"));
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var j = ev.key === "ArrowRight" ? (i + 1) % tabs.length : ev.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length
        : ev.key === "Home" ? 0 : ev.key === "End" ? tabs.length - 1 : -1;
      if (j < 0) return;
      ev.preventDefault();
      tabs[j].click();
      tabs[j].focus();
    });
  });
}
document.addEventListener("nav", atlasSetupCodeTabs);
`

// ── Danh mục bài: tải thêm theo con trỏ khi cuộn tới cuối ─────────────────────
// Mỗi file feed/<lang>/after-<slug>.json = { items: [...], next: "after-….json" | null }.
// IntersectionObserver gọi tải khi ô .gz-more gần vào khung nhìn; nút bấm là đường dự phòng
// (bàn phím, trình đọc màn hình, trình duyệt không có IntersectionObserver).
export const FEED_SCRIPT = `
function atlasFeedRow(it) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.className = "row internal";
  a.href = it.href;
  const span = (cls, text) => { const e = document.createElement("span"); e.className = cls; e.textContent = text; return e; };
  const sym = document.createElement("span");
  sym.className = "sym " + (it.type || "learn");
  sym.setAttribute("role", "img");
  sym.setAttribute("aria-label", it.typeLabel || "");
  a.append(span("coord", it.coord || ""), sym, span("t", it.title || ""), span("date", it.date || ""));
  if (it.desc) a.append(span("d", it.desc));
  li.append(a);
  return li;
}
function atlasSetupFeed() {
  const box = document.querySelector(".gazetteer .gz-more[data-next]");
  const list = document.querySelector(".gazetteer ul.gz");
  if (!box || !list) return;
  const btn = box.querySelector(".gz-load");
  const status = box.querySelector(".gz-status");
  const d = box.dataset;
  let loading = false;
  let io;
  async function more() {
    if (loading || !d.next) return;
    loading = true;
    btn.disabled = true;
    btn.textContent = d.lLoading;
    try {
      const res = await fetch(new URL(d.feed + d.next, location.href));
      if (!res.ok) throw new Error("HTTP " + res.status);
      const page = await res.json();
      for (const it of page.items || []) list.append(atlasFeedRow(it));
      if (page.next) {
        d.next = page.next;
        btn.textContent = d.lMore;
        btn.disabled = false;
      } else {
        delete d.next;
        if (io) io.disconnect();
        btn.remove();
        status.textContent = d.lDone;
      }
    } catch (err) {
      console.error("Atlas feed:", err);
      btn.textContent = d.lError;
      btn.disabled = false;
      if (io) io.disconnect(); // lỗi thì chờ người bấm, không tự thử lại liên tục
    } finally {
      loading = false;
    }
  }
  btn.addEventListener("click", more);
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) more();
    }, { rootMargin: "0px 0px 400px 0px" });
    io.observe(box);
    if (window.addCleanup) window.addCleanup(() => io.disconnect());
  }
}
document.addEventListener("nav", atlasSetupFeed);
`

// ── Masthead brand ────────────────────────────────────────────────────────────
export const AtlasBrand = (opts = {}) => {
  const Component = ({ fileData, cfg, allFiles, atlasAllFiles }) => {
    allFiles = atlasAllFiles || allFiles
    const slug = fileData.slug
    const L = langOf(fileData)
    const S = STR[L]
    const other = L === "en" ? "vi" : "en"
    const firstHub = hubs(forLang(allFiles, L))[0]
    // trang tương ứng ở ngôn ngữ kia; chưa dịch thì về trang chủ ngôn ngữ kia
    const twinSlug = slugIn(fileData, other)
    const twin = allFiles.some((f) => f.slug === twinSlug)
    return h("div", { class: "atlas-brand" }, [
      h("a", { class: "brand", href: rel(slug, homeSlug(L)) }, [
        cfg.pageTitle,
        h("small", null, (L === "vi" && opts.tagline) || S.tagline),
      ]),
      h("nav", { class: "brand-nav", "aria-label": S.mainNav }, [
        firstHub && h("a", { href: rel(slug, firstHub.slug), class: "internal" }, S.route),
        h(
          "a",
          {
            class: "lang-switch",
            href: rel(slug, twin ? twinSlug : homeSlug(other)),
            hreflang: other,
            lang: other,
            title: twin ? S.otherLangTitle : S.otherLangMissing,
            "data-router-ignore": "true",
          },
          [h("span", { "aria-hidden": "true" }, S.otherLangShort), h("span", { class: "sr" }, S.otherLang)],
        ),
      ]),
    ])
  }
  return Component
}

// ── Trang chủ: tiêu đề lớn + thước tỉ lệ ────────────────────────────────────
export const AtlasHomeHead = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!isIndex(fileData)) return null
    const S = strFor(fileData)
    allFiles = forLang(allFiles, langOf(fileData))
    const posts = allFiles.filter((f) => isPost(f) && isListed(f)).length
    const span = Math.max(20, Math.ceil(posts / 10) * 10)
    const at = Math.min(100, (posts / span) * 100)
    return h("section", { class: "atlas-intro" }, [
      h("h1", null, fm(fileData).headline || fm(fileData).title),
      h("div", { class: "scalebar", "aria-label": S.scaleAria(posts) }, [
        h("span", null, S.walked(posts)),
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
// Một dòng danh mục; FEED_SCRIPT dựng đúng cấu trúc này cho các bài tải thêm.
const gazRow = (it) =>
  h(
    "li",
    null,
    h("a", { class: "row internal", href: it.href }, [
      h("span", { class: "coord" }, it.coord),
      sym(it.type, it.typeLabel),
      h("span", { class: "t" }, it.title),
      h("span", { class: "date" }, it.date),
      it.desc && h("span", { class: "d" }, it.desc),
    ]),
  )

export const AtlasHome = (opts = {}) => {
  const limit = opts.limit || FEED_PAGE
  const Component = ({ fileData, allFiles }) => {
    if (!isIndex(fileData)) return null
    const slug = fileData.slug
    const L = langOf(fileData)
    const S = STR[L]
    allFiles = forLang(allFiles, L)
    const posts = postsNewestFirst(allFiles)
    const current = hubs(allFiles)
      .map((hub) => ({ hub, state: lineState(allFiles, hub) }))
      .filter((x) => x.state.latest)
      .sort((a, b) => (pageDate(b.state.latest) || 0) - (pageDate(a.state.latest) || 0))[0]

    const map = KnowledgeMap({ slug, allFiles, S })
    return h("div", { class: "atlas-home" }, [
      map &&
        h("figure", { class: "atlas-map" }, [
          ...map,
          h("figcaption", { class: "map-foot" }, [
            h("ul", { class: "legend" }, [
              h("li", null, [sym("learn"), S.legendLearn]),
              h("li", null, [sym("code"), S.legendCode]),
              h("li", null, [sym("note"), S.legendNote]),
            ]),
          ]),
        ]),
      current &&
        (() => {
          const here = current.state.stations.find((s) => s.state === "now")
          return h("section", { class: "current", "aria-labelledby": "cur-h" }, [
            h("span", { class: "pin", "aria-hidden": "true" }),
            h("div", null, [
              h("h2", { id: "cur-h" }, S.currentLine(fm(current.hub).title)),
              h(
                "p",
                null,
                S.currentState(
                  current.state.visited,
                  here ? here.n : "?",
                  current.state.stations.length,
                  here && here.concepts.length ? here.concepts.join(", ") : "",
                ),
              ),
            ]),
            h("a", { class: "go internal", href: rel(slug, current.hub.slug) }, S.seeRoute),
          ])
        })(),
      sheetIndex({ slug, allFiles, fmtDay, S }),
      h("section", { class: "gazetteer", "aria-labelledby": "gz-h" }, [
        h("div", { class: "gz-head" }, [
          h("h2", { id: "gz-h" }, S.newPosts),
          posts.length > limit &&
            h("a", { class: "internal gz-all-link", href: rel(slug, L === "en" ? "en/posts/" : "posts/") }, S.allPosts(posts.length)),
        ]),
        posts.length === 0
          ? h("p", { class: "empty" }, S.noPosts)
          : h(
              "ul",
              { class: "gz" },
              posts.slice(0, limit).map((p) => gazRow(gazItem(allFiles, p, slug, S))),
            ),
        // Phân trang bằng con trỏ: trang chỉ chứa `limit` bài đầu; phần còn lại nằm trong
        // feed/<lang>/after-<bài cuối>.json (emitter trong index.js), FEED_SCRIPT tải khi
        // cuộn tới cuối danh sách hoặc khi bấm nút.
        posts.length > limit &&
          h("div", {
            class: "gz-more",
            "data-feed": rel(slug, `feed/${L}/`),
            "data-next": feedCursor(posts[limit - 1]),
            "data-total": String(posts.length),
            "data-l-more": S.loadMore,
            "data-l-loading": S.loading,
            "data-l-error": S.loadError,
            "data-l-done": S.allShown(posts.length),
          }, [
            h("button", { type: "button", class: "gz-load" }, S.loadMore),
            h("p", { class: "gz-status", role: "status", "aria-live": "polite" }),
          ]),
      ]),
    ])
  }
  return Component
}

// ── Cột lề: dữ liệu của bài ─────────────────────────────────────────────────
export const PostMargin = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!hasMargin(fileData)) return null
    const S = strFor(fileData)
    allFiles = forLang(allFiles, langOf(fileData))
    const m = fm(fileData)
    const slug = fileData.slug
    const code = coordOf(allFiles, fileData)
    const type = m.type || (fileData.slug.replace(/^en\//, "").startsWith("concepts/") ? "note" : "learn")
    const tags = Array.isArray(m.tags) ? m.tags : []
    const row = (dt, dd, cls) => h("div", null, [h("dt", null, dt), h("dd", cls ? { class: cls } : null, dd)])
    return h("dl", { class: "post-margin", "aria-label": S.postInfo }, [
      code && row(S.coord, code, "big"),
      row(S.kind, [sym(type), S.type[type] || type], "kind"),
      pageDate(fileData) && row(S.written, fmtFull(pageDate(fileData))),
      row(S.read, S.minutes(readingMinutes(fileData))),
      m.level && row(S.levelLabel, S.level[m.level] || m.level),
      tags.length > 0 &&
        row(
          S.tags,
          tags.map((t, i) => [
            i ? " " : "",
            h("a", { class: "internal", href: rel(slug, `${langOf(fileData) === "en" ? "en/" : ""}tags/${t}`) }, `#${t}`),
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
    const S = strFor(fileData)
    allFiles = forLang(allFiles, langOf(fileData))
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
          ? h("a", { class: "internal", href: rel(slug, prev.post.slug) }, S.prevStation(prev.name))
          : h("span", null, S.firstStation),
        h("a", { class: "internal", href: rel(slug, hub.slug) }, S.wholeLine(state.visited, n)),
      ]),
    ])
  }
  return Component
}

// ── Hub series: số liệu + bản đồ metro ──────────────────────────────────────
export const SeriesHub = () => {
  const Component = ({ fileData, allFiles }) => {
    if (!isHub(fileData)) return null
    const S = strFor(fileData)
    allFiles = forLang(allFiles, langOf(fileData))
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
        fact(S.walkedLabel, S.walkedStations(state.visited, state.stations.length)),
        total > 0 && fact(S.concepts, `${learned} / ${total}`),
        fact(S.nextStation, next ? next.name : S.lineDone),
      ]),
      h(
        "nav",
        {
          class: state.stations.length >= 8 ? "metro long" : "metro",
          "aria-label": S.stationsOf(fm(fileData).title),
          style: `--n: ${state.stations.length}; --done: ${Math.max(doneUpTo - 1, 0)}`,
        },
        h(
          "ol",
          null,
          state.stations.map((s) => {
            const status =
              s.state === "now"
                ? S.youAreHere
                : s.state === "done"
                  ? S.visitedOn(s.post && pageDate(s.post) ? fmtDay(pageDate(s.post)) : "")
                  : S.ahead
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
                    // tên khái niệm thuần tiếng Anh: đánh dấu lang="en" để trình duyệt ngắt dòng bằng gạch nối
                    const lang = /^[\x20-\x7E]+$/.test(String(c)) ? { lang: "en" } : {}
                    return h("li", lang, note ? h("a", { class: "internal", href: rel(slug, note.slug) }, c) : c)
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

