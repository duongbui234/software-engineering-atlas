from itertools import product


def brute(nums, target, i=0):
    if target == 0:
        return True
    if target < 0 or i == len(nums):
        return False
    return brute(nums, target - nums[i], i + 1) or brute(nums, target, i + 1)


def table(nums, target):
    rows = [bytearray(target + 1) for _ in range(len(nums) + 1)]
    rows[0][0] = 1
    for i, x in enumerate(nums):
        for s in range(target + 1):
            rows[i + 1][s] = rows[i][s] or (s >= x and rows[i][s - x])
    return bool(rows[-1][target])


def descending(nums, target):
    reachable = bytearray(target + 1)
    reachable[0] = 1
    for x in nums:
        for s in range(target, x - 1, -1):
            reachable[s] |= reachable[s - x]
    return bool(reachable[target])


def bitset(nums, target):
    goal = 1 << target
    mask = (goal << 1) - 1
    reachable = 1
    for x in nums:
        reachable = (reachable | (reachable << x)) & mask
    return bool(reachable & goal)


cases = [
    ([8], False),
    ([2, 2], True),
    ([3, 6, 7, 10], True),
    ([2, 3, 7], False),
    ([1, 4, 8], False),
    ([2, 2, 2], False),
    ([31, 31], True),
    ([32, 32], True),
    ([33, 33], True),
    ([31, 2, 30, 3], True),
    ([32, 1, 17, 16], True),
    ([33, 31, 30, 34], True),
    ([63, 2, 33, 32], True),
    ([100, 40, 40], False),
    ([100] * 200, True),
    ([100] * 199 + [98], False),
]

solvers = (table, descending, bitset)
for nums, expected in cases:
    total = sum(nums)
    for solve in solvers:
        assert (total % 2 == 0 and solve(nums, total // 2)) == expected
    if len(nums) < 20:
        assert (total % 2 == 0 and brute(nums, total // 2)) == expected

checked = 0
for length in range(1, 7):
    for nums in product(range(1, 5), repeat=length):
        total = sum(nums)
        expected = total % 2 == 0 and brute(nums, total // 2)
        for solve in solvers:
            assert (total % 2 == 0 and solve(nums, total // 2)) == expected
        checked += 1

print(f"{len(cases)}/{len(cases)} ca đúng")
print(f"Đối chiếu vét cạn: {checked} mảng")
