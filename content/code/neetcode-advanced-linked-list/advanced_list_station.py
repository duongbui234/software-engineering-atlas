# Ga LINK-02: danh sách liên kết nâng cao. Giải 138, 2, 287, 146, 23, 25.
# Chạy: python3 advanced_list_station.py


class ListNode:
    def __init__(self, val=0, next=None):
        self.val, self.next = val, next


class RNode:
    def __init__(self, val):
        self.val, self.next, self.random = val, None, None


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


# 138: chèn bản sao sau mỗi nút, nối random qua bản sao, rồi tách hai danh sách.
def copy_random_list(head):
    p = head
    while p:
        c = RNode(p.val)
        c.next, p.next = p.next, c
        p = c.next
    p = head
    while p:
        p.next.random = p.random.next if p.random else None
        p = p.next.next
    dummy = tail = RNode(0)
    p = head
    while p:
        c = p.next
        p.next = c.next
        tail.next = c
        tail = c
        p = p.next
    return dummy.next


# 2: cộng từng chữ số, mang số nhớ sang nút sau.
def add_two_numbers(a, b):
    dummy = tail = ListNode()
    carry = 0
    while a or b or carry:
        s = (a.val if a else 0) + (b.val if b else 0) + carry
        carry, digit = divmod(s, 10)
        tail.next = ListNode(digit)
        tail = tail.next
        a = a.next if a else None
        b = b.next if b else None
    return dummy.next


# 287: i → nums[i] là con trỏ next; số trùng là đầu vòng.
def find_duplicate(nums):
    slow = fast = 0
    while True:
        slow, fast = nums[slow], nums[nums[fast]]
        if slow == fast:
            break
    p = 0
    while p != slow:
        p, slow = nums[p], nums[slow]
    return p


# 146: dict tra key → nút; danh sách hai chiều có hai nút canh.
class DNode:
    __slots__ = ("key", "val", "prev", "next")

    def __init__(self, key=0, val=0):
        self.key, self.val, self.prev, self.next = key, val, None, None


class LRUCache:
    def __init__(self, capacity):
        self.cap, self.map = capacity, {}
        self.head, self.tail = DNode(), DNode()
        self.head.next, self.tail.prev = self.tail, self.head

    def _unlink(self, n):
        n.prev.next, n.next.prev = n.next, n.prev

    def _push_front(self, n):
        n.prev, n.next = self.head, self.head.next
        self.head.next.prev = n
        self.head.next = n

    def get(self, key):
        n = self.map.get(key)
        if n is None:
            return -1
        self._unlink(n)
        self._push_front(n)
        return n.val

    def put(self, key, val):
        n = self.map.get(key)
        if n is not None:
            n.val = val
            self._unlink(n)
            self._push_front(n)
            return
        if len(self.map) == self.cap:
            old = self.tail.prev
            self._unlink(old)
            del self.map[old.key]
        n = DNode(key, val)
        self.map[key] = n
        self._push_front(n)


# 23: trộn từng cặp, mỗi vòng số danh sách giảm một nửa.
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


def merge_k_lists(lists):
    if not lists:
        return None
    while len(lists) > 1:
        lists = [merge_two(lists[i], lists[i + 1]) if i + 1 < len(lists) else lists[i]
                 for i in range(0, len(lists), 2)]
    return lists[0]


# 25: đủ k nút thì lật khúc đó và nối lại.
def reverse_k_group(head, k):
    dummy = ListNode(0, head)
    group_prev = dummy
    while True:
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if kth is None:
                return dummy.next
        group_next = kth.next
        prev, cur = group_next, group_prev.next
        while cur is not group_next:
            cur.next, prev, cur = prev, cur, cur.next
        first = group_prev.next
        group_prev.next = kth
        group_prev = first


def build_random(spec):
    nodes = [RNode(v) for v, _ in spec]
    for i, (n, (_, r)) in enumerate(zip(nodes, spec)):
        n.next = nodes[i + 1] if i + 1 < len(nodes) else None
        n.random = None if r is None else nodes[r]
    return nodes[0] if nodes else None


def describe_random(head):
    idx, i, p = {}, 0, head
    while p:
        idx[id(p)] = i
        i, p = i + 1, p.next
    out, p = [], head
    while p:
        out.append(f"{p.val}:{idx[id(p.random)] if p.random else None}")
        p = p.next
    return ",".join(out)


def shares_node(a, b):
    s = set()
    while a:
        s.add(id(a))
        a = a.next
    while b:
        if id(b) in s:
            return True
        b = b.next
    return False


def run_lru(cap, ops):
    c, out = LRUCache(cap), []
    for op in ops:
        if op[0] == "get":
            out.append(c.get(op[1]))
        else:
            c.put(op[1], op[2])
    return out


def check_138():
    h = build_random([(7, None), (13, 0), (11, 4), (10, 2), (1, 0)])
    before = describe_random(h)
    c = copy_random_list(h)
    return describe_random(c) == before and describe_random(h) == before and not shares_node(h, c)


checks = [
    ("138 ví dụ của đề", check_138),
    ("138 danh sách rỗng", lambda: copy_random_list(None) is None),
    ("2 ví dụ của đề", lambda: to_list(add_two_numbers(from_list([2, 4, 3]), from_list([5, 6, 4]))) == [7, 0, 8]),
    ("2 hai số 0", lambda: to_list(add_two_numbers(from_list([0]), from_list([0]))) == [0]),
    ("2 nhớ tới cuối", lambda: to_list(add_two_numbers(from_list([9] * 7), from_list([9] * 4))) == [8, 9, 9, 9, 0, 0, 0, 1]),
    ("287 [1,3,4,2,2]", lambda: find_duplicate([1, 3, 4, 2, 2]) == 2),
    ("287 [3,1,3,4,2]", lambda: find_duplicate([3, 1, 3, 4, 2]) == 3),
    ("287 [3,3,3,3,3]", lambda: find_duplicate([3, 3, 3, 3, 3]) == 3),
    ("146 ví dụ của đề", lambda: run_lru(2, [("put", 1, 1), ("put", 2, 2), ("get", 1), ("put", 3, 3), ("get", 2),
                                             ("put", 4, 4), ("get", 1), ("get", 3), ("get", 4)]) == [1, -1, -1, 3, 4]),
    ("146 cập nhật key cũ", lambda: run_lru(2, [("put", 2, 1), ("put", 1, 1), ("put", 2, 3), ("put", 4, 1),
                                                ("get", 1), ("get", 2)]) == [-1, 3]),
    ("23 ví dụ của đề", lambda: to_list(merge_k_lists([from_list(x) for x in [[1, 4, 5], [1, 3, 4], [2, 6]]])) == [1, 1, 2, 3, 4, 4, 5, 6]),
    ("23 không có danh sách", lambda: merge_k_lists([]) is None),
    ("23 một danh sách rỗng", lambda: merge_k_lists([None]) is None),
    ("25 k = 2", lambda: to_list(reverse_k_group(from_list([1, 2, 3, 4, 5]), 2)) == [2, 1, 4, 3, 5]),
    ("25 k = 3", lambda: to_list(reverse_k_group(from_list([1, 2, 3, 4, 5]), 3)) == [3, 2, 1, 4, 5]),
]
bad = [n for n, f in checks if not f()]
print(f"advanced_list_station {len(checks) - len(bad)}/{len(checks)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))
