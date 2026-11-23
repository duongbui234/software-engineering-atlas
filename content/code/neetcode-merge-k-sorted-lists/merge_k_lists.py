# LC 23 Merge k Sorted Lists: heapq với bộ (val, i, node), chia để trị, và bẫy so sánh ListNode khi hai val bằng nhau.
# Chạy: python3 merge_k_lists.py
import heapq
import random
import time


class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def build(vals):
    head = None
    for v in reversed(vals):
        head = ListNode(v, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


def merge_two(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next


# Heap k đầu danh sách. Phần tử heap là (val, i, node): i phá hòa khi hai val bằng nhau,
# nên Python không bao giờ phải so hai ListNode.
def merge_heap(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()
    while heap:
        _, i, node = heapq.heappop(heap)
        tail.next = tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next


# Chia để trị: trộn từng cặp, mỗi vòng số danh sách giảm một nửa.
def merge_divide(lists):
    if not lists:
        return None
    cur = list(lists)
    while len(cur) > 1:
        cur = [merge_two(cur[i], cur[i + 1]) if i + 1 < len(cur) else cur[i] for i in range(0, len(cur), 2)]
    return cur[0]


# Gom rồi sắp: ngắn nhất, sorted() viết bằng C nên thường nhanh trong Python.
def merge_collect_sort(lists):
    vals = []
    for node in lists:
        while node:
            vals.append(node.val)
            node = node.next
    return build(sorted(vals))


# SAI: phần tử heap là (val, node). Hai val bằng nhau thì Python so tiếp hai ListNode và ném TypeError.
def merge_heap_no_index(lists):
    heap = [(node.val, node) for node in lists if node]
    heapq.heapify(heap)
    dummy = tail = ListNode()
    while heap:
        _, node = heapq.heappop(heap)
        tail.next = tail = node
        if node.next:
            heapq.heappush(heap, (node.next.val, node.next))
    return dummy.next


cases = [
    ("ví dụ của đề", [[1, 4, 5], [1, 3, 4], [2, 6]]),
    ("không có danh sách", []),
    ("một danh sách rỗng", [[]]),
    ("rỗng xen kẽ", [[], [1], [], [0, 2]]),
    ("một danh sách", [[1, 2, 3]]),
    ("số âm", [[-10, -5, 0], [-3, 10]]),
    ("9 và 10", [[9], [10], [2]]),
    ("20 danh sách 1 phần tử", [[(i * 7) % 20] for i in range(20)]),
    ("trùng hết", [[5, 5], [5], [5, 5, 5]]),
]

for fn in (merge_heap, merge_divide, merge_collect_sort, merge_heap_no_index):
    bad = []
    for name, inp in cases:
        try:
            got = to_list(fn([build(l) for l in inp]))
        except Exception as e:
            got = "ném " + type(e).__name__
        if got != sorted(v for l in inp for v in l):
            bad.append(f"{name} → {got}")
    print(f"{fn.__name__:20} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))


def make_input(n, k, seed):
    rnd = random.Random(seed)
    per = n // k
    return [sorted(rnd.randint(-10000, 10000) for _ in range(per)) for _ in range(k)]


def time_it(fn, inp, reps=5):
    ts = []
    for _ in range(reps):
        lists = [build(l) for l in inp]
        t0 = time.perf_counter()
        fn(lists)
        ts.append((time.perf_counter() - t0) * 1000)
    return sorted(ts)[reps // 2]


print("\nN = 100000 nút, trung vị 5 lần (ms)")
print("k          gom+sắp     heap   chia đôi")
for k in (10, 1000, 10000):
    inp = make_input(100000, k, k)
    print(f"{k:<8} " + " ".join(f"{time_it(fn, inp):9.2f}" for fn in (merge_collect_sort, merge_heap, merge_divide)))
