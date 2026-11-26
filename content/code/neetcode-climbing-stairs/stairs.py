def check(n, add, choose, base, expected, small):
    def brute(i):
        if i < 2:
            return base
        return choose(brute(i - 1) + add(i - 1), brute(i - 2) + add(i - 2))

    # Tránh giới hạn đệ quy Python khi đề cho n tới 1000.
    def table():
        dp = [base, base]
        for i in range(2, n + 1):
            dp.append(choose(dp[i - 1] + add(i - 1), dp[i - 2] + add(i - 2)))
        return dp[n]

    def rolling():
        two_back = one_back = base
        for i in range(2, n + 1):
            two_back, one_back = one_back, choose(one_back + add(i - 1), two_back + add(i - 2))
        return one_back

    if small:
        assert brute(n) == expected
    assert table() == expected
    assert rolling() == expected

cases = [[1,1],[4,5],[8,34],[24,75025],[45,1836311903]]
for value, expected in cases:
    check(value, lambda _: 0, int.__add__, 1, expected, value <= 24)
print(f"{len(cases)}/{len(cases)} ca đúng")
