// Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
// Chạy: go run layers.go
package main

import (
	"fmt"
	"math"
	"strings"
)

// DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
func jumpDP(nums []int, ops *int) int {
	n := len(nums)
	best := make([]int, n)
	for j := range best {
		best[j] = math.MaxInt32
	}
	best[0] = 0
	for i := 0; i < n; i++ {
		for k := 1; k <= nums[i] && i+k < n; k++ {
			*ops++
			best[i+k] = min(best[i+k], best[i]+1)
		}
	}
	return best[n-1]
}

// BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
func jumpBFS(nums []int, ops *int) int {
	n := len(nums)
	dist := make([]int, n)
	for j := range dist {
		dist[j] = -1
	}
	dist[0] = 0
	queue := []int{0}
	for head := 0; head < len(queue); head++ {
		i := queue[head]
		for k := 1; k <= nums[i] && i+k < n; k++ {
			*ops++
			if dist[i+k] == -1 {
				dist[i+k] = dist[i] + 1
				queue = append(queue, i+k)
			}
		}
	}
	return dist[n-1]
}

// Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
func jump(nums []int, ops *int) int {
	jumps, end, far := 0, 0, 0
	for i := 0; i < len(nums)-1; i++ { // dừng trước ô cuối
		*ops++
		far = max(far, i+nums[i])
		if i == end { // đi hết lớp hiện tại: phải nhảy thêm một bước
			jumps++
			end = far
		}
	}
	return jumps
}

// Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
func jumpToLast(nums []int) int {
	jumps, end, far := 0, 0, 0
	for i := 0; i < len(nums); i++ {
		far = max(far, i+nums[i])
		if i == end {
			jumps++
			end = far
		}
	}
	return jumps
}

// Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; -1 nếu kẹt ở ô 0
func jumpFarthestNow(nums []int) int {
	pos, jumps := 0, 0
	for pos < len(nums)-1 {
		if nums[pos] == 0 {
			return -1
		}
		pos = min(pos+nums[pos], len(nums)-1)
		jumps++
	}
	return jumps
}

// Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
func bruteForce(nums []int, i int) int {
	if i == len(nums)-1 {
		return 0
	}
	best := math.MaxInt32
	for k := 1; k <= nums[i] && i+k < len(nums); k++ {
		if sub := bruteForce(nums, i+k); sub != math.MaxInt32 {
			best = min(best, 1+sub)
		}
	}
	return best
}

func main() {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{0}, 0},
		{[]int{5}, 0},
		{[]int{1, 1, 1, 1}, 3},
		{[]int{4, 0, 0, 0, 0}, 1},
		{[]int{3, 1, 0, 2, 0, 1}, 2},
		{[]int{2, 0, 2, 0, 1}, 2},
		{[]int{1, 2, 1, 1, 1}, 3},
		{[]int{1, 3, 0, 0, 5, 0, 0, 1}, 3},
	}
	ok := 0
	var tmp int
	for _, c := range cases {
		got := []int{jumpDP(c.nums, &tmp), jumpBFS(c.nums, &tmp), jump(c.nums, &tmp), bruteForce(c.nums, 0)}
		good := true
		for _, g := range got {
			if g != c.want {
				good = false
			}
		}
		if good {
			ok++
		} else {
			fmt.Println("sai ở", c.nums, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
	total, good, wrong, wrongNow := 0, 0, 0, 0
	var build func(arr []int)
	build = func(arr []int) {
		if len(arr) > 0 {
			want := bruteForce(arr, 0)
			if want != math.MaxInt32 {
				total++
				if jumpDP(arr, &tmp) == want && jumpBFS(arr, &tmp) == want && jump(arr, &tmp) == want {
					good++
				}
				if jumpToLast(arr) != want {
					wrong++
				}
				if jumpFarthestNow(arr) != want {
					wrongNow++
				}
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
	build([]int{})
	fmt.Printf("%d/%d ca đúng (đối chiếu vét mọi đường nhảy)\n", good, total)
	fmt.Printf("Cho vòng lặp chạy tới ô cuối: sai %d/%d ca, [0] cho %d thay vì 0\n", wrong, total, jumpToLast([]int{0}))
	fmt.Printf("Luôn nhảy xa nhất từ chỗ đang đứng: sai %d/%d ca, [2,4,1,1,1,1] cho %d thay vì 2\n", wrongNow, total, jumpFarthestNow([]int{2, 4, 1, 1, 1, 1}))

	// Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
	big := make([]int, 10000)
	for j := range big {
		big[j] = 1000
	}
	dp, bfs, greedy := 0, 0, 0
	answers := []string{fmt.Sprint(jumpDP(big, &dp)), fmt.Sprint(jumpBFS(big, &bfs)), fmt.Sprint(jump(big, &greedy))}
	fmt.Printf("n = 10000, mọi ô 1000: %s bước; DP %d lượt cập nhật, BFS %d cạnh, lớp nhảy %d vòng\n", strings.Join(answers, "/"), dp, bfs, greedy)
}
