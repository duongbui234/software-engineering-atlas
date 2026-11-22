# LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách và test.
# Chạy: python3 two_sum_ii.py
from bisect import bisect_left


def brute_force(nums: list[int], target: int) -> list[int]:
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i + 1, j + 1]
    return []


def binary_search(nums: list[int], target: int) -> list[int]:
    for i, x in enumerate(nums):
        j = bisect_left(nums, target - x, i + 1)  # lo = i + 1: chỉ tìm bên phải i
        if j < len(nums) and nums[j] == target - x:
            return [i + 1, j + 1]
    return []


def hash_map(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x] + 1, i + 1]
        seen[x] = i
    return []


def two_pointers(nums: list[int], target: int) -> list[int]:
    i, j = 0, len(nums) - 1
    while i < j:
        s = nums[i] + nums[j]
        if s == target:
            return [i + 1, j + 1]
        if s < target:
            i += 1
        else:
            j -= 1
    return []


cases = [([2, 7, 11, 15], 9, [1, 2]), ([2, 3, 4], 6, [1, 3]), ([-1, 0], -1, [1, 2]),
         ([3, 3], 6, [1, 2]), ([1, 2, 3, 4, 4, 9, 56, 90], 8, [4, 5]), ([-10, -3, 0, 5, 9], 6, [2, 5])]
for fn in (brute_force, binary_search, hash_map, two_pointers):
    ok = sum(fn(n, t) == w for n, t, w in cases)
    print(f"{fn.__name__:13} {ok}/{len(cases)} ca đúng")
