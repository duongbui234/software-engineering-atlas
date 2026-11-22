# LeetCode 42, Trapping Rain Water: bốn cách và test.
# Chạy: python3 trapping_rain_water.py
from itertools import accumulate


def brute_force(h: list[int]) -> int:
    return sum(min(max(h[: i + 1]), max(h[i:])) - h[i] for i in range(len(h)))


def prefix_max(h: list[int]) -> int:
    left = list(accumulate(h, max))  # accumulate với max: max tiền tố trong một dòng
    right = list(accumulate(reversed(h), max))[::-1]
    return sum(min(l, r) - x for l, r, x in zip(left, right, h))


def two_pointers(h: list[int]) -> int:
    i, j, left_max, right_max, total = 0, len(h) - 1, 0, 0, 0
    while i < j:
        left_max, right_max = max(left_max, h[i]), max(right_max, h[j])
        if left_max < right_max:
            total += left_max - h[i]
            i += 1
        else:
            total += right_max - h[j]
            j -= 1
    return total


def monotonic_stack(h: list[int]) -> int:
    stack, total = [], 0
    for i, x in enumerate(h):
        while stack and x > h[stack[-1]]:
            bottom = stack.pop()
            if not stack:
                break
            l = stack[-1]
            total += (i - l - 1) * (min(h[l], x) - h[bottom])
        stack.append(i)
    return total


cases = [([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1], 6), ([4, 2, 0, 3, 2, 5], 9), ([], 0), ([3], 0),
         ([1, 2, 3, 4], 0), ([5, 4, 1, 2], 1), ([2, 0, 2], 2), ([3, 0, 0, 2, 0, 4], 10)]
for fn in (brute_force, prefix_max, two_pointers, monotonic_stack):
    ok = sum(fn(h) == w for h, w in cases)
    print(f"{fn.__name__:15} {ok}/{len(cases)} ca đúng")
