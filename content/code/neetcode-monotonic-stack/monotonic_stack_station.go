// Ga ARR-07: ngăn xếp đơn điệu. Giải 739, 853 và 84, tự chạy test.
// Chạy: go run monotonic_stack_station.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

// 739
func dailyTemperatures(t []int) []int {
	out := make([]int, len(t))
	stack := []int{}
	for i, x := range t {
		for len(stack) > 0 && x > t[stack[len(stack)-1]] {
			j := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			out[j] = i - j
		}
		stack = append(stack, i)
	}
	return out
}

// 853
func carFleet(target int, position, speed []int) int {
	idx := make([]int, len(position))
	for i := range idx {
		idx[i] = i
	}
	sort.Slice(idx, func(a, b int) bool { return position[idx[a]] > position[idx[b]] })
	fleets := []float64{}
	for _, i := range idx {
		time := float64(target-position[i]) / float64(speed[i]) // đổi sang float64 TRƯỚC khi chia: int/int cắt phần lẻ
		if len(fleets) == 0 || time > fleets[len(fleets)-1] {
			fleets = append(fleets, time)
		}
	}
	return len(fleets)
}

// 84
func largestRectangleArea(h []int) int {
	stack := []int{}
	best := 0
	for i := 0; i <= len(h); i++ {
		cur := 0
		if i < len(h) {
			cur = h[i]
		}
		for len(stack) > 0 && cur < h[stack[len(stack)-1]] {
			height := h[stack[len(stack)-1]]
			stack = stack[:len(stack)-1]
			left := -1
			if len(stack) > 0 {
				left = stack[len(stack)-1]
			}
			best = max(best, height*(i-left-1))
		}
		stack = append(stack, i)
	}
	return best
}

func main() {
	tests := []bool{
		slices.Equal(dailyTemperatures([]int{73, 74, 75, 71, 69, 72, 76, 73}), []int{1, 1, 4, 2, 1, 1, 0, 0}),
		slices.Equal(dailyTemperatures([]int{70, 70, 71}), []int{2, 1, 0}),
		carFleet(12, []int{10, 8, 0, 5, 3}, []int{2, 4, 1, 1, 3}) == 3, carFleet(10, []int{3}, []int{3}) == 1,
		carFleet(100, []int{0, 2, 4}, []int{4, 2, 1}) == 1,
		largestRectangleArea([]int{2, 1, 5, 6, 2, 3}) == 10, largestRectangleArea([]int{2, 4}) == 4,
		largestRectangleArea([]int{2, 2, 2}) == 6, largestRectangleArea([]int{6, 2, 5, 4, 5, 1, 6}) == 12,
	}
	ok := 0
	for _, t := range tests {
		if t {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(tests))
}
