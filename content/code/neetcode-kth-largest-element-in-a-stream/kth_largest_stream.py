# LeetCode 703, Kth Largest Element in a Stream: heapq (min-heap), bản đảo dấu sai, và heapify so với n lần push.
# Chạy: python3 kth_largest_stream.py
import heapq
import random
import time


class KthLargest:
    # heapq chỉ có min-heap: phần tử nhỏ nhất ở self.h[0]. Giữ k số lớn nhất, đỉnh là số lớn thứ k.
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.h = nums[:]
        heapq.heapify(self.h)  # O(n)
        while len(self.h) > k:
            heapq.heappop(self.h)

    def add(self, val: int) -> int:
        if len(self.h) < self.k:
            heapq.heappush(self.h, val)
        elif val > self.h[0]:
            heapq.heapreplace(self.h, val)  # pop rồi push trong một lần chìm
        return self.h[0]


class NegatedKthLargest:
    # SAI: thói quen "heapq là min-heap nên đảo dấu để có max-heap" áp vào chỗ cần min-heap.
    # Heap giữ k số NHỎ nhất, đỉnh (-h[0]) là số lớn nhất trong k số đó.
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.h = []
        for x in nums:
            self.add(x)

    def add(self, val: int) -> int:
        heapq.heappush(self.h, -val)
        if len(self.h) > self.k:
            heapq.heappop(self.h)
        return -self.h[0]


cases = [
    ("ví dụ của đề", 3, [4, 5, 8, 2], [3, 5, 10, 9, 4], [4, 5, 5, 8, 8]),
    ("nhiều số 7 trùng", 4, [7, 7, 7, 7, 8, 3], [2, 10, 9, 9], [7, 7, 7, 8]),
    ("nums rỗng, k = 1", 1, [], [-3, -2, -4, 0, 4], [-3, -2, -2, 0, 4]),
    ("nums thiếu một số", 2, [0], [-1, 1, -2, -4, 3], [-1, 0, 0, 0, 1]),
    ("số trùng", 2, [5, 5], [5, 1, 6], [5, 5, 5]),
    ("k bằng cả luồng", 3, [1, 2], [3, 0], [1, 1]),
    ("số âm", 2, [-10, -20], [-5, -30, -1], [-10, -10, -5]),
]
rnd = random.Random(7)
nums = [rnd.randint(-10_000, 10_000) for _ in range(200)]
adds = [rnd.randint(-10_000, 10_000) for _ in range(500)]
seen, want = nums[:], []
for v in adds:
    seen.append(v)
    want.append(sorted(seen)[-50])
cases.append(("ngẫu nhiên 200 + 500 số, k = 50", 50, nums, adds, want))

for cls in (KthLargest, NegatedKthLargest):
    bad = []
    for name, k, nums, adds, want in cases:
        s = cls(k, nums)
        got = [s.add(v) for v in adds]
        if got != want:
            bad.append(f"{name} → {got}" if len(adds) <= 5 else name)
    print(f"{cls.__name__:18} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở: " + "; ".join(bad) if bad else ""))

# Đo: dựng heap 10⁶ số bằng heapify so với 10⁶ lần heappush (trung vị 5 lần).
xs = [rnd.randrange(10**9) for _ in range(10**6)]


def med(fn):
    ts = []
    for _ in range(5):
        t = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t) * 1000)
    return sorted(ts)[2]


def by_push():
    h = []
    for x in xs:
        heapq.heappush(h, x)


print(f"\nn = 10⁶: heapify {med(lambda: heapq.heapify(xs[:])):.1f} ms, 10⁶ lần heappush {med(by_push):.1f} ms")
print("nlargest(3, [4, 5, 8, 2]) =", heapq.nlargest(3, [4, 5, 8, 2]))
