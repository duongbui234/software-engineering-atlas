package main

import (
	"fmt"
	"strings"
)

func countStairs(n int) int {
	older, latest := 1, 1
	for i := 2; i <= n; i++ {
		older, latest = latest, older+latest
	}
	return latest
}

func cheapestStairs(cost []int) int {
	older, latest := 0, 0
	for i := 2; i <= len(cost); i++ {
		older, latest = latest, min(latest+cost[i-1], older+cost[i-2])
	}
	return latest
}

func robRange(nums []int, start, end int) int {
	older, latest := 0, 0
	for i := start; i < end; i++ {
		older, latest = latest, max(latest, older+nums[i])
	}
	return latest
}

func robRing(nums []int) int {
	if len(nums) == 1 {
		return nums[0]
	}
	return max(robRange(nums, 0, len(nums)-1), robRange(nums, 1, len(nums)))
}

func decode(s string) int {
	older, latest := 1, 0
	if s[0] != '0' {
		latest = 1
	}
	for i := 1; i < len(s); i++ {
		var next int64
		if s[i] != '0' {
			next += int64(latest)
		}
		pair := s[i-1 : i+1]
		if pair >= "10" && pair <= "26" {
			next += int64(older)
		}
		older, latest = latest, int(min(next, 2147483647))
	}
	return latest
}

func maxProduct(nums []int) int {
	high, low, best := nums[0], nums[0], nums[0]
	for _, x := range nums[1:] {
		high, low = max(x, x*high, x*low), min(x, x*high, x*low)
		best = max(best, high)
	}
	return best
}

func main() {
	checks := []bool{
		countStairs(6) == 13,
		cheapestStairs([]int{6, 2, 8, 1}) == 3,
		robRange([]int{4, 1, 1, 7, 2}, 0, 5) == 11,
		robRing([]int{9, 1, 1, 9}) == 10,
		robRing([]int{7}) == 7,
		decode("127") == 2,
		decode(strings.Repeat("1", 60)+"00") == 0,
		decode("100") == 0,
		maxProduct([]int{-3, 2, -4}) == 24,
		maxProduct([]int{-2, 0, -1}) == 0,
	}
	for _, ok := range checks {
		if !ok {
			panic("kết quả sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(checks), len(checks))
}
