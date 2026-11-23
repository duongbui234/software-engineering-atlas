# LC 25 Reverse Nodes in k-Group: lặp với nút giả, đệ quy (vượt giới hạn đệ quy ở chính giới hạn đề), bản sai mất nối.
# Chạy: python3 reverse_k_group.py
import sys
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


def to_list(head, limit):
    out = []
    while head:
        if len(out) >= limit:
            return "vòng"
        out.append(head.val)
        head = head.next
    return out


def expected(vals, k):
    out = []
    for i in range(0, len(vals), k):
        chunk = vals[i:i + k]
        out += chunk[::-1] if len(chunk) == k else chunk
    return out


# Lặp: group_prev đứng trước nhóm; tìm nút thứ k, đảo nhóm với prev khởi đầu là nút sau nhóm.
def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            cur.next, prev, cur = prev, cur, cur.next
        old_first = group_prev.next
        group_prev.next = kth
        group_prev = old_first


# Đệ quy: sâu n/k tầng. Với k = 1 và n = 5000 (giới hạn đề) là 5000 tầng, quá giới hạn mặc định 1000.
def reverse_k_group_recursive(head, k):
    probe = head
    for _ in range(k):
        if not probe:
            return head
        probe = probe.next
    prev, cur = reverse_k_group_recursive(probe, k), head
    for _ in range(k):
        cur.next, prev, cur = prev, cur, cur.next
    return prev


# SAI: đảo nhóm với prev = None, đuôi nhóm trỏ None, mất phần còn lại.
def wrong_lose_next(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        group_next = kth.next
        prev, cur = None, group_prev.next
        while cur is not group_next:
            cur.next, prev, cur = prev, cur, cur.next
        old_first = group_prev.next
        group_prev.next = kth
        group_prev = old_first


cases = [
    ("ví dụ 1 của đề", [1, 2, 3, 4, 5], 2),
    ("ví dụ 2 của đề", [1, 2, 3, 4, 5], 3),
    ("k = 1", [1, 2, 3], 1),
    ("k = n", [1, 2, 3, 4], 4),
    ("một nút", [7], 1),
    ("hai nhóm đủ", [1, 2, 3, 4, 5, 6], 3),
    ("7 nút, k = 3", [1, 2, 3, 4, 5, 6, 7], 3),
    ("giá trị trùng", [5, 5, 6, 6, 7], 2),
    ("5000 nút, k = 1 (giới hạn đề)", list(range(5000)), 1),
]

for fn in (reverse_k_group, reverse_k_group_recursive, wrong_lose_next):
    bad = []
    for name, vals, k in cases:
        try:
            got = to_list(fn(build(vals), k), 2 * len(vals) + 2)
        except Exception as e:
            got = "ném " + type(e).__name__
        if got != expected(vals, k):
            bad.append(f"{name} → {got if isinstance(got, str) or len(got) < 12 else str(got[:6])[:-1] + ', …]'}")
    print(f"{fn.__name__:26} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))

total = ok = 0
for n in range(1, 13):
    for k in range(1, n + 1):
        total += 1
        vals = list(range(1, n + 1))
        ok += to_list(reverse_k_group(build(vals), k), 2 * n + 2) == expected(vals, k)
print(f"\nmọi n ≤ 12, mọi k ≤ n: lặp {ok}/{total}")
print(f"giới hạn đệ quy mặc định: {sys.getrecursionlimit()}")

print("\nn = 1000000 nút, k = 2, trung vị 5 lần")
ts = []
for _ in range(5):
    head = build(range(1000000))
    t0 = time.perf_counter()
    reverse_k_group(head, 2)
    ts.append((time.perf_counter() - t0) * 1000)
print(f"lặp: {sorted(ts)[2]:.2f} ms")
