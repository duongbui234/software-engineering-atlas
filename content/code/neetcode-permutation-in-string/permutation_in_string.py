# LeetCode 567, Permutation in String: ba cách và test.
# Chạy: python3 permutation_in_string.py


def sort_each_window(s1: str, s2: str) -> bool:
    key, m = sorted(s1), len(s1)
    return any(sorted(s2[i : i + m]) == key for i in range(len(s2) - m + 1))


def slide_compare_26(s1: str, s2: str) -> bool:
    m = len(s1)
    if m > len(s2):
        return False
    need, have = [0] * 26, [0] * 26
    for i in range(m):
        need[ord(s1[i]) - 97] += 1
        have[ord(s2[i]) - 97] += 1
    if need == have:  # list so sánh theo giá trị bằng ==
        return True
    for r in range(m, len(s2)):
        have[ord(s2[r]) - 97] += 1
        have[ord(s2[r - m]) - 97] -= 1
        if need == have:
            return True
    return False


def matches_counter(s1: str, s2: str) -> bool:
    m = len(s1)
    if m > len(s2):
        return False
    diff = [0] * 26  # số lần trong cửa sổ − số lần trong s1
    for i in range(m):
        diff[ord(s1[i]) - 97] -= 1
        diff[ord(s2[i]) - 97] += 1
    matches = diff.count(0)
    for r in range(m, len(s2)):
        if matches == 26:
            return True
        for c, delta in ((ord(s2[r]) - 97, 1), (ord(s2[r - m]) - 97, -1)):
            if diff[c] == 0:
                matches -= 1
            diff[c] += delta
            if diff[c] == 0:
                matches += 1
    return matches == 26


cases = [("ab", "eidbaooo", True), ("ab", "eidboaoo", False), ("adc", "dcda", True), ("abc", "ab", False),
         ("a", "a", True), ("aab", "abbab", False), ("aab", "xxbaa", True), ("hello", "ooolleoooleh", False)]
for fn in (sort_each_window, slide_compare_26, matches_counter):
    ok = sum(fn(a, b) == want for a, b, want in cases)
    print(f"{fn.__name__:17} {ok}/{len(cases)} ca đúng")
