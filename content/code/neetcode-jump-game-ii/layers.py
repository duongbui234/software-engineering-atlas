# Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
# Chạy: python3 layers.py
import math
from collections import deque


# DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
def jump_dp(nums, counter=None):
    n = len(nums)
    best = [math.inf] * n
    best[0] = 0
    for i in range(n):
        for j in range(i + 1, min(i + nums[i], n - 1) + 1):
            if counter is not None:
                counter["ops"] += 1
            best[j] = min(best[j], best[i] + 1)
    return best[n - 1]


# BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
def jump_bfs(nums, counter=None):
    n = len(nums)
    dist = [-1] * n
    dist[0] = 0
    queue = deque([0])
    while queue:
        i = queue.popleft()
        for j in range(i + 1, min(i + nums[i], n - 1) + 1):
            if counter is not None:
                counter["ops"] += 1
            if dist[j] == -1:
                dist[j] = dist[i] + 1
                queue.append(j)
    return dist[n - 1]


# Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
def jump(nums, counter=None):
    jumps = end = far = 0
    for i in range(len(nums) - 1):  # dừng trước ô cuối
        if counter is not None:
            counter["ops"] += 1
        far = max(far, i + nums[i])
        if i == end:  # đi hết lớp hiện tại: phải nhảy thêm một bước
            jumps += 1
            end = far
    return jumps


# Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
def jump_to_last(nums):
    jumps = end = far = 0
    for i in range(len(nums)):
        far = max(far, i + nums[i])
        if i == end:
            jumps += 1
            end = far
    return jumps


# Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; -1 nếu kẹt ở ô 0
def jump_farthest_now(nums):
    pos = jumps = 0
    while pos < len(nums) - 1:
        if nums[pos] == 0:
            return -1
        pos = min(pos + nums[pos], len(nums) - 1)
        jumps += 1
    return jumps


# Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
def brute_force(nums, i=0):
    if i == len(nums) - 1:
        return 0
    best = math.inf
    for j in range(i + 1, min(i + nums[i], len(nums) - 1) + 1):
        best = min(best, 1 + brute_force(nums, j))
    return best


cases = [
    ([0], 0),
    ([5], 0),
    ([1, 1, 1, 1], 3),
    ([4, 0, 0, 0, 0], 1),
    ([3, 1, 0, 2, 0, 1], 2),
    ([2, 0, 2, 0, 1], 2),
    ([1, 2, 1, 1, 1], 3),
    ([1, 3, 0, 0, 5, 0, 0, 1], 3),
]
ok = 0
for nums, want in cases:
    got = [jump_dp(nums), jump_bfs(nums), jump(nums), brute_force(nums)]
    if all(g == want for g in got):
        ok += 1
    else:
        print("sai ở", nums, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
total = good = wrong = wrong_now = 0


def build(arr):
    global total, good, wrong, wrong_now
    if arr:
        want = brute_force(arr)
        if want != math.inf:
            total += 1
            if jump_dp(arr) == want and jump_bfs(arr) == want and jump(arr) == want:
                good += 1
            if jump_to_last(arr) != want:
                wrong += 1
            if jump_farthest_now(arr) != want:
                wrong_now += 1
    if len(arr) == 6:
        return
    for v in range(4):
        build(arr + [v])


build([])
print(f"{good}/{total} ca đúng (đối chiếu vét mọi đường nhảy)")
print(f"Cho vòng lặp chạy tới ô cuối: sai {wrong}/{total} ca, [0] cho {jump_to_last([0])} thay vì 0")
print(f"Luôn nhảy xa nhất từ chỗ đang đứng: sai {wrong_now}/{total} ca, [2,4,1,1,1,1] cho {jump_farthest_now([2, 4, 1, 1, 1, 1])} thay vì 2")

# Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
big = [1000] * 10000
dp, bfs, greedy = {"ops": 0}, {"ops": 0}, {"ops": 0}
answers = [jump_dp(big, dp), jump_bfs(big, bfs), jump(big, greedy)]
print(
    f"n = 10000, mọi ô 1000: {'/'.join(map(str, answers))} bước; "
    f"DP {dp['ops']} lượt cập nhật, BFS {bfs['ops']} cạnh, lớp nhảy {greedy['ops']} vòng"
)
