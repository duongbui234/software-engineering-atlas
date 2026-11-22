# NC-04 Group Anagrams (LeetCode 49), Python 3.
# Chạy: python3 group_anagrams.py
from collections import defaultdict


def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups: defaultdict[tuple[int, ...], list[str]] = defaultdict(list)
    for s in strs:
        count = [0] * 26
        for ch in s:
            count[ord(ch) - ord("a")] += 1
        groups[tuple(count)].append(s)  # tuple băm được; list thì không
    return list(groups.values())


def group_anagrams_sorted(strs: list[str]) -> list[list[str]]:
    groups: defaultdict[str, list[str]] = defaultdict(list)
    for s in strs:
        groups["".join(sorted(s))].append(s)
    return list(groups.values())


inp = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(inp))
print(group_anagrams_sorted(inp))

try:
    {[1, 2]: "x"}
except TypeError as e:
    print("list làm khóa dict:", e)
