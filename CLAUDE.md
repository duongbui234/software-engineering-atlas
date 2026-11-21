# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Software Engineering Atlas**: a public Vietnamese learning journal ("sổ tay học kỹ thuật phần mềm"), one topic per day, deployed to GitHub Pages at `duongbui234.github.io/software-engineering-atlas`. Built on **Quartz v5** (Node ≥ 22). Concepts are written as linked notes so the Quartz graph view becomes a "map" of what has been learned. Mechanisms and code flows are visualized with **archify** diagrams embedded in posts.

**Current state:** Quartz 5.1 runs with the Atlas theme (`plugins/atlas/`). Fonts, colors and the `vi-VN` locale are set in `quartz.config.yaml`. `prototype/` holds the approved static mockups (home, post, series hub), and `design-system/software-engineering-atlas/MASTER.md` is the design source of truth. The `/learn` and `/publish` skills exist. The API Concepts series (`content/series/api-concepts.md`) is complete: six station posts `content/posts/2026-11-18-api-*.md`, one per station, with 33 concept notes. Most examples come from the owner's private `~/code/flash-sale` project (NestJS), published only as trimmed snippets.

## Quartz setup

- `main` is built on top of upstream Quartz history (`upstream` remote → `jackyzha0/quartz`, branch `v5`). Update with `npx quartz upgrade` (`update` is an alias) on a branch, then `npx quartz plugin doctor --fix` (moves plugins absorbed into core, e.g. `quartz-fonts` → `configuration.fonts`) and `npx quartz plugin install --from-config`, then build before merging into `main`. To keep merges clean, avoid editing upstream files (`quartz/`, `docs/`, upstream `.github/` files) unless necessary. Site-specific changes belong in `quartz.config.yaml`, `content/`, our own components and styles, and `.github/workflows/deploy.yml`.
- Upstream workflows are guarded by `github.repository == 'jackyzha0/quartz'` and do not run here. Our CI is `.github/workflows/deploy.yml`: it builds on PRs and builds and deploys on push to `main`. After the build it runs `scripts/check-render.mjs` (render check, see Commands), so a page that scrolls sideways or an unreadable Mermaid diagram fails the PR. In the repo settings, set Pages → Source to **GitHub Actions**.
- `@quartz-community/*` plugins are npm packages installed by `npm ci`. The only non-npm plugin is the local `./plugins/atlas` (see below).
- Drafts are handled by Quartz core: `draft: true` pages are not emitted. `cname` is disabled because the site runs under the `/software-engineering-atlas` subpath.
- Comments (giscus) and analytics (GoatCounter) are configured but off. Comments need GitHub Discussions plus `repoId`/`categoryId` from giscus.app. Analytics needs a GoatCounter `websiteId`.
- npm 11 blocks the install scripts of `esbuild` and `@parcel/watcher`. The build works anyway, so don't approve them unless something breaks.

## Commands

```bash
npm ci                          # install (includes Quartz plugins)
npx quartz build --serve        # dev server on http://localhost:8080 with live reload
npx quartz build                # production build into public/
npx quartz plugin doctor        # check plugin config
npm run check                   # tsc + prettier (upstream code)

# Render check (also runs in CI after build): every page at 390px and 1440px.
# Fails on horizontal page scroll, broken Mermaid, "Unsupported markdown" labels, or diagrams shrunk below 75%.
npm i --no-save playwright-core@1.49.1 && node scripts/check-render.mjs

# Preview the prototype (iframes and theme sync need http, not file://)
cd prototype && python3 -m http.server 8765

# Render and validate an archify diagram (always run finalize; a non-zero exit is a failure)
node ~/.agents/skills/archify/bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json

# Run a TypeScript example directly (Node 24 strips types natively)
node path/to/example.ts

# Query the UI/UX design dataset (project-local skill)
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <style|color|typography|ux|google-fonts>

# Headless screenshot for visual self-review
google-chrome --headless=new --hide-scrollbars --virtual-time-budget=6000 --window-size=1440,2400 --screenshot=out.png http://localhost:8765/index.html
#   dark mode: add --blink-settings=preferredColorScheme=0
```

