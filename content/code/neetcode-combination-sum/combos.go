// Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
)

var calls int

// Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm.
func combinationSumPlain(candidates []int, target int) [][]int {
	out := [][]int{}
	path := []int{}
	var dfs func(start, remain int)
	dfs = func(start, remain int) {
		calls++
		if remain == 0 {
			out = append(out, append([]int(nil), path...)) // chép ra, path còn bị sửa tiếp
			return
		}
		if remain < 0 {
			return
		}
		for i := start; i < len(candidates); i++ {
			path = append(path, candidates[i])
			dfs(i, remain-candidates[i]) // vẫn là i: được dùng lại số này
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return out
}

// Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy.
func combinationSum(candidates []int, target int) [][]int {
	nums := append([]int(nil), candidates...)
	sort.Ints(nums)
	out := [][]int{}
	path := []int{}
	var dfs func(start, remain int)
	dfs = func(start, remain int) {
		calls++
		if remain == 0 {
			out = append(out, append([]int(nil), path...))
			return
		}
		for i := start; i < len(nums); i++ {
			if nums[i] > remain {
				break
			}
			path = append(path, nums[i])
			dfs(i, remain-nums[i]) // vẫn là i: được dùng lại số này
			path = path[:len(path)-1]
		}
	}
	dfs(0, target)
	return out
}

// DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách.
func countWays(candidates []int, target int) int {
	ways := make([]int, target+1)
	ways[0] = 1
	for _, c := range candidates {
		for t := c; t <= target; t++ {
			ways[t] += ways[t-c]
		}
	}
	return ways[target]
}

// Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng.
func brute(candidates []int, target int) [][]int {
	out := [][]int{}
	counts := make([]int, len(candidates))
	var gen func(i int)
	gen = func(i int) {
		if i == len(candidates) {
			sum := 0
			for j, k := range counts {
				sum += k * candidates[j]
			}
			if sum == target {
				combo := []int{}
				for j, k := range counts {
					for r := 0; r < k; r++ {
						combo = append(combo, candidates[j])
					}
				}
				out = append(out, combo)
			}
			return
		}
		for k := 0; k <= target/candidates[i]; k++ {
			counts[i] = k
			gen(i + 1)
		}
		counts[i] = 0
	}
	gen(0)
	return out
}

func norm(combos [][]int) string {
	keys := []string{}
	for _, c := range combos {
		s := append([]int(nil), c...)
		sort.Ints(s)
		parts := make([]string, len(s))
		for i, v := range s {
			parts[i] = strconv.Itoa(v)
		}
		keys = append(keys, strings.Join(parts, ","))
	}
	sort.Strings(keys)
	return strings.Join(keys, "|")
}

func main() {
	type tc struct {
		cand   []int
		target int
		want   [][]int
	}
	cases := []tc{
		{[]int{4, 5, 9}, 9, [][]int{{4, 5}, {9}}},
		{[]int{3, 4, 7}, 10, [][]int{{3, 3, 4}, {3, 7}}},
		{[]int{6}, 4, [][]int{}},
		{[]int{8, 2, 5}, 10, [][]int{{2, 2, 2, 2, 2}, {2, 8}, {5, 5}}},
		{[]int{2, 3}, 1, [][]int{}},
		{[]int{40}, 40, [][]int{{40}}},
		{[]int{39, 2}, 3, [][]int{}},
	}
	ok := 0
	for _, c := range cases {
		plain := combinationSumPlain(c.cand, c.target)
		got := combinationSum(c.cand, c.target)
		if norm(plain) == norm(c.want) && norm(got) == norm(c.want) && len(got) == countWays(c.cand, c.target) {
			ok++
		} else {
			fmt.Println("sai ở", c.cand, c.target, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	pool := []int{2, 3, 4, 5, 6, 7}
	good, total := 0, 0
	for mask := 1; mask < 1<<len(pool); mask++ {
		cand := []int{}
		for i, v := range pool {
			if mask>>i&1 == 1 {
				cand = append(cand, v)
			}
		}
		for target := 1; target < 15; target++ {
			total++
			want := norm(brute(cand, target))
			a := combinationSum(cand, target)
			if norm(a) == want && norm(combinationSumPlain(cand, target)) == want && len(a) == countWays(cand, target) {
				good++
			} else {
				fmt.Println("sai ở", cand, target)
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu vét số lần dùng)\n", good, total)

	primes := []int{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}
	calls = 0
	combinationSumPlain(primes, 40)
	plainCalls := calls
	calls = 0
	found := len(combinationSum(primes, 40))
	fmt.Printf("12 số nguyên tố tới 37, target 40: không cắt nhánh %d lượt gọi, sắp xếp + cắt nhánh %d lượt gọi, %d tổ hợp\n", plainCalls, calls, found)
}
