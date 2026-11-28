# Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
# Chạy: python3 circuit.py
import itertools
import time


# Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
def can_complete_brute(gas, cost, counter=None):
    n = len(gas)
    for s in range(n):
        tank = 0
        ok = True
        for k in range(n):
            j = (s + k) % n
            tank += gas[j] - cost[j]
            if counter is not None:
                counter["steps"] += 1
            if tank < 0:
                ok = False  # hụt xăng trên đoạn j -> j+1
                break
        if ok:
            return s
    return -1


# Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
def can_complete_circuit(gas, cost, counter=None):
    total = 0  # tổng gas - cost của cả vòng
    tank = 0  # xăng còn lại tính từ start
    start = 0
    for i in range(len(gas)):
        d = gas[i] - cost[i]
        total += d
        tank += d
        if counter is not None:
            counter["steps"] += 1
        if tank < 0:
            start = i + 1  # không trạm nào trong [start, i] đi qua được i
            tank = 0
    return -1 if total < 0 else start  # tổng không âm thì start chắc chắn đi trọn vòng


# Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
def can_complete_prefix(gas, cost):
    prefix = 0
    lowest = 0  # tiền tố rỗng (trước trạm 0) bằng 0
    lowest_at = -1
    for i in range(len(gas)):
        prefix += gas[i] - cost[i]
        if prefix < lowest:
            lowest = prefix
            lowest_at = i
    return -1 if prefix < 0 else lowest_at + 1


# Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
def can_complete_no_total(gas, cost):
    tank = 0
    start = 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    return start


# Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
def completes(gas, cost, s):
    n = len(gas)
    if s < 0 or s >= n:
        return False
    tank = 0
    for k in range(n):
        j = (s + k) % n
        tank += gas[j] - cost[j]
        if tank < 0:
            return False
    return True


# Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
def agrees(gas, cost):
    g = can_complete_circuit(gas, cost)
    p = can_complete_prefix(gas, cost)
    b = can_complete_brute(gas, cost)
    if g != p:
        return False
    if b == -1:
        return g == -1
    return completes(gas, cost, g)


cases = [
    ([5], [5], 0),
    ([2], [3], -1),
    ([1, 6, 2], [3, 1, 4], 1),
    ([4, 0, 5, 1, 2], [2, 3, 1, 4, 2], 2),
    ([0, 0, 0, 9], [2, 2, 2, 1], 3),
    ([3, 3, 3], [3, 3, 4], -1),
    ([0, 2, 0], [1, 0, 1], 1),
]
ok = 0
for gas, cost, want in cases:
    got = [can_complete_brute(gas, cost), can_complete_circuit(gas, cost), can_complete_prefix(gas, cost)]
    if all(x == want for x in got):
        ok += 1
    else:
        print("sai ở", gas, cost, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
total = good = wrong = 0
for n in range(1, 5):
    for pairs in itertools.product(itertools.product(range(3), repeat=2), repeat=n):
        gas = [g for g, _ in pairs]
        cost = [c for _, c in pairs]
        total += 1
        if agrees(gas, cost):
            good += 1
        b = can_complete_brute(gas, cost)
        w = can_complete_no_total(gas, cost)
        if (w != -1) if b == -1 else not completes(gas, cost, w):
            wrong += 1
print(f"{good}/{total} ca đúng (đối chiếu vét cạn)")
print(f"Bỏ kiểm tra tổng: sai {wrong}/{total} ca")

# Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
n = 10000
gas = [1] * n
cost = [0] * n
cost[n - 2] = n + 1  # trạm n-2: gas 1, cost n+1, tức hụt n
gas[n - 1] = 2
bc = {"steps": 0}
t0 = time.perf_counter()
b = can_complete_brute(gas, cost, bc)
brute_ms = (time.perf_counter() - t0) * 1000
gc = {"steps": 0}
t0 = time.perf_counter()
g = can_complete_circuit(gas, cost, gc)
greedy_ms = (time.perf_counter() - t0) * 1000
print(f"n = {n}, đáp án {b}/{g}: vét cạn {bc['steps']} bước ({brute_ms:.1f} ms), tham lam {gc['steps']} bước ({greedy_ms:.2f} ms)")
