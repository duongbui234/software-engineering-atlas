# Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
# Chạy: python3 intervals.py


def max_coins(nums):
    """best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
    Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r."""
    vals = [1] + nums + [1]  # thêm hai quả bóng giá 1 ở hai đầu
    size = len(vals)
    best = [[0] * size for _ in range(size)]
    for gap in range(2, size):  # khoảng ngắn trước, dài sau
        for l in range(size - gap):
            r = l + gap
            for k in range(l + 1, r):
                coins = vals[l] * vals[k] * vals[r] + best[l][k] + best[k][r]
                if coins > best[l][r]:
                    best[l][r] = coins
    return best[0][size - 1]


def is_match(s, p):
    """match[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó."""
    m, n = len(s), len(p)
    match = [[False] * (n + 1) for _ in range(m + 1)]
    match[0][0] = True
    for i in range(m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == "*":
                # dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
                eats = i > 0 and p[j - 2] in (".", s[i - 1]) and match[i - 1][j]
                match[i][j] = match[i][j - 2] or eats
            else:
                match[i][j] = i > 0 and p[j - 1] in (".", s[i - 1]) and match[i - 1][j - 1]
    return match[m][n]


balloon_cases = [
    ([2, 4, 3], 33), ([5], 5), ([1, 5], 10), ([0, 4], 4),
    ([3, 3, 3], 39), ([9, 1, 2, 8], 243), ([4, 2, 7, 1, 6], 296),
]
pattern_cases = [
    ("", "", True), ("", "a*", True), ("", "a*b*.*", True), ("abc", "abc", True),
    ("abc", "a.c", True), ("abc", "ab", False), ("aaa", "a*", True), ("aaa", "ab*a*", True),
    ("xyz", ".*", True), ("xyz", ".*q", False), ("ab", ".*c", False), ("aaab", "a*ab", True),
    ("ba", "a*ba*", True), ("a", "ab*", True), ("bbbba", ".*a*a", True), ("ab", "a*", False),
]
ok = 0
for nums, want in balloon_cases:
    got = max_coins(nums)
    if got == want:
        ok += 1
    else:
        print(f"sai ở: max_coins({nums}) = {got}, cần {want}")
for s, p, want in pattern_cases:
    got = is_match(s, p)
    if got == want:
        ok += 1
    else:
        print(f'sai ở: is_match("{s}", "{p}") = {got}, cần {want}')
print(f"{ok}/{len(balloon_cases) + len(pattern_cases)} ca đúng")
