# Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
from itertools import product

calls = 0


def combination_sum_plain(candidates, target):
    """Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm."""
    global calls
    out, path = [], []

    def dfs(start, remain):
        global calls
        calls += 1
        if remain == 0:
            out.append(path[:])
            return
        if remain < 0:
            return
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            dfs(i, remain - candidates[i])  # vẫn là i: được dùng lại số này
            path.pop()

    dfs(0, target)
    return out


def combination_sum(candidates, target):
    """Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy."""
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
            if nums[i] > remain:
                break
            path.append(nums[i])
            dfs(i, remain - nums[i])  # vẫn là i: được dùng lại số này
            path.pop()

    dfs(0, target)
    return out


def count_ways(candidates, target):
    """DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách."""
    ways = [1] + [0] * target
    for c in candidates:
        for t in range(c, target + 1):
            ways[t] += ways[t - c]
    return ways[target]


def brute(candidates, target):
    """Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng."""
    out = []
    for counts in product(*[range(target // c + 1) for c in candidates]):
        if sum(k * c for k, c in zip(counts, candidates)) == target:
            out.append([c for k, c in zip(counts, candidates) for _ in range(k)])
    return out


def norm(combos):
    return sorted(sorted(c) for c in combos)


cases = [
    ([4, 5, 9], 9, [[4, 5], [9]]),
    ([3, 4, 7], 10, [[3, 3, 4], [3, 7]]),
    ([6], 4, []),
    ([8, 2, 5], 10, [[2, 2, 2, 2, 2], [2, 8], [5, 5]]),
    ([2, 3], 1, []),
    ([40], 40, [[40]]),
    ([39, 2], 3, []),
]
ok = 0
for cand, target, want in cases:
    got_plain = combination_sum_plain(cand, target)
    got = combination_sum(cand, target)
    if norm(got_plain) == norm(want) and norm(got) == norm(want) and len(got) == count_ways(cand, target):
        ok += 1
    else:
        print("sai ở", cand, target, got)
print(f"{ok}/{len(cases)} ca đúng")

pool = [2, 3, 4, 5, 6, 7]
ok = total = 0
for mask in range(1, 1 << len(pool)):
    cand = [pool[i] for i in range(len(pool)) if mask >> i & 1]
    for target in range(1, 15):
        total += 1
        want = norm(brute(cand, target))
        a = combination_sum(cand, target)
        b = combination_sum_plain(cand, target)
        if norm(a) == want and norm(b) == want and len(a) == count_ways(cand, target):
            ok += 1
        else:
            print("sai ở", cand, target)
print(f"{ok}/{total} ca đúng (đối chiếu vét số lần dùng)")

cand, target = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37], 40
calls = 0
n_plain = len(combination_sum_plain(cand, target))
plain_calls = calls
calls = 0
n_sorted = len(combination_sum(cand, target))
print(f"12 số nguyên tố tới 37, target 40: không cắt nhánh {plain_calls} lượt gọi, sắp xếp + cắt nhánh {calls} lượt gọi, {n_sorted} tổ hợp")
