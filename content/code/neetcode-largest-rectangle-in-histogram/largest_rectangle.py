# LeetCode 84, Largest Rectangle in Histogram: các cách giải, test, và giới hạn đệ quy.
# Chạy: python3 largest_rectangle.py


def brute_force(h: list[int]) -> int:
    best = 0
    for i in range(len(h)):
        low = h[i]
        for j in range(i, len(h)):
            low = min(low, h[j])
            best = max(best, low * (j - i + 1))
    return best


def divide_conquer(h: list[int], lo: int = 0, hi: int | None = None) -> int:
    if hi is None:
        hi = len(h) - 1
    if lo > hi:
        return 0
    m = min(range(lo, hi + 1), key=h.__getitem__)  # chỉ số cột thấp nhất trong đoạn
    return max(h[m] * (hi - lo + 1), divide_conquer(h, lo, m - 1), divide_conquer(h, m + 1, hi))


def monotonic_stack(h: list[int]) -> int:
    st: list[int] = []
    best = 0
    for i, cur in enumerate(h + [0]):  # h + [0]: cột lính canh cao 0 ở cuối
        while st and h[st[-1]] >= cur:
            height = h[st.pop()]
            left = st[-1] if st else -1
            best = max(best, height * (i - left - 1))
        st.append(i)
    return best


cases = [([2, 1, 5, 6, 2, 3], 10), ([2, 4], 4), ([1], 1), ([0, 0], 0), ([1, 2, 3, 4, 5], 9),
         ([5, 4, 3, 2, 1], 9), ([2, 2, 2, 2], 8), ([4, 2, 0, 3, 2, 5], 6), ([6, 2, 5, 4, 5, 1, 6], 12)]
for fn in (brute_force, divide_conquer, monotonic_stack):
    ok = sum(fn(h) == want for h, want in cases)
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng")

import sys

print(f"\nsys.getrecursionlimit() = {sys.getrecursionlimit()}")
for n in (500, 2000):
    try:
        divide_conquer(list(range(1, n + 1)))  # cột tăng dần: đệ quy sâu n tầng
        print(f"chia để trị, {n} cột tăng dần: chạy xong")
    except RecursionError as e:
        print(f"chia để trị, {n} cột tăng dần: RecursionError: {e}")
