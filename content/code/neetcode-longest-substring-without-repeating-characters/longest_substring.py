# LeetCode 3, Longest Substring Without Repeating Characters: ba cách và test.
# Chạy: python3 longest_substring.py


def brute_force(s: str) -> int:
    best = 0
    for i in range(len(s)):
        seen = set()
        for ch in s[i:]:
            if ch in seen:
                break
            seen.add(ch)
        best = max(best, len(seen))
    return best


def window_set(s: str) -> int:
    in_window, left, best = set(), 0, 0
    for right, ch in enumerate(s):
        while ch in in_window:
            in_window.remove(s[left])
            left += 1
        in_window.add(ch)
        best = max(best, right - left + 1)
    return best


def window_last_seen(s: str) -> int:
    last: dict[str, int] = {}
    left = best = 0
    for right, ch in enumerate(s):
        if last.get(ch, -1) >= left:  # chỉ nhảy khi lần gặp trước nằm trong cửa sổ
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best


cases = [("abcabcbb", 3), ("bbbbb", 1), ("pwwkew", 3), ("", 0), (" ", 1), ("abba", 2), ("dvdf", 3), ("tmmzuxt", 5)]
for fn in (brute_force, window_set, window_last_seen):
    ok = sum(fn(s) == want for s, want in cases)
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng")
print(f'\nwindow_last_seen("a😀😀") = {window_last_seen("a😀😀")}')  # str Python duyệt theo code point: đúng là 2
