// LeetCode 4, Median of Two Sorted Arrays: bốn cách, một bản sai, test và đối chiếu ngẫu nhiên.
// Chạy: go run median_two_arrays.go
package main

import (
	"fmt"
	"math"
	"math/rand/v2"
	"slices"
)

// Cách 1, trộn rồi lấy giữa: O(m + n) thời gian và bộ nhớ.
func mergeThenPick(a, b []int) float64 {
	all := make([]int, 0, len(a)+len(b))
	i, j := 0, 0
	for i < len(a) || j < len(b) {
		if j == len(b) || (i < len(a) && a[i] <= b[j]) {
			all = append(all, a[i])
			i++
		} else {
			all = append(all, b[j])
			j++
		}
	}
	t := len(all)
	if t%2 == 1 {
		return float64(all[t/2])
	}
	return float64(all[t/2-1]+all[t/2]) / 2
}

// Cách 2, hai con trỏ: đi tới phần tử giữa, chỉ nhớ hai giá trị gần nhất.
func twoPointer(a, b []int) float64 {
	t := len(a) + len(b)
	i, j, prev, cur := 0, 0, 0, 0
	for k := 0; k <= t/2; k++ {
		prev = cur
		if j == len(b) || (i < len(a) && a[i] <= b[j]) {
			cur = a[i]
			i++
		} else {
			cur = b[j]
			j++
		}
	}
	if t%2 == 1 {
		return float64(cur)
	}
	return float64(prev+cur) / 2
}

// Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1).
func kth(a, b []int, k int) int {
	i, j := 0, 0
	for {
		if i == len(a) {
			return b[j+k-1]
		}
		if j == len(b) {
			return a[i+k-1]
		}
		if k == 1 {
			return min(a[i], b[j])
		}
		h := k / 2
		ni, nj := min(i+h, len(a))-1, min(j+h, len(b))-1
		if a[ni] <= b[nj] {
			k -= ni - i + 1
			i = ni + 1
		} else {
			k -= nj - j + 1
			j = nj + 1
		}
	}
}

func kthElimination(a, b []int) float64 {
	t := len(a) + len(b)
	if t%2 == 1 {
		return float64(kth(a, b, t/2+1))
	}
	return float64(kth(a, b, t/2)+kth(a, b, t/2+1)) / 2
}

// Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn. math.MinInt và math.MaxInt làm phần tử canh:
// chúng chỉ được so sánh, không bao giờ bị cộng (tổng chẵn ≥ 2 luôn có thật cả hai phía), nên không tràn.
func partition(a, b []int) float64 {
	if len(a) > len(b) {
		a, b = b, a
	}
	m, n := len(a), len(b)
	half := (m + n + 1) / 2
	lo, hi := 0, m
	for lo <= hi {
		i := (lo + hi) / 2
		j := half - i
		aL, aR, bL, bR := math.MinInt, math.MaxInt, math.MinInt, math.MaxInt
		if i > 0 {
			aL = a[i-1]
		}
		if i < m {
			aR = a[i]
		}
		if j > 0 {
			bL = b[j-1]
		}
		if j < n {
			bR = b[j]
		}
		if aL <= bR && bL <= aR {
			if (m+n)%2 == 1 {
				return float64(max(aL, bL))
			}
			return float64(max(aL, bL)+min(aR, bR)) / 2
		}
		if aL > bR {
			hi = i - 1
		} else {
			lo = i + 1
		}
	}
	panic("mảng chưa sắp xếp")
}

// SAI: chia hai số int rồi mới đổi sang float64: phép chia nguyên đã cắt mất phần .5.
func wrongIntDivision(a, b []int) float64 {
	all := slices.Concat(a, b)
	slices.Sort(all)
	t := len(all)
	if t%2 == 1 {
		return float64(all[t/2])
	}
	return float64((all[t/2-1] + all[t/2]) / 2)
}

func bruteForce(a, b []int) float64 {
	all := slices.Concat(a, b)
	slices.Sort(all)
	t := len(all)
	if t%2 == 1 {
		return float64(all[t/2])
	}
	return float64(all[t/2-1]+all[t/2]) / 2
}

func main() {
	type tc struct {
		a, b []int
		want float64
	}
	cases := []tc{
		{[]int{1, 3}, []int{2}, 2}, {[]int{1, 2}, []int{3, 4}, 2.5}, {[]int{}, []int{1}, 1}, {[]int{2}, []int{}, 2},
		{[]int{}, []int{2, 3}, 2.5}, {[]int{-5, -3, -1}, []int{-4, -2}, -3}, {[]int{1, 1, 1}, []int{1, 1}, 1},
		{[]int{1, 2, 3, 4, 5}, []int{6, 7, 8, 9, 10, 11}, 6}, {[]int{1, 2, 3, 4, 5, 6}, []int{7}, 4}, {[]int{-2, -1}, []int{3}, -1},
	}
	type named struct {
		name string
		fn   func(a, b []int) float64
	}
	fns := []named{{"mergeThenPick", mergeThenPick}, {"twoPointer", twoPointer}, {"kthElimination", kthElimination}, {"partition", partition}, {"wrongIntDivision", wrongIntDivision}}
	for _, f := range fns {
		ok, bad := 0, ""
		for _, c := range cases {
			if got := f.fn(c.a, c.b); got == c.want {
				ok++
			} else {
				bad += fmt.Sprintf(" %v %v → %v", c.a, c.b, got)
			}
		}
		if bad != "" {
			bad = "; sai ở" + bad
		}
		fmt.Printf("%-16s %d/%d ca đúng%s\n", f.name, ok, len(cases), bad)
	}

	// Đối chiếu ngẫu nhiên với cách ngây thơ: nối, sort, lấy giữa.
	r := rand.New(rand.NewPCG(42, 0))
	sortedRandom := func() []int {
		s := make([]int, r.IntN(21))
		for k := range s {
			s[k] = r.IntN(101) - 50
		}
		slices.Sort(s)
		return s
	}
	const pairs = 100_000
	wrong := make([]int, len(fns))
	for p := 0; p < pairs; p++ {
		a, b := sortedRandom(), sortedRandom()
		if len(a)+len(b) == 0 {
			a = []int{0}
		}
		want := bruteForce(a, b)
		for k, f := range fns {
			if f.fn(a, b) != want {
				wrong[k]++
			}
		}
	}
	fmt.Printf("\nĐối chiếu với nối rồi sort, %d cặp ngẫu nhiên:\n", pairs)
	for k, f := range fns {
		fmt.Printf("%-16s sai %d cặp\n", f.name, wrong[k])
	}
	x, y := -3, 2
	fmt.Printf("\nchia nguyên trong Go: %d / %d = %d (cắt về 0; Python -3 // 2 ra -2)\n", x, y, x/y)
}
