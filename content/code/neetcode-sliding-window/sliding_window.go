// Ga ARR-05: cửa sổ trượt. Giải 121, 3, 424, 567, 76, 239 và tự chạy test.
// Chạy: go run sliding_window.go
package main

import (
	"fmt"
	"math"
	"slices"
)

// 121
func maxProfit(prices []int) int {
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

// 3
func lengthOfLongestSubstring(s string) int {
	var last [128]int // vị trí + 1
	left, best := 0, 0
	for right := 0; right < len(s); right++ {
		left = max(left, last[s[right]])
		last[s[right]] = right + 1
		best = max(best, right-left+1)
	}
	return best
}

// 424
func characterReplacement(s string, k int) int {
	var count [26]int
	left, maxFreq, best := 0, 0, 0
	for right := 0; right < len(s); right++ {
		count[s[right]-'A']++
		maxFreq = max(maxFreq, count[s[right]-'A'])
		if right-left+1-maxFreq > k {
			count[s[left]-'A']--
			left++
		}
		best = max(best, right-left+1)
	}
	return best
}

// 567: mảng cố định [26]int so được bằng ==
func checkInclusion(s1, s2 string) bool {
	n := len(s1)
	if n > len(s2) {
		return false
	}
	var need, have [26]int
	for i := 0; i < n; i++ {
		need[s1[i]-'a']++
		have[s2[i]-'a']++
	}
	for right := n; ; right++ {
		if need == have {
			return true
		}
		if right == len(s2) {
			return false
		}
		have[s2[right]-'a']++
		have[s2[right-n]-'a']--
	}
}

// 76
func minWindow(s, t string) string {
	var need [128]int
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}
	missing, left, bestL, bestLen := len(t), 0, 0, math.MaxInt
	for right := 0; right < len(s); right++ {
		if need[s[right]] > 0 {
			missing--
		}
		need[s[right]]--
		for missing == 0 {
			if right-left+1 < bestLen {
				bestL, bestLen = left, right-left+1
			}
			need[s[left]]++
			if need[s[left]] > 0 {
				missing++
			}
			left++
		}
	}
	if bestLen == math.MaxInt {
		return ""
	}
	return s[bestL : bestL+bestLen]
}

// 239
func maxSlidingWindow(nums []int, k int) []int {
	dq, out := []int{}, []int{}
	for i, x := range nums {
		for len(dq) > 0 && nums[dq[len(dq)-1]] <= x {
			dq = dq[:len(dq)-1]
		}
		dq = append(dq, i)
		if dq[0] <= i-k {
			dq = dq[1:] // cắt đầu slice là O(1)
		}
		if i >= k-1 {
			out = append(out, nums[dq[0]])
		}
	}
	return out
}

func main() {
	tests := []bool{
		maxProfit([]int{7, 1, 5, 3, 6, 4}) == 5, maxProfit([]int{7, 6, 4, 3, 1}) == 0,
		lengthOfLongestSubstring("abcabcbb") == 3, lengthOfLongestSubstring("abba") == 2,
		characterReplacement("ABAB", 2) == 4, characterReplacement("AABABBA", 1) == 4,
		checkInclusion("ab", "eidbaooo"), !checkInclusion("ab", "eidboaoo"),
		minWindow("ADOBECODEBANC", "ABC") == "BANC", minWindow("a", "aa") == "",
		slices.Equal(maxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3), []int{3, 3, 5, 5, 6, 7}),
		slices.Equal(maxSlidingWindow([]int{1}, 1), []int{1}),
	}
	ok := 0
	for _, t := range tests {
		if t {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(tests))
}
