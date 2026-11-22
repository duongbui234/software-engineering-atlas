# Ga ARR-03: tiền tố, hậu tố và mã hóa. Giải 271 và 238, tự chạy test.
# Chạy: python3 prefix_suffix_encoding.py


def encode(strs: list[str]) -> str:  # 271
    return "".join(f"{len(s)}#{s}" for s in strs)


def decode(s: str) -> list[str]:
    out, i = [], 0
    while i < len(s):
        h = s.index("#", i)
        n = int(s[i:h])
        out.append(s[h + 1 : h + 1 + n])
        i = h + 1 + n
    return out


def product_except_self(nums: list[int]) -> list[int]:  # 238
    out = [1] * len(nums)
    left = 1
    for i, x in enumerate(nums):
        out[i] = left
        left *= x
    right = 1
    for i in range(len(nums) - 1, -1, -1):
        out[i] *= right
        right *= nums[i]
    return out


tests = [
    decode(encode(["neet", "code", "love", "you"])) == ["neet", "code", "love", "you"],
    decode(encode([])) == [], decode(encode([""])) == [""], decode(encode(["12#ab", "#"])) == ["12#ab", "#"],
    product_except_self([1, 2, 3, 4]) == [24, 12, 8, 6], product_except_self([-1, 1, 0, -3, 3]) == [0, 0, 9, 0, 0],
    product_except_self([0, 0, 5]) == [0, 0, 0],
]
print(f"{sum(tests)}/{len(tests)} ca đúng")
