# LeetCode 22, Generate Parentheses: ba cách, test và đo.
# Chạy: python3 generate_parentheses.py
import sys
import time
from itertools import product
from math import comb


def generate_all_filter(n: int) -> list[str]:
    out = []
    for chars in product("()", repeat=2 * n):  # 2^(2n) bộ
        bal = 0
        for ch in chars:
            bal += 1 if ch == "(" else -1
            if bal < 0:
                break
        if bal == 0:
            out.append("".join(chars))
    return out


def backtrack(n: int) -> list[str]:
    out, cur = [], []  # cur là list: append/pop O(1); str bất biến nên không "pop" được
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


def backtrack_concat(n: int) -> list[str]:
    out = []
    def go(s: str, open_: int, close: int) -> None:  # s + "(" tạo chuỗi mới mỗi lần: không cần bỏ ra
        if len(s) == 2 * n:
            out.append(s)
            return
        if open_ < n:
            go(s + "(", open_ + 1, close)
        if close < open_:
            go(s + ")", open_, close + 1)
    go("", 0, 0)
    return out


def explicit_stack(n: int) -> list[str]:
    out, st = [], [("", 0, 0)]
    while st:
        s, open_, close = st.pop()
        if len(s) == 2 * n:
            out.append(s)
            continue
        if close < open_:
            st.append((s + ")", open_, close + 1))
        if open_ < n:
            st.append((s + "(", open_ + 1, close))
    return out


def valid(s: str) -> bool:
    bal = 0
    for ch in s:
        bal += 1 if ch == "(" else -1
        if bal < 0:
            return False
    return bal == 0


def correct(out: list[str], n: int) -> bool:
    catalan = comb(2 * n, n) // (n + 1)
    return len(out) == catalan and len(set(out)) == len(out) and all(len(s) == 2 * n and valid(s) for s in out)


ns = range(1, 9)
for fn in (generate_all_filter, backtrack, backtrack_concat, explicit_stack):
    ok = sum(correct(fn(n), n) for n in ns)
    print(f"{fn.__name__:20} {ok}/{len(ns)} ca đúng")


def med(fn, n, runs=3):
    ts = []
    for _ in range(runs):
        t = time.perf_counter()
        fn(n)
        ts.append((time.perf_counter() - t) * 1000)
    return sorted(ts)[runs // 2]


print(f"\nn    sinh hết rồi lọc  list+join  nối chuỗi  ngăn xếp   (ms, trung vị 3 lần)")
for n in (8, 10, 12):
    print(f"{n:<4} {med(generate_all_filter, n, 1 if n == 12 else 3):16.1f} {med(backtrack, n):10.1f} {med(backtrack_concat, n):10.1f} {med(explicit_stack, n):9.1f}")
print(f"\ngiới hạn đệ quy mặc định: {sys.getrecursionlimit()}; quay lui sâu tối đa 2n + 1 tầng")
