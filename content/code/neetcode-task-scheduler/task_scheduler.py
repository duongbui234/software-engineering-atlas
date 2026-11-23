# LeetCode 621, Task Scheduler: mô phỏng bằng heapq + deque, công thức khung, một bản sai và phép đo.
# Chạy: python3 task_scheduler.py
import heapq
import random
import time
from collections import Counter, deque


# heapq chỉ có min-heap: lưu -c để việc còn nhiều nhất nằm ở đỉnh.
# deque giữ (số lần còn lại, nhịp được chạy lại) của các việc đang nguội.
def least_interval_heap(tasks, n):
    heap = [-c for c in Counter(tasks).values()]
    heapq.heapify(heap)
    cooling = deque()
    t = 0
    while heap or cooling:
        t += 1
        if heap:
            c = heapq.heappop(heap) + 1  # bớt một lần (số âm nên cộng 1)
            if c < 0:
                cooling.append((c, t + n))
        if cooling and cooling[0][1] == t:
            heapq.heappush(heap, cooling.popleft()[0])
    return t


# Công thức khung: (f - 1) khung dài n + 1, cộng k việc cùng đạt f; không ít hơn số việc.
def least_interval_formula(tasks, n):
    cnt = Counter(tasks)
    f = max(cnt.values())
    k = sum(1 for c in cnt.values() if c == f)
    return max(len(tasks), (f - 1) * (n + 1) + k)


# SAI: quên đổi dấu, heapq trả việc còn ÍT nhất trước.
def forgot_negate(tasks, n):
    heap = list(Counter(tasks).values())
    heapq.heapify(heap)
    cooling = deque()
    t = 0
    while heap or cooling:
        t += 1
        if heap:
            c = heapq.heappop(heap) - 1
            if c > 0:
                cooling.append((c, t + n))
        if cooling and cooling[0][1] == t:
            heapq.heappush(heap, cooling.popleft()[0])
    return t


CASES = [
    ("AAABBB", 2, 8), ("ACABDB", 1, 6), ("AAABBB", 3, 10), ("AAABBB", 0, 6), ("A", 100, 1),
    ("AAAAAABCDEFG", 2, 16), ("ABBB", 1, 5), ("AABBCCDD", 1, 8), ("AAABBBCCCDDE", 2, 12), ("AAAB", 3, 9),
]
for fn in (least_interval_heap, least_interval_formula, forgot_negate):
    bad = [f"{s} n={n} → {fn(list(s), n)}" for s, n, want in CASES if fn(list(s), n) != want]
    print(f"{fn.__name__:23} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

random.seed(621)
agree = 0
for _ in range(300):
    t = [chr(65 + random.randrange(1 + random.randrange(26))) for _ in range(1 + random.randrange(2000))]
    n = random.randrange(101)
    if least_interval_heap(t, n) == least_interval_formula(t, n):
        agree += 1
print(f"\nngẫu nhiên: heap và công thức khớp ở {agree}/300 bộ")


def median_ms(fn, *args):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter()
        fn(*args)
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[2]


print("\nsố việc   n      heap + deque   công thức")
for size, n in ((10_000, 2), (100_000, 100), (1_000_000, 100)):
    t = [chr(65 + random.randrange(26)) for _ in range(size)]
    print(f"{size:<9} {n:<6} {median_ms(least_interval_heap, t, n):10.1f} ms {median_ms(least_interval_formula, t, n):8.2f} ms")
