// LeetCode 1046, Last Stone Weight: container/heap làm max-heap, và bẫy gọi h.Pop() trực tiếp.
// Chạy: go run last_stone.go
package main

import (
	"container/heap"
	"fmt"
	"sort"
	"strings"
)

// maxHeap cài đủ heap.Interface: sort.Interface (Len, Less, Swap) cộng Push và Pop.
// Less(i, j) trả a[i] > a[j] nên đỉnh là phần tử LỚN nhất.
type maxHeap []int

func (h maxHeap) Len() int           { return len(h) }
func (h maxHeap) Less(i, j int) bool { return h[i] > h[j] }
func (h maxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

// Push và Pop chỉ thêm, bớt ở CUỐI slice; heap.Push và heap.Pop lo phần nổi lên, chìm xuống.
func (h *maxHeap) Push(x any) { *h = append(*h, x.(int)) }
func (h *maxHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

func lastStoneWeight(stones []int) int {
	h := maxHeap(append([]int(nil), stones...))
	heap.Init(&h) // O(n)
	for h.Len() > 1 {
		y := heap.Pop(&h).(int)
		x := heap.Pop(&h).(int)
		if y > x {
			heap.Push(&h, y-x)
		}
	}
	if h.Len() == 1 {
		return h[0]
	}
	return 0
}

// SAI: gọi phương thức h.Pop() thay cho heap.Pop(&h). Nó chỉ cắt phần tử CUỐI slice, không phải đỉnh.
func wrongDirectPop(stones []int) int {
	h := maxHeap(append([]int(nil), stones...))
	heap.Init(&h)
	for h.Len() > 1 {
		y := h.Pop().(int)
		x := h.Pop().(int)
		if y != x {
			heap.Push(&h, abs(y-x))
		}
	}
	if h.Len() == 1 {
		return h[0]
	}
	return 0
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

// Sắp xếp lại mỗi lượt, để đối chiếu.
func sortEachRound(stones []int) int {
	s := append([]int(nil), stones...)
	for len(s) > 1 {
		sort.Ints(s)
		y, x := s[len(s)-1], s[len(s)-2]
		s = s[:len(s)-2]
		if y > x {
			s = append(s, y-x)
		}
	}
	if len(s) == 1 {
		return s[0]
	}
	return 0
}

func main() {
	cases := []struct {
		s    []int
		want int
	}{
		{[]int{2, 7, 4, 1, 8, 1}, 1}, {[]int{1}, 1}, {[]int{2, 2}, 0}, {[]int{3, 3, 3}, 3}, {[]int{10, 4, 2, 10}, 2},
		{[]int{10, 2, 9}, 1}, {[]int{1000, 1}, 999}, {[]int{7, 6, 7, 6, 9}, 3}, {[]int{31, 26, 33, 21, 40}, 9},
	}
	fns := []struct {
		name string
		fn   func([]int) int
	}{{"lastStoneWeight", lastStoneWeight}, {"sortEachRound", sortEachRound}, {"wrongDirectPop", wrongDirectPop}}
	for _, f := range fns {
		var bad []string
		for _, c := range cases {
			if got := f.fn(c.s); got != c.want {
				bad = append(bad, fmt.Sprintf("%v → %d", c.s, got))
			}
		}
		msg := fmt.Sprintf("%-16s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			msg += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(msg)
	}
	h := maxHeap{2, 7, 4, 1, 8, 1}
	heap.Init(&h)
	fmt.Printf("\nsau heap.Init: %v\n", []int(h))
	a := h.Pop()
	b := heap.Pop(&h)
	fmt.Printf("h.Pop() trả %v (phần tử cuối), rồi heap.Pop(&h) trả %v (đỉnh)\n", a, b)
}
