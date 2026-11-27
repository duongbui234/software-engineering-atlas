def lis_by_brute(nums):
    def visit(i, last):
        if i == len(nums):
            return 0
        skip = visit(i + 1, last)
        if last < 0 or nums[last] < nums[i]:
            return max(skip, 1 + visit(i + 1, i))
        return skip
    return visit(0, -1)


def lis_by_endpoint(nums):
    longest = [1] * len(nums)
    for i, x in enumerate(nums):
        for j in range(i):
            if nums[j] < x:
                longest[i] = max(longest[i], longest[j] + 1)
    return max(longest, default=0)


def lis_by_tails(nums):
    tails = []
    for x in nums:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = lo + (hi - lo) // 2
            if tails[mid] < x:
                lo = mid + 1
            else:
                hi = mid
        if lo == len(tails):
            tails.append(x)
        else:
            tails[lo] = x
    return len(tails)


ascending = list(range(-1250, 1250))
cases = [
    ([],0),([-10000],1),([4,8,1,6,9,2],3),([1,4,9,-1],3),
    ([3,3,3,3],1),([8,6,4,2],1),([-10000,-2,0,10000],4),([1,3,3,8],3),
    ([-3,-1,-2,0],3),([2,6,3,4,1,5],4),(ascending,2500),(ascending[::-1],1),
]
for nums, want in cases:
    assert lis_by_endpoint(nums) == want
    assert lis_by_tails(nums) == want
    if len(nums) <= 10:
        assert lis_by_brute(nums) == want
print(f"{len(cases)}/{len(cases)} ca đúng")
