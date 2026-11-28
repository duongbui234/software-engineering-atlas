// Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
let calls = 0

// Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm.
function combinationSumPlain(candidates: number[], target: number): number[][] {
    const out: number[][] = []
    const path: number[] = []
    const dfs = (start: number, remain: number): void => {
        calls++
        if (remain === 0) {
            out.push([...path])
            return
        }
        if (remain < 0) return
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i])
            dfs(i, remain - candidates[i]) // vẫn là i: được dùng lại số này
            path.pop()
        }
    }
    dfs(0, target)
    return out
}

// Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy.
function combinationSum(candidates: number[], target: number): number[][] {
    const nums = [...candidates].sort((a, b) => a - b)
    const out: number[][] = []
    const path: number[] = []
    const dfs = (start: number, remain: number): void => {
        calls++
        if (remain === 0) {
            out.push([...path])
            return
        }
        for (let i = start; i < nums.length; i++) {
            if (nums[i] > remain) break
            path.push(nums[i])
            dfs(i, remain - nums[i]) // vẫn là i: được dùng lại số này
            path.pop()
        }
    }
    dfs(0, target)
    return out
}

// DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách.
function countWays(candidates: number[], target: number): number {
    const ways = new Array(target + 1).fill(0)
    ways[0] = 1
    for (const c of candidates) {
        for (let t = c; t <= target; t++) ways[t] += ways[t - c]
    }
    return ways[target]
}

// Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng.
function brute(candidates: number[], target: number): number[][] {
    const out: number[][] = []
    const counts: number[] = []
    const gen = (i: number): void => {
        if (i === candidates.length) {
            let sum = 0
            for (let j = 0; j < counts.length; j++) sum += counts[j] * candidates[j]
            if (sum === target) {
                const combo: number[] = []
                counts.forEach((k, j) => { for (let r = 0; r < k; r++) combo.push(candidates[j]) })
                out.push(combo)
            }
            return
        }
        for (let k = 0; k <= Math.floor(target / candidates[i]); k++) {
            counts.push(k)
            gen(i + 1)
            counts.pop()
        }
    }
    gen(0)
    return out
}

const norm = (combos: number[][]): string =>
    combos.map((c) => [...c].sort((a, b) => a - b).join(",")).sort().join("|")

const cases: [number[], number, number[][]][] = [
    [[4, 5, 9], 9, [[4, 5], [9]]],
    [[3, 4, 7], 10, [[3, 3, 4], [3, 7]]],
    [[6], 4, []],
    [[8, 2, 5], 10, [[2, 2, 2, 2, 2], [2, 8], [5, 5]]],
    [[2, 3], 1, []],
    [[40], 40, [[40]]],
    [[39, 2], 3, []],
]
let ok = 0
for (const [cand, target, want] of cases) {
    const plain = combinationSumPlain(cand, target)
    const got = combinationSum(cand, target)
    if (norm(plain) === norm(want) && norm(got) === norm(want) && got.length === countWays(cand, target)) ok++
    else console.log("sai ở", cand, target, got)
}
console.log(`${ok}/${cases.length} ca đúng`)

const pool = [2, 3, 4, 5, 6, 7]
let good = 0
let total = 0
for (let mask = 1; mask < 1 << pool.length; mask++) {
    const cand = pool.filter((_, i) => (mask >> i) & 1)
    for (let target = 1; target < 15; target++) {
        total++
        const want = norm(brute(cand, target))
        const a = combinationSum(cand, target)
        if (norm(a) === want && norm(combinationSumPlain(cand, target)) === want && a.length === countWays(cand, target)) good++
        else console.log("sai ở", cand, target)
    }
}
console.log(`${good}/${total} ca đúng (đối chiếu vét số lần dùng)`)

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
calls = 0
combinationSumPlain(primes, 40)
const plainCalls = calls
calls = 0
const found = combinationSum(primes, 40).length
console.log(`12 số nguyên tố tới 37, target 40: không cắt nhánh ${plainCalls} lượt gọi, sắp xếp + cắt nhánh ${calls} lượt gọi, ${found} tổ hợp`)
