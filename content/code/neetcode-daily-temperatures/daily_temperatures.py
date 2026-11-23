# LeetCode 739, Daily Temperatures: ba cách và test.
# Chạy: python3 daily_temperatures.py
import time


def brute_force(t: list[int]) -> list[int]:
    out = [0] * len(t)
    for i in range(len(t)):
        for j in range(i + 1, len(t)):
            if t[j] > t[i]:
                out[i] = j - i
                break
    return out


def monotonic_stack(t: list[int]) -> list[int]:
    out = [0] * len(t)
    stack: list[int] = []  # chỉ số, nhiệt độ giảm dần từ đáy lên đỉnh
    for i, x in enumerate(t):
        while stack and x > t[stack[-1]]:  # stack rỗng là falsy: kiểm trước khi đọc stack[-1]
            j = stack.pop()
            out[j] = i - j
        stack.append(i)
    return out


def jump_from_right(t: list[int]) -> list[int]:
    n = len(t)
    out = [0] * n
    for i in range(n - 2, -1, -1):
        j = i + 1
        while j < n and t[j] <= t[i]:
            if out[j] == 0:
                j = n
                break
            j += out[j]
        if j < n:
            out[i] = j - i
    return out


cases = [
    ([73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]), ([30, 40, 50, 60], [1, 1, 1, 0]), ([30, 60, 90], [1, 1, 0]),
    ([90, 80, 70], [0, 0, 0]), ([70, 70, 71], [2, 1, 0]), ([50], [0]),
    ([55, 38, 53, 81, 61, 93, 97, 32, 43, 78], [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]),
]
for fn in (brute_force, monotonic_stack, jump_from_right):
    ok = sum(fn(t) == want for t, want in cases)
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng")

# Đo ở n = 10^5 (giới hạn của đề), dữ liệu giảm dần.
t = [100 - (70 * i) // 100_000 for i in range(100_000)]
for fn in (monotonic_stack, jump_from_right):
    s = time.perf_counter()
    fn(t)
    print(f"{fn.__name__:16} n = 100000 giảm dần: {(time.perf_counter() - s) * 1000:.1f} ms")
