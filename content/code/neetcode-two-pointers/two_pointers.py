# Ga ARR-04: hai con trỏ. Giải 125, 167, 15, 11, 42 bằng cùng một khuôn, tự chạy test.
# Chạy: python3 two_pointers.py


def ok(c: str) -> bool:
    return c.isascii() and c.isalnum()  # isalnum() một mình nhận cả "é", "²"


def is_palindrome(s: str) -> bool:  # 125
    i, j = 0, len(s) - 1
    while i < j:
        if not ok(s[i]):
            i += 1
        elif not ok(s[j]):
            j -= 1
        elif s[i].lower() != s[j].lower():
            return False
        else:
            i, j = i + 1, j - 1
    return True


def two_sum_sorted(nums: list[int], target: int) -> list[int]:  # 167
    i, j = 0, len(nums) - 1
    while i < j:
        s = nums[i] + nums[j]
        if s == target:
            return [i + 1, j + 1]
        if s < target:
            i += 1
        else:
            j -= 1
    return []


def three_sum(nums: list[int]) -> list[list[int]]:  # 15
    a, out = sorted(nums), []
    for i in range(len(a) - 2):
        if a[i] > 0:
            break
        if i > 0 and a[i] == a[i - 1]:
            continue
        lo, hi = i + 1, len(a) - 1
        while lo < hi:
            s = a[i] + a[lo] + a[hi]
            if s < 0:
                lo += 1
            elif s > 0:
                hi -= 1
            else:
                out.append([a[i], a[lo], a[hi]])
                lo, hi = lo + 1, hi - 1
                while lo < hi and a[lo] == a[lo - 1]:
                    lo += 1
    return out


def max_area(h: list[int]) -> int:  # 11
    i, j, best = 0, len(h) - 1, 0
    while i < j:
        best = max(best, (j - i) * min(h[i], h[j]))
        if h[i] < h[j]:
            i += 1
        else:
            j -= 1
    return best


def trap(h: list[int]) -> int:  # 42
    i, j, lm, rm, total = 0, len(h) - 1, 0, 0, 0
    while i < j:
        lm, rm = max(lm, h[i]), max(rm, h[j])
        if lm < rm:
            total += lm - h[i]
            i += 1
        else:
            total += rm - h[j]
            j -= 1
    return total


tests = [
    is_palindrome("A man, a plan, a canal: Panama"), not is_palindrome("race a car"), is_palindrome(" "),
    two_sum_sorted([2, 7, 11, 15], 9) == [1, 2], two_sum_sorted([-1, 0], -1) == [1, 2],
    three_sum([-1, 0, 1, 2, -1, -4]) == [[-1, -1, 2], [-1, 0, 1]], three_sum([0, 0, 0, 0]) == [[0, 0, 0]],
    max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]) == 49, max_area([1, 1]) == 1,
    trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) == 6, trap([4, 2, 0, 3, 2, 5]) == 9,
]
print(f"{sum(tests)}/{len(tests)} ca đúng")
