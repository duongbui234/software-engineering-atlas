# LeetCode 128, Longest Consecutive Sequence: ba cách, test, rồi đo.
# Chạy: python3 longest_consecutive.py
import random
import time


def brute_force(nums: list[int]) -> int:
    best = 0
    for x in nums:
        length = 1
        while x + length in nums:  # "in" trên LIST duyệt cả list: O(n) mỗi lần
            length += 1
        best = max(best, length)
    return best


def sort_scan(nums: list[int]) -> int:
    if not nums:
        return 0
    a = sorted(nums)  # sorted trả list mới; nums.sort() thì sửa mảng của người gọi
    best = length = 1
    for prev, cur in zip(a, a[1:]):
        if cur == prev:
            continue  # số trùng: bỏ qua, không đứt dãy
        length = length + 1 if cur == prev + 1 else 1
        best = max(best, length)
    return best


def hash_set(nums: list[int]) -> int:
    all_ = set(nums)
    best = 0
    for x in all_:
        if x - 1 in all_:  # "in" trên SET: O(1) trung bình
            continue
        length = 1
        while x + length in all_:
            length += 1
        best = max(best, length)
    return best


cases = [([100, 4, 200, 1, 3, 2], 4), ([0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9), ([1, 0, 1, 2], 3),
         ([], 0), ([7], 1), ([-3, -1, -2, 5], 3), ([9, 10, 8], 3)]
for fn in (brute_force, sort_scan, hash_set):
    ok = sum(fn(nums) == want for nums, want in cases)
    print(f"{fn.__name__:12} {ok}/{len(cases)} ca đúng")


def median(fn, nums):
    t = []
    for _ in range(5):
        s = time.perf_counter()
        fn(nums)
        t.append((time.perf_counter() - s) * 1000)
    return sorted(t)[2]


random.seed(42)
print("\nn          dữ liệu           sắp xếp  hash set   (ms, trung vị 5 lần)")
for n in (10_000, 100_000, 1_000_000):
    run = list(range(n))
    random.shuffle(run)
    for label, nums in (("ngẫu nhiên ±10⁹", [random.randint(-10**9, 10**9) for _ in range(n)]), ("một dãy dài", run)):
        print(f"{n:<10} {label:16} {median(sort_scan, nums):9.2f} {median(hash_set, nums):9.2f}")
