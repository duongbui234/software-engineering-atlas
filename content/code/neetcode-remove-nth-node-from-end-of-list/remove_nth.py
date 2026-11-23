# LeetCode 19: Remove Nth Node From End of List. Chạy: python3 remove_nth.py
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


# Hai lượt: đếm độ dài, rồi đi L - n bước từ nút giả.
def two_pass(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    length, p = 0, head
    while p:
        length, p = length + 1, p.next
    dummy = prev = ListNode(0, head)
    for _ in range(length - n):
        prev = prev.next
    prev.next = prev.next.next
    return dummy.next


# Một lượt: fast đi trước n + 1 bước từ nút giả, rồi hai con trỏ cùng đi.
def one_pass(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    dummy = slow = fast = ListNode(0, head)
    for _ in range(n + 1):
        fast = fast.next
    while fast:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return dummy.next


# SAI: không có nút giả; xóa chính đầu (n = L) thì fast là None.
def wrong_no_dummy(head, n):
    fast = slow = head
    for _ in range(n):
        fast = fast.next
    while fast.next:
        fast, slow = fast.next, slow.next
    slow.next = slow.next.next
    return head


CASES = [([1, 2, 3, 4, 5], 2), ([1], 1), ([1, 2], 1), ([1, 2], 2), ([1, 2, 3], 3),
         ([1, 2, 3], 1), ([5, 6, 7, 8], 3), (list(range(1, 11)), 5)]

for fn in (two_pass, one_pass, wrong_no_dummy):
    bad = []
    for a, n in CASES:
        want = [v for i, v in enumerate(a) if i != len(a) - n]
        try:
            got = to_list(fn(from_list(a), n))
        except AttributeError as e:
            got = f"AttributeError ({e})"
        if got != want:
            bad.append(f"{a} n={n} → {got}")
    print(f"{fn.__name__:<15} {len(CASES) - len(bad)}/{len(CASES)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

L = 1_000_000
values = list(range(L))


def bench(fn, n):
    ts = []
    for _ in range(5):
        h = from_list(values)
        s = time.perf_counter()
        fn(h, n)
        ts.append((time.perf_counter() - s) * 1000)
    return sorted(ts)[2]


print(f"\nthời gian, L = {L}:")
print("n          hai lượt     một lượt")
for n in (1, L // 2, L):
    print(f"{n:<10} {bench(two_pass, n):8.2f} ms {bench(one_pass, n):9.2f} ms")
