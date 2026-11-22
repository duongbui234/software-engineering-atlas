# LeetCode 125, Valid Palindrome: hai cách và test.
# Chạy: python3 valid_palindrome.py


def clean_reverse(s: str) -> bool:
    clean = [c.lower() for c in s if c.isascii() and c.isalnum()]
    return clean == clean[::-1]


def two_pointers(s: str) -> bool:
    i, j = 0, len(s) - 1
    while i < j:
        if not (s[i].isascii() and s[i].isalnum()):
            i += 1
        elif not (s[j].isascii() and s[j].isalnum()):
            j -= 1
        elif s[i].lower() != s[j].lower():
            return False
        else:
            i, j = i + 1, j - 1
    return True


def unicode_isalnum(s: str) -> bool:  # khác đề: isalnum() nhận cả chữ Unicode như "é", "²"
    clean = [c.lower() for c in s if c.isalnum()]
    return clean == clean[::-1]


cases = [("A man, a plan, a canal: Panama", True), ("race a car", False), (" ", True), ("", True),
         ("0P", False), ("a_", True), ("No 'x' in Nixon", True), (".,", True), ("a²", True)]
for fn in (clean_reverse, two_pointers, unicode_isalnum):
    bad = [s for s, want in cases if fn(s) != want]
    print(f"{fn.__name__:15} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {bad}" if bad else ""))
