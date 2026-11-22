# NC-03 Two Sum (LeetCode 1), Python 3.
# Chạy: python3 two_sum.py
import subprocess
import sys


def two_sum(nums: list[int], target: int) -> list[int]:
    seen: dict[int, int] = {}  # giá trị → chỉ số
    for i, x in enumerate(nums):
        if (need := target - x) in seen:  # hỏi trước khi ghi
            return [seen[need], i]
        seen[x] = i
    return []


def two_sum_pointers(nums: list[int], target: int) -> list[int]:
    idx = sorted(range(len(nums)), key=nums.__getitem__)  # sắp xếp chỉ số theo giá trị
    l, r = 0, len(idx) - 1
    while l < r:
        s = nums[idx[l]] + nums[idx[r]]
        if s == target:
            return sorted([idx[l], idx[r]])
        if s < target:
            l += 1
        else:
            r -= 1
    return []


for nums, target in [([2, 7, 11, 15], 9), ([3, 2, 4], 6), ([3, 3], 6)]:
    print(nums, target, "→", two_sum(nums, target), two_sum_pointers(nums, target))

# Hash của chuỗi đổi theo mỗi lần chạy (chống tấn công dồn khóa vào cùng một ô), hash của số thì không.
code = "print(hash('two-sum'), hash(2026))"
for seed in ("1", "2"):
    out = subprocess.run([sys.executable, "-c", code], env={"PYTHONHASHSEED": seed}, capture_output=True, text=True).stdout.strip()
    print(f"PYTHONHASHSEED={seed}: hash('two-sum'), hash(2026) = {out}")
