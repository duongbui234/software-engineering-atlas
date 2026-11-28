// Kiểm tra hiển thị sau khi build: mở mọi trang trong public/ ở 390px và 1440px bằng Chrome headless.
// Lỗi (exit 1) khi:
//   - trang cuộn ngang (scrollWidth lớn hơn bề rộng màn hình);
//   - một sơ đồ Mermaid render hỏng (theme thay bằng khối code) hoặc hiện "Unsupported markdown";
//   - một sơ đồ Mermaid bị co dưới 75% cỡ thật (chữ quá nhỏ để đọc);
//   - một sơ đồ Mermaid rộng hơn vùng nội dung của khung, tức phải cuộn ngang trong khung (ở 390px khung còn ~353px, nên bề rộng thật phải ≤ ~470px);
//   - tiêu đề subgraph của một sơ đồ Mermaid đè lên một node (khung g.cluster-label giao khung g.node, chừa 1px);
//   - một sơ đồ archify nhúng bị cắt: khung iframe thấp hơn nội dung (viewer đặt overflow:hidden).
//
// Chạy local:  npx quartz build && npm i --no-save playwright-core@1.49.1 && node scripts/check-render.mjs
// Chỉ một số trang: node scripts/check-render.mjs public --pages pages.txt (danh sách từ scripts/changed-pages.mjs;
//              file chứa dòng "ALL" thì vẫn kiểm cả site). CI dùng cách này cho PR, kiểm cả site khi push lên main.
// Chrome:      dùng CHROME_PATH nếu có, không thì /usr/bin/google-chrome hoặc Chromium của Playwright.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const pagesArg = args.indexOf('--pages');
const PAGES_FILE = pagesArg >= 0 ? args.splice(pagesArg, 2)[1] : null;
const ROOT = path.resolve(args[0] || 'public');
const WIDTHS = [390, 1440];
const MIN_SCALE = 0.75;
const CONCURRENCY = 8;
// Thư mục chép nguyên văn (viewer archify, file code), không phải trang của site
const SKIP_DIRS = new Set(['diagrams', 'code', 'static']);

function findChrome() {
  const candidates = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium'];
  const pw = path.join(os.homedir(), '.cache/ms-playwright');
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()) {
      candidates.push(path.join(pw, d, 'chrome-linux64/chrome'));
    }
  }
  const found = candidates.find((c) => c && fs.existsSync(c));
  if (!found) throw new Error('Không tìm thấy Chrome. Đặt CHROME_PATH tới file chạy Chrome/Chromium.');
  return found;
}

function listPages(dir, rel = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!rel && SKIP_DIRS.has(e.name)) continue;
      out.push(...listPages(path.join(dir, e.name), rel + e.name + '/'));
    } else if (e.name.endsWith('.html') && e.name !== '404.html') {
      // trang chuyển hướng của `aliases` (URL cũ): chỉ có meta refresh, không có gì để kiểm tra
      const head = fs.readFileSync(path.join(dir, e.name), 'utf8').slice(0, 600);
      if (head.includes('http-equiv="refresh"')) continue;
      out.push(rel + e.name);
    }
  }
  return out.sort();
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.ts': 'text/plain' };

