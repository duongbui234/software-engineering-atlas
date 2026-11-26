package main

import "fmt"

func maximumProduct(values []int) int {
	high, low, best := values[0], values[0], values[0]
	for _, x := range values[1:] {
		extendHigh, extendLow := high*x, low*x
		high = max(x, extendHigh, extendLow)
		low = min(x, extendHigh, extendLow)
		best = max(best, high)
	}
	return best
}

func maximumByIntervals(nums []int) int {
	best := nums[0]
	for left := range nums {
		product := 1
		for _, value := range nums[left:] {
			product *= value
			best = max(best, product)
		}
	}
	return best
}

func main() {
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
	}
	check(maximumProduct([]int{-2, 3, -4}), 24)
	check(maximumByIntervals([]int{-2, 3, -4}), 24)
	check(maximumProduct([]int{-3}), -3)
	check(maximumByIntervals([]int{-3}), -3)
	check(maximumProduct([]int{-2, -3, -4}), 12)
	check(maximumByIntervals([]int{-2, -3, -4}), 12)
	check(maximumProduct([]int{0, -2, 0, -3, -4}), 12)
	check(maximumByIntervals([]int{0, -2, 0, -3, -4}), 12)
	check(maximumProduct([]int{0, -3, 0}), 0)
	check(maximumByIntervals([]int{0, -3, 0}), 0)
	check(maximumProduct([]int{1}), 1)
	check(maximumByIntervals([]int{1}), 1)
	check(maximumProduct([]int{2, 3, 0, -2, -4}), 8)
	check(maximumByIntervals([]int{2, 3, 0, -2, -4}), 8)
	fmt.Println("7/7 ca đúng")
}
