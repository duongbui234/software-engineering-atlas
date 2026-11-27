function interleaveSearch(s1, s2, s3, memo, visits) {
    if (s1.length + s2.length !== s3.length) return false
    const cache = memo ? new Map() : undefined
    function search(i, j) {
        visits.calls++
        if (i === s1.length && j === s2.length) return true
        const key = i * (s2.length + 1) + j
        const saved = cache?.get(key)
        if (saved !== undefined) return saved
        const k = i + j
        const found = (i < s1.length && s1[i] === s3[k] && search(i + 1, j)) ||
            (j < s2.length && s2[j] === s3[k] && search(i, j + 1))
        cache?.set(key, found)
        return found
    }
    return search(0, 0)
}

function interleaveTable(s1, s2, s3) {
    const m = s1.length, n = s2.length
    if (m + n !== s3.length) return false
    // ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
    const ok = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false))
    ok[0][0] = true
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i > 0 && ok[i - 1][j] && s1[i - 1] === s3[i + j - 1]) ok[i][j] = true
            if (j > 0 && ok[i][j - 1] && s2[j - 1] === s3[i + j - 1]) ok[i][j] = true
        }
    }
    return ok[m][n]
}

function interleaveRow(s1, s2, s3) {
    const m = s1.length, n = s2.length
    if (m + n !== s3.length) return false
    const row = Array(n + 1).fill(false)
    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0 && j === 0) {
                row[j] = true
                continue
            }
            // row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
            const fromTop = i > 0 && row[j] && s1[i - 1] === s3[i + j - 1]
            const fromLeft = j > 0 && row[j - 1] && s2[j - 1] === s3[i + j - 1]
            row[j] = fromTop || fromLeft
        }
    }
    return row[n]
}

function interleaveAll(s1, s2, s3) {
    const answers = [interleaveTable(s1, s2, s3), interleaveRow(s1, s2, s3),
        interleaveSearch(s1, s2, s3, true, { calls: 0 })]
    if (s3.length <= 24) answers.push(interleaveSearch(s1, s2, s3, false, { calls: 0 }))
    return answers
}

const a = (count) => 'a'.repeat(count)
const cases = [
    ['ab', 'cd', 'acbd', true],
    ['ab', 'cd', 'acdb', true],
    ['ab', 'cd', 'badc', false],
    ['ab', 'ac', 'acab', true],
    ['a', 'b', 'abc', false],
    ['', '', '', true],
    ['', 'kiwi', 'kiwi', true],
    ['', 'kiwi', 'kiwj', false],
    ['aab', 'aac', 'aacaab', true],
    ['aab', 'aac', 'abaaac', false],
    [a(100), a(100), a(200), true],
    [a(100), a(99) + 'b', a(198) + 'ba', true],
    [a(100), a(99) + 'b', a(198) + 'bb', false],
]
for (const [s1, s2, s3, expected] of cases) {
    if (interleaveAll(s1, s2, s3).some(answer => answer !== expected)) throw new Error('Ca kiểm tra sai')
}
console.log(`${cases.length}/${cases.length} ca đúng`)

function interleaveOracle(s1, s2, s3) {
    const total = s3.length
    if (s1.length + s2.length !== total) return false
    for (let mask = 0; mask < 1 << total; mask++) {
        let first = '', second = ''
        for (let k = 0; k < total; k++) {
            if (mask & (1 << k)) first += s3[k]
            else second += s3[k]
        }
        if (first === s1 && second === s2) return true
    }
    return false
}

function stringsOf(size) {
    const out = []
    for (let mask = 0; mask < 1 << size; mask++) {
        let word = ''
        for (let k = size - 1; k >= 0; k--) word += mask & (1 << k) ? 'b' : 'a'
        out.push(word)
    }
    return out
}

const words = [0, 1, 2, 3].flatMap(stringsOf)
let probes = 0
for (const s1 of words) {
    for (const s2 of words) {
        for (const size of [s1.length + s2.length, s1.length + s2.length + 1]) {
            for (const s3 of stringsOf(size)) {
                const expected = interleaveOracle(s1, s2, s3)
                if (interleaveAll(s1, s2, s3).some(answer => answer !== expected)) {
                    throw new Error('Ca vét đối chiếu sai')
                }
                probes++
            }
        }
    }
}
console.log(`${probes}/${probes} ca đúng (vét mọi cách chia)`)

const brute = { calls: 0 }, memo = { calls: 0 }
interleaveSearch(a(10), a(10), a(19) + 'b', false, brute)
interleaveSearch(a(10), a(10), a(19) + 'b', true, memo)
console.log(`Vét cạn: ${brute.calls} lượt gọi, memo: ${memo.calls} lượt gọi`)
