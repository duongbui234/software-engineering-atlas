// Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
// Chạy: node cuts.js

// Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
function isPalindrome(s, lo, hi, counter) {
    while (lo < hi) {
        counter.compares++
        if (s[lo] !== s[hi]) return false
        lo++
        hi--
    }
    return true
}

// Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
function partitionCheck(s, counter = { compares: 0 }) {
    const result = []
    const path = []
    const walk = (start) => {
        if (start === s.length) {
            result.push([...path])
            return
        }
        for (let end = start; end < s.length; end++) {
            if (!isPalindrome(s, start, end, counter)) continue
            path.push(s.slice(start, end + 1))
            walk(end + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Cách chính: dựng bảng isPal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
function partition(s, counter = { compares: 0 }) {
    const n = s.length
    const isPal = Array.from({ length: n }, () => Array(n).fill(false))
    for (let i = n - 1; i >= 0; i--) {
        for (let j = i; j < n; j++) {
            counter.compares++
            // đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
            isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1])
        }
    }
    const result = []
    const path = []
    const walk = (start) => {
        if (start === n) {
            result.push([...path]) // cắt hết chuỗi: ghi một cách chia
            return
        }
        for (let end = start; end < n; end++) {
            if (!isPal[start][end]) continue // mảnh đầu không đối xứng: bỏ cả nhánh
            path.push(s.slice(start, end + 1))
            walk(end + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
function bruteForce(s) {
    const n = s.length
    const result = []
    for (let mask = 0; mask < 1 << (n - 1); mask++) {
        const parts = []
        let from = 0
        for (let gap = 0; gap < n - 1; gap++) {
            if (mask & (1 << gap)) {
                parts.push(s.slice(from, gap + 1))
                from = gap + 1
            }
        }
        parts.push(s.slice(from))
        if (parts.every((p) => p === [...p].reverse().join(''))) result.push(parts)
    }
    return result
}

function canonical(list) {
    return list.map((p) => p.join('/')).sort().join('|')
}

function check(s, expected) {
    const want = canonical(expected ?? bruteForce(s))
    for (const got of [partition(s), partitionCheck(s)]) {
        if (new Set(got.map((p) => p.join('/'))).size !== got.length) return false
        if (canonical(got) !== want) return false
    }
    return true
}

const cases = [
    ['x', [['x']]],
    ['noon', [['n', 'o', 'o', 'n'], ['n', 'oo', 'n'], ['noon']]],
    ['abc', [['a', 'b', 'c']]],
    ['aaaa', null],
    ['level', null],
    ['racecar', null],
    ['abcdefghijklmnop', [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']]],
    ['a'.repeat(16), null],
]
let ok = 0
for (const [s, expected] of cases) {
    if (check(s, expected)) ok++
    else console.log('sai ở', s)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
let total = 0
let good = 0
const build = (s) => {
    if (s.length > 0) {
        total++
        if (check(s, null)) good++
    }
    if (s.length === 9) return
    build(s + 'a')
    build(s + 'b')
}
build('')
console.log(`${good}/${total} ca đúng (đối chiếu vét mọi cách đặt vết cắt)`)

const sixteen = 'a'.repeat(16)
const viaCheck = { compares: 0 }
const count = partitionCheck(sixteen, viaCheck).length
const viaTable = { compares: 0 }
partition(sixteen, viaTable)
console.log(`16 chữ a: ${count} cách chia; kiểm tra lại mỗi lần ${viaCheck.compares} phép so, bảng isPal ${viaTable.compares} phép so`)
