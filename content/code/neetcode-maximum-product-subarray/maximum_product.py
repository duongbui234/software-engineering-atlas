def maximum_product(values):
    high = low = best = values[0]
    for index in range(1, len(values)):
        x = values[index]
        extend_high, extend_low = high * x, low * x
        high = max(x, extend_high, extend_low)
        low = min(x, extend_high, extend_low)
        best = max(best, high)
    return best

def maximum_by_intervals(nums):
    best = nums[0]
    for left in range(len(nums)):
        product = 1
        for right in range(left, len(nums)):
            product *= nums[right]
            best = max(best, product)
    return best

def check(got, expected):
    if got != expected:
        raise ValueError(("want", expected, "got", got))

check(maximum_product([-2, 3, -4]), 24)
check(maximum_by_intervals([-2, 3, -4]), 24)
check(maximum_product([-3]), -3)
check(maximum_by_intervals([-3]), -3)
check(maximum_product([-2, -3, -4]), 12)
check(maximum_by_intervals([-2, -3, -4]), 12)
check(maximum_product([0, -2, 0, -3, -4]), 12)
check(maximum_by_intervals([0, -2, 0, -3, -4]), 12)
check(maximum_product([0, -3, 0]), 0)
check(maximum_by_intervals([0, -3, 0]), 0)
check(maximum_product([1]), 1)
check(maximum_by_intervals([1]), 1)
check(maximum_product([2, 3, 0, -2, -4]), 8)
check(maximum_by_intervals([2, 3, 0, -2, -4]), 8)
print("7/7 ca đúng")
