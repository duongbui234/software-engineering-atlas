// LeetCode 355: Design Twitter. Chạy: node design-twitter.ts
// postTweet, follow, unfollow, và getNewsFeed: 10 tweet mới nhất của chính mình và người mình theo dõi.

interface TwitterLike {
  postTweet(userId: number, tweetId: number): void;
  getNewsFeed(userId: number): number[];
  follow(followerId: number, followeeId: number): void;
  unfollow(followerId: number, followeeId: number): void;
}

// Max-heap nhỏ gọn theo khóa số: JS/TS không có heap sẵn.
class MaxHeap<T> {
  private a: T[] = [];
  private key: (x: T) => number;
  constructor(key: (x: T) => number) { this.key = key; }
  get size(): number { return this.a.length; }
  push(x: T): void {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) { // nổi lên
      const p = (i - 1) >> 1;
      if (this.key(a[p]) >= this.key(a[i])) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop(): T {
    const a = this.a, top = a[0], last = a.pop()!;
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) { // chìm xuống
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && this.key(a[l]) > this.key(a[m])) m = l;
        if (r < a.length && this.key(a[r]) > this.key(a[m])) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

// Cách 1, gom rồi sắp: lấy hết tweet của mình và người mình theo dõi, sắp theo thời gian giảm dần, cắt 10.
// O(T log T) mỗi lần đọc, với T là tổng số tweet của những người đó.
class SortAllTwitter implements TwitterLike {
  protected time = 0; // đồng hồ toàn cục: mỗi tweet một số, không bao giờ trùng
  protected tweets = new Map<number, [number, number][]>(); // userId → [[time, tweetId], …], cũ trước mới sau
  protected follows = new Map<number, Set<number>>(); // followerId → tập followeeId (không chứa chính mình)
  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push([this.time++, tweetId]);
  }
  protected sources(userId: number): number[] {
    return [userId, ...(this.follows.get(userId) ?? [])]; // luôn có chính mình
  }
  getNewsFeed(userId: number): number[] {
    const all: [number, number][] = [];
    for (const u of this.sources(userId)) all.push(...(this.tweets.get(u) ?? []));
    all.sort((x, y) => y[0] - x[0]);
    return all.slice(0, 10).map((t) => t[1]);
  }
  follow(followerId: number, followeeId: number): void {
    if (followerId === followeeId) return; // tự theo dõi mình: bỏ qua, mình vốn đã thấy tweet của mình
    if (!this.follows.has(followerId)) this.follows.set(followerId, new Set());
    this.follows.get(followerId)!.add(followeeId);
  }
  unfollow(followerId: number, followeeId: number): void {
    this.follows.get(followerId)?.delete(followeeId); // chưa theo dõi thì delete không làm gì
  }
}

// Cách 2, trộn k danh sách bằng heap: mỗi nguồn đóng góp tweet mới nhất của nó vào max-heap.
// Lấy đỉnh ra, đẩy tweet kế trước của cùng nguồn vào. O(F + 10 log F) mỗi lần đọc, F = số nguồn.
class HeapMergeTwitter extends SortAllTwitter {
  getNewsFeed(userId: number): number[] {
    // phần tử heap: [time, tweetId, userId, chỉ số trong danh sách của userId]
    const heap = new MaxHeap<[number, number, number, number]>((e) => e[0]);
    for (const u of this.sources(userId)) {
      const list = this.tweets.get(u);
      if (list && list.length) { const i = list.length - 1; heap.push([list[i][0], list[i][1], u, i]); }
    }
    const feed: number[] = [];
    while (heap.size && feed.length < 10) {
      const [, tweetId, u, i] = heap.pop();
      feed.push(tweetId);
      if (i > 0) { const prev = this.tweets.get(u)![i - 1]; heap.push([prev[0], prev[1], u, i - 1]); }
    }
    return feed;
  }
}

// SAI: chỉ đọc từ người mình theo dõi, quên chính mình.
class NoSelfTwitter extends SortAllTwitter {
  protected sources(userId: number): number[] { return [...(this.follows.get(userId) ?? [])]; }
}

// SAI: cho mỗi người tự theo dõi mình khi gặp lần đầu, rồi unfollow(u, u) xóa luôn chính mình.
class SelfInSetTwitter extends SortAllTwitter {
  private ensure(u: number): Set<number> {
    if (!this.follows.has(u)) this.follows.set(u, new Set([u]));
    return this.follows.get(u)!;
  }
  protected sources(userId: number): number[] { return [...this.ensure(userId)]; }
  follow(a: number, b: number): void { this.ensure(a).add(b); }
  unfollow(a: number, b: number): void { this.ensure(a).delete(b); }
}

// SAI: lấy giờ hệ thống (mili giây) làm thời gian. Các tweet đăng trong cùng 1 ms có cùng thời gian,
// và sort ổn định giữ thứ tự gom: hết tweet của người này rồi mới tới người kia.
class DateNowTwitter extends SortAllTwitter {
  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push([Date.now(), tweetId]);
  }
}

