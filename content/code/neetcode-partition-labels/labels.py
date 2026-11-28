# Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
# Chạy: python3 labels.py
import time


# Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
def partition_brute(s, counter=None):
    n = len(s)
    sizes = []
    prev = -1  # vết cắt an toàn gần nhất
    for i in range(n):
        left = [False] * 26
        right = [False] * 26
        for j in range(i + 1):
            left[ord(s[j]) - 97] = True
        for j in range(i + 1, n):
            right[ord(s[j]) - 97] = True
        if counter is not None:
            counter["steps"] += n
        if not any(left[c] and right[c] for c in range(26)):
            sizes.append(i - prev)  # cắt ở mọi chỗ an toàn
            prev = i
    return sizes


# Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
def partition_intervals(s):
    first = {}
    last = {}
    for i, ch in enumerate(s):
        first.setdefault(ch, i)
        last[ch] = i
    spans = sorted((first[ch], last[ch]) for ch in first)
    sizes = []
    lo, hi = spans[0]
    for a, b in spans[1:]:
        if a > hi:
            sizes.append(hi - lo + 1)  # khoảng mới không chạm khoảng đang gộp: chốt một phần
            lo, hi = a, b
        else:
            hi = max(hi, b)
    sizes.append(hi - lo + 1)
    return sizes


# Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
def partition_labels(s, counter=None):
    last = {ch: i for i, ch in enumerate(s)}  # gán đè: giữ lại lần cuối
    if counter is not None:
        counter["steps"] += len(s)
    sizes = []
    start = 0
    end = 0  # phần hiện tại phải kéo ít nhất tới đây
    for i, ch in enumerate(s):
        end = max(end, last[ch])
        if counter is not None:
            counter["steps"] += 1
        if i == end:
            sizes.append(end - start + 1)  # mọi chữ trong phần đã hết: cắt sớm nhất có thể
            start = i + 1
    return sizes


# Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
def partition_no_max(s):
    last = {ch: i for i, ch in enumerate(s)}
    sizes = []
    start = 0
    for i, ch in enumerate(s):
        if last[ch] == i:
            sizes.append(i - start + 1)
            start = i + 1
    return sizes


cases = [
    ("a", [1]),
    ("abc", [1, 1, 1]),
    ("aaaa", [4]),
    ("abca", [4]),
    ("abbacdc", [4, 3]),
    ("xyzzyxw", [6, 1]),
    ("aabbccab", [8]),
    ("qwqeer", [3, 2, 1]),
]
ok = 0
for s, want in cases:
    got = [partition_brute(s), partition_intervals(s), partition_labels(s)]
    if all(x == want for x in got):
        ok += 1
    else:
        print("sai ở", s, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
total = good = wrong = 0


def walk(s):
    global total, good, wrong
    if s:
        total += 1
        b = partition_brute(s)
        if b == partition_intervals(s) == partition_labels(s):
            good += 1
        if b != partition_no_max(s):
            wrong += 1
    if len(s) == 7:
        return
    for ch in "abc":
        walk(s + ch)


walk("")
print(f"{good}/{total} ca đúng (đối chiếu vét cạn)")
print(f"Cắt khi chữ hiện tại hết (bỏ max): sai {wrong}/{total} ca")

# Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
n = 10000
big = "".join(chr(97 + 5 * (i // 2000) + (i * 3) % 5) for i in range(n))
bc = {"steps": 0}
t0 = time.perf_counter()
b = partition_brute(big, bc)
brute_ms = (time.perf_counter() - t0) * 1000
gc = {"steps": 0}
t0 = time.perf_counter()
g = partition_labels(big, gc)
greedy_ms = (time.perf_counter() - t0) * 1000
print(f"n = {n}, {len(g)} phần ({'khớp' if b == g else 'lệch'}): vét cạn {bc['steps']} bước ({brute_ms:.1f} ms), tham lam {gc['steps']} bước ({greedy_ms:.2f} ms)")
