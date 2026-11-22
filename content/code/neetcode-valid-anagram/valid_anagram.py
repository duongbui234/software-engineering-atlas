# NC-02 Valid Anagram (LeetCode 242), Python 3.
# Chạy: python3 valid_anagram.py
import unicodedata
from collections import Counter


def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for a, b in zip(s, t):
        count[ord(a) - ord("a")] += 1
        count[ord(b) - ord("a")] -= 1
    return all(c == 0 for c in count)


def is_anagram_counter(s: str, t: str) -> bool:
    # str của Python là dãy code point: không có chuyện vỡ emoji như UTF-16.
    # Nhưng "é" vẫn có hai cách viết, nên cần chuẩn hóa.
    nfc = lambda x: unicodedata.normalize("NFC", x)
    return Counter(nfc(s)) == Counter(nfc(t))


def is_anagram_sorted(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)


cases = [("anagram", "nagaram", True), ("rat", "car", False), ("a", "ab", False), ("aacc", "ccac", False)]
for fn in (is_anagram, is_anagram_counter, is_anagram_sorted):
    bad = [c for c in cases if fn(c[0], c[1]) != c[2]]
    print(f"{fn.__name__}: {len(cases) - len(bad)}/{len(cases)} ca đúng")

composed, decomposed = "café", "éfac"
print("len:", len(composed), len(decomposed), "| sorted:", is_anagram_sorted(composed, decomposed),
      "| Counter + NFC:", is_anagram_counter(composed, decomposed))
print("emoji:", is_anagram_sorted("😀🌃", "\U0001F703\U0001F200"), "(Python không vỡ code point)")
