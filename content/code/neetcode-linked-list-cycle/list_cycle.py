# LC 141 Linked List Cycle: tập các nút đã thăm, rùa và thỏ (Floyd), tìm đầu vòng (LC 142), và hai bẫy của dataclass.
# Chạy: python3 list_cycle.py
from dataclasses import dataclass
from typing import Optional
import time
import tracemalloc


class ListNode:
    def __init__(self, val: int = 0):
        self.val = val
        self.next: Optional["ListNode"] = None


def build(vals, pos, cls=ListNode):
    nodes = [cls(v) for v in vals]
    for a, b in zip(nodes, nodes[1:]):
        a.next = b
    if pos >= 0 and nodes:
        nodes[-1].next = nodes[pos]
    return (nodes[0] if nodes else None), nodes


# Cách 1: set các nút đã thăm. Object thường băm theo id, nên set nhớ danh tính nút.
def has_cycle_set(head):
    seen = set()
    cur = head
    while cur:
        if cur in seen:
            return True
        seen.add(cur)
        cur = cur.next
    return False


# Cách 2: rùa và thỏ. So sánh bằng `is` (cùng một nút), không bằng `==`.
def has_cycle_floyd(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False


# LC 142: gặp nhau xong, đưa một con về đầu; cùng đi 1 bước, chỗ gặp lại là đầu vòng.
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            a = head
            while a is not slow:
                a = a.next
                slow = slow.next
            return a
    return None


# Bẫy: @dataclass mặc định eq=True, so sánh theo các trường (val, next), và đặt __hash__ = None.
@dataclass
class DataNode:
    val: int = 0
    next: Optional["DataNode"] = None


# SAI với DataNode: dùng == thay vì is. Hai nút khác nhau bị so theo (val, next), đệ quy theo next mãi trong vòng.
def floyd_eq(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False


cases = [
    ("ví dụ 1 của đề", [3, 2, 0, -4], 1, True),
    ("ví dụ 2 của đề", [1, 2], 0, True),
    ("ví dụ 3 của đề", [1], -1, False),
    ("rỗng", [], -1, False),
    ("một nút tự trỏ", [1], 0, True),
    ("giá trị trùng, không vòng", [1, 1, 1], -1, False),
    ("chẵn, không vòng", [1, 2, 3, 4, 5, 6], -1, False),
    ("lẻ, không vòng", [1, 2, 3, 4, 5], -1, False),
    ("nút cuối tự trỏ", [1, 2, 3, 4, 5], 4, True),
    ("toàn số 0, có vòng", [0, 0, 0, 0, 0], 1, True),
]


def check(name, fn, cls=ListNode):
    bad = []
    for label, vals, pos, want in cases:
        try:
            got = fn(build(vals, pos, cls)[0])
        except Exception as e:  # ghi lại loại lỗi
            got = "ném " + type(e).__name__
        if got != want:
            bad.append(f"{label} → {got}")
    outs = {b.split(" → ")[1] for b in bad}
    detail = f"; sai ở {len(bad)} ca, đều → {outs.pop()}" if len(bad) > 2 and len(outs) == 1 else ("; sai ở " + ", ".join(bad) if bad else "")
    print(f"{name:<26} {len(cases) - len(bad)}/{len(cases)} ca đúng{detail}")


check("has_cycle_set", has_cycle_set)
check("has_cycle_floyd", has_cycle_floyd)
check("has_cycle_set (DataNode)", has_cycle_set, DataNode)
check("floyd_eq (DataNode)", floyd_eq, DataNode)
check("has_cycle_floyd (DataNode)", has_cycle_floyd, DataNode)

ok = 0
for _, vals, pos, _ in cases:
    head, nodes = build(vals, pos)
    if detect_cycle(head) is (nodes[pos] if pos >= 0 else None):
        ok += 1
print(f"{'detect_cycle':<26} {ok}/{len(cases)} ca đúng (LC 142)")


def median_time(fn, reps=5):
    ts = []
    for _ in range(reps):
        t0 = time.perf_counter()
        fn()
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[reps // 2]


def set_bytes(head):
    tracemalloc.start()
    has_cycle_set(head)
    peak = tracemalloc.get_traced_memory()[1]
    tracemalloc.stop()
    return peak


print("\nn nút      dạng            set          Floyd        bộ nhớ set (đỉnh)")
for n in (100_000, 1_000_000):
    for label, pos in (("không vòng", -1), ("vòng ở giữa", n // 2)):
        head, nodes = build([0] * n, pos)
        t_set = median_time(lambda: has_cycle_set(head))
        t_floyd = median_time(lambda: has_cycle_floyd(head))
        mb = set_bytes(head) / 1e6
        print(f"{n:<10} {label:<15} {t_set:8.2f} ms  {t_floyd:8.2f} ms  {mb:8.1f} MB")
