# Ga ARR-01, tra cứu bằng hash: ba bài, cùng một khuôn "hỏi bảng, rồi ghi vào bảng".
# Chạy: python3 hash_lookup.py


def contains_duplicate(nums: list[int]) -> bool:  # 217
    seen: set[int] = set()
    for x in nums:
        if x in seen:  # hỏi trước
            return True
        seen.add(x)  # ghi sau
    return False


def two_sum(nums: list[int], target: int) -> list[int] | None:  # 1
    seen: dict[int, int] = {}  # giá trị → chỉ số
    for i, x in enumerate(nums):
        if (j := seen.get(target - x)) is not None:  # đừng viết "if j:": chỉ số 0 là falsy
            return [j, i]
        seen[x] = i
    return None


def longest_consecutive(nums: list[int]) -> int:  # 128
    all_ = set(nums)
    best = 0
    for x in all_:  # duyệt set, không duyệt nums
        if x - 1 in all_:
            continue  # x không phải đầu dãy
        length = 1
        while x + length in all_:
            length += 1
        best = max(best, length)
    return best


cases = [
    ("contains_duplicate [1,2,3,1]", contains_duplicate([1, 2, 3, 1]), True),
    ("contains_duplicate [1,2,3,4]", contains_duplicate([1, 2, 3, 4]), False),
    ("contains_duplicate []", contains_duplicate([]), False),
    ("two_sum [2,7,11,15] 9", two_sum([2, 7, 11, 15], 9), [0, 1]),
    ("two_sum [3,2,4] 6", two_sum([3, 2, 4], 6), [1, 2]),
    ("two_sum [3,3] 6", two_sum([3, 3], 6), [0, 1]),
    ("longest_consecutive [100,4,200,1,3,2]", longest_consecutive([100, 4, 200, 1, 3, 2]), 4),
    ("longest_consecutive [0,3,7,2,5,8,4,6,0,1]", longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9),
    ("longest_consecutive []", longest_consecutive([]), 0),
]
ok = 0
for name, got, want in cases:
    if got == want:
        ok += 1
    else:
        print("SAI", name, got, want)
print(f"{ok}/{len(cases)} ca đúng")
