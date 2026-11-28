package main

import (
	"fmt"
	"slices"
	"strings"
)

// Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
func subsetsTakeSkip(nums []int) [][]int {
	result := [][]int{}
	path := []int{}
	var walk func(i int)
	walk = func(i int) {
		if i == len(nums) {
			result = append(result, slices.Clone(path)) // sao chép, vì mảng nền của path còn bị ghi đè
			return
		}
		path = append(path, nums[i]) // lấy nums[i]
		walk(i + 1)
		path = path[:len(path)-1]
		walk(i + 1) // bỏ nums[i]
	}
	walk(0)
	return result
}

// Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
func subsetsStart(nums []int) [][]int {
	result := [][]int{}
	path := []int{}
	var walk func(start int)
	walk = func(start int) {
		result = append(result, slices.Clone(path))
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i])
			walk(i + 1) // chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
func subsetsBitmask(nums []int) [][]int {
	result := [][]int{}
	for mask := 0; mask < 1<<len(nums); mask++ {
		subset := []int{}
		for i := range nums {
			if mask&(1<<i) != 0 {
				subset = append(subset, nums[i])
			}
		}
		result = append(result, subset)
	}
	return result
}

// Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
func subsetsDoubling(nums []int) [][]int {
	result := [][]int{{}}
	for _, x := range nums {
		size := len(result)
		for k := 0; k < size; k++ {
			next := append(slices.Clone(result[k]), x) // không append thẳng vào result[k]
			result = append(result, next)
		}
	}
	return result
}

// Bản lỗi: lưu chính slice path, các phần tử của result dùng chung một mảng nền
func subsetsNoCopy(nums []int) [][]int {
	result := [][]int{}
	path := make([]int, 0, len(nums))
	var walk func(start int)
	walk = func(start int) {
		result = append(result, path)
		for i := start; i < len(nums); i++ {
			path = append(path, nums[i])
			walk(i + 1)
			path = path[:len(path)-1]
		}
	}
	walk(0)
	return result
}

// Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
func canonical(sets [][]int) []string {
	keys := make([]string, 0, len(sets))
	for _, s := range sets {
		c := slices.Clone(s)
		slices.Sort(c)
		keys = append(keys, fmt.Sprint(c))
	}
	slices.Sort(keys)
	return keys
}

func sameSets(a, b [][]int) bool {
	return strings.Join(canonical(a), "|") == strings.Join(canonical(b), "|")
}

var approaches = []func([]int) [][]int{subsetsTakeSkip, subsetsStart, subsetsBitmask, subsetsDoubling}

// Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
func check(nums []int, expected [][]int) bool {
	for _, solve := range approaches {
		got := solve(slices.Clone(nums))
		if len(got) != 1<<len(nums) {
			return false
		}
		keys := canonical(got)
		if len(slices.Compact(slices.Clone(keys))) != len(keys) {
			return false
		}
		if expected != nil && !sameSets(got, expected) {
			return false
		}
		if !sameSets(got, subsetsBitmask(nums)) {
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
		{[]int{5}, [][]int{{}, {5}}},
		{[]int{4, -2}, [][]int{{}, {4}, {-2}, {4, -2}}},
		{[]int{7, 1, 9}, [][]int{{}, {7}, {1}, {9}, {7, 1}, {7, 9}, {1, 9}, {7, 1, 9}}},
		{[]int{-10, 10}, [][]int{{}, {-10}, {10}, {-10, 10}}},
		{[]int{3, -1, 0, 8}, nil},
		{[]int{-5, -4, -3, -2, -1, 0, 1, 2, 3, 4}, nil},
		{[]int{6, -6, 2}, [][]int{{}, {6}, {-6}, {2}, {6, -6}, {6, 2}, {-6, 2}, {6, -6, 2}}},
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

	// Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
	pool := []int{-2, -1, 0, 1, 2}
	total, good := 0, 0
	var build func(arr []int)
	build = func(arr []int) {
		total++
		if check(arr, nil) {
			good++
		}
		if len(arr) == 4 {
			return
		}
		for _, v := range pool {
			if !slices.Contains(arr, v) {
				build(append(slices.Clone(arr), v))
			}
		}
	}
	build([]int{})
	fmt.Printf("%d/%d ca đúng (đối chiếu chéo bốn cách)\n", good, total)

	demo := []int{1, 2, 3}
	broken := map[string]bool{}
	for _, key := range canonical(subsetsNoCopy(demo)) {
		broken[key] = true
	}
	matched := 0
	for _, key := range canonical(subsetsBitmask(demo)) {
		if broken[key] {
			matched++
		}
	}
	fmt.Printf("Quên sao chép path với [1,2,3]: %d/8 tập con đúng\n", matched)
}
