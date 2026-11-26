function countStairs(n) {
    let older = 1, latest = 1
    for (let i = 2; i <= n; i++) {
        ;[older, latest] = [latest, older + latest]
    }
    return latest
}

function cheapestStairs(cost) {
    let older = 0, latest = 0
    for (let i = 2; i <= cost.length; i++) {
        ;[older, latest] = [latest, Math.min(latest + cost[i-1], older + cost[i-2])]
    }
    return latest
}

function robRange(nums, start, end) {
    let older = 0, latest = 0
    for (let i = start; i < end; i++) {
        ;[older, latest] = [latest, Math.max(latest, older + nums[i])]
    }
    return latest
}

function robRing(nums) {
    if (nums.length === 1) return nums[0]
    return Math.max(robRange(nums, 0, nums.length-1), robRange(nums, 1, nums.length))
}

function decode(s) {
    let older = 1, latest = s[0] === '0' ? 0 : 1
    for (let i = 1; i < s.length; i++) {
        const pair = s.slice(i-1, i+1)
        const next = Math.min(2147483647, (s[i] === '0' ? 0 : latest) + (pair >= '10' && pair <= '26' ? older : 0))
        ;[older, latest] = [latest, next]
    }
    return latest
}

function maxProduct(nums) {
    let high = nums[0], low = nums[0], best = nums[0]
    for (let i = 1; i < nums.length; i++) {
        const x = nums[i]
        const withHigh = x * high, withLow = x * low
        high = Math.max(x, withHigh, withLow)
        low = Math.min(x, withHigh, withLow)
        best = Math.max(best, high)
    }
    return best
}

const checks = [
    countStairs(6) === 13,
    cheapestStairs([6,2,8,1]) === 3,
    robRange([4,1,1,7,2],0,5) === 11,
    robRing([9,1,1,9]) === 10,
    robRing([7]) === 7,
    decode('127') === 2,
    decode('1'.repeat(60) + '00') === 0,
    decode('100') === 0,
    maxProduct([-3,2,-4]) === 24,
    maxProduct([-2,0,-1]) === 0,
]
if (!checks.every(Boolean)) throw new Error('Kết quả sai')
console.log(`${checks.length}/${checks.length} ca đúng`)
