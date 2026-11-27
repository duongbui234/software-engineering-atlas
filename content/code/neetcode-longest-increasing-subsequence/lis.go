package main

import "fmt"

func lisByBrute(nums []int) int {
	var visit func(int, int) int
	visit = func(i, last int) int {
		if i == len(nums) {
			return 0
		}
		skip := visit(i+1, last)
		if last < 0 || nums[last] < nums[i] {
			return max(skip, 1+visit(i+1, i))
		}
		return skip
	}
	return visit(0, -1)
}

func lisByEndpoint(nums []int) int {
	longest := make([]int, len(nums))
	best := 0
	for i, x := range nums {
		longest[i] = 1
		for j := 0; j < i; j++ {
			if nums[j] < x {
				longest[i] = max(longest[i], longest[j]+1)
			}
		}
		best = max(best, longest[i])
	}
	return best
}

func lisByTails(nums []int) int {
	var tails []int
	for _, x := range nums {
		lo, hi := 0, len(tails)
		for lo < hi {
			mid := lo + (hi-lo)/2
			if tails[mid] < x {
				lo = mid + 1
			} else {
				hi = mid
			}
		}
		if lo == len(tails) {
			tails = append(tails, x)
		} else {
			tails[lo] = x
		}
	}
	return len(tails)
}

func main() {
	ascending, descending := make([]int, 2500), make([]int, 2500)
	for i := range ascending {
		ascending[i], descending[i] = i-1250, 1249-i
	}
	cases := []struct {
		nums []int
		want int
	}{
		{nil, 0}, {[]int{-10000}, 1}, {[]int{4, 8, 1, 6, 9, 2}, 3}, {[]int{1, 4, 9, -1}, 3},
		{[]int{3, 3, 3, 3}, 1}, {[]int{8, 6, 4, 2}, 1}, {[]int{-10000, -2, 0, 10000}, 4}, {[]int{1, 3, 3, 8}, 3},
		{[]int{-3, -1, -2, 0}, 3}, {[]int{2, 6, 3, 4, 1, 5}, 4}, {ascending, 2500}, {descending, 1},
	}
	for _, c := range cases {
		if lisByEndpoint(c.nums) != c.want || lisByTails(c.nums) != c.want ||
			(len(c.nums) <= 10 && lisByBrute(c.nums) != c.want) {
			panic(c)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
