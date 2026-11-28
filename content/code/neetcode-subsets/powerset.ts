// Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
function subsetsTakeSkip(nums: number[]): number[][] {
    const result: number[][] = []
    const path: number[] = []
    const walk = (i: number) => {
        if (i === nums.length) {
            result.push([...path]) // sao chép, vì path còn bị sửa tiếp
            return
        }
        path.push(nums[i]) // lấy nums[i]
        walk(i + 1)
        path.pop()
        walk(i + 1) // bỏ nums[i]
    }
    walk(0)
    return result
}

// Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
function subsetsStart(nums: number[]): number[][] {
    const result: number[][] = []
    const path: number[] = []
    const walk = (start: number) => {
        result.push([...path])
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i])
            walk(i + 1) // chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
            path.pop()
        }
    }
    walk(0)
    return result
}

// Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
function subsetsBitmask(nums: number[]): number[][] {
    const result: number[][] = []
    for (let mask = 0; mask < 1 << nums.length; mask++) {
        const subset: number[] = []
        for (let i = 0; i < nums.length; i++) {
            if (mask & (1 << i)) subset.push(nums[i])
        }
        result.push(subset)
    }
    return result
}

// Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
function subsetsDoubling(nums: number[]): number[][] {
    let result: number[][] = [[]]
    for (const x of nums) {
        result = result.concat(result.map((subset) => [...subset, x]))
    }
    return result
}

// Bản lỗi: đẩy chính path vào kết quả, không sao chép
function subsetsNoCopy(nums: number[]): number[][] {
    const result: number[][] = []
    const path: number[] = []
    const walk = (start: number) => {
        result.push(path)
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i])
            walk(i + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
function canonical(sets: number[][]): string[] {
    return sets.map((s) => JSON.stringify([...s].sort((a, b) => a - b))).sort()
}

const sameSets = (a: number[][], b: number[][]) =>
    JSON.stringify(canonical(a)) === JSON.stringify(canonical(b))

const approaches = [subsetsTakeSkip, subsetsStart, subsetsBitmask, subsetsDoubling]

const cases: [number[], number[][] | null][] = [
    [[5], [[], [5]]],
    [[4, -2], [[], [4], [-2], [4, -2]]],
    [[7, 1, 9], [[], [7], [1], [9], [7, 1], [7, 9], [1, 9], [7, 1, 9]]],
    [[-10, 10], [[], [-10], [10], [-10, 10]]],
    [[3, -1, 0, 8], null],
    [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4], null],
    [[6, -6, 2], [[], [6], [-6], [2], [6, -6], [6, 2], [-6, 2], [6, -6, 2]]],
]

// Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
function check(nums: number[], expected: number[][] | null): boolean {
    for (const solve of approaches) {
        const got = solve([...nums])
        if (got.length !== 1 << nums.length) return false
        if (new Set(canonical(got)).size !== got.length) return false
        if (expected && !sameSets(got, expected)) return false
        if (!sameSets(got, subsetsBitmask(nums))) return false
    }
    return true
}

let ok = 0
for (const [nums, expected] of cases) {
    if (check(nums, expected)) ok++
    else console.log('sai ở', JSON.stringify(nums))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
const pool = [-2, -1, 0, 1, 2]
let total = 0
let good = 0
const build = (arr: number[]) => {
    total++
    if (check(arr, null)) good++
    if (arr.length === 4) return
    for (const v of pool) if (!arr.includes(v)) build([...arr, v])
}
build([])
console.log(`${good}/${total} ca đúng (đối chiếu chéo bốn cách)`)

const demo = [1, 2, 3]
const broken = new Set(canonical(subsetsNoCopy(demo)))
const right = canonical(subsetsBitmask(demo))
const matched = right.filter((key) => broken.has(key)).length
console.log(`Quên sao chép path với [1,2,3]: ${matched}/8 tập con đúng`)
