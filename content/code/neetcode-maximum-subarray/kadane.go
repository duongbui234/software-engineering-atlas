// Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
// Chạy: go run kadane.go        (thêm tham số bench để đo thời gian)
package main

import (
	"fmt"
	"math"
	"os"
	"slices"
	"time"
)

// Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
func maxSubArray(nums []int) int {
	cur := nums[0] // tổng tốt nhất của đoạn kết thúc tại i
	best := nums[0]
	for _, x := range nums[1:] {
		if cur < 0 {
			cur = x // phần đầu âm chỉ kéo tổng xuống
		} else {
			cur += x
		}
		if cur > best {
			best = cur
		}
	}
	return best
}

// Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
func maxSubArrayBounds(nums []int) (best, lo, hi int) {
	cur := nums[0]
	best = nums[0]
	start := 0
	for i := 1; i < len(nums); i++ {
		if cur < 0 {
			cur = nums[i]
			start = i // đoạn mới bắt đầu tại i
		} else {
			cur += nums[i]
		}
		if cur > best {
			best, lo, hi = cur, start, i
		}
	}
	return best, lo, hi
}

// Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
func maxSubArrayPrefix(nums []int) int {
	prefix, minPrefix := 0, 0 // P[0] = 0: tiền tố rỗng
	best := math.MinInt
	for _, x := range nums {
		prefix += x
		best = max(best, prefix-minPrefix)
		minPrefix = min(minPrefix, prefix)
	}
	return best
}

// Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
func maxSubArrayDivide(nums []int) int {
	var solve func(lo, hi int) int
	solve = func(lo, hi int) int {
		if lo == hi {
			return nums[lo]
		}
		mid := (lo + hi) / 2
		sum, leftBest := 0, math.MinInt // tổng lớn nhất của đoạn kết thúc tại mid
		for i := mid; i >= lo; i-- {
			sum += nums[i]
			leftBest = max(leftBest, sum)
		}
		sum, rightBest := 0, math.MinInt // tổng lớn nhất của đoạn bắt đầu tại mid + 1
		for i := mid + 1; i <= hi; i++ {
			sum += nums[i]
			rightBest = max(rightBest, sum)
		}
		return max(solve(lo, mid), solve(mid+1, hi), leftBest+rightBest)
	}
	return solve(0, len(nums)-1)
}

// Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
func maxSubArrayQuadratic(nums []int, adds *int) int {
	best := math.MinInt
	for i := range nums {
		sum := 0
		for j := i; j < len(nums); j++ {
			sum += nums[j]
			*adds++
			if sum > best {
				best = sum
			}
		}
	}
	return best
}

// Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
func maxSubArrayCubic(nums []int) int {
	best := math.MinInt
	for i := range nums {
		for j := i; j < len(nums); j++ {
			sum := 0
			for k := i; k <= j; k++ {
				sum += nums[k]
			}
			best = max(best, sum)
		}
	}
	return best
}

// Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
func maxSubArrayZeroInit(nums []int) int {
	cur, best := 0, 0
	for _, x := range nums {
		cur = max(0, cur+x)
		best = max(best, cur)
	}
	return best
}

func check(nums []int, expected int) bool {
	best, lo, hi := maxSubArrayBounds(nums)
	if lo < 0 || lo > hi || hi >= len(nums) {
		return false
	}
	sum := 0
	for _, x := range nums[lo : hi+1] {
		sum += x
	}
	if best != expected || sum != best {
		return false
	}
	var adds int
	answers := []int{maxSubArray(nums), maxSubArrayPrefix(nums), maxSubArrayDivide(nums), maxSubArrayQuadratic(nums, &adds), maxSubArrayCubic(nums)}
	for _, a := range answers {
		if a != expected {
			return false
		}
	}
	return true
}

// Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
var seed = 2026

func next() int {
	seed = seed * 48271 % 2147483647
	return seed
}

func main() {
	cases := []struct {
		nums     []int
		expected int
	}{
		{[]int{7}, 7},
		{[]int{-4}, -4},
		{[]int{-3, -1, -2}, -1},
		{[]int{0, 0, 0}, 0},
		{[]int{3, -2, 5, -1}, 6},
		{[]int{2, -8, 3, -2, 4, -10}, 5},
		{[]int{-1, 6, -7, 5, 3, -2}, 8},
		{[]int{10000, 10000, -1, 10000}, 29999},
		{[]int{-10000, -10000, -10000}, -10000},
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

	// Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
	good, rounds := 0, 3000
	for r := 0; r < rounds; r++ {
		n := 1 + next()%12
		nums := make([]int, n)
		for k := range nums {
			nums[k] = next()%21 - 10
		}
		if check(nums, maxSubArrayCubic(nums)) {
			good++
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu vét O(n³))\n", good, rounds)

	neg := []int{-3, -1, -2}
	fmt.Printf("Khởi tạo best = 0 với [-3,-1,-2]: ra %d, đúng là %d\n", maxSubArrayZeroInit(neg), maxSubArray(neg))

	// Phép đo: n = 10000, giá trị −10000..10000
	big := make([]int, 10000)
	for k := range big {
		big[k] = next()%20001 - 10000
	}
	adds := 0
	slow := maxSubArrayQuadratic(big, &adds)
	fast := maxSubArray(big)
	same := fmt.Sprint(fast)
	if slow != fast {
		same = "KHÁC NHAU"
	}
	fmt.Printf("n = %d: O(n²) cộng %d lần, Kadane %d lần, cùng ra %s\n", len(big), adds, len(big), same)

	if slices.Contains(os.Args[1:], "bench") {
		// chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
		timed := func(f func() int, reps int) string {
			t := time.Now()
			for r := 0; r < reps; r++ {
				f()
			}
			return fmt.Sprintf("%.3f", float64(time.Since(t).Nanoseconds())/1e6/float64(reps))
		}
		var dummy int
		fmt.Printf("thời gian mỗi lượt: O(n²) %s ms, chia để trị %s ms, Kadane %s ms\n",
			timed(func() int { return maxSubArrayQuadratic(big, &dummy) }, 3),
			timed(func() int { return maxSubArrayDivide(big) }, 100),
			timed(func() int { return maxSubArray(big) }, 1000))
	}
}
