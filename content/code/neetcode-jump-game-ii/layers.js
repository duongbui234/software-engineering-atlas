// Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
// Chạy: node layers.js

// DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
function jumpDP(nums, counter = { ops: 0 }) {
    const n = nums.length
    const best = Array(n).fill(Infinity)
    best[0] = 0
    for (let i = 0; i < n; i++) {
        for (let k = 1; k <= nums[i] && i + k < n; k++) {
            counter.ops++
            best[i + k] = Math.min(best[i + k], best[i] + 1)
        }
    }
    return best[n - 1]
}

// BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
function jumpBFS(nums, counter = { ops: 0 }) {
    const n = nums.length
    const dist = Array(n).fill(-1)
    dist[0] = 0
    const queue = [0]
    for (let head = 0; head < queue.length; head++) {
        const i = queue[head]
        for (let k = 1; k <= nums[i] && i + k < n; k++) {
            counter.ops++
            if (dist[i + k] === -1) {
                dist[i + k] = dist[i] + 1
                queue.push(i + k)
            }
        }
    }
    return dist[n - 1]
}

// Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
function jump(nums, counter = { ops: 0 }) {
    let jumps = 0
    let end = 0
    let far = 0
    for (let i = 0; i < nums.length - 1; i++) { // dừng trước ô cuối
        counter.ops++
        far = Math.max(far, i + nums[i])
        if (i === end) { // đi hết lớp hiện tại: phải nhảy thêm một bước
            jumps++
            end = far
        }
    }
    return jumps
}

// Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
function jumpToLast(nums) {
    let jumps = 0
    let end = 0
    let far = 0
    for (let i = 0; i < nums.length; i++) {
        far = Math.max(far, i + nums[i])
        if (i === end) {
            jumps++
            end = far
        }
    }
    return jumps
}

// Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; -1 nếu kẹt ở ô 0
function jumpFarthestNow(nums) {
    let pos = 0
    let jumps = 0
    while (pos < nums.length - 1) {
        if (nums[pos] === 0) return -1
        pos = Math.min(pos + nums[pos], nums.length - 1)
        jumps++
    }
    return jumps
}

// Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
function bruteForce(nums, i = 0) {
    if (i === nums.length - 1) return 0
    let best = Infinity
    for (let k = 1; k <= nums[i] && i + k < nums.length; k++) {
        best = Math.min(best, 1 + bruteForce(nums, i + k))
    }
    return best
}

const cases = [
    [[0], 0],
    [[5], 0],
    [[1, 1, 1, 1], 3],
    [[4, 0, 0, 0, 0], 1],
    [[3, 1, 0, 2, 0, 1], 2],
    [[2, 0, 2, 0, 1], 2],
    [[1, 2, 1, 1, 1], 3],
    [[1, 3, 0, 0, 5, 0, 0, 1], 3],
]
let ok = 0
for (const [nums, want] of cases) {
    const got = [jumpDP(nums), jumpBFS(nums), jump(nums), bruteForce(nums)]
    if (got.every((g) => g === want)) ok++
    else console.log('sai ở', JSON.stringify(nums), got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
let total = 0
let good = 0
let wrong = 0
let wrongNow = 0
const build = (arr) => {
    if (arr.length > 0) {
        const want = bruteForce(arr)
        if (want !== Infinity) {
            total++
            if (jumpDP(arr) === want && jumpBFS(arr) === want && jump(arr) === want) good++
            if (jumpToLast(arr) !== want) wrong++
            if (jumpFarthestNow(arr) !== want) wrongNow++
        }
    }
    if (arr.length === 6) return
    for (let v = 0; v <= 3; v++) build([...arr, v])
}
build([])
console.log(`${good}/${total} ca đúng (đối chiếu vét mọi đường nhảy)`)
console.log(`Cho vòng lặp chạy tới ô cuối: sai ${wrong}/${total} ca, [0] cho ${jumpToLast([0])} thay vì 0`)
console.log(`Luôn nhảy xa nhất từ chỗ đang đứng: sai ${wrongNow}/${total} ca, [2,4,1,1,1,1] cho ${jumpFarthestNow([2, 4, 1, 1, 1, 1])} thay vì 2`)

// Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
const big = Array(10000).fill(1000)
const dp = { ops: 0 }
const bfs = { ops: 0 }
const greedy = { ops: 0 }
const answers = [jumpDP(big, dp), jumpBFS(big, bfs), jump(big, greedy)]
console.log(`n = 10000, mọi ô 1000: ${answers.join('/')} bước; DP ${dp.ops} lượt cập nhật, BFS ${bfs.ops} cạnh, lớp nhảy ${greedy.ops} vòng`)
