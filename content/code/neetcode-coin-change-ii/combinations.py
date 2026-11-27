LIMIT = 2_147_483_647


def enumerate_counts(amount, coins, index=0):
    if index == len(coins):
        return int(amount == 0)
    coin = coins[index]
    return sum(enumerate_counts(rest, coins, index + 1)
               for rest in range(amount, -1, -coin))


def count_table(amount, coins):
    previous = [1] + [0] * amount
    rows = [previous]
    for coin in coins:
        current = previous.copy()
        for total in range(coin, amount + 1):
            current[total] = min(LIMIT, previous[total] + current[total - coin])
        rows.append(current)
        previous = current
    return rows[-1][amount]


def count_combinations(amount, coins):
    ways = [1] + [0] * amount
    for coin in coins:
        for total in range(coin, amount + 1):
            ways[total] = min(LIMIT, ways[total] + ways[total - coin])
    return ways[amount]


cases = [
    (8, [2, 3, 5], 3),
    (5, [3, 2], 1),
    (10, [5, 2, 3], 4),
    (7, [6, 4], 0),
    (16, [4], 1),
    (0, [7, 11], 1),
    (2, [3, 5000], 0),
    (4, [2, 1], 3),
    (120, [6, 1, 4, 9, 17], 4131),
    (4999, list(range(2, 599, 2)) + [4999], 1),
]
for amount, coins, expected in cases:
    assert count_table(amount, coins) == expected
    assert count_combinations(amount, coins) == expected
    if amount <= 20:
        assert enumerate_counts(amount, coins) == expected
print(f"{len(cases)}/{len(cases)} ca đúng")