// SAI: quên cắt 10.
class NoLimitTwitter extends SortAllTwitter {
  getNewsFeed(userId: number): number[] {
    const all: [number, number][] = [];
    for (const u of this.sources(userId)) all.push(...(this.tweets.get(u) ?? []));
    return all.sort((x, y) => y[0] - x[0]).map((t) => t[1]);
  }
}

// Một lệnh: ["post", u, id] | ["follow", a, b] | ["unfollow", a, b] | ["feed", u, kỳ vọng]
type Op = ["post", number, number] | ["follow", number, number] | ["unfollow", number, number] | ["feed", number, number[]];
const cases: [string, Op[]][] = [
  ["ví dụ của đề", [["post", 1, 5], ["feed", 1, [5]], ["follow", 1, 2], ["post", 2, 6], ["feed", 1, [6, 5]], ["unfollow", 1, 2], ["feed", 1, [5]]]],
  ["chưa ai đăng gì", [["feed", 7, []]]],
  ["thấy tweet của chính mình", [["post", 1, 1], ["post", 1, 2], ["feed", 1, [2, 1]]]],
  ["xen kẽ hai người", [["follow", 1, 2], ["post", 1, 10], ["post", 2, 20], ["post", 1, 11], ["post", 2, 21], ["feed", 1, [21, 11, 20, 10]]]],
  ["hơn 10 tweet", [["follow", 1, 2], ...Array.from({ length: 12 }, (_, i): Op => ["post", 1 + (i % 2), 100 + i]), ["feed", 1, [111, 110, 109, 108, 107, 106, 105, 104, 103, 102]]]],
  ["tự follow rồi tự unfollow", [["post", 1, 5], ["follow", 1, 1], ["unfollow", 1, 1], ["feed", 1, [5]]]],
  ["unfollow người chưa theo dõi", [["post", 2, 9], ["unfollow", 1, 2], ["feed", 1, []]]],
  ["follow hai lần", [["follow", 1, 2], ["follow", 1, 2], ["post", 2, 3], ["feed", 1, [3]], ["unfollow", 1, 2], ["feed", 1, []]]],
  ["tweet đăng trước khi follow vẫn hiện", [["post", 2, 1], ["post", 2, 2], ["follow", 1, 2], ["feed", 1, [2, 1]]]],
];

