// Ga ARR-01, tra cứu bằng hash: ba bài, cùng một khuôn "hỏi bảng, rồi ghi vào bảng".
// Chạy: go run hash_lookup.go
package main

import (
	"fmt"
	"reflect"
)

// 217: Go không có kiểu set; map[int]struct{} là set (struct{} chiếm 0 byte).
func containsDuplicate(nums []int) bool {
	seen := make(map[int]struct{}, len(nums))
	for _, x := range nums {
		if _, ok := seen[x]; ok { // hỏi trước
			return true
		}
		seen[x] = struct{}{} // ghi sau
	}
	return false
}

// 1: map giá trị → chỉ số; "comma ok" phân biệt "không có" với "có, chỉ số 0".
func twoSum(nums []int, target int) []int {
	seen := make(map[int]int, len(nums))
	for i, x := range nums {
		if j, ok := seen[target-x]; ok {
			return []int{j, i}
		}
		seen[x] = i
	}
	return nil
}

// 128: ghi hết vào set trước, rồi chỉ đếm từ đầu dãy (x - 1 không có trong set).
func longestConsecutive(nums []int) int {
	all := make(map[int]struct{}, len(nums))
	for _, x := range nums {
		all[x] = struct{}{}
	}
	best := 0
	for x := range all { // duyệt set, không duyệt nums
		if _, ok := all[x-1]; ok {
			continue
		}
		length := 1
		for {
			if _, ok := all[x+length]; !ok {
				break
			}
			length++
		}
		best = max(best, length)
	}
	return best
}

func main() {
	cases := []struct {
		name      string
		got, want any
	}{
		{"containsDuplicate [1,2,3,1]", containsDuplicate([]int{1, 2, 3, 1}), true},
		{"containsDuplicate [1,2,3,4]", containsDuplicate([]int{1, 2, 3, 4}), false},
		{"containsDuplicate []", containsDuplicate([]int{}), false},
		{"twoSum [2,7,11,15] 9", twoSum([]int{2, 7, 11, 15}, 9), []int{0, 1}},
		{"twoSum [3,2,4] 6", twoSum([]int{3, 2, 4}, 6), []int{1, 2}},
		{"twoSum [3,3] 6", twoSum([]int{3, 3}, 6), []int{0, 1}},
		{"longestConsecutive [100,4,200,1,3,2]", longestConsecutive([]int{100, 4, 200, 1, 3, 2}), 4},
		{"longestConsecutive [0,3,7,2,5,8,4,6,0,1]", longestConsecutive([]int{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}), 9},
		{"longestConsecutive []", longestConsecutive([]int{}), 0},
	}
	ok := 0
	for _, c := range cases {
		if reflect.DeepEqual(c.got, c.want) {
			ok++
		} else {
			fmt.Println("SAI", c.name, c.got, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
}
