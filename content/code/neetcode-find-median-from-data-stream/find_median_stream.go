// LC 295 Find Median from Data Stream: hai heap bằng container/heap, và hai bẫy về phép chia.
// Chạy: go run find_median_stream.go
package main

import (
	"container/heap"
	"fmt"
	"math"
	"sort"
	"strings"
	"time"
)

// minHeap cài heap.Interface; maxHeap chỉ đổi Less.
type minHeap []int

func (h minHeap) Len() int           { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h minHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *minHeap) Pop() any          { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

type maxHeap struct{ minHeap }

func (h maxHeap) Less(i, j int) bool { return h.minHeap[i] > h.minHeap[j] }

// MedianFinder: lower là max-heap (nửa nhỏ), upper là min-heap (nửa lớn); lower có thể hơn một phần tử.
type MedianFinder struct {
	lower *maxHeap
	upper *minHeap
}

func NewMedianFinder() *MedianFinder { return &MedianFinder{&maxHeap{}, &minHeap{}} }

func (m *MedianFinder) AddNum(x int) {
	heap.Push(m.lower, x)
	heap.Push(m.upper, heap.Pop(m.lower)) // số lớn nhất nửa nhỏ sang nửa lớn
	if m.upper.Len() > m.lower.Len() {
		heap.Push(m.lower, heap.Pop(m.upper))
	}
}

func (m *MedianFinder) FindMedian() float64 {
	if m.lower.Len() > m.upper.Len() {
		return float64(m.lower.minHeap[0])
	}
	return float64(m.lower.minHeap[0]+(*m.upper)[0]) / 2
}

// SAI: cộng rồi chia nguyên trước khi đổi sang float64: (1 + 2) / 2 = 1, mất .5.
func (m *MedianFinder) findMedianIntDiv() float64 {
	if m.lower.Len() > m.upper.Len() {
		return float64(m.lower.minHeap[0])
	}
	return float64((m.lower.minHeap[0] + (*m.upper)[0]) / 2)
}

func medianOf(xs []int) float64 {
	a := append([]int(nil), xs...)
	sort.Ints(a)
	n := len(a)
	if n%2 == 1 {
		return float64(a[n/2])
	}
	return float64(a[n/2-1]+a[n/2]) / 2
}

type tc struct {
	label string
	xs    []int
}

var cases = []tc{
	{"ví dụ của đề", []int{1, 2, 3}},
	{"một số", []int{5}},
	{"giảm dần", []int{5, 4, 3, 2, 1}},
	{"tăng dần", []int{1, 2, 3, 4, 5, 6}},
	{"trùng nhau", []int{7, 7, 7, 7}},
	{"số âm", []int{-1, -2, -3, -4, -5}},
	{"xen kẽ", []int{6, 10, 2, 6, 5, 0, 6, 3, 1, 0, 0}},
	{"biên đề", []int{-100000, 100000, -100000, 100000}},
}

func check(name string, find func(*MedianFinder) float64) {
	var bad []string
	for _, c := range cases {
		m := NewMedianFinder()
		var got []string
		ok := true
		for i, x := range c.xs {
			m.AddNum(x)
			v := find(m)
			got = append(got, fmt.Sprint(v))
			if v != medianOf(c.xs[:i+1]) {
				ok = false
			}
		}
		if !ok {
			bad = append(bad, c.label+" → ["+strings.Join(got, " ")+"]")
		}
	}
	msg := ""
	if len(bad) > 0 {
		msg = "; sai ở: " + strings.Join(bad, "; ")
	}
	fmt.Printf("%-16s %d/%d ca đúng%s\n", name, len(cases)-len(bad), len(cases), msg)
}

func main() {
	check("FindMedian", (*MedianFinder).FindMedian)
	check("findMedianIntDiv", (*MedianFinder).findMedianIntDiv)

	// int của Go là 64 bit nên a + b không tràn với số của đề; int32 thì tràn.
	var a, b int32 = math.MaxInt32, math.MaxInt32
	fmt.Println("int32: (a + b) / 2 =", (a+b)/2, " float64(a)+float64(b) / 2 =", (float64(a)+float64(b))/2)

	// Đo: 10⁶ lần AddNum + FindMedian, số giả ngẫu nhiên trong [-10⁵, 10⁵].
	xs := make([]int, 1_000_000)
	s := uint32(295)
	for i := range xs {
		s = s*1664525 + 1013904223 // LCG 32 bit: phép nhân tràn đúng theo modulo 2³²
		xs[i] = int(s>>8)%200_001 - 100_000
	}
	var ts []float64
	for r := 0; r < 3; r++ {
		t0 := time.Now()
		m := NewMedianFinder()
		sum := 0.0
		for _, x := range xs {
			m.AddNum(x)
			sum += m.FindMedian()
		}
		ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
		_ = sum
	}
	sort.Float64s(ts)
	fmt.Printf("10⁶ lần AddNum + FindMedian: %.1f ms (trung vị 3 lần)\n", ts[1])
}
