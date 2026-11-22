# LeetCode 76, Minimum Window Substring: hai cách và test.
# Chạy: python3 min_window.py
from collections import Counter


def brute_force(s: str, t: str) -> str:
    best = ""
    for l in range(len(s)):
        need, missing = Counter(t), len(t)
        for r in range(l, len(s)):
            if need[s[r]] > 0:
                missing -= 1
            need[s[r]] -= 1  # Counter trả 0 cho khóa chưa có, không ném KeyError
            if missing == 0:
                if not best or r - l + 1 < len(best):
                    best = s[l : r + 1]
                break
    return best


def window_missing(s: str, t: str) -> str:
    need = Counter(t)
    missing, l = len(t), 0
    best_l, best_len = 0, float("inf")
    for r, c in enumerate(s):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1
        while missing == 0:  # đủ: co chừng nào còn đủ, ghi đáp án trong lúc co
            if r - l + 1 < best_len:
                best_l, best_len = l, r - l + 1
            need[s[l]] += 1
            if need[s[l]] > 0:
                missing += 1
            l += 1
    return "" if best_len == float("inf") else s[best_l : best_l + best_len]


cases = [("ADOBECODEBANC", "ABC", "BANC"), ("a", "a", "a"), ("a", "aa", ""), ("aa", "aa", "aa"), ("ab", "b", "b"),
         ("bba", "ab", "ba"), ("cabwefgewcwaefgcf", "cae", "cwae"), ("abc", "d", "")]
for fn in (brute_force, window_missing):
    ok = sum(fn(s, t) == want for s, t, want in cases)
    print(f"{fn.__name__:15} {ok}/{len(cases)} ca đúng")
