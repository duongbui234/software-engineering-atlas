// Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.

// Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại
function burstBrute(nums, counter = { calls: 0 }) {
    const go = (arr) => {
        counter.calls++
        let best = 0
        for (let i = 0; i < arr.length; i++) {
            const left = i > 0 ? arr[i - 1] : 1
            const right = i + 1 < arr.length ? arr[i + 1] : 1
            const rest = arr.slice(0, i).concat(arr.slice(i + 1))
            best = Math.max(best, left * arr[i] * right + go(rest))
        }
        return best
    }
    return go(nums)
}

// Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
// Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1].
function burstFirstSplitWrong(nums) {
    const p = [1, ...nums, 1]
    const memo = new Map()
    const solve = (l, r) => {
        if (l > r) return 0
        const key = l * p.length + r
        const hit = memo.get(key)
        if (hit !== undefined) return hit
        let best = 0
        for (let k = l; k <= r; k++) {
            best = Math.max(best, p[k - 1] * p[k] * p[k + 1] + solve(l, k - 1) + solve(k + 1, r))
        }
        memo.set(key, best)
        return best
    }
    return solve(1, nums.length)
}

// Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r (không gồm l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r].
function burstMemo(nums, counter = { calls: 0 }) {
    const p = [1, ...nums, 1]
    const n = p.length
    const memo= Array.from({ length: n }, () => Array(n).fill(-1))
    const solve = (l, r) => {
        counter.calls++
        if (l + 1 >= r) return 0
        if (memo[l][r] !== -1) return memo[l][r]
        let best = 0
        for (let k = l + 1; k < r; k++) {
            best = Math.max(best, p[l] * p[k] * p[r] + solve(l, k) + solve(k, r))
        }
        memo[l][r] = best
        return best
    }
    return solve(0, n - 1)
}

// Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài
function maxCoins(nums) {
    const p = [1, ...nums, 1]
    const n = p.length
    const dp= Array.from({ length: n }, () => Array(n).fill(0))
    for (let len = 2; len < n; len++) {
        for (let l = 0; l + len < n; l++) {
            const r = l + len
            let best = 0
            for (let k = l + 1; k < r; k++) {
                best = Math.max(best, p[l] * p[k] * p[r] + dp[l][k] + dp[k][r])
            }
            dp[l][r] = best
        }
    }
    return dp[0][n - 1]
}

const mixed = Array.from({ length: 300 }, (_, i) => (i * 37 + 11) % 101)
const cases = [
    [[7], 7],
    [[2, 3], 9],
    [[0, 0, 0], 0],
    [[4, 0, 4], 20],
    [[2, 9, 4], 84],
    [[5, 1, 1, 5], 60],
    [[9, 1, 8, 2, 7], 760],
    [[1, 2, 3, 4, 5, 6], 252],
    [Array(300).fill(1), 300],
    [Array(300).fill(100), 298010100],
    [mixed, 116330212],
]
let ok = 0
for (const [nums, expected] of cases) {
    const results = [maxCoins(nums), burstMemo(nums)]
    if (nums.length <= 6) results.push(burstBrute(nums))
    if (results.every(r => r === expected)) ok++
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu mọi mảng dài 1–5, mỗi phần tử 0–3, với vét cạn mọi thứ tự nổ
let exhaustiveOk = 0, total = 0
const arrays= [[]]
for (let k = 0; k < arrays.length; k++) {
    if (arrays[k].length < 5) for (let v = 0; v <= 3; v++) arrays.push([...arrays[k], v])
}
for (const nums of arrays.slice(1)) {
    total++
    const expected = burstBrute(nums)
    if (maxCoins(nums) === expected && burstMemo(nums) === expected) exhaustiveOk++
}
console.log(`${exhaustiveOk}/${total} ca đúng (đối chiếu mọi thứ tự nổ)`)

console.log(`Chia theo quả nổ đầu tiên với [2,3]: ${burstFirstSplitWrong([2, 3])}, đúng là ${maxCoins([2, 3])}`)
const brute = { calls: 0 }, memo = { calls: 0 }
const eight = [3, 1, 4, 1, 5, 9, 2, 6]
burstBrute(eight, brute)
burstMemo(eight, memo)
console.log(`8 quả: vét cạn ${brute.calls} lượt gọi, memo ${memo.calls} lượt gọi`)
