# Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
# Chạy: python3 triplets.py
import time


# Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
def merge_triplets_brute(triplets, target, counter=None):
    n = len(triplets)
    steps = 0
    found = False
    for mask in range(1, 1 << n):
        a = b = c = 0
        for i in range(n):
            steps += 1
            if (mask >> i) & 1:
                t = triplets[i]
                a = max(a, t[0])
                b = max(b, t[1])
                c = max(c, t[2])
        if a == target[0] and b == target[1] and c == target[2]:
            found = True
            break
    if counter is not None:
        counter["steps"] += steps
    return found


# Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
def merge_triplets(triplets, target, counter=None):
    x, y, z = target
    found = [False, False, False]
    for t in triplets:
        if counter is not None:
            counter["steps"] += 1
        if t[0] > x or t[1] > y or t[2] > z:
            continue  # bộ không an toàn: gộp vào là vượt, không gỡ được
        for k in range(3):
            if t[k] == target[k]:
                found[k] = True  # bộ an toàn này mang đúng giá trị cần ở vị trí k
    return all(found)


# Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
def merge_triplets_max(triplets, target):
    m = [0, 0, 0]
    for t in triplets:
        if t[0] > target[0] or t[1] > target[1] or t[2] > target[2]:
            continue
        m = [max(m[k], t[k]) for k in range(3)]
    return m == list(target)


# Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
def merge_triplets_no_filter(triplets, target):
    found = [False, False, False]
    for t in triplets:
        for k in range(3):
            if t[k] == target[k]:
                found[k] = True
    return all(found)


cases = [
    ([[1, 2, 3]], [1, 2, 3], True),
    ([[2, 9, 5], [1, 7, 1]], [2, 7, 5], False),
    ([[3, 1, 1], [1, 4, 1], [1, 1, 6]], [3, 4, 6], True),
    ([[3, 4, 6], [5, 1, 1]], [3, 4, 6], True),
    ([[1, 1, 1], [2, 2, 2]], [3, 3, 3], False),
    ([[4, 2, 1], [1, 2, 4], [4, 4, 4]], [4, 2, 4], True),
    ([[2, 3, 4], [2, 3, 4]], [2, 3, 5], False),
]
ok = 0
for triplets, target, want in cases:
    got = [merge_triplets_brute(triplets, target), merge_triplets(triplets, target), merge_triplets_max(triplets, target)]
    if all(v == want for v in got):
        ok += 1
    else:
        print("sai ở", triplets, target, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
values = [[a, b, c] for a in range(1, 4) for b in range(1, 4) for c in range(1, 4)]
target = [2, 2, 2]
total = good = wrong = 0
lst = []


def build():
    global total, good, wrong
    if lst:
        total += 1
        b = merge_triplets_brute(lst, target)
        if merge_triplets(lst, target) == b and merge_triplets_max(lst, target) == b:
            good += 1
        if merge_triplets_no_filter(lst, target) != b:
            wrong += 1
    if len(lst) == 4:
        return
    for v in values:
        lst.append(v)
        build()
        lst.pop()


build()
print(f"{good}/{total} ca đúng (đối chiếu vét cạn)")
print(f"Bỏ bước lọc: sai {wrong}/{total} ca")

# Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
small = [[1000 if i == 0 else i + 1, 1000 if i == 1 else i + 1, i + 1] for i in range(18)]
big = [1000, 1000, 1000]
bc = {"steps": 0}
t0 = time.perf_counter()
rb = merge_triplets_brute(small, big, bc)
brute_ms = (time.perf_counter() - t0) * 1000
gc = {"steps": 0}
t0 = time.perf_counter()
rg = merge_triplets(small, big, gc)
greedy_ms = (time.perf_counter() - t0) * 1000
print(f"n = 18, đáp án {str(rb).lower()}/{str(rg).lower()}: vét cạn {bc['steps']} bước ({brute_ms:.1f} ms), tham lam {gc['steps']} bước ({greedy_ms:.3f} ms)")

# Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
full = [[(7 * i) % 1000 + 1, (13 * i) % 1000 + 1, (31 * i) % 1000 + 1] for i in range(100000)]
goal = [700, 800, 900]
fc = {"steps": 0}
t0 = time.perf_counter()
rf = merge_triplets(full, goal, fc)
full_ms = (time.perf_counter() - t0) * 1000
print(f"n = 100000, đáp án {str(rf).lower()}: tham lam {fc['steps']} bước ({full_ms:.2f} ms)")
