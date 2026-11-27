function canPartition(nums: number[]) {
    const sum = nums.reduce((a, b) => a+b, 0)
    if (sum % 2 !== 0) return false
    const goal = sum/2
    const reachable = Array(goal+1).fill(false)
    reachable[0] = true
    for (const x of nums) {
        for (let s = goal; s >= x; s--) {
            reachable[s] ||= reachable[s-x]
        }
    }
    return reachable[goal]
}

function minCoins(coins: number[], amount: number) {
    const best = Array(amount+1).fill(amount+1)
    best[0] = 0
    for (const coin of coins) {
        for (let s = coin; s <= amount; s++) {
            best[s] = Math.min(best[s], best[s-coin]+1)
        }
    }
    return best[amount] === amount+1 ? -1 : best[amount]
}

function coinCombinations(coins: number[], amount: number) {
    const ways = Array(amount+1).fill(0)
    ways[0] = 1
    for (const coin of coins) {
        for (let s = coin; s <= amount; s++) {
            ways[s] = Math.min(2147483647, ways[s]+ways[s-coin])
        }
    }
    return ways[amount]
}

function countBySubset(nums: number[], target: number) {
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

const manyEvenCoins = Array.from({length:299}, (_,i) => 2*(i+1))
const checks = [
    canPartition([4,4,6,2]),
    !canPartition([2,3,7]),
    minCoins([1,4,6],8) === 2,
    minCoins([4,6],7) === -1,
    minCoins([2147483647],0) === 0,
    coinCombinations([2,3,4],7) === 2,
    coinCombinations([4,6],0) === 1,
    coinCombinations([...manyEvenCoins,4999],4999) === 1,
    countBySubset([0,0,2,3],-1) === 4,
    countBySubset([2,5],0) === 0,
]
if (!checks.every(Boolean)) throw new Error('Ca kiểm tra sai')
console.log(`${checks.length}/${checks.length} ca đúng`)
