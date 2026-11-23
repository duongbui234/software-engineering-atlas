// LC 23 Merge k Sorted Lists: container/heap với các nút, và chia để trị từng cặp.
// Chạy: go run merge_k_lists.go
package main

import (
	"container/heap"
	"fmt"
	"math/rand/v2"
	"slices"
	"sort"
	"strings"
	"time"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

func build(vals []int) *ListNode {
	var head *ListNode
	for i := len(vals) - 1; i >= 0; i-- {
		head = &ListNode{vals[i], head}
	}
	return head
}

func toSlice(head *ListNode) []int {
	out := []int{}
	for ; head != nil; head = head.Next {
		out = append(out, head.Val)
	}
	return out
}

func mergeTwo(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val {
			tail.Next, a = a, a.Next
		} else {
			tail.Next, b = b, b.Next
		}
		tail = tail.Next
	}
	if a != nil {
		tail.Next = a
	} else {
		tail.Next = b
	}
	return dummy.Next
}

// nodeHeap cài heap.Interface; Push và Pop phải có receiver con trỏ vì chúng đổi độ dài slice.
type nodeHeap []*ListNode

func (h nodeHeap) Len() int           { return len(h) }
func (h nodeHeap) Less(i, j int) bool { return h[i].Val < h[j].Val }
func (h nodeHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *nodeHeap) Push(x any)        { *h = append(*h, x.(*ListNode)) }
func (h *nodeHeap) Pop() any {
	old := *h
	n := old[len(old)-1]
	*h = old[:len(old)-1]
	return n
}

// Heap k đầu danh sách: bỏ qua danh sách rỗng (nil) khi dựng heap.
func mergeHeap(lists []*ListNode) *ListNode {
	h := nodeHeap{}
	for _, l := range lists {
		if l != nil {
			h = append(h, l)
		}
	}
	heap.Init(&h)
	dummy := &ListNode{}
	tail := dummy
	for h.Len() > 0 {
		node := heap.Pop(&h).(*ListNode)
		tail.Next = node
		tail = node
		if node.Next != nil {
			heap.Push(&h, node.Next)
		}
	}
	return dummy.Next
}

// Chia để trị: trộn từng cặp cho tới khi còn một danh sách.
func mergeDivide(lists []*ListNode) *ListNode {
	if len(lists) == 0 {
		return nil
	}
	cur := slices.Clone(lists)
	for len(cur) > 1 {
		next := []*ListNode{}
		for i := 0; i < len(cur); i += 2 {
			if i+1 < len(cur) {
				next = append(next, mergeTwo(cur[i], cur[i+1]))
			} else {
				next = append(next, cur[i])
			}
		}
		cur = next
	}
	return cur[0]
}

// SAI: đưa cả nil vào heap. Less đọc h[i].Val của nil và panic.
func wrongNilInHeap(lists []*ListNode) *ListNode {
	h := nodeHeap(slices.Clone(lists))
	heap.Init(&h)
	dummy := &ListNode{}
	tail := dummy
	for h.Len() > 0 {
		node := heap.Pop(&h).(*ListNode)
		tail.Next = node
		tail = node
		if node.Next != nil {
			heap.Push(&h, node.Next)
		}
	}
	return dummy.Next
}

func run(fn func([]*ListNode) *ListNode, in [][]int) (got string) {
	defer func() {
		if r := recover(); r != nil {
			got = "panic"
		}
	}()
	lists := make([]*ListNode, len(in))
	for i, l := range in {
		lists[i] = build(l)
	}
	return fmt.Sprint(toSlice(fn(lists)))
}

func main() {
	twenty := [][]int{}
	for i := 0; i < 20; i++ {
		twenty = append(twenty, []int{(i * 7) % 20})
	}
	cases := []struct {
		name string
		in   [][]int
	}{
		{"ví dụ của đề", [][]int{{1, 4, 5}, {1, 3, 4}, {2, 6}}},
		{"không có danh sách", [][]int{}},
		{"một danh sách rỗng", [][]int{{}}},
		{"rỗng xen kẽ", [][]int{{}, {1}, {}, {0, 2}}},
		{"một danh sách", [][]int{{1, 2, 3}}},
		{"số âm", [][]int{{-10, -5, 0}, {-3, 10}}},
		{"9 và 10", [][]int{{9}, {10}, {2}}},
		{"20 danh sách 1 phần tử", twenty},
		{"trùng hết", [][]int{{5, 5}, {5}, {5, 5, 5}}},
	}
	fns := []struct {
		name string
		fn   func([]*ListNode) *ListNode
	}{{"mergeHeap", mergeHeap}, {"mergeDivide", mergeDivide}, {"wrongNilInHeap", wrongNilInHeap}}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			want := []int{}
			for _, l := range c.in {
				want = append(want, l...)
			}
			sort.Ints(want)
			if got := run(f.fn, c.in); got != fmt.Sprint(want) {
				bad = append(bad, c.name+" → "+got)
			}
		}
		line := fmt.Sprintf("%-15s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			line += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(line)
	}

	fmt.Println("\nN = 1000000 nút, trung vị 5 lần (ms)")
	fmt.Println("k           heap   chia đôi")
	for _, k := range []int{10, 1000, 100000} {
		r := rand.New(rand.NewPCG(uint64(k), 1))
		per := 1000000 / k
		in := make([][]int, k)
		for i := range in {
			in[i] = make([]int, per)
			for j := range in[i] {
				in[i][j] = r.IntN(20001) - 10000
			}
			sort.Ints(in[i])
		}
		row := ""
		for _, fn := range []func([]*ListNode) *ListNode{mergeHeap, mergeDivide} {
			ts := []float64{}
			for rep := 0; rep < 5; rep++ {
				lists := make([]*ListNode, k)
				for i, l := range in {
					lists[i] = build(l)
				}
				t0 := time.Now()
				fn(lists)
				ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
			}
			sort.Float64s(ts)
			row += fmt.Sprintf(" %9.2f", ts[2])
		}
		fmt.Printf("%-8d%s\n", k, row)
	}
}
