# Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
# Chạy: python3 wildcard.py
import time


# Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
def check_brute(s, counter=None):
    buf = []

    def balanced():
        open_ = 0
        for c in buf:
            open_ += 1 if c == "(" else -1
            if open_ < 0:
                return False
        return open_ == 0

    def go(i):
        if i == len(s):
            if counter is not None:
                counter["steps"] += 1  # một cách hiểu trọn vẹn
            return balanced()
        if s[i] != "*":
            buf.append(s[i])
            r = go(i + 1)
            buf.pop()
            return r
        found = False
        for pick in (")", "", "("):
            if pick:
                buf.append(pick)
            if go(i + 1):
                found = True  # không dừng sớm: đếm đủ 3^k cách hiểu
            if pick:
                buf.pop()
        return found

    return go(0)


# DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
def check_dp(s, counter=None):
    n = len(s)
    memo = [-1] * ((n + 1) * (n + 2))  # -1: chưa tính, 0: sai, 1: đúng

    def f(i, open_):
        if open_ < 0:
            return False  # đóng nhiều hơn mở ở một tiền tố
        if i == n:
            return open_ == 0
        key = i * (n + 2) + open_
        if memo[key] != -1:
            return memo[key] == 1
        if counter is not None:
            counter["steps"] += 1  # một trạng thái mới
        c = s[i]
        if c == "(":
            r = f(i + 1, open_ + 1)
        elif c == ")":
            r = f(i + 1, open_ - 1)
        else:
            r = f(i + 1, open_ - 1) or f(i + 1, open_) or f(i + 1, open_ + 1)
        memo[key] = 1 if r else 0
        return r

    return f(0, 0)


# Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
def check_stacks(s):
    opens, stars = [], []
    for i, c in enumerate(s):
        if c == "(":
            opens.append(i)
        elif c == "*":
            stars.append(i)
        elif opens:
            opens.pop()
        elif stars:
            stars.pop()
        else:
            return False  # ")" không có gì để khớp
    while opens and stars:
        if opens.pop() > stars.pop():
            return False  # "*" đứng trước "(" thì không đóng được nó
    return not opens


# Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
def check_valid_string(s, counter=None):
    lo = 0  # số ngoặc mở ít nhất có thể
    hi = 0  # số ngoặc mở nhiều nhất có thể
    for c in s:
        if counter is not None:
            counter["steps"] += 1
        if c == "(":
            lo += 1
            hi += 1
        elif c == ")":
            lo -= 1
            hi -= 1
        else:
            lo -= 1  # "*" là ")"
            hi += 1  # "*" là "("
        if hi < 0:
            return False  # kể cả coi mọi "*" là "(" vẫn đóng thừa
        if lo < 0:
            lo = 0  # bỏ các cách hiểu làm số mở âm
    return lo == 0  # 0 nằm trong khoảng: có cách hiểu đóng hết


# Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
def check_no_clamp(s):
    lo = hi = 0
    for c in s:
        if c == "(":
            lo += 1
            hi += 1
        elif c == ")":
            lo -= 1
            hi -= 1
        else:
            lo -= 1
            hi += 1
        if hi < 0:
            return False
    return lo <= 0


cases = [
    ("*", True),
    (")", False),
    ("*(", False),
    ("(*", True),
    ("((*", False),
    ("(()*", True),
    ("*)(*", True),
    ("(*)*)(", False),
    ("**())", True),
    ("((**)", True),
]
ok = 0
for s, want in cases:
    got = [check_brute(s), check_dp(s), check_stacks(s), check_valid_string(s)]
    if all(x == want for x in got):
        ok += 1
    else:
        print("sai ở", s, got)
print(f"{ok}/{len(cases)} ca đúng")

# Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
total = good = wrong = 0


def gen(prefix):
    global total, good, wrong
    if prefix:
        total += 1
        b = check_brute(prefix)
        if check_dp(prefix) == b and check_stacks(prefix) == b and check_valid_string(prefix) == b:
            good += 1
        if check_no_clamp(prefix) != b:
            wrong += 1
    if len(prefix) == 8:
        return
    for c in "()*":
        gen(prefix + c)


gen("")
print(f"{good}/{total} ca đúng (đối chiếu vét cạn)")
print(f"Không kẹp lo: sai {wrong}/{total} ca")

# Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
big = "*" * 99 + "("
dc = {"steps": 0}
t0 = time.perf_counter()
d = check_dp(big, dc)
dp_ms = (time.perf_counter() - t0) * 1000
gc = {"steps": 0}
t0 = time.perf_counter()
g = check_valid_string(big, gc)
greedy_ms = (time.perf_counter() - t0) * 1000
js = lambda x: "true" if x else "false"
print(f"n = 100, đáp án {js(d)}/{js(g)}: DP {dc['steps']} trạng thái ({dp_ms:.2f} ms), khoảng [lo, hi] {gc['steps']} bước ({greedy_ms:.3f} ms)")

# Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
small = "*" * 12 + "("
bc = {"steps": 0}
t0 = time.perf_counter()
b = check_brute(small, bc)
brute_ms = (time.perf_counter() - t0) * 1000
print(f"n = 13, đáp án {js(b)}: vét cạn {bc['steps']} cách hiểu ({brute_ms:.1f} ms)")
