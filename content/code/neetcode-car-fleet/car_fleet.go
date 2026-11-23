// LeetCode 853, Car Fleet: các cách giải và test.
// Chạy: go run car_fleet.go
package main

import (
	"fmt"
	"slices"
)

func sortStack(target int, position, speed []int) int {
	idx := make([]int, len(position))
	for i := range idx {
		idx[i] = i
	}
	slices.SortFunc(idx, func(a, b int) int { return position[b] - position[a] }) // vị trí giảm dần
	stack := []float64{}
	for _, i := range idx {
		t := float64(target-position[i]) / float64(speed[i]) // int / int trong Go là chia NGUYÊN: phải đổi sang float64 trước
		if len(stack) == 0 || t > stack[len(stack)-1] {
			stack = append(stack, t)
		}
	}
	return len(stack)
}

func sortCrossMultiply(target int, position, speed []int) int {
	idx := make([]int, len(position))
	for i := range idx {
		idx[i] = i
	}
	slices.SortFunc(idx, func(a, b int) int { return position[b] - position[a] })
	fleets, leadD, leadS := 0, 0, 1
	for _, i := range idx {
		d := target - position[i]
		if fleets == 0 || d*leadS > leadD*speed[i] { // int của Go là 64 bit: 10⁶ · 10⁶ = 10¹² vừa
			fleets, leadD, leadS = fleets+1, d, speed[i]
		}
	}
	return fleets
}

func intDivision(target int, position, speed []int) int { // SAI: quên đổi sang float64
	idx := make([]int, len(position))
	for i := range idx {
		idx[i] = i
	}
	slices.SortFunc(idx, func(a, b int) int { return position[b] - position[a] })
	fleets, lead := 0, -1
	for _, i := range idx {
		t := (target - position[i]) / speed[i]
		if t > lead {
			fleets, lead = fleets+1, t
		}
	}
	return fleets
}

func main() {
	cases := []struct {
		target          int
		position, speed []int
		want            int
	}{
		{12, []int{10, 8, 0, 5, 3}, []int{2, 4, 1, 1, 3}, 3}, {10, []int{3}, []int{3}, 1}, {100, []int{0, 2, 4}, []int{4, 2, 1}, 1},
		{10, []int{6, 8}, []int{3, 2}, 2}, {10, []int{0, 4, 2}, []int{2, 1, 3}, 1}, {4, []int{3, 1}, []int{3, 9}, 1}, {20, []int{6, 2, 17}, []int{3, 9, 2}, 2},
	}
	for _, f := range []struct {
		name string
		fn   func(int, []int, []int) int
	}{{"sortStack", sortStack}, {"sortCrossMultiply", sortCrossMultiply}, {"intDivision", intDivision}} {
		ok, bad := 0, []string{}
		for _, c := range cases {
			if f.fn(c.target, c.position, c.speed) == c.want {
				ok++
			} else {
				bad = append(bad, fmt.Sprintf("t=%d %v", c.target, c.position))
			}
		}
		fmt.Printf("%-18s %d/%d ca đúng", f.name, ok, len(cases))
		if len(bad) > 0 {
			fmt.Printf("; sai ở %v", bad)
		}
		fmt.Println()
	}
}
