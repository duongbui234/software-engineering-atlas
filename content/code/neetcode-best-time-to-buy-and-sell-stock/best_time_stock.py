# LeetCode 121, Best Time to Buy and Sell Stock: ba cách và test.
# Chạy: python3 best_time_stock.py
import math


def brute_force(prices: list[int]) -> int:
    best = 0  # không lời thì trả 0, không trả số âm
    for i in range(len(prices)):
        for j in range(i + 1, len(prices)):
            best = max(best, prices[j] - prices[i])
    return best


def running_min(prices: list[int]) -> int:
    min_so_far, best = math.inf, 0
    for p in prices:
        best = max(best, p - min_so_far)  # p - inf = -inf ở ngày đầu, max với 0 vẫn là 0
        min_so_far = min(min_so_far, p)
    return best


def two_pointers(prices: list[int]) -> int:
    left, best = 0, 0
    for right in range(1, len(prices)):
        if prices[right] < prices[left]:
            left = right
        else:
            best = max(best, prices[right] - prices[left])
    return best


cases = [([7, 1, 5, 3, 6, 4], 5), ([7, 6, 4, 3, 1], 0), ([2, 4, 1], 2), ([1], 0), ([3, 3, 3], 0), ([2, 1, 2, 1, 0, 1, 2], 2)]
for fn in (brute_force, running_min, two_pointers):
    ok = sum(fn(p) == want for p, want in cases)
    print(f"{fn.__name__:12} {ok}/{len(cases)} ca đúng")
