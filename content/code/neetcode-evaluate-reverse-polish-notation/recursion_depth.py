# Đo độ sâu đệ quy tối đa trong Python.
# Chạy: python3 recursion_depth.py
import sys
def ev(tokens):
    i = len(tokens) - 1
    def go():
        nonlocal i
        t = tokens[i]; i -= 1
        if t != "+": return int(t)
        b = go(); a = go(); return a + b
    return go()
def ok(n):
    try: ev(["1"] + ["1", "+"] * n); return True
    except RecursionError: return False
lo, hi = 1, 5000
while lo < hi:
    m = (lo + hi + 1) // 2
    lo, hi = (m, hi) if ok(m) else (lo, m - 1)
print("Python max depth", lo, "limit", sys.getrecursionlimit(), sys.version.split()[0])
