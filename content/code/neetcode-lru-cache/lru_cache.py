# LeetCode 146: LRU Cache. Danh sách hai chiều tự viết, OrderedDict, functools.lru_cache, ba bản sai.
# Chạy: python3 lru_cache.py
import time
from collections import OrderedDict
from functools import lru_cache


class DNode:
    __slots__ = ("key", "val", "prev", "next")

    def __init__(self, key=0, val=0):
        self.key, self.val, self.prev, self.next = key, val, None, None


# Cách 1: dict tra key → nút; danh sách hai chiều có hai nút canh. Sau head là mới dùng nhất.
class LRUList:
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


# Cách 2: OrderedDict giữ thứ tự; move_to_end đưa key xuống cuối, popitem(last=False) lấy key đầu (cũ nhất).
class LRUOrdered:
    def __init__(self, capacity):
        self.cap, self.d = capacity, OrderedDict()

    def get(self, key):
        if key not in self.d:
            return -1
        self.d.move_to_end(key)
        return self.d[key]

    def put(self, key, val):
        if key in self.d:
            self.d.move_to_end(key)
        elif len(self.d) == self.cap:
            self.d.popitem(last=False)
        self.d[key] = val


# SAI 1: get không đưa nút lên đầu.
class WrongNoMoveOnGet(LRUList):
    def get(self, key):
        n = self.map.get(key)
        return -1 if n is None else n.val


# SAI 2: gỡ nút cuối khỏi danh sách nhưng quên xóa khỏi dict.
class WrongKeepInMap(LRUList):
    def put(self, key, val):
        n = self.map.get(key)
        if n is not None:
            n.val = val
            self._unlink(n)
            self._push_front(n)
            return
        if len(self.map) == self.cap:
            self._unlink(self.tail.prev)  # thiếu del self.map[old.key]
        n = DNode(key, val)
        self.map[key] = n
        self._push_front(n)


# SAI 3: put cho key đã có chỉ sửa giá trị, không đưa lên đầu.
class WrongUpdateNoMove(LRUList):
    def put(self, key, val):
        n = self.map.get(key)
        if n is not None:
            n.val = val
            return
        super().put(key, val)


# Bản chậm làm chuẩn: list key theo thứ tự dùng, O(capacity) mỗi thao tác.
class LRUSlow:
    def __init__(self, capacity):
        self.cap, self.order, self.vals = capacity, [], {}

    def get(self, key):
        if key not in self.vals:
            return -1
        self.order.remove(key)
        self.order.append(key)
        return self.vals[key]

    def put(self, key, val):
        if key in self.vals:
            self.order.remove(key)
        elif len(self.order) == self.cap:
            del self.vals[self.order.pop(0)]
        self.order.append(key)
        self.vals[key] = val


# Bộ sinh ngẫu nhiên mulberry32 (giống bản TypeScript): mọi phép tính giữ trong 32 bit.
def mulberry32(a):
    M = 0xFFFFFFFF

    def rnd():
        nonlocal a
        a = (a + 0x6D2B79F5) & M
        t = ((a ^ (a >> 15)) * (1 | a)) & M
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & M)) & M) ^ t
        return ((t ^ (t >> 14)) & M) / 4294967296

    return rnd


def random_ops(n, keys, seed):
    r, ops = mulberry32(seed), []
    for _ in range(n):
        k = int(r() * keys)
        ops.append((0, k) if r() < 0.5 else (1, k, int(r() * 1000)))
    return ops


def run(make, cap, ops):
    c, out = make(cap), []
    for o in ops:
        if o[0] == 0:
            out.append(c.get(o[1]))
        else:
            c.put(o[1], o[2])
    return out


def g(k): return (0, k)
def p(k, v): return (1, k, v)


cases = [
    ("ví dụ của đề", 2, [p(1, 1), p(2, 2), g(1), p(3, 3), g(2), p(4, 4), g(1), g(3), g(4)]),
    ("cập nhật key cũ", 2, [p(2, 1), p(1, 1), p(2, 3), p(4, 1), g(1), g(2)]),
    ("sức chứa 1", 1, [p(2, 1), g(2), p(3, 2), g(2), g(3)]),
    ("get key chưa có", 2, [g(5), p(5, 5), g(5)]),
    ("đẩy ra rồi thêm lại", 2, [p(1, 1), p(2, 2), p(3, 3), g(1), p(1, 10), g(1), g(2), g(3)]),
    ("ngẫu nhiên 1 (cap 3)", 3, random_ops(2000, 8, 1)),
    ("ngẫu nhiên 2 (cap 10)", 10, random_ops(2000, 25, 2)),
    ("ngẫu nhiên 3 (cap 50)", 50, random_ops(2000, 120, 3)),
]

for name, make in [("LRUList", LRUList), ("LRUOrdered", LRUOrdered), ("WrongNoMoveOnGet", WrongNoMoveOnGet),
                   ("WrongKeepInMap", WrongKeepInMap), ("WrongUpdateNoMove", WrongUpdateNoMove)]:
    bad = []
    for cname, cap, ops in cases:
        try:
            got = run(make, cap, ops)
        except Exception as e:
            got = "ném " + type(e).__name__
        if got != run(LRUSlow, cap, ops):
            bad.append(cname)
    print(f"{name:<18} {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở " + ", ".join(bad) if bad else ""))


# functools.lru_cache: cùng ý tưởng, gắn lên một hàm. maxsize=2 nên gọi lại số đã bị đẩy ra là tính lại.
calls = []


@lru_cache(maxsize=2)
def slow_square(x):
    calls.append(x)
    return x * x


for x in [1, 2, 1, 3, 2, 1]:
    slow_square(x)
print(f"\nlru_cache(maxsize=2), gọi 1 2 1 3 2 1: hàm thật chạy cho {calls}; {slow_square.cache_info()}")

# Đo: 10⁶ thao tác, nửa get nửa put, key trong 0..2·cap − 1. Trung vị 5 lần chạy.
print("\nsức chứa   LRUList (tự viết)          LRUOrdered (OrderedDict)")
for cap in [100, 10000]:
    ops = random_ops(1_000_000, 2 * cap, cap)
    row = []
    for make in (LRUList, LRUOrdered):
        ts = []
        for _ in range(5):
            t = time.perf_counter()
            run(make, cap, ops)
            ts.append(time.perf_counter() - t)
        ms = sorted(ts)[2] * 1000
        row.append(f"{ms:7.1f} ms  {1e6 / ms / 1000:4.2f} triệu/s")
    print(f"{cap:<10} {row[0]}     {row[1]}")
