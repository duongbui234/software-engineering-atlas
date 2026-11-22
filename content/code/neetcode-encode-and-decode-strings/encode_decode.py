# LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
# Chạy: python3 encode_decode.py


def join_encode(strs: list[str]) -> str:  # SAI: [] và [""] cùng ra ""
    return ",".join(strs)


def join_decode(s: str) -> list[str]:
    return s.split(",") if s else []


def escape_encode(strs: list[str]) -> str:
    return "".join(s.replace("/", "//").replace(",", "/,") + "," for s in strs)


def escape_decode(s: str) -> list[str]:
    out, cur, i = [], [], 0
    while i < len(s):
        if s[i] == "/":
            cur.append(s[i + 1])  # ký tự sau "/" luôn là chữ thật
            i += 2
            continue
        if s[i] == ",":
            out.append("".join(cur))
            cur = []
        else:
            cur.append(s[i])
        i += 1
    return out


def length_encode(strs: list[str]) -> str:
    return "".join(f"{len(s)}#{s}" for s in strs)  # len của str Python đếm code point


def length_decode(s: str) -> list[str]:
    out, i = [], 0
    while i < len(s):
        h = s.index("#", i)  # "#" đầu tiên từ i thuộc phần độ dài
        n = int(s[i:h])
        out.append(s[h + 1 : h + 1 + n])
        i = h + 1 + n
    return out


cases = [["neet", "code", "love", "you"], ["we", "say", ":", "yes"], [], [""], ["", ""],
         ["a,b", "c"], ["12#ab", "#"], ["a/", "/,"], ["😀é", "x"]]
for name, enc, dec in (("join(',')", join_encode, join_decode), ("thoát ký tự", escape_encode, escape_decode),
                       ("tiền tố độ dài", length_encode, length_decode)):
    bad = [c for c in cases if dec(enc(c)) != c]
    print(f"{name:15} {len(cases) - len(bad)}/{len(cases)} ca đúng" + (f"; sai ở {bad}" if bad else ""))
print(f'\nlen("😀") = {len("😀")}, len("😀".encode()) = {len("😀".encode())}')
