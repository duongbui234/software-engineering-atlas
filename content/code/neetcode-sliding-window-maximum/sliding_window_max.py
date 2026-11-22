# LeetCode 239, Sliding Window Maximum: ba cách, test, và đo deque so với list.pop(0).
# Chạy: python3 sliding_window_max.py
from collections import deque
from time import perf_counter


def brute_force(nums: list[int], k: int) -> list[int]:
    return [max(nums[i : i + k]) for i in range(len(nums) - k + 1)]


def blocks(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    pre, suf = nums[:], nums[:]
    for i in range(1, n):
        if i % k:
            pre[i] = max(pre[i - 1], nums[i])
    for i in range(n - 2, -1, -1):
        if (i + 1) % k:
            suf[i] = max(suf[i + 1], nums[i])
    return [max(suf[i], pre[i + k - 1]) for i in range(n - k + 1)]


def monotonic_deque(nums: list[int], k: int) -> list[int]:
    q: deque[int] = deque()  # chỉ số; popleft() là O(1)
    out = []
    for i, x in enumerate(nums):
        if q and q[0] <= i - k:
            q.popleft()
        while q and nums[q[-1]] <= x:
            q.pop()
        q.append(i)
        if i >= k - 1:
            out.append(nums[q[0]])
    return out


def monotonic_list(nums: list[int], k: int) -> list[int]:
    q: list[int] = []
    out = []
    for i, x in enumerate(nums):
        if q and q[0] <= i - k:
            q.pop(0)  # đúng, nhưng pop(0) dời mọi phần tử còn lại: O(độ dài hàng đợi)
        while q and nums[q[-1]] <= x:
            q.pop()
        q.append(i)
        if i >= k - 1:
            out.append(nums[q[0]])
    return out


cases = [([1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]), ([1], 1, [1]), ([9, 8, 7, 6, 5], 2, [9, 8, 7, 6]),
         ([1, 2, 3, 4], 4, [4]), ([4, 4, 4, 1], 2, [4, 4, 4]), ([-7, -8, 7, 5, 7, 1, 6, 0], 4, [7, 7, 7, 7, 7]), ([5, 1, 2, 3], 2, [5, 2, 3])]
for fn in (brute_force, blocks, monotonic_deque, monotonic_list):
    ok = sum(fn(a, k) == want for a, k, want in cases)
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng")

n, k = 200_000, 100_000
dec = list(range(n, 0, -1))  # giảm dần: hàng đợi dài đúng k
print(f"\nn = {n}, k = {k}, dãy giảm dần (ms, một lần chạy)")
for fn in (blocks, monotonic_deque, monotonic_list):
    t = perf_counter()
    fn(dec, k)
    print(f"{fn.__name__:16} {(perf_counter() - t) * 1000:8.1f}")
