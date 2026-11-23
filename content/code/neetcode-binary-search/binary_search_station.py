# Ga SRCH-01: một khuôn tìm kiếm nhị phân cho bốn bài 704, 74, 153, 33.
# Chạy: python3 binary_search_station.py


def search(nums: list[int], target: int) -> int:  # 704
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1


def search_matrix(matrix: list[list[int]], target: int) -> bool:  # 74: chỉ số k ứng với ô (k // n, k % n)
    n = len(matrix[0])
    lo, hi = 0, len(matrix) * n - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        r, c = divmod(mid, n)
        if matrix[r][c] == target:
            return True
        if matrix[r][c] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return False


def find_min(nums: list[int]) -> int:  # 153: so với nums[hi] để biết điểm gãy ở bên nào
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] > nums[hi]:
            lo = mid + 1
        else:
            hi = mid  # mid có thể là phần tử nhỏ nhất
    return nums[lo]


def search_rotated(nums: list[int], target: int) -> int:  # 33: một nửa quanh mid luôn tăng dần
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:  # nửa trái tăng dần
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:  # nửa phải tăng dần
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1


M = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]]
checks = [
    (search([-1, 0, 3, 5, 9, 12], 9), 4), (search([-1, 0, 3, 5, 9, 12], 2), -1), (search([5], 5), 0),
    (search_matrix(M, 3), True), (search_matrix(M, 13), False), (search_matrix([[1]], 1), True),
    (find_min([3, 4, 5, 1, 2]), 1), (find_min([4, 5, 6, 7, 0, 1, 2]), 0), (find_min([11, 13, 15, 17]), 11), (find_min([2, 1]), 1),
    (search_rotated([4, 5, 6, 7, 0, 1, 2], 0), 4), (search_rotated([4, 5, 6, 7, 0, 1, 2], 3), -1),
    (search_rotated([1], 0), -1), (search_rotated([3, 1], 1), 1),
]
print(f"binary_search_station {sum(g == w for g, w in checks)}/{len(checks)} ca đúng")
