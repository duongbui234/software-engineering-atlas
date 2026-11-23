// Chọn các trang cần kiểm tra hiển thị cho một PR, thay vì cả site.
// In ra danh sách đường dẫn trong public/ (mỗi dòng một trang), hoặc dòng "ALL" khi cần kiểm toàn site.
//
//   node scripts/changed-pages.mjs [base] [head] > pages.txt     (mặc định: HEAD^1 HEAD, tức commit merge của PR)
//   node scripts/check-render.mjs public --pages pages.txt
//
// Một trang được chọn khi:
//   - file nguồn của nó đổi (content/**/*.md → public/**/*.html);
//   - nó nhúng một sơ đồ archify đổi (content/diagrams/...);
//   - nó link tới một trang ở trên (bảng bài của ga, hub, backlink, trang thẻ, danh sách thư mục…);
//   - nó là trang khung luôn kiểm (trang chủ, kho bài, hub các tuyến), ở cả hai ngôn ngữ.
// Đổi theme, cấu hình, script, CI hay dependency thì in "ALL": mọi trang đều có thể đổi.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [base = 'HEAD^1', head = 'HEAD'] = process.argv.slice(2);
const ROOT = path.resolve('public');
const SKIP_DIRS = new Set(['diagrams', 'code', 'static']);

// Đường dẫn mà đổi một file trong đó thì mọi trang có thể đổi
const GLOBAL = [/^plugins\//, /^quartz\//, /^scripts\//, /^\.github\//, /^package(-lock)?\.json$/, /^quartz\.(config|lock)/, /^content\/static\//];

const changed = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' }).split('\n').filter(Boolean);
if (changed.some((f) => GLOBAL.some((re) => re.test(f)))) {
  console.log('ALL');
  process.exit(0);
}

function listHtml(dir, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!rel && SKIP_DIRS.has(e.name)) continue;
      out.push(...listHtml(path.join(dir, e.name), rel + e.name + '/'));
    } else if (e.name.endsWith('.html')) out.push(rel + e.name);
  }
  return out;
}

// "posts/x.html" → "posts/x"; "problems/index.html" → "problems"; "index.html" → ""
const slugOf = (file) => file.replace(/\.html$/, '').replace(/(^|\/)index$/, '');

const pages = listHtml(ROOT);
const bySlug = new Map(pages.map((p) => [slugOf(p), p]));
const targets = new Set();   // slug của trang có nguồn đổi
const diagrams = [];         // đường dẫn sơ đồ đổi, dạng "diagrams/<thư mục>/<tên>"

for (const f of changed) {
  if (f.startsWith('content/diagrams/') && f.endsWith('.html')) diagrams.push(f.slice('content/'.length).replace(/\.html$/, ''));
  else if (f.startsWith('content/') && f.endsWith('.md') && !f.startsWith('content/code/')) {
    const slug = f.slice('content/'.length).replace(/\.md$/, '').replace(/(^|\/)index$/, '');
    targets.add(slug); // trang đã xóa vẫn giữ: các trang từng link tới nó cũng cần kiểm
  }
}

const selected = new Set();
for (const slug of targets) if (bySlug.has(slug)) selected.add(bySlug.get(slug));
for (const p of pages) {
  const s = slugOf(p);
  if (s === '' || s === 'en' || s === 'problems' || s === 'en/problems' || /^(en\/)?series\//.test(s)) selected.add(p);
}

// Trang link tới một trang đổi, hoặc nhúng một sơ đồ đổi
if (targets.size || diagrams.length) {
  for (const p of pages) {
    if (selected.has(p)) continue;
    const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
    if (diagrams.some((d) => html.includes(d + '.html') || html.includes(d + '"'))) { selected.add(p); continue; }
    const here = new URL('http://x/' + p);
    for (const m of html.matchAll(/href="([^"#?]+)/g)) {
      let u;
      try { u = new URL(m[1], here); } catch { continue; }
      if (u.host !== 'x') continue;
      const s = slugOf(decodeURIComponent(u.pathname).replace(/^\//, '').replace(/\/$/, ''));
      if (targets.has(s)) { selected.add(p); break; }
    }
  }
}

console.log([...selected].sort().join('\n'));
