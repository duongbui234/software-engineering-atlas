// LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
type Counter = { calls: number }
const NEG = -1_000_000_000 // trạng thái chưa thể xảy ra

// Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
function maxProfitBrute(prices: number[], counter: Counter = { calls: 0 }): number {
    const go = (day: number, holding: boolean): number => {
        counter.calls++
        if (day >= prices.length) return 0
        const wait = go(day + 1, holding)
        if (holding) return Math.max(wait, prices[day] + go(day + 2, false)) // bán, nhảy qua ngày nghỉ
        return Math.max(wait, -prices[day] + go(day + 1, true)) // mua
    }
    return go(0, false)
}

// Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm)
function maxProfitMemo(prices: number[], counter: Counter = { calls: 0 }): number {
    const n = prices.length
    const memo: (number | undefined)[][] = [Array(n), Array(n)]
    const go = (day: number, holding: number): number => {
        counter.calls++
        if (day >= n) return 0
        const saved = memo[holding][day]
        if (saved !== undefined) return saved
        const wait = go(day + 1, holding)
        const act = holding ? prices[day] + go(day + 2, 0) : -prices[day] + go(day + 1, 1)
        return (memo[holding][day] = Math.max(wait, act))
    }
    return go(0, 0)
}

// Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
function maxProfitTable(prices: number[]): number {
    const n = prices.length
    const hold = Array(n).fill(0), sold = Array(n).fill(0), rest = Array(n).fill(0)
    hold[0] = -prices[0]
    sold[0] = NEG
    for (let i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i])
        sold[i] = hold[i - 1] + prices[i]
        rest[i] = Math.max(rest[i - 1], sold[i - 1])
    }
    return Math.max(sold[n - 1], rest[n - 1])
}

// Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
function maxProfit(prices: number[]): number {
    let hold = -prices[0], sold = NEG, rest = 0
    for (let i = 1; i < prices.length; i++) {
        const prevSold = sold
        sold = hold + prices[i]
        hold = Math.max(hold, rest - prices[i])
        rest = Math.max(rest, prevSold)
    }
    return Math.max(sold, rest)
}

// Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
function bestByTrades(prices: number[], start = 0): number {
    let best = 0
    for (let b = start; b < prices.length; b++) {
        for (let s = b + 1; s < prices.length; s++) {
            best = Math.max(best, prices[s] - prices[b] + bestByTrades(prices, s + 2))
        }
    }
    return best
}

const zigzag = Array.from({ length: 5000 }, (_, i) => (i % 2 === 0 ? 1 : 3))
const ramps = Array.from({ length: 5000 }, (_, i) => i % 1000)
const cases: [number[], number][] = [
    [[7], 0],
    [[4, 2], 0],
    [[2, 9], 7],
    [[2, 6, 1, 7], 6],
    [[1, 3, 1, 5], 4],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 9],
    [[9, 8, 7, 6, 5], 0],
    [[1, 3, 1, 3, 1, 3, 1, 3], 4],
    [[3, 3, 3, 3], 0],
    [[6, 1, 6, 1, 6, 0, 9], 14],
    [[4, 1, 2, 8, 0, 5, 6], 8],
    [zigzag, 2500],
    [ramps, 4991],
]
let ok = 0
for (const [prices, expected] of cases) {
    const results = [maxProfit(prices), maxProfitTable(prices), maxProfitMemo(prices)]
    if (prices.length <= 16) results.push(maxProfitBrute(prices))
    if (prices.length <= 10) results.push(bestByTrades(prices))
    if (results.every(r => r === expected)) ok++
}
console.log(`${ok}/${cases.length} ca đúng`)

let exhaustiveOk = 0, total = 0
const arrays: number[][] = [[]]
for (let k = 0; k < arrays.length; k++) {
    if (arrays[k].length === 6) continue
    for (let v = 0; v <= 3; v++) {
        const prices = [...arrays[k], v]
        arrays.push(prices)
        total++
        const expected = bestByTrades(prices)
        const results = [maxProfitBrute(prices), maxProfitMemo(prices), maxProfitTable(prices), maxProfit(prices)]
        if (results.every(r => r === expected)) exhaustiveOk++
    }
}
console.log(`${exhaustiveOk}/${total} ca đúng (đối chiếu liệt kê giao dịch)`)

const sample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4]
const brute = { calls: 0 }, memo = { calls: 0 }
maxProfitBrute(sample, brute)
maxProfitMemo(sample, memo)
console.log(`20 ngày: vét cạn ${brute.calls} lượt gọi, memo ${memo.calls} lượt gọi`)
