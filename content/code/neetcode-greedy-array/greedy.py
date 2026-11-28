# Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
# Chạy: python3 greedy.py


def max_sub_array(nums):
    """Kadane: tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại."""
    run = best = nums[0]  # run: đoạn tốt nhất kết thúc tại i; best: tốt nhất tới giờ
    for x in nums[1:]:
        run = x if run < 0 else run + x  # tiền tố âm chỉ kéo tổng xuống: bỏ nó
        best = max(best, run)
    return best


def can_jump(nums):
    """Giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt."""
    reach = 0
    for i, x in enumerate(nums):
        if i > reach:
            return False  # không ô nào trước đó nhảy tới được i
        reach = max(reach, i + x)
    return True


def jump(nums):
    """Quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước."""
    jumps = end = far = 0  # end: ô cuối của lớp đang quét; far: chỗ xa nhất của lớp kế
    for i in range(len(nums) - 1):
        far = max(far, i + nums[i])
        if i == end:  # đã quét hết lớp này
            jumps += 1
            end = far
    return jumps


def can_complete_circuit(gas, cost):
    """Bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được."""
    total = tank = start = 0
    for i in range(len(gas)):
        diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if tank < 0:  # xuất phát lại từ trạm kế tiếp
            start = i + 1
            tank = 0
    return -1 if total < 0 else start


cases = [
    ("maxSubArray đoạn giữa", lambda: max_sub_array([2, -5, 4, -1, 3, -7, 2]), 6),
    ("maxSubArray toàn âm", lambda: max_sub_array([-3, -1, -2]), -1),
    ("maxSubArray một phần tử", lambda: max_sub_array([5]), 5),
    ("maxSubArray toàn dương", lambda: max_sub_array([1, 2, 3]), 6),
    ("maxSubArray vượt qua số âm", lambda: max_sub_array([-1, 4, -2, 4, -10, 3]), 6),
    ("canJump kẹt ở số 0", lambda: can_jump([2, 0, 1, 0, 3]), False),
    ("canJump tới đích", lambda: can_jump([1, 2, 0, 1, 0]), True),
    ("canJump một ô", lambda: can_jump([0]), True),
    ("canJump đứng yên", lambda: can_jump([0, 1]), False),
    ("canJump kẹt giữa đường", lambda: can_jump([3, 0, 0, 1, 0, 2]), False),
    ("jump ba bước", lambda: jump([1, 2, 0, 1, 0]), 3),
    ("jump hai bước", lambda: jump([3, 1, 1, 1, 1]), 2),
    ("jump một ô", lambda: jump([0]), 0),
    ("jump một bước", lambda: jump([4, 1, 1, 1, 1]), 1),
    ("jump từng ô", lambda: jump([1, 1, 1, 1]), 3),
    ("gas không đủ xăng", lambda: can_complete_circuit([2, 3, 4], [3, 4, 3]), -1),
    ("gas xuất phát ở trạm 3", lambda: can_complete_circuit([3, 1, 2, 5], [2, 4, 3, 1]), 3),
    ("gas một trạm", lambda: can_complete_circuit([5], [4]), 0),
    ("gas tổng bằng 0", lambda: can_complete_circuit([1, 4, 1], [2, 1, 3]), 1),
]

ok = 0
for name, run, want in cases:
    got = run()
    if got == want and type(got) is type(want):
        ok += 1
    else:
        print(f"SAI {name}: được {got}, cần {want}")
print(f"{ok}/{len(cases)} ca đúng")
