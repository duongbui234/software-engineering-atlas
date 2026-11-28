# Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
# Chạy: python3 search.py

calls = {"permute": 0, "queens": 0}


def permute(nums):
    """Không có start; đánh dấu phần tử đã nằm trong path."""
    result, path = [], []
    used = [False] * len(nums)

    def walk():
        calls["permute"] += 1
        if len(path) == len(nums):
            result.append(path[:])  # chép path, vì path còn đổi tiếp
            return
        for i in range(len(nums)):
            if used[i]:
                continue  # đã nằm trong path
            used[i] = True  # đánh dấu
            path.append(nums[i])  # chọn
            walk()  # đi sâu
            path.pop()  # gỡ lựa chọn
            used[i] = False  # gỡ dấu

    walk()
    return result


def exist(board, word):
    """Ghi đè ô đang đi qua, khôi phục khi quay lui."""
    rows, cols = len(board), len(board[0])

    def dfs(r, c, k):
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[k]:
            return False
        if k == len(word) - 1:
            return True
        saved = board[r][c]
        board[r][c] = "#"  # đánh dấu đang đi qua
        found = dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1)
        board[r][c] = saved  # khôi phục
        return found

    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))


def partition(s):
    """Chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome."""
    result, path = [], []

    def is_palindrome(lo, hi):
        while lo < hi:
            if s[lo] != s[hi]:
                return False
            lo += 1
            hi -= 1
        return True

    def walk(start):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start, len(s)):
            if not is_palindrome(start, end):
                continue  # cắt nhánh sớm
            path.append(s[start:end + 1])
            walk(end + 1)
            path.pop()

    walk(0)
    return result


def solve_n_queens(n):
    """Mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ."""
    result, col_of = [], []
    cols, diag, anti = set(), set(), set()  # diag: chéo chính r - c, anti: chéo phụ r + c

    def place(r):
        calls["queens"] += 1
        if r == n:
            result.append(["." * c + "Q" + "." * (n - c - 1) for c in col_of])
            return
        for c in range(n):
            if c in cols or r - c in diag or r + c in anti:
                continue
            cols.add(c)
            diag.add(r - c)
            anti.add(r + c)
            col_of.append(c)
            place(r + 1)
            col_of.pop()
            cols.remove(c)
            diag.remove(r - c)
            anti.remove(r + c)

    place(0)
    return result


def key(lists):
    return sorted(repr(x) for x in lists)


def grid(rows):
    return [list(row) for row in rows]


BOARD = ["TOP", "ARE", "NED"]

cases = [
    ("permute [4,7,9]", lambda: key(permute([4, 7, 9])), key([[4, 7, 9], [4, 9, 7], [7, 4, 9], [7, 9, 4], [9, 4, 7], [9, 7, 4]])),
    ("permute [5]", lambda: key(permute([5])), key([[5]])),
    ("permute 6 số", lambda: len({tuple(p) for p in permute([1, 2, 3, 4, 5, 6])}), 720),
    ("exist TOP", lambda: exist(grid(BOARD), "TOP"), True),
    ("exist TAN", lambda: exist(grid(BOARD), "TAN"), True),
    ("exist PERE", lambda: exist(grid(BOARD), "PERE"), True),
    ("exist ROPED", lambda: exist(grid(BOARD), "ROPED"), True),
    ("exist TOT (không dùng lại ô)", lambda: exist(grid(BOARD), "TOT"), False),
    ("exist ARENA", lambda: exist(grid(BOARD), "ARENA"), False),
    ("exist NEED", lambda: exist(grid(BOARD), "NEED"), False),
    ("partition noon", lambda: key(partition("noon")), key([["noon"], ["n", "oo", "n"], ["n", "o", "o", "n"]])),
    ("partition abc", lambda: key(partition("abc")), key([["a", "b", "c"]])),
    ("partition aaa", lambda: key(partition("aaa")), key([["aaa"], ["a", "aa"], ["aa", "a"], ["a", "a", "a"]])),
    ("partition 8 chữ a", lambda: len(partition("aaaaaaaa")), 128),
    ("partition racecar", lambda: len(partition("racecar")), 4),
    ("nQueens 4", lambda: key(solve_n_queens(4)), key([[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]])),
    ("nQueens 1", lambda: key(solve_n_queens(1)), key([["Q"]])),
    ("nQueens 3", lambda: len(solve_n_queens(3)), 0),
    ("nQueens 6", lambda: len(solve_n_queens(6)), 4),
]

ok = 0
fails = []
for name, run, want in cases:
    if run() == want:
        ok += 1
    else:
        fails.append(name)
print(f"{ok}/{len(cases)} ca đúng")
if fails:
    print("sai ở: " + "; ".join(fails))

calls["permute"] = 0
perms = len(permute([1, 2, 3, 4, 5, 6, 7, 8]))
calls["queens"] = 0
boards = len(solve_n_queens(8))
print(f"Hoán vị 8 số: {calls['permute']} lần gọi, {perms} kết quả")
print(f"8 hậu: {calls['queens']} lần gọi, {boards} lời giải")
