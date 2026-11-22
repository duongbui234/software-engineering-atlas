// NC-03 Two Sum (LeetCode 1), Go.
// Chạy: go run two_sum.go
package main

import "fmt"

func twoSum(nums []int, target int) []int {
	seen := make(map[int]int, len(nums)) // giá trị → chỉ số
	for i, x := range nums {
		if j, ok := seen[target-x]; ok { // "comma ok": phân biệt "không có" với "có, giá trị 0"
			return []int{j, i}
		}
		seen[x] = i
	}
	return nil
}

func main() {
	fmt.Println(twoSum([]int{2, 7, 11, 15}, 9), twoSum([]int{3, 2, 4}, 6), twoSum([]int{3, 3}, 6))

	// Bẫy: seen[k] với k không có trả về 0, trùng với chỉ số 0 hợp lệ.
	seen := map[int]int{5: 0}
	fmt.Println("seen[5] =", seen[5], "| seen[99] =", seen[99], "← cả hai đều 0")
	_, ok := seen[99]
	fmt.Println("dùng comma ok: 99 có trong map?", ok)
}
