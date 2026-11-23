// LeetCode 875, Koko Eating Bananas: tìm nhị phân trên đáp án, sort.Search, và tổng giờ tràn int32.
// Chạy: go run koko_eating.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

// Số giờ với tốc độ k. int của Go là 64 bit trên máy 64 bit, nên tổng 10⁴ · 10⁹ không tràn.
func hoursNeeded(piles []int, k int) int {
	hours := 0
	for _, p := range piles {
		hours += (p + k - 1) / k // ⌈p / k⌉ bằng số nguyên
	}
	return hours
}

func minEatingSpeed(piles []int, h int) int {
	lo, hi := 1, slices.Max(piles)
	for lo < hi { // bất biến: hi luôn kịp, mọi tốc độ < lo đều trễ
		mid := lo + (hi-lo)/2
		if hoursNeeded(piles, mid) <= h {
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}

// sort.Search(n, f) trả i nhỏ nhất trong [0, n) có f(i) đúng; ở đây chỉ số i ứng với tốc độ i + 1.
func viaSortSearch(piles []int, h int) int {
	return sort.Search(slices.Max(piles), func(i int) bool { return hoursNeeded(piles, i+1) <= h }) + 1
}

// SAI: cộng giờ vào int32 rồi thử tốc độ từ 1. Ở k = 1 tổng là 2 415 919 104, vượt 2³¹ − 1 và quay thành số âm.
func linearInt32(piles []int, h int) int {
	for k := 1; ; k++ {
		var hours int32
		for _, p := range piles {
			hours += int32((p + k - 1) / k)
		}
		if int(hours) <= h {
			return k
		}
	}
}

type tc struct {
	piles []int
	h     int
	want  int
}

func main() {
	cases := []tc{
		{[]int{3, 6, 7, 11}, 8, 4}, {[]int{30, 11, 23, 4, 20}, 5, 30}, {[]int{30, 11, 23, 4, 20}, 6, 23},
		{[]int{1}, 1, 1}, {[]int{1, 1}, 5, 1}, {[]int{1000000000}, 2, 500000000}, {[]int{312884470}, 312884469, 2},
		{[]int{805306368, 805306368, 805306368}, 1000000000, 3}, {[]int{2, 2}, 2, 2}, {[]int{7}, 3, 3},
	}
	for _, f := range []struct {
		name string
		fn   func([]int, int) int
	}{{"minEatingSpeed", minEatingSpeed}, {"viaSortSearch", viaSortSearch}} {
		ok, bad := 0, []string{}
		for _, c := range cases {
			if got := f.fn(c.piles, c.h); got == c.want {
				ok++
			} else {
				bad = append(bad, fmt.Sprintf("%v h=%d → %d", c.piles, c.h, got))
			}
		}
		if len(bad) == 0 {
			fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
		} else {
			fmt.Printf("%-15s %d/%d ca đúng; sai ở %v\n", f.name, ok, len(cases), bad)
		}
	}
	p := []int{805306368, 805306368, 805306368}
	var sum32 int32
	for _, x := range p {
		sum32 += int32(x)
	}
	fmt.Printf("\n[805306368 ×3], k = 1: tổng int = %d, tổng int32 = %d\n", hoursNeeded(p, 1), sum32)
	fmt.Printf("linearInt32 trả %d (đúng là %d)\n", linearInt32(p, 1000000000), minEatingSpeed(p, 1000000000))
}
