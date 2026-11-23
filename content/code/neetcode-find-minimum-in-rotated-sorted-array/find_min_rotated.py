# LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách, test và đo.
# Chạy: python3 find_min_rotated.py
from timeit import repeat


def linear_scan(nums: list[int]) -> int:
    return min(nums)  # min viết bằng C, nhưng vẫn đọc cả n phần tử


def binary_vs_hi(nums: list[int]) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2  # int của Python không tràn, nên (lo + hi) // 2 an toàn
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]


def binary_vs_first(nums: list[int]) -> int:
    if nums[0] <= nums[-1]:
        return nums[0]
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] >= nums[0]:
            lo = mid + 1
        else:
            hi = mid
    return nums[lo]


cases = [([3, 4, 5, 1, 2], 1), ([4, 5, 6, 7, 0, 1, 2], 0), ([11, 13, 15, 17], 11), ([1], 1),
         ([2, 1], 1), ([1, 2], 1), ([5, 1, 2, 3, 4], 1), ([2, 3, 4, 5, 1], 1)]
for fn in (linear_scan, binary_vs_hi, binary_vs_first):
    ok = sum(fn(nums) == want for nums, want in cases)
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng")

print("\nn          min() (µs/lần)   chia đôi (µs/lần)")
for n in (1_000, 100_000, 1_000_000):
    k = int(n * 0.37)
    a = [(i + k) % n for i in range(n)]
    t_lin = min(repeat(lambda: linear_scan(a), number=50, repeat=5)) / 50 * 1e6
    t_bin = min(repeat(lambda: binary_vs_hi(a), number=20_000, repeat=5)) / 20_000 * 1e6
    print(f"{n:<10} {t_lin:14.2f} {t_bin:18.3f}")
