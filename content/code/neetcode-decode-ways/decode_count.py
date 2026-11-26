def decode_count(s):
    before_previous, previous = 0, 1
    for i, digit in enumerate(s):
        current = 0 if digit == "0" else previous
        if i > 0 and (s[i - 1] == "1" or (s[i - 1] == "2" and digit <= "6")):
            current += before_previous
        if current == 0:
            return 0
        before_previous, previous = previous, current
    return previous

def decode_by_cuts(s, memoized):
    memo = {}

    def visit(index):
        if index == len(s):
            return 1
        if s[index] == "0":
            return 0
        if index in memo:
            return memo[index]
        count = visit(index + 1)
        if index + 1 < len(s) and 10 <= int(s[index:index + 2]) <= 26:
            count += visit(index + 2)
        if memoized:
            memo[index] = count
        return count

    return visit(0)

def check(got, expected):
    if got != expected:
        raise ValueError(("want", expected, "got", got))

check(decode_count("11204"), 2)
check(decode_by_cuts("11204", True), 2)
check(decode_by_cuts("11204", False), 2)
check(decode_count("27"), 1)
check(decode_by_cuts("27", True), 1)
check(decode_by_cuts("27", False), 1)
check(decode_count("1010"), 1)
check(decode_by_cuts("1010", True), 1)
check(decode_by_cuts("1010", False), 1)
check(decode_count("100"), 0)
check(decode_by_cuts("100", True), 0)
check(decode_by_cuts("100", False), 0)
check(decode_count("07"), 0)
check(decode_by_cuts("07", True), 0)
check(decode_by_cuts("07", False), 0)
check(decode_count("1234"), 3)
check(decode_by_cuts("1234", True), 3)
check(decode_by_cuts("1234", False), 3)
check(decode_count("301"), 0)
check(decode_by_cuts("301", True), 0)
check(decode_by_cuts("301", False), 0)
check(decode_count("9"), 1)
check(decode_by_cuts("9", True), 1)
check(decode_by_cuts("9", False), 1)
check(decode_count("0"), 0)
check(decode_by_cuts("0", True), 0)
check(decode_by_cuts("0", False), 0)
check(decode_count("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0)
check(decode_by_cuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", True), 0)
print("10/10 ca đúng")
