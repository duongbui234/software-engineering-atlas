def palindromes(text, reuse_mirror):
    last = 2 * len(text)
    radius = [0] * (last + 1) if reuse_mirror else []
    center = right = start = best = count = 0

    for i in range(last + 1):
        length = min(radius[2 * center - i], right - i) if reuse_mirror and i < right else 0
        while i - length > 0 and i + length < last:
            left, next_pos = i - length - 1, i + length + 1
            if left % 2 and text[left // 2] != text[next_pos // 2]:
                break
            length += 1
        if reuse_mirror:
            radius[i] = length
            if i + length > right:
                center, right = i, i + length
        if length > best:
            start, best = (i - length) // 2, length
        count += (length + 1) // 2
    return start, best, count


def longest_palindrome(text, reuse_mirror=False):
    start, length, _ = palindromes(text, reuse_mirror)
    return text[start:start + length]

def count_substrings(text, reuse_mirror=False):
    return palindromes(text, reuse_mirror)[2]

# EXAMPLE
text = "xabbaq"
for reuse_mirror in (False, True):
    assert longest_palindrome(text, reuse_mirror) == "abba"
    assert count_substrings(text, reuse_mirror) == 8
print("2/2 ca đúng")
