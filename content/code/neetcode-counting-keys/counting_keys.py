# Ga ARR-02, khóa chuẩn và đếm tần suất: biến mỗi phần tử thành một KHÓA, rồi đếm hoặc gom theo khóa đó.
# Chạy: python3 counting_keys.py
from collections import Counter, defaultdict


def is_anagram(s: str, t: str) -> bool:  # 242
    return Counter(s) == Counter(t)  # Counter là dict đếm; hai Counter bằng nhau khi mọi khóa cùng số lần


def group_anagrams(words: list[str]) -> list[list[str]]:  # 49
    groups: defaultdict[tuple[int, ...], list[str]] = defaultdict(list)
    for w in words:
        count = [0] * 26
        for ch in w:
            count[ord(ch) - 97] += 1
        groups[tuple(count)].append(w)  # list không hash được, tuple thì được
    return list(groups.values())


def top_k_frequent(nums: list[int], k: int) -> list[int]:  # 347
    buckets: list[list[int]] = [[] for _ in range(len(nums) + 1)]
    for x, c in Counter(nums).items():
        buckets[c].append(x)  # số lần xuất hiện chính là chỉ số
    out: list[int] = []
    for c in range(len(nums), 0, -1):
        out.extend(buckets[c])
        if len(out) >= k:
            break
    return out[:k]


def is_valid_sudoku(board: list[list[str]]) -> bool:  # 36
    seen: set[tuple] = set()
    for r in range(9):
        for c in range(9):
            d = board[r][c]
            if d == ".":
                continue
            for key in (("r", r, d), ("c", c, d), ("b", r // 3 * 3 + c // 3, d)):  # tuple làm khóa, không cần ghép chuỗi
                if key in seen:
                    return False
                seen.add(key)
    return True


board = [list(row) for row in ["53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1",
                               "7...2...6", ".6....28.", "...419..5", "....8..79"]]
broken = [row[:] for row in board]
broken[0][0] = "8"


def norm(g):
    return sorted(" ".join(sorted(x)) for x in g)


cases = [
    ("is_anagram anagram/nagaram", is_anagram("anagram", "nagaram"), True),
    ("is_anagram rat/car", is_anagram("rat", "car"), False),
    ("is_anagram aacc/ccac", is_anagram("aacc", "ccac"), False),
    ("group_anagrams eat…bat", norm(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"])), ["ate eat tea", "bat", "nat tan"]),
    ('group_anagrams [""]', group_anagrams([""]), [[""]]),
    ("top_k_frequent [1,1,1,2,2,3] 2", top_k_frequent([1, 1, 1, 2, 2, 3], 2), [1, 2]),
    ("top_k_frequent [1] 1", top_k_frequent([1], 1), [1]),
    ("is_valid_sudoku ví dụ 1", is_valid_sudoku(board), True),
    ("is_valid_sudoku 8 ở góc", is_valid_sudoku(broken), False),
]
ok = 0
for name, got, want in cases:
    if got == want:
        ok += 1
    else:
        print("SAI", name, got, want)
print(f"{ok}/{len(cases)} ca đúng")