## Content model

```
content/
  index.md                      home; `headline` frontmatter is the big h1, body is the intro
  posts/YYYY-MM-DD-<slug>.md    dated posts (a file, not a folder: folder index.md becomes a folder listing page)
  concepts/<term>.md            short atomic definitions, wikilinked from posts → map towns + graph
  series/<id>.md                series hub: frontmatter drives the metro map and the home-page route
  diagrams/<post-slug>/*.json|*.html   archify source + rendered viewer
  code/<post-slug>/*.ts         runnable examples (never name a file like its folder)
  projects/<name>/              walkthroughs of the owner's own code
backlog.md                      topics to learn (not published)
```

Post frontmatter: `title`, `date`, `description` (one sentence for home/RSS/SEO and the standfirst), `tags`, `draft`, `type` (`learn` | `code` | `note`), `level` (`beginner` | `intermediate` | `advanced`), optional `sources`, and `series` + `part` for series posts. Concept notes may set `region` (the map region). Otherwise the region is inferred from the series hub listing that concept, then from the first tag.

Series hub frontmatter: `series` (id that posts reference), `code` (coordinate prefix, e.g. `API`), `region`, `description`, and `stations: [{ name, concepts: [...] }]`. A station counts as visited when a post with `series: <id>, part: N` exists. The latest such post is "bạn đang ở đây". The solid red line covers only stations visited contiguously from station 1.

**Coordinate codes** are computed as `<hub code>-<NN part>` for series posts. Otherwise the code comes from the frontmatter `code` field (`NOTE-<NNN>`, `PRJ-<NN>`).

**Series:** group related concepts into ~6–8 thematic parts (4–6 concepts each), not one giant post and not one post per tiny concept. Each concept also gets its own `concepts/` note linking back to its part. Only create concept notes for parts that have actually been written.

**Drafts:** `draft: true` pages are not emitted. To preview drafts locally, temporarily add `drafts: { publish: true }` under `configuration` in `quartz.config.yaml`, and never commit that change.

## Atlas theme (`plugins/atlas/`)

A local Quartz plugin written as plain ESM in `dist/`. There is no build step: `dist/` is the source and is committed.
- `frames.js`: the `atlas` page frame (neatline sheet, masthead, `margin | body | rail` grid) **and all theme CSS**. It renders the theme components directly, because Quartz places only one layout component per plugin. Every page type uses `template: atlas` in `quartz.config.yaml`.
- `components.js`: brand, home headline and scale bar, home map + current line + gazetteer, post margin, standfirst, series mini-line, series hub. Also `ARCHIFY_SCRIPT`, which syncs iframe theme and the "open full screen" link, and `MERMAID_SCRIPT`, which renders Mermaid blocks. The obsidian-flavored-markdown renderer is off (`mermaid: false` in `quartz.config.yaml`): it ran `mermaid.run` twice concurrently on `nav` + `render`, so diagrams shared an id and drew over each other. `MERMAID_SCRIPT` renders serially with unique ids, re-renders on `themechange`, and takes colors from the Atlas tokens on `.page`.
- `map.js`: the data-driven knowledge map SVG. There is a wide variant and a narrow mobile variant centred on "bạn đang ở đây". Concepts listed in a hub station render as small unlabeled "villages" around that station (name in an SVG `<title>`), so a series with dozens of concepts stays readable; other concepts get labeled towns on the outer ring.
- `shared.js`: slug/date/series helpers.
- `index.js`: default export is an **emitter** that copies `content/diagrams/**` and `content/code/**` verbatim. Quartz's asset emitter strips `.html` and renames `x/x.ts` to `x/index.ts`, so both dirs are listed in `ignorePatterns`.
- Stock Quartz components still in use: search and darkmode (masthead), article-title (`not-index`), TOC, graph and backlinks (rail), footer. Explorer, recent-notes, breadcrumbs, content-meta, note-properties and reader-mode are disabled.
- The plugin is registered with `npx quartz plugin add ./plugins/atlas`. `quartz.lock.json` stores an absolute path, so it is gitignored and CI runs `npx quartz plugin install --from-config`.

## Writing conventions

