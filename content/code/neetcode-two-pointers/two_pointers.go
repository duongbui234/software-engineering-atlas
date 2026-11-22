// Ga ARR-04: hai con trỏ. Giải 125, 167, 15, 11, 42 bằng cùng một khuôn, tự chạy test.
// Chạy: go run two_pointers.go
package main

import (
	"fmt"
	"reflect"
	"slices"
	"unicode"
)

func isAlnum(c byte) bool { return c < 128 && (unicode.IsLetter(rune(c)) || unicode.IsDigit(rune(c))) }

// 125
func isPalindrome(s string) bool {
	for i, j := 0, len(s)-1; i < j; {
		switch {
		case !isAlnum(s[i]):
			i++
		case !isAlnum(s[j]):
			j--
		case unicode.ToLower(rune(s[i])) != unicode.ToLower(rune(s[j])):
			return false
		default:
			i, j = i+1, j-1
		}
	}
	return true
}

// 167
func twoSumSorted(nums []int, target int) []int {
	for i, j := 0, len(nums)-1; i < j; {
		s := nums[i] + nums[j]
		if s == target {
			return []int{i + 1, j + 1}
		}
		if s < target {
			i++
		} else {
			j--
		}
	}
	return nil
}

// 15
func threeSum(nums []int) [][]int {
	a := slices.Clone(nums)
	slices.Sort(a)
	out := [][]int{}
	for i := 0; i < len(a)-2 && a[i] <= 0; i++ {
		if i > 0 && a[i] == a[i-1] {
			continue
		}
		for lo, hi := i+1, len(a)-1; lo < hi; {
			s := a[i] + a[lo] + a[hi]
			if s < 0 {
				lo++
			} else if s > 0 {
				hi--
			} else {
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

// 11
func maxArea(h []int) int {
	best := 0
	for i, j := 0, len(h)-1; i < j; {
		best = max(best, (j-i)*min(h[i], h[j]))
		if h[i] < h[j] {
			i++
		} else {
			j--
		}
	}
	return best
}

// 42
func trap(h []int) int {
	total, lm, rm := 0, 0, 0
	for i, j := 0, len(h)-1; i < j; {
		lm, rm = max(lm, h[i]), max(rm, h[j])
		if lm < rm {
			total += lm - h[i]
			i++
		} else {
			total += rm - h[j]
			j--
		}
	}
	return total
}

func main() {
	eq := reflect.DeepEqual
	tests := []bool{
		isPalindrome("A man, a plan, a canal: Panama"), !isPalindrome("race a car"), isPalindrome(" "),
		eq(twoSumSorted([]int{2, 7, 11, 15}, 9), []int{1, 2}), eq(twoSumSorted([]int{-1, 0}, -1), []int{1, 2}),
		eq(threeSum([]int{-1, 0, 1, 2, -1, -4}), [][]int{{-1, -1, 2}, {-1, 0, 1}}), eq(threeSum([]int{0, 0, 0, 0}), [][]int{{0, 0, 0}}),
		maxArea([]int{1, 8, 6, 2, 5, 4, 8, 3, 7}) == 49, maxArea([]int{1, 1}) == 1,
		trap([]int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}) == 6, trap([]int{4, 2, 0, 3, 2, 5}) == 9,
	}
	ok := 0
	for _, t := range tests {
		if t {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(tests))
}
