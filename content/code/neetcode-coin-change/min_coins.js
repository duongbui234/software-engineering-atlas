function minCoins(coins, amount) {
    const impossible = amount + 1
    const dp = Array(amount + 1).fill(impossible)
    dp[0] = 0

    for (const coin of coins) {
        for (let sum = coin; sum <= amount; sum++) {
            dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1)
        }
    }
    return dp[amount] === impossible ? -1 : dp[amount]
}

function byAmount(coins, amount) {
    const impossible = amount + 1
    const dp = Array(amount + 1).fill(impossible)
    dp[0] = 0

    for (let sum = 1; sum <= amount; sum++) {
        for (const coin of coins) {
            if (coin <= sum) dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1)
        }
    }
    return dp[amount] === impossible ? -1 : dp[amount]
}

function search(coins, amount, useMemo) {
    const impossible = amount + 1
    const memo = Array(amount + 1).fill(-1)
    let calls = 0

    function visit(remaining) {
        calls++
        if (remaining === 0) return 0
        if (useMemo && memo[remaining] !== -1) return memo[remaining]

        let best = impossible
        for (const coin of coins) {
            if (coin <= remaining) best = Math.min(best, visit(remaining - coin) + 1)
        }
        if (useMemo) memo[remaining] = best
        return best
    }

    const best = visit(amount)
    return { value: best === impossible ? -1 : best, calls }
}

const cases = [
    [[4, 7], 14, 2],
    [[4, 7], 13, -1],
    [[1, 5, 7], 10, 2],
    [[1], 10000, 10000],
    [[2147483647, 3], 9, 3],
    [[8, 9], 0, 0],
    [[4, 6], 7, -1],
    [[9, 4], 12, 3],
    [[14, 21], 28, 2],
    [[10, 15, 25], 30, 2],
]
for (const [coins, amount, want] of cases) {
    if (minCoins(coins, amount) !== want || byAmount(coins, amount) !== want) {
        throw new Error(`DP sai với ${coins}, A=${amount}`)
    }
    if (amount <= 30 && [false, true].some(useMemo => search(coins, amount, useMemo).value !== want)) {
        throw new Error(`Đệ quy sai với ${coins}, A=${amount}`)
    }
}
console.log(`${cases.length}/${cases.length} ca đúng`)
const brute = search([4, 6, 9], 36, false)
const memoized = search([4, 6, 9], 36, true)
if (brute.value !== 4 || memoized.value !== brute.value) throw new Error('Ca đo sai')
console.log(`A=36: vét cạn ${brute.calls}, memo ${memoized.calls} lượt gọi`)
