// Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.
package main

import "fmt"

// Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại
func burstBrute(nums []int, calls *int) int {
	var goRec func(arr []int) int
	goRec = func(arr []int) int {
		*calls++
		best := 0
		for i := range arr {
			left, right := 1, 1
			if i > 0 {
				left = arr[i-1]
			}
			if i+1 < len(arr) {
				right = arr[i+1]
			}
			rest := make([]int, 0, len(arr)-1)
			rest = append(rest, arr[:i]...)
			rest = append(rest, arr[i+1:]...)
			best = max(best, left*arr[i]*right+goRec(rest))
		}
		return best
	}
	return goRec(nums)
}

// Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
// Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1].
func burstFirstSplitWrong(nums []int) int {
	p := append(append([]int{1}, nums...), 1)
	memo := map[[2]int]int{}
	var solve func(l, r int) int
	solve = func(l, r int) int {
		if l > r {
			return 0
		}
		if v, ok := memo[[2]int{l, r}]; ok {
			return v
		}
		best := 0
		for k := l; k <= r; k++ {
			best = max(best, p[k-1]*p[k]*p[k+1]+solve(l, k-1)+solve(k+1, r))
		}
		memo[[2]int{l, r}] = best
		return best
	}
	return solve(1, len(nums))
}

// Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r (không gồm l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r].
func burstMemo(nums []int, calls *int) int {
	p := append(append([]int{1}, nums...), 1)
	n := len(p)
	memo := make([][]int, n)
	for i := range memo {
		memo[i] = make([]int, n)
		for j := range memo[i] {
			memo[i][j] = -1
		}
	}
	var solve func(l, r int) int
	solve = func(l, r int) int {
		*calls++
		if l+1 >= r {
			return 0
		}
		if memo[l][r] != -1 {
			return memo[l][r]
		}
		best := 0
		for k := l + 1; k < r; k++ {
			best = max(best, p[l]*p[k]*p[r]+solve(l, k)+solve(k, r))
		}
		memo[l][r] = best
		return best
	}
	return solve(0, n-1)
}

// Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài
func maxCoins(nums []int) int {
	p := append(append([]int{1}, nums...), 1)
	n := len(p)
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}
	for length := 2; length < n; length++ {
		for l := 0; l+length < n; l++ {
			r := l + length
			best := 0
			for k := l + 1; k < r; k++ {
				best = max(best, p[l]*p[k]*p[r]+dp[l][k]+dp[k][r])
			}
			dp[l][r] = best
		}
	}
	return dp[0][n-1]
}

func repeat(v, n int) []int {
	out := make([]int, n)
	for i := range out {
		out[i] = v
	}
	return out
}

func main() {
	mixed := make([]int, 300)
	for i := range mixed {
		mixed[i] = (i*37 + 11) % 101
	}
	type tc struct {
		nums     []int
		expected int
	}
	cases := []tc{
		{[]int{7}, 7},
		{[]int{2, 3}, 9},
		{[]int{0, 0, 0}, 0},
		{[]int{4, 0, 4}, 20},
		{[]int{2, 9, 4}, 84},
		{[]int{5, 1, 1, 5}, 60},
		{[]int{9, 1, 8, 2, 7}, 760},
		{[]int{1, 2, 3, 4, 5, 6}, 252},
		{repeat(1, 300), 300},
		{repeat(100, 300), 298010100},
		{mixed, 116330212},
	}
	ok := 0
	for _, c := range cases {
		var calls int
		good := maxCoins(c.nums) == c.expected && burstMemo(c.nums, &calls) == c.expected
		if len(c.nums) <= 6 && burstBrute(c.nums, &calls) != c.expected {
			good = false
		}
		if good {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	arrays := [][]int{{}}
	for k := 0; k < len(arrays); k++ {
		if len(arrays[k]) < 5 {
			for v := 0; v <= 3; v++ {
				next := append(append([]int{}, arrays[k]...), v)
				arrays = append(arrays, next)
			}
		}
	}
	exhaustiveOk, total := 0, 0
	for _, nums := range arrays[1:] {
		total++
		var calls int
		expected := burstBrute(nums, &calls)
		if maxCoins(nums) == expected && burstMemo(nums, &calls) == expected {
			exhaustiveOk++
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu mọi thứ tự nổ)\n", exhaustiveOk, total)

	fmt.Printf("Chia theo quả nổ đầu tiên với [2,3]: %d, đúng là %d\n", burstFirstSplitWrong([]int{2, 3}), maxCoins([]int{2, 3}))
	eight := []int{3, 1, 4, 1, 5, 9, 2, 6}
	var bruteCalls, memoCalls int
	burstBrute(eight, &bruteCalls)
	burstMemo(eight, &memoCalls)
	fmt.Printf("8 quả: vét cạn %d lượt gọi, memo %d lượt gọi\n", bruteCalls, memoCalls)
}
