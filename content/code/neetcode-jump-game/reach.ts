// Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
// Chạy: node reach.ts

// Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
function canJumpBacktrack(nums: number[], counter = { calls: 0 }): boolean {
    const last = nums.length - 1
    const dfs = (i: number): boolean => {
        counter.calls++
        if (i === last) return true
        for (let step = Math.min(nums[i], last - i); step >= 1; step--) {
            if (dfs(i + step)) return true
        }
        return false
    }
    return dfs(0)
}

// Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
function canJumpMemo(nums: number[], counter = { calls: 0 }): boolean {
    const last = nums.length - 1
    const memo: number[] = Array(nums.length).fill(0)
    const dfs = (i: number): boolean => {
        counter.calls++
        if (i === last) return true
        if (memo[i] !== 0) return memo[i] === 1
        for (let step = Math.min(nums[i], last - i); step >= 1; step--) {
            if (dfs(i + step)) {
                memo[i] = 1
                return true
            }
        }
        memo[i] = 2
        return false
    }
    return dfs(0)
}

// Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
function canJumpTable(nums: number[], counter = { steps: 0 }): boolean {
    const n = nums.length
    const good: boolean[] = Array(n).fill(false)
    good[n - 1] = true
    for (let i = n - 2; i >= 0; i--) {
        const end = Math.min(i + nums[i], n - 1)
        for (let j = i + 1; j <= end; j++) {
            counter.steps++
            if (good[j]) {
                good[i] = true
                break
            }
        }
    }
    return good[0]
}

// Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
function canJump(nums: number[], counter = { steps: 0 }): boolean {
    let farthest = 0
    for (let i = 0; i < nums.length; i++) {
        counter.steps++
        if (i > farthest) return false // ô i nằm ngoài khúc tới được: kẹt
        farthest = Math.max(farthest, i + nums[i])
        if (farthest >= nums.length - 1) return true
    }
    return true
}

// Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
function canJumpGoal(nums: number[]): boolean {
    let goal = nums.length - 1
    for (let i = nums.length - 2; i >= 0; i--) {
        if (i + nums[i] >= goal) goal = i // từ i nhảy tới goal, nên i thành đích mới
    }
    return goal === 0
}

// Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
function canJumpNoGuard(nums: number[]): boolean {
    let farthest = 0
    for (let i = 0; i < nums.length; i++) {
        farthest = Math.max(farthest, i + nums[i])
    }
    return farthest >= nums.length - 1
}

// Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
function canJumpLongestHop(nums: number[]): boolean {
    let i = 0
    while (i < nums.length - 1) {
        if (nums[i] === 0) return false
        i += nums[i]
    }
    return true
}

// Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
function referee(nums: number[]): boolean {
    const reach: boolean[] = Array(nums.length).fill(false)
    reach[0] = true
    let changed = true
    while (changed) {
        changed = false
        for (let i = 0; i < nums.length; i++) {
            if (!reach[i]) continue
            for (let j = i + 1; j <= i + nums[i] && j < nums.length; j++) {
                if (!reach[j]) {
                    reach[j] = true
                    changed = true
                }
            }
        }
    }
    return reach[nums.length - 1]
}

const correct = [canJumpBacktrack, canJumpMemo, canJumpTable, canJump, canJumpGoal]

// Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
function worstCase(n: number): number[] {
    const a: number[] = []
    for (let i = 0; i < n - 1; i++) a.push(n - 2 - i)
    a.push(0)
    return a
}

const cases: [number[], boolean][] = [
    [[0], true],
    [[1, 0], true],
    [[0, 1], false],
    [[2, 0, 0], true],
    [[1, 0, 1], false],
    [[2, 3, 0, 0, 1], true],
    [[5, 0, 0, 0, 0, 0], true],
    [[1, 2, 0, 1, 0, 3], false],
    [[2, 0, 2, 0, 1, 0], true],
    [[4, 0, 0, 0, 0, 1], false],
    [worstCase(10), false],
]
let ok = 0
for (const [nums, want] of cases) {
    if (correct.every((f) => f(nums) === want) && referee(nums) === want) ok++
    else console.log('sai ở', JSON.stringify(nums))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
let total = 0
let good = 0
const build = (arr: number[]) => {
    if (arr.length > 0) {
        total++
        const want = referee(arr)
        if (correct.every((f) => f(arr) === want)) good++
    }
    if (arr.length === 6) return
    for (let v = 0; v <= 3; v++) build([...arr, v])
}
build([])
console.log(`${good}/${total} ca đúng (đối chiếu trọng tài lan tập)`)

const score = (f: (a: number[]) => boolean) => cases.filter(([nums, want]) => f(nums) === want).length
console.log(`Bản quên kiểm tra i > farthest: ${score(canJumpNoGuard)}/${cases.length} ca đúng`)
console.log(`Bản nhảy bước dài nhất: ${score(canJumpLongestHop)}/${cases.length} ca đúng`)

const small = worstCase(20)
const bt = { calls: 0 }
const mm = { calls: 0 }
canJumpBacktrack(small, bt)
canJumpMemo(small, mm)
console.log(`n = 20, mảng tệ nhất: quay lui ${bt.calls} lượt gọi, ghi nhớ ${mm.calls} lượt gọi`)

const big = worstCase(10000)
const tableSteps = { steps: 0 }
const greedySteps = { steps: 0 }
canJumpTable(big, tableSteps)
canJump(big, greedySteps)
console.log(`n = 10000, mảng tệ nhất: bảng DP ${tableSteps.steps} bước, tham lam ${greedySteps.steps} bước`)

let t = performance.now()
canJumpTable(big)
const tableMs = performance.now() - t
t = performance.now()
for (let k = 0; k < 100; k++) canJump(big)
const greedyMs = (performance.now() - t) / 100
console.log(`Thời gian n = 10000: bảng DP ${tableMs.toFixed(1)} ms, tham lam ${greedyMs.toFixed(3)} ms`)
