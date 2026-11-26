def rolling(nums, start, end):
    two_back = one_back = 0
    for i in range(start, end):
        two_back, one_back = one_back, max(one_back, two_back + nums[i])
    return one_back


def table(nums, start, end):
    best = [0] * (end - start + 2)
    for i in range(start, end):
        j = i - start
        best[j + 2] = max(best[j + 1], best[j] + nums[i])
    return best[-1]


def brute(nums, i, end):
    if i >= end:
        return 0
    return max(brute(nums, i + 1, end), nums[i] + brute(nums, i + 2, end))

def rob(nums, solve):
    if len(nums) == 1:
        return nums[0]
    return max(solve(nums, 0, len(nums) - 1), solve(nums, 1, len(nums)))

cases = [
    ([8], 8),
    ([0, 0, 0], 0),
    ([8, 11, 8], 11),
    ([9, 1, 1, 9], 10),
    ([4, 9, 1, 8, 3, 7], 24),
    ([10, 1], 10),
]
passed = 0
for nums, expected in cases:
    for solve in (brute, table, rolling):
        assert rob(nums, solve) == expected
        passed += 1

for solve in (table, rolling):
    assert rob([3] * 100, solve) == 150
    passed += 1

print(f"{passed}/{len(cases) * 3 + 2} ca đúng")
