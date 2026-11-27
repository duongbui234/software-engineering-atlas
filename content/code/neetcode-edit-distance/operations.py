import sys

sys.setrecursionlimit(5000)


def edit_distance_brute(a, b, counter=None):
    # Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
    def solve(i, j):
        if counter is not None:
            counter[0] += 1
        if i == len(a):
            return len(b) - j  # chèn hết phần còn lại của b
        if j == len(b):
            return len(a) - i  # xóa hết phần còn lại của a
        if a[i] == b[j]:
            return solve(i + 1, j + 1)
        return 1 + min(solve(i, j + 1), solve(i + 1, j), solve(i + 1, j + 1))

    return solve(0, 0)


def edit_distance_memo(a, b, counter=None):
    # Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
    memo = {}

    def solve(i, j):
        if counter is not None:
            counter[0] += 1
        if i == len(a):
            return len(b) - j
        if j == len(b):
            return len(a) - i
        if (i, j) in memo:
            return memo[(i, j)]
        if a[i] == b[j]:
            result = solve(i + 1, j + 1)
        else:
            result = 1 + min(solve(i, j + 1), solve(i + 1, j), solve(i + 1, j + 1))
        memo[(i, j)] = result
        return result

    return solve(0, 0)


def edit_distance_table(a, b):
    # Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[:i] và b[:j]
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(len(a) + 1):
        dp[i][0] = i
    for j in range(len(b) + 1):
        dp[0][j] = j
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp


def min_distance(a, b):
    # Một hàng và một biến chéo: bản nộp LeetCode
    if len(b) > len(a):
        a, b = b, a  # hàng dài theo chuỗi ngắn hơn
    row = list(range(len(b) + 1))
    for i in range(1, len(a) + 1):
        diagonal = row[0]  # dp[i-1][j-1]
        row[0] = i
        for j in range(1, len(b) + 1):
            above = row[j]  # dp[i-1][j], sắp bị ghi đè
            if a[i - 1] == b[j - 1]:
                row[j] = diagonal
            else:
                row[j] = 1 + min(above, row[j - 1], diagonal)
            diagonal = above
    return row[len(b)]


def edit_script(a, b):
    # Lần ngược bảng đầy đủ để in kịch bản sửa
    dp = edit_distance_table(a, b)
    ops = []
    i, j = len(a), len(b)
    while i > 0 or j > 0:
        if i > 0 and j > 0 and a[i - 1] == b[j - 1] and dp[i][j] == dp[i - 1][j - 1]:
            ops.append(('giữ', a[i - 1], b[j - 1]))
            i, j = i - 1, j - 1
        elif i > 0 and j > 0 and dp[i][j] == dp[i - 1][j - 1] + 1:
            ops.append(('thay', a[i - 1], b[j - 1]))
            i, j = i - 1, j - 1
        elif i > 0 and dp[i][j] == dp[i - 1][j] + 1:
            ops.append(('xóa', a[i - 1], ''))
            i -= 1
        else:
            ops.append(('chèn', '', b[j - 1]))
            j -= 1
    return ops[::-1]


def script_works(a, b, ops, distance):
    consumed = ''.join(src for _, src, _ in ops)
    produced = ''.join(dst for _, _, dst in ops)
    cost = sum(1 for kind, _, _ in ops if kind != 'giữ')
    return consumed == a and produced == b and cost == distance


def describe(ops):
    parts = []
    for kind, src, dst in ops:
        if kind == 'giữ':
            parts.append(f'giữ {src}')
        elif kind == 'thay':
            parts.append(f'thay {src}→{dst}')
        elif kind == 'xóa':
            parts.append(f'xóa {src}')
        else:
            parts.append(f'chèn {dst}')
    return ', '.join(parts)


def bfs_distance(a, b):
    # BFS trên chính các chuỗi, độc lập với công thức DP
    limit = max(len(a), len(b))
    seen = {a: 0}
    queue = [a]
    for s in queue:
        d = seen[s]
        if s == b:
            return d
        nxt = []
        for p in range(len(s)):
            nxt.append(s[:p] + s[p + 1:])
            nxt.append(s[:p] + ('b' if s[p] == 'a' else 'a') + s[p + 1:])
        if len(s) < limit:
            for p in range(len(s) + 1):
                for c in 'ab':
                    nxt.append(s[:p] + c + s[p:])
        for t in nxt:
            if t not in seen:
                seen[t] = d + 1
                queue.append(t)
    return -1


cases = [
    ('', '', 0),
    ('', 'abc', 3),
    ('abc', '', 3),
    ('abc', 'abc', 0),
    ('cat', 'cut', 1),
    ('table', 'tables', 1),
    ('ab', 'ba', 2),
    ('kitten', 'sitting', 3),
    ('flaw', 'lawn', 2),
    ('sunday', 'saturday', 3),
    ('pqrst', 'qrstu', 2),
    ('ab' * 250, 'ba' * 250, 2),
    ('a' * 500, 'b' * 500, 500),
]
ok = 0
for a, b, expected in cases:
    results = [min_distance(a, b), edit_distance_memo(a, b), edit_distance_table(a, b)[len(a)][len(b)]]
    if len(a) + len(b) <= 16:
        results.append(edit_distance_brute(a, b))
    if all(r == expected for r in results) and script_works(a, b, edit_script(a, b), expected):
        ok += 1
print(f'{ok}/{len(cases)} ca đúng')

words = ['']
for w in words:
    if len(w) < 4:
        words.extend([w + 'a', w + 'b'])
exhaustive_ok = total = 0
for a in words:
    for b in words:
        total += 1
        expected = bfs_distance(a, b)
        results = [edit_distance_brute(a, b), edit_distance_memo(a, b), min_distance(a, b),
                   edit_distance_table(a, b)[len(a)][len(b)]]
        if all(r == expected for r in results) and script_works(a, b, edit_script(a, b), expected):
            exhaustive_ok += 1
print(f'{exhaustive_ok}/{total} ca đúng (đối chiếu BFS)')

brute, memo = [0], [0]
edit_distance_brute('a' * 8, 'b' * 8, brute)
edit_distance_memo('a' * 8, 'b' * 8, memo)
print(f'Vét cạn: {brute[0]} lượt gọi, memo: {memo[0]} lượt gọi')
print(f"kitten → sitting: {describe(edit_script('kitten', 'sitting'))}")
