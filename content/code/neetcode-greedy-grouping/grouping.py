# Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.
from collections import Counter


def is_n_straight_hand(hand, group_size):
    """Lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó."""
    if len(hand) % group_size:
        return False
    count = Counter(hand)
    for x in sorted(count):
        c = count[x]  # c lá x còn lại: cả c lá đều phải mở nhóm
        if c == 0:
            continue
        for v in range(x, x + group_size):
            if count[v] < c:
                return False  # thiếu lá v: có nhóm không đi tiếp được
            count[v] -= c
    return True


def merge_triplets(triplets, target):
    """Bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại."""
    good = [False, False, False]  # vị trí i đã có bộ an toàn chạm đúng target[i] chưa
    for t in triplets:
        if any(t[i] > target[i] for i in range(3)):
            continue  # dùng là hỏng vĩnh viễn
        for i in range(3):
            if t[i] == target[i]:
                good[i] = True
    return all(good)


def partition_labels(s):
    """Phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó."""
    last = {c: i for i, c in enumerate(s)}
    sizes = []
    start = end = 0  # end: mốc xa nhất mà phần hiện tại buộc phải chạm
    for i, c in enumerate(s):
        end = max(end, last[c])
        if i == end:  # không chữ nào của phần này còn ở phía sau: cắt
            sizes.append(end - start + 1)
            start = i + 1
    return sizes


def check_valid_string(s):
    """Giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có."""
    lo = hi = 0  # lo: mọi '*' nghiêng về ')'; hi: mọi '*' nghiêng về '('
    for c in s:
        if c == "(":
            lo, hi = lo + 1, hi + 1
        elif c == ")":
            lo, hi = lo - 1, hi - 1
        else:
            lo, hi = lo - 1, hi + 1
        if hi < 0:
            return False  # kể cả khi mọi '*' là '(' vẫn thừa ')'
        lo = max(lo, 0)  # số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
    return lo == 0


# Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
cases = [
    ("hand thiếu lá 7", lambda: is_n_straight_hand([3, 1, 5, 8, 2, 6, 4, 5, 3], 3), False),
    ("hand ba nhóm", lambda: is_n_straight_hand([1, 2, 2, 3, 3, 4, 4, 5, 6], 3), True),
    ("hand không chia hết", lambda: is_n_straight_hand([1, 2, 3, 4, 5], 4), False),
    ("hand nhóm cỡ 1", lambda: is_n_straight_hand([7], 1), True),
    ("hand chưa sắp", lambda: is_n_straight_hand([2, 1], 2), True),
    ("hand hai nhóm giống nhau", lambda: is_n_straight_hand([1, 1, 2, 2, 3, 3], 3), True),
    ("hand hở ở 3", lambda: is_n_straight_hand([1, 2, 4, 5, 6, 7], 3), False),
    ("triplets bỏ bộ vượt", lambda: merge_triplets([[1, 4, 2], [3, 1, 5], [2, 6, 9], [3, 4, 1]], [3, 4, 5]), True),
    ("triplets thiếu vị trí 3", lambda: merge_triplets([[4, 1, 1], [1, 4, 1]], [4, 4, 4]), False),
    ("triplets một bộ đúng", lambda: merge_triplets([[5, 5, 5]], [5, 5, 5]), True),
    ("triplets bộ duy nhất chạm bị vượt", lambda: merge_triplets([[2, 9, 1], [1, 1, 3]], [2, 2, 3]), False),
    ("triplets không chạm", lambda: merge_triplets([[1, 2, 3], [1, 2, 3]], [1, 2, 4]), False),
    ("labels hai phần", lambda: partition_labels("abacdcbe"), [7, 1]),
    ("labels từng chữ", lambda: partition_labels("xyz"), [1, 1, 1]),
    ("labels một chữ", lambda: partition_labels("aaaa"), [4]),
    ("labels nối dài", lambda: partition_labels("abcab"), [5]),
    ("labels năm phần", lambda: partition_labels("ccbbaddx"), [2, 2, 1, 2, 1]),
    ("paren sao ở giữa", lambda: check_valid_string("(*)"), True),
    ("paren sao làm (", lambda: check_valid_string("(*))"), True),
    ("paren mở ở cuối", lambda: check_valid_string("*)("), False),
    ("paren đóng trước", lambda: check_valid_string(")*"), False),
    ("paren thừa mở", lambda: check_valid_string("(((*"), False),
    ("paren một sao", lambda: check_valid_string("*"), True),
    ("paren hai sao", lambda: check_valid_string("((*)*)"), True),
    ("paren sao làm )", lambda: check_valid_string("(*(*)"), True),
    ("paren sao không cứu", lambda: check_valid_string("**(("), False),
]

ok = 0
for name, run, want in cases:
    got = run()
    if got == want:
        ok += 1
    else:
        print(f"SAI {name}: được {got}, cần {want}")
print(f"{ok}/{len(cases)} ca đúng")
