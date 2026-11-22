// LeetCode 121, Best Time to Buy and Sell Stock: ba cách và test.
// Chạy: go run best_time_stock.go
package main

import (
	"fmt"
	"math"
)

func bruteForce(prices []int) int {
	best := 0
	for i := range prices {
		for j := i + 1; j < len(prices); j++ {
			best = max(best, prices[j]-prices[i])
		}
	}
	return best
}

func runningMin(prices []int) int {
	minSoFar, best := math.MaxInt, 0
	for _, p := range prices {
		if minSoFar != math.MaxInt { // p - MaxInt không tràn với giá ≥ 0, nhưng so trước cho rõ ý
			best = max(best, p-minSoFar)
		}
		minSoFar = min(minSoFar, p)
	}
	return best
}

func twoPointers(prices []int) int {
	left, best := 0, 0
	for right := 1; right < len(prices); right++ {
		if prices[right] < prices[left] {
			left = right
		} else {
			best = max(best, prices[right]-prices[left])
		}
	}
	return best
}

func main() {
	cases := []struct {
		p    []int
		want int
	}{{[]int{7, 1, 5, 3, 6, 4}, 5}, {[]int{7, 6, 4, 3, 1}, 0}, {[]int{2, 4, 1}, 2}, {[]int{1}, 0}, {[]int{3, 3, 3}, 0}, {[]int{2, 1, 2, 1, 0, 1, 2}, 2}}
	for _, f := range []struct {
		name string
		fn   func([]int) int
	}{{"bruteForce", bruteForce}, {"runningMin", runningMin}, {"twoPointers", twoPointers}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.p) == c.want {
				ok++
			}
		}
		fmt.Printf("%-12s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
