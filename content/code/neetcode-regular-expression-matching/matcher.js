// Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
// Chạy: node matcher.js

function matchBrute(s, p, counter) {
    // Đệ quy thuần trên hậu tố s[i:] và p[j:]; counter đếm số lần gọi.
    const go = (i, j) => {
        counter.calls++
        if (j === p.length) return i === s.length
        const first = i < s.length && (p[j] === s[i] || p[j] === '.')
        if (j + 1 < p.length && p[j + 1] === '*') {
            // bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
            return go(i, j + 2) || (first && go(i + 1, j))
        }
        return first && go(i + 1, j + 1)
    }
    return go(0, 0)
}

function matchMemo(s, p, counter) {
    // Cùng đệ quy, nhưng lưu kết quả của từng cặp (i, j), kể cả kết quả false.
    const memo = new Map()
    const go = (i, j) => {
        counter.calls++
        const key = i * (p.length + 1) + j
        const hit = memo.get(key)
        if (hit !== undefined) return hit
        let ans
        if (j === p.length) {
            ans = i === s.length
        } else {
            const first = i < s.length && (p[j] === s[i] || p[j] === '.')
            if (j + 1 < p.length && p[j + 1] === '*') ans = go(i, j + 2) || (first && go(i + 1, j))
            else ans = first && go(i + 1, j + 1)
        }
        memo.set(key, ans)
        return ans
    }
    return go(0, 0)
}

function isMatch(s, p) {
    // dp[i][j]: tiền tố s[0:i] có khớp trọn mẫu p[0:j] không.
    const n = s.length, m = p.length
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(false))
    dp[0][0] = true
    for (let j = 2; j <= m; j++) {
        // chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
        dp[0][j] = p[j - 1] === '*' && dp[0][j - 2]
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (p[j - 1] === '*') {
                const zero = dp[i][j - 2]
                const more = (p[j - 2] === s[i - 1] || p[j - 2] === '.') && dp[i - 1][j]
                dp[i][j] = zero || more
            } else {
                dp[i][j] = (p[j - 1] === s[i - 1] || p[j - 1] === '.') && dp[i - 1][j - 1]
            }
        }
    }
    return dp[n][m]
}

const CASES = [
    ['ba', 'b', false],
    ['bb', 'b*', true],
    ['xy', '.*', true],
    ['kkd', 'z*k*d', true],
    ['tomato', 'to*ma*to', true],
    ['tomato', 't.m*a*t', false],
    ['ab', '.*z', false],
    ['aaa', 'a*a', true],
    ['aaa', 'ab*a*c*a', true],
    ['a', 'ab*', true],
    ['bbbba', '.*a*a', true],
    ['abcd', 'd*', false],
    ['', 'a*b*', true],
    ['a', '.*..a*', false],
    ['a'.repeat(20), 'a*'.repeat(7) + 'b', false],
]

function product(items, k) {
    let out = ['']
    for (let r = 0; r < k; r++) out = out.flatMap((pre) => items.map((x) => pre + x))
    return out
}

let ok = 0
for (const [s, p, want] of CASES) {
    const got = [isMatch(s, p), matchMemo(s, p, { calls: 0 }), matchBrute(s, p, { calls: 0 })]
    if (got.every((g) => g === want)) ok++
    else console.log('sai:', s, p, got, want)
}
console.log(`${ok}/${CASES.length} ca đúng`)

// Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
const strings = [0, 1, 2, 3, 4].flatMap((n) => product(['a', 'b'], n))
const atoms = ['a', 'a*', 'b', 'b*', '.', '.*']
const patterns = [0, 1, 2, 3].flatMap((k) => product(atoms, k))
let good = 0, total = 0
for (const p of patterns) {
    const native = new RegExp(`^(?:${p})$`) // neo cả hai đầu, nếu không test() chỉ cần khớp một đoạn
    for (const s of strings) {
        total++
        const want = native.test(s)
        if (isMatch(s, p) === want && matchMemo(s, p, { calls: 0 }) === want && matchBrute(s, p, { calls: 0 }) === want) good++
    }
}
console.log(`${good}/${total} ca đúng (đối chiếu regex của ngôn ngữ)`)

const brute = { calls: 0 }, memo = { calls: 0 }
matchBrute('a'.repeat(20), 'a*'.repeat(7) + 'b', brute)
matchMemo('a'.repeat(20), 'a*'.repeat(7) + 'b', memo)
console.log(`20 chữ a với (a*)×7 rồi b: vét cạn ${brute.calls} lượt gọi, memo ${memo.calls} lượt gọi`)
