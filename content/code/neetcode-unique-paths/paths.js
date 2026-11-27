const LIMIT = 2_000_000_000

function pathsBrute(m, n, visits) {
    function walk(r, c) {
        visits.calls++
        if (r === m - 1 && c === n - 1) return 1
        let total = 0
        if (r + 1 < m) total += walk(r + 1, c)
        if (c + 1 < n) total += walk(r, c + 1)
        return total
    }
    return walk(0, 0)
}

function pathsMemo(m, n, visits) {
    const cache = new Map()
    function walk(r, c) {
        visits.calls++
        if (r === m - 1 || c === n - 1) return 1
        const key = r * n + c
        const saved = cache.get(key)
        if (saved !== undefined) return saved
        const total = walk(r + 1, c) + walk(r, c + 1)
        cache.set(key, total)
        return total
    }
    return walk(0, 0)
}

function pathsTable(m, n) {
    const ways = Array.from({ length: m }, () => Array(n).fill(1))
    for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1]
        }
    }
    return ways[m - 1][n - 1]
}

function pathsRow(m, n) {
    const row = Array(n).fill(1)
    for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) row[c] += row[c - 1]
    }
    return row[n - 1]
}

function pathsFormula(m, n) {
    const k = Math.min(m, n) - 1
    const total = m + n - 2
    let result = 1
    for (let i = 1; i <= k; i++) {
        // nhân trước rồi chia: tích tối đa cỡ 4·10¹¹, vẫn dưới 2⁵³
        result = (result * (total - k + i)) / i
    }
    return result
}

function sameAnswer(m, n, expected) {
    return pathsTable(m, n) === expected && pathsRow(m, n) === expected && pathsFormula(m, n) === expected
}

function check(ok) {
    if (!ok) throw new Error('ca kiểm tra sai')
}

const cases = [
    [1, 1, 1], [1, 7, 1], [2, 2, 2], [3, 2, 3], [3, 7, 28], [10, 10, 48620], [23, 12, 193536720],
]
for (const [m, n, expected] of cases) {
    check(sameAnswer(m, n, expected) && pathsMemo(m, n, { calls: 0 }) === expected)
}
console.log(`${cases.length}/${cases.length} ca đúng`)

let checked = 0
for (let m = 1; m <= 8; m++) {
    for (let n = 1; n <= 8; n++) {
        const brute = pathsBrute(m, n, { calls: 0 })
        check(sameAnswer(m, n, brute) && pathsMemo(m, n, { calls: 0 }) === brute)
        checked++
    }
}
console.log(`${checked}/${checked} ca đúng (đối chiếu vét cạn, lưới tới 8×8)`)

// Pascal có chặn trên: ô nào vượt LIMIT thì giữ ở LIMIT + 1.
const pascal = Array.from({ length: 101 }, () => Array(101).fill(1))
for (let r = 2; r <= 100; r++) {
    for (let c = 2; c <= 100; c++) {
        pascal[r][c] = Math.min(pascal[r - 1][c] + pascal[r][c - 1], LIMIT + 1)
    }
}
let inside = 0
for (let m = 1; m <= 100; m++) {
    for (let n = 1; n <= 100; n++) {
        if (pascal[m][n] <= LIMIT) {
            check(sameAnswer(m, n, pascal[m][n]))
            inside++
        }
    }
}
console.log(`${inside}/${inside} ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)`)

const bruteVisits = { calls: 0 }
const memoVisits = { calls: 0 }
pathsBrute(10, 10, bruteVisits)
pathsMemo(10, 10, memoVisits)
console.log(`Lưới 10×10: vét cạn ${bruteVisits.calls} lượt gọi, memo ${memoVisits.calls} lượt gọi`)
