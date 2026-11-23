# LeetCode 215, Kth Largest Element in an Array: sorted, heapq (hai cách), quickselect ba phần, đếm, và phép đo.
# Chạy: python3 kth_largest.py
import heapq
import random
import statistics
import time


def sort_then_pick(nums: list[int], k: int) -> int:
    return sorted(nums)[-k]  # sorted so sánh số đúng, không có bẫy chuỗi như JS


def heap_of_k(nums: list[int], k: int) -> int:
    # heapq chỉ có min-heap: đỉnh h[0] là nhỏ nhất. Giữ k phần tử lớn nhất đã thấy.
    h = nums[:k]
    heapq.heapify(h)  # O(k)
    for x in nums[k:]:
        if x > h[0]:
            heapq.heapreplace(h, x)  # lấy đỉnh ra rồi đẩy x vào, một lần chìm xuống
    return h[0]


def via_nlargest(nums: list[int], k: int) -> int:
    # nlargest trả k phần tử lớn nhất, xếp giảm dần; phần tử cuối là phần tử lớn thứ k.
    return heapq.nlargest(k, nums)[-1]


def quickselect_3way(nums: list[int], k: int) -> int:
    # Phân hoạch ba phần quanh chốt ngẫu nhiên; vị trí đích rơi vào khúc "bằng chốt" là xong.
    a, target = nums[:], len(nums) - k
    lo, hi = 0, len(a) - 1
    while True:
        pivot = a[random.randint(lo, hi)]
        lt, i, gt = lo, lo, hi
        while i <= gt:
            if a[i] < pivot:
                a[lt], a[i] = a[i], a[lt]
                lt += 1
                i += 1
            elif a[i] > pivot:
                a[i], a[gt] = a[gt], a[i]
                gt -= 1
            else:
                i += 1
        if target < lt:
            hi = lt - 1
        elif target > gt:
            lo = gt + 1
        else:
            return pivot


def counting_pick(nums: list[int], k: int) -> int:
    # Giá trị chỉ trong [-10⁴, 10⁴]: đếm rồi đi từ giá trị lớn nhất xuống.
    cnt = [0] * 20001
    for x in nums:
        cnt[x + 10000] += 1
    for v in range(20000, -1, -1):
        k -= cnt[v]
        if k <= 0:
            return v - 10000
    raise ValueError("k lớn hơn n")


cases = [
    ([3, 2, 1, 5, 6, 4], 2, 5),
    ([3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4),
    ([1], 1, 1),
    ([7, 7, 7, 7], 2, 7),
    ([-1, -2, -3], 1, -1),
    ([-10000, 10000], 2, -10000),
    (list(range(1, 11)), 3, 8),
    (list(range(10, 0, -1)), 10, 1),
    ([10, 9, 1], 1, 10),
    ([2, -1, 10, -20], 2, 2),
]
for fn in (sort_then_pick, heap_of_k, via_nlargest, quickselect_3way, counting_pick):
    bad = [f"{n} k={k} → {fn(n, k)}" for n, k, want in cases if fn(n, k) != want]
    print(f"{fn.__name__:17} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

# Đo n = 10⁵, giá trị ngẫu nhiên trong [-10⁴, 10⁴], trung vị 5 lần, với k nhỏ và k = n / 2.
N = 100_000
nums = [random.randint(-10000, 10000) for _ in range(N)]
print(f"\nđo n = {N}, ngẫu nhiên (ms):")
print(f"{'cách':17}{'k = 10':>10}{'k = n/2':>10}")
for fn in (sort_then_pick, heap_of_k, via_nlargest, quickselect_3way, counting_pick):
    row = []
    for k in (10, N // 2):
        ts = []
        for _ in range(5):
            t0 = time.perf_counter()
            fn(nums, k)
            ts.append((time.perf_counter() - t0) * 1000)
        row.append(f"{statistics.median(ts):10.1f}")
    print(f"{fn.__name__:17}" + "".join(row))
