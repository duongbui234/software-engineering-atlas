const CAP = 2 ** 31 // đáp án LeetCode luôn nhỏ hơn mức này

function countSearch(s: string, t: string, memo: boolean, visits: { calls: number }) {
    const cache = memo ? new Map<number, number>() : undefined
    function search(i: number, j: number): number {
        visits.calls++
        if (j === t.length) return 1
        if (s.length - i < t.length - j) return 0
        const key = i * (t.length + 1) + j
        const saved = cache?.get(key)
        if (saved !== undefined) return saved
        let ways = search(i + 1, j)
        if (s[i] === t[j]) ways = Math.min(ways + search(i + 1, j + 1), CAP)
        cache?.set(key, ways)
        return ways
    }
    return search(0, 0)
}

function countTable(s: string, t: string) {
    const m = s.length, n = t.length
    // ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
    const ways = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    for (let i = 0; i <= m; i++) ways[i][0] = 1
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            ways[i][j] = ways[i - 1][j]
            if (s[i - 1] === t[j - 1]) ways[i][j] = Math.min(ways[i][j] + ways[i - 1][j - 1], CAP)
        }
    }
    return ways[m][n]
}

function fillRow(s: string, t: string, cap: number) {
    const row: number[] = [1, ...Array(t.length).fill(0)]
    for (const ch of s) {
        // đi ngược để row[j - 1] vẫn là giá trị của hàng trước
        for (let j = t.length; j >= 1; j--) {
            if (ch === t[j - 1]) row[j] = Math.min(row[j] + row[j - 1], cap)
        }
    }
    return row
}

function countRow(s: string, t: string, cap = CAP) {
    return fillRow(s, t, cap)[t.length]
}

function countAll(s: string, t: string) {
    const answers = [countTable(s, t), countRow(s, t), countSearch(s, t, true, { calls: 0 })]
    if (s.length <= 20) answers.push(countSearch(s, t, false, { calls: 0 }))
    return answers
}

const a = (count: number) => 'a'.repeat(count)
const cases: [string, string, number][] = [
    ['banana', 'ban', 3],
    ['banana', 'ana', 4],
    ['aaa', 'aa', 3],
    ['ab', 'abc', 0],
    ['abc', 'd', 0],
    ['Aa', 'a', 1],
    ['mississippi', 'sip', 12],
    [a(1000), a(3), 166167000],
    [a(1000), a(1000), 1],
    [a(1000), a(499) + 'b', 0],
    ['ab'.repeat(100), 'abab', 4249575],
]
for (const [s, t, expected] of cases) {
    if (countAll(s, t).some(answer => answer !== expected)) throw new Error('Ca kiểm tra sai')
}
console.log(`${cases.length}/${cases.length} ca đúng`)

function countOracle(s: string, t: string) {
    let found = 0
    for (let mask = 0; mask < 1 << s.length; mask++) {
        let picked = ''
        for (let k = 0; k < s.length; k++) if (mask & (1 << k)) picked += s[k]
        if (picked === t) found++
    }
    return found
}

function stringsOf(size: number) {
    const out: string[] = []
    for (let mask = 0; mask < 1 << size; mask++) {
        let word = ''
        for (let k = size - 1; k >= 0; k--) word += mask & (1 << k) ? 'b' : 'a'
        out.push(word)
    }
    return out
}

let probes = 0
for (let size = 0; size < 8; size++) {
    for (const s of stringsOf(size)) {
        for (const t of [1, 2, 3].flatMap(stringsOf)) {
            const expected = countOracle(s, t)
            if (countAll(s, t).some(answer => answer !== expected) ||
                countRow(s, t, 3) !== Math.min(expected, 3)) {
                throw new Error('Ca vét đối chiếu sai')
            }
            probes++
        }
    }
}
console.log(`${probes}/${probes} ca đúng (vét mọi tập vị trí)`)

const row = fillRow(a(1000), a(499) + 'b', CAP)
const full = row.filter(value => value === CAP).length
console.log(`Hàng cuối: ${full}/${row.length} ô chạm 2^31, đáp án ${row[500]}`)
