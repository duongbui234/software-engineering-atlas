# Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
def subsets_take_skip(nums):
    result, path = [], []

    def walk(i):
        if i == len(nums):
            result.append(path[:])  # sao chép, vì path còn bị sửa tiếp
            return
        path.append(nums[i])  # lấy nums[i]
        walk(i + 1)
        path.pop()
        walk(i + 1)  # bỏ nums[i]

    walk(0)
    return result


# Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
def subsets_start(nums):
    result, path = [], []

    def walk(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            walk(i + 1)  # chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
            path.pop()

    walk(0)
    return result


# Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
def subsets_bitmask(nums):
    return [[nums[i] for i in range(len(nums)) if mask >> i & 1] for mask in range(1 << len(nums))]


# Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
def subsets_doubling(nums):
    result = [[]]
    for x in nums:
        result += [subset + [x] for subset in result]
    return result


# Bản lỗi: đẩy chính path vào kết quả, không sao chép
def subsets_no_copy(nums):
    result, path = [], []

    def walk(start):
        result.append(path)
        for i in range(start, len(nums)):
            path.append(nums[i])
            walk(i + 1)
            path.pop()

    walk(0)
    return result


# Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
def canonical(sets):
    return sorted(tuple(sorted(s)) for s in sets)


APPROACHES = [subsets_take_skip, subsets_start, subsets_bitmask, subsets_doubling]

CASES = [
    ([5], [[], [5]]),
    ([4, -2], [[], [4], [-2], [4, -2]]),
    ([7, 1, 9], [[], [7], [1], [9], [7, 1], [7, 9], [1, 9], [7, 1, 9]]),
    ([-10, 10], [[], [-10], [10], [-10, 10]]),
    ([3, -1, 0, 8], None),
    ([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4], None),
    ([6, -6, 2], [[], [6], [-6], [2], [6, -6], [6, 2], [-6, 2], [6, -6, 2]]),
]


# Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
def check(nums, expected):
    reference = canonical(subsets_bitmask(nums))
    for solve in APPROACHES:
        got = solve(list(nums))
        if len(got) != 1 << len(nums):
            return False
        if len(set(canonical(got))) != len(got):
            return False
        if expected is not None and canonical(got) != canonical(expected):
            return False
        if canonical(got) != reference:
            return False
    return True


ok = 0
for nums, expected in CASES:
    if check(nums, expected):
        ok += 1
    else:
        print("sai ở", nums)
print(f"{ok}/{len(CASES)} ca đúng")

# Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
POOL = [-2, -1, 0, 1, 2]
total = good = 0


def build(arr):
    global total, good
    total += 1
    if check(arr, None):
        good += 1
    if len(arr) == 4:
        return
    for v in POOL:
        if v not in arr:
            build(arr + [v])


build([])
print(f"{good}/{total} ca đúng (đối chiếu chéo bốn cách)")

demo = [1, 2, 3]
broken = set(canonical(subsets_no_copy(demo)))
matched = sum(1 for key in canonical(subsets_bitmask(demo)) if key in broken)
print(f"Quên sao chép path với [1,2,3]: {matched}/8 tập con đúng")
