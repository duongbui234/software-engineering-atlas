def enumerate_signs(nums, target):
    def count(index, total):
        if index == len(nums):
            return int(total == target)
        return count(index+1, total+nums[index]) + count(index+1, total-nums[index])
    return count(0, 0)


def count_by_signed_sum(nums, target):
    ways = {0: 1}
    for x in nums:
        next_ways = {}
        for total, count in ways.items():
            for key in (total+x, total-x):
                next_ways[key] = next_ways.get(key, 0) + count
        ways = next_ways
    return ways.get(target, 0)


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


cases = [
    ([1,2,5],4,1), ([0,0,2,3],1,4), ([0,0,2,3],-1,4),
    ([2,5],0,0), ([2,5],8,0), ([2,5],-8,0),
    ([3,3,3,3],0,6), ([1000],-1000,1), ([0],0,2),
    ([0]*20,0,1048576), ([1]*16,0,12870),
]
for nums,target,want in cases:
    assert count_by_signed_sum(nums,target) == want
    assert count_by_subset(nums,target) == want
    if len(nums) <= 16:
        assert enumerate_signs(nums,target) == want
print(f"{len(cases)}/{len(cases)} ca đúng")
