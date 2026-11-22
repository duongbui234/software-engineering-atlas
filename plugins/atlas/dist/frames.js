// Frame "atlas": khung neatline + masthead + lưới lề | bài | rail.
// Toàn bộ CSS của theme nằm ở đây (Quartz chèn frame.css vào mọi trang dùng frame này).
import { h, Fragment } from "preact"
import { fm, isIndex, isHub, hasMargin, coordOf, hubFor, pageDate, fmtFull, langOf, forLang, STR, problemEntry, isProblemSet } from "./shared.js"
import {
  AtlasBrand,
  AtlasHomeHead,
  AtlasHome,
  PostMargin,
  Standfirst,
  SeriesLine,
  SeriesHub,
  ARCHIFY_SCRIPT,
  MERMAID_SCRIPT,
  FEED_SCRIPT,
  CODETABS_SCRIPT,
  CATALOG_SCRIPT,
  StationProblems,
  ProblemSet,
} from "./components.js"

const Brand = AtlasBrand()
const HomeHead = AtlasHomeHead()
const Home = AtlasHome()
const Problems = StationProblems()
const PSet = ProblemSet()
const Margin = PostMargin()
const Stand = Standfirst()
const Line = SeriesLine()
const Hub = SeriesHub()

const CSS = String.raw`
:root {
  --survey: #C62D1F;
  --paper-2: #E5E7DC;
  --code-bg: #E8EAE0;
  --measure: 40rem;
  --ease: cubic-bezier(.2,.7,.2,1);
}
:root[saved-theme="dark"] {
  --survey: #FF6B5B;
  --paper-2: #0A141A;
  --code-bg: #152530;
}
.page[data-frame="atlas"] {
  --paper: var(--light);
  --ink: var(--dark);
  --ink-2: var(--gray);
  --water: var(--secondary);
  --contour: var(--tertiary);
  --grid: var(--lightgray);
  max-width: none;
}
body { background: var(--paper-2); font-size: 1.0625rem; line-height: 1.7; }
.page[data-frame="atlas"] > #quartz-body { display: block; padding: 0; }
.page[data-frame="atlas"] a { font-weight: 500; }
.page[data-frame="atlas"] a.internal {
  background: none; padding: 0; border-radius: 0; line-height: inherit;
  text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em;
}
.page[data-frame="atlas"] a.internal:hover { color: var(--water); text-decoration-thickness: 2px; }
:focus-visible { outline: 2px solid var(--survey); outline-offset: 3px; border-radius: 2px; }

/* ── Neatline ─────────────────────────────────────────────── */
.atlas-sheet {
  position: relative; max-width: 78rem; margin: 3rem auto 4.5rem;
  background: var(--paper); border: 1px solid var(--ink); outline: 1px solid var(--ink); outline-offset: 5px;
}
.atlas-sheet::before, .atlas-sheet::after { content: ""; position: absolute; inset: 0; pointer-events: none; }
.atlas-sheet::before {
  background:
    repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 48px) top / 100% 7px no-repeat,
    repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px 48px) bottom / 100% 7px no-repeat;
}
.atlas-sheet::after {
  background:
    repeating-linear-gradient(180deg, var(--ink) 0 1px, transparent 1px 48px) left / 7px 100% no-repeat,
    repeating-linear-gradient(180deg, var(--ink) 0 1px, transparent 1px 48px) right / 7px 100% no-repeat;
}
.atlas-inner { position: relative; z-index: 1; padding: 2rem clamp(1rem, 4vw, 3.5rem) 3rem; }
.corner { position: absolute; font: 500 .6875rem/1 var(--codeFont); color: var(--ink-2); }
.corner.tl { top: -1.55rem; left: 0; }
.corner.br { bottom: -1.55rem; right: 0; }

/* ── Masthead ─────────────────────────────────────────────── */
.atlas-masthead {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem 1.5rem;
  padding-bottom: 1rem; border-bottom: 1px solid var(--ink);
}
.atlas-masthead .tools { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.atlas-brand { display: flex; align-items: baseline; gap: 1.5rem; flex-wrap: wrap; }
.atlas-brand .brand {
  font: 600 1.375rem/1.1 var(--headerFont); color: var(--ink); text-decoration: none; letter-spacing: -.01em;
}
.atlas-brand .brand small { display: block; font: 400 .8125rem/1.4 var(--bodyFont); color: var(--ink-2); margin-top: .2rem; }
.atlas-brand .brand-nav a { font-size: .9375rem; color: var(--ink); text-decoration: none; }
.atlas-brand .brand-nav a:hover { text-decoration: underline; }
.atlas-brand .brand-nav { display: flex; align-items: baseline; gap: 1rem; }
.atlas-brand .brand-nav .lang-switch {
  font: 500 .75rem/1 var(--codeFont); letter-spacing: .08em; padding: .3rem .45rem;
  border: 1px solid var(--ink); color: var(--ink);
}
.atlas-brand .brand-nav .lang-switch:hover { text-decoration: none; background: var(--ink); color: var(--paper); }
/* en/index là trang thư mục với Quartz: ẩn danh sách file, trang chủ đã có danh mục riêng */
.atlas-sheet.is-home .page-listing, .atlas-sheet.is-catalog .page-listing { display: none; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.atlas-masthead .search { min-width: 12rem; }

/* ── Lưới lề | bài | rail ─────────────────────────────────── */
.atlas-grid { display: grid; gap: 1.5rem 2.5rem; padding-top: 2rem; grid-template-columns: minmax(0, 1fr); }
.atlas-grid.has-rail { grid-template-columns: minmax(0, 1fr) 14rem; }
.atlas-grid.has-margin.has-rail { grid-template-columns: 9.5rem minmax(0, 1fr) 14rem; }
.atlas-grid.has-margin:not(.has-rail) { grid-template-columns: 9.5rem minmax(0, 1fr); }
.atlas-grid > .center { min-width: 0; margin: 0; max-width: none; }
.atlas-rail > .rail-inner { position: sticky; top: 1.5rem; display: grid; gap: 2rem; }
.atlas-rail h3, .atlas-rail .toc-header h3 { font: 600 .9375rem/1.2 var(--headerFont); margin: 0 0 .5rem; }
.atlas-rail .graph, .atlas-rail .backlinks, .atlas-rail .toc { margin: 0; }
.atlas-rail .graph > .graph-outer { border-radius: 0; border-color: var(--grid); }
.atlas-margin .post-margin { position: sticky; top: 1.5rem; }

/* ── Bài viết ─────────────────────────────────────────────── */
.page[data-frame="atlas"] .center h1, .page[data-frame="atlas"] article h2, .page[data-frame="atlas"] article h3 {
  font-family: var(--headerFont); letter-spacing: -.012em; text-wrap: balance;
}
.page[data-frame="atlas"] .center > .page-header h1.article-title {
  font-size: clamp(2rem, 1.3rem + 3vw, 3.25rem); line-height: 1.08; margin: 0 0 1rem;
  font-variation-settings: "opsz" 144, "SOFT" 30;
}
.page[data-frame="atlas"] article h2 { font-size: 1.625rem; line-height: 1.2; margin: 3rem 0 .75rem; }
.page[data-frame="atlas"] article h3 { font-size: 1.1875rem; line-height: 1.3; margin: 1.5rem 0 .5rem; }
.page[data-frame="atlas"] article > p, .page[data-frame="atlas"] article > ul, .page[data-frame="atlas"] article > ol { max-width: var(--measure); }
.page[data-frame="atlas"] article li + li { margin-top: .35rem; }
.page[data-frame="atlas"] code { font-variant-ligatures: none; }
.page[data-frame="atlas"] pre {
  max-width: 46rem; border: 0; border-left: 3px solid var(--contour); border-radius: 0; background: var(--code-bg);
}
/* Tab code (CODETABS_SCRIPT): thanh tab ngang dính liền khối code, góc vuông */
.code-tabs { max-width: 46rem; margin: 1.5rem 0; }
.code-tabs-bar {
  display: flex; overflow-x: auto; scrollbar-width: thin; border-bottom: 1px solid var(--contour);
}
.code-tabs-bar [role=tab] {
  flex: none; margin: 0 0 -1px; padding: .55rem 1rem .5rem; cursor: pointer;
  font: 500 .8125rem/1.2 var(--codeFont); letter-spacing: .01em; color: var(--ink-2);
  background: transparent; border: 1px solid transparent; border-top-width: 3px; border-radius: 0;
}
.code-tabs-bar [role=tab]:hover { color: var(--ink); }
.code-tabs-bar [role=tab][aria-selected=true] {
  color: var(--ink); font-weight: 700; background: var(--code-bg);
  border-color: var(--ink) var(--contour) var(--code-bg) var(--contour);
}
.code-tabs-bar [role=tab]:focus-visible { outline: 2px solid var(--ink); outline-offset: -4px; }
.code-tabs > figure[data-rehype-pretty-code-figure] { margin: 0; }
.code-tabs > figure[data-rehype-pretty-code-figure] > pre { margin: 0; }
.code-tabs > figure[hidden] { display: none; }
/* NeetCode: bảng bài của ga (StationProblems) và trang kho problems/ (ProblemSet) */
.station-problems, .problem-set { max-width: 46rem; margin: 3rem 0 0; }
.station-problems h2 { margin-top: 0; }
.sp-lede { color: var(--ink-2); font-size: .9375rem; }
.problem-table { width: 100%; border-collapse: collapse; font-size: .9375rem; margin: .75rem 0 0; }
.problem-table th { text-align: left; font: 600 .6875rem/1.2 var(--codeFont); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); padding: .4rem .5rem; border-bottom: 1px solid var(--ink); }
.problem-table td { padding: .45rem .5rem; border-bottom: 1px solid var(--contour); vertical-align: baseline; }
.problem-table td.lc { font: 500 .8125rem/1.2 var(--codeFont); color: var(--ink-2); white-space: nowrap; }
.problem-table td.diff { font-size: .8125rem; white-space: nowrap; }
.problem-table td.diff.easy::before, .problem-table td.diff.medium::before, .problem-table td.diff.hard::before,
.post-margin .diff::before { content: ""; display: inline-block; width: .5rem; height: .5rem; margin-right: .4rem; border: 1px solid var(--ink); }
.problem-table td.diff.medium::before, .post-margin .diff.medium::before { background: linear-gradient(to top, var(--ink) 50%, transparent 50%); }
.problem-table td.diff.hard::before, .post-margin .diff.hard::before { background: var(--ink); }
.problem-table td.src { text-align: right; white-space: nowrap; font-size: .8125rem; }
.problem-table td.st, .problem-table td.grp { font-size: .8125rem; color: var(--ink-2); }
.problem-table tr.is-ahead td.t { color: var(--ink-2); }
.problem-table .ahead-note { font-size: .8125rem; font-style: italic; }
.problem-table tr.is-current td { background: var(--code-bg); }
.problem-table tr.is-current td.t { font-weight: 700; }
.problem-table tr[hidden] { display: none; }
.ps-progress { display: grid; grid-template-columns: auto 1fr; gap: .25rem 1rem; align-items: center; margin-bottom: 1.25rem; }
.ps-progress .big { font: 600 1.75rem/1 var(--headerFont); grid-row: span 2; }
.ps-progress .bar { position: relative; height: .5rem; border: 1px solid var(--ink); }
.ps-progress .bar b { position: absolute; inset: 0 auto 0 0; width: var(--at); background: var(--ink); }
.ps-progress .lbl { font-size: .875rem; color: var(--ink-2); }
.ps-filter { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: end; margin-bottom: .5rem; }
.ps-filter[hidden] { display: none; }
.ps-filter label { display: grid; gap: .25rem; font: 600 .6875rem/1.2 var(--codeFont); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-2); }
.ps-filter select { font: 400 .9375rem/1.2 var(--bodyFont); color: var(--ink); background: var(--paper); border: 1px solid var(--ink); border-radius: 0; padding: .35rem .5rem; max-width: 100%; }
.ps-filter output { font-size: .875rem; color: var(--ink-2); }
.ps-scroll { overflow-x: auto; }
@media (max-width: 720px) {
  .problem-table.full td.grp, .problem-table.full th:nth-child(5) { display: none; }
  .problem-table td.st { font-size: .75rem; white-space: nowrap; }
  .problem-table td.st .st-name { display: none; }
}
/* Sơ đồ Mermaid (MERMAID_SCRIPT render): cùng khung với khối code */
.atlas-mermaid {
  max-width: 46rem; margin: 1.5rem 0; padding: 1rem; overflow-x: auto; text-align: center;
  border-left: 3px solid var(--contour); background: var(--code-bg);
}
.atlas-mermaid svg { max-width: 100%; height: auto; }
.atlas-mermaid[data-src]:empty { min-height: 4rem; }
.standfirst { font-size: 1.1875rem; color: var(--ink-2); max-width: var(--measure); margin: 0 0 1rem; }
.page[data-frame="atlas"] .center > hr { display: none; }
.page-footer:empty { display: none; }

/* Đọc nhanh (callout tldr / summary của Obsidian) */
.page[data-frame="atlas"] .page-header { margin: 0; }
.page[data-frame="atlas"] .page-header > .popover-hint > *:first-child { margin-top: 0; }
.page[data-frame="atlas"] .callout[data-callout="abstract"], .page[data-frame="atlas"] .callout[data-callout="tldr"], .page[data-frame="atlas"] .callout[data-callout="summary"] {
  --color: var(--ink); --border: var(--ink); --bg: transparent;
  max-width: var(--measure); border: 1px solid var(--ink); border-radius: 0; background: transparent;
}
.page[data-frame="atlas"] .callout .callout-icon { display: none; }
/* Câu hỏi tự kiểm tra: callout gập (question) */
.page[data-frame="atlas"] .callout[data-callout="question"], .page[data-frame="atlas"] .callout[data-callout="faq"] {
  --color: var(--ink); --border: var(--grid); --bg: transparent;
  max-width: var(--measure); border: 0; border-top: 1px solid var(--grid); border-radius: 0; background: transparent; padding-left: 0;
}

/* ── Cột lề ───────────────────────────────────────────────── */
.post-margin { margin: 0; display: grid; gap: .75rem; font-size: .875rem; }
.post-margin dt { color: var(--ink-2); font-size: .75rem; }
.post-margin dd { margin: 0; }
.post-margin .big { font: 600 1.75rem/1 var(--codeFont); color: var(--ink); letter-spacing: -.02em; }
.post-margin .kind { display: inline-flex; gap: .45rem; align-items: center; }

/* ── Ký hiệu loại bài ─────────────────────────────────────── */
.sym { display: inline-block; width: .7rem; height: .7rem; flex: none; }
.sym.learn { border-radius: 50%; background: var(--water); }
.sym.code { background: var(--contour); }
.sym.problem { width: .6rem; height: .6rem; margin: .05rem; transform: rotate(45deg); border: 2px solid var(--water); }
.sym.note { width: 0; height: 0; border-left: .38rem solid transparent; border-right: .38rem solid transparent; border-bottom: .68rem solid var(--ink-2); }
.legend { display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; font-size: .875rem; color: var(--ink-2); margin: 0; padding: 0; list-style: none; }
.legend li { display: inline-flex; align-items: center; gap: .5rem; margin: 0; }

/* ── Trang chủ ────────────────────────────────────────────── */
.atlas-intro { display: grid; gap: 1.5rem; padding: 1rem 0 .5rem; }
.atlas-intro h1 { font-size: clamp(2rem, 1.3rem + 3vw, 3.25rem); line-height: 1.08; max-width: 18ch; margin: 0; font-variation-settings: "opsz" 144, "SOFT" 30; }
body[data-slug="index"] article { color: var(--ink-2); font-size: 1.125rem; }
body[data-slug="index"] article p { max-width: 36rem; margin: .5rem 0 0; }
.scalebar { display: inline-grid; gap: .3rem; font: 400 .75rem/1 var(--codeFont); color: var(--ink-2); }
.scalebar .bar { position: relative; display: flex; height: .45rem; width: 12rem; border: 1px solid var(--ink); }
.scalebar .bar i { flex: 1; }
.scalebar .bar i:nth-child(odd) { background: var(--ink); }
.scalebar .bar b { position: absolute; top: -.45rem; width: 2px; height: 1.3rem; background: var(--survey); left: var(--at); }
.scalebar .ticks { display: flex; justify-content: space-between; width: 12rem; }

.atlas-map { margin: 2rem 0 1rem; border-top: 1px solid var(--ink); border-bottom: 1px solid var(--ink); }
.atlas-map svg { display: block; width: 100%; height: auto; }
.atlas-map .map-narrow { display: none; }
.atlas-map .contour { fill: none; stroke: var(--contour); stroke-width: 1; opacity: .55; }
.atlas-map .contour.major { stroke-width: 1.4; opacity: .85; }
.atlas-map text { paint-order: stroke; stroke: var(--paper); stroke-linejoin: round; }
.atlas-map .region { font: italic 500 17px var(--headerFont); fill: var(--contour); letter-spacing: .08em; stroke-width: 6px; }
.atlas-map .town { fill: var(--paper); stroke: var(--ink); stroke-width: 1.4; }
.atlas-map .town.done { fill: var(--ink); }
.atlas-map .village { fill: var(--ink-2); stroke: var(--paper); stroke-width: 1; }
.atlas-map a:hover .village, .atlas-map a:focus-visible .village { fill: var(--water); stroke: var(--water); stroke-width: 3; }
.atlas-map .town-label { font: 400 12.5px var(--bodyFont); fill: var(--ink); stroke-width: 4px; }
.atlas-map .town-label.future { fill: var(--ink-2); }
.atlas-map .leader { stroke: var(--ink-2); stroke-width: .7; fill: none; }
.atlas-map .link { stroke: var(--ink-2); stroke-width: .8; stroke-dasharray: 2 3; fill: none; }
.atlas-map .route { fill: none; stroke: var(--survey); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.atlas-map .route.ahead { stroke-dasharray: 1 7; stroke-width: 2.5; }
.atlas-map .here { fill: var(--survey); }
.atlas-map .here-ring { fill: none; stroke: var(--survey); stroke-width: 1.5; transform-box: fill-box; transform-origin: center; animation: atlas-ping 2.4s var(--ease) infinite; }
.atlas-map .here-label { font: 600 12px var(--bodyFont); fill: var(--survey); stroke-width: 4px; }
.atlas-map .here-label.sub { font-weight: 400; }
.atlas-map a { text-decoration: none; }
.atlas-map a:focus-visible .town { stroke: var(--survey); stroke-width: 3; }
@keyframes atlas-ping { from { transform: scale(1); opacity: .9; } to { transform: scale(2.6); opacity: 0; } }
.map-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .75rem 1.5rem; padding: .5rem 0; }

.current {
  display: grid; grid-template-columns: auto 1fr auto; gap: .5rem 1rem; align-items: center;
  margin: 2rem 0; padding: 1rem 0; border-top: 3px solid var(--survey); border-bottom: 1px solid var(--grid);
}
.current .pin { width: .85rem; height: .85rem; border-radius: 50%; background: var(--survey); box-shadow: 0 0 0 4px color-mix(in srgb, var(--survey) 20%, transparent); }
.current h2 { font-size: 1.25rem; margin: 0; }
.current p { margin: .1rem 0 0; color: var(--ink-2); font-size: .9375rem; }
.current .go { white-space: nowrap; }

/* ── Mục lục bản đồ: mỗi tuyến một mảnh ──────────────────── */
.sheets h2 { font-size: 1.625rem; margin: 2rem 0 .25rem; }
.sheets-lede { margin: 0 0 .75rem; color: var(--ink-2); font-size: .9375rem; }
.sheet-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); border-top: 1px solid var(--ink); border-left: 1px solid var(--grid); }
.sheet { margin: 0; border-right: 1px solid var(--grid); border-bottom: 1px solid var(--grid); min-width: 0; }
.page[data-frame="atlas"] a.internal.sheet-link, .sheet.loose { display: grid; font-weight: 400; border-radius: 0; background: none; text-decoration: none; gap: .35rem; padding: .85rem 1rem 1rem; color: inherit; text-decoration: none; height: 100%; box-sizing: border-box; }
.page[data-frame="atlas"] a.internal.sheet-link:hover { color: inherit; background: color-mix(in srgb, var(--water) 6%, transparent); }
.sheet-link:hover .sheet-t { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .2em; }
.sheet-head { display: flex; justify-content: space-between; gap: .5rem; align-items: baseline; }
.sheet-code { font: 500 .75rem/1 var(--codeFont); color: var(--ink-2); letter-spacing: .04em; }
.sheet-region { font: italic 500 .875rem/1.2 var(--headerFont); color: var(--contour); letter-spacing: .06em; text-align: right; }
.sheet-t { font: 600 1.1875rem/1.25 var(--headerFont); color: var(--ink); }
.sheet-meta { font: 400 .8125rem/1.3 var(--codeFont); color: var(--ink-2); }
.sheet-towns { font-size: .9375rem; line-height: 1.5; overflow-wrap: anywhere; }
.ml { position: relative; display: flex; justify-content: space-between; align-items: center; height: .9rem; margin: .2rem 0; }
.ml::before { content: ""; position: absolute; left: .25rem; right: .25rem; top: 50%; border-top: 2px dotted var(--ink-2); }
.ml .ml-done { position: absolute; left: .25rem; top: calc(50% - 1.5px); height: 3px; width: calc((100% - .5rem) * var(--reached)); background: var(--survey); }
.ml i { position: relative; width: .5rem; height: .5rem; border-radius: 50%; background: var(--paper); border: 1.5px solid var(--ink-2); box-sizing: border-box; }
.ml i.done { background: var(--ink); border-color: var(--ink); }
.ml i.now { background: var(--survey); border-color: var(--survey); width: .65rem; height: .65rem; }
.sheets-more { margin-top: .75rem; }
.sheets-more summary { cursor: pointer; font-weight: 600; color: var(--water); padding: .25rem 0; }
.sheets-more[open] summary { margin-bottom: .75rem; }
.gz-all { margin: 1rem 0 0; color: var(--ink-2); font-size: .9375rem; }
.gz-all a { font-weight: 600; }

.gazetteer h2 { font-size: 1.625rem; margin: 2rem 0 .75rem; }
.gz-head { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem 1.5rem; flex-wrap: wrap; }
.page[data-frame="atlas"] .gz-head .gz-all-link { font-size: .9375rem; font-weight: 600; }
.gz-more { margin: 1.25rem 0 0; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.gz-load {
  font: 500 .875rem/1 var(--bodyFont); color: var(--ink); background: none; cursor: pointer;
  border: 1px solid var(--ink); padding: .6rem .9rem; min-height: 2.75rem;
}
.gz-load:hover:not(:disabled) { background: var(--ink); color: var(--paper); }
.gz-load:disabled { cursor: progress; color: var(--ink-2); border-color: var(--ink-2); }
.gz-status { margin: 0; color: var(--ink-2); font-size: .9375rem; }
.gz-status:empty { display: none; }
/* trang thẻ tiếng Anh (en/tags/*) do theme render */
.atlas-tags .tag-count { color: var(--ink-2); }
.atlas-tags ul.tag-index { list-style: none; padding: 0; columns: 14rem; }
.atlas-tags ul.tag-index li { margin: 0 0 .35rem; }
.gz { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--ink); }
.gz li { border-bottom: 1px solid var(--grid); margin: 0; }
.page[data-frame="atlas"] .gz a.row {
  display: grid; grid-template-columns: 6.5rem 1.2rem minmax(0, 1fr) auto; gap: .25rem .75rem; align-items: baseline;
  padding: 1rem .5rem; color: inherit; text-decoration: none; transition: background-color .15s var(--ease);
}
.gz a.row:hover { background: color-mix(in srgb, var(--water) 6%, transparent); }
.gz a.row:hover .t { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .2em; }
.gz .coord { font: 500 .8125rem/1.2 var(--codeFont); color: var(--ink-2); white-space: nowrap; }
.gz .t { font: 600 1.1875rem/1.3 var(--headerFont); color: var(--ink); }
.gz .d { grid-column: 3; color: var(--ink-2); font-size: .9375rem; font-weight: 400; }
.gz .date { font: 400 .8125rem/1 var(--codeFont); color: var(--ink-2); white-space: nowrap; }
.gazetteer .empty { color: var(--ink-2); }

/* ── Dải metro mini (đầu bài series) ──────────────────────── */
.series-line { margin: 1.25rem 0 .5rem; max-width: 40rem; }
.series-line ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(var(--n), 1fr); position: relative; }
.series-line ol::before {
  content: ""; position: absolute; left: calc(50% / var(--n)); right: calc(50% / var(--n)); top: .45rem; border-top: 2px dotted var(--ink-2);
}
.series-line ol::after {
  content: ""; position: absolute; left: calc(50% / var(--n)); top: .4rem; border-top: 3px solid var(--survey);
  width: calc(100% / var(--n) * (var(--done) - 1));
}
.series-line li { position: relative; z-index: 1; display: grid; justify-items: center; gap: .35rem; text-align: center; font-size: .75rem; color: var(--ink-2); margin: 0; }
.series-line .st { width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid var(--ink-2); background: var(--paper); box-sizing: border-box; }
.series-line .done .st { background: var(--survey); border-color: var(--survey); }
.series-line .now .st { border: 4px solid var(--survey); }
.series-line .now { color: var(--ink); font-weight: 600; }
.page[data-frame="atlas"] .series-line a.internal { color: inherit; text-decoration: none; font-weight: 400; }
.series-line a:hover { text-decoration: underline; }
.series-line .line-cap { display: flex; justify-content: space-between; gap: 1rem; font-size: .8125rem; color: var(--ink-2); margin-top: .5rem; }

/* ── Hub series ───────────────────────────────────────────── */
.series-hub .facts { display: flex; flex-wrap: wrap; gap: .75rem 3rem; margin: 1rem 0 0; }
.series-hub .facts div { display: grid; gap: .2rem; }
.series-hub .facts dt { font-size: .8125rem; color: var(--ink-2); }
.series-hub .facts dd { margin: 0; font: 600 1.5rem/1 var(--headerFont); color: var(--ink); }
.metro { margin: 3rem 0 2rem; container: metro / inline-size; }
.metro ol { list-style: none; margin: 0; padding: 0; position: relative; display: grid; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); gap: 0 .75rem; }
.metro ol::before { content: ""; position: absolute; top: 1.05rem; left: calc(50% / var(--n)); right: calc(50% / var(--n)); border-top: 3px dotted var(--ink-2); }
.metro ol::after {
  content: ""; position: absolute; top: .95rem; left: calc(50% / var(--n)); height: 6px; border-radius: 3px;
  width: calc(100% / var(--n) * var(--done)); background: var(--survey);
  transform-origin: left; animation: atlas-draw 1.1s var(--ease) .2s both;
}
@keyframes atlas-draw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.stop { position: relative; z-index: 1; min-width: 0; display: grid; justify-items: center; align-content: start; text-align: center; gap: .5rem; margin: 0; }
.stop .dot { width: 2.2rem; height: 2.2rem; box-sizing: border-box; border-radius: 50%; border: 3px solid var(--ink-2); background: var(--paper); display: grid; place-items: center; font: 600 .875rem/1 var(--codeFont); color: var(--ink-2); }
.stop.done .dot { background: var(--survey); border-color: var(--survey); color: var(--paper); }
.stop.now .dot { border: 5px solid var(--survey); color: var(--survey); width: 2.6rem; height: 2.6rem; margin-top: -.2rem; box-shadow: 0 0 0 6px color-mix(in srgb, var(--survey) 18%, transparent); }
.page[data-frame="atlas"] .stop h2 { font-size: 1.0625rem; margin: .5rem 0 0; line-height: 1.25; }
.page[data-frame="atlas"] .stop h2 a.internal { color: var(--ink); text-decoration: none; font-weight: inherit; }
.stop h2 a:hover { text-decoration: underline; }
.stop .status { font-size: .8125rem; color: var(--ink-2); }
.stop.now .status { color: var(--survey); font-weight: 600; }
.stop ul { list-style: none; margin: .5rem 0 0; padding: .75rem 0 0; border-top: 1px solid var(--grid); width: 100%; display: grid; gap: .3rem; font-size: .875rem; }
.stop ul li { margin: 0; min-width: 0; }
.stop ul li a, .stop ul li { overflow-wrap: anywhere; }
.stop ul li[lang="en"] { hyphens: auto; }
.page[data-frame="atlas"] .stop h2 { overflow-wrap: anywhere; }
.metro.long ol { column-gap: .5rem; }
.metro.long .stop ul { font-size: .8125rem; }
/* Tuyến dài (≥ 8 ga): khung hẹp không đủ chỗ cho từng cột, chuyển sang dạng dọc sớm hơn */
@container metro (max-width: 56rem) {
  .metro.long ol { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
  .metro.long ol::before { top: 1rem; bottom: 1rem; left: 1.1rem; right: auto; border-top: 0; border-left: 3px dotted var(--ink-2); }
  .metro.long ol::after { display: none; }
  .metro.long .stop { grid-template-columns: 2.6rem minmax(0, 1fr); justify-items: start; text-align: left; column-gap: 1rem; }
  .metro.long .stop .dot { grid-row: span 3; justify-self: center; }
  .metro.long .stop ul { grid-column: 2; }
}
.stop.ahead ul { color: var(--ink-2); }

/* ── Khung archify ────────────────────────────────────────── */
.figure-map { margin: 2rem 0; max-width: 56rem; }
.figure-map .frame { border: 1px solid var(--ink); background: var(--paper-2); }
.figure-map iframe { display: block; width: 100%; aspect-ratio: var(--ar, 4 / 3); height: auto; min-height: 22rem; max-height: 80vh; border: 0; }
.figure-map figcaption { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .5rem 1rem; font-size: .875rem; color: var(--ink-2); padding-top: .5rem; }
.figure-map figcaption b { font-family: var(--headerFont); color: var(--ink); }

/* ── Footer ───────────────────────────────────────────────── */
.page[data-frame="atlas"] > #quartz-body footer { min-width: 0; max-width: 78rem; margin: 0 auto 3rem; padding: 0; opacity: 1; color: var(--ink-2); font-size: .875rem; text-align: left; }
.page[data-frame="atlas"] footer ul { padding: 0; }

@media (max-width: 68rem) {
  .atlas-grid.has-margin.has-rail { grid-template-columns: 8rem minmax(0, 1fr); }
  .atlas-grid.has-rail:not(.has-margin) { grid-template-columns: minmax(0, 1fr); }
  .atlas-grid.has-margin.has-rail > .atlas-rail { grid-column: 2; }
  .atlas-rail > .rail-inner { position: static; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); }
}
@media (max-width: 52rem) {
  .metro ol { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; }
  .metro ol::before { top: 1rem; bottom: 1rem; left: 1.1rem; right: auto; border-top: 0; border-left: 3px dotted var(--ink-2); }
  .metro ol::after { display: none; }
  .stop { grid-template-columns: 2.6rem minmax(0, 1fr); justify-items: start; text-align: left; column-gap: 1rem; }
  .stop .dot { grid-row: span 3; justify-self: center; }
  .stop ul { grid-column: 2; }
}
@media (max-width: 44rem) {
  body { font-size: 1rem; }
  .atlas-sheet { margin: .75rem .75rem 3rem; outline-offset: 3px; }
  .page[data-frame="atlas"] > #quartz-body footer { margin: 0 .75rem 2rem; }
  .corner { display: none; }
  .atlas-grid, .atlas-grid.has-margin.has-rail, .atlas-grid.has-margin:not(.has-rail) { grid-template-columns: minmax(0, 1fr); gap: 1rem; }
  .atlas-grid.has-margin.has-rail > .atlas-rail { grid-column: auto; }
  .atlas-grid > .atlas-margin { order: 1; }
  .atlas-grid > .center { order: 2; }
  .atlas-grid > .atlas-rail { order: 3; }
  .post-margin { position: static; grid-template-columns: repeat(3, auto); justify-content: start; gap: .5rem 1.25rem; border-block: 1px solid var(--grid); padding: .75rem 0; }
  .post-margin .big { font-size: 1.125rem; }
  .series-line .name { display: none; }
  .series-line .now .name { display: block; position: absolute; top: 1.4rem; white-space: nowrap; left: 50%; transform: translateX(-50%); }
  /* ga sát hai đầu tuyến: neo tên vào mép để không tràn ra ngoài màn hình */
  .series-line li:nth-child(-n+3).now .name { left: 0; transform: none; text-align: left; }
  .series-line li:nth-last-child(-n+3).now .name { left: auto; right: 0; transform: none; text-align: right; }
  .series-line { margin-bottom: 1.5rem; }
  .series-line .line-cap { margin-top: 1.75rem; } /* chừa chỗ cho tên ga hiện tại (absolute) */
  .atlas-map .map-wide { display: none; }
  .atlas-map .map-narrow { display: block; }
  .atlas-map .town-label, .atlas-map .here-label { font-size: 17px; }
  .atlas-map .region { font-size: 20px; }
  .current { grid-template-columns: auto 1fr; }
  .current .go { grid-column: 2; }
  .page[data-frame="atlas"] .gz a.row { grid-template-columns: 1.2rem minmax(0, 1fr); padding-inline: 0; }
  .gz .coord { grid-column: 2; grid-row: 1; }
  .gz .sym { grid-row: 2; }
  .gz .t { grid-column: 2; grid-row: 2; }
  .gz .d, .gz .date { grid-column: 2; }
  .figure-map iframe { aspect-ratio: 3 / 4; }
}
@media (prefers-reduced-motion: reduce) {
  .atlas-map .here-ring, .metro ol::after { animation: none; }
  .gz a.row { transition: none; }
}
`

