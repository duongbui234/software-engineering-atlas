// Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
let calls = 0

// Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại.
function combinationSum2(candidates: number[], target: number): number[][] {
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
            if (i > start && nums[i] === nums[i - 1]) continue // cùng tầng đã thử giá trị này rồi
            if (nums[i] > remain) break
            path.push(nums[i])
            dfs(i + 1, remain - nums[i]) // i + 1: vị trí này đã dùng
            path.pop()
        }
    }
    dfs(0, target)
    return out
}

// Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa.
function combinationSum2Set(candidates: number[], target: number): number[][] {
    const nums = [...candidates].sort((a, b) => a - b)
    const seen = new Set<string>()
    const out: number[][] = []
    const path: number[] = []
    const dfs = (start: number, remain: number): void => {
        calls++
        if (remain === 0) {
            const key = path.join(",")
            if (!seen.has(key)) {
                seen.add(key)
                out.push([...path])
            }
            return
        }
        for (let i = start; i < nums.length; i++) {
            if (nums[i] > remain) break
            path.push(nums[i])
            dfs(i + 1, remain - nums[i])
            path.pop()
        }
    }
    dfs(0, target)
    return out
}

// Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng.
function brute(candidates: number[], target: number): number[][] {
    const seen = new Map<string, number[]>()
    const n = candidates.length
    for (let mask = 0; mask < 1 << n; mask++) {
        const pick = candidates.filter((_, i) => (mask >> i) & 1).sort((a, b) => a - b)
        if (pick.reduce((s, v) => s + v, 0) === target) seen.set(pick.join(","), pick)
    }
    return [...seen.values()]
}

const norm = (combos: number[][]): string =>
    combos.map((c) => [...c].sort((a, b) => a - b).join(",")).sort().join("|")

const ones = (k: number): number[] => new Array(k).fill(1)
const cases: [number[], number, number[][]][] = [
    [[3, 1, 3, 5, 1, 1], 8, [[1, 1, 1, 5], [1, 1, 3, 3], [3, 5]]],
    [[2, 2, 2], 4, [[2, 2]]],
    [[5], 3, []],
    [[4, 1, 4, 1], 5, [[1, 4]]],
    [ones(20), 10, [ones(10)]],
    [[6, 2, 4, 2], 6, [[2, 4], [6]]],
    [[50, 30], 30, [[30]]],
]
let ok = 0
for (const [cand, target, want] of cases) {
    const a = combinationSum2(cand, target)
    if (norm(a) === norm(want) && norm(combinationSum2Set(cand, target)) === norm(want)) ok++
    else console.log("sai ở", cand, target, a)
}
console.log(`${ok}/${cases.length} ca đúng`)

let good = 0
let total = 0
for (let n = 1; n <= 6; n++) {
    const digits = new Array(n).fill(0)
    for (let step = 0; step < 3 ** n; step++) {
        const cand = digits.map((d) => d + 1)
        for (let target = 1; target <= 8; target++) {
            total++
            const want = norm(brute(cand, target))
            if (norm(combinationSum2(cand, target)) === want && norm(combinationSum2Set(cand, target)) === want) good++
            else console.log("sai ở", cand, target)
        }
        for (let j = n - 1; j >= 0; j--) {
            if (++digits[j] < 3) break
            digits[j] = 0
        }
    }
}
console.log(`${good}/${total} ca đúng (đối chiếu vét tập con)`)

calls = 0
combinationSum2Set(ones(20), 10)
const setCalls = calls
calls = 0
combinationSum2(ones(20), 10)
console.log(`20 số 1, target 10: khử trùng bằng tập ${setCalls} lượt gọi, bỏ trùng cùng tầng ${calls} lượt gọi`)
