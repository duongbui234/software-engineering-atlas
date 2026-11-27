// Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
function editDistanceBrute(a, b, counter = { calls: 0 }) {
    const solve = (i, j) => {
        counter.calls++
        if (i === a.length) return b.length - j // chèn hết phần còn lại của b
        if (j === b.length) return a.length - i // xóa hết phần còn lại của a
        if (a[i] === b[j]) return solve(i + 1, j + 1)
        return 1 + Math.min(solve(i, j + 1), solve(i + 1, j), solve(i + 1, j + 1))
    }
    return solve(0, 0)
}

// Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
function editDistanceMemo(a, b, counter = { calls: 0 }) {
    const width = b.length + 1
    const memo = Array((a.length + 1) * width).fill(-1)
    const solve = (i, j) => {
        counter.calls++
        if (i === a.length) return b.length - j
        if (j === b.length) return a.length - i
        const key = i * width + j
        if (memo[key] !== -1) return memo[key]
        const result = a[i] === b[j]
            ? solve(i + 1, j + 1)
            : 1 + Math.min(solve(i, j + 1), solve(i + 1, j), solve(i + 1, j + 1))
        memo[key] = result
        return result
    }
    return solve(0, 0)
}

// Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[0:i] và b[0:j]
function editDistanceTable(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0))
    for (let i = 0; i <= a.length; i++) dp[i][0] = i
    for (let j = 0; j <= b.length; j++) dp[0][j] = j
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
        }
    }
    return dp
}

// Một hàng và một biến chéo: bản nộp LeetCode
function minDistance(a, b) {
    if (b.length > a.length) [a, b] = [b, a] // hàng dài theo chuỗi ngắn hơn
    const row = Array.from({ length: b.length + 1 }, (_, j) => j)
    for (let i = 1; i <= a.length; i++) {
        let diagonal = row[0] // dp[i-1][j-1]
        row[0] = i
        for (let j = 1; j <= b.length; j++) {
            const above = row[j] // dp[i-1][j], sắp bị ghi đè
            row[j] = a[i - 1] === b[j - 1]
                ? diagonal
                : 1 + Math.min(above, row[j - 1], diagonal)
            diagonal = above
        }
    }
    return row[b.length]
}

// Lần ngược bảng đầy đủ để in kịch bản sửa
function editScript(a, b) {
    const dp = editDistanceTable(a, b)
    const ops = []
    let i = a.length, j = b.length
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
            ops.push({ kind: 'giữ', from: a[i - 1], to: b[j - 1] }); i--; j--
        } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
            ops.push({ kind: 'thay', from: a[i - 1], to: b[j - 1] }); i--; j--
        } else if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
            ops.push({ kind: 'xóa', from: a[i - 1], to: '' }); i--
        } else {
            ops.push({ kind: 'chèn', from: '', to: b[j - 1] }); j--
        }
    }
    return ops.reverse()
}

function scriptWorks(a, b, ops, distance) {
    const consumed = ops.map(op => op.from).join('')
    const produced = ops.map(op => op.to).join('')
    const cost = ops.filter(op => op.kind !== 'giữ').length
    return consumed === a && produced === b && cost === distance
}

function describe(ops) {
    return ops.map(op => op.kind === 'giữ' ? `giữ ${op.from}`
        : op.kind === 'thay' ? `thay ${op.from}→${op.to}`
        : op.kind === 'xóa' ? `xóa ${op.from}` : `chèn ${op.to}`).join(', ')
}

// BFS trên chính các chuỗi, độc lập với công thức DP
function bfsDistance(a, b) {
    const limit = Math.max(a.length, b.length)
    const seen = new Map([[a, 0]])
    const queue = [a]
    for (let head = 0; head < queue.length; head++) {
        const s = queue[head], d = seen.get(s)
        if (s === b) return d
        const next = []
        for (let p = 0; p < s.length; p++) {
            next.push(s.slice(0, p) + s.slice(p + 1))
            next.push(s.slice(0, p) + (s[p] === 'a' ? 'b' : 'a') + s.slice(p + 1))
        }
        if (s.length < limit) {
            for (let p = 0; p <= s.length; p++) for (const c of 'ab') next.push(s.slice(0, p) + c + s.slice(p))
        }
        for (const t of next) if (!seen.has(t)) { seen.set(t, d + 1); queue.push(t) }
    }
    return -1
}

const cases = [
    ['', '', 0],
    ['', 'abc', 3],
    ['abc', '', 3],
    ['abc', 'abc', 0],
    ['cat', 'cut', 1],
    ['table', 'tables', 1],
    ['ab', 'ba', 2],
    ['kitten', 'sitting', 3],
    ['flaw', 'lawn', 2],
    ['sunday', 'saturday', 3],
    ['pqrst', 'qrstu', 2],
    ['ab'.repeat(250), 'ba'.repeat(250), 2],
    ['a'.repeat(500), 'b'.repeat(500), 500],
]
let ok = 0
for (const [a, b, expected] of cases) {
    const results = [minDistance(a, b), editDistanceMemo(a, b), editDistanceTable(a, b)[a.length][b.length]]
    if (a.length + b.length <= 16) results.push(editDistanceBrute(a, b))
    if (results.every(r => r === expected) && scriptWorks(a, b, editScript(a, b), expected)) ok++
}
console.log(`${ok}/${cases.length} ca đúng`)

const words = ['']
for (let k = 0; k < words.length; k++) if (words[k].length < 4) words.push(words[k] + 'a', words[k] + 'b')
let exhaustiveOk = 0, total = 0
for (const a of words) {
    for (const b of words) {
        total++
        const expected = bfsDistance(a, b)
        const results = [editDistanceBrute(a, b), editDistanceMemo(a, b), minDistance(a, b), editDistanceTable(a, b)[a.length][b.length]]
        if (results.every(r => r === expected) && scriptWorks(a, b, editScript(a, b), expected)) exhaustiveOk++
    }
}
console.log(`${exhaustiveOk}/${total} ca đúng (đối chiếu BFS)`)

const brute = { calls: 0 }, memo = { calls: 0 }
editDistanceBrute('a'.repeat(8), 'b'.repeat(8), brute)
editDistanceMemo('a'.repeat(8), 'b'.repeat(8), memo)
console.log(`Vét cạn: ${brute.calls} lượt gọi, memo: ${memo.calls} lượt gọi`)
console.log(`kitten → sitting: ${describe(editScript('kitten', 'sitting'))}`)
