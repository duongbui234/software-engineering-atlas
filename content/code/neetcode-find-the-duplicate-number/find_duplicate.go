// LC 287 Find the Duplicate Number bằng Go: map, tìm nhị phân trên giá trị, đếm bit, rùa và thỏ (Floyd), và bẫy slice dùng chung mảng nền.
// Chạy: go run find_duplicate.go
package main

import (
	"fmt"
	"math/rand/v2"
	"slices"
	"sort"
	"time"
)

// map các số đã gặp: O(n) bộ nhớ.
func hashSet(nums []int) int {
	seen := make(map[int]bool, len(nums))
	for _, x := range nums {
		if seen[x] {
			return x
		}
		seen[x] = true
	}
	return -1
}

// Tìm nhị phân trên giá trị: số trùng là m nhỏ nhất có cnt(m) = số phần tử ≤ m lớn hơn m.
func binaryCount(nums []int) int {
	lo, hi := 1, len(nums)-1
	for lo < hi {
		mid := int(uint(lo+hi) >> 1)
		cnt := 0
		for _, x := range nums {
			if x <= mid {
				cnt++
			}
		}
		if cnt > mid {
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}

// Đếm bit: bit b của số trùng bật khi nums có nhiều số bật bit b hơn dãy 1..n.
func bitCount(nums []int) int {
	n := len(nums) - 1
	ans := 0
	for b := 0; 1<<b <= n; b++ {
		mask := 1 << b
		inNums, inRange := 0, 0
		for _, x := range nums {
			if x&mask != 0 {
				inNums++
			}
		}
		for v := 1; v <= n; v++ {
			if v&mask != 0 {
				inRange++
			}
		}
		if inNums > inRange {
			ans |= mask
		}
	}
	return ans
}

// Rùa và thỏ trên đồ thị i → nums[i], xuất phát từ chỉ số 0.
func floyd(nums []int) int {
	slow, fast := 0, 0
	for {
		slow = nums[slow]
		fast = nums[nums[fast]]
		if slow == fast {
			break
		}
	}
	a := 0
	for a != slow {
		a = nums[a]
		slow = nums[slow]
	}
	return a
}

// BẪY: sort.Ints sắp tại chỗ. Slice truyền vào hàm vẫn trỏ cùng mảng nền, nên mảng của người gọi bị đổi.
func sortInPlace(nums []int) int {
	sort.Ints(nums)
	for i := 1; i < len(nums); i++ {
		if nums[i] == nums[i-1] {
			return nums[i]
		}
	}
	return -1
}

func makeInput(n int, r *rand.Rand) ([]int, int) {
	perm := r.Perm(n)
	for i := range perm {
		perm[i]++
	}
	nums := append([]int{perm[0]}, perm...)
	r.Shuffle(len(nums), func(i, j int) { nums[i], nums[j] = nums[j], nums[i] })
	return nums, perm[0]
}

func median(fn func(), reps int) float64 {
	ts := make([]float64, reps)
	for i := range ts {
		t0 := time.Now()
		fn()
		ts[i] = float64(time.Since(t0).Microseconds()) / 1000
	}
	slices.Sort(ts)
	return ts[reps/2]
}

func main() {
	cases := []struct {
		nums []int
		want int
	}{
		{[]int{1, 3, 4, 2, 2}, 2}, {[]int{3, 1, 3, 4, 2}, 3}, {[]int{3, 3, 3, 3, 3}, 3}, {[]int{1, 1}, 1}, {[]int{1, 1, 2}, 1},
		{[]int{2, 2, 2, 2, 2}, 2}, {[]int{2, 5, 9, 6, 9, 3, 8, 9, 7, 1}, 9}, {[]int{1, 4, 4, 2, 4}, 4}, {[]int{2, 1, 2}, 2}, {[]int{4, 3, 1, 4, 2}, 4},
	}
	solvers := []struct {
		name string
		fn   func([]int) int
	}{{"hashSet", hashSet}, {"binaryCount", binaryCount}, {"bitCount", bitCount}, {"floyd", floyd}, {"sortInPlace", sortInPlace}}
	for _, s := range solvers {
		ok := 0
		for _, c := range cases {
			if s.fn(slices.Clone(c.nums)) == c.want {
				ok++
			}
		}
		fmt.Printf("%-12s %d/%d ca đúng\n", s.name, ok, len(cases))
	}

	nums := []int{3, 1, 3, 4, 2}
	got := sortInPlace(nums)
	fmt.Printf("\nsortInPlace([3 1 3 4 2]) = %d; slice của người gọi giờ là %v\n", got, nums)

	r := rand.New(rand.NewPCG(287, 0))
	bad := map[string]int{}
	for t := 0; t < 2000; t++ {
		nums, d := makeInput(1+r.IntN(2000), r)
		for _, s := range solvers[:4] {
			if s.fn(slices.Clone(nums)) != d {
				bad[s.name]++
			}
		}
	}
	fmt.Printf("ngẫu nhiên 2000 mảng: số mảng sai: hashSet %d, binaryCount %d, bitCount %d, floyd %d\n", bad["hashSet"], bad["binaryCount"], bad["bitCount"], bad["floyd"])

	fmt.Println("\nn            hashSet  binaryCount  bitCount    floyd   (ms, trung vị 5 lần)")
	for _, n := range []int{100_000, 1_000_000} {
		nums, _ := makeInput(n, r)
		fmt.Printf("%-10d %9.2f %12.2f %9.2f %8.2f\n", n,
			median(func() { hashSet(nums) }, 5), median(func() { binaryCount(nums) }, 5),
			median(func() { bitCount(nums) }, 5), median(func() { floyd(nums) }, 5))
	}
}
