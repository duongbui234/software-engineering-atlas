# LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng, một bản sai, test.
# Chạy: python3 eval_rpn.py
import sys

OPS = {"+", "-", "*", "/"}


def apply(op: str, a: int, b: int) -> int:
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    return int(a / b)  # làm tròn về 0; a // b thì làm tròn XUỐNG (về −∞)


def eval_stack(tokens: list[str]) -> int:
    st: list[int] = []
    for t in tokens:
        if t in OPS:  # so cả token: "-11" không nằm trong tập toán tử
            b, a = st.pop(), st.pop()
            st.append(apply(t, a, b))
        else:
            st.append(int(t))
    return st[0]


def eval_recursive(tokens: list[str]) -> int:
    i = len(tokens) - 1

    def go() -> int:
        nonlocal i
        t = tokens[i]
        i -= 1
        if t not in OPS:
            return int(t)
        b = go()
        a = go()
        return apply(t, a, b)

    return go()


def eval_floor_div(tokens: list[str]) -> int:  # SAI: dùng //
    st: list[int] = []
    for t in tokens:
        if t in OPS:
            b, a = st.pop(), st.pop()
            st.append(a // b if t == "/" else apply(t, a, b))
        else:
            st.append(int(t))
    return st[0]


cases = [
    (["2", "1", "+", "3", "*"], 9),
    (["4", "13", "5", "/", "+"], 6),
    (["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"], 22),
    (["3", "4", "-"], -1),
    (["7", "-2", "/"], -3),
    (["-7", "2", "/"], -3),
    (["42"], 42),
]
for fn in (eval_stack, eval_recursive, eval_floor_div):
    bad = [f"[{' '.join(t)}] → {fn(t)}" for t, want in cases if fn(t) != want]
    print(f"{fn.__name__:14} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {', '.join(bad)}" if bad else ""))

print(f"\n-7 // 2 = {-7 // 2}, int(-7 / 2) = {int(-7 / 2)}")
deep = ["1"] + ["1", "+"] * 5000
try:
    eval_recursive(deep)
    print("đệ quy 5000 tầng: chạy được")
except RecursionError as e:
    print(f"đệ quy 5000 tầng: {type(e).__name__} (giới hạn mặc định {sys.getrecursionlimit()})")
print(f"ngăn xếp 5000 tầng: {eval_stack(deep)}")
