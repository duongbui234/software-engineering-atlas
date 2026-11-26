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
	cases := [][2]int{{1, 1}, {4, 5}, {8, 34}, {24, 75025}, {45, 1836311903}}
	for _, c := range cases {
		check(c[0], func(_ int) int { return 0 }, func(a, b int) int { return a + b }, 1, c[1], c[0] <= 24)
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
