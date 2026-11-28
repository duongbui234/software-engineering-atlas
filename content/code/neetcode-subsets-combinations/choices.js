// Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
// Chạy: node choices.js

// Subsets: ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i.
function subsets(nums) {
    const result = []
    const path = []
    function walk(start) {
        result.push([...path]) // chép path, vì path còn đổi tiếp
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]) // chọn
            walk(i + 1) // đi sâu, mỗi phần tử dùng một lần
            path.pop() // gỡ lựa chọn
        }
    }
    walk(0)
    return result
}

// Subsets II: sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước.
function subsetsWithDup(nums) {
    const sorted = [...nums].sort((a, b) => a - b)
    const result = []
    const path = []
    function walk(start) {
        result.push([...path])
        for (let i = start; i < sorted.length; i++) {
            if (i > start && sorted[i] === sorted[i - 1]) continue // trùng ở cùng tầng
            path.push(sorted[i])
            walk(i + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// Combination Sum: chỉ ghi khi còn lại đúng 0; nhánh con bắt đầu lại từ i (được dùng lại).
function combinationSum(candidates, target) {
    const sorted = [...candidates].sort((a, b) => a - b)
    const result = []
    const path = []
    function walk(start, remaining) {
        if (remaining === 0) {
            result.push([...path])
            return
        }
        for (let i = start; i < sorted.length; i++) {
            if (sorted[i] > remaining) break // đã sắp xếp: các số sau còn lớn hơn
            path.push(sorted[i])
            walk(i, remaining - sorted[i])
            path.pop()
        }
    }
    walk(0, target)
    return result
}

// Combination Sum II: mỗi số dùng một lần (i + 1) và bỏ trùng ở cùng tầng.
function combinationSum2(candidates, target) {
    const sorted = [...candidates].sort((a, b) => a - b)
    const result = []
    const path = []
    function walk(start, remaining) {
        if (remaining === 0) {
            result.push([...path])
            return
        }
        for (let i = start; i < sorted.length; i++) {
            if (i > start && sorted[i] === sorted[i - 1]) continue
            if (sorted[i] > remaining) break
            path.push(sorted[i])
            walk(i + 1, remaining - sorted[i])
            path.pop()
        }
    }
    walk(0, target)
    return result
}

// Letter Combinations: tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá.
const KEYS = {
    "2": "abc", "3": "def", "4": "ghi", "5": "jkl",
    "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz",
}
function letterCombinations(digits) {
    if (digits.length === 0) return []
    const result = []
    const path = []
    function walk(depth) {
        if (depth === digits.length) {
            result.push(path.join(""))
            return
        }
        for (const letter of KEYS[digits[depth]]) {
            path.push(letter)
            walk(depth + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

// So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi sắp xếp cả danh sách.
function normalize(lists) {
    return lists
        .map((x) => (typeof x === "string" ? x : [...x].sort((a, b) => a - b).join(",")))
        .sort()
}
function same(got, want) {
    return JSON.stringify(normalize(got)) === JSON.stringify(normalize(want))
}

const cases = [
    ["subsets [2,5,9]", () => subsets([2, 5, 9]), [[], [2], [2, 5], [2, 5, 9], [2, 9], [5], [5, 9], [9]]],
    ["subsets [7]", () => subsets([7]), [[], [7]]],
    ["subsets 10 số", () => subsets([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 1024],
    ["subsetsWithDup [3,1,3]", () => subsetsWithDup([3, 1, 3]), [[], [1], [1, 3], [1, 3, 3], [3], [3, 3]]],
    ["subsetsWithDup [6,6,6]", () => subsetsWithDup([6, 6, 6]), [[], [6], [6, 6], [6, 6, 6]]],
    ["subsetsWithDup [4,4,1,4,2]", () => subsetsWithDup([4, 4, 1, 4, 2]), 16],
    ["combinationSum [3,4,5] 8", () => combinationSum([3, 4, 5], 8), [[3, 5], [4, 4]]],
    ["combinationSum [2,3,7] 9", () => combinationSum([2, 3, 7], 9), [[2, 2, 2, 3], [2, 7], [3, 3, 3]]],
    ["combinationSum [4] 3", () => combinationSum([4], 3), []],
    ["combinationSum [2,3,5,7] 20", () => combinationSum([2, 3, 5, 7], 20), 18],
    ["combinationSum2 [1,4,1,2,3,4] 6", () => combinationSum2([1, 4, 1, 2, 3, 4], 6), [[1, 1, 4], [1, 2, 3], [2, 4]]],
    ["combinationSum2 [3,3,2,4,3] 6", () => combinationSum2([3, 3, 2, 4, 3], 6), [[2, 4], [3, 3]]],
    ["combinationSum2 [5] 3", () => combinationSum2([5], 3), []],
    ["letterCombinations 47", () => letterCombinations("47"), ["gp", "gq", "gr", "gs", "hp", "hq", "hr", "hs", "ip", "iq", "ir", "is"]],
    ["letterCombinations 9", () => letterCombinations("9"), ["w", "x", "y", "z"]],
    ["letterCombinations 7979", () => letterCombinations("7979"), 256],
    ["letterCombinations rỗng", () => letterCombinations(""), []],
]

let ok = 0
const fails = []
for (const [name, run, want] of cases) {
    const got = run()
    const pass = typeof want === "number" ? got.length === want && new Set(normalize(got)).size === want : same(got, want)
    if (pass) ok++
    else fails.push(name)
}
console.log(`${ok}/${cases.length} ca đúng`)
if (fails.length > 0) console.log("sai ở: " + fails.join("; "))
