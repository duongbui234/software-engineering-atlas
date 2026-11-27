# Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.


def burst_brute(nums, counter=None):
    """Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại."""
    counter = counter if counter is not None else {"calls": 0}

    def go(arr):
        counter["calls"] += 1
        best = 0
        for i in range(len(arr)):
            left = arr[i - 1] if i > 0 else 1
            right = arr[i + 1] if i + 1 < len(arr) else 1
            best = max(best, left * arr[i] * right + go(arr[:i] + arr[i + 1:]))
        return best

    return go(list(nums))


def burst_first_split_wrong(nums):
    """Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
    Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1]."""
    p = [1] + list(nums) + [1]
    memo = {}

    def solve(l, r):
        if l > r:
            return 0
        if (l, r) in memo:
            return memo[(l, r)]
        best = 0
        for k in range(l, r + 1):
            best = max(best, p[k - 1] * p[k] * p[k + 1] + solve(l, k - 1) + solve(k + 1, r))
        memo[(l, r)] = best
        return best

    return solve(1, len(nums))


def burst_memo(nums, counter=None):
    """Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r.
    Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r]."""
    counter = counter if counter is not None else {"calls": 0}
    p = [1] + list(nums) + [1]
    n = len(p)
    memo = [[-1] * n for _ in range(n)]

    def solve(l, r):
        counter["calls"] += 1
        if l + 1 >= r:
            return 0
        if memo[l][r] != -1:
            return memo[l][r]
        best = 0
        for k in range(l + 1, r):
            best = max(best, p[l] * p[k] * p[r] + solve(l, k) + solve(k, r))
        memo[l][r] = best
        return best

    return solve(0, n - 1)


def max_coins(nums):
    """Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài."""
    p = [1] + list(nums) + [1]
    n = len(p)
    dp = [[0] * n for _ in range(n)]
    for length in range(2, n):
        for l in range(0, n - length):
            r = l + length
            pl_pr = p[l] * p[r]
            row_l = dp[l]
            best = 0
            for k in range(l + 1, r):
                v = pl_pr * p[k] + row_l[k] + dp[k][r]
                if v > best:
                    best = v
            dp[l][r] = best
    return dp[0][n - 1]


mixed = [(i * 37 + 11) % 101 for i in range(300)]
cases = [
    ([7], 7),
    ([2, 3], 9),
    ([0, 0, 0], 0),
    ([4, 0, 4], 20),
    ([2, 9, 4], 84),
    ([5, 1, 1, 5], 60),
    ([9, 1, 8, 2, 7], 760),
    ([1, 2, 3, 4, 5, 6], 252),
    ([1] * 300, 300),
    ([100] * 300, 298010100),
    (mixed, 116330212),
]
ok = 0
for nums, expected in cases:
    results = [max_coins(nums), burst_memo(nums)]
    if len(nums) <= 6:
        results.append(burst_brute(nums))
    if all(r == expected for r in results):
        ok += 1
print(f"{ok}/{len(cases)} ca đúng")

arrays = [[]]
k = 0
while k < len(arrays):
    if len(arrays[k]) < 5:
        for v in range(4):
            arrays.append(arrays[k] + [v])
    k += 1
exhaustive_ok = total = 0
for nums in arrays[1:]:
    total += 1
    expected = burst_brute(nums)
    if max_coins(nums) == expected and burst_memo(nums) == expected:
        exhaustive_ok += 1
print(f"{exhaustive_ok}/{total} ca đúng (đối chiếu mọi thứ tự nổ)")

print(f"Chia theo quả nổ đầu tiên với [2,3]: {burst_first_split_wrong([2, 3])}, đúng là {max_coins([2, 3])}")
brute, memo = {"calls": 0}, {"calls": 0}
eight = [3, 1, 4, 1, 5, 9, 2, 6]
burst_brute(eight, brute)
burst_memo(eight, memo)
print(f"8 quả: vét cạn {brute['calls']} lượt gọi, memo {memo['calls']} lượt gọi")