- Write in Vietnamese and keep technical terms in English. The voice is first person "mình", a learner retelling what they figured out ("mình từng nghĩ X, hóa ra Y").
- `learn` posts follow this skeleton: **Đọc nhanh** (`> [!tldr] Đọc nhanh` callout, 3–5 bullets) → **Bối cảnh** → **Từ điển nhanh** → **Hình dung trước** → Vấn đề → Cơ chế (archify diagram) → Ví dụ chạy được → Hiểu lầm và bẫy → Câu hỏi tự kiểm tra (collapsed `> [!question]- …` callouts) → Tham khảo. `content/posts/2026-11-18-api-reliability.md` is the reference example; `2026-11-18-api-foundations.md` shows the beginner end.
- **Write for a reader who has never seen the owner's code.** The three opening blocks carry that reader into the technical part:
  - **Bối cảnh** (`> [!info] Bối cảnh`): 2–4 sentences on the example project (for flash-sale: a flash-sale shop where thousands of people race for a few hundred units at a fixed hour), and a line saying the reader needs no knowledge of the framework or the repo.
  - **Từ điển nhanh** (`> [!abstract]- Từ điển nhanh cho bài này (bấm để mở)`, collapsed): one plain-Vietnamese line per tool or term the post uses without explaining (Redis, pod, hash, decorator…). Link to an earlier station instead of redefining its terms.
  - **Hình dung trước** (an `##` section): one everyday analogy carried through the whole post (gọi món ở nhà hàng, ra vào tòa nhà, đặt bánh qua điện thoại…). Map each concept of the post to a row in a table `Đời thường | Khái niệm`, then add a Mermaid diagram of the analogy or the flow. Refer back to the analogy when a later section gets dense.
- In the body, name each component by its **role in plain words first**, then the framework class in parentheses or code (`bảo vệ (JwtAuthGuard)`). Explain a framework term on first use (decorator, interceptor, controller). Turn dense step-by-step passages into a step table or a Mermaid `sequenceDiagram`.
- Mermaid diagrams render client-side: prefer `flowchart TB` over a wide `LR` chain (wide charts shrink to unreadable in the 40rem column), use rectangles over `{}` diamonds, and keep each chart acyclic where possible. Screenshot every post that gains a Mermaid block.
- **Run every code example before publishing.** Default to TypeScript. Anything that cannot run standalone gets the comment `// minh họa, không chạy trực tiếp`.
- `sources` is optional. When the post came from web research, add a "Tham khảo" section anyway. Rewrite in your own understanding; never copy text or reproduce the structure of a paid or paywalled source. Example: the API series takes only the *list* of 33 concept names from newsletter.systemdesign.one (credited on the hub); every explanation, example and diagram is self-written.
- When writing about the owner's private projects, publish only diagrams and trimmed or renamed snippets: no company or customer names, internal endpoints, or secrets. Ask before publishing.

## Workflow

Three user-invoked skills: `.claude/skills/learn/`, `.claude/skills/publish/` and `.claude/skills/deep-dive/`. The **learning log** `.learn/<slug>.md` (gitignored) hands off between them.
- `/learn [topic] [--repo path]`: teaches the topic in chat and logs the sources, the owner's verbatim questions and misconceptions, the examples it ran, the diagram idea and the concepts touched. With no topic, it suggests candidates from `backlog.md` and the next hub stations.
- `/publish [slug]`: writes the post from the log, plus code, the archify diagram and concept notes. It builds and previews the site, then opens a PR from `post/<slug>`. **Merging the PR publishes the post.** The skill never merges.
- `/deep-dive <topic> [--repo path]`: the hands-off path. It researches the topic exhaustively, writes one post or a whole new series (reusing `/publish` steps 3–7), opens a PR, waits for green CI, **merges it itself** (squash) and deletes the branch, then checks the deploy. Any failed gate stops it before merge and leaves the PR open.
- `backlog.md` (repo root, not published) holds topics to learn later.

## archify embedding contract

