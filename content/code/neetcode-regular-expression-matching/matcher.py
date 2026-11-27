# Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
# Chạy: python3 matcher.py
import itertools
import re


def match_brute(s, p, counter):
    # Đệ quy thuần trên hậu tố s[i:] và p[j:]; counter[0] đếm số lần gọi.
    def go(i, j):
        counter[0] += 1
        if j == len(p):
            return i == len(s)
        first = i < len(s) and p[j] in (s[i], ".")
        if j + 1 < len(p) and p[j + 1] == "*":
            # bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
            return go(i, j + 2) or (first and go(i + 1, j))
        return first and go(i + 1, j + 1)

    return go(0, 0)


def match_memo(s, p, counter):
    # Cùng đệ quy, nhưng lưu kết quả của từng cặp (i, j), kể cả kết quả False.
    memo = {}

    def go(i, j):
        counter[0] += 1
        if (i, j) in memo:
            return memo[(i, j)]
        if j == len(p):
            ans = i == len(s)
        else:
            first = i < len(s) and p[j] in (s[i], ".")
            if j + 1 < len(p) and p[j + 1] == "*":
                ans = go(i, j + 2) or (first and go(i + 1, j))
            else:
                ans = first and go(i + 1, j + 1)
        memo[(i, j)] = ans
        return ans

    return go(0, 0)


def is_match(s, p):
    # dp[i][j]: tiền tố s[:i] có khớp trọn mẫu p[:j] không.
    n, m = len(s), len(p)
    dp = [[False] * (m + 1) for _ in range(n + 1)]
    dp[0][0] = True
    for j in range(2, m + 1):
        # chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
        dp[0][j] = p[j - 1] == "*" and dp[0][j - 2]
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if p[j - 1] == "*":
                zero = dp[i][j - 2]
                more = p[j - 2] in (s[i - 1], ".") and dp[i - 1][j]
                dp[i][j] = zero or more
            else:
                dp[i][j] = p[j - 1] in (s[i - 1], ".") and dp[i - 1][j - 1]
    return dp[n][m]


CASES = [
    ("ba", "b", False),
    ("bb", "b*", True),
    ("xy", ".*", True),
    ("kkd", "z*k*d", True),
    ("tomato", "to*ma*to", True),
    ("tomato", "t.m*a*t", False),
    ("ab", ".*z", False),
    ("aaa", "a*a", True),
    ("aaa", "ab*a*c*a", True),
    ("a", "ab*", True),
    ("bbbba", ".*a*a", True),
    ("abcd", "d*", False),
    ("", "a*b*", True),
    ("a", ".*..a*", False),
    ("a" * 20, "a*" * 7 + "b", False),
]


def main():
    ok = 0
    for s, p, want in CASES:
        got = [is_match(s, p), match_memo(s, p, [0]), match_brute(s, p, [0])]
        if all(g == want for g in got):
            ok += 1
        else:
            print("sai:", s, p, got, want)
    print(f"{ok}/{len(CASES)} ca đúng")

    # Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
    strings = ["".join(t) for n in range(5) for t in itertools.product("ab", repeat=n)]
    atoms = [c + star for c in "ab." for star in ("", "*")]
    patterns = ["".join(t) for k in range(4) for t in itertools.product(atoms, repeat=k)]
    ok = total = 0
    for p in patterns:
        native = re.compile(p)
        for s in strings:
            total += 1
            want = native.fullmatch(s) is not None
            if is_match(s, p) == want and match_memo(s, p, [0]) == want and match_brute(s, p, [0]) == want:
                ok += 1
    print(f"{ok}/{total} ca đúng (đối chiếu regex của ngôn ngữ)")

    s, p = "a" * 20, "a*" * 7 + "b"
    brute, memo = [0], [0]
    match_brute(s, p, brute)
    match_memo(s, p, memo)
    print(f"20 chữ a với (a*)×7 rồi b: vét cạn {brute[0]} lượt gọi, memo {memo[0]} lượt gọi")


main()
