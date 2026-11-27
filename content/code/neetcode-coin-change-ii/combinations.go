package main

import "fmt"

const limit = 2_147_483_647

func enumerateCounts(amount int, coins []int) int64 {
	if len(coins) == 0 {
		if amount == 0 {
			return 1
		}
		return 0
	}
	var ways int64
	for rest := amount; rest >= 0; rest -= coins[0] {
		ways += enumerateCounts(rest, coins[1:])
	}
	return ways
}

func countTable(amount int, coins []int) int64 {
	rows := make([][]int64, len(coins)+1)
	rows[0] = make([]int64, amount+1)
	rows[0][0] = 1
	for i, coin := range coins {
		previous := rows[i]
		current := make([]int64, amount+1)
		copy(current, previous)
		for total := coin; total <= amount; total++ {
			current[total] = min(limit, previous[total]+current[total-coin])
		}
		rows[i+1] = current
	}
	return rows[len(coins)][amount]
}

func countCombinations(amount int, coins []int) int64 {
	ways := make([]int64, amount+1)
	ways[0] = 1
	for _, coin := range coins {
		for total := coin; total <= amount; total++ {
			ways[total] = min(limit, ways[total]+ways[total-coin])
		}
	}
	return ways[amount]
}

func main() {
	many := make([]int, 300)
	for i := 0; i < 299; i++ {
		many[i] = 2 * (i + 1)
	}
	many[299] = 4999
	cases := []struct {
		amount   int
		coins    []int
		expected int64
	}{
		{8, []int{2, 3, 5}, 3},
		{5, []int{3, 2}, 1},
		{10, []int{5, 2, 3}, 4},
		{7, []int{6, 4}, 0},
		{16, []int{4}, 1},
		{0, []int{7, 11}, 1},
		{2, []int{3, 5000}, 0},
		{4, []int{2, 1}, 3},
		{120, []int{6, 1, 4, 9, 17}, 4131},
		{4999, many, 1},
	}
	for _, c := range cases {
		if countTable(c.amount, c.coins) != c.expected ||
			countCombinations(c.amount, c.coins) != c.expected ||
			(c.amount <= 20 && enumerateCounts(c.amount, c.coins) != c.expected) {
			panic(c)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