- Keep the archify source and the rendered viewer side by side as `content/diagrams/<post-slug>/<name>.json` and `<name>.html`, and commit both. Set `meta.output` to the `.html` path. Render with `finalize`.
- Embed with raw HTML in the post, using paths relative to the post (`../diagrams/...`):
  ```html
  <figure class="figure-map" style="--ar: 1 / 1">
  <div class="frame"><iframe data-archify="../diagrams/<slug>/<name>.html" title="…" loading="lazy"></iframe></div>
  <figcaption><span><b>Hình 1.</b> …</span><a href="../diagrams/<slug>/<name>.html" target="_blank" rel="noopener">Mở toàn màn hình</a></figcaption>
  </figure>
  ```
  `ARCHIFY_SCRIPT` sets `src` to `…?embed=1&theme=<light|dark>` and follows `themechange`. It also rewrites the caption link, because Quartz strips `.html` from it. In embed mode, archify keeps its toolbar (theme, export, fullscreen), so give `--ar` enough height for it.
- **Size budget:** each rendered HTML file is about 820 KB, and GitHub Pages limits a site to about 1 GB. Use at most one interactive archify diagram per post and Mermaid for secondary diagrams. Revisit (move to R2 or Git LFS) once the site passes about 600 MB.
- **Labels:** a participant or component `label` names its role in plain Vietnamese (`Bảo vệ`, `Sổ phiên`, `Bộ nhớ tạm`); the `sublabel` carries the class or tool (`Guards: JWT, quyền, rate`, `Redis: session, refresh_token`). A message `label` says what happens in words (`giành khóa: chỉ mình tôi đi hỏi`); the raw command or route goes in its `note` (`SET lock NX EX 5`). Cards use plain language too. archify has no separate click-to-reveal field, so the sublabel is the "detail" layer. A new `note` needs vertical room: when `finalize` reports `sequence/note-overlap`, move the later messages down.
- archify has no Vietnamese viewer catalog, so omit `meta.locale` (viewer chrome stays English) and keep all authored strings in Vietnamese. Generated receipts (`*.finalize.json`, `*.browser-check.json`, `*.delivery.json`) are gitignored and skipped by the emitter.

## Design

Read `design-system/software-engineering-atlas/MASTER.md` before any UI work. The direction is **Cartographic Atlas** (topographic-map vocabulary):
- a neatline frame with tick marks around every page;
- a knowledge map on the home page and a metro-line map on series hubs;
- legend symbols for post types (● learn, ■ code, ▲ note);
- fonts: Fraunces for headings, Be Vietnam Pro for body text, JetBrains Mono for codes and code blocks.

`--survey` red is reserved for position and progress. Use no GSAP or scroll-reveal animation. Don't drift toward cream-plus-terracotta or rounded-card layouts.

## Repo notes

- The default branch is `main`.
- `.claude/skills/` and `.agents/skills/` hold UI/UX skills installed by the owner (ui-ux-pro-max and related). They are tooling, not site content.
- The archify skill itself lives outside the repo at `~/.agents/skills/archify/`.

## Next Step Suggestions

After completing each task:
- Analyze the current project state.
- Suggest exactly one logical next action.
- Make the suggestion a complete, meaningful task with a reviewable outcome;
  group related reading, implementation, verification and reporting within the
  authorized scope. Do not suggest a sequence of tiny tasks such as editing one
  field, staging a file, then reviewing it in separate turns when they can be
  handled together. Keep necessary approval boundaries explicit.
- Provide a ready-to-send Vietnamese prompt.
- Prioritize unfinished work, bugs, tests, and dependencies.
- Do not execute the suggested action automatically.
- Bundle low-risk work into one approval: drafting scripts, gates, solver or
  driver runs inside the evidence directory, no-solver checks and the report
  against predefined interpretation tables belong to a single suggested prompt,
  not separate "design" and "run" rounds. Keep hard limits (watchdog, deadline,
  no retry, stop on a failed gate) in that prompt.
- Ask separately only for: product code changes, commits, merges, pushes, and
  deleting branches or tags. Group "docs + checks + commit + local merge" into
  one approval and "push + branch/worktree cleanup" into another.

End every response with:

**Gợi ý tiếp theo:**
> [Prompt cụ thể để người dùng copy và gửi]
