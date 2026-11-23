// LeetCode 973, K Closest Points to Origin: slices.SortFunc và max-heap k chỗ bằng container/heap.
// Chạy: go run k_closest.go
package main

import (
	"cmp"
	"container/heap"
	"fmt"
	"math/rand"
	"slices"
	"time"
)

func dist2(p []int) int { return p[0]*p[0] + p[1]*p[1] } // int của Go là 64 bit: 2·10⁸ không tràn

func sortAll(points [][]int, k int) [][]int {
	s := slices.Clone(points)
	slices.SortFunc(s, func(a, b []int) int { return cmp.Compare(dist2(a), dist2(b)) })
	return s[:k]
}

// item giữ khoảng cách tính sẵn, để heap không tính lại mỗi lần so sánh.
type item struct {
	d int
	p []int
}

// farHeap: Less dùng > nên đỉnh là điểm XA nhất trong k điểm đang giữ.
type farHeap []item

func (h farHeap) Len() int           { return len(h) }
func (h farHeap) Less(i, j int) bool { return h[i].d > h[j].d }
func (h farHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *farHeap) Push(x any)        { *h = append(*h, x.(item)) }
func (h *farHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

func maxHeapK(points [][]int, k int) [][]int {
	h := make(farHeap, 0, k)
	for _, p := range points {
		d := dist2(p)
		if h.Len() < k {
			heap.Push(&h, item{d, p})
		} else if d < h[0].d {
			h[0] = item{d, p} // thay đỉnh rồi cho chìm xuống: một lần O(log k)
			heap.Fix(&h, 0)
		}
	}
	out := make([][]int, len(h))
	for i, it := range h {
		out[i] = it.p
	}
	return out
}

func norm(ps [][]int) []string {
	out := make([]string, len(ps))
	for i, p := range ps {
		out[i] = fmt.Sprint(p)
	}
	slices.Sort(out)
	return out
}

func main() {
	type tc struct {
		p    [][]int
		k    int
		want [][]int
	}
	cases := []tc{
		{[][]int{{1, 3}, {-2, 2}}, 1, [][]int{{-2, 2}}},
		{[][]int{{3, 3}, {5, -1}, {-2, 4}}, 2, [][]int{{3, 3}, {-2, 4}}},
		{[][]int{{0, 0}}, 1, [][]int{{0, 0}}},
		{[][]int{{1, 0}, {0, 1}, {2, 2}, {-1, -1}}, 3, [][]int{{1, 0}, {0, 1}, {-1, -1}}},
		{[][]int{{1, 1}, {2, 2}, {3, 3}}, 3, [][]int{{1, 1}, {2, 2}, {3, 3}}},
		{[][]int{{-5, -5}, {4, 4}, {-1, 0}, {10, -10}}, 2, [][]int{{-1, 0}, {4, 4}}},
		{[][]int{{10000, 10000}, {-10000, -10000}, {1, 1}}, 1, [][]int{{1, 1}}},
		{[][]int{{2, 2}, {1, 1}, {3, 3}, {0, 1}, {5, 0}}, 2, [][]int{{0, 1}, {1, 1}}},
	}
	for _, f := range []struct {
		name string
		fn   func([][]int, int) [][]int
	}{{"sortAll", sortAll}, {"maxHeapK", maxHeapK}} {
		ok := 0
		for _, c := range cases {
			if slices.Equal(norm(f.fn(c.p, c.k)), norm(c.want)) {
				ok++
			}
		}
		fmt.Printf("%-9s %d/%d ca đúng\n", f.name, ok, len(cases))
	}

	r := rand.New(rand.NewSource(973))
	pts := make([][]int, 1_000_000)
	for i := range pts {
		pts[i] = []int{r.Intn(20001) - 10000, r.Intn(20001) - 10000}
	}
	fmt.Println("\nn = 10⁶     sắp xếp   heap k chỗ")
	for _, k := range []int{10, 1000, 100_000} {
		fmt.Printf("k=%-8d", k)
		for _, fn := range []func([][]int, int) [][]int{sortAll, maxHeapK} {
			var ts []time.Duration
			for range 5 {
				t0 := time.Now()
				fn(pts, k)
				ts = append(ts, time.Since(t0))
			}
			slices.Sort(ts)
			fmt.Printf(" %7.0f ms", float64(ts[2].Microseconds())/1000)
		}
		fmt.Println()
	}
}
