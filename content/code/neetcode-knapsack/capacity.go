package main

import "fmt"

func canPartition(nums []int) bool {
	sum := 0
	for _, x := range nums {
		sum += x
	}
	if sum%2 != 0 {
		return false
	}
	goal := sum / 2
	reachable := make([]bool, goal+1)
	reachable[0] = true
	for _, x := range nums {
		for s := goal; s >= x; s-- {
			reachable[s] = reachable[s] || reachable[s-x]
		}
	}
	return reachable[goal]
}

func minCoins(coins []int, amount int) int {
	best := make([]int, amount+1)
	for s := 1; s <= amount; s++ {
		best[s] = amount + 1
	}
	for _, coin := range coins {
		for s := coin; s <= amount; s++ {
			best[s] = min(best[s], best[s-coin]+1)
		}
	}
	if best[amount] == amount+1 {
		return -1
	}
	return best[amount]
}

func coinCombinations(coins []int, amount int) int {
	ways := make([]int64, amount+1)
	ways[0] = 1
	for _, coin := range coins {
		for s := coin; s <= amount; s++ {
			ways[s] = min(2147483647, ways[s]+ways[s-coin])
		}
	}
	return int(ways[amount])
}

func countBySubset(nums []int, target int) int {
	sum := 0
	for _, x := range nums {
		sum += x
	}
	twice := sum - target
	if target > sum || target < -sum || twice%2 != 0 {
		return 0
	}
	goal := twice / 2
	ways := make([]int, goal+1)
	ways[0] = 1
	for _, x := range nums {
		for s := goal; s >= x; s-- {
			ways[s] += ways[s-x]
		}
	}
	return ways[goal]
}

func main() {
	manyEvenCoins := make([]int, 300)
	for i := 0; i < 299; i++ {
		manyEvenCoins[i] = 2 * (i + 1)
	}
	manyEvenCoins[299] = 4999
	checks := []bool{
		canPartition([]int{4, 4, 6, 2}),
		!canPartition([]int{2, 3, 7}),
		minCoins([]int{1, 4, 6}, 8) == 2,
		minCoins([]int{4, 6}, 7) == -1,
		minCoins([]int{2147483647}, 0) == 0,
		coinCombinations([]int{2, 3, 4}, 7) == 2,
		coinCombinations([]int{4, 6}, 0) == 1,
		coinCombinations(manyEvenCoins, 4999) == 1,
		countBySubset([]int{0, 0, 2, 3}, -1) == 4,
		countBySubset([]int{2, 5}, 0) == 0,
	}
	for _, ok := range checks {
		if !ok {
			panic("ca kiểm tra sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(checks), len(checks))
}
