# Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
# Chạy: python3 reach.py
import time


# Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
def can_jump_backtrack(nums, counter=None):
    last = len(nums) - 1

    def dfs(i):
        if counter is not None:
            counter["calls"] += 1
        if i == last:
            return True
        for step in range(min(nums[i], last - i), 0, -1):
            if dfs(i + step):
                return True
        return False

    return dfs(0)


# Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
def can_jump_memo(nums, counter=None):
    last = len(nums) - 1
    memo = [0] * len(nums)

    def dfs(i):
        if counter is not None:
            counter["calls"] += 1
        if i == last:
            return True
        if memo[i] != 0:
            return memo[i] == 1
        for step in range(min(nums[i], last - i), 0, -1):
            if dfs(i + step):
                memo[i] = 1
                return True
        memo[i] = 2
        return False

    return dfs(0)


# Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
def can_jump_table(nums, counter=None):
    n = len(nums)
    good = [False] * n
    good[n - 1] = True
    steps = 0
    for i in range(n - 2, -1, -1):
        end = min(i + nums[i], n - 1)
        for j in range(i + 1, end + 1):
            steps += 1
            if good[j]:
                good[i] = True
                break
    if counter is not None:
        counter["steps"] += steps
    return good[0]


# Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
def can_jump(nums, counter=None):
    farthest = 0
    for i in range(len(nums)):
        if counter is not None:
            counter["steps"] += 1
        if i > farthest:
            return False  # ô i nằm ngoài khúc tới được: kẹt
        farthest = max(farthest, i + nums[i])
        if farthest >= len(nums) - 1:
            return True
    return True


# Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
def can_jump_goal(nums):
    goal = len(nums) - 1
    for i in range(len(nums) - 2, -1, -1):
        if i + nums[i] >= goal:
            goal = i  # từ i nhảy tới goal, nên i thành đích mới
    return goal == 0


# Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
def can_jump_no_guard(nums):
    farthest = 0
    for i in range(len(nums)):
        farthest = max(farthest, i + nums[i])
    return farthest >= len(nums) - 1


# Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
def can_jump_longest_hop(nums):
    i = 0
    while i < len(nums) - 1:
        if nums[i] == 0:
            return False
        i += nums[i]
    return True


# Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
def referee(nums):
    reach = [False] * len(nums)
    reach[0] = True
    changed = True
    while changed:
        changed = False
        for i in range(len(nums)):
            if not reach[i]:
                continue
            for j in range(i + 1, min(i + nums[i], len(nums) - 1) + 1):
                if not reach[j]:
                    reach[j] = True
                    changed = True
    return reach[-1]


CORRECT = [can_jump_backtrack, can_jump_memo, can_jump_table, can_jump, can_jump_goal]


# Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
def worst_case(n):
    return [n - 2 - i for i in range(n - 1)] + [0]


cases = [
    ([0], True),
    ([1, 0], True),
    ([0, 1], False),
    ([2, 0, 0], True),
    ([1, 0, 1], False),
    ([2, 3, 0, 0, 1], True),
    ([5, 0, 0, 0, 0, 0], True),
    ([1, 2, 0, 1, 0, 3], False),
    ([2, 0, 2, 0, 1, 0], True),
    ([4, 0, 0, 0, 0, 1], False),
    (worst_case(10), False),
]
ok = 0
for nums, want in cases:
    if all(f(nums) == want for f in CORRECT) and referee(nums) == want:
        ok += 1
    else:
        print("sai ở", nums)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
total = good = 0


def build(arr):
    global total, good
    if arr:
        total += 1
        want = referee(arr)
        if all(f(arr) == want for f in CORRECT):
            good += 1
    if len(arr) == 6:
        return
    for v in range(4):
        build(arr + [v])


build([])
print(f"{good}/{total} ca đúng (đối chiếu trọng tài lan tập)")


def score(f):
    return sum(1 for nums, want in cases if f(nums) == want)


print(f"Bản quên kiểm tra i > farthest: {score(can_jump_no_guard)}/{len(cases)} ca đúng")
print(f"Bản nhảy bước dài nhất: {score(can_jump_longest_hop)}/{len(cases)} ca đúng")

small = worst_case(20)
bt = {"calls": 0}
mm = {"calls": 0}
can_jump_backtrack(small, bt)
can_jump_memo(small, mm)
print(f"n = 20, mảng tệ nhất: quay lui {bt['calls']} lượt gọi, ghi nhớ {mm['calls']} lượt gọi")

big = worst_case(10000)
table_steps = {"steps": 0}
greedy_steps = {"steps": 0}
can_jump_table(big, table_steps)
can_jump(big, greedy_steps)
print(f"n = 10000, mảng tệ nhất: bảng DP {table_steps['steps']} bước, tham lam {greedy_steps['steps']} bước")

t = time.perf_counter()
can_jump_table(big)
table_ms = (time.perf_counter() - t) * 1000
t = time.perf_counter()
for _ in range(100):
    can_jump(big)
greedy_ms = (time.perf_counter() - t) * 1000 / 100
print(f"Thời gian n = 10000: bảng DP {table_ms:.1f} ms, tham lam {greedy_ms:.3f} ms")
