# Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
# Chạy: python3 arrange.py
from math import factorial


# Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
def permute(nums, counter=None):
    result, path = [], []
    used = [False] * len(nums)

    def walk():
        if counter is not None:
            counter["calls"] += 1
        if len(path) == len(nums):
            result.append(path[:])  # chép path, vì path còn bị sửa tiếp
            return
        for i in range(len(nums)):
            if used[i]:
                continue  # phần tử này đã nằm trong path
            used[i] = True
            path.append(nums[i])
            walk()
            path.pop()
            used[i] = False  # gỡ dấu để nhánh anh em được dùng lại

    walk()
    return result


# Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
def permute_swap(nums):
    a = nums[:]
    result = []

    def walk(k):
        if k == len(a):
            result.append(a[:])
            return
        for i in range(k, len(a)):
            a[k], a[i] = a[i], a[k]
            walk(k + 1)
            a[k], a[i] = a[i], a[k]  # đổi lại để mảng về như cũ

    walk(0)
    return result


# Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
def permute_insert(nums):
    layer = [[]]
    for x in nums:
        layer = [p[:slot] + [x] + p[slot:] for p in layer for slot in range(len(p) + 1)]
    return layer


# Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
def permute_with_start(nums):
    result, path = [], []

    def walk(start):
        if len(path) == len(nums):
            result.append(path[:])
            return
        for i in range(start, len(nums)):
            path.append(nums[i])
            walk(i + 1)  # không bao giờ quay lại phần tử đứng trước i
            path.pop()

    walk(0)
    return result


# Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
def brute_force(nums):
    n = len(nums)
    result = []
    for code in range(n**n):
        idx, c = [], code
        for _ in range(n):
            idx.append(c % n)
            c //= n
        if len(set(idx)) == n:
            result.append([nums[i] for i in idx])
    return result


def canonical(lst):
    return sorted(",".join(map(str, p)) for p in lst)


def check(nums, expected):
    want = canonical(expected if expected is not None else brute_force(nums))
    for got in (permute(nums), permute_swap(nums), permute_insert(nums)):
        if len(got) != factorial(len(nums)):
            return False
        if len({tuple(p) for p in got}) != len(got):
            return False
        if canonical(got) != want:
            return False
    return True


cases = [
    ([7], [[7]]),
    ([4, 9], [[4, 9], [9, 4]]),
    ([3, 8, 1], [[3, 8, 1], [3, 1, 8], [8, 3, 1], [8, 1, 3], [1, 3, 8], [1, 8, 3]]),
    ([0, -5, 10], None),
    ([-10, 10, 0, 5], None),
    ([2, 4, 6, 8, 10], None),
    ([-3, -2, -1, 0, 1, 2], None),
]
ok = 0
for nums, expected in cases:
    if check(nums, expected):
        ok += 1
    else:
        print("sai ở", nums)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
total = good = 0


def build(arr):
    global total, good
    if arr:
        total += 1
        if check(arr, None):
            good += 1
    if len(arr) == 5:
        return
    for v in range(1, 6):
        if v not in arr:
            build(arr + [v])


build([])
print(f"{good}/{total} ca đúng (đối chiếu vét mọi bộ chỉ số)")

print(f"Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: {len(permute_with_start([3, 8, 1]))}/6 hoán vị")

counter = {"calls": 0}
six = permute([1, 2, 3, 4, 5, 6], counter)
print(f"n = 6: {len(six)} hoán vị, {counter['calls']} lượt gọi")
