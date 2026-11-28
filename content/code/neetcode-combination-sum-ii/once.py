# Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
from itertools import product

calls = 0


def combination_sum2(candidates, target):
    """Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại."""
    global calls
    nums = sorted(candidates)
    out, path = [], []

    def dfs(start, remain):
        global calls
        calls += 1
        if remain == 0:
            out.append(path[:])
            return
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue  # cùng tầng đã thử giá trị này rồi
            if nums[i] > remain:
                break
            path.append(nums[i])
            dfs(i + 1, remain - nums[i])  # i + 1: vị trí này đã dùng
            path.pop()

    dfs(0, target)
    return out


def combination_sum2_set(candidates, target):
    """Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa."""
    global calls
    nums = sorted(candidates)
    seen, out, path = set(), [], []

    def dfs(start, remain):
        global calls
        calls += 1
        if remain == 0:
            key = tuple(path)
            if key not in seen:
                seen.add(key)
                out.append(path[:])
            return
        for i in range(start, len(nums)):
            if nums[i] > remain:
                break
            path.append(nums[i])
            dfs(i + 1, remain - nums[i])
            path.pop()

    dfs(0, target)
    return out


def brute(candidates, target):
    """Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng."""
    seen = set()
    n = len(candidates)
    for mask in range(1 << n):
        pick = sorted(candidates[i] for i in range(n) if mask >> i & 1)
        if sum(pick) == target:
            seen.add(tuple(pick))
    return [list(t) for t in seen]


def norm(combos):
    return sorted(sorted(c) for c in combos)


cases = [
    ([3, 1, 3, 5, 1, 1], 8, [[1, 1, 1, 5], [1, 1, 3, 3], [3, 5]]),
    ([2, 2, 2], 4, [[2, 2]]),
    ([5], 3, []),
    ([4, 1, 4, 1], 5, [[1, 4]]),
    ([1] * 20, 10, [[1] * 10]),
    ([6, 2, 4, 2], 6, [[2, 4], [6]]),
    ([50, 30], 30, [[30]]),
]
ok = 0
for cand, target, want in cases:
    a = combination_sum2(cand, target)
    b = combination_sum2_set(cand, target)
    if norm(a) == norm(want) and norm(b) == norm(want) and len(a) == len(norm(a)) == len({tuple(x) for x in a}):
        ok += 1
    else:
        print("sai ở", cand, target, a)
print(f"{ok}/{len(cases)} ca đúng")

ok = total = 0
for n in range(1, 7):
    for cand in product([1, 2, 3], repeat=n):
        cand = list(cand)
        for target in range(1, 9):
            total += 1
            want = norm(brute(cand, target))
            a = combination_sum2(cand, target)
            if norm(a) == want and len(a) == len(want) and norm(combination_sum2_set(cand, target)) == want:
                ok += 1
            else:
                print("sai ở", cand, target)
print(f"{ok}/{total} ca đúng (đối chiếu vét tập con)")

calls = 0
combination_sum2_set([1] * 20, 10)
set_calls = calls
calls = 0
combination_sum2([1] * 20, 10)
print(f"20 số 1, target 10: khử trùng bằng tập {set_calls} lượt gọi, bỏ trùng cùng tầng {calls} lượt gọi")
