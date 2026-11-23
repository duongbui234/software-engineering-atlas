# LeetCode 21: Merge Two Sorted Lists. Chạy: python3 merge_two_lists.py
import heapq
import random
import sys
import time
from typing import Optional


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def from_list(a):
    head = None
    for v in reversed(a):
        head = ListNode(v, head)
    return head


def to_list(h):
    out = []
    while h:
        out.append(h.val)
        h = h.next
    return out


# Nút giả đứng trước đầu kết quả; "l1 or l2" nối nguyên phần còn lại.
def merge_dummy(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
    dummy = tail = ListNode()
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next, l1 = l1, l1.next
        else:
            tail.next, l2 = l2, l2.next
        tail = tail.next
    tail.next = l1 or l2
    return dummy.next


# Đệ quy: mỗi nút tốn một khung gọi hàm, giới hạn mặc định của Python là 1000 khung.
def merge_recursive(l1, l2):
    if not l1:
        return l2
    if not l2:
        return l1
    if l1.val <= l2.val:
        l1.next = merge_recursive(l1.next, l2)
        return l1
    l2.next = merge_recursive(l1, l2.next)
    return l2


# heapq.merge trộn hai dãy đã sắp (lười, ổn định), rồi dựng lại danh sách: tạo m + n nút mới.
def merge_heapq(l1, l2):
    return from_list(list(heapq.merge(to_list(l1), to_list(l2))))


CASES = [
    ([1, 2, 4], [1, 3, 4]),
    ([], []),
    ([], [0]),
    ([5], [1, 2, 3]),
    ([1, 2, 3], []),
    ([-100, 0, 100], [-100, -50]),
    ([2, 2, 2], [2, 2]),
    ([1, 5, 9], [2, 3, 4, 6, 7, 8, 10]),
]

for fn in (merge_dummy, merge_recursive, merge_heapq):
    bad = [f"{a}+{b}" for a, b in CASES if to_list(fn(from_list(a), from_list(b))) != sorted(a + b)]
    print(f"{fn.__name__:<16} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))


def rec_ok(n):
    a = from_list([2 * i for i in range(n // 2)])
    b = from_list([2 * i + 1 for i in range(n - n // 2)])
    try:
        merge_recursive(a, b)
        return True
    except RecursionError:
        return False


lo, hi = 1, 5000
while lo < hi:
    m = (lo + hi + 1) // 2
    lo, hi = (m, hi) if rec_ok(m) else (lo, m - 1)
print(f"\nđệ quy chạy được tới tổng {lo} nút (giới hạn {sys.getrecursionlimit()}); {lo + 1} nút ném RecursionError")


def bench(fn, a, b):
    ts = []
    for _ in range(5):
        x, y = from_list(a), from_list(b)
        s = time.perf_counter()
        fn(x, y)
        ts.append((time.perf_counter() - s) * 1000)
    return sorted(ts)[2]


# Dữ liệu ngẫu nhiên đã sắp; random của Python là Mersenne Twister.
random.seed(21)
print("\nm = n      dummy      heapq.merge")
for n in (10_000, 100_000, 1_000_000):
    a = sorted(random.randrange(2 * n) for _ in range(n))
    b = sorted(random.randrange(2 * n) for _ in range(n))
    print(f"{n:<9}{bench(merge_dummy, a, b):8.2f} ms {bench(merge_heapq, a, b):9.2f} ms")
