def can_partition(nums):
    total = sum(nums)
    if total % 2:
        return False
    goal = total // 2
    reachable = [True] + [False] * goal
    for x in nums:
        for s in range(goal, x-1, -1):
            reachable[s] = reachable[s] or reachable[s-x]
    return reachable[goal]


def min_coins(coins, amount):
    best = [0] + [amount+1] * amount
    for coin in coins:
        for s in range(coin, amount+1):
            best[s] = min(best[s], best[s-coin]+1)
    return -1 if best[amount] == amount+1 else best[amount]


def coin_combinations(coins, amount):
    ways = [1] + [0] * amount
    for coin in coins:
        for s in range(coin, amount+1):
            ways[s] = min(2147483647, ways[s]+ways[s-coin])
    return ways[amount]

def count_by_subset(nums, target):
    total = sum(nums)
    twice = total - target
    if abs(target) > total or twice % 2:
        return 0
    goal = twice // 2
    ways = [1] + [0] * goal
    for x in nums:
        for s in range(goal, x-1, -1):
            ways[s] += ways[s-x]
    return ways[goal]

many_even_coins = list(range(2,600,2))
checks = [
    can_partition([4,4,6,2]),
    not can_partition([2,3,7]),
    min_coins([1,4,6],8) == 2,
    min_coins([4,6],7) == -1,
    min_coins([2147483647],0) == 0,
    coin_combinations([2,3,4],7) == 2,
    coin_combinations([4,6],0) == 1,
    coin_combinations(many_even_coins+[4999],4999) == 1,
    count_by_subset([0,0,2,3],-1) == 4,
    count_by_subset([2,5],0) == 0,
]
assert all(checks)
print(f"{len(checks)}/{len(checks)} ca đúng")
