def count_stairs(n):
    older = latest = 1
    for _ in range(2, n + 1):
        older, latest = latest, older + latest
    return latest

def cheapest_stairs(cost):
    older = latest = 0
    for i in range(2, len(cost) + 1):
        older, latest = latest, min(latest + cost[i-1], older + cost[i-2])
    return latest

def rob_range(nums, start, end):
    older = latest = 0
    for i in range(start, end):
        older, latest = latest, max(latest, older + nums[i])
    return latest

def rob_ring(nums):
    if len(nums) == 1:
        return nums[0]
    return max(rob_range(nums, 0, len(nums)-1), rob_range(nums, 1, len(nums)))

def decode(s):
    older, latest = 1, int(s[0] != "0")
    for i in range(1, len(s)):
        pair = s[i-1:i+1]
        older, latest = latest, (latest if s[i] != "0" else 0) + (older if "10" <= pair <= "26" else 0)
    return latest

def max_product(nums):
    high = low = best = nums[0]
    for i in range(1, len(nums)):
        x = nums[i]
        products = (x, x * high, x * low)
        high, low = max(products), min(products)
        best = max(best, high)
    return best

checks = [
    count_stairs(6) == 13,
    cheapest_stairs([6,2,8,1]) == 3,
    rob_range([4,1,1,7,2], 0, 5) == 11,
    rob_ring([9,1,1,9]) == 10,
    rob_ring([7]) == 7,
    decode("127") == 2,
    decode("1" * 60 + "00") == 0,
    decode("100") == 0,
    max_product([-3,2,-4]) == 24,
    max_product([-2,0,-1]) == 0,
]
assert all(checks)
print(f"{len(checks)}/{len(checks)} ca đúng")
