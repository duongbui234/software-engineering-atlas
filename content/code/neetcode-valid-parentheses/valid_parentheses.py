# LeetCode 20, Valid Parentheses: xóa cặp lặp, ngăn xếp, và bản pop không kiểm rỗng.
# Chạy: python3 valid_parentheses.py

OPEN = {")": "(", "]": "[", "}": "{"}


def replace_pairs(s: str) -> bool:
    prev = None
    while s != prev:
        prev = s
        s = s.replace("()", "").replace("[]", "").replace("{}", "")
    return s == ""


def stack(s: str) -> bool:
    st: list[str] = []  # list làm ngăn xếp: append và pop ở cuối đều O(1)
    for ch in s:
        if ch not in OPEN:
            st.append(ch)
        elif not st or st.pop() != OPEN[ch]:  # phải kiểm rỗng trước: pop() trên list rỗng ném IndexError
            return False
    return not st


def stack_unguarded(s: str) -> bool:  # SAI: quên kiểm rỗng trước khi pop
    st: list[str] = []
    for ch in s:
        if ch not in OPEN:
            st.append(ch)
        elif st.pop() != OPEN[ch]:
            return False
    return not st


cases = [("()", True), ("()[]{}", True), ("(]", False), ("([)]", False), ("{[]}", True),
         ("((", False), ("){", False), ("", True), ("(((([]))))", True)]
for fn in (replace_pairs, stack, stack_unguarded):
    ok, errs = 0, []
    for s, want in cases:
        try:
            ok += fn(s) == want
        except IndexError as e:
            errs.append(f"{s!r}: IndexError({e})")
    print(f"{fn.__name__:16} {ok}/{len(cases)} ca đúng" + (f"; lỗi ở {', '.join(errs)}" if errs else ""))
