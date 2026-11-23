# Ga SRCH-03, heap và top K: giải 703, 1046, 973 và 215 bằng heapq (chỉ có min-heap).
# Chạy: python3 heap_station.py
import heapq


class KthLargest:  # 703: min-heap giữ k số lớn nhất
    def __init__(self, k: int, nums: list[int]):
        self.k, self.h = k, []
        for x in nums:
            self.add(x)

    def add(self, val: int) -> int:
        if len(self.h) < self.k:
            heapq.heappush(self.h, val)
        elif val > self.h[0]:
            heapq.heapreplace(self.h, val)  # thay ứng viên yếu nhất
        return self.h[0]


def last_stone_weight(stones: list[int]) -> int:  # 1046: đảo dấu để có max-heap
    h = [-s for s in stones]
    heapq.heapify(h)
    while len(h) > 1:
        y, x = -heapq.heappop(h), -heapq.heappop(h)
        if y > x:
            heapq.heappush(h, -(y - x))
    return -h[0] if h else 0


def k_closest(points: list[list[int]], k: int) -> list[list[int]]:  # 973: max-heap k chỗ theo khoảng cách
    h = []
    for x, y in points:
        heapq.heappush(h, (-(x * x + y * y), x, y))
        if len(h) > k:
            heapq.heappop(h)  # bỏ điểm xa nhất
    return [[x, y] for _, x, y in h]


def find_kth_largest(nums: list[int], k: int) -> int:  # 215: min-heap k chỗ
    h = nums[:k]
    heapq.heapify(h)
    for x in nums[k:]:
        if x > h[0]:
            heapq.heapreplace(h, x)
    return h[0]


def stream(k, nums, adds):
    s = KthLargest(k, nums)
    return [s.add(v) for v in adds]


def pts(ps):
    return sorted(map(tuple, ps))


cases = [
    ("703 ví dụ của đề", lambda: stream(3, [4, 5, 8, 2], [3, 5, 10, 9, 4]), [4, 5, 5, 8, 8]),
    ("703 nums rỗng", lambda: stream(1, [], [-3, -2, -4, 0, 4]), [-3, -2, -2, 0, 4]),
    ("703 số trùng", lambda: stream(2, [5, 5], [5, 1, 6]), [5, 5, 5]),
    ("1046 ví dụ của đề", lambda: last_stone_weight([2, 7, 4, 1, 8, 1]), 1),
    ("1046 một viên", lambda: last_stone_weight([1]), 1),
    ("1046 vỡ hết", lambda: last_stone_weight([2, 2]), 0),
    ("1046 [3, 7, 2]", lambda: last_stone_weight([3, 7, 2]), 2),
    ("973 ví dụ 1", lambda: pts(k_closest([[1, 3], [-2, 2]], 1)), pts([[-2, 2]])),
    ("973 ví dụ 2", lambda: pts(k_closest([[3, 3], [5, -1], [-2, 4]], 2)), pts([[3, 3], [-2, 4]])),
    ("973 k = n", lambda: pts(k_closest([[0, 1], [1, 0]], 2)), pts([[0, 1], [1, 0]])),
    ("215 ví dụ 1", lambda: find_kth_largest([3, 2, 1, 5, 6, 4], 2), 5),
    ("215 ví dụ 2", lambda: find_kth_largest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4),
    ("215 một phần tử", lambda: find_kth_largest([1], 1), 1),
    ("215 số âm trùng", lambda: find_kth_largest([-1, -1], 2), -1),
]
bad = [n for n, f, want in cases if f() != want]
print(f"heap_station {len(cases) - len(bad)}/{len(cases)} ca đúng" + ("; sai ở: " + ", ".join(bad) if bad else ""))
