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

cases = [[[6,2,8,1],3], [[19,4],4], [[0,0,0,0],0], [[5,0,9,0,3],0], [[999] * 1000,499500]]
for value, expected in cases:
    check(len(value), value.__getitem__, min, 0, expected, len(value) <= 18)
print(f"{len(cases)}/{len(cases)} ca đúng")
