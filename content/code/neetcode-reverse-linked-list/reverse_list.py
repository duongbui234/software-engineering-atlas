# LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
# Chạy: python3 reverse_list.py
import sys
import time
from typing import Optional


class ListNode:
    __slots__ = ("val", "next")

    def __init__(self, val: int, next: "Optional[ListNode]" = None):
        self.val = val
        self.next = next


def from_list(a):
    head = None
    for v in reversed(a):
        head = ListNode(v, head)
    return head


def to_list(head, limit=10**7):
    out = []
    while head:
        if len(out) == limit:
            return "VÒNG"
        out.append(head.val)
        head = head.next
    return out


# Lặp: giữ nxt trước khi lật cur.next.
def reverse_iterative(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev


# Đệ quy: mỗi nút một khung gọi hàm; Python mặc định dừng ở 1000 khung.
def reverse_recursive(head):
    if head is None or head.next is None:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head


# Gán bộ ba trên một dòng: vế phải được tính hết trước khi gán, nên không cần biến tạm.
def reverse_tuple(head):
    prev, cur = None, head
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    return prev


# SAI: cùng một dòng nhưng đổi thứ tự gán. cur bị gán trước, nên cur.next ở vế trái là của nút mới.
def wrong_tuple_order(head):
    prev, cur = None, head
    while cur:
        prev, cur, cur.next = cur, cur.next, prev
    return prev


cases = [[1, 2, 3, 4, 5], [1, 2], [], [1], [3, 3, 1], list(range(5000))]
names = ["ví dụ 1", "ví dụ 2", "rỗng", "một nút", "trùng giá trị", "5000 nút (giới hạn đề)"]
for fn in (reverse_iterative, reverse_recursive, reverse_tuple, wrong_tuple_order):
    bad = []
    for name, c in zip(names, cases):
        try:
            got = to_list(fn(from_list(c)), len(c) + 1)
        except RecursionError:
            got = "RecursionError"
        except AttributeError as e:
            got = "AttributeError"
        if got != c[::-1]:
            bad.append(f"{name} → {got if isinstance(got, str) else got[:5]}")
    print(f"{fn.__name__:<18} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))


def ok(n):
    try:
        reverse_recursive(from_list(range(n)))
        return True
    except RecursionError:
        return False


lo, hi = 1, 5000
while lo < hi:
    m = (lo + hi + 1) // 2
    lo, hi = (m, hi) if ok(m) else (lo, m - 1)
print(f"đệ quy sâu tối đa: {lo} nút (giới hạn {sys.getrecursionlimit()}, Python {sys.version.split()[0]})")


def bench(fn, n):
    ts = []
    for _ in range(5):
        h = from_list(range(n))
        t0 = time.perf_counter()
        fn(h)
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[2]


for n in (10**5, 10**6):
    print(f"n = {n}: lặp {bench(reverse_iterative, n):.2f} ms, gán bộ ba {bench(reverse_tuple, n):.2f} ms")
