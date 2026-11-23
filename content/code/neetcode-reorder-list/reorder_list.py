# LC 143 Reorder List: ba bước, deque các nút, và hai bẫy của Python (gán nhiều biến một lúc, gán lại head).
# Chạy: python3 reorder_list.py
from collections import deque
import time
import tracemalloc


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build(vals):
    head = None
    for v in reversed(vals):
        head = ListNode(v, head)
    return head


def to_list(head, limit):
    out = []
    while head:
        if len(out) >= limit:
            return "vòng"
        out.append(head.val)
        head = head.next
    return out


def expected(vals):
    out, i, j = [], 0, len(vals) - 1
    while i <= j:
        out.append(vals[i])
        if i != j:
            out.append(vals[j])
        i += 1
        j -= 1
    return out


# Đảo tại chỗ. Vế phải được tính hết trước, rồi gán từ trái sang phải: cur.next phải đứng đầu.
def reverse(head):
    prev, cur = None, head
    while cur:
        cur.next, prev, cur = prev, cur, cur.next
    return prev


# Cách 1: tìm giữa, cắt, đảo nửa sau, đan xen. O(1) bộ nhớ thêm.
def reorder_three_steps(head):
    if not head or not head.next:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second = reverse(slow.next)
    slow.next = None
    first = head
    while second:
        n1, n2 = first.next, second.next
        first.next, second.next = second, n1
        first, second = n1, n2


# Cách 2: deque các nút, lần lượt lấy đầu rồi lấy cuối. O(n) bộ nhớ thêm.
def reorder_deque(head):
    dq = deque()
    cur = head
    while cur:
        dq.append(cur)
        cur = cur.next
    tail = None
    take_left = True
    while dq:
        node = dq.popleft() if take_left else dq.pop()
        if tail:
            tail.next = node
        tail = node
        take_left = not take_left
    if tail:
        tail.next = None


# SAI: đảo với thứ tự gán sai. prev = cur, cur = cur.next chạy trước, rồi cur.next = prev gán vào nút MỚI.
def reverse_wrong_order(head):
    prev, cur = None, head
    steps = 0
    while cur and steps < 100:
        prev, cur, cur.next = cur, cur.next, prev
        steps += 1
    return prev


def reorder_wrong_reverse(head):
    if not head or not head.next:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second = reverse_wrong_order(slow.next)
    slow.next = None
    first = head
    while second:
        n1, n2 = first.next, second.next
        first.next, second.next = second, n1
        first, second = n1, n2


# SAI: dựng danh sách mới rồi gán lại head. Đề đòi sửa tại chỗ; gán head trong hàm không đổi danh sách của người gọi.
def reorder_rebind(head):
    vals = to_list(head, 10**9)
    head = build(expected(vals))


cases = [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3], [], [10, 20, 30, 40, 50, 60], [7, 7, 7, 8, 8]]
for fn in (reorder_three_steps, reorder_deque, reorder_wrong_reverse, reorder_rebind):
    bad = []
    for vals in cases:
        head = build(vals)
        try:
            fn(head)
            got = to_list(head, 2 * len(vals) + 2)
        except Exception as e:
            got = "ném " + type(e).__name__
        if got != expected(vals):
            bad.append(f"{vals} → {got}")
    outs = {b.split(" → ")[1] for b in bad}
    if len(bad) > 2 and len(outs) == 1:
        detail = f"; sai ở {len(bad)} ca, đều → {outs.pop()}"
    elif len(bad) > 2:
        detail = f"; sai ở {len(bad)} ca, ví dụ " + ", ".join(bad[:2])
    else:
        detail = "; sai ở " + ", ".join(bad) if bad else ""
    print(f"{fn.__name__:<22} {len(cases) - len(bad)}/{len(cases)} ca đúng{detail}")


def bench(fn, n):
    ts, peak = [], 0
    for _ in range(5):
        head = build(list(range(n)))
        tracemalloc.start()
        t0 = time.perf_counter()
        fn(head)
        ts.append((time.perf_counter() - t0) * 1000)
        peak = max(peak, tracemalloc.get_traced_memory()[1])
        tracemalloc.stop()
    return sorted(ts)[2], peak / 1e6


print("\nn nút      ba bước               deque các nút")
for n in (100_000, 1_000_000):
    a, b = bench(reorder_three_steps, n), bench(reorder_deque, n)
    print(f"{n:<10} {a[0]:8.2f} ms {a[1]:6.2f} MB  {b[0]:8.2f} ms {b[1]:6.2f} MB")
