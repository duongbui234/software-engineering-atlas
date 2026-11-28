from collections import Counter


# Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
def subsets_with_dup(nums, counter=None):
    nums = sorted(nums)
    result, path = [], []

    def walk(start):
        if counter is not None:
            counter["calls"] += 1
        result.append(path[:])
        for i in range(start, len(nums)):
            # i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            walk(i + 1)
            path.pop()

    walk(0)
    return result


# Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
def subsets_skip_always(nums):
    nums = sorted(nums)
    result, path = [], []

    def walk(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            walk(i + 1)
            path.pop()

    walk(0)
    return result


# Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, cất tuple vào set để bỏ trùng
def subsets_with_set(nums, counter=None):
    nums = sorted(nums)
    seen = set()
    for mask in range(1 << len(nums)):
        if counter is not None:
            counter["generated"] += 1
        seen.add(tuple(nums[i] for i in range(len(nums)) if mask >> i & 1))
    return [list(s) for s in seen]


# Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
def subsets_by_count(nums):
    result = [[]]
    for value, count in Counter(nums).items():
        result = [subset + [value] * k for subset in result for k in range(count + 1)]
    return result


def canonical(sets):
    return sorted(tuple(sorted(s)) for s in sets)


def check(nums, expected):
    reference = canonical(subsets_by_count(nums))
    for got in (subsets_with_dup(nums), subsets_with_set(nums)):
        keys = canonical(got)
        if len(set(keys)) != len(keys):  # không được có tập lặp
            return False
        if keys != reference:
            return False
        if expected is not None and keys != canonical(expected):
            return False
    return True


CASES = [
    ([3, 3], [[], [3], [3, 3]]),
    ([5, 5, 1], [[], [1], [1, 5], [1, 5, 5], [5], [5, 5]]),
    ([4, 4, 4, 4], [[], [4], [4, 4], [4, 4, 4], [4, 4, 4, 4]]),
    ([0, -1, 0], [[], [-1], [-1, 0], [-1, 0, 0], [0], [0, 0]]),
    ([7], [[], [7]]),
    ([1, 1, 2, 2, 3], None),
    ([2] * 10, None),
    (list(range(-5, 5)), None),
]
ok = 0
for nums, expected in CASES:
    if check(nums, expected):
        ok += 1
    else:
        print("sai ở", nums)
print(f"{ok}/{len(CASES)} ca đúng")

# Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
total = good = 0


def build(arr):
    global total, good
    total += 1
    if check(arr, None):
        good += 1
    if len(arr) == 5:
        return
    for v in (1, 2, 3):
        build(arr + [v])


build([])
print(f"{good}/{total} ca đúng (đối chiếu đếm theo nhóm)")

wrong = len(subsets_skip_always([5, 5, 1]))
right = len(subsets_with_dup([5, 5, 1]))
print(f"Bỏ trùng mọi lúc với [5,5,1]: {wrong} tập, đúng là {right}")

heavy = [4] * 5 + [9] * 5
via_set = {"generated": 0}
kept = len(subsets_with_set(heavy, via_set))
via_skip = {"calls": 0}
subsets_with_dup(heavy, via_skip)
print(f"[4×5, 9×5]: Set sinh {via_set['generated']} tập để giữ {kept}, cắt cùng tầng sinh {via_skip['calls']}")
