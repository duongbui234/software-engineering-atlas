// Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
// Chạy: node circuit.js

// Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
function canCompleteBrute(gas, cost, counter = { steps: 0 }) {
    const n = gas.length
    for (let s = 0; s < n; s++) {
        let tank = 0
        let ok = true
        for (let k = 0; k < n; k++) {
            const j = (s + k) % n
            tank += gas[j] - cost[j]
            counter.steps++
            if (tank < 0) {
                ok = false // hụt xăng trên đoạn j -> j+1
                break
            }
        }
        if (ok) return s
    }
    return -1
}

// Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
function canCompleteCircuit(gas, cost, counter = { steps: 0 }) {
    let total = 0 // tổng gas - cost của cả vòng
    let tank = 0 // xăng còn lại tính từ start
    let start = 0
    for (let i = 0; i < gas.length; i++) {
        const d = gas[i] - cost[i]
        total += d
        tank += d
        counter.steps++
        if (tank < 0) {
            start = i + 1 // không trạm nào trong [start, i] đi qua được i
            tank = 0
        }
    }
    return total < 0 ? -1 : start // tổng không âm thì start chắc chắn đi trọn vòng
}

// Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
function canCompletePrefix(gas, cost) {
    let prefix = 0
    let lowest = 0 // tiền tố rỗng (trước trạm 0) bằng 0
    let lowestAt = -1
    for (let i = 0; i < gas.length; i++) {
        prefix += gas[i] - cost[i]
        if (prefix < lowest) {
            lowest = prefix
            lowestAt = i
        }
    }
    return prefix < 0 ? -1 : lowestAt + 1
}

// Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
function canCompleteNoTotal(gas, cost) {
    let tank = 0
    let start = 0
    for (let i = 0; i < gas.length; i++) {
        tank += gas[i] - cost[i]
        if (tank < 0) {
            start = i + 1
            tank = 0
        }
    }
    return start
}

// Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
function completes(gas, cost, s) {
    const n = gas.length
    if (s < 0 || s >= n) return false
    let tank = 0
    for (let k = 0; k < n; k++) {
        const j = (s + k) % n
        tank += gas[j] - cost[j]
        if (tank < 0) return false
    }
    return true
}

// Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
function agrees(gas, cost) {
    const g = canCompleteCircuit(gas, cost)
    const p = canCompletePrefix(gas, cost)
    const b = canCompleteBrute(gas, cost)
    if (g !== p) return false
    if (b === -1) return g === -1
    return completes(gas, cost, g)
}

const cases = [
    [[5], [5], 0],
    [[2], [3], -1],
    [[1, 6, 2], [3, 1, 4], 1],
    [[4, 0, 5, 1, 2], [2, 3, 1, 4, 2], 2],
    [[0, 0, 0, 9], [2, 2, 2, 1], 3],
    [[3, 3, 3], [3, 3, 4], -1],
    [[0, 2, 0], [1, 0, 1], 1],
]
let ok = 0
for (const [gas, cost, want] of cases) {
    const got = [canCompleteBrute(gas, cost), canCompleteCircuit(gas, cost), canCompletePrefix(gas, cost)]
    if (got.every((x) => x === want)) ok++
    else console.log('sai ở', JSON.stringify(gas), JSON.stringify(cost), got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
let total = 0
let good = 0
let wrong = 0
const all = []
const build = (pairs) => {
    if (pairs.length > 0) all.push([...pairs])
    if (pairs.length === 8) return
    for (let g = 0; g <= 2; g++) {
        for (let c = 0; c <= 2; c++) {
            pairs.push(g, c)
            build(pairs)
            pairs.pop()
            pairs.pop()
        }
    }
}
build([])
for (const pairs of all) {
    const gas = pairs.filter((_, i) => i % 2 === 0)
    const cost = pairs.filter((_, i) => i % 2 === 1)
    total++
    if (agrees(gas, cost)) good++
    const b = canCompleteBrute(gas, cost)
    const w = canCompleteNoTotal(gas, cost)
    if (b === -1 ? w !== -1 : !completes(gas, cost, w)) wrong++
}
console.log(`${good}/${total} ca đúng (đối chiếu vét cạn)`)
console.log(`Bỏ kiểm tra tổng: sai ${wrong}/${total} ca`)

// Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
const n = 10000
const gas = Array(n).fill(1)
const cost = Array(n).fill(0)
cost[n - 2] = n + 1 // trạm n-2: gas 1, cost n+1, tức hụt n
gas[n - 1] = 2
const bc = { steps: 0 }
let t0 = performance.now()
const b = canCompleteBrute(gas, cost, bc)
const bruteMs = performance.now() - t0
const gc = { steps: 0 }
t0 = performance.now()
const g = canCompleteCircuit(gas, cost, gc)
const greedyMs = performance.now() - t0
console.log(`n = ${n}, đáp án ${b}/${g}: vét cạn ${bc.steps} bước (${bruteMs.toFixed(1)} ms), tham lam ${gc.steps} bước (${greedyMs.toFixed(2)} ms)`)
