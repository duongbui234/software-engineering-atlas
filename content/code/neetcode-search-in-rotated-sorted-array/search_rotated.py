# LeetCode 33, Search in Rotated Sorted Array: ba cách và test.
# Chạy: python3 search_rotated.py
from bisect import bisect_left


def linear_scan(nums: list[int], target: int) -> int:
    return nums.index(target) if target in nums else -1  # hai lượt O(n): "in" rồi "index"


def one_pass(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:  # nửa trái tăng dần
            if nums[lo] <= target < nums[mid]:  # Python cho viết so sánh liền nhau: a <= x < b
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # nửa phải tăng dần
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1


def pivot_then_search(nums: list[int], target: int) -> int:
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid
    pivot = lo
    a, b = (pivot, len(nums)) if nums[pivot] <= target <= nums[-1] else (0, pivot)
    i = bisect_left(nums, target, a, b)  # bisect nhận lo, hi: tìm trên một đoạn mà không phải cắt mảng
    return i if i < b and nums[i] == target else -1


cases = [([4, 5, 6, 7, 0, 1, 2], 0, 4), ([4, 5, 6, 7, 0, 1, 2], 3, -1), ([1], 0, -1), ([1], 1, 0),
         ([3, 1], 1, 1), ([5, 1, 3], 3, 2), ([1, 3], 3, 1), ([6, 7, 1, 2, 3, 4, 5], 6, 0), ([1, 2, 3, 4, 5], 4, 3)]
for fn in (linear_scan, one_pass, pivot_then_search):
    ok = sum(fn(n, t) == w for n, t, w in cases)
    print(f"{fn.__name__:18} {ok}/{len(cases)} ca đúng")
