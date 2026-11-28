package main

import (
	"fmt"
	"slices"
	"strings"
)

// Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
func subsetsWithDup(nums []int, calls *int) [][]int {
	sorted := slices.Clone(nums)
	slices.Sort(sorted)
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		*calls++
		result = append(result, slices.Clone(path))
		for i := start; i < len(sorted); i++ {
			// i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
			if i > start && sorted[i] == sorted[i-1] {
				continue
			}
			path = append(path, sorted[i])
			walk(i + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
func subsetsSkipAlways(nums []int) [][]int {
	sorted := slices.Clone(nums)
	slices.Sort(sorted)
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		result = append(result, slices.Clone(path))
		for i := start; i < len(sorted); i++ {
			if i > 0 && sorted[i] == sorted[i-1] {
				continue
			}
			path = append(path, sorted[i])
			walk(i + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, cất khóa chuỗi vào map để bỏ trùng
func subsetsWithSet(nums []int, generated *int) [][]int {
	sorted := slices.Clone(nums)
	slices.Sort(sorted)
	seen := map[string][]int{}
	for mask := 0; mask < 1<<len(sorted); mask++ {
		subset := []int{}
		for i := range sorted {
			if mask&(1<<i) != 0 {
				subset = append(subset, sorted[i])
			}
		}
		*generated++
		seen[fmt.Sprint(subset)] = subset
	}
	result := [][]int{}
	for _, s := range seen {
		result = append(result, s)
	}
	return result
}

// Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
func subsetsByCount(nums []int) [][]int {
	counts := map[int]int{}
	order := []int{}
	for _, x := range nums {
		if counts[x] == 0 {
			order = append(order, x)
		}
		counts[x]++
	}
	result := [][]int{{}}
	for _, value := range order {
		next := [][]int{}
		for _, subset := range result {
			for k := 0; k <= counts[value]; k++ {
				grown := slices.Clone(subset)
				for j := 0; j < k; j++ {
					grown = append(grown, value)
				}
				next = append(next, grown)
			}
		}
		result = next
	}
	return result
}

func canonical(sets [][]int) []string {
	keys := []string{}
	for _, s := range sets {
		c := slices.Clone(s)
		slices.Sort(c)
		keys = append(keys, fmt.Sprint(c))
	}
	slices.Sort(keys)
	return keys
}

func check(nums []int, expected [][]int) bool {
	reference := strings.Join(canonical(subsetsByCount(nums)), "|")
	calls, generated := 0, 0
	for _, got := range [][][]int{subsetsWithDup(nums, &calls), subsetsWithSet(nums, &generated)} {
		keys := canonical(got)
		if len(slices.Compact(slices.Clone(keys))) != len(keys) { // không được có tập lặp
			return false
		}
		if strings.Join(keys, "|") != reference {
			return false
		}
		if expected != nil && strings.Join(keys, "|") != strings.Join(canonical(expected), "|") {
			return false
		}
	}
	return true
}

type testCase struct {
	nums     []int
	expected [][]int
}

func main() {
	cases := []testCase{
		{[]int{3, 3}, [][]int{{}, {3}, {3, 3}}},
		{[]int{5, 5, 1}, [][]int{{}, {1}, {1, 5}, {1, 5, 5}, {5}, {5, 5}}},
		{[]int{4, 4, 4, 4}, [][]int{{}, {4}, {4, 4}, {4, 4, 4}, {4, 4, 4, 4}}},
		{[]int{0, -1, 0}, [][]int{{}, {-1}, {-1, 0}, {-1, 0, 0}, {0}, {0, 0}}},
		{[]int{7}, [][]int{{}, {7}}},
		{[]int{1, 1, 2, 2, 3}, nil},
		{[]int{2, 2, 2, 2, 2, 2, 2, 2, 2, 2}, nil},
		{[]int{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4}, nil},
	}
	ok := 0
	for _, c := range cases {
		if check(c.nums, c.expected) {
			ok++
		} else {
			fmt.Println("sai ở", c.nums)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
	total, good := 0, 0
	var build func(arr []int)
	build = func(arr []int) {
		total++
		if check(arr, nil) {
			good++
		}
		if len(arr) == 5 {
			return
		}
		for _, v := range []int{1, 2, 3} {
			build(append(slices.Clone(arr), v))
		}
	}
	build([]int{})
	fmt.Printf("%d/%d ca đúng (đối chiếu đếm theo nhóm)\n", good, total)

	calls := 0
	wrong := len(subsetsSkipAlways([]int{5, 5, 1}))
	right := len(subsetsWithDup([]int{5, 5, 1}, &calls))
	fmt.Printf("Bỏ trùng mọi lúc với [5,5,1]: %d tập, đúng là %d\n", wrong, right)

	heavy := []int{4, 4, 4, 4, 4, 9, 9, 9, 9, 9}
	generated := 0
	kept := len(subsetsWithSet(heavy, &generated))
	calls = 0
	subsetsWithDup(heavy, &calls)
	fmt.Printf("[4×5, 9×5]: Set sinh %d tập để giữ %d, cắt cùng tầng sinh %d\n", generated, kept, calls)
}
