// Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
// Chạy: node greedy.ts

// Maximum Subarray (Kadane): tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại.
function maxSubArray(nums: number[]): number {
    let run = nums[0] // tổng của đoạn tốt nhất kết thúc tại i
    let best = nums[0] // tốt nhất từ trước tới giờ
    for (let i = 1; i < nums.length; i++) {
        run = run < 0 ? nums[i] : run + nums[i] // tiền tố âm chỉ kéo tổng xuống: bỏ nó
        best = Math.max(best, run)
    }
    return best
}

// Jump Game: giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt.
function canJump(nums: number[]): boolean {
    let reach = 0
    for (let i = 0; i < nums.length; i++) {
        if (i > reach) return false // không ô nào trước đó nhảy tới được i
        reach = Math.max(reach, i + nums[i])
    }
    return true
}

// Jump Game II: quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước.
function jump(nums: number[]): number {
    let jumps = 0
    let end = 0 // ô cuối của lớp đang quét
    let far = 0 // chỗ xa nhất mà lớp kế tiếp tới được
    for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i])
        if (i === end) { // đã quét hết lớp này
            jumps++
            end = far
        }
    }
    return jumps
}

// Gas Station: bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được.
function canCompleteCircuit(gas: number[], cost: number[]): number {
    let total = 0
    let tank = 0
    let start = 0
    for (let i = 0; i < gas.length; i++) {
        const diff = gas[i] - cost[i]
        total += diff
        tank += diff
        if (tank < 0) { // xuất phát lại từ trạm kế tiếp
            start = i + 1
            tank = 0
        }
    }
    return total < 0 ? -1 : start
}

const cases: [string, () => unknown, unknown][] = [
    ["maxSubArray đoạn giữa", () => maxSubArray([2, -5, 4, -1, 3, -7, 2]), 6],
    ["maxSubArray toàn âm", () => maxSubArray([-3, -1, -2]), -1],
    ["maxSubArray một phần tử", () => maxSubArray([5]), 5],
    ["maxSubArray toàn dương", () => maxSubArray([1, 2, 3]), 6],
    ["maxSubArray vượt qua số âm", () => maxSubArray([-1, 4, -2, 4, -10, 3]), 6],
    ["canJump kẹt ở số 0", () => canJump([2, 0, 1, 0, 3]), false],
    ["canJump tới đích", () => canJump([1, 2, 0, 1, 0]), true],
    ["canJump một ô", () => canJump([0]), true],
    ["canJump đứng yên", () => canJump([0, 1]), false],
    ["canJump kẹt giữa đường", () => canJump([3, 0, 0, 1, 0, 2]), false],
    ["jump ba bước", () => jump([1, 2, 0, 1, 0]), 3],
    ["jump hai bước", () => jump([3, 1, 1, 1, 1]), 2],
    ["jump một ô", () => jump([0]), 0],
    ["jump một bước", () => jump([4, 1, 1, 1, 1]), 1],
    ["jump từng ô", () => jump([1, 1, 1, 1]), 3],
    ["gas không đủ xăng", () => canCompleteCircuit([2, 3, 4], [3, 4, 3]), -1],
    ["gas xuất phát ở trạm 3", () => canCompleteCircuit([3, 1, 2, 5], [2, 4, 3, 1]), 3],
    ["gas một trạm", () => canCompleteCircuit([5], [4]), 0],
    ["gas tổng bằng 0", () => canCompleteCircuit([1, 4, 1], [2, 1, 3]), 1],
]

let ok = 0
for (const [name, run, want] of cases) {
    const got = run()
    if (got === want) ok++
    else console.log(`SAI ${name}: được ${got}, cần ${want}`)
}
console.log(`${ok}/${cases.length} ca đúng`)
