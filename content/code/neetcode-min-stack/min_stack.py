# LeetCode 155, Min Stack: bốn cách, một bản sai, test.
# Chạy: python3 min_stack.py


class ScanMinStack:  # getMin duyệt cả list: O(n)
    def __init__(self):
        self.a = []

    def push(self, x):
        self.a.append(x)

    def pop(self):
        self.a.pop()

    def top(self):
        return self.a[-1]

    def getMin(self):
        return min(self.a)


class PairMinStack:  # mỗi tầng là tuple (giá trị, min tới tầng này)
    def __init__(self):
        self.a = []

    def push(self, x):
        self.a.append((x, min(x, self.a[-1][1]) if self.a else x))

    def pop(self):
        self.a.pop()

    def top(self):
        return self.a[-1][0]

    def getMin(self):
        return self.a[-1][1]


class TwoStackMinStack:
    def __init__(self):
        self.a, self.mins = [], []

    def push(self, x):
        self.a.append(x)
        if not self.mins or x <= self.mins[-1]:  # phải là <=, không phải <
            self.mins.append(x)

    def pop(self):
        if self.a.pop() == self.mins[-1]:
            self.mins.pop()

    def top(self):
        return self.a[-1]

    def getMin(self):
        return self.mins[-1]


class DiffMinStack:  # int của Python không tràn, nên hiệu luôn chính xác
    def __init__(self):
        self.d, self.min = [], 0

    def push(self, x):
        if not self.d:
            self.d.append(0)
            self.min = x
            return
        self.d.append(x - self.min)
        self.min = min(self.min, x)

    def pop(self):
        diff = self.d.pop()
        if diff < 0:
            self.min -= diff

    def top(self):
        return self.min if self.d[-1] < 0 else self.min + self.d[-1]

    def getMin(self):
        return self.min


class StrictLessMinStack(TwoStackMinStack):  # SAI: thiếu dấu =
    def push(self, x):
        self.a.append(x)
        if not self.mins or x < self.mins[-1]:
            self.mins.append(x)


cases = [
    ("ví dụ của đề", [("push", -2), ("push", 0), ("push", -3), ("getMin",), ("pop",), ("top",), ("getMin",)], [-3, 0, -2]),
    ("min lặp lại", [("push", 0), ("push", 1), ("push", 0), ("getMin",), ("pop",), ("getMin",)], [0, 0]),
    ("tăng dần", [("push", 1), ("push", 2), ("push", 3), ("getMin",), ("pop",), ("pop",), ("getMin",)], [1, 1]),
    ("giảm dần", [("push", 3), ("push", 2), ("push", 1), ("getMin",), ("pop",), ("getMin",), ("pop",), ("getMin",)], [1, 2, 3]),
    ("biên 32 bit", [("push", 2**31 - 1), ("push", -(2**31)), ("getMin",), ("top",), ("pop",), ("getMin",), ("top",)],
     [-(2**31), -(2**31), 2**31 - 1, 2**31 - 1]),
    ("số lớn hơn 127", [("push", 500), ("pop",), ("push", 700), ("getMin",)], [700]),
]


def run(cls, ops):
    s, out = cls(), []
    for op in ops:
        if op[0] == "push":
            s.push(op[1])
        elif op[0] == "pop":
            s.pop()
        else:
            out.append(getattr(s, op[0])())
    return out


for cls in (ScanMinStack, PairMinStack, TwoStackMinStack, DiffMinStack, StrictLessMinStack):
    bad = []
    for name, ops, want in cases:
        try:
            if run(cls, ops) != want:
                bad.append(name)
        except IndexError as e:  # ngăn phụ đã rỗng mà vẫn đọc mins[-1]
            bad.append(f"{name} ({type(e).__name__})")
    print(f"{cls.__name__:19} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở: {', '.join(bad)}" if bad else ""))
