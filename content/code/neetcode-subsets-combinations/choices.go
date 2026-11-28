// Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
// Chạy: go run choices.go
package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

// Subsets: ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i.
func subsets(nums []int) [][]int {
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		result = append(result, append([]int(nil), path...)) // chép path, vì path còn đổi tiếp
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i]) // chọn
			walk(i + 1)                  // đi sâu, mỗi phần tử dùng một lần
			path = path[:len(path)-1]    // gỡ lựa chọn
		}
	}
	walk(0)
	return result
}

// Subsets II: sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước.
func subsetsWithDup(nums []int) [][]int {
	sorted := append([]int(nil), nums...)
	sort.Ints(sorted)
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		result = append(result, append([]int(nil), path...))
		for i := start; i < len(sorted); i++ {
			if i > start && sorted[i] == sorted[i-1] {
				continue // trùng ở cùng tầng
			}
			path = append(path, sorted[i])
			walk(i + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Combination Sum: chỉ ghi khi còn lại đúng 0; nhánh con bắt đầu lại từ i (được dùng lại).
func combinationSum(candidates []int, target int) [][]int {
	sorted := append([]int(nil), candidates...)
	sort.Ints(sorted)
	result := [][]int{}
	path := []int{}
	var walk func(start, remaining int)
	walk = func(start, remaining int) {
		if remaining == 0 {
			result = append(result, append([]int(nil), path...))
			return
		}
		for i := start; i < len(sorted); i++ {
			if sorted[i] > remaining {
				break // đã sắp xếp: các số sau còn lớn hơn
			}
			path = append(path, sorted[i])
			walk(i, remaining-sorted[i])
			path = path[:len(path)-1]
		}
	}
	walk(0, target)
	return result
}

// Combination Sum II: mỗi số dùng một lần (i + 1) và bỏ trùng ở cùng tầng.
func combinationSum2(candidates []int, target int) [][]int {
	sorted := append([]int(nil), candidates...)
	sort.Ints(sorted)
	result := [][]int{}
	path := []int{}
	var walk func(start, remaining int)
	walk = func(start, remaining int) {
		if remaining == 0 {
			result = append(result, append([]int(nil), path...))
			return
		}
		for i := start; i < len(sorted); i++ {
			if i > start && sorted[i] == sorted[i-1] {
				continue
			}
			if sorted[i] > remaining {
				break
			}
			path = append(path, sorted[i])
			walk(i+1, remaining-sorted[i])
			path = path[:len(path)-1]
		}
	}
	walk(0, target)
	return result
}

var keys = map[byte]string{
	'2': "abc", '3': "def", '4': "ghi", '5': "jkl",
	'6': "mno", '7': "pqrs", '8': "tuv", '9': "wxyz",
}

// Letter Combinations: tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá.
func letterCombinations(digits string) []string {
	if len(digits) == 0 {
		return []string{}
	}
	result := []string{}
	path := []byte{}
	var walk func(depth int)
	walk = func(depth int) {
		if depth == len(digits) {
			result = append(result, string(path))
			return
		}
		for _, letter := range []byte(keys[digits[depth]]) {
			path = append(path, letter)
			walk(depth + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi sắp xếp cả danh sách.
func normalizeInts(lists [][]int) []string {
	out := []string{}
	for _, list := range lists {
		c := append([]int(nil), list...)
		sort.Ints(c)
		parts := []string{}
		for _, v := range c {
			parts = append(parts, strconv.Itoa(v))
		}
		out = append(out, strings.Join(parts, ","))
	}
	sort.Strings(out)
	return out
}

func normalizeStrings(list []string) []string {
	out := append([]string(nil), list...)
	sort.Strings(out)
	return out
}

func distinct(list []string) int {
	seen := map[string]bool{}
	for _, s := range list {
		seen[s] = true
	}
	return len(seen)
}

func equal(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

type testCase struct {
	name  string
	got   []string // đã chuẩn hóa
	want  []string // đã chuẩn hóa; nil nghĩa là chỉ kiểm số lượng
	count int
}

func main() {
	cases := []testCase{
		{"subsets [2,5,9]", normalizeInts(subsets([]int{2, 5, 9})), normalizeInts([][]int{{}, {2}, {2, 5}, {2, 5, 9}, {2, 9}, {5}, {5, 9}, {9}}), 0},
		{"subsets [7]", normalizeInts(subsets([]int{7})), normalizeInts([][]int{{}, {7}}), 0},
		{"subsets 10 số", normalizeInts(subsets([]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10})), nil, 1024},
		{"subsetsWithDup [3,1,3]", normalizeInts(subsetsWithDup([]int{3, 1, 3})), normalizeInts([][]int{{}, {1}, {1, 3}, {1, 3, 3}, {3}, {3, 3}}), 0},
		{"subsetsWithDup [6,6,6]", normalizeInts(subsetsWithDup([]int{6, 6, 6})), normalizeInts([][]int{{}, {6}, {6, 6}, {6, 6, 6}}), 0},
		{"subsetsWithDup [4,4,1,4,2]", normalizeInts(subsetsWithDup([]int{4, 4, 1, 4, 2})), nil, 16},
		{"combinationSum [3,4,5] 8", normalizeInts(combinationSum([]int{3, 4, 5}, 8)), normalizeInts([][]int{{3, 5}, {4, 4}}), 0},
		{"combinationSum [2,3,7] 9", normalizeInts(combinationSum([]int{2, 3, 7}, 9)), normalizeInts([][]int{{2, 2, 2, 3}, {2, 7}, {3, 3, 3}}), 0},
		{"combinationSum [4] 3", normalizeInts(combinationSum([]int{4}, 3)), []string{}, 0},
		{"combinationSum [2,3,5,7] 20", normalizeInts(combinationSum([]int{2, 3, 5, 7}, 20)), nil, 18},
		{"combinationSum2 [1,4,1,2,3,4] 6", normalizeInts(combinationSum2([]int{1, 4, 1, 2, 3, 4}, 6)), normalizeInts([][]int{{1, 1, 4}, {1, 2, 3}, {2, 4}}), 0},
		{"combinationSum2 [3,3,2,4,3] 6", normalizeInts(combinationSum2([]int{3, 3, 2, 4, 3}, 6)), normalizeInts([][]int{{2, 4}, {3, 3}}), 0},
		{"combinationSum2 [5] 3", normalizeInts(combinationSum2([]int{5}, 3)), []string{}, 0},
		{"letterCombinations 47", normalizeStrings(letterCombinations("47")), normalizeStrings([]string{"gp", "gq", "gr", "gs", "hp", "hq", "hr", "hs", "ip", "iq", "ir", "is"}), 0},
		{"letterCombinations 9", normalizeStrings(letterCombinations("9")), []string{"w", "x", "y", "z"}, 0},
		{"letterCombinations 7979", normalizeStrings(letterCombinations("7979")), nil, 256},
		{"letterCombinations rỗng", normalizeStrings(letterCombinations("")), []string{}, 0},
	}
	ok := 0
	fails := []string{}
	for _, c := range cases {
		var pass bool
		if c.want == nil {
			pass = len(c.got) == c.count && distinct(c.got) == c.count
		} else {
			pass = equal(c.got, c.want)
		}
		if pass {
			ok++
		} else {
			fails = append(fails, c.name)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
	if len(fails) > 0 {
		fmt.Println("sai ở: " + strings.Join(fails, "; "))
	}
}