function check(name: string, make: () => TwitterLike): void {
  const bad: string[] = [];
  for (const [label, ops] of cases) {
    const tw = make();
    let ok = true;
    const got: string[] = [];
    for (const op of ops) {
      if (op[0] === "post") tw.postTweet(op[1], op[2]);
      else if (op[0] === "follow") tw.follow(op[1], op[2]);
      else if (op[0] === "unfollow") tw.unfollow(op[1], op[2]);
      else {
        const f = tw.getNewsFeed(op[1]);
        got.push(`[${f.join(",")}]`);
        if (f.join(",") !== op[2].join(",")) ok = false;
      }
    }
    if (!ok) bad.push(`${label} → ${got.join(" ")}`);
  }
  console.log(`${name.padEnd(17)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}

check("SortAllTwitter", () => new SortAllTwitter());
check("HeapMergeTwitter", () => new HeapMergeTwitter());
check("NoSelfTwitter", () => new NoSelfTwitter());
check("SelfInSetTwitter", () => new SelfInSetTwitter());
check("DateNowTwitter", () => new DateNowTwitter());
check("NoLimitTwitter", () => new NoLimitTwitter());

// Đối chiếu ngẫu nhiên: 2 000 chuỗi lệnh, so heap với gom rồi sắp.
// Bộ sinh ngẫu nhiên mulberry32: trạng thái 32 bit, mọi phép nhân qua Math.imul.
function mulberry32(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(355);
const ri = (n: number) => Math.floor(rand() * n);
let mismatch = 0, nextId = 0;
for (let r = 0; r < 2000; r++) {
  const a = new SortAllTwitter(), b = new HeapMergeTwitter();
  for (let s = 0; s < 60; s++) {
    const kind = ri(4), u = ri(6), v = ri(6);
    if (kind === 0) { a.postTweet(u, nextId); b.postTweet(u, nextId); nextId++; }
    else if (kind === 1) { a.follow(u, v); b.follow(u, v); }
    else if (kind === 2) { a.unfollow(u, v); b.unfollow(u, v); }
    else if (a.getNewsFeed(u).join() !== b.getNewsFeed(u).join()) mismatch++;
  }
}
console.log(`\nĐối chiếu 2 000 chuỗi lệnh ngẫu nhiên (6 người, 60 lệnh mỗi chuỗi): ${mismatch} lần heap khác gom rồi sắp`);

// Đo 1: một người theo dõi F người, mỗi người có P tweet. 1 000 lần đọc feed.
const median = (xs: number[]) => xs.sort((x, y) => x - y)[xs.length >> 1];
function time(fn: () => void): number { const t0 = performance.now(); fn(); return performance.now() - t0; }
function build(T: SortAllTwitter, F: number, P: number): void {
  for (let f = 1; f <= F; f++) T.follow(0, f);
  for (let p = 0; p < P; p++) for (let f = 1; f <= F; f++) T.postTweet(f, p * F + f); // đăng xen kẽ
}
console.log("\nF nguồn   P tweet/nguồn   T tổng    gom rồi sắp   trộn bằng heap   (ms cho 1 000 lần đọc feed, trung vị 5 lần)");
for (const [F, P] of [[10, 100], [100, 100], [500, 100], [500, 1000]]) {
  const s = new SortAllTwitter(), h = new HeapMergeTwitter();
  build(s, F, P); build(h, F, P);
  // gom rồi sắp ở T = 500 000 mất cỡ nửa phút cho 1 000 lần đọc: bỏ qua, chỉ đo heap
  const ts = F * P > 100_000 ? NaN : median(Array.from({ length: 5 }, () => time(() => { for (let i = 0; i < 1000; i++) s.getNewsFeed(0); })));
  const th = median(Array.from({ length: 5 }, () => time(() => { for (let i = 0; i < 1000; i++) h.getNewsFeed(0); })));
  console.log(`${String(F).padEnd(9)} ${String(P).padEnd(15)} ${String(F * P).padEnd(9)} ${(isNaN(ts) ? "—" : ts.toFixed(1)).padStart(11)} ${th.toFixed(2).padStart(16)}`);
}

// Đo 2, đẩy lúc ghi (fan-out on write): mỗi tweet được chép vào feed của từng người theo dõi.
// Đọc là O(10), nhưng một lần đăng tốn tỉ lệ với số người theo dõi.
class FanoutTwitter {
  private followers = new Map<number, number[]>();
  private feeds = new Map<number, number[]>();
  addFollower(star: number, fan: number): void {
    if (!this.followers.has(star)) this.followers.set(star, []);
    this.followers.get(star)!.push(fan);
  }
  postTweet(userId: number, tweetId: number): void {
    for (const u of [userId, ...(this.followers.get(userId) ?? [])]) {
      if (!this.feeds.has(u)) this.feeds.set(u, []);
      this.feeds.get(u)!.push(tweetId);
    }
  }
  getNewsFeed(userId: number): number[] { return (this.feeds.get(userId) ?? []).slice(-10).reverse(); }
}
console.log("\nngười theo dõi   1 lần đăng, đẩy lúc ghi   1 lần đăng, đọc lúc cần   (ms, trung vị 5 lần)");
for (const N of [100, 10_000, 1_000_000]) {
  const fan = new FanoutTwitter();
  for (let i = 1; i <= N; i++) fan.addFollower(0, i);
  const tw = median(Array.from({ length: 5 }, (_, k) => time(() => fan.postTweet(0, k))));
  const pull = new HeapMergeTwitter();
  const tr = median(Array.from({ length: 5 }, (_, k) => time(() => pull.postTweet(0, k))));
  console.log(`${String(N).padEnd(16)} ${tw.toFixed(3).padStart(22)} ${tr.toFixed(4).padStart(24)}`);
}
