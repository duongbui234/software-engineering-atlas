// Ga SRCH-03, heap và top K: giải 703, 1046, 973 và 215 bằng container/heap.
// Chạy: go run heap_station.go
package main

import (
	"container/heap"
	"fmt"
	"slices"
)

// keyHeap là min-heap theo khóa: muốn max-heap thì cho khóa âm.
type keyHeap[T any] struct {
	a   []T
	key func(T) int
}

func (h *keyHeap[T]) Len() int           { return len(h.a) }
func (h *keyHeap[T]) Less(i, j int) bool { return h.key(h.a[i]) < h.key(h.a[j]) }
func (h *keyHeap[T]) Swap(i, j int)      { h.a[i], h.a[j] = h.a[j], h.a[i] }
func (h *keyHeap[T]) Push(x any)         { h.a = append(h.a, x.(T)) }
func (h *keyHeap[T]) Pop() any {
	x := h.a[len(h.a)-1]
	h.a = h.a[:len(h.a)-1]
	return x
}

type KthLargest struct { // 703: min-heap giữ k số lớn nhất
	k int
	h *keyHeap[int]
}

func NewKthLargest(k int, nums []int) *KthLargest {
	s := &KthLargest{k, &keyHeap[int]{key: func(x int) int { return x }}}
	for _, x := range nums {
		s.Add(x)
	}
	return s
}

func (s *KthLargest) Add(val int) int {
	if s.h.Len() < s.k {
		heap.Push(s.h, val)
	} else if val > s.h.a[0] { // thay ứng viên yếu nhất
		s.h.a[0] = val
		heap.Fix(s.h, 0)
	}
	return s.h.a[0]
}

func lastStoneWeight(stones []int) int { // 1046: max-heap bằng khóa âm
	h := &keyHeap[int]{a: slices.Clone(stones), key: func(x int) int { return -x }}
	heap.Init(h)
	for h.Len() > 1 {
		y, x := heap.Pop(h).(int), heap.Pop(h).(int)
		if y > x {
			heap.Push(h, y-x)
		}
	}
	if h.Len() == 0 {
		return 0
	}
	return h.a[0]
}

func kClosest(points [][]int, k int) [][]int { // 973: max-heap k chỗ theo bình phương khoảng cách
	h := &keyHeap[[]int]{key: func(p []int) int { return -(p[0]*p[0] + p[1]*p[1]) }}
	for _, p := range points {
		heap.Push(h, p)
		if h.Len() > k {
			heap.Pop(h) // bỏ điểm xa nhất
		}
	}
	return h.a
}

func findKthLargest(nums []int, k int) int { // 215: min-heap k chỗ
	h := &keyHeap[int]{key: func(x int) int { return x }}
	for _, x := range nums {
		if h.Len() < k {
			heap.Push(h, x)
		} else if x > h.a[0] { // chỉ số mạnh hơn đỉnh mới vào
			h.a[0] = x
			heap.Fix(h, 0)
		}
	}
	return h.a[0]
}

func stream(k int, nums, adds []int) []int {
	s := NewKthLargest(k, nums)
	out := make([]int, len(adds))
	for i, v := range adds {
		out[i] = s.Add(v)
	}
	return out
}

func pts(ps [][]int) string {
	s := make([]string, len(ps))
	for i, p := range ps {
		s[i] = fmt.Sprint(p)
	}
	slices.Sort(s)
	return fmt.Sprint(s)
}

func main() {
	cases := []struct {
		name      string
		got, want any
	}{
		{"703 ví dụ của đề", stream(3, []int{4, 5, 8, 2}, []int{3, 5, 10, 9, 4}), []int{4, 5, 5, 8, 8}},
		{"703 nums rỗng", stream(1, nil, []int{-3, -2, -4, 0, 4}), []int{-3, -2, -2, 0, 4}},
		{"703 số trùng", stream(2, []int{5, 5}, []int{5, 1, 6}), []int{5, 5, 5}},
		{"1046 ví dụ của đề", lastStoneWeight([]int{2, 7, 4, 1, 8, 1}), 1},
		{"1046 một viên", lastStoneWeight([]int{1}), 1},
		{"1046 vỡ hết", lastStoneWeight([]int{2, 2}), 0},
		{"1046 [3, 7, 2]", lastStoneWeight([]int{3, 7, 2}), 2},
		{"973 ví dụ 1", pts(kClosest([][]int{{1, 3}, {-2, 2}}, 1)), pts([][]int{{-2, 2}})},
		{"973 ví dụ 2", pts(kClosest([][]int{{3, 3}, {5, -1}, {-2, 4}}, 2)), pts([][]int{{3, 3}, {-2, 4}})},
		{"973 k = n", pts(kClosest([][]int{{0, 1}, {1, 0}}, 2)), pts([][]int{{0, 1}, {1, 0}})},
		{"215 ví dụ 1", findKthLargest([]int{3, 2, 1, 5, 6, 4}, 2), 5},
		{"215 ví dụ 2", findKthLargest([]int{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4), 4},
		{"215 một phần tử", findKthLargest([]int{1}, 1), 1},
		{"215 số âm trùng", findKthLargest([]int{-1, -1}, 2), -1},
	}
	ok := 0
	var bad []string
	for _, c := range cases {
		if fmt.Sprint(c.got) == fmt.Sprint(c.want) {
			ok++
		} else {
			bad = append(bad, c.name)
		}
	}
	fmt.Printf("heap_station %d/%d ca đúng", ok, len(cases))
	if len(bad) > 0 {
		fmt.Printf("; sai ở: %v", bad)
	}
	fmt.Println()
}
