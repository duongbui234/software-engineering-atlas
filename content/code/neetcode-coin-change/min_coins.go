package main

import "fmt"

func minCoins(coins []int, amount int) int {
	impossible := amount + 1
	dp := make([]int, amount+1)
	for sum := 1; sum <= amount; sum++ {
		dp[sum] = impossible
	}

	for _, coin := range coins {
		for sum := coin; sum <= amount; sum++ {
			dp[sum] = min(dp[sum], dp[sum-coin]+1)
		}
	}
	if dp[amount] == impossible {
		return -1
	}
	return dp[amount]
}

func byAmount(coins []int, amount int) int {
	impossible := amount + 1
	dp := make([]int, amount+1)
	for sum := 1; sum <= amount; sum++ {
		dp[sum] = impossible
		for _, coin := range coins {
			if coin <= sum {
				dp[sum] = min(dp[sum], dp[sum-coin]+1)
			}
		}
	}
	if dp[amount] == impossible {
		return -1
	}
	return dp[amount]
}

func search(coins []int, amount int, useMemo bool) (int, int) {
	impossible := amount + 1
	memo := make(map[int]int)
	calls := 0
	var visit func(int) int
	visit = func(remaining int) int {
		calls++
		if remaining == 0 {
			return 0
		}
		if value, ok := memo[remaining]; useMemo && ok {
			return value
		}
		best := impossible
		for _, coin := range coins {
			if coin <= remaining {
				best = min(best, visit(remaining-coin)+1)
			}
		}
		if useMemo {
			memo[remaining] = best
		}
		return best
	}
	best := visit(amount)
	if best == impossible {
		best = -1
	}
	return best, calls
}

func main() {
	cases := []struct {
		coins        []int
		amount, want int
	}{
		{[]int{4, 7}, 14, 2},
		{[]int{4, 7}, 13, -1},
		{[]int{1, 5, 7}, 10, 2},
		{[]int{1}, 10000, 10000},
		{[]int{2147483647, 3}, 9, 3},
		{[]int{8, 9}, 0, 0},
		{[]int{4, 6}, 7, -1},
		{[]int{9, 4}, 12, 3},
		{[]int{14, 21}, 28, 2},
		{[]int{10, 15, 25}, 30, 2},
	}
	for _, c := range cases {
		if minCoins(c.coins, c.amount) != c.want || byAmount(c.coins, c.amount) != c.want {
			panic("DP sai")
		}
		if c.amount <= 30 {
			brute, _ := search(c.coins, c.amount, false)
			memoized, _ := search(c.coins, c.amount, true)
			if brute != c.want || memoized != c.want {
				panic("Đệ quy sai")
			}
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	brute, bruteCalls := search([]int{4, 6, 9}, 36, false)
	memoized, memoCalls := search([]int{4, 6, 9}, 36, true)
	if brute != 4 || memoized != brute {
		panic("Ca đo sai")
	}
	fmt.Printf("A=36: vét cạn %d, memo %d lượt gọi\n", bruteCalls, memoCalls)
}
