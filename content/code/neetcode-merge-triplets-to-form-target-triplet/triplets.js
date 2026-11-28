// Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
// Chạy: node triplets.js

// Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
function mergeTripletsBrute(triplets, target, counter = { steps: 0 }) {
    const n = triplets.length
    for (let mask = 1; mask < 1 << n; mask++) {
        let a = 0, b = 0, c = 0
        for (let i = 0; i < n; i++) {
            counter.steps++
            if ((mask >> i) & 1) {
                const t = triplets[i]
                a = Math.max(a, t[0])
                b = Math.max(b, t[1])
                c = Math.max(c, t[2])
            }
        }
        if (a === target[0] && b === target[1] && c === target[2]) return true
    }
    return false
}

// Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
function mergeTriplets(triplets, target, counter = { steps: 0 }) {
    const [x, y, z] = target
    const found = [false, false, false]
    for (const t of triplets) {
        counter.steps++
        if (t[0] > x || t[1] > y || t[2] > z) continue // bộ không an toàn: gộp vào là vượt, không gỡ được
        for (let k = 0; k < 3; k++) {
            if (t[k] === target[k]) found[k] = true // bộ an toàn này mang đúng giá trị cần ở vị trí k
        }
    }
    return found[0] && found[1] && found[2]
}

// Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
function mergeTripletsMax(triplets, target) {
    const m = [0, 0, 0]
    for (const t of triplets) {
        if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue
        for (let k = 0; k < 3; k++) m[k] = Math.max(m[k], t[k])
    }
    return m[0] === target[0] && m[1] === target[1] && m[2] === target[2]
}

// Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
function mergeTripletsNoFilter(triplets, target) {
    const found = [false, false, false]
    for (const t of triplets) {
        for (let k = 0; k < 3; k++) if (t[k] === target[k]) found[k] = true
    }
    return found[0] && found[1] && found[2]
}

const cases = [
    [[[1, 2, 3]], [1, 2, 3], true],
    [[[2, 9, 5], [1, 7, 1]], [2, 7, 5], false],
    [[[3, 1, 1], [1, 4, 1], [1, 1, 6]], [3, 4, 6], true],
    [[[3, 4, 6], [5, 1, 1]], [3, 4, 6], true],
    [[[1, 1, 1], [2, 2, 2]], [3, 3, 3], false],
    [[[4, 2, 1], [1, 2, 4], [4, 4, 4]], [4, 2, 4], true],
    [[[2, 3, 4], [2, 3, 4]], [2, 3, 5], false],
]
let ok = 0
for (const [triplets, target, want] of cases) {
    const got = [mergeTripletsBrute(triplets, target), mergeTriplets(triplets, target), mergeTripletsMax(triplets, target)]
    if (got.every((v) => v === want)) ok++
    else console.log('sai ở', JSON.stringify(triplets), JSON.stringify(target), got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
const values = []
for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) for (let c = 1; c <= 3; c++) values.push([a, b, c])
const target = [2, 2, 2]
let total = 0
let good = 0
let wrong = 0
const list = []
const build = () => {
    if (list.length > 0) {
        total++
        const b = mergeTripletsBrute(list, target)
        if (mergeTriplets(list, target) === b && mergeTripletsMax(list, target) === b) good++
        if (mergeTripletsNoFilter(list, target) !== b) wrong++
    }
    if (list.length === 4) return
    for (const v of values) {
        list.push(v)
        build()
        list.pop()
    }
}
build()
console.log(`${good}/${total} ca đúng (đối chiếu vét cạn)`)
console.log(`Bỏ bước lọc: sai ${wrong}/${total} ca`)

// Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
const small = []
for (let i = 0; i < 18; i++) small.push([i === 0 ? 1000 : i + 1, i === 1 ? 1000 : i + 1, i + 1])
const big = [1000, 1000, 1000]
const bc = { steps: 0 }
let t0 = performance.now()
const rb = mergeTripletsBrute(small, big, bc)
const bruteMs = performance.now() - t0
const gc = { steps: 0 }
t0 = performance.now()
const rg = mergeTriplets(small, big, gc)
const greedyMs = performance.now() - t0
console.log(`n = 18, đáp án ${rb}/${rg}: vét cạn ${bc.steps} bước (${bruteMs.toFixed(1)} ms), tham lam ${gc.steps} bước (${greedyMs.toFixed(3)} ms)`)

// Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
const full = []
for (let i = 0; i < 100000; i++) full.push([((7 * i) % 1000) + 1, ((13 * i) % 1000) + 1, ((31 * i) % 1000) + 1])
const goal = [700, 800, 900]
const fc = { steps: 0 }
t0 = performance.now()
const rf = mergeTriplets(full, goal, fc)
const fullMs = performance.now() - t0
console.log(`n = 100000, đáp án ${rf}: tham lam ${fc.steps} bước (${fullMs.toFixed(2)} ms)`)
