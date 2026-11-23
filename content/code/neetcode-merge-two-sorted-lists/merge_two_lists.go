// LeetCode 21: Merge Two Sorted Lists. Chạy: go run merge_two_lists.go
package main

import (
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

func fromSlice(a []int) *ListNode {
	var head *ListNode
	for i := len(a) - 1; i >= 0; i-- {
		head = &ListNode{a[i], head}
	}
	return head
}

func toSlice(h *ListNode) []int {
	out := []int{}
	for ; h != nil; h = h.Next {
		out = append(out, h.Val)
	}
	return out
}

// Nút giả là một giá trị trên stack, tail là con trỏ tới nó.
func mergeDummy(a, b *ListNode) *ListNode {
	dummy := ListNode{}
	tail := &dummy
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

// Đệ quy: stack của goroutine tự nới, nên Go không vấp giới hạn độ sâu như JS hay Python.
func mergeRecursive(a, b *ListNode) *ListNode {
	if a == nil {
		return b
	}
	if b == nil {
		return a
	}
	if a.Val <= b.Val {
		a.Next = mergeRecursive(a.Next, b)
		return a
	}
	b.Next = mergeRecursive(a, b.Next)
	return b
}

// SAI: khai báo dummy là con trỏ nil thay vì giá trị; ghi tail.Next là panic.
func wrongNilDummy(a, b *ListNode) (res *ListNode, err string) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Sprint(r)
		}
	}()
	var dummy *ListNode
	tail := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val {
			tail.Next, a = a, a.Next
		} else {
			tail.Next, b = b, b.Next
		}
		tail = tail.Next
	}
	return dummy, ""
}

var cases = [][2][]int{
	{{1, 2, 4}, {1, 3, 4}},
	{{}, {}},
	{{}, {0}},
	{{5}, {1, 2, 3}},
	{{1, 2, 3}, {}},
	{{-100, 0, 100}, {-100, -50}},
	{{2, 2, 2}, {2, 2}},
	{{1, 5, 9}, {2, 3, 4, 6, 7, 8, 10}},
}

func expect(a, b []int) []int {
	out := append(append([]int{}, a...), b...)
	sort.Ints(out)
	return out
}

func main() {
	for _, f := range []struct {
		name string
		fn   func(a, b *ListNode) *ListNode
	}{{"mergeDummy", mergeDummy}, {"mergeRecursive", mergeRecursive}} {
		bad := []string{}
		for _, c := range cases {
			if !slices.Equal(toSlice(f.fn(fromSlice(c[0]), fromSlice(c[1]))), expect(c[0], c[1])) {
				bad = append(bad, fmt.Sprint(c[0], "+", c[1]))
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), map[bool]string{true: "; sai ở " + strings.Join(bad, ", "), false: ""}[len(bad) > 0])
	}
	_, err := wrongNilDummy(fromSlice([]int{1, 2}), fromSlice([]int{3}))
	fmt.Println("wrongNilDummy   ", err)

	// Đệ quy 10⁶ nút: chạy được, đo cùng cách lặp.
	r := rand.New(rand.NewPCG(21, 0))
	fmt.Println("\nm = n      dummy      đệ quy")
	for _, n := range []int{10_000, 100_000, 1_000_000} {
		a, b := make([]int, n), make([]int, n)
		for i := range a {
			a[i], b[i] = r.IntN(2*n), r.IntN(2*n)
		}
		slices.Sort(a)
		slices.Sort(b)
		bench := func(fn func(a, b *ListNode) *ListNode) float64 {
			ts := []float64{}
			for k := 0; k < 5; k++ {
				x, y := fromSlice(a), fromSlice(b)
				s := time.Now()
				fn(x, y)
				ts = append(ts, float64(time.Since(s).Microseconds())/1000)
			}
			slices.Sort(ts)
			return ts[2]
		}
		fmt.Printf("%-9d%8.2f ms %8.2f ms\n", n, bench(mergeDummy), bench(mergeRecursive))
	}
}
