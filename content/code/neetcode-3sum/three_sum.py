# LeetCode 15, 3Sum: ba cách và test.
# Chạy: python3 three_sum.py
from itertools import combinations


def brute_force(nums: list[int]) -> list[list[int]]:
    found = {tuple(sorted(t)) for t in combinations(nums, 3) if sum(t) == 0}  # tuple hash được, list thì không
    return [list(t) for t in found]


def hash_per_anchor(nums: list[int]) -> list[list[int]]:
    found = set()
    for i in range(len(nums)):
        met = set()
        for j in range(i + 1, len(nums)):
            need = -nums[i] - nums[j]
            if need in met:
                found.add(tuple(sorted((nums[i], nums[j], need))))
            met.add(nums[j])
    return [list(t) for t in found]


def sort_two_pointers(nums: list[int]) -> list[list[int]]:
    a, out = sorted(nums), []
    for i in range(len(a) - 2):
        if a[i] > 0:
            break
        if i > 0 and a[i] == a[i - 1]:
            continue
        lo, hi = i + 1, len(a) - 1
        while lo < hi:
            s = a[i] + a[lo] + a[hi]
            if s < 0:
                lo += 1
            elif s > 0:
                hi -= 1
            else:
                out.append([a[i], a[lo], a[hi]])
                lo, hi = lo + 1, hi - 1
                while lo < hi and a[lo] == a[lo - 1]:
                    lo += 1
    return out


def norm(r):
    return sorted(tuple(sorted(t)) for t in r)


cases = [([-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]), ([0, 1, 1], []), ([0, 0, 0], [[0, 0, 0]]),
         ([0, 0, 0, 0], [[0, 0, 0]]), ([-2, 0, 1, 1, 2], [[-2, 0, 2], [-2, 1, 1]]),
         ([-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6], [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]),
         ([-10, 5, 5, -1, 11, -1], [[-10, -1, 11], [-10, 5, 5]])]
for fn in (brute_force, hash_per_anchor, sort_two_pointers):
    ok = sum(norm(fn(n)) == norm(w) for n, w in cases)
    print(f"{fn.__name__:17} {ok}/{len(cases)} ca đúng")
