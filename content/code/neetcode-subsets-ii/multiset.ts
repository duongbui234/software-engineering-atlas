// Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
function subsetsWithDup(nums: number[], counter = { calls: 0 }): number[][] {
    const sorted = [...nums].sort((a, b) => a - b)
    const result: number[][] = []
    const path: number[] = []
    const walk = (start: number) => {
        counter.calls++
        result.push([...path])
        for (let i = start; i < sorted.length; i++) {
            // i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
            if (i > start && sorted[i] === sorted[i - 1]) continue
            path.push(sorted[i])
            walk(i + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
function subsetsSkipAlways(nums: number[]): number[][] {
    const sorted = [...nums].sort((a, b) => a - b)
    const result: number[][] = []
    const path: number[] = []
    const walk = (start: number) => {
        result.push([...path])
        for (let i = start; i < sorted.length; i++) {
            if (i > 0 && sorted[i] === sorted[i - 1]) continue
            path.push(sorted[i])
            walk(i + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, cất khóa chuỗi vào Set để bỏ trùng
function subsetsWithSet(nums: number[], counter = { generated: 0 }): number[][] {
    const sorted = [...nums].sort((a, b) => a - b)
    const seen = new Map<string, number[]>()
    for (let mask = 0; mask < 1 << sorted.length; mask++) {
        const subset = sorted.filter((_, i) => mask & (1 << i))
        counter.generated++
        seen.set(subset.join(','), subset)
    }
    return [...seen.values()]
}

// Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
function subsetsByCount(nums: number[]): number[][] {
    const counts = new Map<number, number>()
    for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1)
    let result: number[][] = [[]]
    for (const [value, count] of counts) {
        const next: number[][] = []
        for (const subset of result) {
            for (let k = 0; k <= count; k++) next.push([...subset, ...Array(k).fill(value)])
        }
        result = next
    }
    return result
}

function canonical(sets: number[][]): string[] {
    return sets.map((s) => JSON.stringify([...s].sort((a, b) => a - b))).sort()
}

const same = (a: string[], b: string[]) => JSON.stringify(a) === JSON.stringify(b)

function check(nums: number[], expected: number[][] | null): boolean {
    const reference = canonical(subsetsByCount(nums))
    for (const got of [subsetsWithDup(nums), subsetsWithSet(nums)]) {
        const keys = canonical(got)
        if (new Set(keys).size !== keys.length) return false // không được có tập lặp
        if (!same(keys, reference)) return false
        if (expected && !same(keys, canonical(expected))) return false
    }
    return true
}

const cases: [number[], number[][] | null][] = [
    [[3, 3], [[], [3], [3, 3]]],
    [[5, 5, 1], [[], [1], [1, 5], [1, 5, 5], [5], [5, 5]]],
    [[4, 4, 4, 4], [[], [4], [4, 4], [4, 4, 4], [4, 4, 4, 4]]],
    [[0, -1, 0], [[], [-1], [-1, 0], [-1, 0, 0], [0], [0, 0]]],
    [[7], [[], [7]]],
    [[1, 1, 2, 2, 3], null],
    [[2, 2, 2, 2, 2, 2, 2, 2, 2, 2], null],
    [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4], null],
]
let ok = 0
for (const [nums, expected] of cases) {
    if (check(nums, expected)) ok++
    else console.log('sai ở', JSON.stringify(nums))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
let total = 0
let good = 0
const build = (arr: number[]) => {
    total++
    if (check(arr, null)) good++
    if (arr.length === 5) return
    for (const v of [1, 2, 3]) build([...arr, v])
}
build([])
console.log(`${good}/${total} ca đúng (đối chiếu đếm theo nhóm)`)

const wrong = subsetsSkipAlways([5, 5, 1]).length
const right = subsetsWithDup([5, 5, 1]).length
console.log(`Bỏ trùng mọi lúc với [5,5,1]: ${wrong} tập, đúng là ${right}`)

const heavy = [4, 4, 4, 4, 4, 9, 9, 9, 9, 9]
const viaSet = { generated: 0 }
const kept = subsetsWithSet(heavy, viaSet).length
const viaSkip = { calls: 0 }
subsetsWithDup(heavy, viaSkip)
console.log(`[4×5, 9×5]: Set sinh ${viaSet.generated} tập để giữ ${kept}, cắt cùng tầng sinh ${viaSkip.calls}`)
