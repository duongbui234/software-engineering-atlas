# LC 287 Find the Duplicate Number bằng Python: Set, tìm nhị phân trên giá trị, đếm bit, rùa và thỏ (Floyd), và bẫy list.sort() sửa mảng gốc.
# Chạy: python3 find_duplicate.py
import random
import time


# Set các số đã gặp: O(n) bộ nhớ.
def hash_set(nums):
    seen = set()
    for x in nums:
        if x in seen:
            return x
        seen.add(x)
    return -1


# Tìm nhị phân trên giá trị: cnt(m) = số phần tử ≤ m; số trùng là m nhỏ nhất có cnt(m) > m.
def binary_count(nums):
    lo, hi = 1, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        cnt = sum(1 for x in nums if x <= mid)
        if cnt > mid:
            hi = mid
        else:
            lo = mid + 1
    return lo


# Đếm bit: bit b của số trùng bật khi nums có nhiều số bật bit b hơn dãy 1..n.
def bit_count(nums):
    n = len(nums) - 1
    ans = 0
    b = 0
    while (1 << b) <= n:
        mask = 1 << b
        in_nums = sum(1 for x in nums if x & mask)
        in_range = sum(1 for v in range(1, n + 1) if v & mask)
        if in_nums > in_range:
            ans |= mask
        b += 1
    return ans


# Rùa và thỏ trên đồ thị i → nums[i], xuất phát từ chỉ số 0.
def floyd(nums):
    slow = fast = 0
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    a = 0
    while a != slow:
        a = nums[a]
        slow = nums[slow]
    return a


# BẪY: nums.sort() sắp tại chỗ, nên mảng của người gọi bị đổi. sorted(nums) mới tạo bản sao.
def sort_in_place(nums):
    nums.sort()
    for i in range(1, len(nums)):
        if nums[i] == nums[i - 1]:
            return nums[i]
    return -1


cases = [
    ([1, 3, 4, 2, 2], 2), ([3, 1, 3, 4, 2], 3), ([3, 3, 3, 3, 3], 3), ([1, 1], 1), ([1, 1, 2], 1),
    ([2, 2, 2, 2, 2], 2), ([2, 5, 9, 6, 9, 3, 8, 9, 7, 1], 9), ([1, 4, 4, 2, 4], 4), ([2, 1, 2], 2), ([4, 3, 1, 4, 2], 4),
]
for fn in (hash_set, binary_count, bit_count, floyd, sort_in_place):
    ok = sum(fn(list(nums)) == want for nums, want in cases)
    print(f"{fn.__name__:14} {ok}/{len(cases)} ca đúng")

nums = [3, 1, 3, 4, 2]
print(f"\nsort_in_place([3, 1, 3, 4, 2]) = {sort_in_place(nums)}; mảng của người gọi giờ là {nums}")


def make_input(n, rng):
    perm = list(range(1, n + 1))
    rng.shuffle(perm)
    nums = [perm[0]] + perm
    rng.shuffle(nums)
    return nums, perm[0]


rng = random.Random(287)
bad = {f.__name__: 0 for f in (hash_set, binary_count, bit_count, floyd)}
for _ in range(500):
    nums, d = make_input(rng.randint(1, 500), rng)
    for f in (hash_set, binary_count, bit_count, floyd):
        if f(list(nums)) != d:
            bad[f.__name__] += 1
print("ngẫu nhiên 500 mảng: số mảng sai:", ", ".join(f"{k} {v}" for k, v in bad.items()))


def med(fn, reps=5):
    ts = []
    for _ in range(reps):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[len(ts) // 2]


print("\nn          hash_set   binary_count  bit_count     floyd   (ms, trung vị 5 lần)")
for n in (100_000, 1_000_000):
    nums, _ = make_input(n, rng)
    r = [med(lambda: hash_set(nums)), med(lambda: binary_count(nums)), med(lambda: bit_count(nums)), med(lambda: floyd(nums))]
    print(f"{n:<10} " + " ".join(f"{x:10.1f}" for x in r))
