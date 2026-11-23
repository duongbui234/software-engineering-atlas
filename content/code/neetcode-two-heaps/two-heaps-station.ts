// Ga SRCH-04, hai heap và lập lịch: giải 621, 355 và 295 bằng một heap viết tay.
// Chạy: node two-heaps-station.ts

// Min-heap theo khóa: cha ở i, hai con ở 2i + 1 và 2i + 2. Muốn max-heap thì trả khóa âm.
class Heap<T> {
  a: T[] = [];
  key: (x: T) => number;
  constructor(key: (x: T) => number) { this.key = key; }
  get size(): number { return this.a.length; }
  peek(): T { return this.a[0]; }
  push(x: T): void {
    const a = this.a, key = this.key;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên
      const p = (i - 1) >> 1;
      if (key(a[p]) <= key(a[i])) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop(): T {
    const a = this.a, key = this.key, top = a[0], last = a.pop()!;
    if (a.length > 0) {
      a[0] = last;
      let i = 0; // chìm xuống
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && key(a[l]) < key(a[m])) m = l;
        if (r < a.length && key(a[r]) < key(a[m])) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

// 621: mỗi đơn vị thời gian chạy việc còn nhiều lần nhất (max-heap theo số lần còn lại);
// việc vừa chạy vào hàng chờ, quay lại heap khi hết n đơn vị nghỉ.
function leastInterval(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const t of tasks) count.set(t, (count.get(t) ?? 0) + 1);
  const ready = new Heap<number>((c) => -c);
  for (const c of count.values()) ready.push(c);
  const cooling: [number, number][] = []; // [số lần còn lại, thời điểm được chạy lại], theo thứ tự thời gian
  let time = 0;
  while (ready.size > 0 || cooling.length > 0) {
    time++;
    if (ready.size > 0) {
      const left = ready.pop() - 1;
      if (left > 0) cooling.push([left, time + n]);
    } // heap rỗng: CPU nghỉ đơn vị này
    if (cooling.length > 0 && cooling[0][1] === time) ready.push(cooling.shift()![0]);
  }
  return time;
}

// 355: mỗi người giữ danh sách tweet theo thời gian; bảng tin là trộn k danh sách đã sắp (k-way merge)
// bằng max-heap theo thời điểm, mỗi danh sách chỉ có phần tử mới nhất chưa lấy nằm trong heap.
class Twitter {
  clock = 0;
  tweets = new Map<number, [number, number][]>(); // userId → [[thời điểm, tweetId], …] tăng dần theo thời điểm
  follows = new Map<number, Set<number>>();
  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push([this.clock++, tweetId]);
  }
  getNewsFeed(userId: number): number[] {
    const heap = new Heap<[number, number, number]>((e) => -e[0]); // [thời điểm, người, chỉ số trong danh sách]
    for (const u of new Set([userId, ...(this.follows.get(userId) ?? [])])) {
      const list = this.tweets.get(u);
      if (list && list.length > 0) heap.push([list[list.length - 1][0], u, list.length - 1]);
    }
    const feed: number[] = [];
    while (heap.size > 0 && feed.length < 10) {
      const [, u, i] = heap.pop();
      const list = this.tweets.get(u)!;
      feed.push(list[i][1]);
      if (i > 0) heap.push([list[i - 1][0], u, i - 1]); // tweet cũ hơn kế tiếp của cùng người
    }
    return feed;
  }
  follow(a: number, b: number): void {
    if (!this.follows.has(a)) this.follows.set(a, new Set());
    this.follows.get(a)!.add(b);
  }
  unfollow(a: number, b: number): void { this.follows.get(a)?.delete(b); }
}

// 295: hai heap. lower (max-heap) giữ nửa nhỏ, upper (min-heap) giữ nửa lớn.
class MedianFinder {
  lower = new Heap<number>((x) => -x);
  upper = new Heap<number>((x) => x);
  addNum(x: number): void {
    this.lower.push(x);
    this.upper.push(this.lower.pop()); // số lớn nhất nửa nhỏ sang nửa lớn
    if (this.upper.size > this.lower.size) this.lower.push(this.upper.pop());
  }
  findMedian(): number {
    return this.lower.size > this.upper.size ? this.lower.peek() : (this.lower.peek() + this.upper.peek()) / 2;
  }
}

// Các ca thử: mỗi ca trả [chuỗi kết quả, chuỗi mong đợi].
const checks: [string, () => [string, string]][] = [
  ["621 ví dụ 1", () => [String(leastInterval([..."AAABBB"], 2)), "8"]],
  ["621 ví dụ 2", () => [String(leastInterval([..."ACABDB"], 1)), "6"]],
  ["621 ví dụ 3", () => [String(leastInterval([..."AAABBB"], 3)), "10"]],
  ["621 nhiều loại việc", () => [String(leastInterval([..."AAAAAABCDEFG"], 2)), "16"]],
  ["621 n = 0", () => [String(leastInterval([..."AAB"], 0)), "3"]],
  ["355 ví dụ của đề", () => {
    const t = new Twitter(), out: number[][] = [];
    t.postTweet(1, 5); out.push(t.getNewsFeed(1));
    t.follow(1, 2); t.postTweet(2, 6); out.push(t.getNewsFeed(1));
    t.unfollow(1, 2); out.push(t.getNewsFeed(1));
    return [JSON.stringify(out), "[[5],[6,5],[5]]"];
  }],
  ["355 chỉ 10 tweet mới nhất", () => {
    const t = new Twitter();
    for (let i = 1; i <= 11; i++) t.postTweet(1, i);
    return [JSON.stringify(t.getNewsFeed(1)), "[11,10,9,8,7,6,5,4,3,2]"];
  }],
  ["355 tự theo dõi mình", () => {
    const t = new Twitter();
    t.postTweet(1, 7); t.follow(1, 1);
    return [JSON.stringify(t.getNewsFeed(1)), "[7]"];
  }],
  ["355 xen kẽ ba người", () => {
    const t = new Twitter();
    t.postTweet(1, 1); t.postTweet(2, 2); t.postTweet(3, 3); t.postTweet(1, 4);
    t.follow(1, 2); t.follow(1, 3);
    return [JSON.stringify(t.getNewsFeed(1)), "[4,3,2,1]"];
  }],
  ["295 ví dụ của đề", () => {
    const m = new MedianFinder();
    m.addNum(1); m.addNum(2); const a = m.findMedian(); m.addNum(3);
    return [`${a},${m.findMedian()}`, "1.5,2"];
  }],
  ["295 giảm dần", () => {
    const m = new MedianFinder(), out: number[] = [];
    for (const x of [5, 4, 3, 2, 1]) { m.addNum(x); out.push(m.findMedian()); }
    return [out.join(), "5,4.5,4,3.5,3"];
  }],
  ["295 số âm", () => {
    const m = new MedianFinder(), out: number[] = [];
    for (const x of [-1, -2, -3, -4]) { m.addNum(x); out.push(m.findMedian()); }
    return [out.join(), "-1,-1.5,-2,-2.5"];
  }],
  ["295 trùng nhau", () => {
    const m = new MedianFinder();
    for (const x of [7, 7, 7, 7]) m.addNum(x);
    return [String(m.findMedian()), "7"];
  }],
  ["295 xen kẽ", () => {
    const m = new MedianFinder(), out: number[] = [];
    for (const x of [6, 10, 2, 6, 5, 0]) { m.addNum(x); out.push(m.findMedian()); }
    return [out.join(), "6,8,6,6,6,5.5"];
  }],
];

const bad = checks.filter(([, f]) => { const [got, want] = f(); return got !== want; }).map(([label, f]) => `${label} → ${f()[0]}`);
console.log(`two-heaps-station ${checks.length - bad.length}/${checks.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);

// 621 không cần mô phỏng: chỉ việc nhiều lần nhất (maxCount lần, numMax việc như vậy) quyết định khung.
function leastIntervalFormula(tasks: string[], n: number): number {
  const count = new Map<string, number>();
  for (const t of tasks) count.set(t, (count.get(t) ?? 0) + 1);
  const maxCount = Math.max(...count.values());
  let numMax = 0;
  for (const c of count.values()) if (c === maxCount) numMax++;
  return Math.max(tasks.length, (maxCount - 1) * (n + 1) + numMax);
}

// 355 cách thẳng: gom mọi tweet của những người được theo dõi, sắp theo thời điểm, lấy 10.
function feedGatherSort(t: Twitter, userId: number): number[] {
  const all: [number, number][] = [];
  for (const u of new Set([userId, ...(t.follows.get(userId) ?? [])])) all.push(...(t.tweets.get(u) ?? []));
  all.sort((p, q) => q[0] - p[0]);
  return all.slice(0, 10).map((e) => e[1]);
}

// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, phép nhân qua Math.imul.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function median5(f: () => void): number {
  const ts: number[] = [];
  for (let r = 0; r < 5; r++) { const t0 = performance.now(); f(); ts.push(performance.now() - t0); }
  return ts.sort((p, q) => p - q)[2];
}

{
  const rnd = mulberry32(621);
  const tasks = Array.from({ length: 10_000 }, () => String.fromCharCode(65 + Math.floor(rnd() * 26)));
  for (const n of [0, 2, 100]) {
    const a = leastInterval(tasks, n), b = leastIntervalFormula(tasks, n);
    console.log(`621, 10⁴ việc, 26 loại, n = ${String(n).padEnd(3)}: mô phỏng ${a} (${median5(() => leastInterval(tasks, n)).toFixed(2)} ms), công thức ${b} (${median5(() => leastIntervalFormula(tasks, n)).toFixed(2)} ms)`);
  }
}
{
  const rnd = mulberry32(355);
  for (const [k, m] of [[100, 100], [1000, 100], [1000, 1000]]) {
    const t = new Twitter();
    for (let i = 0; i < k * m; i++) t.postTweet(1 + Math.floor(rnd() * k), i);
    for (let u = 2; u <= k; u++) t.follow(1, u);
    const same = t.getNewsFeed(1).join() === feedGatherSort(t, 1).join();
    console.log(`355, ${k} người × ~${m} tweet: trộn k đường ${median5(() => t.getNewsFeed(1)).toFixed(2)} ms, gom rồi sắp ${median5(() => feedGatherSort(t, 1)).toFixed(2)} ms, cùng kết quả: ${same}`);
  }
}
