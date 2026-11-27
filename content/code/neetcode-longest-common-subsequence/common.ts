function lcsBrute(a: string, b: string, visits: { calls: number }): number {
    function solve(i: number, j: number): number {
        visits.calls++
        if (i === a.length || j === b.length) return 0
        if (a[i] === b[j]) return 1 + solve(i + 1, j + 1)
        return Math.max(solve(i + 1, j), solve(i, j + 1))
    }
    return solve(0, 0)
}

function lcsMemo(a: string, b: string, visits: { calls: number }): number {
    const cache = new Map<number, number>()
    function solve(i: number, j: number): number {
        visits.calls++
        if (i === a.length || j === b.length) return 0
        const key = i * (b.length + 1) + j
        const saved = cache.get(key)
        if (saved !== undefined) return saved
        const best = a[i] === b[j] ? 1 + solve(i + 1, j + 1) : Math.max(solve(i + 1, j), solve(i, j + 1))
        cache.set(key, best)
        return best
    }
    return solve(0, 0)
}

function lcsTable(a: string, b: string): number[][] {
    // dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1])
        }
    }
    return dp
}

function lcsRow(a: string, b: string): number {
    if (b.length > a.length) [a, b] = [b, a]
    const row = Array(b.length + 1).fill(0)
    for (let i = 1; i <= a.length; i++) {
        let diagonal = 0 // dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
        for (let j = 1; j <= b.length; j++) {
            const above = row[j]
            row[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : Math.max(above, row[j - 1])
            diagonal = above
        }
    }
    return row[b.length]
}

function rebuild(a: string, b: string, dp: number[][]): string {
    let i = a.length
    let j = b.length
    const out: string[] = []
    while (i > 0 && j > 0) {
        if (a[i - 1] === b[j - 1]) {
            out.push(a[i - 1])
            i--
            j--
        } else if (dp[i - 1][j] >= dp[i][j - 1]) {
            i--
        } else {
            j--
        }
    }
    return out.reverse().join('')
}

function isSubsequence(small: string, big: string): boolean {
    let k = 0
    for (const ch of big) if (k < small.length && ch === small[k]) k++
    return k === small.length
}

function bySubsets(a: string, b: string): number {
    let best = 0
    for (let mask = 0; mask < 1 << a.length; mask++) {
        let picked = ''
        for (let k = 0; k < a.length; k++) if ((mask >> k) & 1) picked += a[k]
        if (picked.length > best && isSubsequence(picked, b)) best = picked.length
    }
    return best
}

function allAgree(a: string, b: string, expected: number): boolean {
    const dp = lcsTable(a, b)
    const path = rebuild(a, b, dp)
    return dp[a.length][b.length] === expected && lcsRow(a, b) === expected &&
        path.length === expected && isSubsequence(path, a) && isSubsequence(path, b)
}

function check(ok: boolean) {
    if (!ok) throw new Error('ca kiểm tra sai')
}

const cases: [string, string, number][] = [
    ['bread', 'boardgame', 3],
    ['abc', 'abc', 3],
    ['abc', 'xyz', 0],
    ['a', 'a', 1],
    ['a', 'b', 0],
    ['ezupkr', 'ubmrapg', 2],
    ['abcba', 'abcbcba', 5],
    ['ab'.repeat(500), 'ba'.repeat(500), 999],
    ['a'.repeat(1000), 'a'.repeat(1000), 1000],
]
for (const [a, b, expected] of cases) {
    check(allAgree(a, b, expected))
    if (a.length <= 20) check(lcsMemo(a, b, { calls: 0 }) === expected)
}
console.log(`${cases.length}/${cases.length} ca đúng`)

const words: string[] = []
for (let size = 1; size <= 5; size++) {
    for (let mask = 0; mask < 1 << size; mask++) {
        let word = ''
        for (let k = size - 1; k >= 0; k--) word += (mask >> k) & 1 ? 'b' : 'a'
        words.push(word)
    }
}
let checked = 0
for (const a of words) {
    for (const b of words) {
        const expected = bySubsets(a, b)
        check(allAgree(a, b, expected) && lcsMemo(a, b, { calls: 0 }) === expected)
        if (a.length + b.length <= 8) check(lcsBrute(a, b, { calls: 0 }) === expected)
        checked++
    }
}
console.log(`${checked}/${checked} ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)`)

const bruteVisits = { calls: 0 }
const memoVisits = { calls: 0 }
lcsBrute('abcdefghij', 'klmnopqrst', bruteVisits)
lcsMemo('abcdefghij', 'klmnopqrst', memoVisits)
console.log(`Hai chuỗi 10 ký tự không chung chữ: vét cạn ${bruteVisits.calls} lượt gọi, memo ${memoVisits.calls} lượt gọi`)
console.log('Một LCS của bread và boardgame:', rebuild('bread', 'boardgame', lcsTable('bread', 'boardgame')))
