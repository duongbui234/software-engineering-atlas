# LC 138 Copy List with Random Pointer: dict cũ → mới, đan nút, copy.deepcopy, và nút @dataclass không băm được.
# Chạy: python3 copy_random_list.py
import copy
import random
import sys
import time
import tracemalloc
from dataclasses import dataclass


class Node:
    def __init__(self, val, next=None, random=None):
        self.val, self.next, self.random = val, next, random


def build(spec, cls=Node):
    nodes = [cls(v) for v, _ in spec]
    for i, (_, r) in enumerate(spec):
        nodes[i].next = nodes[i + 1] if i + 1 < len(nodes) else None
        nodes[i].random = None if r is None else nodes[r]
    return nodes[0] if nodes else None


def to_spec(head):
    nodes, cur = [], head
    while cur is not None and len(nodes) <= 100000:
        nodes.append(cur)
        cur = cur.next
    index = {id(n): i for i, n in enumerate(nodes)}
    return [[n.val, None if n.random is None else index.get(id(n.random), -1)] for n in nodes]


# Cách 1: dict nút cũ → nút mới, hai lượt. Khóa là chính object nút: Node thường băm theo danh tính (id).
def copy_two_pass(head):
    m = {}
    cur = head
    while cur:
        m[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        m[cur].next = m.get(cur.next)
        m[cur].random = m.get(cur.random)
        cur = cur.next
    return m.get(head)


# Cách 3: đan bản sao sau nút gốc, đặt random, tách ra. O(1) bộ nhớ thêm.
def copy_interleave(head):
    if head is None:
        return None
    cur = head
    while cur:
        cur.next = Node(cur.val, cur.next)
        cur = cur.next.next
    cur = head
    while cur:
        cur.next.random = cur.random.next if cur.random else None
        cur = cur.next.next
    new_head = head.next
    cur = head
    while cur:
        c = cur.next
        cur.next = c.next
        c.next = c.next.next if c.next else None
        cur = cur.next
    return new_head


# copy.deepcopy tự sao chép cả đồ thị, nhớ object đã chép trong một dict (memo) nên vòng và chỗ dùng chung vẫn đúng.
def copy_deepcopy(head):
    return copy.deepcopy(head)


# Nút viết bằng @dataclass: eq=True mặc định sinh __eq__ và đặt __hash__ = None, nên không làm khóa dict được.
@dataclass
class DataNode:
    val: int
    next: "DataNode | None" = None
    random: "DataNode | None" = None


def copy_two_pass_dataclass(head):
    m = {}
    cur = head
    while cur:
        m[cur] = DataNode(cur.val)
        cur = cur.next
    cur = head
    while cur:
        m[cur].next = m.get(cur.next)
        m[cur].random = m.get(cur.random)
        cur = cur.next
    return m.get(head)


def check(fn, spec, cls=Node):
    head = build(spec, cls)
    originals = set()
    cur = head
    while cur:
        originals.add(id(cur))
        cur = cur.next
    try:
        c = fn(head)
    except Exception as e:
        return "ném " + type(e).__name__
    cur = c
    while cur:
        if id(cur) in originals or (cur.random is not None and id(cur.random) in originals):
            return "dùng chung nút với danh sách gốc"
        cur = cur.next
    if to_spec(c) != [list(x) for x in spec]:
        return "sai cấu trúc"
    if to_spec(head) != [list(x) for x in spec]:
        return "danh sách gốc bị đổi"
    return None


CASES = [
    ("ví dụ 1 của đề", [(7, None), (13, 0), (11, 4), (10, 2), (1, 0)]),
    ("ví dụ 2", [(1, 1), (2, 1)]),
    ("ví dụ 3 (giá trị trùng)", [(3, None), (3, 0), (3, None)]),
    ("rỗng", []),
    ("một nút tự trỏ", [(5, 0)]),
    ("mọi random null", [(1, None), (2, None), (3, None)]),
    ("mọi random trỏ nút cuối", [(1, 3), (2, 3), (3, 3), (4, 3)]),
]

for name, fn, cls in [("copy_two_pass", copy_two_pass, Node), ("copy_interleave", copy_interleave, Node),
                      ("copy_deepcopy", copy_deepcopy, Node), ("copy_two_pass (DataNode)", copy_two_pass_dataclass, DataNode)]:
    bad = [f"{c} → {err}" for c, spec in CASES if (err := check(fn, spec, cls)) is not None]
    print(f"{name:<25}{len(CASES) - len(bad)}/{len(CASES)} ca đúng" + (f"; sai ở {len(bad)} ca, đầu tiên: {bad[0]}" if bad else ""))

# deepcopy đệ quy theo next: danh sách dài vượt giới hạn đệ quy. Tìm độ dài lớn nhất bằng chia đôi.
def deepcopy_ok(n):
    try:
        copy.deepcopy(build([(i, None) for i in range(n)]))
        return True
    except RecursionError:
        return False

lo, hi = 1, 5000
while lo < hi:
    mid = (lo + hi + 1) // 2
    lo, hi = (mid, hi) if deepcopy_ok(mid) else (lo, mid - 1)
print(f"\ncopy.deepcopy chép được danh sách dài tối đa {lo} nút (giới hạn đệ quy {sys.getrecursionlimit()}); dài hơn thì ném RecursionError")


def bench(fn, spec):
    ts, peak = [], 0
    for _ in range(5):
        head = build(spec)
        tracemalloc.start()
        t0 = time.perf_counter()
        fn(head)
        ts.append((time.perf_counter() - t0) * 1000)
        peak = max(peak, tracemalloc.get_traced_memory()[1] / 1e6)
        tracemalloc.stop()
    return sorted(ts)[2], peak


rng = random.Random(138)
print("\nn nút      hai lượt (dict)        đan nút                deepcopy")
for n in (200, 100000):
    spec = [(rng.randint(-10000, 10000), None if rng.random() < 0.2 else rng.randrange(n)) for _ in range(n)]
    cells = []
    for fn in (copy_two_pass, copy_interleave, copy_deepcopy):
        if fn is copy_deepcopy and n > lo:
            cells.append("     RecursionError     ")
            continue
        ms, mb = bench(fn, spec)
        cells.append(f"{ms:9.2f} ms {mb:6.2f} MB")
    print(f"{n:<10} {'   '.join(cells)}")
