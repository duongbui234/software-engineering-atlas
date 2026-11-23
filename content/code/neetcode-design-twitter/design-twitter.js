// LeetCode 355: Design Twitter. Chạy: node design-twitter.js
// postTweet, follow, unfollow, và getNewsFeed: 10 tweet mới nhất của chính mình và người mình theo dõi.

// Max-heap theo phần tử đầu của mảng [time, …].
class MaxHeap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(x) {
    const a = this.a; a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] >= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]]; i = p;
    }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] > a[m][0]) m = l;
        if (r < a.length && a[r][0] > a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]]; i = m;
      }
    }
    return top;
  }
}

// Map và Set giữ key là số. Object thường đổi key thành chuỗi (xem bẫy ở cuối file).
class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();  // userId → [[time, tweetId], …], cũ trước mới sau
    this.follows = new Map(); // followerId → Set followeeId
  }
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }
  getNewsFeed(userId) {
    const heap = new MaxHeap();
    for (const u of [userId, ...(this.follows.get(userId) ?? [])]) {
      const lst = this.tweets.get(u);
      if (lst && lst.length) { const i = lst.length - 1; heap.push([lst[i][0], lst[i][1], u, i]); }
    }
    const feed = [];
    while (heap.size && feed.length < 10) {
      const [, id, u, i] = heap.pop();
      feed.push(id);
      if (i > 0) { const p = this.tweets.get(u)[i - 1]; heap.push([p[0], p[1], u, i - 1]); }
    }
    return feed;
  }
  follow(a, b) {
    if (a === b) return;
    if (!this.follows.has(a)) this.follows.set(a, new Set());
    this.follows.get(a).add(b);
  }
  unfollow(a, b) { this.follows.get(a)?.delete(b); }
}

// SAI: lưu danh sách theo dõi trong object thường. Key của object luôn là chuỗi, nên Object.keys trả "2",
// và tweets.get("2") không thấy tweet của người dùng số 2.
class ObjectFollowsTwitter extends Twitter {
  constructor() { super(); this.followObj = {}; }
  follow(a, b) { if (a !== b) (this.followObj[a] ??= {})[b] = true; }
  unfollow(a, b) { if (this.followObj[a]) delete this.followObj[a][b]; }
  getNewsFeed(userId) {
    this.follows = new Map([[userId, new Set(Object.keys(this.followObj[userId] ?? {}))]]);
    return super.getNewsFeed(userId);
  }
}

const cases = [
  ["ví dụ của đề", [["post", 1, 5], ["feed", 1, [5]], ["follow", 1, 2], ["post", 2, 6], ["feed", 1, [6, 5]], ["unfollow", 1, 2], ["feed", 1, [5]]]],
  ["chưa ai đăng gì", [["feed", 7, []]]],
  ["thấy tweet của chính mình", [["post", 1, 1], ["post", 1, 2], ["feed", 1, [2, 1]]]],
  ["xen kẽ hai người", [["follow", 1, 2], ["post", 1, 10], ["post", 2, 20], ["post", 1, 11], ["post", 2, 21], ["feed", 1, [21, 11, 20, 10]]]],
  ["hơn 10 tweet", [["follow", 1, 2], ...Array.from({ length: 12 }, (_, i) => ["post", 1 + (i % 2), 100 + i]), ["feed", 1, [111, 110, 109, 108, 107, 106, 105, 104, 103, 102]]]],
  ["tự follow rồi tự unfollow", [["post", 1, 5], ["follow", 1, 1], ["unfollow", 1, 1], ["feed", 1, [5]]]],
  ["unfollow người chưa theo dõi", [["post", 2, 9], ["unfollow", 1, 2], ["feed", 1, []]]],
  ["follow hai lần", [["follow", 1, 2], ["follow", 1, 2], ["post", 2, 3], ["feed", 1, [3]], ["unfollow", 1, 2], ["feed", 1, []]]],
  ["tweet đăng trước khi follow vẫn hiện", [["post", 2, 1], ["post", 2, 2], ["follow", 1, 2], ["feed", 1, [2, 1]]]],
];

function check(name, make) {
  const bad = [];
  for (const [label, ops] of cases) {
    const tw = make();
    let ok = true;
    const got = [];
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
  console.log(`${name.padEnd(20)} ${cases.length - bad.length}/${cases.length} ca đúng${bad.length ? "; sai ở: " + bad.join("; ") : ""}`);
}

check("Twitter", () => new Twitter());
check("ObjectFollowsTwitter", () => new ObjectFollowsTwitter());

console.log(`\nObject.keys({ 2: true }) = ${JSON.stringify(Object.keys({ 2: true }))}`);
console.log(`new Map([[2, "x"]]).get("2") = ${new Map([[2, "x"]]).get("2")}`);
