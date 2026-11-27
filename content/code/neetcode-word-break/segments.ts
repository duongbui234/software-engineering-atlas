function searchWordBreak(s: string, words: string[], memo: boolean, visits: { calls: number }) {
    const cache = memo ? new Map<number, boolean>() : undefined
    function search(i: number): boolean {
        visits.calls++
        if (i === s.length) return true
        const saved = cache?.get(i)
        if (saved !== undefined) return saved

        let found = false
        for (const word of words) {
            if (s.startsWith(word, i) && search(i + word.length)) {
                found = true
                break
            }
        }
        cache?.set(i, found)
        return found
    }
    return search(0)
}

function wordBreakDp(s: string, words: string[]) {
    const reachable = Array(s.length + 1).fill(false)
    reachable[0] = true
    for (let i = 0; i < s.length; i++) {
        if (!reachable[i]) continue
        for (const word of words) {
            if (s.startsWith(word, i)) reachable[i + word.length] = true
        }
    }
    return reachable[s.length]
}

const maxWord = 'abcdefghijklmnopqrst'
const lateFailure = 'a'.repeat(18) + 'b'
const cases: [string, string[], boolean][] = [
    ['cabin', ['cab', 'ca', 'bin'], true],
    ['cabin', ['cab', 'bin'], false],
    ['cabin', ['c', 'ca', 'bin'], true],
    ['mintminttea', ['mint', 'tea'], true],
    ['teas', ['teashop', 'tea', 's'], true],
    ['s', ['ss'], false],
    ['bot', ['bot'], true],
    ['ababab', ['ab', 'aba'], true],
    [lateFailure, ['a', 'aa'], false],
    [maxWord.repeat(15), [maxWord], true],
    ['a'.repeat(299) + 'b', ['a', 'aa'], false],
]
for (const [s, words, expected] of cases) {
    if (wordBreakDp(s, words) !== expected ||
        searchWordBreak(s, words, true, { calls: 0 }) !== expected ||
        (s.length <= 20 && searchWordBreak(s, words, false, { calls: 0 }) !== expected)) {
        throw new Error('Ca kiểm tra sai')
    }
}
console.log(`${cases.length}/${cases.length} ca đúng`)

function cutOracle(s: string, words: string[]) {
    for (let mask = 0; mask < 1 << (s.length - 1); mask++) {
        let start = 0
        let valid = true
        for (let end = 1; end <= s.length; end++) {
            if (end === s.length || (mask & (1 << (end - 1)))) {
                if (!words.includes(s.slice(start, end))) {
                    valid = false
                    break
                }
                start = end
            }
        }
        if (valid) return true
    }
    return false
}

const pool = ['a', 'b', 'aa', 'ab', 'ba', 'bb']
let probes = 0
for (let n = 1; n <= 5; n++) {
    for (let bits = 0; bits < 1 << n; bits++) {
        const s = Array.from({ length: n }, (_, i) => bits & (1 << i) ? 'b' : 'a').join('')
        for (let mask = 1; mask < 1 << pool.length; mask++) {
            const words = pool.filter((_, i) => mask & (1 << i))
            const expected = cutOracle(s, words)
            if (wordBreakDp(s, words) !== expected ||
                searchWordBreak(s, words, true, { calls: 0 }) !== expected ||
                searchWordBreak(s, words, false, { calls: 0 }) !== expected) {
                throw new Error('Ca vét đối chiếu sai')
            }
            probes++
        }
    }
}
console.log(`${probes}/${probes} ca đúng (vét điểm cắt)`)

const brute = { calls: 0 }
const memo = { calls: 0 }
searchWordBreak(lateFailure, ['a', 'aa'], false, brute)
searchWordBreak(lateFailure, ['a', 'aa'], true, memo)
console.log(`Vét cạn: ${brute.calls} lượt gọi, memo: ${memo.calls} lượt gọi`)
