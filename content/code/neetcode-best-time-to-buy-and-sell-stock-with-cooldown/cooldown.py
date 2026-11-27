# LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
import sys

sys.setrecursionlimit(20000)  # bản ghi nhớ đệ quy sâu tới 5000 tầng
NEG = -1_000_000_000  # trạng thái chưa thể xảy ra


# Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
def max_profit_brute(prices, counter=None):
    counter = counter if counter is not None else {"calls": 0}

    def go(day, holding):
        counter["calls"] += 1
        if day >= len(prices):
            return 0
        wait = go(day + 1, holding)
        if holding:
            return max(wait, prices[day] + go(day + 2, False))  # bán, nhảy qua ngày nghỉ
        return max(wait, -prices[day] + go(day + 1, True))  # mua

    return go(0, False)


# Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm)
def max_profit_memo(prices, counter=None):
    counter = counter if counter is not None else {"calls": 0}
    n = len(prices)
    memo = [[None] * n, [None] * n]

    def go(day, holding):
        counter["calls"] += 1
        if day >= n:
            return 0
        if memo[holding][day] is not None:
            return memo[holding][day]
        wait = go(day + 1, holding)
        act = prices[day] + go(day + 2, 0) if holding else -prices[day] + go(day + 1, 1)
        memo[holding][day] = max(wait, act)
        return memo[holding][day]

    return go(0, 0)


# Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
def max_profit_table(prices):
    n = len(prices)
    hold, sold, rest = [0] * n, [0] * n, [0] * n
    hold[0], sold[0] = -prices[0], NEG
    for i in range(1, n):
        hold[i] = max(hold[i - 1], rest[i - 1] - prices[i])
        sold[i] = hold[i - 1] + prices[i]
        rest[i] = max(rest[i - 1], sold[i - 1])
    return max(sold[-1], rest[-1])


# Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
def max_profit(prices):
    hold, sold, rest = -prices[0], NEG, 0
    for price in prices[1:]:
        hold, sold, rest = max(hold, rest - price), hold + price, max(rest, sold)
    return max(sold, rest)


# Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
def best_by_trades(prices, start=0):
    best = 0
    for b in range(start, len(prices)):
        for s in range(b + 1, len(prices)):
            best = max(best, prices[s] - prices[b] + best_by_trades(prices, s + 2))
    return best


zigzag = [1 if i % 2 == 0 else 3 for i in range(5000)]
ramps = [i % 1000 for i in range(5000)]
cases = [
    ([7], 0),
    ([4, 2], 0),
    ([2, 9], 7),
    ([2, 6, 1, 7], 6),
    ([1, 3, 1, 5], 4),
    (list(range(1, 11)), 9),
    ([9, 8, 7, 6, 5], 0),
    ([1, 3, 1, 3, 1, 3, 1, 3], 4),
    ([3, 3, 3, 3], 0),
    ([6, 1, 6, 1, 6, 0, 9], 14),
    ([4, 1, 2, 8, 0, 5, 6], 8),
    (zigzag, 2500),
    (ramps, 4991),
]
ok = 0
for prices, expected in cases:
    results = [max_profit(prices), max_profit_table(prices), max_profit_memo(prices)]
    if len(prices) <= 16:
        results.append(max_profit_brute(prices))
    if len(prices) <= 10:
        results.append(best_by_trades(prices))
    if all(r == expected for r in results):
        ok += 1
print(f"{ok}/{len(cases)} ca đúng")

exhaustive_ok = total = 0
arrays = [[]]
for prefix in arrays:
    if len(prefix) == 6:
        continue
    for v in range(4):
        prices = prefix + [v]
        arrays.append(prices)
        total += 1
        expected = best_by_trades(prices)
        results = [max_profit_brute(prices), max_profit_memo(prices), max_profit_table(prices), max_profit(prices)]
        if all(r == expected for r in results):
            exhaustive_ok += 1
print(f"{exhaustive_ok}/{total} ca đúng (đối chiếu liệt kê giao dịch)")

sample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4]
brute, memo = {"calls": 0}, {"calls": 0}
max_profit_brute(sample, brute)
max_profit_memo(sample, memo)
print(f"20 ngày: vét cạn {brute['calls']} lượt gọi, memo {memo['calls']} lượt gọi")
