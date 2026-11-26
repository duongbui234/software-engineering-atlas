function candidates(n, add, choose, base) {
    function brute(i) {
        return i < 2 ? base : choose(brute(i - 1) + add(i - 1), brute(i - 2) + add(i - 2))
    }

    const cache = new Map()
    function memoized(i) {
        if (i < 2) return base
        const saved = cache.get(i)
        if (saved !== undefined) return saved
        const answer = choose(memoized(i - 1) + add(i - 1), memoized(i - 2) + add(i - 2))
        cache.set(i, answer)
        return answer
    }

    function tabulated() {
        const dp = [base, base]
        for (let i = 2; i <= n; i++) {
            dp[i] = choose(dp[i - 1] + add(i - 1), dp[i - 2] + add(i - 2))
        }
        return dp[n]
    }

    function rolling() {
        let twoBack = base
        let oneBack = base
        for (let i = 2; i <= n; i++) {
            const next = choose(oneBack + add(i - 1), twoBack + add(i - 2))
            twoBack = oneBack
            oneBack = next
        }
        return oneBack
    }

    return { brute: () => brute(n), memoized: () => memoized(n), tabulated, rolling }
}

const cases = [[1,1],[4,5],[8,34],[24,75025],[45,1836311903]]
for (const [input, expected] of cases) {
    const methods = candidates(input, () => 0, (a,b) => a+b, 1)
    if (input <= 24 && methods.brute() !== expected) throw new Error('Vét cạn sai')
    for (const method of [methods.memoized, methods.tabulated, methods.rolling]) {
        if (method() !== expected) throw new Error('Quy hoạch động sai')
    }
}
console.log(`${cases.length}/${cases.length} ca đúng`)
let calls = 0
const choose = (a, b) => { calls++; return a+b }
candidates(24, () => 0, choose, 1).brute()
const bruteChoices = calls
calls = 0
candidates(24, () => 0, choose, 1).memoized()
console.log(`n=24: vét cạn ${bruteChoices}, memo ${calls} lần gộp`)
