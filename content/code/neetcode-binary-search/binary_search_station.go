// Ga SRCH-01: một khuôn tìm kiếm nhị phân cho bốn bài 704, 74, 153, 33.
// Chạy: go run binary_search_station.go
package main

import "fmt"

func search(nums []int, target int) int { // 704
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		} else if nums[mid] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return -1
}

func searchMatrix(matrix [][]int, target int) bool { // 74: chỉ số k ứng với ô (k / n, k % n)
	n := len(matrix[0])
	lo, hi := 0, len(matrix)*n-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		v := matrix[mid/n][mid%n]
		if v == target {
			return true
		} else if v < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return false
}

func findMin(nums []int) int { // 153: so với nums[hi] để biết điểm gãy ở bên nào
	lo, hi := 0, len(nums)-1
	for lo < hi {
		mid := lo + (hi-lo)/2
		if nums[mid] > nums[hi] {
			lo = mid + 1
		} else {
			hi = mid // mid có thể là phần tử nhỏ nhất
		}
	}
	return nums[lo]
}

func searchRotated(nums []int, target int) int { // 33: một nửa quanh mid luôn tăng dần
	lo, hi := 0, len(nums)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2
		if nums[mid] == target {
			return mid
		}
		if nums[lo] <= nums[mid] { // nửa trái tăng dần
			if nums[lo] <= target && target < nums[mid] {
				hi = mid - 1
			} else {
				lo = mid + 1
			}
		} else { // nửa phải tăng dần
			if nums[mid] < target && target <= nums[hi] {
				lo = mid + 1
			} else {
				hi = mid - 1
			}
		}
	}
	return -1
}

func main() {
	m := [][]int{{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}}
	checks := [][2]any{
		{search([]int{-1, 0, 3, 5, 9, 12}, 9), 4}, {search([]int{-1, 0, 3, 5, 9, 12}, 2), -1}, {search([]int{5}, 5), 0},
		{searchMatrix(m, 3), true}, {searchMatrix(m, 13), false}, {searchMatrix([][]int{{1}}, 1), true},
		{findMin([]int{3, 4, 5, 1, 2}), 1}, {findMin([]int{4, 5, 6, 7, 0, 1, 2}), 0}, {findMin([]int{11, 13, 15, 17}), 11}, {findMin([]int{2, 1}), 1},
		{searchRotated([]int{4, 5, 6, 7, 0, 1, 2}, 0), 4}, {searchRotated([]int{4, 5, 6, 7, 0, 1, 2}, 3), -1},
		{searchRotated([]int{1}, 0), -1}, {searchRotated([]int{3, 1}, 1), 1},
	}
	ok := 0
	for _, c := range checks {
		if c[0] == c[1] {
			ok++
		}
	}
	fmt.Printf("binary_search_station %d/%d ca đúng\n", ok, len(checks))
}
