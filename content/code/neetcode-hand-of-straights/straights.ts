// Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
// Chạy: node straights.ts

function countOf(hand: number[]): Map<number, number> {
    const count = new Map<number, number>()
    for (const x of hand) count.set(x, (count.get(x) ?? 0) + 1)
    return count
}

// Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
function isStraightBrute(hand: number[], k: number): boolean {
    const count = countOf(hand)
    const go = (idx: number): boolean => {
        while (idx < hand.length && count.get(hand[idx]) === 0) idx++
        if (idx === hand.length) return true // mọi lá đã vào nhóm
        const x = hand[idx]
        for (let s = x - k + 1; s <= x; s++) {
            let ok = true
            for (let v = s; v < s + k; v++) {
                if ((count.get(v) ?? 0) === 0) {
                    ok = false
                    break
                }
            }
            if (!ok) continue
            for (let v = s; v < s + k; v++) count.set(v, count.get(v)! - 1)
            if (go(idx)) return true
            for (let v = s; v < s + k; v++) count.set(v, count.get(v)! + 1)
        }
        return false
    }
    return go(0)
}

// Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
function isNStraightHand(hand: number[], k: number, counter = { steps: 0 }): boolean {
    if (hand.length % k !== 0) return false // dừng sớm: không chia đều được
    const count = countOf(hand)
    const sorted = [...hand].sort((a, b) => a - b) // so sánh số, không phải chuỗi
    for (const x of sorted) {
        if (count.get(x) === 0) continue // lá này đã nằm trong một nhóm trước
        for (let v = x; v < x + k; v++) {
            counter.steps++
            const c = count.get(v) ?? 0
            if (c === 0) return false // thiếu lá v để nối nhóm
            count.set(v, c - 1)
        }
    }
    return true
}

// Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
function isNStraightByValue(hand: number[], k: number, counter = { steps: 0 }): boolean {
    if (hand.length % k !== 0) return false
    const count = countOf(hand)
    const keys = [...count.keys()].sort((a, b) => a - b) // chỉ sắp các giá trị khác nhau
    for (const x of keys) {
        const c = count.get(x)!
        if (c === 0) continue
        for (let v = x; v < x + k; v++) {
            counter.steps++
            const have = count.get(v) ?? 0
            if (have < c) return false // không đủ lá v cho c nhóm
            count.set(v, have - c)
        }
    }
    return true
}

// Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
function isNStraightOpen(hand: number[], k: number): boolean {
    if (hand.length % k !== 0) return false
    const count = countOf(hand)
    const keys = [...count.keys()].sort((a, b) => a - b)
    const started: number[] = [] // số nhóm mới mở tại từng giá trị, theo thứ tự
    let head = 0
    let open = 0 // số nhóm đang chờ lá kế tiếp
    let prev = 0
    for (const x of keys) {
        const c = count.get(x)!
        if (open > 0 && x !== prev + 1) return false // nhóm đang mở cần prev+1 mà không có
        if (c < open) return false // không đủ lá x để nối mọi nhóm đang mở
        started.push(c - open) // phần dư mở nhóm mới tại x
        open = c
        if (started.length - head === k) open -= started[head++] // nhóm mở từ x-k+1 vừa đủ k lá
        prev = x
    }
    return open === 0
}

// Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
function isNStraightNoSort(hand: number[], k: number): boolean {
    if (hand.length % k !== 0) return false
    const count = countOf(hand)
    for (const x of hand) {
        if (count.get(x) === 0) continue
        for (let v = x; v < x + k; v++) {
            const c = count.get(v) ?? 0
            if (c === 0) return false
            count.set(v, c - 1)
        }
    }
    return true
}

const cases: [number[], number, boolean][] = [
    [[5, 1, 3, 2, 4, 6], 3, true],
    [[1, 1, 2, 2, 3, 3], 3, true],
    [[3, 2, 2, 1, 4, 3], 3, true],
    [[1, 2, 4, 5, 6, 7], 3, false],
    [[7, 8, 9, 10], 3, false],
    [[4], 1, true],
    [[3, 3, 4, 4, 5, 6], 3, false],
    [[12, 10, 11, 13, 11, 12], 3, true],
    [[1000000000, 999999998, 999999999], 3, true],
    [[0, 1, 2, 3], 2, true],
]
let ok = 0
for (const [hand, k, want] of cases) {
    const got = [isStraightBrute(hand, k), isNStraightHand(hand, k), isNStraightByValue(hand, k), isNStraightOpen(hand, k)]
    if (got.every((x) => x === want)) ok++
    else console.log('sai ở', JSON.stringify(hand), k, got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
let total = 0
let good = 0
let wrong = 0
for (let mask = 1; mask < 4 ** 5; mask++) {
    const sorted: number[] = []
    let m = mask
    for (let v = 0; v < 5; v++) {
        for (let r = 0; r < m % 4; r++) sorted.push(v)
        m = Math.floor(m / 4)
    }
    const half = Math.floor(sorted.length / 2)
    const hand = [...sorted.slice(half), ...sorted.slice(0, half)]
    for (let k = 1; k <= 5; k++) {
        total++
        const want = isStraightBrute(hand, k)
        if (isNStraightHand(hand, k) === want && isNStraightByValue(hand, k) === want && isNStraightOpen(hand, k) === want) good++
        if (isNStraightNoSort(hand, k) !== want) wrong++
    }
}
console.log(`${good}/${total} ca đúng (đối chiếu trọng tài)`)
console.log(`Bỏ sắp xếp: sai ${wrong}/${total} ca`)

// Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
const n = 200000
const big = Array.from({ length: n }, (_, i) => (i * 7919) % 1000)
const kBig = 10
const cc = { steps: 0 }
let t0 = performance.now()
const a = isNStraightHand(big, kBig, cc)
const cardMs = performance.now() - t0
const vc = { steps: 0 }
t0 = performance.now()
const b = isNStraightByValue(big, kBig, vc)
const valueMs = performance.now() - t0
console.log(`n = ${n}, k = ${kBig}, kết quả ${a}/${b}: theo từng lá ${cc.steps} bước (${cardMs.toFixed(1)} ms), theo từng giá trị ${vc.steps} bước (${valueMs.toFixed(1)} ms)`)
