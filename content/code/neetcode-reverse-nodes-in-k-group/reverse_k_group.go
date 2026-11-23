// LC 25 Reverse Nodes in k-Group: lặp với nút giả, đệ quy, và bản sai đảo cả khúc cuối.
// Chạy: go run reverse_k_group.go
package main

import (
	"fmt"
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

func toSlice(head *ListNode, limit int) []int {
	out := []int{}
	for ; head != nil; head = head.Next {
		if len(out) >= limit {
			return nil
		}
		out = append(out, head.Val)
	}
	return out
}

func expected(vals []int, k int) []int {
	out := []int{}
	for i := 0; i < len(vals); i += k {
		chunk := slices.Clone(vals[i:min(i+k, len(vals))])
		if len(chunk) == k {
			slices.Reverse(chunk)
		}
		out = append(out, chunk...)
	}
	return out
}

// Lặp: groupPrev đứng trước nhóm, kth là nút cuối nhóm.
func reverseKGroup(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy
	for {
		kth := groupPrev
		for i := 0; i < k && kth != nil; i++ {
			kth = kth.Next
		}
		if kth == nil {
			return dummy.Next
		}
		groupNext := kth.Next
		prev, cur := groupNext, groupPrev.Next
		for cur != groupNext {
			cur.Next, prev, cur = prev, cur, cur.Next
		}
		oldFirst := groupPrev.Next
		groupPrev.Next = kth
		groupPrev = oldFirst
	}
}

// Đệ quy: sâu n/k tầng. Stack của goroutine tự nới nên không tràn ở 10⁶ tầng.
func reverseKGroupRecursive(head *ListNode, k int) *ListNode {
	probe := head
	for i := 0; i < k; i++ {
		if probe == nil {
			return head
		}
		probe = probe.Next
	}
	prev, cur := reverseKGroupRecursive(probe, k), head
	for i := 0; i < k; i++ {
		cur.Next, prev, cur = prev, cur, cur.Next
	}
	return prev
}

// SAI: đảo cả khúc cuối thiếu k nút.
func wrongReverseTail(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy
	for groupPrev.Next != nil {
		kth := groupPrev
		for i := 0; i < k && kth.Next != nil; i++ {
			kth = kth.Next
		}
		groupNext := kth.Next
		prev, cur := groupNext, groupPrev.Next
		for cur != groupNext {
			cur.Next, prev, cur = prev, cur, cur.Next
		}
		oldFirst := groupPrev.Next
		groupPrev.Next = kth
		groupPrev = oldFirst
	}
	return dummy.Next
}

func main() {
	cases := []struct {
		name string
		vals []int
		k    int
	}{
		{"ví dụ 1 của đề", []int{1, 2, 3, 4, 5}, 2},
		{"ví dụ 2 của đề", []int{1, 2, 3, 4, 5}, 3},
		{"k = 1", []int{1, 2, 3}, 1},
		{"k = n", []int{1, 2, 3, 4}, 4},
		{"một nút", []int{7}, 1},
		{"hai nhóm đủ", []int{1, 2, 3, 4, 5, 6}, 3},
		{"7 nút, k = 3", []int{1, 2, 3, 4, 5, 6, 7}, 3},
		{"giá trị trùng", []int{5, 5, 6, 6, 7}, 2},
	}
	fns := []struct {
		name string
		fn   func(*ListNode, int) *ListNode
	}{{"reverseKGroup", reverseKGroup}, {"reverseKGroupRecursive", reverseKGroupRecursive}, {"wrongReverseTail", wrongReverseTail}}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			got := toSlice(f.fn(build(c.vals), c.k), 2*len(c.vals)+2)
			if fmt.Sprint(got) != fmt.Sprint(expected(c.vals, c.k)) {
				bad = append(bad, fmt.Sprintf("%s → %v", c.name, got))
			}
		}
		line := fmt.Sprintf("%-23s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			line += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(line)
	}

	fmt.Println("\nn = 1000000 nút, trung vị 5 lần (ms)")
	fmt.Println("k           lặp     đệ quy")
	vals := make([]int, 1000000)
	for i := range vals {
		vals[i] = i
	}
	for _, k := range []int{2, 1000} {
		row := ""
		for _, fn := range []func(*ListNode, int) *ListNode{reverseKGroup, reverseKGroupRecursive} {
			ts := []float64{}
			for r := 0; r < 5; r++ {
				head := build(vals)
				t0 := time.Now()
				fn(head, k)
				ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
			}
			sort.Float64s(ts)
			row += fmt.Sprintf(" %9.2f", ts[2])
		}
		fmt.Printf("%-8d%s\n", k, row)
	}
}
