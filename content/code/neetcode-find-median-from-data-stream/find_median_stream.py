# LC 295 Find Median from Data Stream: hai heap bằng heapq (đảo dấu cho nửa nhỏ), chèn bằng bisect, và một bản sai.
# Chạy: python3 find_median_stream.py
import bisect
import heapq
import random
import time


class MedianFinder:
    # lower: max-heap viết bằng heapq trên số âm; upper: min-heap. len(lower) = len(upper) hoặc thêm 1.
    def __init__(self):
        self.lower = []
        self.upper = []

    def addNum(self, x):
        heapq.heappush(self.lower, -x)
        heapq.heappush(self.upper, -heapq.heappop(self.lower))  # số lớn nhất nửa nhỏ sang nửa lớn
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self):
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        return (-self.lower[0] + self.upper[0]) / 2


class InsortFinder:
    # Một list đã sắp; bisect.insort tìm chỗ O(log n) nhưng chèn phải dời phần sau, O(n).
    def __init__(self):
        self.a = []

    def addNum(self, x):
        bisect.insort(self.a, x)

    def findMedian(self):
        a, n = self.a, len(self.a)
        return a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2


class NoNegateFinder(MedianFinder):
    # SAI: quên đảo dấu, lower thành min-heap; "đỉnh nửa nhỏ" là số nhỏ nhất chứ không phải lớn nhất.
    def addNum(self, x):
        heapq.heappush(self.lower, x)
        heapq.heappush(self.upper, heapq.heappop(self.lower))
        if len(self.upper) > len(self.lower):
            heapq.heappush(self.lower, heapq.heappop(self.upper))

    def findMedian(self):
        if len(self.lower) > len(self.upper):
            return self.lower[0]
        return (self.lower[0] + self.upper[0]) / 2


def median_of(xs):
    a = sorted(xs)
    n = len(a)
    return a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2


cases = [
    ("ví dụ của đề", [1, 2, 3]),
    ("một số", [5]),
    ("giảm dần", [5, 4, 3, 2, 1]),
    ("tăng dần", [1, 2, 3, 4, 5, 6]),
    ("trùng nhau", [7, 7, 7, 7]),
    ("số âm", [-1, -2, -3, -4, -5]),
    ("xen kẽ", [6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0]),
    ("biên đề", [-100000, 100000, -100000, 100000]),
]


def run(cls, xs):
    f, out = cls(), []
    for x in xs:
        f.addNum(x)
        out.append(f.findMedian())
    return out


for cls in (MedianFinder, InsortFinder, NoNegateFinder):
    bad = [f"{label} → {run(cls, xs)}" for label, xs in cases
           if run(cls, xs) != [median_of(xs[: i + 1]) for i in range(len(xs))]]
    tail = "; sai ở: " + "; ".join(bad) if bad else ""
    print(f"{cls.__name__:15} {len(cases) - len(bad)}/{len(cases)} ca đúng{tail}")

# / luôn trả float và giữ phần .5; // làm tròn xuống (về phía âm vô cùng), sai cho trung vị
print("(2 + 3) / 2 =", (2 + 3) / 2, " (2 + 3) // 2 =", (2 + 3) // 2, " (-2 + -3) // 2 =", (-2 + -3) // 2)


def bench(cls, xs):
    ts = []
    for _ in range(3):
        t0 = time.perf_counter()
        f = cls()
        for x in xs:
            f.addNum(x)
            f.findMedian()
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[1]


print("\nn          bisect.insort   hai heap   (ms, trung vị 3 lần)")
rnd = random.Random(295)
for n in (10_000, 100_000, 300_000, 1_000_000):
    xs = [rnd.randint(-100_000, 100_000) for _ in range(n)]
    ins = f"{bench(InsortFinder, xs):13.1f}" if n <= 300_000 else f"{'—':>13}"  # 10⁶ chèn: quá lâu, không chạy
    print(f"{n:<10} {ins} {bench(MedianFinder, xs):10.1f}")
