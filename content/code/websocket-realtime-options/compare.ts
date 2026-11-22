// So bốn cách để trình duyệt biết "tồn kho vừa đổi":
// polling, long polling, Server-Sent Events và WebSocket.
// Server phát 5 sự kiện ở các thời điểm cố định trong 6 giây;
// mỗi client đếm số request HTTP đã gửi và độ trễ trung bình.
// Chạy: npm i ws && node compare.ts
import http from 'node:http';
import { WebSocketServer } from 'ws';

const EVENTS_AT = [700, 1300, 2900, 3100, 5200]; // ms kể từ lúc bắt đầu
const RUN_MS = 6000;
const POLL_EVERY = 2000;     // polling: hỏi mỗi 2 giây
const LONG_POLL_HOLD = 4000; // long polling: giữ request tối đa 4 giây

const t0 = Date.now();
const now = () => Date.now() - t0;
type Ev = { id: number; at: number };
const log: Ev[] = [];                      // mọi sự kiện đã xảy ra
const waiting = new Set<(e: Ev) => void>(); // long poll đang chờ
const sseClients = new Set<http.ServerResponse>();

const server = http.createServer((req, res) => {
  const url = new URL(req.url!, 'http://x');
  const after = Number(url.searchParams.get('after') ?? -1);
  if (url.pathname === '/poll') {
    // polling: trả ngay những gì mới hơn `after` (thường là rỗng)
    res.end(JSON.stringify(log.filter((e) => e.id > after)));
  } else if (url.pathname === '/long-poll') {
    const fresh = log.filter((e) => e.id > after);
    if (fresh.length) return res.end(JSON.stringify(fresh));
    // chưa có gì: giữ request lại tới khi có sự kiện hoặc hết giờ
    const done = (e: Ev) => { clearTimeout(timer); waiting.delete(done); res.end(JSON.stringify([e])); };
    const timer = setTimeout(() => { waiting.delete(done); res.end('[]'); }, LONG_POLL_HOLD);
    waiting.add(done);
  } else if (url.pathname === '/sse') {
    // SSE: một response không bao giờ kết thúc, mỗi sự kiện là vài dòng text
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' });
    sseClients.add(res);
  }
});
const wss = new WebSocketServer({ server });

function publish(id: number) {
  const e = { id, at: now() };
  log.push(e);
  for (const done of [...waiting]) done(e);
  for (const res of sseClients) res.write(`id: ${id}\ndata: ${JSON.stringify(e)}\n\n`);
  for (const ws of wss.clients) ws.send(JSON.stringify(e));
}

type Stat = { requests: number; delays: number[] };
const stat = (): Stat => ({ requests: 0, delays: [] });
const got = (s: Stat, e: Ev) => s.delays.push(now() - e.at);

async function polling(base: string, s: Stat) {
  let last = -1;
  while (now() < RUN_MS) {
    s.requests++;
    const evs: Ev[] = await (await fetch(`${base}/poll?after=${last}`)).json();
    for (const e of evs) { got(s, e); last = e.id; }
    await new Promise((r) => setTimeout(r, POLL_EVERY));
  }
}

async function longPolling(base: string, s: Stat) {
  let last = -1;
  while (now() < RUN_MS) {
    s.requests++;
    const evs: Ev[] = await (await fetch(`${base}/long-poll?after=${last}`)).json();
    for (const e of evs) { got(s, e); last = e.id; }
  }
}

async function sse(base: string, s: Stat, ctrl: AbortController) {
  s.requests++;
  const res = await fetch(`${base}/sse`, { signal: ctrl.signal });
  const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
  try {
    for (;;) {
      const { value } = await reader.read();
      for (const line of value!.split('\n')) if (line.startsWith('data: ')) got(s, JSON.parse(line.slice(6)));
    }
  } catch { /* bị abort lúc kết thúc */ }
}

function websocket(port: number, s: Stat) {
  s.requests++; // đúng một request HTTP: request Upgrade lúc mở kết nối
  const ws = new WebSocket(`ws://localhost:${port}`); // client WebSocket có sẵn trong Node 22+
  ws.onmessage = (m) => got(s, JSON.parse(m.data as string));
  return ws;
}

server.listen(0, async () => {
  const port = (server.address() as { port: number }).port;
  const base = `http://localhost:${port}`;
  const stats = { polling: stat(), 'long polling': stat(), SSE: stat(), WebSocket: stat() };
  const ctrl = new AbortController();
  const ws = websocket(port, stats.WebSocket);
  await new Promise((r) => (ws.onopen = r));
  EVENTS_AT.forEach((at, i) => setTimeout(() => publish(i), at - now()));
  void sse(base, stats.SSE, ctrl);
  await Promise.all([polling(base, stats.polling), longPolling(base, stats['long polling'])]);
  ctrl.abort(); ws.close();
  console.log(`${EVENTS_AT.length} sự kiện trong ${RUN_MS / 1000} giây\n`);
  console.log('cách            request HTTP   nhận được   trễ trung bình   trễ lớn nhất');
  for (const [name, s] of Object.entries(stats)) {
    const avg = s.delays.reduce((a, b) => a + b, 0) / s.delays.length;
    console.log(
      `${name.padEnd(16)}${String(s.requests).padStart(8)}${String(s.delays.length).padStart(12)}` +
      `${(avg.toFixed(0) + ' ms').padStart(17)}${(Math.max(...s.delays) + ' ms').padStart(15)}`,
    );
  }
  server.closeAllConnections(); server.close(); wss.close();
});