// <html lang> do Quartz đặt theo locale chung (vi-VN); trang tiếng Anh sửa lại khi tải và
// sau mỗi lần điều hướng SPA, để trình đọc màn hình và ngắt dòng dùng đúng ngôn ngữ.
const LANG_SCRIPT = `
function atlasSetLang() {
  const s = document.querySelector(".atlas-sheet[data-lang]");
  if (s) document.documentElement.lang = s.dataset.lang === "en" ? "en" : "vi";
}
atlasSetLang();
document.addEventListener("nav", atlasSetLang);
// Tìm kiếm và đồ thị đọc chung static/contentIndex.json qua promise toàn cục fetchData và chỉ
// dựng chỉ mục một lần mỗi lần tải trang. Đổi ngôn ngữ luôn tải lại cả trang (lang-switch có
// data-router-ignore, trang tiếng Anh chỉ link trang tiếng Anh), nên bỏ các mục khác ngôn ngữ
// khỏi dữ liệu đó ngay khi tải xong: kết quả tìm kiếm và đồ thị chỉ còn trang cùng ngôn ngữ.
if (!window.atlasIndexLang && typeof fetchData !== "undefined") {
  const sheet = document.querySelector(".atlas-sheet[data-lang]");
  const lang = sheet && sheet.dataset.lang === "en" ? "en" : "vi";
  window.atlasIndexLang = lang;
  fetchData.then((data) => {
    const index = data && typeof data.content === "object" ? data.content : data;
    if (!index || typeof index !== "object") return;
    for (const slug of Object.keys(index)) {
      const isEn = slug === "en" || slug.startsWith("en/");
      if (isEn !== (lang === "en")) delete index[slug];
    }
  });
}
`

