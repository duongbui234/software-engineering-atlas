import sys
from itertools import product

CAP = 2**31  # đáp án LeetCode luôn nhỏ hơn mức này
sys.setrecursionlimit(10_000)


def count_search(s, t, memo, visits):
    cache = {} if memo else None

    def search(i, j):
        visits[0] += 1
        if j == len(t):
            return 1
        if len(s) - i < len(t) - j:
            return 0
        if cache is not None and (i, j) in cache:
            return cache[(i, j)]
        ways = search(i + 1, j)
        if s[i] == t[j]:
            ways += search(i + 1, j + 1)
        if cache is not None:
            cache[(i, j)] = ways
        return ways

    return search(0, 0)


def count_table(s, t):
    m, n = len(s), len(t)
    # ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
    ways = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        ways[i][0] = 1
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            ways[i][j] = ways[i - 1][j]
            if s[i - 1] == t[j - 1]:
                ways[i][j] += ways[i - 1][j - 1]
    return ways[m][n]


def fill_row(s, t, cap):
    row = [1] + [0] * len(t)
    for ch in s:
        # đi ngược để row[j - 1] vẫn là giá trị của hàng trước
        for j in range(len(t), 0, -1):
            if ch == t[j - 1]:
                row[j] = min(row[j] + row[j - 1], cap)
    return row


def count_row(s, t, cap=CAP):
    return fill_row(s, t, cap)[len(t)]


def count_all(s, t):
    answers = [count_table(s, t), count_row(s, t), count_search(s, t, True, [0])]
    if len(s) <= 20:
        answers.append(count_search(s, t, False, [0]))
    return answers


cases = [
    ("banana", "ban", 3),
    ("banana", "ana", 4),
    ("aaa", "aa", 3),
    ("ab", "abc", 0),
    ("abc", "d", 0),
    ("Aa", "a", 1),
    ("mississippi", "sip", 12),
    ("a" * 1000, "a" * 3, 166167000),
    ("a" * 1000, "a" * 1000, 1),
    ("a" * 1000, "a" * 499 + "b", 0),
    ("ab" * 100, "abab", 4249575),
]
for s, t, expected in cases:
    if any(answer != expected for answer in count_all(s, t)):
        raise AssertionError("Ca kiểm tra sai")
print(f"{len(cases)}/{len(cases)} ca đúng")


def count_oracle(s, t):
    return sum(1 for mask in range(1 << len(s))
               if "".join(s[k] for k in range(len(s)) if mask >> k & 1) == t)


probes = 0
for size in range(8):
    for s in map("".join, product("ab", repeat=size)):
        for t_size in range(1, 4):
            for t in map("".join, product("ab", repeat=t_size)):
                expected = count_oracle(s, t)
                if any(answer != expected for answer in count_all(s, t)) or \
                        count_row(s, t, 3) != min(expected, 3):
                    raise AssertionError("Ca vét đối chiếu sai")
                probes += 1
print(f"{probes}/{probes} ca đúng (vét mọi tập vị trí)")

s, t = "a" * 1000, "a" * 499 + "b"
row = fill_row(s, t, CAP)
full = sum(1 for value in row if value == CAP)
print(f"Hàng cuối: {full}/{len(row)} ô chạm 2^31, đáp án {row[len(t)]}")
