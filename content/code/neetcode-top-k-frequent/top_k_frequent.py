# NC-05 Top K Frequent Elements (LeetCode 347), Python 3.
# Chạy: python3 top_k_frequent.py
import heapq
from collections import Counter


def top_k_counter(nums: list[int], k: int) -> list[int]:
    # most_common(k) gọi heapq.nlargest bên dưới: O(n + m log k).
    return [v for v, _ in Counter(nums).most_common(k)]


def top_k_heap(nums: list[int], k: int) -> list[int]:
    heap: list[tuple[int, int]] = []  # heapq là min-heap trên list thường
    for v, c in Counter(nums).items():
        heapq.heappush(heap, (c, v))
        if len(heap) > k:
            heapq.heappop(heap)  # bỏ phần tử ít phổ biến nhất
    return [v for _, v in sorted(heap, reverse=True)]


def top_k_buckets(nums: list[int], k: int) -> list[int]:
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for v, c in Counter(nums).items():
        buckets[c].append(v)
    out: list[int] = []
    for f in range(len(nums), 0, -1):
        for v in buckets[f]:
            out.append(v)
            if len(out) == k:
                return out
    return out


for nums, k in [([1, 1, 1, 2, 2, 3], 2), ([1], 1), ([4, 4, 4, 4, -1, -1, -1, 2, 2, 7], 3)]:
    print(nums, k, "→", top_k_counter(nums, k), top_k_heap(nums, k), top_k_buckets(nums, k))
