# Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
# Chạy: python3 straights.py
import time
from collections import Counter, deque


# Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
def is_straight_brute(hand, k):
    count = Counter(hand)

    def go(idx):
        while idx < len(hand) and count[hand[idx]] == 0:
            idx += 1
        if idx == len(hand):
            return True  # mọi lá đã vào nhóm
        x = hand[idx]
        for s in range(x - k + 1, x + 1):
            if any(count[v] == 0 for v in range(s, s + k)):
                continue
            for v in range(s, s + k):
                count[v] -= 1
            if go(idx):
                return True
            for v in range(s, s + k):
                count[v] += 1
        return False

    return go(0)


# Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
def is_n_straight_hand(hand, k, counter=None):
    if len(hand) % k != 0:
        return False  # dừng sớm: không chia đều được
    count = Counter(hand)
    for x in sorted(hand):
        if count[x] == 0:
            continue  # lá này đã nằm trong một nhóm trước
        for v in range(x, x + k):
            if counter is not None:
                counter["steps"] += 1
            c = count[v]  # Counter trả 0 cho khóa thiếu, không thêm khóa
            if c == 0:
                return False  # thiếu lá v để nối nhóm
            count[v] = c - 1
    return True


# Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
def is_n_straight_by_value(hand, k, counter=None):
    if len(hand) % k != 0:
        return False
    count = Counter(hand)
    for x in sorted(count):  # chỉ sắp các giá trị khác nhau
        c = count[x]
        if c == 0:
            continue
        for v in range(x, x + k):
            if counter is not None:
                counter["steps"] += 1
            have = count[v]
            if have < c:
                return False  # không đủ lá v cho c nhóm
            count[v] = have - c
    return True


# Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
def is_n_straight_open(hand, k):
    if len(hand) % k != 0:
        return False
    count = Counter(hand)
    started = deque()  # số nhóm mới mở tại từng giá trị, theo thứ tự
    open_ = 0  # số nhóm đang chờ lá kế tiếp
    prev = 0
    for x in sorted(count):
        c = count[x]
        if open_ > 0 and x != prev + 1:
            return False  # nhóm đang mở cần prev+1 mà không có
        if c < open_:
            return False  # không đủ lá x để nối mọi nhóm đang mở
        started.append(c - open_)  # phần dư mở nhóm mới tại x
        open_ = c
        if len(started) == k:
            open_ -= started.popleft()  # nhóm mở từ x-k+1 vừa đủ k lá
        prev = x
    return open_ == 0


# Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
def is_n_straight_no_sort(hand, k):
    if len(hand) % k != 0:
        return False
    count = Counter(hand)
    for x in hand:
        if count[x] == 0:
            continue
        for v in range(x, x + k):
            c = count[v]
            if c == 0:
                return False
            count[v] = c - 1
    return True


cases = [
    ([5, 1, 3, 2, 4, 6], 3, True),
    ([1, 1, 2, 2, 3, 3], 3, True),
    ([3, 2, 2, 1, 4, 3], 3, True),
    ([1, 2, 4, 5, 6, 7], 3, False),
    ([7, 8, 9, 10], 3, False),
    ([4], 1, True),
    ([3, 3, 4, 4, 5, 6], 3, False),
    ([12, 10, 11, 13, 11, 12], 3, True),
    ([1000000000, 999999998, 999999999], 3, True),
    ([0, 1, 2, 3], 2, True),
]
ok = 0
for hand, k, want in cases:
    got = [is_straight_brute(hand, k), is_n_straight_hand(hand, k), is_n_straight_by_value(hand, k), is_n_straight_open(hand, k)]
    if all(g == want for g in got):
        ok += 1
    else:
        print("sai ở", hand, k, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
total = good = wrong = 0
for mask in range(1, 4**5):
    srt = []
    m = mask
    for v in range(5):
        srt += [v] * (m % 4)
        m //= 4
    half = len(srt) // 2
    hand = srt[half:] + srt[:half]
    for k in range(1, 6):
        total += 1
        want = is_straight_brute(hand, k)
        if is_n_straight_hand(hand, k) == want and is_n_straight_by_value(hand, k) == want and is_n_straight_open(hand, k) == want:
            good += 1
        if is_n_straight_no_sort(hand, k) != want:
            wrong += 1
print(f"{good}/{total} ca đúng (đối chiếu trọng tài)")
print(f"Bỏ sắp xếp: sai {wrong}/{total} ca")

# Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
n = 200000
big = [(i * 7919) % 1000 for i in range(n)]
k_big = 10
cc = {"steps": 0}
t0 = time.perf_counter()
a = is_n_straight_hand(big, k_big, cc)
card_ms = (time.perf_counter() - t0) * 1000
vc = {"steps": 0}
t0 = time.perf_counter()
b = is_n_straight_by_value(big, k_big, vc)
value_ms = (time.perf_counter() - t0) * 1000
print(f"n = {n}, k = {k_big}, kết quả {str(a).lower()}/{str(b).lower()}: theo từng lá {cc['steps']} bước ({card_ms:.1f} ms), theo từng giá trị {vc['steps']} bước ({value_ms:.1f} ms)")
