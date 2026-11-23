// Ga SRCH-02, tìm kiếm nhị phân trên đáp án: lời giải của 875, 981 và 4.
// Chạy: node answer-search-station.ts

// 875: tốc độ nhỏ nhất ăn hết trong h giờ. "Tốc độ k có kịp không?" sai rồi đúng đúng một lần khi k tăng.
function minEatingSpeed(piles: number[], h: number): number {
  const hours = (k: number) => piles.reduce((s, p) => s + Math.floor((p + k - 1) / k), 0);
  let lo = 1, hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (hours(mid) <= h) hi = mid; // kịp: giữ mid, có thể là đáp án
    else lo = mid + 1;
  }
  return lo;
}

// 981: mỗi khóa giữ các mốc thời gian tăng dần. get tìm mốc cuối cùng <= t = (mốc đầu tiên > t) − 1.
class TimeMap {
  private store = new Map<string, { ts: number[]; vals: string[] }>();
  set(key: string, value: string, timestamp: number): void {
    let e = this.store.get(key);
    if (!e) this.store.set(key, (e = { ts: [], vals: [] }));
    e.ts.push(timestamp); // đề hứa timestamp tăng dần, nên push giữ mảng đã sắp
    e.vals.push(value);
  }
  get(key: string, timestamp: number): string {
    const e = this.store.get(key);
    if (!e) return "";
    let lo = 0, hi = e.ts.length; // tìm mốc đầu tiên > timestamp trên [lo, hi)
    while (lo < hi) {
      const mid = (lo + hi) >>> 1;
      if (e.ts[mid] <= timestamp) lo = mid + 1;
      else hi = mid;
    }
    return lo === 0 ? "" : e.vals[lo - 1];
  }
}

// 4: chia đôi trên vị trí cắt i của mảng ngắn hơn. Cắt đúng khi mọi phần tử bên trái <= mọi phần tử bên phải.
function findMedianSortedArrays(a: number[], b: number[]): number {
  if (a.length > b.length) [a, b] = [b, a];
  const m = a.length, n = b.length, half = (m + n + 1) >> 1;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1, j = half - i; // i phần tử của a và j phần tử của b nằm bên trái
    const aL = i > 0 ? a[i - 1] : -Infinity, aR = i < m ? a[i] : Infinity;
    const bL = j > 0 ? b[j - 1] : -Infinity, bR = j < n ? b[j] : Infinity;
    if (aL <= bR && bL <= aR) {
      return (m + n) % 2 ? Math.max(aL, bL) : (Math.max(aL, bL) + Math.min(aR, bR)) / 2;
    }
    if (aL > bR) hi = i - 1; // lấy quá nhiều từ a
    else lo = i + 1; // lấy quá ít từ a
  }
  throw new Error("mảng đầu vào chưa sắp");
}

let ok = 0, total = 0;
const check = (got: unknown, want: unknown, label: string) => {
  total++;
  if (got === want) ok++;
  else console.log(`sai: ${label} → ${got}, cần ${want}`);
};
check(minEatingSpeed([3, 6, 7, 11], 8), 4, "875 [3,6,7,11] h=8");
check(minEatingSpeed([30, 11, 23, 4, 20], 5), 30, "875 h=5");
check(minEatingSpeed([30, 11, 23, 4, 20], 6), 23, "875 h=6");
check(minEatingSpeed([1000000000], 2), 500000000, "875 [10⁹] h=2");
const tm = new TimeMap();
tm.set("foo", "bar", 1);
check(tm.get("foo", 1), "bar", "981 get(foo, 1)");
check(tm.get("foo", 3), "bar", "981 get(foo, 3)");
tm.set("foo", "bar2", 4);
check(tm.get("foo", 4), "bar2", "981 get(foo, 4)");
check(tm.get("foo", 0), "", "981 get(foo, 0) trước mốc đầu");
check(tm.get("baz", 5), "", "981 khóa chưa có");
check(findMedianSortedArrays([1, 3], [2]), 2, "4 [1,3] [2]");
check(findMedianSortedArrays([1, 2], [3, 4]), 2.5, "4 [1,2] [3,4]");
check(findMedianSortedArrays([], [1]), 1, "4 [] [1]");
check(findMedianSortedArrays([0, 0], [0, 0]), 0, "4 toàn 0");
check(findMedianSortedArrays([1, 2, 3, 4, 5], [6, 7, 8]), 4.5, "4 tách rời");
console.log(`answer-search-station ${ok}/${total} ca đúng`);
