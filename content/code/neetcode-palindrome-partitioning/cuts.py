# Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
# Chạy: python3 cuts.py


# Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
def is_palindrome(s, lo, hi, counter):
    while lo < hi:
        counter["compares"] += 1
        if s[lo] != s[hi]:
            return False
        lo += 1
        hi -= 1
    return True


# Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
def partition_check(s, counter=None):
    counter = counter if counter is not None else {"compares": 0}
    result, path = [], []

    def walk(start):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start, len(s)):
            if not is_palindrome(s, start, end, counter):
                continue
            path.append(s[start : end + 1])
            walk(end + 1)
            path.pop()

    walk(0)
    return result


# Cách chính: dựng bảng is_pal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
def partition(s, counter=None):
    n = len(s)
    is_pal = [[False] * n for _ in range(n)]
    for i in range(n - 1, -1, -1):
        for j in range(i, n):
            if counter is not None:
                counter["compares"] += 1
            # đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
            is_pal[i][j] = s[i] == s[j] and (j - i < 2 or is_pal[i + 1][j - 1])
    result, path = [], []

    def walk(start):
        if start == n:
            result.append(path[:])  # cắt hết chuỗi: ghi một cách chia
            return
        for end in range(start, n):
            if not is_pal[start][end]:
                continue  # mảnh đầu không đối xứng: bỏ cả nhánh
            path.append(s[start : end + 1])
            walk(end + 1)
            path.pop()

    walk(0)
    return result


# Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
def brute_force(s):
    n = len(s)
    result = []
    for mask in range(1 << (n - 1)):
        parts, start = [], 0
        for gap in range(n - 1):
            if mask & (1 << gap):
                parts.append(s[start : gap + 1])
                start = gap + 1
        parts.append(s[start:])
        if all(p == p[::-1] for p in parts):
            result.append(parts)
    return result


def canonical(lst):
    return sorted("/".join(p) for p in lst)


def check(s, expected):
    want = canonical(expected if expected is not None else brute_force(s))
    for got in (partition(s), partition_check(s)):
        if len({tuple(p) for p in got}) != len(got):
            return False
        if canonical(got) != want:
            return False
    return True


cases = [
    ("x", [["x"]]),
    ("noon", [["n", "o", "o", "n"], ["n", "oo", "n"], ["noon"]]),
    ("abc", [["a", "b", "c"]]),
    ("aaaa", None),
    ("level", None),
    ("racecar", None),
    ("abcdefghijklmnop", [list("abcdefghijklmnop")]),
    ("a" * 16, None),
]
ok = 0
for s, expected in cases:
    if check(s, expected):
        ok += 1
    else:
        print("sai ở", s)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
total = good = 0


def build(s):
    global total, good
    if s:
        total += 1
        if check(s, None):
            good += 1
    if len(s) == 9:
        return
    build(s + "a")
    build(s + "b")


build("")
print(f"{good}/{total} ca đúng (đối chiếu vét mọi cách đặt vết cắt)")

sixteen = "a" * 16
via_check = {"compares": 0}
count = len(partition_check(sixteen, via_check))
via_table = {"compares": 0}
partition(sixteen, via_table)
print(
    f"16 chữ a: {count} cách chia; kiểm tra lại mỗi lần {via_check['compares']} phép so, "
    f"bảng isPal {via_table['compares']} phép so"
)
