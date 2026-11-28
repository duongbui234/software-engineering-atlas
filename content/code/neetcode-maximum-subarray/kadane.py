# Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
# Chạy: python3 kadane.py        (thêm tham số bench để đo thời gian)
import sys
import time


# Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
def max_sub_array(nums):
    cur = nums[0]  # tổng tốt nhất của đoạn kết thúc tại i
    best = nums[0]
    for x in nums[1:]:
        cur = x if cur < 0 else cur + x  # phần đầu âm chỉ kéo tổng xuống
        if cur > best:
            best = cur
    return best


# Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
def max_sub_array_bounds(nums):
    cur = best = nums[0]
    start = lo = hi = 0
    for i in range(1, len(nums)):
        if cur < 0:
            cur = nums[i]
            start = i  # đoạn mới bắt đầu tại i
        else:
            cur += nums[i]
        if cur > best:
            best, lo, hi = cur, start, i
    return best, lo, hi


# Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
def max_sub_array_prefix(nums):
    prefix = 0
    min_prefix = 0  # P[0] = 0: tiền tố rỗng
    best = float("-inf")
    for x in nums:
        prefix += x
        best = max(best, prefix - min_prefix)
        min_prefix = min(min_prefix, prefix)
    return best


# Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
def max_sub_array_divide(nums):
    def solve(lo, hi):
        if lo == hi:
            return nums[lo]
        mid = (lo + hi) // 2
        total, left_best = 0, float("-inf")  # tổng lớn nhất của đoạn kết thúc tại mid
        for i in range(mid, lo - 1, -1):
            total += nums[i]
            left_best = max(left_best, total)
        total, right_best = 0, float("-inf")  # tổng lớn nhất của đoạn bắt đầu tại mid + 1
        for i in range(mid + 1, hi + 1):
            total += nums[i]
            right_best = max(right_best, total)
        return max(solve(lo, mid), solve(mid + 1, hi), left_best + right_best)

    return solve(0, len(nums) - 1)


# Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
def max_sub_array_quadratic(nums, counter=None):
    best = float("-inf")
    adds = 0
    for i in range(len(nums)):
        total = 0
        for j in range(i, len(nums)):
            total += nums[j]
            adds += 1
            if total > best:
                best = total
    if counter is not None:
        counter["adds"] += adds
    return best


# Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
def max_sub_array_cubic(nums):
    best = float("-inf")
    for i in range(len(nums)):
        for j in range(i, len(nums)):
            total = 0
            for k in range(i, j + 1):
                total += nums[k]
            if total > best:
                best = total
    return best


# Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
def max_sub_array_zero_init(nums):
    cur = best = 0
    for x in nums:
        cur = max(0, cur + x)
        best = max(best, cur)
    return best


def check(nums, expected):
    best, lo, hi = max_sub_array_bounds(nums)
    if best != expected or sum(nums[lo : hi + 1]) != best or not (0 <= lo <= hi < len(nums)):
        return False
    answers = [
        max_sub_array(nums),
        max_sub_array_prefix(nums),
        max_sub_array_divide(nums),
        max_sub_array_quadratic(nums),
        max_sub_array_cubic(nums),
    ]
    return all(a == expected for a in answers)


# Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
seed = 2026


def next_rand():
    global seed
    seed = seed * 48271 % 2147483647
    return seed


cases = [
    ([7], 7),
    ([-4], -4),
    ([-3, -1, -2], -1),
    ([0, 0, 0], 0),
    ([3, -2, 5, -1], 6),
    ([2, -8, 3, -2, 4, -10], 5),
    ([-1, 6, -7, 5, 3, -2], 8),
    ([10000, 10000, -1, 10000], 29999),
    ([-10000, -10000, -10000], -10000),
]
ok = 0
for nums, expected in cases:
    if check(nums, expected):
        ok += 1
    else:
        print("sai ở", nums)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
good = 0
rounds = 3000
for _ in range(rounds):
    n = 1 + next_rand() % 12
    nums = [next_rand() % 21 - 10 for _ in range(n)]
    if check(nums, max_sub_array_cubic(nums)):
        good += 1
print(f"{good}/{rounds} ca đúng (đối chiếu vét O(n³))")

print(f"Khởi tạo best = 0 với [-3,-1,-2]: ra {max_sub_array_zero_init([-3, -1, -2])}, đúng là {max_sub_array([-3, -1, -2])}")

# Phép đo: n = 10000, giá trị −10000..10000
big = [next_rand() % 20001 - 10000 for _ in range(10000)]
counter = {"adds": 0}
slow = max_sub_array_quadratic(big, counter)
fast = max_sub_array(big)
print(f"n = {len(big)}: O(n²) cộng {counter['adds']} lần, Kadane {len(big)} lần, cùng ra {fast if slow == fast else 'KHÁC NHAU'}")

if "bench" in sys.argv:
    # chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
    def timed(f, reps):
        t = time.perf_counter()
        for _ in range(reps):
            f()
        return f"{(time.perf_counter() - t) * 1000 / reps:.3f}"

    print(
        f"thời gian mỗi lượt: O(n²) {timed(lambda: max_sub_array_quadratic(big), 1)} ms, "
        f"chia để trị {timed(lambda: max_sub_array_divide(big), 10)} ms, Kadane {timed(lambda: max_sub_array(big), 100)} ms"
    )
