# LeetCode 973, K Closest Points to Origin: sorted, heapq.nsmallest, heap k chỗ với mẹo đổi dấu, và phép đo.
# Chạy: python3 k_closest.py
import heapq, random, time


def sort_all(points, k):
    return sorted(points, key=lambda p: p[0] * p[0] + p[1] * p[1])[:k]


def via_nsmallest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0] * p[0] + p[1] * p[1])


# Max-heap k chỗ: heapq là min-heap, nên lưu -khoảng cách. Đỉnh h[0] là điểm XA nhất trong k điểm đang giữ.
def max_heap_k(points, k):
    h = []
    for x, y in points:
        d = -(x * x + y * y)
        if len(h) < k:
            heapq.heappush(h, (d, x, y))
        elif d > h[0][0]:  # gần hơn điểm xa nhất đang giữ
            heapq.heapreplace(h, (d, x, y))  # lấy đỉnh ra rồi đẩy vào, một lần chìm xuống
    return [[x, y] for _, x, y in h]


# SAI: quên đổi dấu. Đỉnh là điểm GẦN nhất và bị thay trước, nên heap giữ k điểm xa nhất.
def forgot_negate(points, k):
    h = []
    for x, y in points:
        d = x * x + y * y
        if len(h) < k:
            heapq.heappush(h, (d, x, y))
        elif d > h[0][0]:
            heapq.heapreplace(h, (d, x, y))
    return [[x, y] for _, x, y in h]


def norm(ps):
    return sorted(tuple(p) for p in ps)


cases = [([[1, 3], [-2, 2]], 1, [[-2, 2]]), ([[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]), ([[0, 0]], 1, [[0, 0]]),
         ([[1, 0], [0, 1], [2, 2], [-1, -1]], 3, [[1, 0], [0, 1], [-1, -1]]), ([[1, 1], [2, 2], [3, 3]], 3, [[1, 1], [2, 2], [3, 3]]),
         ([[-5, -5], [4, 4], [-1, 0], [10, -10]], 2, [[-1, 0], [4, 4]]), ([[10000, 10000], [-10000, -10000], [1, 1]], 1, [[1, 1]]),
         ([[2, 2], [1, 1], [3, 3], [0, 1], [5, 0]], 2, [[0, 1], [1, 1]])]
for fn in (sort_all, via_nsmallest, max_heap_k, forgot_negate):
    ok = sum(norm(fn(p, k)) == norm(w) for p, k, w in cases)
    print(f"{fn.__name__:<14} {ok}/{len(cases)} ca đúng")

random.seed(973)
pts = [[random.randint(-10**4, 10**4), random.randint(-10**4, 10**4)] for _ in range(10**6)]
print("\nn = 10⁶     sorted   nsmallest   heap k chỗ")
for k in (10, 1000, 100_000):
    row = []
    for fn in (sort_all, via_nsmallest, max_heap_k):
        ts = []
        for _ in range(3):
            t0 = time.perf_counter(); fn(pts, k); ts.append(time.perf_counter() - t0)
        row.append(f"{sorted(ts)[1] * 1000:7.0f} ms")
    print(f"k={k:<8}", *row)
