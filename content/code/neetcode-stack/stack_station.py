# Ga ARR-06: ngăn xếp. Giải 20, 155, 150 và 22, tự chạy test.
# Chạy: python3 stack_station.py


def is_valid(s: str) -> bool:  # 20
    open_ = {")": "(", "]": "[", "}": "{"}
    st: list[str] = []
    for ch in s:
        if ch not in open_:
            st.append(ch)
        elif not st or st.pop() != open_[ch]:
            return False
    return not st


class MinStack:  # 155: mỗi tầng nhớ kèm min tới tầng đó
    def __init__(self):
        self.st: list[tuple[int, int]] = []

    def push(self, x: int) -> None:
        self.st.append((x, min(x, self.st[-1][1]) if self.st else x))

    def pop(self) -> None:
        self.st.pop()

    def top(self) -> int:
        return self.st[-1][0]

    def get_min(self) -> int:
        return self.st[-1][1]


def eval_rpn(tokens: list[str]) -> int:  # 150
    st: list[int] = []
    for t in tokens:
        if t not in ("+", "-", "*", "/"):
            st.append(int(t))
            continue
        b, a = st.pop(), st.pop()
        if t == "+":
            st.append(a + b)
        elif t == "-":
            st.append(a - b)
        elif t == "*":
            st.append(a * b)
        else:
            st.append(int(a / b))  # KHÔNG dùng a // b: // làm tròn xuống (-7 // 2 = -4), đề cần làm tròn về 0 (-3)
    return st[0]


def generate_parenthesis(n: int) -> list[str]:  # 22
    out: list[str] = []
    cur: list[str] = []

    def go(open_: int, close: int) -> None:
        if len(cur) == 2 * n:
            out.append("".join(cur))
            return
        if open_ < n:
            cur.append("(")
            go(open_ + 1, close)
            cur.pop()
        if close < open_:
            cur.append(")")
            go(open_, close + 1)
            cur.pop()

    go(0, 0)
    return out


ms = MinStack()
for x in (-2, 0, -3):
    ms.push(x)
m1 = ms.get_min()
ms.pop()
tests = [
    is_valid("()[]{}"), not is_valid("([)]"), not is_valid("(("),
    m1 == -3 and ms.top() == 0 and ms.get_min() == -2,
    eval_rpn(["2", "1", "+", "3", "*"]) == 9, eval_rpn(["4", "13", "5", "/", "+"]) == 6,
    eval_rpn(["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]) == 22, eval_rpn(["-7", "2", "/"]) == -3,
    generate_parenthesis(3) == ["((()))", "(()())", "(())()", "()(())", "()()()"], len(generate_parenthesis(4)) == 14,
]
print(f"{sum(tests)}/{len(tests)} ca đúng")
print(f"-7 // 2 = {-7 // 2}, int(-7 / 2) = {int(-7 / 2)}")
