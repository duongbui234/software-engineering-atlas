# LeetCode 424, Longest Repeating Character Replacement: ba cách và test.
# Chạy: python3 character_replacement.py
from collections import Counter


def brute_force(s: str, k: int) -> int:
    best = 0
    for i in range(len(s)):
        count, max_freq = Counter(), 0
        for j in range(i, len(s)):
            count[s[j]] += 1
            max_freq = max(max_freq, count[s[j]])
            if j - i + 1 - max_freq <= k:
                best = max(best, j - i + 1)
    return best


def window_recount(s: str, k: int) -> int:
    count = [0] * 26
    left = best = 0
    for right, ch in enumerate(s):
        count[ord(ch) - 65] += 1
        while right - left + 1 - max(count) > k:  # max(count) quét 26 ô mỗi lần
            count[ord(s[left]) - 65] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best


def window_stale_max(s: str, k: int) -> int:
    count = [0] * 26
    left = max_freq = 0
    for right, ch in enumerate(s):
        count[ord(ch) - 65] += 1
        max_freq = max(max_freq, count[ord(ch) - 65])
        if right - left + 1 - max_freq > k:  # "if": cửa sổ trượt nguyên khối, không co
            count[ord(s[left]) - 65] -= 1
            left += 1
    return len(s) - left


cases = [("ABAB", 2, 4), ("AABABBA", 1, 4), ("A", 0, 1), ("ABCDE", 1, 2),
         ("AAAA", 0, 4), ("BAAAB", 2, 5), ("ABBB", 2, 4), ("ABCABCAA", 2, 5)]
for fn in (brute_force, window_recount, window_stale_max):
    ok = sum(fn(s, k) == want for s, k, want in cases)
    print(f"{fn.__name__:17} {ok}/{len(cases)} ca đúng")
