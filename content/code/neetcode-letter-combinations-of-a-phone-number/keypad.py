# Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
# Chạy: python3 keypad.py

KEYS = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
}

calls = 0


# Cách 1: quay lui với một bộ đệm ký tự, thêm rồi gỡ ở mỗi tầng.
def combine_backtrack(digits):
    result = []
    if not digits:
        return result  # chuỗi rỗng cho [], không phải [""]
    buffer = []

    def walk(index):
        global calls
        calls += 1
        if index == len(digits):
            result.append("".join(buffer))
            return
        for letter in KEYS[digits[index]]:
            buffer.append(letter)
            walk(index + 1)
            buffer.pop()

    walk(0)
    return result


# Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
def combine_iterative(digits):
    if not digits:
        return []
    layer = [""]
    for digit in digits:
        layer = [prefix + letter for prefix in layer for letter in KEYS[digit]]
    return layer


# Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
def combine_counter(digits):
    if not digits:
        return []
    sizes = [len(KEYS[d]) for d in digits]
    odometer = [0] * len(digits)
    result = []
    while True:
        result.append("".join(KEYS[digits[i]][v] for i, v in enumerate(odometer)))
        pos = len(digits) - 1
        while pos >= 0 and odometer[pos] == sizes[pos] - 1:
            odometer[pos] = 0
            pos -= 1
        if pos < 0:
            return result
        odometer[pos] += 1


CASES = [
    ("23", 9, "ad", "cf", "ad,ae,af,bd,be,bf,cd,ce,cf"),
    ("", 0, "", "", ""),
    ("2", 3, "a", "c", "a,b,c"),
    ("7", 4, "p", "s", "p,q,r,s"),
    ("9", 4, "w", "z", "w,x,y,z"),
    ("22", 9, "aa", "cc", "aa,ab,ac,ba,bb,bc,ca,cb,cc"),
    ("79", 16, "pw", "sz", None),
    ("56", 9, "jm", "lo", None),
    ("234", 27, "adg", "cfi", None),
    ("2345", 81, "adgj", "cfil", None),
    ("7999", 256, "pwww", "szzz", None),
]


def fits(got, case):
    _, count, first, last, full = case
    if len(got) != count:
        return False
    if count > 0 and (got[0] != first or got[-1] != last):
        return False
    if full is not None and ",".join(got) != full:
        return False
    return len(set(got)) == len(got)


ok = 0
for case in CASES:
    d = case[0]
    if all(fits(f(d), case) for f in (combine_backtrack, combine_iterative, combine_counter)):
        ok += 1
    else:
        print("sai ở", repr(d))
print(f"{ok}/{len(CASES)} ca đúng")

# Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
total = same = 0


def each(prefix):
    global total, same
    total += 1
    want = combine_iterative(prefix)
    if combine_backtrack(prefix) == want and combine_counter(prefix) == want:
        same += 1
    if len(prefix) < 4:
        for d in "23456789":
            each(prefix + d)


each("")
print(f"{same}/{total} ca đúng (đối chiếu tích Descartes lặp)")

calls = 0
sample = combine_backtrack("7999")
print(f"7999: {len(sample)} tổ hợp, {calls} lượt gọi quay lui")
