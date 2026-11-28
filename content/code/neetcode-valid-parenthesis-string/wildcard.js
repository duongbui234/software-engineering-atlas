// Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
// Chạy: node wildcard.js

// Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
function checkBrute(s, counter = { steps: 0 }) {
    const buf = []
    const balanced = () => {
        let open = 0
        for (const c of buf) {
            open += c === '(' ? 1 : -1
            if (open < 0) return false
        }
        return open === 0
    }
    const go = (i) => {
        if (i === s.length) {
            counter.steps++ // một cách hiểu trọn vẹn
            return balanced()
        }
        if (s[i] !== '*') {
            buf.push(s[i])
            const r = go(i + 1)
            buf.pop()
            return r
        }
        let found = false
        for (const pick of [')', '', '(']) {
            if (pick) buf.push(pick)
            if (go(i + 1)) found = true // không dừng sớm: đếm đủ 3^k cách hiểu
            if (pick) buf.pop()
        }
        return found
    }
    return go(0)
}

// DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
function checkDP(s, counter = { steps: 0 }) {
    const n = s.length
    const memo = new Int8Array((n + 1) * (n + 2)).fill(-1) // -1: chưa tính, 0: sai, 1: đúng
    const f = (i, open) => {
        if (open < 0) return false // đóng nhiều hơn mở ở một tiền tố
        if (i === n) return open === 0
        const key = i * (n + 2) + open
        if (memo[key] !== -1) return memo[key] === 1
        counter.steps++ // một trạng thái mới
        const c = s[i]
        let r
        if (c === '(') r = f(i + 1, open + 1)
        else if (c === ')') r = f(i + 1, open - 1)
        else r = f(i + 1, open - 1) || f(i + 1, open) || f(i + 1, open + 1)
        memo[key] = r ? 1 : 0
        return r
    }
    return f(0, 0)
}

// Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
function checkStacks(s) {
    const opens = []
    const stars = []
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') opens.push(i)
        else if (s[i] === '*') stars.push(i)
        else if (opens.length > 0) opens.pop()
        else if (stars.length > 0) stars.pop()
        else return false // ")" không có gì để khớp
    }
    while (opens.length > 0 && stars.length > 0) {
        if (opens.pop() > stars.pop()) return false // "*" đứng trước "(" thì không đóng được nó
    }
    return opens.length === 0
}

// Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
function checkValidString(s, counter = { steps: 0 }) {
    let lo = 0 // số ngoặc mở ít nhất có thể
    let hi = 0 // số ngoặc mở nhiều nhất có thể
    for (const c of s) {
        counter.steps++
        if (c === '(') {
            lo++
            hi++
        } else if (c === ')') {
            lo--
            hi--
        } else {
            lo-- // "*" là ")"
            hi++ // "*" là "("
        }
        if (hi < 0) return false // kể cả coi mọi "*" là "(" vẫn đóng thừa
        if (lo < 0) lo = 0 // bỏ các cách hiểu làm số mở âm
    }
    return lo === 0 // 0 nằm trong khoảng: có cách hiểu đóng hết
}

// Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
function checkNoClamp(s) {
    let lo = 0
    let hi = 0
    for (const c of s) {
        if (c === '(') {
            lo++
            hi++
        } else if (c === ')') {
            lo--
            hi--
        } else {
            lo--
            hi++
        }
        if (hi < 0) return false
    }
    return lo <= 0
}

const cases = [
    ['*', true],
    [')', false],
    ['*(', false],
    ['(*', true],
    ['((*', false],
    ['(()*', true],
    ['*)(*', true],
    ['(*)*)(', false],
    ['**())', true],
    ['((**)', true],
]
let ok = 0
for (const [s, want] of cases) {
    const got = [checkBrute(s), checkDP(s), checkStacks(s), checkValidString(s)]
    if (got.every((x) => x === want)) ok++
    else console.log('sai ở', s, got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
let total = 0
let good = 0
let wrong = 0
const gen = (prefix) => {
    if (prefix.length > 0) {
        total++
        const b = checkBrute(prefix)
        if (checkDP(prefix) === b && checkStacks(prefix) === b && checkValidString(prefix) === b) good++
        if (checkNoClamp(prefix) !== b) wrong++
    }
    if (prefix.length === 8) return
    for (const c of '()*') gen(prefix + c)
}
gen('')
console.log(`${good}/${total} ca đúng (đối chiếu vét cạn)`)
console.log(`Không kẹp lo: sai ${wrong}/${total} ca`)

// Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
const big = '*'.repeat(99) + '('
const dc = { steps: 0 }
let t0 = performance.now()
const d = checkDP(big, dc)
const dpMs = performance.now() - t0
const gc = { steps: 0 }
t0 = performance.now()
const g = checkValidString(big, gc)
const greedyMs = performance.now() - t0
console.log(`n = 100, đáp án ${d}/${g}: DP ${dc.steps} trạng thái (${dpMs.toFixed(2)} ms), khoảng [lo, hi] ${gc.steps} bước (${greedyMs.toFixed(3)} ms)`)

// Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
const small = '*'.repeat(12) + '('
const bc = { steps: 0 }
t0 = performance.now()
const b = checkBrute(small, bc)
const bruteMs = performance.now() - t0
console.log(`n = 13, đáp án ${b}: vét cạn ${bc.steps} cách hiểu (${bruteMs.toFixed(1)} ms)`)
