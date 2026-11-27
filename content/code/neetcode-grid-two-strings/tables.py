# Ga DP-05: bảng theo lưới và theo hai tiền tố
def unique_paths(m, n):
    row = [1] * n  # hàng 0: mọi ô có đúng một đường
    for _ in range(1, m):
        for j in range(1, n):
            row[j] += row[j - 1]  # trên + trái
    return row[-1]


def longest_common_subsequence(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]


def is_interleave(s1, s2, s3):
    if len(s1) + len(s2) != len(s3):
        return False
    row = [False] * (len(s2) + 1)
    for i in range(len(s1) + 1):
        for j in range(len(s2) + 1):
            if i == 0 and j == 0:
                row[j] = True
            else:
                c = s3[i + j - 1]
                from_top = i > 0 and row[j] and s1[i - 1] == c
                from_left = j > 0 and row[j - 1] and s2[j - 1] == c
                row[j] = from_top or from_left
    return row[len(s2)]


def num_distinct(s, t):
    ways = [1] + [0] * len(t)  # t rỗng: một cách, bỏ hết
    for ch in s:
        for j in range(len(t), 0, -1):  # đi lùi để còn đọc hàng cũ
            if ch == t[j - 1]:
                ways[j] += ways[j - 1]
    return ways[len(t)]


def min_distance(a, b):
    row = list(range(len(b) + 1))  # a rỗng: chèn j ký tự
    for i in range(1, len(a) + 1):
        diag, row[0] = row[0], i  # diag = dp[i-1][j-1]
        for j in range(1, len(b) + 1):
            top = row[j]
            if a[i - 1] == b[j - 1]:
                row[j] = diag
            else:
                row[j] = 1 + min(diag, top, row[j - 1])  # thay, xóa, chèn
            diag = top
    return row[len(b)]


checks = [
    unique_paths(3, 7) == 28,
    unique_paths(3, 2) == 3,
    unique_paths(1, 1) == 1,
    unique_paths(23, 12) == 193536720,
    longest_common_subsequence("abcde", "ace") == 3,
    longest_common_subsequence("abc", "def") == 0,
    longest_common_subsequence("map", "mop") == 2,
    is_interleave("aabcc", "dbbca", "aadbbcbcac"),
    not is_interleave("aabcc", "dbbca", "aadbbbaccc"),
    is_interleave("", "", ""),
    not is_interleave("a", "", "ab"),
    num_distinct("rabbbit", "rabbit") == 3,
    num_distinct("babgbag", "bag") == 5,
    num_distinct("a", "b") == 0,
    min_distance("horse", "ros") == 3,
    min_distance("intention", "execution") == 5,
    min_distance("", "abc") == 3,
]
assert all(checks), "Ca kiểm tra sai"
print(f"{len(checks)}/{len(checks)} ca đúng")
