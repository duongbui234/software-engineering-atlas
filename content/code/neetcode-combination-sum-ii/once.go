// Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

var calls int

func key(s []int) string {
	parts := make([]string, len(s))
	for i, v := range s {
		parts[i] = strconv.Itoa(v)
	}
	return strings.Join(parts, ",")
}

// Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại.
func combinationSum2(candidates []int, target int) [][]int {
	nums := append([]int(nil), candidates...)
	sort.Ints(nums)
	out := [][]int{}
	path := []int{}
	var dfs func(start, remain int)
	dfs = func(start, remain int) {
		calls++
		if remain == 0 {
			out = append(out, append([]int(nil), path...)) // chép ra, path còn bị sửa tiếp
			return
		}
		for i := start; i < len(nums); i++ {
			if i > start && nums[i] == nums[i-1] {
				continue // cùng tầng đã thử giá trị này rồi
			}
			if nums[i] > remain {
				break
			}
			path = append(path, nums[i])
			dfs(i+1, remain-nums[i]) // i + 1: vị trí này đã dùng
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return out
}

// Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa.
func combinationSum2Set(candidates []int, target int) [][]int {
	nums := append([]int(nil), candidates...)
	sort.Ints(nums)
	seen := map[string]bool{}
	out := [][]int{}
	path := []int{}
	var dfs func(start, remain int)
	dfs = func(start, remain int) {
		calls++
		if remain == 0 {
			k := key(path)
			if !seen[k] {
				seen[k] = true
				out = append(out, append([]int(nil), path...))
			}
			return
		}
		for i := start; i < len(nums); i++ {
			if nums[i] > remain {
				break
			}
			path = append(path, nums[i])
			dfs(i+1, remain-nums[i])
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return out
}

// Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng.
func brute(candidates []int, target int) [][]int {
	seen := map[string][]int{}
	n := len(candidates)
	for mask := 0; mask < 1<<n; mask++ {
		pick := []int{}
		sum := 0
		for i := 0; i < n; i++ {
			if mask>>i&1 == 1 {
				pick = append(pick, candidates[i])
				sum += candidates[i]
			}
		}
		if sum == target {
			sort.Ints(pick)
			seen[key(pick)] = pick
		}
	}
	out := [][]int{}
	for _, v := range seen {
		out = append(out, v)
	}
	return out
}

func norm(combos [][]int) string {
	keys := []string{}
	for _, c := range combos {
		s := append([]int(nil), c...)
		sort.Ints(s)
		keys = append(keys, key(s))
	}
	sort.Strings(keys)
	return strings.Join(keys, "|")
}

func ones(k int) []int {
	s := make([]int, k)
	for i := range s {
		s[i] = 1
	}
	return s
}

func main() {
	type tc struct {
		cand   []int
		target int
		want   [][]int
	}
	cases := []tc{
		{[]int{3, 1, 3, 5, 1, 1}, 8, [][]int{{1, 1, 1, 5}, {1, 1, 3, 3}, {3, 5}}},
		{[]int{2, 2, 2}, 4, [][]int{{2, 2}}},
		{[]int{5}, 3, [][]int{}},
		{[]int{4, 1, 4, 1}, 5, [][]int{{1, 4}}},
		{ones(20), 10, [][]int{ones(10)}},
		{[]int{6, 2, 4, 2}, 6, [][]int{{2, 4}, {6}}},
		{[]int{50, 30}, 30, [][]int{{30}}},
	}
	ok := 0
	for _, c := range cases {
		a := combinationSum2(c.cand, c.target)
		if norm(a) == norm(c.want) && norm(combinationSum2Set(c.cand, c.target)) == norm(c.want) {
			ok++
		} else {
			fmt.Println("sai ở", c.cand, c.target, a)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	good, total := 0, 0
	for n := 1; n <= 6; n++ {
		digits := make([]int, n)
		steps := 1
		for i := 0; i < n; i++ {
			steps *= 3
		}
		for step := 0; step < steps; step++ {
			cand := make([]int, n)
			for i, d := range digits {
				cand[i] = d + 1
			}
			for target := 1; target <= 8; target++ {
				total++
				want := norm(brute(cand, target))
				if norm(combinationSum2(cand, target)) == want && norm(combinationSum2Set(cand, target)) == want {
					good++
				} else {
					fmt.Println("sai ở", cand, target)
				}
			}
			for j := n - 1; j >= 0; j-- {
				digits[j]++
				if digits[j] < 3 {
					break
				}
				digits[j] = 0
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu vét tập con)\n", good, total)

	calls = 0
	combinationSum2Set(ones(20), 10)
	setCalls := calls
	calls = 0
	combinationSum2(ones(20), 10)
	fmt.Printf("20 số 1, target 10: khử trùng bằng tập %d lượt gọi, bỏ trùng cùng tầng %d lượt gọi\n", setCalls, calls)
}
