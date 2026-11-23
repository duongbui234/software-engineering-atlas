# LeetCode 981: Time Based Key-Value Store. Chạy: python3 time_map.py
# get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".
from bisect import bisect_right
from collections import defaultdict
import time


class TimeMap:
    """Hai list song song cho mỗi key: times đã sắp (đề hứa tăng dần), values cùng chỉ số."""

    def __init__(self):
        self.times = defaultdict(list)
        self.values = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.times[key].append(timestamp)
        self.values[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.times:  # đừng đọc self.times[key]: defaultdict sẽ tạo key rỗng
            return ""
        i = bisect_right(self.times[key], timestamp)  # số mốc ≤ timestamp
        return self.values[key][i - 1] if i else ""


class KeyTimeMap:
    """Một list cặp (timestamp, value); bisect so theo phần tử đầu nhờ key= (Python 3.10+)."""

    def __init__(self):
        self.store: dict[str, list[tuple[int, str]]] = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.store.setdefault(key, []).append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        pairs = self.store.get(key, [])
        i = bisect_right(pairs, timestamp, key=lambda p: p[0])
        return pairs[i - 1][1] if i else ""


class TupleTimeMap(KeyTimeMap):
    """SAI: so cả tuple với (timestamp,). Tuple ngắn hơn đứng trước, nên (5,) < (5, "v") và mốc trùng t bị bỏ qua."""

    def get(self, key: str, timestamp: int) -> str:
        pairs = self.store.get(key, [])
        i = bisect_right(pairs, (timestamp,))
        return pairs[i - 1][1] if i else ""


cases = [
    ("ví dụ của đề", [("set", "foo", "bar", 1), ("get", "foo", 1, "bar"), ("get", "foo", 3, "bar"), ("set", "foo", "bar2", 4), ("get", "foo", 4, "bar2"), ("get", "foo", 5, "bar2")]),
    ("key chưa từng set", [("get", "x", 10, "")]),
    ("t nhỏ hơn mốc đầu", [("set", "a", "v", 5), ("get", "a", 4, ""), ("get", "a", 5, "v")]),
    ("t nằm giữa hai mốc", [("set", "a", "v1", 10), ("set", "a", "v2", 20), ("get", "a", 15, "v1")]),
    ("t lớn hơn mốc cuối", [("set", "a", "v1", 10), ("set", "a", "v2", 20), ("get", "a", 99, "v2")]),
    ("hai key xen kẽ", [("set", "a", "a1", 1), ("set", "b", "b1", 2), ("set", "a", "a2", 3), ("get", "b", 3, "b1"), ("get", "a", 2, "a1"), ("get", "b", 1, "")]),
    ("trùng mốc ở giữa", [("set", "k", "1", 1), ("set", "k", "2", 2), ("set", "k", "3", 3), ("get", "k", 2, "2")]),
    ("timestamp 10⁷", [("set", "k", "lo", 1), ("set", "k", "hi", 10_000_000), ("get", "k", 9_999_999, "lo"), ("get", "k", 10_000_000, "hi")]),
]

for cls in (TimeMap, KeyTimeMap, TupleTimeMap):
    bad = []
    for label, ops in cases:
        m, got, ok = cls(), [], True
        for op in ops:
            if op[0] == "set":
                m.set(op[1], op[2], op[3])
            else:
                r = m.get(op[1], op[2])
                got.append(repr(r))
                ok &= r == op[3]
        if not ok:
            bad.append(f"{label} → [{', '.join(got)}]")
    print(f"{cls.__name__:<14} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở: {'; '.join(bad)}" if bad else ""))

# defaultdict: chỉ đọc thôi cũng tạo key.
d = defaultdict(list)
_ = d["chưa có"]
print(f"\ndefaultdict sau một lần đọc d['chưa có']: {dict(d)}")

# Đo: một key có 10⁵ mốc, 10⁵ lần get với t ngẫu nhiên.
import random
random.seed(42)
k, Q = 100_000, 100_000
qs = [random.randint(1, 2 * k) for _ in range(Q)]
for cls in (TimeMap, KeyTimeMap):
    m = cls()
    for i in range(1, k + 1):
        m.set("k", f"v{i}", 2 * i)
    rs = []
    for _ in range(5):
        t0 = time.perf_counter()
        for t in qs:
            m.get("k", t)
        rs.append((time.perf_counter() - t0) * 1000)
    print(f"{cls.__name__:<14} 10⁵ get trên 10⁵ mốc: {sorted(rs)[2]:.1f} ms (trung vị 5 lần)")
