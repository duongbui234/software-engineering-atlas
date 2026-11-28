// Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
// Chạy: go run reach.go
package main

import (
	"fmt"
	"time"
)

// Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
func canJumpBacktrack(nums []int, calls *int) bool {
	last := len(nums) - 1
	var dfs func(i int) bool
	dfs = func(i int) bool {
		*calls++
		if i == last {
			return true
		}
		for step := min(nums[i], last-i); step >= 1; step-- {
			if dfs(i + step) {
				return true
			}
		}
		return false
	}
	return dfs(0)
}

// Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
func canJumpMemo(nums []int, calls *int) bool {
	last := len(nums) - 1
	memo := make([]int8, len(nums))
	var dfs func(i int) bool
	dfs = func(i int) bool {
		*calls++
		if i == last {
			return true
		}
		if memo[i] != 0 {
			return memo[i] == 1
		}
		for step := min(nums[i], last-i); step >= 1; step-- {
			if dfs(i + step) {
				memo[i] = 1
				return true
			}
		}
		memo[i] = 2
		return false
	}
	return dfs(0)
}

// Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
func canJumpTable(nums []int, steps *int) bool {
	n := len(nums)
	good := make([]bool, n)
	good[n-1] = true
	for i := n - 2; i >= 0; i-- {
		end := min(i+nums[i], n-1)
		for j := i + 1; j <= end; j++ {
			*steps++
			if good[j] {
				good[i] = true
				break
			}
		}
	}
	return good[0]
}

// Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
func canJump(nums []int, steps *int) bool {
	farthest := 0
	for i := range nums {
		*steps++
		if i > farthest {
			return false // ô i nằm ngoài khúc tới được: kẹt
		}
		farthest = max(farthest, i+nums[i])
		if farthest >= len(nums)-1 {
			return true
		}
	}
	return true
}

// Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
func canJumpGoal(nums []int) bool {
	goal := len(nums) - 1
	for i := len(nums) - 2; i >= 0; i-- {
		if i+nums[i] >= goal {
			goal = i // từ i nhảy tới goal, nên i thành đích mới
		}
	}
	return goal == 0
}

// Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
func canJumpNoGuard(nums []int) bool {
	farthest := 0
	for i := range nums {
		farthest = max(farthest, i+nums[i])
	}
	return farthest >= len(nums)-1
}

// Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
func canJumpLongestHop(nums []int) bool {
	i := 0
	for i < len(nums)-1 {
		if nums[i] == 0 {
			return false
		}
		i += nums[i]
	}
	return true
}

// Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
func referee(nums []int) bool {
	reach := make([]bool, len(nums))
	reach[0] = true
	changed := true
	for changed {
		changed = false
		for i := range nums {
			if !reach[i] {
				continue
			}
			for j := i + 1; j <= i+nums[i] && j < len(nums); j++ {
				if !reach[j] {
					reach[j] = true
					changed = true
				}
			}
		}
	}
	return reach[len(nums)-1]
}

func allCorrect(nums []int, want bool) bool {
	var c int
	return canJumpBacktrack(nums, &c) == want && canJumpMemo(nums, &c) == want &&
		canJumpTable(nums, &c) == want && canJump(nums, &c) == want && canJumpGoal(nums) == want
}

// Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
func worstCase(n int) []int {
	a := make([]int, 0, n)
	for i := 0; i < n-1; i++ {
		a = append(a, n-2-i)
	}
	return append(a, 0)
}

type testCase struct {
	nums []int
	want bool
}

var total, good int

func build(arr []int) {
	if len(arr) > 0 {
		total++
		if allCorrect(arr, referee(arr)) {
			good++
		}
	}
	if len(arr) == 6 {
		return
	}
	for v := 0; v <= 3; v++ {
		next := append(append([]int{}, arr...), v)
		build(next)
	}
}

func main() {
	cases := []testCase{
		{[]int{0}, true},
		{[]int{1, 0}, true},
		{[]int{0, 1}, false},
		{[]int{2, 0, 0}, true},
		{[]int{1, 0, 1}, false},
		{[]int{2, 3, 0, 0, 1}, true},
		{[]int{5, 0, 0, 0, 0, 0}, true},
		{[]int{1, 2, 0, 1, 0, 3}, false},
		{[]int{2, 0, 2, 0, 1, 0}, true},
		{[]int{4, 0, 0, 0, 0, 1}, false},
		{worstCase(10), false},
	}
	ok := 0
	for _, c := range cases {
		if allCorrect(c.nums, c.want) && referee(c.nums) == c.want {
			ok++
		} else {
			fmt.Println("sai ở", c.nums)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
	build([]int{})
	fmt.Printf("%d/%d ca đúng (đối chiếu trọng tài lan tập)\n", good, total)

	score := func(f func([]int) bool) int {
		s := 0
		for _, c := range cases {
			if f(c.nums) == c.want {
				s++
			}
		}
		return s
	}
	fmt.Printf("Bản quên kiểm tra i > farthest: %d/%d ca đúng\n", score(canJumpNoGuard), len(cases))
	fmt.Printf("Bản nhảy bước dài nhất: %d/%d ca đúng\n", score(canJumpLongestHop), len(cases))

	small := worstCase(20)
	bt, mm := 0, 0
	canJumpBacktrack(small, &bt)
	canJumpMemo(small, &mm)
	fmt.Printf("n = 20, mảng tệ nhất: quay lui %d lượt gọi, ghi nhớ %d lượt gọi\n", bt, mm)

	big := worstCase(10000)
	tableSteps, greedySteps := 0, 0
	canJumpTable(big, &tableSteps)
	canJump(big, &greedySteps)
	fmt.Printf("n = 10000, mảng tệ nhất: bảng DP %d bước, tham lam %d bước\n", tableSteps, greedySteps)

	var sink int
	t := time.Now()
	canJumpTable(big, &sink)
	tableMs := float64(time.Since(t).Nanoseconds()) / 1e6
	t = time.Now()
	for k := 0; k < 100; k++ {
		canJump(big, &sink)
	}
	greedyMs := float64(time.Since(t).Nanoseconds()) / 1e6 / 100
	fmt.Printf("Thời gian n = 10000: bảng DP %.1f ms, tham lam %.3f ms\n", tableMs, greedyMs)
}
