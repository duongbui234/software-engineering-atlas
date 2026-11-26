package main

import "fmt"

func check(n int, add func(int) int, choose func(int, int) int, base, expected int, small bool) {
	var brute func(int) int
	brute = func(i int) int {
		if i < 2 {
			return base
		}
		return choose(brute(i-1)+add(i-1), brute(i-2)+add(i-2))
	}
	if small && brute(n) != expected {
		panic("vét cạn sai")
	}

	dp := make([]int, n+1)
	dp[0], dp[1] = base, base
	twoBack, oneBack := base, base
	for i := 2; i <= n; i++ {
		dp[i] = choose(dp[i-1]+add(i-1), dp[i-2]+add(i-2))
		twoBack, oneBack = oneBack, choose(oneBack+add(i-1), twoBack+add(i-2))
	}
	if dp[n] != expected || oneBack != expected {
		panic("quy hoạch động sai")
	}
}

func main() {
	large := make([]int, 1000)
	for i := range large {
		large[i] = 999
	}
	cases := []struct {
		cost     []int
		expected int
	}{
		{[]int{6, 2, 8, 1}, 3}, {[]int{19, 4}, 4}, {[]int{0, 0, 0, 0}, 0}, {[]int{5, 0, 9, 0, 3}, 0}, {large, 499500},
	}
	for _, c := range cases {
		check(len(c.cost), func(i int) int { return c.cost[i] }, func(a, b int) int { return min(a, b) }, 0, c.expected, len(c.cost) <= 18)
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
