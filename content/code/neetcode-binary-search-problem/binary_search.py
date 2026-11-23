# LeetCode 704, Binary Search: hai quy ước khoảng, bisect và một bản sai.
# Chạy: python3 binary_search.py
from bisect import bisect_left, bisect_right


def closed_interval(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2  # int Python không tràn, nên (lo + hi) // 2 an toàn
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def half_open(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums)
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return -1


def via_bisect(nums: list[int], target: int) -> int:
    i = bisect_left(nums, target)  # vị trí đầu tiên có nums[i] >= target
    return i if i < len(nums) and nums[i] == target else -1


def wrong_loop_condition(nums: list[int], target: int) -> int:  # SAI: khoảng đóng nhưng lặp với lo < hi
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


cases = [([-1, 0, 3, 5, 9, 12], 9, 4), ([-1, 0, 3, 5, 9, 12], 2, -1), ([5], 5, 0), ([5], 7, -1),
         ([1, 3], 3, 1), ([1, 3], 0, -1), ([1, 3, 5, 7, 9, 11, 13], 13, 6), ([1, 3, 5, 7, 9, 11, 13], 1, 0)]
for fn in (closed_interval, half_open, via_bisect, wrong_loop_condition):
    ok = sum(fn(n, t) == w for n, t, w in cases)
    print(f"{fn.__name__:21} {ok}/{len(cases)} ca đúng")

a = [1, 2, 2, 2, 3]
print(f"\nbisect_left({a}, 2) = {bisect_left(a, 2)}, bisect_right({a}, 2) = {bisect_right(a, 2)}")
print(f"số lần xuất hiện của 2 = {bisect_right(a, 2) - bisect_left(a, 2)}")

# Đo: 10⁵ lần tìm trong mảng 10⁶ phần tử, vòng lặp viết tay so với bisect_left (viết bằng C).
import random
import timeit

random.seed(42)
nums = list(range(0, 2_000_000, 2))
targets = [random.randrange(2_000_000) for _ in range(100_000)]
hand = min(timeit.repeat(lambda: [closed_interval(nums, t) for t in targets], number=1, repeat=5))
lib = min(timeit.repeat(lambda: [via_bisect(nums, t) for t in targets], number=1, repeat=5))
print(f"\nn = 10⁶, 10⁵ lần tìm: viết tay {hand * 1000:.0f} ms, bisect_left {lib * 1000:.0f} ms")
