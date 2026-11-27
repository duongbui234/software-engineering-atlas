from itertools import product


def interleave_search(s1, s2, s3, memo, visits):
    if len(s1) + len(s2) != len(s3):
        return False
    cache = {} if memo else None

    def search(i, j):
        visits[0] += 1
        if i == len(s1) and j == len(s2):
            return True
        if cache is not None and (i, j) in cache:
            return cache[(i, j)]
        k = i + j
        found = (i < len(s1) and s1[i] == s3[k] and search(i + 1, j)) or \
                (j < len(s2) and s2[j] == s3[k] and search(i, j + 1))
        if cache is not None:
            cache[(i, j)] = found
        return found

    return search(0, 0)


def interleave_table(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    # ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
    ok = [[False] * (n + 1) for _ in range(m + 1)]
    ok[0][0] = True
    for i in range(m + 1):
        for j in range(n + 1):
            if i > 0 and ok[i - 1][j] and s1[i - 1] == s3[i + j - 1]:
                ok[i][j] = True
            if j > 0 and ok[i][j - 1] and s2[j - 1] == s3[i + j - 1]:
                ok[i][j] = True
    return ok[m][n]


def interleave_row(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3):
        return False
    row = [False] * (n + 1)
    for i in range(m + 1):
        for j in range(n + 1):
            if i == 0 and j == 0:
                row[j] = True
                continue
            # row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
            from_top = i > 0 and row[j] and s1[i - 1] == s3[i + j - 1]
            from_left = j > 0 and row[j - 1] and s2[j - 1] == s3[i + j - 1]
            row[j] = from_top or from_left
    return row[n]


def interleave_all(s1, s2, s3):
    answers = [interleave_table(s1, s2, s3), interleave_row(s1, s2, s3),
               interleave_search(s1, s2, s3, True, [0])]
    if len(s3) <= 24:
        answers.append(interleave_search(s1, s2, s3, False, [0]))
    return answers


cases = [
    ("ab", "cd", "acbd", True),
    ("ab", "cd", "acdb", True),
    ("ab", "cd", "badc", False),
    ("ab", "ac", "acab", True),
    ("a", "b", "abc", False),
    ("", "", "", True),
    ("", "kiwi", "kiwi", True),
    ("", "kiwi", "kiwj", False),
    ("aab", "aac", "aacaab", True),
    ("aab", "aac", "abaaac", False),
    ("a" * 100, "a" * 100, "a" * 200, True),
    ("a" * 100, "a" * 99 + "b", "a" * 198 + "ba", True),
    ("a" * 100, "a" * 99 + "b", "a" * 198 + "bb", False),
]
for s1, s2, s3, expected in cases:
    if any(answer != expected for answer in interleave_all(s1, s2, s3)):
        raise AssertionError("Ca kiểm tra sai")
print(f"{len(cases)}/{len(cases)} ca đúng")


def interleave_oracle(s1, s2, s3):
    total = len(s3)
    if len(s1) + len(s2) != total:
        return False
    for mask in range(1 << total):
        if bin(mask).count("1") != len(s1):
            continue
        a = "".join(s3[k] for k in range(total) if mask >> k & 1)
        b = "".join(s3[k] for k in range(total) if not mask >> k & 1)
        if a == s1 and b == s2:
            return True
    return False


words = [""] + ["".join(p) for size in range(1, 4) for p in product("ab", repeat=size)]
probes = 0
for s1 in words:
    for s2 in words:
        for size in (len(s1) + len(s2), len(s1) + len(s2) + 1):
            for chars in product("ab", repeat=size):
                s3 = "".join(chars)
                expected = interleave_oracle(s1, s2, s3)
                if any(answer != expected for answer in interleave_all(s1, s2, s3)):
                    raise AssertionError("Ca vét đối chiếu sai")
                probes += 1
print(f"{probes}/{probes} ca đúng (vét mọi cách chia)")

brute, memo = [0], [0]
late = ("a" * 10, "a" * 10, "a" * 19 + "b")
interleave_search(*late, False, brute)
interleave_search(*late, True, memo)
print(f"Vét cạn: {brute[0]} lượt gọi, memo: {memo[0]} lượt gọi")
