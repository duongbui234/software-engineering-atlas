// Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
// Chạy: go run arrange.go
package main

import (
	"fmt"
	"slices"
	"sort"
	"strings"
)

// Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
func permute(nums []int, calls *int) [][]int {
	result := [][]int{}
	path := []int{}
	used := make([]bool, len(nums))
	var walk func()
	walk = func() {
		*calls++
		if len(path) == len(nums) {
			result = append(result, slices.Clone(path)) // chép path, vì mảng nền còn bị ghi đè
			return
		}
		for i := range nums {
			if used[i] {
				continue // phần tử này đã nằm trong path
			}
			used[i] = true
			path = append(path, nums[i])
			walk()
			path = path[:len(path)-1]
			used[i] = false // gỡ dấu để nhánh anh em được dùng lại
		}
	}
	walk()
	return result
}

// Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
func permuteSwap(nums []int) [][]int {
	a := slices.Clone(nums)
	result := [][]int{}
	var walk func(k int)
	walk = func(k int) {
		if k == len(a) {
			result = append(result, slices.Clone(a))
			return
		}
		for i := k; i < len(a); i++ {
			a[k], a[i] = a[i], a[k]
			walk(k + 1)
			a[k], a[i] = a[i], a[k] // đổi lại để mảng về như cũ
		}
	}
	walk(0)
	return result
}

// Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
func permuteInsert(nums []int) [][]int {
	layer := [][]int{{}}
	for _, x := range nums {
		next := [][]int{}
		for _, p := range layer {
			for slot := 0; slot <= len(p); slot++ {
				q := make([]int, 0, len(p)+1)
				q = append(q, p[:slot]...)
				q = append(q, x)
				q = append(q, p[slot:]...)
				next = append(next, q)
			}
		}
		layer = next
	}
	return layer
}

// Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
func permuteWithStart(nums []int) [][]int {
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		if len(path) == len(nums) {
			result = append(result, slices.Clone(path))
			return
		}
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i])
			walk(i + 1) // không bao giờ quay lại phần tử đứng trước i
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
func bruteForce(nums []int) [][]int {
	n := len(nums)
	total := 1
	for k := 0; k < n; k++ {
		total *= n
	}
	result := [][]int{}
	for code := 0; code < total; code++ {
		c := code
		seen := map[int]bool{}
		perm := []int{}
		for k := 0; k < n; k++ {
			seen[c%n] = true
			perm = append(perm, nums[c%n])
			c /= n
		}
		if len(seen) == n {
			result = append(result, perm)
		}
	}
	return result
}

func key(p []int) string {
	parts := make([]string, len(p))
	for i, v := range p {
		parts[i] = fmt.Sprint(v)
	}
	return strings.Join(parts, ",")
}

func canonical(list [][]int) string {
	keys := make([]string, len(list))
	for i, p := range list {
		keys[i] = key(p)
	}
	sort.Strings(keys)
	return strings.Join(keys, "|")
}

func factorial(n int) int {
	if n <= 1 {
		return 1
	}
	return n * factorial(n-1)
}

func check(nums []int, expected [][]int) bool {
	if expected == nil {
		expected = bruteForce(nums)
	}
	want := canonical(expected)
	calls := 0
	for _, got := range [][][]int{permute(nums, &calls), permuteSwap(nums), permuteInsert(nums)} {
		if len(got) != factorial(len(nums)) {
			return false
		}
		distinct := map[string]bool{}
		for _, p := range got {
			distinct[key(p)] = true
		}
		if len(distinct) != len(got) || canonical(got) != want {
			return false
		}
	}
	return true
}

func main() {
	type tc struct {
		nums     []int
		expected [][]int
	}
	cases := []tc{
		{[]int{7}, [][]int{{7}}},
		{[]int{4, 9}, [][]int{{4, 9}, {9, 4}}},
		{[]int{3, 8, 1}, [][]int{{3, 8, 1}, {3, 1, 8}, {8, 3, 1}, {8, 1, 3}, {1, 3, 8}, {1, 8, 3}}},
		{[]int{0, -5, 10}, nil},
		{[]int{-10, 10, 0, 5}, nil},
		{[]int{2, 4, 6, 8, 10}, nil},
		{[]int{-3, -2, -1, 0, 1, 2}, nil},
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

	// Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
	total, good := 0, 0
	var build func(arr []int)
	build = func(arr []int) {
		if len(arr) > 0 {
			total++
			if check(arr, nil) {
				good++
			}
		}
		if len(arr) == 5 {
			return
		}
		for v := 1; v <= 5; v++ {
			if !slices.Contains(arr, v) {
				build(append(slices.Clone(arr), v))
			}
		}
	}
	build([]int{})
	fmt.Printf("%d/%d ca đúng (đối chiếu vét mọi bộ chỉ số)\n", good, total)

	fmt.Printf("Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: %d/6 hoán vị\n", len(permuteWithStart([]int{3, 8, 1})))

	calls := 0
	six := permute([]int{1, 2, 3, 4, 5, 6}, &calls)
	fmt.Printf("n = 6: %d hoán vị, %d lượt gọi\n", len(six), calls)
}
