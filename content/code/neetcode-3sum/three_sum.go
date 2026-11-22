// LeetCode 15, 3Sum: ba cách và test.
// Chạy: go run three_sum.go
package main

import (
	"fmt"
	"reflect"
	"slices"
)

func bruteForce(nums []int) [][]int {
	seen := map[[3]int]bool{} // mảng cố định [3]int làm khóa map được; slice thì không
	out := [][]int{}
	for i := 0; i < len(nums); i++ {
		for j := i + 1; j < len(nums); j++ {
			for k := j + 1; k < len(nums); k++ {
				if nums[i]+nums[j]+nums[k] == 0 {
					t := [3]int{nums[i], nums[j], nums[k]}
					slices.Sort(t[:])
					if !seen[t] {
						seen[t] = true
						out = append(out, t[:])
					}
				}
			}
		}
	}
	return out
}

func hashPerAnchor(nums []int) [][]int {
	seen := map[[3]int]bool{}
	out := [][]int{}
	for i := range nums {
		met := map[int]bool{}
		for j := i + 1; j < len(nums); j++ {
			need := -nums[i] - nums[j]
			if met[need] {
				t := [3]int{nums[i], nums[j], need}
				slices.Sort(t[:])
				if !seen[t] {
					seen[t] = true
					out = append(out, t[:])
				}
			}
			met[nums[j]] = true
		}
	}
	return out
}

func sortTwoPointers(nums []int) [][]int {
	a := slices.Clone(nums)
	slices.Sort(a)
	out := [][]int{}
	for i := 0; i < len(a)-2; i++ {
		if a[i] > 0 {
			break
		}
		if i > 0 && a[i] == a[i-1] {
			continue
		}
		for lo, hi := i+1, len(a)-1; lo < hi; {
			switch s := a[i] + a[lo] + a[hi]; {
			case s < 0:
				lo++
			case s > 0:
				hi--
			default:
				out = append(out, []int{a[i], a[lo], a[hi]})
				lo, hi = lo+1, hi-1
				for lo < hi && a[lo] == a[lo-1] {
					lo++
				}
			}
		}
	}
	return out
}

func norm(r [][]int) [][]int {
	out := [][]int{}
	for _, t := range r {
		c := slices.Clone(t)
		slices.Sort(c)
		out = append(out, c)
	}
	slices.SortFunc(out, func(x, y []int) int { return slices.Compare(x, y) })
	return out
}

func main() {
	cases := []struct {
		nums []int
		want [][]int
	}{
		{[]int{-1, 0, 1, 2, -1, -4}, [][]int{{-1, -1, 2}, {-1, 0, 1}}}, {[]int{0, 1, 1}, [][]int{}}, {[]int{0, 0, 0}, [][]int{{0, 0, 0}}},
		{[]int{0, 0, 0, 0}, [][]int{{0, 0, 0}}}, {[]int{-2, 0, 1, 1, 2}, [][]int{{-2, 0, 2}, {-2, 1, 1}}},
		{[]int{-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6}, [][]int{{-4, -2, 6}, {-4, 0, 4}, {-4, 1, 3}, {-4, 2, 2}, {-2, -2, 4}, {-2, 0, 2}}},
		{[]int{-10, 5, 5, -1, 11, -1}, [][]int{{-10, -1, 11}, {-10, 5, 5}}},
	}
	for _, f := range []struct {
		name string
		fn   func([]int) [][]int
	}{{"bruteForce", bruteForce}, {"hashPerAnchor", hashPerAnchor}, {"sortTwoPointers", sortTwoPointers}} {
		ok := 0
		for _, c := range cases {
			if reflect.DeepEqual(norm(f.fn(c.nums)), norm(c.want)) {
				ok++
			}
		}
		fmt.Printf("%-16s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
