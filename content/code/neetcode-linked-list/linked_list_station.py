# Ga LINK-01: con trỏ trên danh sách liên kết. Giải 206, 21, 141, 143, 19.
# Chạy: python3 linked_list_station.py


class ListNode:
    __slots__ = ("val", "next")

    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def from_list(a):
    head = None
    for v in reversed(a):
        head = ListNode(v, head)
    return head


def to_list(head):
    out = []
    while head:
        out.append(head.val)
        head = head.next
    return out


def with_cycle(a, pos):
    head = from_list(a)
    if pos < 0 or head is None:
        return head
    nodes = []
    p = head
    while p:
        nodes.append(p)
        p = p.next
    nodes[-1].next = nodes[pos]
    return head


# 206: lật từng con trỏ.
def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next
        cur.next = prev
        prev, cur = cur, nxt
    return prev


# 21: nút giả đứng trước kết quả.
def merge_two_lists(a, b):
    dummy = tail = ListNode()
    while a and b:
        if a.val <= b.val:
            tail.next, a = a, a.next
        else:
            tail.next, b = b, b.next
        tail = tail.next
    tail.next = a or b
    return dummy.next


# 141: chậm 1 bước, nhanh 2 bước; so bằng `is` (cùng một nút), không so giá trị.
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow is fast:
            return True
    return False


# 143: tìm giữa, lật nửa sau, đan hai nửa.
def reorder_list(head):
    if head is None or head.next is None:
        return
    slow = fast = head
    while fast.next and fast.next.next:
        slow, fast = slow.next, fast.next.next
    second = reverse_list(slow.next)
    slow.next = None
    first = head
    while second:
        n1, n2 = first.next, second.next
        first.next, second.next = second, n1
        first, second = n1, n2


# 19: nút giả, con trước đi trước n + 1 bước.
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    lead = lag = dummy
    for _ in range(n + 1):
        lead = lead.next
    while lead:
        lead, lag = lead.next, lag.next
    lag.next = lag.next.next
    return dummy.next


def reordered(a):
    h = from_list(a)
    reorder_list(h)
    return to_list(h)


cases = [
    ("206 ví dụ", lambda: to_list(reverse_list(from_list([1, 2, 3, 4, 5]))), [5, 4, 3, 2, 1]),
    ("206 rỗng", lambda: to_list(reverse_list(None)), []),
    ("21 ví dụ", lambda: to_list(merge_two_lists(from_list([1, 2, 4]), from_list([1, 3, 4]))), [1, 1, 2, 3, 4, 4]),
    ("21 hai rỗng", lambda: to_list(merge_two_lists(None, None)), []),
    ("21 một rỗng", lambda: to_list(merge_two_lists(None, from_list([0]))), [0]),
    ("141 vòng về nút 1", lambda: has_cycle(with_cycle([3, 2, 0, -4], 1)), True),
    ("141 vòng về nút 0", lambda: has_cycle(with_cycle([1, 2], 0)), True),
    ("141 không vòng", lambda: has_cycle(with_cycle([1], -1)), False),
    ("143 chẵn", lambda: reordered([1, 2, 3, 4]), [1, 4, 2, 3]),
    ("143 lẻ", lambda: reordered([1, 2, 3, 4, 5]), [1, 5, 2, 4, 3]),
    ("143 một nút", lambda: reordered([1]), [1]),
    ("19 ví dụ", lambda: to_list(remove_nth_from_end(from_list([1, 2, 3, 4, 5]), 2)), [1, 2, 3, 5]),
    ("19 xóa nút duy nhất", lambda: to_list(remove_nth_from_end(from_list([1]), 1)), []),
    ("19 xóa nút đầu", lambda: to_list(remove_nth_from_end(from_list([1, 2]), 2)), [2]),
]
bad = [name for name, f, want in cases if f() != want]
print(f"linked_list_station {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))
