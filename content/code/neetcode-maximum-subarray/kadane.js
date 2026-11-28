// Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
// Chạy: node kadane.js        (thêm tham số bench để đo thời gian)

// Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
function maxSubArray(nums) {
    let cur = nums[0] // tổng tốt nhất của đoạn kết thúc tại i
    let best = nums[0]
    for (let i = 1; i < nums.length; i++) {
        cur = cur < 0 ? nums[i] : cur + nums[i] // phần đầu âm chỉ kéo tổng xuống
        if (cur > best) best = cur
    }
    return best
}

// Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
function maxSubArrayBounds(nums) {
    let cur = nums[0]
    let best = nums[0]
    let start = 0
    let lo = 0
    let hi = 0
    for (let i = 1; i < nums.length; i++) {
        if (cur < 0) {
            cur = nums[i]
            start = i // đoạn mới bắt đầu tại i
        } else {
            cur += nums[i]
        }
        if (cur > best) {
            best = cur
            lo = start
            hi = i
        }
    }
    return [best, lo, hi]
}

// Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
function maxSubArrayPrefix(nums) {
    let prefix = 0
    let minPrefix = 0 // P[0] = 0: tiền tố rỗng
    let best = -Infinity
    for (const x of nums) {
        prefix += x
        best = Math.max(best, prefix - minPrefix)
        minPrefix = Math.min(minPrefix, prefix)
    }
    return best
}

// Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
function maxSubArrayDivide(nums) {
    const solve = (lo, hi) => {
        if (lo === hi) return nums[lo]
        const mid = (lo + hi) >> 1
        let sum = 0
        let leftBest = -Infinity // tổng lớn nhất của đoạn kết thúc tại mid
        for (let i = mid; i >= lo; i--) {
            sum += nums[i]
            if (sum > leftBest) leftBest = sum
        }
        sum = 0
        let rightBest = -Infinity // tổng lớn nhất của đoạn bắt đầu tại mid + 1
        for (let i = mid + 1; i <= hi; i++) {
            sum += nums[i]
            if (sum > rightBest) rightBest = sum
        }
        return Math.max(solve(lo, mid), solve(mid + 1, hi), leftBest + rightBest)
    }
    return solve(0, nums.length - 1)
}

// Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
function maxSubArrayQuadratic(nums, counter = { adds: 0 }) {
    let best = -Infinity
    for (let i = 0; i < nums.length; i++) {
        let sum = 0
        for (let j = i; j < nums.length; j++) {
            sum += nums[j]
            counter.adds++
            if (sum > best) best = sum
        }
    }
    return best
}

// Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
function maxSubArrayCubic(nums) {
    let best = -Infinity
    for (let i = 0; i < nums.length; i++) {
        for (let j = i; j < nums.length; j++) {
            let sum = 0
            for (let k = i; k <= j; k++) sum += nums[k]
            if (sum > best) best = sum
        }
    }
    return best
}

// Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
function maxSubArrayZeroInit(nums) {
    let cur = 0
    let best = 0
    for (const x of nums) {
        cur = Math.max(0, cur + x)
        best = Math.max(best, cur)
    }
    return best
}

function check(nums, expected) {
    const [best, lo, hi] = maxSubArrayBounds(nums)
    let sum = 0
    for (let k = lo; k <= hi; k++) sum += nums[k]
    if (best !== expected || sum !== best || lo < 0 || lo > hi || hi >= nums.length) return false
    const answers = [maxSubArray(nums), maxSubArrayPrefix(nums), maxSubArrayDivide(nums), maxSubArrayQuadratic(nums), maxSubArrayCubic(nums)]
    return answers.every((a) => a === expected)
}

// Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
let seed = 2026
function next() {
    seed = (seed * 48271) % 2147483647
    return seed
}

const cases = [
    [[7], 7],
    [[-4], -4],
    [[-3, -1, -2], -1],
    [[0, 0, 0], 0],
    [[3, -2, 5, -1], 6],
    [[2, -8, 3, -2, 4, -10], 5],
    [[-1, 6, -7, 5, 3, -2], 8],
    [[10000, 10000, -1, 10000], 29999],
    [[-10000, -10000, -10000], -10000],
]
let ok = 0
for (const [nums, expected] of cases) {
    if (check(nums, expected)) ok++
    else console.log('sai ở', JSON.stringify(nums))
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
let good = 0
const rounds = 3000
for (let r = 0; r < rounds; r++) {
    const n = 1 + (next() % 12)
    const nums = []
    for (let k = 0; k < n; k++) nums.push((next() % 21) - 10)
    if (check(nums, maxSubArrayCubic(nums))) good++
}
console.log(`${good}/${rounds} ca đúng (đối chiếu vét O(n³))`)

console.log(`Khởi tạo best = 0 với [-3,-1,-2]: ra ${maxSubArrayZeroInit([-3, -1, -2])}, đúng là ${maxSubArray([-3, -1, -2])}`)

// Phép đo: n = 10000, giá trị −10000..10000
const big = []
for (let k = 0; k < 10000; k++) big.push((next() % 20001) - 10000)
const counter = { adds: 0 }
const slow = maxSubArrayQuadratic(big, counter)
const fast = maxSubArray(big)
console.log(`n = ${big.length}: O(n²) cộng ${counter.adds} lần, Kadane ${big.length} lần, cùng ra ${slow === fast ? fast : 'KHÁC NHAU'}`)

if (process.argv.includes('bench')) {
    // chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
    const time = (f, reps) => {
        const t = performance.now()
        for (let r = 0; r < reps; r++) f()
        return ((performance.now() - t) / reps).toFixed(3)
    }
    console.log(`thời gian mỗi lượt: O(n²) ${time(() => maxSubArrayQuadratic(big), 3)} ms, chia để trị ${time(() => maxSubArrayDivide(big), 100)} ms, Kadane ${time(() => maxSubArray(big), 1000)} ms`)
}
