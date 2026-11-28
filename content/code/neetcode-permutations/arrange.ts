// Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
// Chạy: node arrange.ts

// Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
function permute(nums: number[], counter = { calls: 0 }): number[][] {
    const result: number[][] = []
    const path: number[] = []
    const used: boolean[] = Array(nums.length).fill(false)
    const walk = () => {
        counter.calls++
        if (path.length === nums.length) {
            result.push([...path]) // chép path, vì path còn bị sửa tiếp
            return
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue // phần tử này đã nằm trong path
            used[i] = true
            path.push(nums[i])
            walk()
            path.pop()
            used[i] = false // gỡ dấu để nhánh anh em được dùng lại
        }
    }
    walk()
    return result
}

// Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
function permuteSwap(nums: number[]): number[][] {
    const a = [...nums]
    const result: number[][] = []
    const walk = (k: number) => {
        if (k === a.length) {
            result.push([...a])
            return
        }
        for (let i = k; i < a.length; i++) {
            ;[a[k], a[i]] = [a[i], a[k]]
            walk(k + 1)
            ;[a[k], a[i]] = [a[i], a[k]] // đổi lại để mảng về như cũ
        }
    }
    walk(0)
    return result
}

// Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
function permuteInsert(nums: number[]): number[][] {
    let layer: number[][] = [[]]
    for (const x of nums) {
        const next: number[][] = []
        for (const p of layer) {
            for (let slot = 0; slot <= p.length; slot++) {
                next.push([...p.slice(0, slot), x, ...p.slice(slot)])
            }
        }
        layer = next
    }
    return layer
}

// Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
function permuteWithStart(nums: number[]): number[][] {
    const result: number[][] = []
    const path: number[] = []
    const walk = (start: number) => {
        if (path.length === nums.length) {
            result.push([...path])
            return
        }
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i])
            walk(i + 1) // không bao giờ quay lại phần tử đứng trước i
            path.pop()
        }
    }
    walk(0)
    return result
}

// Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
function bruteForce(nums: number[]): number[][] {
    const n = nums.length
    const result: number[][] = []
    const total = n ** n
    for (let code = 0; code < total; code++) {
        const idx: number[] = []
        let c = code
        for (let k = 0; k < n; k++) {
            idx.push(c % n)
            c = Math.floor(c / n)
        }
        if (new Set(idx).size === n) result.push(idx.map((i) => nums[i]))
    }
    return result
}

function canonical(list: number[][]): string {
    return list.map((p) => p.join(',')).sort().join('|')
}

function factorial(n: number): number {
    return n <= 1 ? 1 : n * factorial(n - 1)
}

function check(nums: number[], expected: number[][] | null): boolean {
    const want = canonical(expected ?? bruteForce(nums))
    for (const got of [permute(nums), permuteSwap(nums), permuteInsert(nums)]) {
        if (got.length !== factorial(nums.length)) return false
        if (new Set(got.map((p) => p.join(','))).size !== got.length) return false
        if (canonical(got) !== want) return false
    }
    return true
}

const cases: [number[], number[][] | null][] = [
    [[7], [[7]]],
    [[4, 9], [[4, 9], [9, 4]]],
    [[3, 8, 1], [[3, 8, 1], [3, 1, 8], [8, 3, 1], [8, 1, 3], [1, 3, 8], [1, 8, 3]]],
    [[0, -5, 10], null],
    [[-10, 10, 0, 5], null],
    [[2, 4, 6, 8, 10], null],
    [[-3, -2, -1, 0, 1, 2], null],
]
let ok = 0
for (const [nums, expected] of cases) {
    if (check(nums, expected)) ok++
    else console.log('sai ở', JSON.stringify(nums))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
let total = 0
let good = 0
const build = (arr: number[]) => {
    if (arr.length > 0) {
        total++
        if (check(arr, null)) good++
    }
    if (arr.length === 5) return
    for (let v = 1; v <= 5; v++) if (!arr.includes(v)) build([...arr, v])
}
build([])
console.log(`${good}/${total} ca đúng (đối chiếu vét mọi bộ chỉ số)`)

console.log(`Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: ${permuteWithStart([3, 8, 1]).length}/6 hoán vị`)

const counter = { calls: 0 }
const six = permute([1, 2, 3, 4, 5, 6], counter)
console.log(`n = 6: ${six.length} hoán vị, ${counter.calls} lượt gọi`)