function cornerText(fileData, allFiles, S) {
  const m = fm(fileData)
  if (isIndex(fileData)) return [S.updated(fmtFull(new Date())), S.drawnWith]
  if (isHub(fileData)) return [S.hubCorner(m.title, (m.stations || []).length), m.region || ""]
  const code = coordOf(allFiles, fileData)
  const entry = problemEntry(fileData)
  const line = m.series || (entry && entry.line)
  const hub = line ? hubFor(allFiles, line) : undefined
  const tl = [code, hub && fm(hub).region, hub && fm(hub).title].filter(Boolean).join(", ")
  const d = pageDate(fileData)
  return [tl, d ? S.writtenOn(fmtFull(d)) : ""]
}

export const AtlasFrame = {
  name: "atlas",
  css: CSS,
  render({ componentData, header, beforeBody, pageBody: Content, afterBody, left, right, footer }) {
    const { fileData, allFiles } = componentData
    const L = langOf(fileData)
    const S = STR[L]
    // component có sẵn của Quartz (mục lục, liên kết ngược, đồ thị, tìm kiếm) lấy chữ theo cfg.locale
    if (L !== "vi") componentData = { ...componentData, cfg: { ...componentData.cfg, locale: S.locale } }
    // mọi component (kể cả trang thẻ, liên kết ngược của Quartz) chỉ thấy trang cùng ngôn ngữ;
    // atlasAllFiles giữ cả hai để nút VI/EN tìm trang tương ứng
    componentData = { ...componentData, allFiles: forLang(allFiles, L), atlasAllFiles: allFiles }
    const showMargin = hasMargin(fileData)
    const showRail = right.length > 0 && !isIndex(fileData) && !isHub(fileData)
    const [tl, br] = cornerText(fileData, forLang(allFiles, L), S)
    const gridClass = ["atlas-grid", showMargin && "has-margin", showRail && "has-rail"].filter(Boolean).join(" ")
    const render = (C) => h(C, componentData)
    return h(Fragment, null, [
      h("script", { dangerouslySetInnerHTML: { __html: ARCHIFY_SCRIPT } }),
      h("script", { dangerouslySetInnerHTML: { __html: MERMAID_SCRIPT } }),
      h("script", { dangerouslySetInnerHTML: { __html: FEED_SCRIPT } }),
      h("script", { dangerouslySetInnerHTML: { __html: CODETABS_SCRIPT } }),
      h("script", { dangerouslySetInnerHTML: { __html: CATALOG_SCRIPT } }),
      h("div", { class: ["atlas-sheet", isIndex(fileData) && "is-home", isProblemSet(fileData) && "is-catalog"].filter(Boolean).join(" "), "data-lang": L, lang: L }, [
        tl && h("span", { class: "corner tl" }, tl),
        br && h("span", { class: "corner br" }, br),
        h("div", { class: "atlas-inner" }, [
          h("header", { class: "atlas-masthead" }, [render(Brand), h("div", { class: "tools" }, header.map(render))]),
          h("div", { class: gridClass }, [
            showMargin && h("aside", { class: "atlas-margin", "aria-label": S.postInfo }, [render(Margin), ...left.map(render)]),
            h("div", { class: "center" }, [
              h(
                "div",
                { class: "page-header" },
                h("div", { class: "popover-hint" }, [
                  render(HomeHead),
                  // trang chủ có tiêu đề lớn riêng (HomeHead); bỏ article-title, nhất là ở en/index,
                  // nơi Quartz coi trang là trang thư mục nên điều kiện "not-index" không chặn được
                  ...(isIndex(fileData) ? [] : beforeBody.map(render)),
                  render(Stand),
                  render(Line),
                  render(Hub),
                ]),
              ),
              h(Content, componentData),
              render(PSet),
              render(Problems),
              h("div", { class: "page-footer" }, [render(Home), ...afterBody.map(render)]),
            ]),
            showRail &&
              h("aside", { class: "atlas-rail", "aria-label": S.railNav }, h("div", { class: "rail-inner" }, right.map(render))),
          ]),
        ]),
      ]),
      ...footer.map(render),
      h("script", { dangerouslySetInnerHTML: { __html: LANG_SCRIPT } }),
    ])
  },
}
