# LeetCode 875, Koko Eating Bananas: tìm nhị phân trên đáp án, bisect với key, và hai bẫy của Python.
# Chạy: python3 koko_eating.py  (cần Python 3.10+ cho bisect với key)
import math
from bisect import bisect_left


def hours_needed(piles: list[int], k: int) -> int:
    # -(-p // k) là ⌈p / k⌉ tính bằng số nguyên: // làm tròn xuống, đổi dấu hai lần thành làm tròn lên
    return sum(-(-p // k) for p in piles)


def min_eating_speed(piles: list[int], h: int) -> int:
    lo, hi = 1, max(piles)
    while lo < hi:  # bất biến: hi luôn kịp, mọi tốc độ < lo đều trễ
        mid = (lo + hi) // 2
        if hours_needed(piles, mid) <= h:
            hi = mid  # mid kịp, có thể là đáp án
        else:
            lo = mid + 1
    return lo


def via_bisect(piles: list[int], h: int) -> int:
    # range(1, max+1) không tạo danh sách: bisect chỉ đọc vài phần tử qua chỉ số.
    # key biến mỗi tốc độ thành False (trễ) hoặc True (kịp); bisect_left tìm True đầu tiên.
    speeds = range(1, max(piles) + 1)
    return speeds[bisect_left(speeds, True, key=lambda k: hours_needed(piles, k) <= h)]


def lo_from_zero(piles: list[int], h: int) -> int:
    # SAI: lo = 0. Khi khoảng còn [0, 1] thì mid = 0 và -(-p // 0) ném ZeroDivisionError.
    lo, hi = 0, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours_needed(piles, mid) <= h:
            hi = mid
        else:
            lo = mid + 1
    return lo


cases = [
    ([3, 6, 7, 11], 8, 4), ([30, 11, 23, 4, 20], 5, 30), ([30, 11, 23, 4, 20], 6, 23),
    ([1], 1, 1), ([1, 1], 5, 1), ([1000000000], 2, 500000000), ([312884470], 312884469, 2),
    ([805306368, 805306368, 805306368], 1000000000, 3), ([2, 2], 2, 2), ([7], 3, 3),
]
for fn in (min_eating_speed, via_bisect, lo_from_zero):
    bad = []
    for piles, h, want in cases:
        try:
            got = fn(piles, h)
        except ZeroDivisionError as e:
            got = f"ZeroDivisionError ({e})"
        if got != want:
            bad.append(f"{piles} h={h} → {got}")
    print(f"{fn.__name__:<17} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

# math.ceil(p / k) đi qua số thực 64 bit: đúng với p <= 10⁹ của đề, sai khi p vượt 2⁵³.
p = 2**53 + 1
print(f"\np = 2⁵³ + 1 = {p}, k = 1")
print(f"math.ceil(p / k) = {math.ceil(p / 1)}")
print(f"-(-p // k)       = {-(-p // 1)}")

# Đo: n = 1 000 đống tới 10⁹ chuối, h = 2n.
import random, time
random.seed(7)
piles = [random.randint(1, 10**9) for _ in range(1000)]
for fn in (min_eating_speed, via_bisect):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter(); k = fn(piles, 2000); ts.append(time.perf_counter() - t0)
    print(f"{fn.__name__:<17} k = {k}, {sorted(ts)[2] * 1000:.2f} ms (trung vị 5 lần)")
