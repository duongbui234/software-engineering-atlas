from itertools import product


def lcs_brute(a, b, counter):
    def solve(i, j):
        counter[0] += 1
        if i == len(a) or j == len(b):
            return 0
        if a[i] == b[j]:
            return 1 + solve(i + 1, j + 1)
        return max(solve(i + 1, j), solve(i, j + 1))

    return solve(0, 0)


def lcs_memo(a, b, counter):
    cache = {}

    def solve(i, j):
        counter[0] += 1
        if i == len(a) or j == len(b):
            return 0
        if (i, j) in cache:
            return cache[(i, j)]
        if a[i] == b[j]:
            best = 1 + solve(i + 1, j + 1)
        else:
            best = max(solve(i + 1, j), solve(i, j + 1))
        cache[(i, j)] = best
        return best

    return solve(0, 0)


def lcs_table(a, b):
    # dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp


def lcs_row(a, b):
    if len(b) > len(a):
        a, b = b, a
    row = [0] * (len(b) + 1)
    for i in range(1, len(a) + 1):
        diagonal = 0  # dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
        for j in range(1, len(b) + 1):
            above = row[j]
            if a[i - 1] == b[j - 1]:
                row[j] = diagonal + 1
            else:
                row[j] = max(above, row[j - 1])
            diagonal = above
    return row[len(b)]


def rebuild(a, b, dp):
    i, j, out = len(a), len(b), []
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            out.append(a[i - 1])
            i, j = i - 1, j - 1
        elif dp[i - 1][j] >= dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    return ''.join(reversed(out))


def is_subsequence(small, big):
    it = iter(big)
    return all(ch in it for ch in small)


def by_subsets(a, b):
    best = 0
    for mask in range(1 << len(a)):
        picked = ''.join(a[k] for k in range(len(a)) if mask >> k & 1)
        if len(picked) > best and is_subsequence(picked, b):
            best = len(picked)
    return best


def all_agree(a, b, expected):
    dp = lcs_table(a, b)
    path = rebuild(a, b, dp)
    return (dp[len(a)][len(b)] == expected and lcs_row(a, b) == expected
            and len(path) == expected and is_subsequence(path, a) and is_subsequence(path, b))


cases = [
    ('bread', 'boardgame', 3),
    ('abc', 'abc', 3),
    ('abc', 'xyz', 0),
    ('a', 'a', 1),
    ('a', 'b', 0),
    ('ezupkr', 'ubmrapg', 2),
    ('abcba', 'abcbcba', 5),
    ('ab' * 500, 'ba' * 500, 999),
    ('a' * 1000, 'a' * 1000, 1000),
]
for a, b, expected in cases:
    assert all_agree(a, b, expected)
    if len(a) <= 20:
        assert lcs_memo(a, b, [0]) == expected
print(f'{len(cases)}/{len(cases)} ca đúng')

words = [''.join(p) for size in range(1, 6) for p in product('ab', repeat=size)]
checked = 0
for a in words:
    for b in words:
        expected = by_subsets(a, b)
        assert all_agree(a, b, expected) and lcs_memo(a, b, [0]) == expected
        if len(a) + len(b) <= 8:
            assert lcs_brute(a, b, [0]) == expected
        checked += 1
print(f'{checked}/{checked} ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)')

brute_calls, memo_calls = [0], [0]
lcs_brute('abcdefghij', 'klmnopqrst', brute_calls)
lcs_memo('abcdefghij', 'klmnopqrst', memo_calls)
print(f'Hai chuỗi 10 ký tự không chung chữ: vét cạn {brute_calls[0]} lượt gọi, memo {memo_calls[0]} lượt gọi')
print('Một LCS của bread và boardgame:', rebuild('bread', 'boardgame', lcs_table('bread', 'boardgame')))
