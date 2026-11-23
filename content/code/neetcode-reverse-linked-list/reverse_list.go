// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: go run reverse_list.go
package main

import (
	"fmt"
	"slices"
	"sort"
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

func toSlice(head *ListNode, limit int) ([]int, bool) {
	out := []int{}
	for p := head; p != nil; p = p.Next {
		if len(out) == limit {
			return out, false
		}
		out = append(out, p.Val)
	}
	return out, true
}

// Lặp: giữ next trước khi lật cur.Next.
func reverseIterative(head *ListNode) *ListNode {
	var prev *ListNode
	cur := head
	for cur != nil {
		next := cur.Next
		cur.Next = prev
		prev, cur = cur, next
	}
	return prev
}

// Đệ quy: stack của goroutine tự nới, nên 10⁶ tầng vẫn chạy.
func reverseRecursive(head *ListNode) *ListNode {
	if head == nil || head.Next == nil {
		return head
	}
	newHead := reverseRecursive(head.Next)
	head.Next.Next = head
	head.Next = nil
	return newHead
}

// SAI: bỏ kiểm tra head == nil; danh sách rỗng làm đọc head.Next trên con trỏ nil.
func wrongNoNilCheck(head *ListNode) (res *ListNode, err any) {
	defer func() { err = recover() }()
	if head.Next == nil {
		return head, nil
	}
	newHead, _ := wrongNoNilCheck(head.Next)
	head.Next.Next = head
	head.Next = nil
	return newHead, nil
}

func main() {
	big := make([]int, 5000)
	for i := range big {
		big[i] = i
	}
	cases := [][]int{{1, 2, 3, 4, 5}, {1, 2}, {}, {1}, {3, 3, 1}, big}
	names := []string{"ví dụ 1", "ví dụ 2", "rỗng", "một nút", "trùng giá trị", "5000 nút (giới hạn đề)"}
	for _, f := range []struct {
		name string
		fn   func(*ListNode) *ListNode
	}{{"reverseIterative", reverseIterative}, {"reverseRecursive", reverseRecursive}} {
		okCount := 0
		for _, c := range cases {
			got, _ := toSlice(f.fn(fromSlice(c)), len(c)+1)
			want := slices.Clone(c)
			slices.Reverse(want)
			if slices.Equal(got, want) {
				okCount++
			}
		}
		fmt.Printf("%-17s %d/%d ca đúng\n", f.name, okCount, len(cases))
	}
	bad := []string{}
	for k, c := range cases {
		res, err := wrongNoNilCheck(fromSlice(c))
		got, _ := toSlice(res, len(c)+1)
		want := slices.Clone(c)
		slices.Reverse(want)
		if err != nil {
			bad = append(bad, fmt.Sprintf("%s → panic: %v", names[k], err))
		} else if !slices.Equal(got, want) {
			bad = append(bad, names[k])
		}
	}
	fmt.Printf("%-17s %d/%d ca đúng; sai ở %v\n", "wrongNoNilCheck", len(cases)-len(bad), len(cases), bad)

	for _, n := range []int{100000, 1000000} {
		a := make([]int, n)
		ts := map[string][]float64{}
		for r := 0; r < 5; r++ {
			for _, f := range []struct {
				name string
				fn   func(*ListNode) *ListNode
			}{{"lặp", reverseIterative}, {"đệ quy", reverseRecursive}} {
				h := fromSlice(a)
				t0 := time.Now()
				f.fn(h)
				ts[f.name] = append(ts[f.name], float64(time.Since(t0).Microseconds())/1000)
			}
		}
		for _, k := range []string{"lặp", "đệ quy"} {
			sort.Float64s(ts[k])
		}
		fmt.Printf("n = %d: lặp %.2f ms, đệ quy %.2f ms\n", n, ts["lặp"][2], ts["đệ quy"][2])
	}
}
