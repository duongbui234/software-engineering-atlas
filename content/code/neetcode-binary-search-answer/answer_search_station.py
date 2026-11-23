# Ga SRCH-02, tìm kiếm nhị phân trên đáp án: lời giải của 875, 981 và 4.
# Chạy: python3 answer_search_station.py
from bisect import bisect_right
from collections import defaultdict


def min_eating_speed(piles: list[int], h: int) -> int:  # 875
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if sum(-(-p // mid) for p in piles) <= h:  # kịp: giữ mid
            hi = mid
        else:
            lo = mid + 1
    return lo


class TimeMap:  # 981: mốc thời gian của mỗi khóa tăng dần
    def __init__(self):
        self.ts = defaultdict(list)
        self.vals = defaultdict(list)

    def set(self, key: str, value: str, timestamp: int) -> None:
        self.ts[key].append(timestamp)
        self.vals[key].append(value)

    def get(self, key: str, timestamp: int) -> str:
        i = bisect_right(self.ts.get(key, []), timestamp)  # mốc đầu tiên > timestamp
        return self.vals[key][i - 1] if i else ""


def find_median_sorted_arrays(a: list[int], b: list[int]) -> float:  # 4: chia đôi trên vị trí cắt
    if len(a) > len(b):
        a, b = b, a
    m, n = len(a), len(b)
    half = (m + n + 1) // 2
    lo, hi = 0, m
    while lo <= hi:
        i = (lo + hi) // 2
        j = half - i
        a_l = a[i - 1] if i > 0 else float("-inf")
        a_r = a[i] if i < m else float("inf")
        b_l = b[j - 1] if j > 0 else float("-inf")
        b_r = b[j] if j < n else float("inf")
        if a_l <= b_r and b_l <= a_r:
            if (m + n) % 2:
                return max(a_l, b_l)
            return (max(a_l, b_l) + min(a_r, b_r)) / 2
        if a_l > b_r:
            hi = i - 1  # lấy quá nhiều từ a
        else:
            lo = i + 1
    raise ValueError("mảng đầu vào chưa sắp")


ok = total = 0
def check(got, want, label):
    global ok, total
    total += 1
    if got == want:
        ok += 1
    else:
        print(f"sai: {label} → {got}, cần {want}")

check(min_eating_speed([3, 6, 7, 11], 8), 4, "875")
check(min_eating_speed([30, 11, 23, 4, 20], 5), 30, "875 h=5")
check(min_eating_speed([30, 11, 23, 4, 20], 6), 23, "875 h=6")
check(min_eating_speed([1000000000], 2), 500000000, "875 [10⁹]")
tm = TimeMap()
tm.set("foo", "bar", 1)
check(tm.get("foo", 1), "bar", "981 get 1")
check(tm.get("foo", 3), "bar", "981 get 3")
tm.set("foo", "bar2", 4)
check(tm.get("foo", 4), "bar2", "981 get 4")
check(tm.get("foo", 0), "", "981 get 0")
check(tm.get("baz", 5), "", "981 khóa chưa có")
check(find_median_sorted_arrays([1, 3], [2]), 2, "4 [1,3] [2]")
check(find_median_sorted_arrays([1, 2], [3, 4]), 2.5, "4 [1,2] [3,4]")
check(find_median_sorted_arrays([], [1]), 1, "4 [] [1]")
check(find_median_sorted_arrays([0, 0], [0, 0]), 0, "4 toàn 0")
check(find_median_sorted_arrays([1, 2, 3, 4, 5], [6, 7, 8]), 4.5, "4 tách rời")
print(f"answer_search_station {ok}/{total} ca đúng")
