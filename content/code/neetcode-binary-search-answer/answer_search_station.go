// Ga SRCH-02, tìm kiếm nhị phân trên đáp án: lời giải của 875, 981 và 4.
// Chạy: go run answer_search_station.go
package main

import (
	"fmt"
	"math"
	"slices"
	"sort"
)

func minEatingSpeed(piles []int, h int) int { // 875
	lo, hi := 1, slices.Max(piles)
	for lo < hi {
		mid := lo + (hi-lo)/2
		hours := 0
		for _, p := range piles {
			hours += (p + mid - 1) / mid
		}
		if hours <= h { // kịp: giữ mid
			hi = mid
		} else {
			lo = mid + 1
		}
	}
	return lo
}

type entry struct {
	ts   int
	vals string
}

type TimeMap struct{ store map[string][]entry } // 981: mốc của mỗi khóa tăng dần

func (t *TimeMap) Set(key, value string, timestamp int) {
	t.store[key] = append(t.store[key], entry{timestamp, value})
}

func (t *TimeMap) Get(key string, timestamp int) string {
	es := t.store[key]
	i := sort.Search(len(es), func(i int) bool { return es[i].ts > timestamp }) // mốc đầu tiên > timestamp
	if i == 0 {
		return ""
	}
	return es[i-1].vals
}

func findMedianSortedArrays(a, b []int) float64 { // 4: chia đôi trên vị trí cắt
	if len(a) > len(b) {
		a, b = b, a
	}
	m, n := len(a), len(b)
	half := (m + n + 1) / 2
	lo, hi := 0, m
	for lo <= hi {
		i := (lo + hi) / 2
		j := half - i
		aL, aR, bL, bR := math.Inf(-1), math.Inf(1), math.Inf(-1), math.Inf(1)
		if i > 0 {
			aL = float64(a[i-1])
		}
		if i < m {
			aR = float64(a[i])
		}
		if j > 0 {
			bL = float64(b[j-1])
		}
		if j < n {
			bR = float64(b[j])
		}
		if aL <= bR && bL <= aR {
			if (m+n)%2 == 1 {
				return math.Max(aL, bL)
			}
			return (math.Max(aL, bL) + math.Min(aR, bR)) / 2
		}
		if aL > bR {
			hi = i - 1 // lấy quá nhiều từ a
		} else {
			lo = i + 1
		}
	}
	panic("mảng đầu vào chưa sắp")
}

func main() {
	ok, total := 0, 0
	check := func(got, want any, label string) {
		total++
		if got == want {
			ok++
		} else {
			fmt.Printf("sai: %s → %v, cần %v\n", label, got, want)
		}
	}
	check(minEatingSpeed([]int{3, 6, 7, 11}, 8), 4, "875")
	check(minEatingSpeed([]int{30, 11, 23, 4, 20}, 5), 30, "875 h=5")
	check(minEatingSpeed([]int{30, 11, 23, 4, 20}, 6), 23, "875 h=6")
	check(minEatingSpeed([]int{1000000000}, 2), 500000000, "875 [10⁹]")
	tm := &TimeMap{map[string][]entry{}}
	tm.Set("foo", "bar", 1)
	check(tm.Get("foo", 1), "bar", "981 get 1")
	check(tm.Get("foo", 3), "bar", "981 get 3")
	tm.Set("foo", "bar2", 4)
	check(tm.Get("foo", 4), "bar2", "981 get 4")
	check(tm.Get("foo", 0), "", "981 get 0")
	check(tm.Get("baz", 5), "", "981 khóa chưa có")
	check(findMedianSortedArrays([]int{1, 3}, []int{2}), 2.0, "4 [1,3] [2]")
	check(findMedianSortedArrays([]int{1, 2}, []int{3, 4}), 2.5, "4 [1,2] [3,4]")
	check(findMedianSortedArrays([]int{}, []int{1}), 1.0, "4 [] [1]")
	check(findMedianSortedArrays([]int{0, 0}, []int{0, 0}), 0.0, "4 toàn 0")
	check(findMedianSortedArrays([]int{1, 2, 3, 4, 5}, []int{6, 7, 8}), 4.5, "4 tách rời")
	fmt.Printf("answer_search_station %d/%d ca đúng\n", ok, total)
}
