# Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
# Chạy: python3 choices.py


def subsets(nums):
    """Ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i."""
    result, path = [], []

    def walk(start):
        result.append(path[:])  # chép path, vì path còn đổi tiếp
        for i in range(start, len(nums)):
            path.append(nums[i])  # chọn
            walk(i + 1)  # đi sâu, mỗi phần tử dùng một lần
            path.pop()  # gỡ lựa chọn

    walk(0)
    return result


def subsets_with_dup(nums):
    """Sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước."""
    nums = sorted(nums)
    result, path = [], []

    def walk(start):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue  # trùng ở cùng tầng
            path.append(nums[i])
            walk(i + 1)
            path.pop()

    walk(0)
    return result


def combination_sum(candidates, target):
    """Chỉ ghi khi còn lại đúng 0; nhánh con bắt đầu lại từ i (được dùng lại)."""
    nums = sorted(candidates)
    result, path = [], []

    def walk(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(nums)):
            if nums[i] > remaining:
                break  # đã sắp xếp: các số sau còn lớn hơn
            path.append(nums[i])
            walk(i, remaining - nums[i])
            path.pop()

    walk(0, target)
    return result


def combination_sum2(candidates, target):
    """Mỗi số dùng một lần (i + 1) và bỏ trùng ở cùng tầng."""
    nums = sorted(candidates)
    result, path = [], []

    def walk(start, remaining):
        if remaining == 0:
            result.append(path[:])
            return
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            if nums[i] > remaining:
                break
            path.append(nums[i])
            walk(i + 1, remaining - nums[i])
            path.pop()

    walk(0, target)
    return result


KEYS = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl",
        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}


def letter_combinations(digits):
    """Tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá."""
    if not digits:
        return []
    result, path = [], []

    def walk(depth):
        if depth == len(digits):
            result.append("".join(path))
            return
        for letter in KEYS[digits[depth]]:
            path.append(letter)
            walk(depth + 1)
            path.pop()

    walk(0)
    return result


def normalize(lists):
    """So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi cả danh sách."""
    return sorted(x if isinstance(x, str) else ",".join(map(str, sorted(x))) for x in lists)


cases = [
    ("subsets [2,5,9]", lambda: subsets([2, 5, 9]), [[], [2], [2, 5], [2, 5, 9], [2, 9], [5], [5, 9], [9]]),
    ("subsets [7]", lambda: subsets([7]), [[], [7]]),
    ("subsets 10 số", lambda: subsets(list(range(1, 11))), 1024),
    ("subsetsWithDup [3,1,3]", lambda: subsets_with_dup([3, 1, 3]), [[], [1], [1, 3], [1, 3, 3], [3], [3, 3]]),
    ("subsetsWithDup [6,6,6]", lambda: subsets_with_dup([6, 6, 6]), [[], [6], [6, 6], [6, 6, 6]]),
    ("subsetsWithDup [4,4,1,4,2]", lambda: subsets_with_dup([4, 4, 1, 4, 2]), 16),
    ("combinationSum [3,4,5] 8", lambda: combination_sum([3, 4, 5], 8), [[3, 5], [4, 4]]),
    ("combinationSum [2,3,7] 9", lambda: combination_sum([2, 3, 7], 9), [[2, 2, 2, 3], [2, 7], [3, 3, 3]]),
    ("combinationSum [4] 3", lambda: combination_sum([4], 3), []),
    ("combinationSum [2,3,5,7] 20", lambda: combination_sum([2, 3, 5, 7], 20), 18),
    ("combinationSum2 [1,4,1,2,3,4] 6", lambda: combination_sum2([1, 4, 1, 2, 3, 4], 6), [[1, 1, 4], [1, 2, 3], [2, 4]]),
    ("combinationSum2 [3,3,2,4,3] 6", lambda: combination_sum2([3, 3, 2, 4, 3], 6), [[2, 4], [3, 3]]),
    ("combinationSum2 [5] 3", lambda: combination_sum2([5], 3), []),
    ("letterCombinations 47", lambda: letter_combinations("47"),
     ["gp", "gq", "gr", "gs", "hp", "hq", "hr", "hs", "ip", "iq", "ir", "is"]),
    ("letterCombinations 9", lambda: letter_combinations("9"), ["w", "x", "y", "z"]),
    ("letterCombinations 7979", lambda: letter_combinations("7979"), 256),
    ("letterCombinations rỗng", lambda: letter_combinations(""), []),
]

ok, fails = 0, []
for name, run, want in cases:
    got = run()
    if isinstance(want, int):
        passed = len(got) == want and len(set(normalize(got))) == want
    else:
        passed = normalize(got) == normalize(want)
    if passed:
        ok += 1
    else:
        fails.append(name)
print(f"{ok}/{len(cases)} ca đúng")
if fails:
    print("sai ở: " + "; ".join(fails))
