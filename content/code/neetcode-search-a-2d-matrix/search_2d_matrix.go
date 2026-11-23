// LeetCode 74, Search a 2D Matrix: bốn cách và test.
// Chạy: go run search_2d_matrix.go
package main

import (
	"fmt"
	"slices"
	"sort"
)

func linearScan(matrix [][]int, target int) bool {
	for _, row := range matrix {
		if slices.Contains(row, target) {
			return true
		}
	}
	return false
}

func twoBinarySearch(matrix [][]int, target int) bool {
	// sort.Search trả chỉ số nhỏ nhất làm điều kiện đúng: hàng đầu tiên có phần tử đầu > target
	r := sort.Search(len(matrix), func(i int) bool { return matrix[i][0] > target }) - 1
	if r < 0 {
		return false
	}
	_, found := slices.BinarySearch(matrix[r], target) // Go 1.21+: trả (vị trí chèn, có tìm thấy không)
	return found
}

func flatBinarySearch(matrix [][]int, target int) bool {
	m, n := len(matrix), len(matrix[0])
	lo, hi := 0, m*n
	for lo < hi {
		mid := int(uint(lo+hi) >> 1) // cách của sort.Search: không tràn dù lo+hi vượt MaxInt
		x := matrix[mid/n][mid%n] // int chia int là chia lấy nguyên
		if x == target {
			return true
		}
		if x < target {
			lo = mid + 1
		} else {
			hi = mid
		}
	}
	return false
}

func staircase(matrix [][]int, target int) bool {
	r, c := 0, len(matrix[0])-1
	for r < len(matrix) && c >= 0 {
		switch x := matrix[r][c]; {
		case x == target:
			return true
		case x > target:
			c--
		default:
			r++
		}
	}
	return false
}

func main() {
	ex := [][]int{{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}}
	cases := []struct {
		m    [][]int
		t    int
		want bool
	}{{ex, 3, true}, {ex, 13, false}, {ex, 60, true}, {ex, 23, true}, {ex, 0, false}, {ex, 61, false},
		{[][]int{{1}}, 1, true}, {[][]int{{1}}, 2, false}, {[][]int{{1}, {3}}, 3, true}, {[][]int{{1, 2}, {3, 4}}, 4, true}}
	for _, f := range []struct {
		name string
		fn   func([][]int, int) bool
	}{{"linearScan", linearScan}, {"twoBinarySearch", twoBinarySearch}, {"flatBinarySearch", flatBinarySearch}, {"staircase", staircase}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.m, c.t) == c.want {
				ok++
			}
		}
		fmt.Printf("%-17s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
	fmt.Printf("\n-7 / 4 = %d, -7 %% 4 = %d (Go làm tròn về 0)\n", -7/4, -7%4)
}
