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

const cases = [[[6,2,8,1],3], [[19,4],4], [[0,0,0,0],0], [[5,0,9,0,3],0], [Array(1000).fill(999),499500]]
for (const [input, expected] of cases) {
    const methods = candidates(input.length, i => input[i], Math.min, 0)
    if (input.length <= 18 && methods.brute() !== expected) throw new Error('Vét cạn sai')
    for (const method of [methods.memoized, methods.tabulated, methods.rolling]) {
        if (method() !== expected) throw new Error('Quy hoạch động sai')
    }
}
console.log(`${cases.length}/${cases.length} ca đúng`)
let calls = 0
const sample = Array(18).fill(7)
const choose = (a, b) => { calls++; return Math.min(a,b) }
candidates(sample.length, i => sample[i], choose, 0).brute()
const bruteChoices = calls
calls = 0
candidates(sample.length, i => sample[i], choose, 0).memoized()
console.log(`n=18: vét cạn ${bruteChoices}, memo ${calls} lần gộp`)
