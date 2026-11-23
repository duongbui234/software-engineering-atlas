# LeetCode 1046, Last Stone Weight: heapq với mẹo đổi dấu, quên đổi dấu, và đếm theo cân nặng.
# Chạy: python3 last_stone.py
import heapq, random, time


# heapq chỉ có min-heap: lưu -s thì viên nặng nhất nằm ở đỉnh.
def last_stone_weight(stones):
    h = [-s for s in stones]
    heapq.heapify(h)  # O(n), không phải O(n log n)
    while len(h) > 1:
        y = -heapq.heappop(h)
        x = -heapq.heappop(h)
        if y > x:
            heapq.heappush(h, -(y - x))
    return -h[0] if h else 0


# SAI: quên đổi dấu, heapq lấy ra hai viên NHẸ nhất.
def forgot_negate(stones):
    h = list(stones)
    heapq.heapify(h)
    while len(h) > 1:
        x = heapq.heappop(h)
        y = heapq.heappop(h)
        if y > x:
            heapq.heappush(h, y - x)
    return h[0] if h else 0


# Sắp xếp lại mỗi lượt. Đúng, O(n² log n).
def sort_each_round(stones):
    s = list(stones)
    while len(s) > 1:
        s.sort()
        y, x = s.pop(), s.pop()
        if y > x:
            s.append(y - x)
    return s[0] if s else 0


# Đếm theo cân nặng (<= 1000): cặp bằng nhau triệt tiêu, chỉ cần cnt[w] % 2.
def counting(stones, max_w=1000):
    cnt = [0] * (max_w + 1)
    for s in stones:
        cnt[s] += 1
    i = max_w
    while True:
        while i > 0 and cnt[i] == 0:
            i -= 1
        if i == 0:
            return 0
        cnt[i] %= 2
        if cnt[i] == 0:
            continue
        j = i - 1
        while j > 0 and cnt[j] == 0:
            j -= 1
        if j == 0:
            return i
        cnt[i] = 0
        cnt[j] -= 1
        cnt[i - j] += 1
        i = max(j, i - j)


cases = [([2, 7, 4, 1, 8, 1], 1), ([1], 1), ([2, 2], 0), ([3, 3, 3], 3), ([10, 4, 2, 10], 2),
         ([10, 2, 9], 1), ([1000, 1], 999), ([7, 6, 7, 6, 9], 3), ([31, 26, 33, 21, 40], 9)]
for fn in (last_stone_weight, sort_each_round, counting, forgot_negate):
    bad = [f"{s} → {fn(s)}" for s, want in cases if fn(s) != want]
    print(f"{fn.__name__:<18} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))

random.seed(7)
s = [random.randint(1, 1000) for _ in range(10**5)]
for fn in (last_stone_weight, counting):
    ts = []
    for _ in range(5):
        t0 = time.perf_counter(); fn(s); ts.append(time.perf_counter() - t0)
    print(f"n = 10⁵: {fn.__name__:<18} {sorted(ts)[2] * 1000:.1f} ms")
