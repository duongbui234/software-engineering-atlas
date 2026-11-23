# LC 2 Add Two Numbers: cộng từng chữ số có nhớ, đổi qua int của Python, và giới hạn 4300 chữ số khi đổi chuỗi ↔ int.
# Chạy: python3 add_two_numbers.py
import random
import sys
import time


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


def build(digits):
    head = None
    for d in reversed(digits):
        head = ListNode(d, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


# Cách chuẩn: cộng từng cặp chữ số, mang số nhớ sang nút sau. divmod trả cả thương (nhớ) lẫn dư (chữ số).
def add_digits(l1, l2):
    dummy = tail = ListNode()
    carry = 0
    while l1 or l2 or carry:
        carry, digit = divmod((l1.val if l1 else 0) + (l2.val if l2 else 0) + carry, 10)
        tail.next = tail = ListNode(digit)
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next


# Đúng nhưng vòng vèo: int của Python không giới hạn độ lớn. Đổi chuỗi ↔ int thì bị giới hạn 4300 chữ số (từ 3.11).
def via_int(l1, l2):
    to_int = lambda l: int("".join(map(str, reversed(to_list(l)))) or "0")
    return build([int(c) for c in reversed(str(to_int(l1) + to_int(l2)))])


# SAI: dừng khi hai danh sách hết, quên số nhớ cuối.
def wrong_no_final_carry(l1, l2):
    dummy = tail = ListNode()
    carry = 0
    while l1 or l2:
        carry, digit = divmod((l1.val if l1 else 0) + (l2.val if l2 else 0) + carry, 10)
        tail.next = tail = ListNode(digit)
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    return dummy.next


def reference(a, b):
    out, carry = [], 0
    for i in range(max(len(a), len(b))):
        carry, d = divmod((a[i] if i < len(a) else 0) + (b[i] if i < len(b) else 0) + carry, 10)
        out.append(d)
    if carry:
        out.append(carry)
    return out


def random_digits(rng, n):
    d = [rng.randrange(10) for _ in range(n)]
    if n > 1 and d[-1] == 0:
        d[-1] = rng.randint(1, 9)
    return d


rng = random.Random(2)
CASES = [
    ("ví dụ 1 của đề", [2, 4, 3], [5, 6, 4]),
    ("ví dụ 2", [0], [0]),
    ("ví dụ 3", [9] * 7, [9] * 4),
    ("[9,9] + [1]", [9, 9], [1]),
    ("dài lệch nhau", [1], [9, 9, 9, 9, 9, 8]),
    ("100 chữ số (giới hạn đề)", random_digits(rng, 100), random_digits(rng, 100)),
    ("5000 chữ số", random_digits(rng, 5000), random_digits(rng, 5000)),
]

for fn in (add_digits, via_int, wrong_no_final_carry):
    bad = []
    for name, a, b in CASES:
        try:
            got = to_list(fn(build(a), build(b)))
            if got != reference(a, b):
                bad.append(f"{name} → {got if len(got) < 12 else str(len(got)) + ' chữ số'}")
        except ValueError:
            bad.append(f"{name} → ném ValueError")
    print(f"{fn.__name__:<21}{len(CASES) - len(bad)}/{len(CASES)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

try:
    int("9" * 4301)
except ValueError as e:
    print(f"\nint('9' * 4301): ValueError: {str(e).split(';')[0]}")
print(f"sys.get_int_max_str_digits() = {sys.get_int_max_str_digits()}")


def bench(fn, a, b):
    ts = []
    for _ in range(5):
        l1, l2 = build(a), build(b)
        t0 = time.perf_counter()
        fn(l1, l2)
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[2]


sys.set_int_max_str_digits(0)  # bỏ giới hạn để đo cái giá của đổi chuỗi ↔ int
print("\nn chữ số   từng chữ số     qua int (đã bỏ giới hạn)")
for n in (1000, 10000, 100000):
    a, b = random_digits(rng, n), random_digits(rng, n)
    print(f"{n:<10} {bench(add_digits, a, b):8.2f} ms   {bench(via_int, a, b):9.2f} ms")
