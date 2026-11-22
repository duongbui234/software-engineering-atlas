# NC-01 Contains Duplicate (LeetCode 217), Python 3.
# Chạy: python3 contains_duplicate.py


def contains_duplicate(nums: list[int]) -> bool:
    seen: set[int] = set()
    for x in nums:
        if x in seen:  # tra trong set: O(1) trung bình
            return True
        seen.add(x)
    return False


def contains_duplicate_sorted(nums: list[int]) -> bool:
    a = sorted(nums)  # Timsort (gộp kiểu powersort từ 3.11), trả về list mới
    return any(a[i] == a[i - 1] for i in range(1, len(a)))


def contains_duplicate_oneliner(nums: list[int]) -> bool:
    return len(set(nums)) != len(nums)  # gọn, nhưng luôn dựng cả set


cases = [
    ([1, 2, 3, 1], True),
    ([1, 2, 3, 4], False),
    ([1, 1, 1, 3, 3, 4, 3, 2, 4, 2], True),
    ([], False),
]
for fn in (contains_duplicate, contains_duplicate_sorted, contains_duplicate_oneliner):
    for nums, want in cases:
        got = fn(nums)
        print(f"{fn.__name__}({nums}) = {got} {'✓' if got == want else '✗ SAI'}")

# Với số nguyên, hash của Python chính là giá trị (trừ -1): set phân tán chúng rất đều.
print("hash(42) =", hash(42), "| hash(-1) =", hash(-1), "| hash(-2) =", hash(-2))
