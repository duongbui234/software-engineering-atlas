function enumerateSigns(nums, target) {
    function count(index, sum) {
        if (index === nums.length) return Number(sum === target)
        return count(index+1, sum+nums[index]) + count(index+1, sum-nums[index])
    }
    return count(0, 0)
}

function countBySignedSum(nums, target) {
    let ways = new Map([[0, 1]])
    for (const x of nums) {
        const next = new Map()
        for (const [sum, count] of ways) {
            for (const key of [sum+x, sum-x]) {
                next.set(key, (next.get(key) ?? 0) + count)
            }
        }
        ways = next
    }
    return ways.get(target) ?? 0
}

function countBySubset(nums, target) {
    const sum = nums.reduce((a, b) => a+b, 0)
    const twice = sum-target
    if (Math.abs(target) > sum || twice % 2 !== 0) return 0
    const goal = twice/2
    const ways = Array(goal+1).fill(0)
    ways[0] = 1
    for (const x of nums) {
        for (let s = goal; s >= x; s--) {
            ways[s] += ways[s-x]
        }
    }
    return ways[goal]
}

const cases = [
    [[1,2,5],4,1], [[0,0,2,3],1,4], [[0,0,2,3],-1,4],
    [[2,5],0,0], [[2,5],8,0], [[2,5],-8,0],
    [[3,3,3,3],0,6], [[1000],-1000,1], [[0],0,2],
    [Array(20).fill(0),0,1048576],
    [Array(16).fill(1),0,12870],
]
for (const [nums,target,want] of cases) {
    if (countBySignedSum(nums,target) !== want || countBySubset(nums,target) !== want ||
        (nums.length <= 16 && enumerateSigns(nums,target) !== want)) throw new Error('Ca kiểm tra sai')
}
console.log(`${cases.length}/${cases.length} ca đúng`)
let leaves = 0
function countLeaves(remaining) {
    if (remaining === 0) { leaves++; return }
    countLeaves(remaining-1)
    countLeaves(remaining-1)
}
countLeaves(16)
let updates = 0
for (let i = 0; i < 16; i++) for (let s = 8; s >= 1; s--) updates++
console.log(`16 số 1: ${leaves} lá, ${updates} lượt cập nhật ô`)
