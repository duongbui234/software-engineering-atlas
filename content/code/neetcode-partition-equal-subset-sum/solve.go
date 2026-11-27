package main

import (
	"fmt"
	"slices"
)

func brute(nums []int, target int) bool {
	if target == 0 {
		return true
	}
	if target < 0 || len(nums) == 0 {
		return false
	}
	return brute(nums[1:], target-nums[0]) || brute(nums[1:], target)
}

func table(nums []int, target int) bool {
	rows := make([][]bool, len(nums)+1)
	for i := range rows {
		rows[i] = make([]bool, target+1)
	}
	rows[0][0] = true
	for i, x := range nums {
		for sum := 0; sum <= target; sum++ {
			rows[i+1][sum] = rows[i][sum] || (sum >= x && rows[i][sum-x])
		}
	}
	return rows[len(nums)][target]
}

func descending(nums []int, target int) bool {
	reachable := make([]bool, target+1)
	reachable[0] = true
	for _, x := range nums {
		for sum := target; sum >= x; sum-- {
			reachable[sum] = reachable[sum] || reachable[sum-x]
		}
	}
	return reachable[target]
}

func bitset(nums []int, target int) bool {
	words := make([]uint32, target/32+1)
	words[0] = 1
	for _, x := range nums {
		offset, shift := x/32, x%32
		for dst := len(words) - 1; dst >= offset; dst-- {
			src := dst - offset
			moved := words[src] << shift
			if shift != 0 && src > 0 {
				moved |= words[src-1] >> (32 - shift)
			}
			words[dst] |= moved
		}
	}
	return words[target/32]&(uint32(1)<<(target%32)) != 0
}

func main() {
	limits := slices.Repeat([]int{100}, 200)
	impossible := append(slices.Repeat([]int{100}, 199), 98)
	cases := []struct {
		nums     []int
		expected bool
	}{
		{[]int{8}, false},
		{[]int{2, 2}, true},
		{[]int{3, 6, 7, 10}, true},
		{[]int{2, 3, 7}, false},
		{[]int{1, 4, 8}, false},
		{[]int{2, 2, 2}, false},
		{[]int{31, 31}, true},
		{[]int{32, 32}, true},
		{[]int{33, 33}, true},
		{[]int{31, 2, 30, 3}, true},
		{[]int{32, 1, 17, 16}, true},
		{[]int{33, 31, 30, 34}, true},
		{[]int{63, 2, 33, 32}, true},
		{[]int{100, 40, 40}, false},
		{limits, true},
		{impossible, false},
	}
	for _, item := range cases {
		total := 0
		for _, x := range item.nums {
			total += x
		}
		for _, solve := range []func([]int, int) bool{table, descending, bitset} {
			if (total%2 == 0 && solve(item.nums, total/2)) != item.expected {
				panic("Kết quả DP sai")
			}
		}
		if len(item.nums) < 20 && (total%2 == 0 && brute(item.nums, total/2)) != item.expected {
			panic("Kết quả vét cạn sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
