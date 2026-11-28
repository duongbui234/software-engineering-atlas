// Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
// Chạy: go run greedy.go
package main

import "fmt"

// Maximum Subarray (Kadane): tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại.
func maxSubArray(nums []int) int {
	run := nums[0]  // tổng của đoạn tốt nhất kết thúc tại i
	best := nums[0] // tốt nhất từ trước tới giờ
	for _, x := range nums[1:] {
		if run < 0 {
			run = x // tiền tố âm chỉ kéo tổng xuống: bỏ nó
		} else {
			run += x
		}
		best = max(best, run)
	}
	return best
}

// Jump Game: giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt.
func canJump(nums []int) bool {
	reach := 0
	for i, x := range nums {
		if i > reach {
			return false // không ô nào trước đó nhảy tới được i
		}
		reach = max(reach, i+x)
	}
	return true
}

// Jump Game II: quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước.
func jump(nums []int) int {
	jumps, end, far := 0, 0, 0 // end: ô cuối của lớp đang quét; far: chỗ xa nhất của lớp kế
	for i := 0; i < len(nums)-1; i++ {
		far = max(far, i+nums[i])
		if i == end { // đã quét hết lớp này
			jumps++
			end = far
		}
	}
	return jumps
}

// Gas Station: bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được.
func canCompleteCircuit(gas, cost []int) int {
	total, tank, start := 0, 0, 0
	for i := range gas {
		diff := gas[i] - cost[i]
		total += diff
		tank += diff
		if tank < 0 { // xuất phát lại từ trạm kế tiếp
			start = i + 1
			tank = 0
		}
	}
	if total < 0 {
		return -1
	}
	return start
}

type testCase struct {
	name string
	run  func() any
	want any
}

func main() {
	cases := []testCase{
		{"maxSubArray đoạn giữa", func() any { return maxSubArray([]int{2, -5, 4, -1, 3, -7, 2}) }, 6},
		{"maxSubArray toàn âm", func() any { return maxSubArray([]int{-3, -1, -2}) }, -1},
		{"maxSubArray một phần tử", func() any { return maxSubArray([]int{5}) }, 5},
		{"maxSubArray toàn dương", func() any { return maxSubArray([]int{1, 2, 3}) }, 6},
		{"maxSubArray vượt qua số âm", func() any { return maxSubArray([]int{-1, 4, -2, 4, -10, 3}) }, 6},
		{"canJump kẹt ở số 0", func() any { return canJump([]int{2, 0, 1, 0, 3}) }, false},
		{"canJump tới đích", func() any { return canJump([]int{1, 2, 0, 1, 0}) }, true},
		{"canJump một ô", func() any { return canJump([]int{0}) }, true},
		{"canJump đứng yên", func() any { return canJump([]int{0, 1}) }, false},
		{"canJump kẹt giữa đường", func() any { return canJump([]int{3, 0, 0, 1, 0, 2}) }, false},
		{"jump ba bước", func() any { return jump([]int{1, 2, 0, 1, 0}) }, 3},
		{"jump hai bước", func() any { return jump([]int{3, 1, 1, 1, 1}) }, 2},
		{"jump một ô", func() any { return jump([]int{0}) }, 0},
		{"jump một bước", func() any { return jump([]int{4, 1, 1, 1, 1}) }, 1},
		{"jump từng ô", func() any { return jump([]int{1, 1, 1, 1}) }, 3},
		{"gas không đủ xăng", func() any { return canCompleteCircuit([]int{2, 3, 4}, []int{3, 4, 3}) }, -1},
		{"gas xuất phát ở trạm 3", func() any { return canCompleteCircuit([]int{3, 1, 2, 5}, []int{2, 4, 3, 1}) }, 3},
		{"gas một trạm", func() any { return canCompleteCircuit([]int{5}, []int{4}) }, 0},
		{"gas tổng bằng 0", func() any { return canCompleteCircuit([]int{1, 4, 1}, []int{2, 1, 3}) }, 1},
	}
	ok := 0
	for _, c := range cases {
		got := c.run()
		if got == c.want {
			ok++
		} else {
			fmt.Printf("SAI %s: được %v, cần %v\n", c.name, got, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
}
