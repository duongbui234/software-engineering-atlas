LIMIT = 2_000_000_000


def paths_brute(m, n, counter):
    def walk(r, c):
        counter[0] += 1
        if r == m - 1 and c == n - 1:
            return 1
        total = 0
        if r + 1 < m:
            total += walk(r + 1, c)
        if c + 1 < n:
            total += walk(r, c + 1)
        return total

    return walk(0, 0)


def paths_memo(m, n, counter):
    cache = {}

    def walk(r, c):
        counter[0] += 1
        if r == m - 1 or c == n - 1:
            return 1
        if (r, c) in cache:
            return cache[(r, c)]
        cache[(r, c)] = walk(r + 1, c) + walk(r, c + 1)
        return cache[(r, c)]

    return walk(0, 0)


def paths_table(m, n):
    ways = [[1] * n for _ in range(m)]
    for r in range(1, m):
        for c in range(1, n):
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1]
    return ways[m - 1][n - 1]


def paths_row(m, n):
    row = [1] * n
    for _ in range(1, m):
        for c in range(1, n):
            row[c] += row[c - 1]
    return row[n - 1]


def paths_formula(m, n):
    k = min(m, n) - 1
    total = m + n - 2
    result = 1
    for i in range(1, k + 1):
        result = result * (total - k + i) // i
    return result


def all_ways(m, n):
    return {paths_table(m, n), paths_row(m, n), paths_formula(m, n)}


cases = [(1, 1, 1), (1, 7, 1), (2, 2, 2), (3, 2, 3), (3, 7, 28), (10, 10, 48620), (23, 12, 193536720)]
for m, n, expected in cases:
    assert all_ways(m, n) == {expected}
    assert paths_memo(m, n, [0]) == expected
print(f'{len(cases)}/{len(cases)} ca đúng')

checked = 0
for m in range(1, 9):
    for n in range(1, 9):
        brute = paths_brute(m, n, [0])
        assert all_ways(m, n) == {brute} and paths_memo(m, n, [0]) == brute
        checked += 1
print(f'{checked}/{checked} ca đúng (đối chiếu vét cạn, lưới tới 8×8)')

# Pascal có chặn trên: ô nào vượt LIMIT thì giữ ở LIMIT + 1.
pascal = [[1] * 101 for _ in range(101)]
for r in range(2, 101):
    for c in range(2, 101):
        pascal[r][c] = min(pascal[r - 1][c] + pascal[r][c - 1], LIMIT + 1)
inside = 0
for m in range(1, 101):
    for n in range(1, 101):
        if pascal[m][n] <= LIMIT:
            assert all_ways(m, n) == {pascal[m][n]}
            inside += 1
print(f'{inside}/{inside} ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)')

brute_calls, memo_calls = [0], [0]
paths_brute(10, 10, brute_calls)
paths_memo(10, 10, memo_calls)
print(f'Lưới 10×10: vét cạn {brute_calls[0]} lượt gọi, memo {memo_calls[0]} lượt gọi')
