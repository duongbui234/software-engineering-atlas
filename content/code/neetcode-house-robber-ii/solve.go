package main

import "fmt"

type rangeSolver func([]int, int, int) int

func rolling(nums []int, start, end int) int {
	twoBack, oneBack := 0, 0
	for i := start; i < end; i++ {
		twoBack, oneBack = oneBack, max(oneBack, twoBack+nums[i])
	}
	return oneBack
}

func table(nums []int, start, end int) int {
	best := make([]int, end-start+2)
	for i := start; i < end; i++ {
		j := i - start
		best[j+2] = max(best[j+1], best[j]+nums[i])
	}
	return best[len(best)-1]
}

func brute(nums []int, i, end int) int {
	if i >= end {
		return 0
	}
	return max(brute(nums, i+1, end), nums[i]+brute(nums, i+2, end))
}

func rob(nums []int, solve rangeSolver) int {
	if len(nums) == 1 {
		return nums[0]
	}
	return max(solve(nums, 0, len(nums)-1), solve(nums, 1, len(nums)))
}

func main() {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{8}, 8},
		{[]int{0, 0, 0}, 0},
		{[]int{8, 11, 8}, 11},
		{[]int{9, 1, 1, 9}, 10},
		{[]int{4, 9, 1, 8, 3, 7}, 24},
		{[]int{10, 1}, 10},
	}
	passed := 0
	for _, test := range cases {
		for _, solve := range []rangeSolver{brute, table, rolling} {
			if rob(test.nums, solve) != test.want {
				panic(test.nums)
			}
			passed++
		}
	}
	long := make([]int, 100)
	for i := range long {
		long[i] = 3
	}
	for _, solve := range []rangeSolver{table, rolling} {
		if rob(long, solve) != 150 {
			panic("ca dài")
		}
		passed++
	}
	fmt.Printf("%d/%d ca đúng\n", passed, len(cases)*3+2)
}