// Server tĩnh tối giản cho public/: thử nguyên đường dẫn, rồi thêm .html, rồi /index.html (giống GitHub Pages)
function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const base = path.join(ROOT, url);
    if (!base.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    for (const f of [base, base + '.html', path.join(base, 'index.html')]) {
      if (fs.existsSync(f) && fs.statSync(f).isFile()) {
        res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(res);
        return;
      }
    }
    res.writeHead(404).end();
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function checkPage(page, origin, file, width) {
  const problems = [];
  await page.goto(`${origin}/${file}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  // Chờ MERMAID_SCRIPT render xong: mỗi khung có <svg> (thành công) hoặc <pre> (lỗi cú pháp)
  const hasMermaid = await page.evaluate(() => document.querySelector('pre[data-language="mermaid"], .atlas-mermaid') !== null);
  if (hasMermaid) {
    try {
      await page.waitForFunction(() => {
        const boxes = [...document.querySelectorAll('.atlas-mermaid')];
        return boxes.length > 0 && boxes.every((b) => b.querySelector(':scope > svg, :scope > pre'));
      }, null, { timeout: 20000 });
    } catch {
      problems.push('Mermaid không render sau 20 giây (không tải được thư viện từ CDN?)');
    }
    const diagrams = await page.$$eval('.atlas-mermaid', (boxes) => boxes.map((b, i) => {
      const svg = b.querySelector(':scope > svg');
      if (!svg) return { i, broken: b.querySelector(':scope > pre') !== null };
      const vb = svg.viewBox.baseVal;
      const svgWidth = svg.getBoundingClientRect().width;
      const scale = vb && vb.width ? svgWidth / vb.width : 1;
      // vùng nội dung của khung = clientWidth trừ padding hai bên
      const cs = getComputedStyle(b);
      const inner = b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      // tiêu đề subgraph đè node: Mermaid không chừa chỗ cho tiêu đề bị tự xuống dòng hoặc sát nhãn cạnh
      const hit = (a, c) => a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1;
      const nodes = [...svg.querySelectorAll('g.node')].map((n) => n.getBoundingClientRect());
      const overlaps = [...svg.querySelectorAll('g.cluster-label')]
        .filter((l) => { const r = l.getBoundingClientRect(); return r.width > 0 && nodes.some((n) => hit(r, n)); })
        .map((l) => l.textContent.trim().replace(/\s+/g, ' ').slice(0, 40));
      return { i, scale, svgWidth: Math.round(svgWidth), inner: Math.round(inner),
        natural: vb && vb.width ? Math.round(vb.width) : 0, overlaps,
        unsupported: svg.textContent.includes('Unsupported markdown') };
    }));
    for (const d of diagrams) {
      if (d.broken) problems.push(`Mermaid #${d.i + 1}: lỗi cú pháp, đang hiện khối code thay cho sơ đồ`);
      if (d.unsupported) problems.push(`Mermaid #${d.i + 1}: có nhãn hiện "Unsupported markdown" (nhãn mở đầu bằng #, 1., - …)`);
      if (d.scale !== undefined && d.scale < MIN_SCALE - 0.005) problems.push(`Mermaid #${d.i + 1}: bị co còn ${(d.scale * 100).toFixed(0)}% (tối thiểu ${MIN_SCALE * 100}%)`);
      if (d.overlaps && d.overlaps.length) problems.push(`Mermaid #${d.i + 1}: tiêu đề subgraph đè lên node (${d.overlaps.map((t) => `"${t}"`).join(', ')}); rút tiêu đề về một dòng ngắn`);
      if (d.svgWidth !== undefined && d.svgWidth > d.inner + 1) problems.push(`Mermaid #${d.i + 1}: rộng ${d.svgWidth}px, hơn khung ${d.inner}px nên phải cuộn ngang (bề rộng thật ${d.natural}px; cần ≤ ${Math.floor(d.inner / MIN_SCALE)}px)`);
    }
  }
  const archify = await page.locator('iframe[data-archify]').count();
  for (let i = 0; i < archify; i++) {
    const frame = page.locator('iframe[data-archify]').nth(i);
    await frame.scrollIntoViewIfNeeded();
    try {
      // chờ viewer vẽ xong và ARCHIFY_SCRIPT đặt chiều cao theo nội dung
      await page.waitForFunction((el) => {
        const c = el.contentDocument && el.contentDocument.querySelector('.container');
        return c && el.contentDocument.querySelector('svg') && el.style.height !== '';
      }, await frame.elementHandle(), { timeout: 15000 });
    } catch {
      problems.push(`archify #${i + 1} (${await frame.getAttribute('data-archify')}): viewer không tải xong hoặc không được đặt chiều cao sau 15 giây`);
      continue;
    }
    const fit = await frame.evaluate((el) => ({ box: el.clientHeight, content: Math.ceil(el.contentDocument.querySelector('.container').getBoundingClientRect().height) }));
    if (fit.content > fit.box + 2) problems.push(`archify #${i + 1} (${await frame.getAttribute('data-archify')}): bị cắt, khung cao ${fit.box}px < nội dung ${fit.content}px`);
  }
  const overflow = await page.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    if (sw <= W) return null;
    // điểm bắt đầu tràn: phần tử vượt mép phải mà cha của nó thì không
    const culprits = [];
    for (const e of document.querySelectorAll('body *')) {
      const r = e.getBoundingClientRect();
      const p = e.parentElement && e.parentElement.getBoundingClientRect();
      // bỏ qua phần tử nằm trong khung tự cuộn (khối code, bảng, sơ đồ): chúng không làm trang cuộn
      let a = e.parentElement, inScroller = false;
      for (; a && a !== document.body; a = a.parentElement) if (getComputedStyle(a).overflowX !== 'visible') { inScroller = true; break; }
      if (!inScroller && r.width > 0 && r.right > W + 0.5 && p && p.right <= W + 0.5) {
        culprits.push(`${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''} "${(e.textContent || '').trim().slice(0, 40)}"`);
      }
    }
    return { sw, culprits: culprits.slice(0, 3) };
  });
  if (overflow) problems.push(`cuộn ngang: trang rộng ${overflow.sw}px > ${width}px; tràn từ: ${overflow.culprits.join(' | ') || '?'}`);
  return problems;
}

const allPages = listPages(ROOT);
if (allPages.length === 0) { console.error(`Không có trang nào trong ${ROOT}. Chạy npx quartz build trước.`); process.exit(1); }
let pages = allPages;
if (PAGES_FILE) {
  const wanted = fs.readFileSync(PAGES_FILE, 'utf8').split('\n').map((l) => l.trim()).filter(Boolean);
  if (!wanted.includes('ALL')) {
    const set = new Set(wanted);
    pages = allPages.filter((p) => set.has(p));
    console.log(`Chỉ kiểm ${pages.length}/${allPages.length} trang bị ảnh hưởng (${PAGES_FILE})`);
    if (pages.length === 0) { console.log('✓ Kiểm tra hiển thị: không có trang nào bị ảnh hưởng'); process.exit(0); }
  }
}
const server = await serve();
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: findChrome() });
const failures = [];
const t0 = Date.now();
for (const width of WIDTHS) {
  const queue = [...pages];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (let file; (file = queue.shift()); ) {
      try {
        for (const p of await checkPage(page, origin, file, width)) failures.push(`${width}px  ${file}: ${p}`);
      } catch (err) {
        failures.push(`${width}px  ${file}: không mở được trang (${err.message.split('\n')[0]})`);
      }
    }
    await page.close();
  }));
}
await browser.close();
server.close();

const secs = ((Date.now() - t0) / 1000).toFixed(0);
if (failures.length) {
  console.error(`✗ Kiểm tra hiển thị: ${failures.length} lỗi trên ${pages.length} trang × ${WIDTHS.length} bề rộng (${secs}s)`);
  for (const f of failures.sort()) console.error('  ' + f);
  process.exit(1);
}
console.log(`✓ Kiểm tra hiển thị: ${pages.length} trang × ${WIDTHS.join('/')}px, không cuộn ngang, Mermaid đọc được, archify không bị cắt (${secs}s)`);
