# Ga ARR-05: cửa sổ trượt. Giải 121, 3, 424, 567, 76, 239 và tự chạy test.
# Chạy: python3 sliding_window.py
from collections import Counter, deque


def max_profit(prices: list[int]) -> int:  # 121
    left, best = 0, 0
    for right in range(1, len(prices)):
        if prices[right] < prices[left]:
            left = right
        else:
            best = max(best, prices[right] - prices[left])
    return best


def length_of_longest_substring(s: str) -> int:  # 3
    last: dict[str, int] = {}
    left = best = 0
    for right, ch in enumerate(s):
        if last.get(ch, -1) >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best


def character_replacement(s: str, k: int) -> int:  # 424
    count: Counter[str] = Counter()
    left = max_freq = best = 0
    for right, ch in enumerate(s):
        count[ch] += 1
        max_freq = max(max_freq, count[ch])
        if right - left + 1 - max_freq > k:
            count[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return best


def check_inclusion(s1: str, s2: str) -> bool:  # 567
    n = len(s1)
    need, have = Counter(s1), Counter(s2[:n])
    if need == have:
        return True
    for right in range(n, len(s2)):
        have[s2[right]] += 1
        have[s2[right - n]] -= 1  # Counter so bằng nhau bỏ qua khóa có giá trị 0 (từ Python 3.10)
        if have == need:
            return True
    return False


def min_window(s: str, t: str) -> str:  # 76
    need, missing = Counter(t), len(t)
    left, best = 0, (0, float("inf"))
    for right, ch in enumerate(s):
        if need[ch] > 0:
            missing -= 1
        need[ch] -= 1
        while missing == 0:
            if right - left + 1 < best[1]:
                best = (left, right - left + 1)
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1
    return "" if best[1] == float("inf") else s[best[0] : best[0] + best[1]]


def max_sliding_window(nums: list[int], k: int) -> list[int]:  # 239
    dq: deque[int] = deque()  # deque.popleft là O(1); list.pop(0) là O(n)
    out = []
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:
            dq.popleft()
        if i >= k - 1:
            out.append(nums[dq[0]])
    return out


tests = [
    max_profit([7, 1, 5, 3, 6, 4]) == 5, max_profit([7, 6, 4, 3, 1]) == 0,
    length_of_longest_substring("abcabcbb") == 3, length_of_longest_substring("abba") == 2,
    character_replacement("ABAB", 2) == 4, character_replacement("AABABBA", 1) == 4,
    check_inclusion("ab", "eidbaooo") is True, check_inclusion("ab", "eidboaoo") is False,
    min_window("ADOBECODEBANC", "ABC") == "BANC", min_window("a", "aa") == "",
    max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3) == [3, 3, 5, 5, 6, 7], max_sliding_window([1], 1) == [1],
]
print(f"{sum(tests)}/{len(tests)} ca đúng")
