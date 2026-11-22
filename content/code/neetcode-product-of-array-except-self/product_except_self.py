# LeetCode 238, Product of Array Except Self: bốn cách và test.
# Chạy: python3 product_except_self.py
from math import prod


def brute_force(nums: list[int]) -> list[int]:
    return [prod(x for j, x in enumerate(nums) if j != i) for i in range(len(nums))]


def naive_division(nums: list[int]) -> list[int]:  # SAI: gặp số 0 là ZeroDivisionError
    total = prod(nums)
    return [total // x for x in nums]


def division_zero_aware(nums: list[int]) -> list[int]:
    zeros = nums.count(0)
    p = prod(x for x in nums if x != 0)
    if zeros > 1:
        return [0] * len(nums)
    if zeros == 1:
        return [p if x == 0 else 0 for x in nums]
    return [p // x for x in nums]  # chia hết nên // đúng; total / x sẽ ra float


def prefix_suffix_arrays(nums: list[int]) -> list[int]:
    n = len(nums)
    prefix, suffix = [1] * n, [1] * n
    for i in range(1, n):
        prefix[i] = prefix[i - 1] * nums[i - 1]
    for i in range(n - 2, -1, -1):
        suffix[i] = suffix[i + 1] * nums[i + 1]
    return [p * s for p, s in zip(prefix, suffix)]


def prefix_suffix_in_place(nums: list[int]) -> list[int]:
    n = len(nums)
    out = [1] * n
    left = 1
    for i in range(n):
        out[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out


cases = [([1, 2, 3, 4], [24, 12, 8, 6]), ([-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]), ([2, 3], [3, 2]),
         ([0, 0, 5], [0, 0, 0]), ([0, 4, 5], [20, 0, 0]), ([-2, -3, 4], [-12, -8, 6])]
for fn in (brute_force, naive_division, division_zero_aware, prefix_suffix_arrays, prefix_suffix_in_place):
    ok, errs = 0, []
    for nums, want in cases:
        try:
            ok += fn(nums) == want
        except ZeroDivisionError as e:
            errs.append(f"{nums}: {type(e).__name__}")
    print(f"{fn.__name__:23} {ok}/{len(cases)} ca đúng" + (f"; lỗi ở {', '.join(errs)}" if errs else ""))
