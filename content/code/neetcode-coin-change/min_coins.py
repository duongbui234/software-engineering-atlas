def min_coins(coins, amount):
    impossible = amount + 1
    dp = [impossible] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for total in range(coin, amount + 1):
            dp[total] = min(dp[total], dp[total - coin] + 1)
    return -1 if dp[amount] == impossible else dp[amount]


def by_amount(coins, amount):
    impossible = amount + 1
    dp = [impossible] * (amount + 1)
    dp[0] = 0
    for total in range(1, amount + 1):
        for coin in coins:
            if coin <= total:
                dp[total] = min(dp[total], dp[total - coin] + 1)
    return -1 if dp[amount] == impossible else dp[amount]


def search(coins, amount, use_memo):
    impossible = amount + 1
    memo = {}
    calls = 0

    def visit(remaining):
        nonlocal calls
        calls += 1
        if remaining == 0:
            return 0
        if use_memo and remaining in memo:
            return memo[remaining]
        best = impossible
        for coin in coins:
            if coin <= remaining:
                best = min(best, visit(remaining - coin) + 1)
        if use_memo:
            memo[remaining] = best
        return best

    best = visit(amount)
    return (-1 if best == impossible else best), calls


cases = [
    ([4, 7], 14, 2),
    ([4, 7], 13, -1),
    ([1, 5, 7], 10, 2),
    ([1], 10000, 10000),
    ([2147483647, 3], 9, 3),
    ([8, 9], 0, 0),
    ([4, 6], 7, -1),
    ([9, 4], 12, 3),
    ([14, 21], 28, 2),
    ([10, 15, 25], 30, 2),
]
for coins, amount, want in cases:
    assert min_coins(coins, amount) == by_amount(coins, amount) == want
    if amount <= 30:
        assert search(coins, amount, False)[0] == search(coins, amount, True)[0] == want
print(f"{len(cases)}/{len(cases)} ca đúng")

brute, brute_calls = search([4, 6, 9], 36, False)
memoized, memo_calls = search([4, 6, 9], 36, True)
assert brute == memoized == 4
print(f"A=36: vét cạn {brute_calls}, memo {memo_calls} lượt gọi")
