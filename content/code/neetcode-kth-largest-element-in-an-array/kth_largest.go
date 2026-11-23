// LeetCode 215, Kth Largest Element in an Array: slices.Sort, container/heap, quickselect ba phần, và bẫy h.Push.
// Chạy: go run kth_largest.go
package main

import (
	"container/heap"
	"fmt"
	"math/rand"
	"slices"
	"strings"
)

func sortThenPick(nums []int, k int) int {
	a := slices.Clone(nums) // slices.Sort sắp tại chỗ: sao chép để không đổi input
	slices.Sort(a)
	return a[len(a)-k]
}

// container/heap không phải một kiểu heap có sẵn: ta tự khai báo một kiểu thỏa heap.Interface
// (Len, Less, Swap của sort.Interface, cộng Push và Pop), rồi gọi các hàm của package heap trên nó.
type IntHeap []int

func (h IntHeap) Len() int           { return len(h) }
func (h IntHeap) Less(i, j int) bool { return h[i] < h[j] } // < là min-heap
func (h IntHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *IntHeap) Push(x any)        { *h = append(*h, x.(int)) } // chỉ thêm vào cuối, không nổi lên
func (h *IntHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

// Giữ min-heap k phần tử lớn nhất. Phải gọi heap.Push / heap.Pop của package, không gọi h.Push / h.Pop.
func heapOfK(nums []int, k int) int {
	h := &IntHeap{}
	for _, x := range nums {
		heap.Push(h, x) // heap.Push gọi h.Push rồi cho phần tử mới nổi lên
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	return (*h)[0]
}

// SAI: gọi thẳng phương thức h.Push. Nó chỉ append, không nổi lên, nên (*h)[0] không còn là nhỏ nhất.
func wrongMethodPush(nums []int, k int) int {
	h := &IntHeap{}
	for _, x := range nums {
		h.Push(x)
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	return (*h)[0]
}

func quickselect3Way(nums []int, k int) int {
	a, target := slices.Clone(nums), len(nums)-k
	lo, hi := 0, len(a)-1
	for {
		pivot := a[lo+rand.Intn(hi-lo+1)]
		lt, i, gt := lo, lo, hi
		for i <= gt {
			switch {
			case a[i] < pivot:
				a[lt], a[i] = a[i], a[lt]
				lt++
				i++
			case a[i] > pivot:
				a[i], a[gt] = a[gt], a[i]
				gt--
			default:
				i++
			}
		}
		if target < lt {
			hi = lt - 1
		} else if target > gt {
			lo = gt + 1
		} else {
			return pivot
		}
	}
}

func countingPick(nums []int, k int) int {
	var cnt [20001]int // giá trị trong [-10⁴, 10⁴]; mảng cố định nằm trên stack hoặc heap tùy trình biên dịch
	for _, x := range nums {
		cnt[x+10000]++
	}
	for v := 20000; v >= 0; v-- {
		k -= cnt[v]
		if k <= 0 {
			return v - 10000
		}
	}
	panic("k lớn hơn n")
}

type tc struct {
	nums    []int
	k, want int
}

func main() {
	cases := []tc{
		{[]int{3, 2, 1, 5, 6, 4}, 2, 5},
		{[]int{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4, 4},
		{[]int{1}, 1, 1},
		{[]int{7, 7, 7, 7}, 2, 7},
		{[]int{-1, -2, -3}, 1, -1},
		{[]int{-10000, 10000}, 2, -10000},
		{[]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 3, 8},
		{[]int{10, 9, 8, 7, 6, 5, 4, 3, 2, 1}, 10, 1},
		{[]int{10, 9, 1}, 1, 10},
		{[]int{2, -1, 10, -20}, 2, 2},
	}
	fns := []struct {
		name string
		f    func([]int, int) int
	}{{"sortThenPick", sortThenPick}, {"heapOfK", heapOfK}, {"quickselect3Way", quickselect3Way}, {"countingPick", countingPick}, {"wrongMethodPush", wrongMethodPush}}
	for _, fn := range fns {
		var bad []string
		for _, c := range cases {
			if got := fn.f(c.nums, c.k); got != c.want {
				bad = append(bad, fmt.Sprintf("%v k=%d → %d", c.nums, c.k, got))
			}
		}
		msg := ""
		if len(bad) > 0 {
			msg = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-16s %d/%d ca đúng%s\n", fn.name, len(cases)-len(bad), len(cases), msg)
	}
}
