# LeetCode 4, Median of Two Sorted Arrays: bốn cách, một bản sai, test và đối chiếu ngẫu nhiên.
# Chạy: python3 median_two_arrays.py
import heapq
import random


# Cách 1, trộn rồi lấy giữa. heapq.merge trộn hai dãy đã sắp xếp trong O(m + n).
def merge_then_pick(a: list[int], b: list[int]) -> float:
    allv = list(heapq.merge(a, b))
    t = len(allv)
    return allv[t // 2] if t % 2 else (allv[t // 2 - 1] + allv[t // 2]) / 2


# Cách 2, hai con trỏ: đi tới phần tử giữa, chỉ nhớ hai giá trị gần nhất.
def two_pointer(a: list[int], b: list[int]) -> float:
    t = len(a) + len(b)
    i = j = prev = cur = 0
    for _ in range(t // 2 + 1):
        prev = cur
        if j == len(b) or (i < len(a) and a[i] <= b[j]):
            cur = a[i]; i += 1
        else:
            cur = b[j]; j += 1
    return cur if t % 2 else (prev + cur) / 2


# Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1): mỗi bước bỏ khoảng k/2 phần tử.
def kth(a: list[int], b: list[int], k: int) -> int:
    i = j = 0
    while True:
        if i == len(a):
            return b[j + k - 1]
        if j == len(b):
            return a[i + k - 1]
        if k == 1:
            return min(a[i], b[j])
        h = k // 2
        ni, nj = min(i + h, len(a)) - 1, min(j + h, len(b)) - 1
        if a[ni] <= b[nj]:
            k -= ni - i + 1; i = ni + 1
        else:
            k -= nj - j + 1; j = nj + 1


def kth_elimination(a: list[int], b: list[int]) -> float:
    t = len(a) + len(b)
    return kth(a, b, t // 2 + 1) if t % 2 else (kth(a, b, t // 2) + kth(a, b, t // 2 + 1)) / 2


# Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn. float("inf") làm phần tử canh, so sánh được với int.
def partition(a: list[int], b: list[int]) -> float:
    if len(a) > len(b):
        a, b = b, a
    m, n = len(a), len(b)
    half = (m + n + 1) // 2
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i
        a_l = a[i - 1] if i > 0 else float("-inf")
        a_r = a[i] if i < m else float("inf")
        b_l = b[j - 1] if j > 0 else float("-inf")
        b_r = b[j] if j < n else float("inf")
        if a_l <= b_r and b_l <= a_r:
            if (m + n) % 2:
                return max(a_l, b_l)
            return (max(a_l, b_l) + min(a_r, b_r)) / 2
        if a_l > b_r:
            hi = i - 1
        else:
            lo = i + 1
    raise ValueError("mảng chưa sắp xếp")


# SAI: dùng // (chia lấy phần nguyên, làm tròn xuống) thay cho /. Lệch ở tổng chẵn, và với số âm còn làm tròn về phía âm.
def wrong_floor_div(a: list[int], b: list[int]) -> float:
    allv = list(heapq.merge(a, b))
    t = len(allv)
    return allv[t // 2] if t % 2 else (allv[t // 2 - 1] + allv[t // 2]) // 2


cases = [
    ([1, 3], [2], 2), ([1, 2], [3, 4], 2.5), ([], [1], 1), ([2], [], 2), ([], [2, 3], 2.5),
    ([-5, -3, -1], [-4, -2], -3), ([1, 1, 1], [1, 1], 1), ([1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], 6),
    ([1, 2, 3, 4, 5, 6], [7], 4), ([-2, -1], [3], -1),
]
fns = [merge_then_pick, two_pointer, kth_elimination, partition, wrong_floor_div]
for fn in fns:
    bad = [f"{a} {b} → {fn(a, b)}" for a, b, want in cases if fn(a, b) != want]
    print(f"{fn.__name__:16} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))


# Đối chiếu ngẫu nhiên với cách ngây thơ: nối, sort, lấy giữa.
def brute_force(a: list[int], b: list[int]) -> float:
    s = sorted(a + b)
    t = len(s)
    return s[t // 2] if t % 2 else (s[t // 2 - 1] + s[t // 2]) / 2


random.seed(42)
PAIRS = 100_000
wrong = {fn.__name__: 0 for fn in fns}
for _ in range(PAIRS):
    a = sorted(random.randint(-50, 50) for _ in range(random.randint(0, 20)))
    b = sorted(random.randint(-50, 50) for _ in range(random.randint(0, 20)))
    if not a and not b:
        a = [0]
    want = brute_force(a, b)
    for fn in fns:
        if fn(a, b) != want:
            wrong[fn.__name__] += 1
print(f"\nĐối chiếu với nối rồi sort, {PAIRS} cặp ngẫu nhiên:")
for name, w in wrong.items():
    print(f"{name:16} sai {w} cặp")
print("\n-3 // 2 =", -3 // 2, "  -3 / 2 =", -3 / 2)
