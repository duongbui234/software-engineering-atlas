# LeetCode 74, Search a 2D Matrix: bốn cách và test.
# Chạy: python3 search_2d_matrix.py
from bisect import bisect_left, bisect_right


def linear_scan(matrix: list[list[int]], target: int) -> bool:
    return any(target in row for row in matrix)  # "in" trên list: duyệt tuần tự


def two_binary_search(matrix: list[list[int]], target: int) -> bool:
    # key= (Python 3.10+) so theo phần tử đầu mỗi hàng mà không phải dựng list cột đầu tốn O(m)
    r = bisect_right(matrix, target, key=lambda row: row[0]) - 1  # hàng cuối cùng có phần tử đầu ≤ target
    if r < 0:
        return False
    row = matrix[r]
    c = bisect_left(row, target)
    return c < len(row) and row[c] == target


def flat_binary_search(matrix: list[list[int]], target: int) -> bool:
    m, n = len(matrix), len(matrix[0])
    lo, hi = 0, m * n
    while lo < hi:
        mid = (lo + hi) // 2  # int Python không tràn
        r, c = divmod(mid, n)  # hàng = mid // n, cột = mid % n
        x = matrix[r][c]
        if x == target:
            return True
        if x < target:
            lo = mid + 1
        else:
            hi = mid
    return False


def staircase(matrix: list[list[int]], target: int) -> bool:
    r, c = 0, len(matrix[0]) - 1
    while r < len(matrix) and c >= 0:
        x = matrix[r][c]
        if x == target:
            return True
        if x > target:
            c -= 1
        else:
            r += 1
    return False


ex = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
cases = [(ex, 3, True), (ex, 13, False), (ex, 60, True), (ex, 23, True), (ex, 0, False), (ex, 61, False),
         ([[1]], 1, True), ([[1]], 2, False), ([[1], [3]], 3, True), ([[1, 2], [3, 4]], 4, True)]
for fn in (linear_scan, two_binary_search, flat_binary_search, staircase):
    ok = sum(fn(m, t) == want for m, t, want in cases)
    print(f"{fn.__name__:18} {ok}/{len(cases)} ca đúng")
print(f"\ndivmod(7, 4) = {divmod(7, 4)}, divmod(-7, 4) = {divmod(-7, 4)}")
