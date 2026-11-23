// LeetCode 703, Kth Largest Element in a Stream: container/heap với kiểu IntHeap, và bẫy receiver giá trị.
// Chạy: go run kth_largest_stream.go
package main

import (
	"container/heap"
	"fmt"
	"math/rand"
	"slices"
)

// IntHeap thỏa heap.Interface: Len, Less, Swap (của sort.Interface) cùng Push và Pop.
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] } // < là min-heap
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }

// Push và Pop đổi độ dài slice nên phải nhận con trỏ.
func (h *IntHeap) Push(x any) { *h = append(*h, x.(int)) }
func (h *IntHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

// SAI: Push và Pop nhận giá trị thay vì con trỏ. Vẫn biên dịch được, nhưng append chỉ đổi bản sao:
// Push làm mất phần tử, Pop trả đỉnh mà không bớt độ dài.
type ValHeap []int

func (h ValHeap) Len() int           { return len(h) }
func (h ValHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h ValHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h ValHeap) Push(x any)         { h = append(h, x.(int)) }
func (h ValHeap) Pop() any           { x := h[len(h)-1]; h = h[:len(h)-1]; return x }

type KthLargest struct {
	k int
	h *IntHeap
}

func Constructor(k int, nums []int) KthLargest {
	h := IntHeap(slices.Clone(nums))
	heap.Init(&h) // O(n)
	for h.Len() > k {
		heap.Pop(&h)
	}
	return KthLargest{k, &h}
}

func (s *KthLargest) Add(val int) int {
	if s.h.Len() < s.k {
		heap.Push(s.h, val)
	} else if val > (*s.h)[0] {
		(*s.h)[0] = val
		heap.Fix(s.h, 0) // cho đỉnh mới chìm xuống
	}
	return (*s.h)[0]
}

// SAI: gọi h.Push trực tiếp thay vì heap.Push(h, …). Phương thức Push của ta chỉ append, không nổi lên,
// nên (*h)[0] không còn là số nhỏ nhất.
func (s *KthLargest) addDirectPush(val int) int {
	s.h.Push(val)
	if s.h.Len() > s.k {
		heap.Pop(s.h)
	}
	return (*s.h)[0]
}

type tc struct {
	name       string
	k          int
	nums, adds []int
	want       []int
}

func main() {
	cases := []tc{
		{"ví dụ của đề", 3, []int{4, 5, 8, 2}, []int{3, 5, 10, 9, 4}, []int{4, 5, 5, 8, 8}},
		{"nhiều số 7 trùng", 4, []int{7, 7, 7, 7, 8, 3}, []int{2, 10, 9, 9}, []int{7, 7, 7, 8}},
		{"nums rỗng, k = 1", 1, []int{}, []int{-3, -2, -4, 0, 4}, []int{-3, -2, -2, 0, 4}},
		{"nums thiếu một số", 2, []int{0}, []int{-1, 1, -2, -4, 3}, []int{-1, 0, 0, 0, 1}},
		{"số trùng", 2, []int{5, 5}, []int{5, 1, 6}, []int{5, 5, 5}},
		{"k bằng cả luồng", 3, []int{1, 2}, []int{3, 0}, []int{1, 1}},
		{"số âm", 2, []int{-10, -20}, []int{-5, -30, -1}, []int{-10, -10, -5}},
	}
	r := rand.New(rand.NewSource(7))
	nums := make([]int, 200)
	for i := range nums {
		nums[i] = r.Intn(20001) - 10000
	}
	adds := make([]int, 500)
	seen := slices.Clone(nums)
	want := make([]int, 500)
	for i := range adds {
		adds[i] = r.Intn(20001) - 10000
		seen = append(seen, adds[i])
		s := slices.Clone(seen)
		slices.Sort(s)
		want[i] = s[len(s)-50]
	}
	cases = append(cases, tc{"ngẫu nhiên 200 + 500 số, k = 50", 50, nums, adds, want})

	for _, f := range []struct {
		name string
		add  func(*KthLargest, int) int
	}{{"KthLargest", (*KthLargest).Add}, {"addDirectPush", (*KthLargest).addDirectPush}} {
		ok := 0
		var bad []string
		for _, c := range cases {
			s := Constructor(c.k, c.nums)
			got := make([]int, len(c.adds))
			for i, v := range c.adds {
				got[i] = f.add(&s, v)
			}
			if slices.Equal(got, c.want) {
				ok++
			} else if len(c.adds) <= 5 {
				bad = append(bad, fmt.Sprintf("%s → %v", c.name, got))
			} else {
				bad = append(bad, c.name)
			}
		}
		fmt.Printf("%-14s %d/%d ca đúng", f.name, ok, len(cases))
		if len(bad) > 0 {
			fmt.Printf("; sai ở: %v", bad)
		}
		fmt.Println()
	}

	v := ValHeap{5, 2, 8}
	heap.Init(v)
	heap.Push(v, 1)
	fmt.Printf("\nValHeap: sau Push(1): %v, độ dài %d", v, len(v))
	top := heap.Pop(v)
	fmt.Printf("; Pop trả %v, heap còn %v, độ dài %d\n", top, v, len(v))
}
