// LeetCode 19: Remove Nth Node From End of List. Chạy: go run remove_nth.go
package main

import (
	"fmt"
	"slices"
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

// Hai lượt: đếm độ dài, rồi đi L − n bước từ nút giả.
func twoPass(head *ListNode, n int) *ListNode {
	length := 0
	for p := head; p != nil; p = p.Next {
		length++
	}
	dummy := &ListNode{0, head}
	prev := dummy
	for i := 0; i < length-n; i++ {
		prev = prev.Next
	}
	prev.Next = prev.Next.Next
	return dummy.Next
}

// Một lượt: fast đi trước n + 1 bước từ nút giả, rồi hai con trỏ cùng đi.
func onePass(head *ListNode, n int) *ListNode {
	dummy := &ListNode{0, head}
	fast, slow := dummy, dummy
	for i := 0; i <= n; i++ {
		fast = fast.Next
	}
	for fast != nil {
		fast, slow = fast.Next, slow.Next
	}
	slow.Next = slow.Next.Next
	return dummy.Next
}

// SAI: không có nút giả; n = L thì fast là nil và fast.Next là panic.
func wrongNoDummy(head *ListNode, n int) (res *ListNode, err string) {
	defer func() {
		if r := recover(); r != nil {
			err = "panic"
		}
	}()
	fast, slow := head, head
	for i := 0; i < n; i++ {
		fast = fast.Next
	}
	for fast.Next != nil {
		fast, slow = fast.Next, slow.Next
	}
	slow.Next = slow.Next.Next
	return head, ""
}

func main() {
	type tc struct {
		a []int
		n int
	}
	cases := []tc{{[]int{1, 2, 3, 4, 5}, 2}, {[]int{1}, 1}, {[]int{1, 2}, 1}, {[]int{1, 2}, 2}, {[]int{1, 2, 3}, 3},
		{[]int{1, 2, 3}, 1}, {[]int{5, 6, 7, 8}, 3}, {[]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 5}}
	expect := func(a []int, n int) []int {
		out := []int{}
		for i, v := range a {
			if i != len(a)-n {
				out = append(out, v)
			}
		}
		return out
	}
	fns := []struct {
		name string
		fn   func(*ListNode, int) (*ListNode, string)
	}{
		{"twoPass", func(h *ListNode, n int) (*ListNode, string) { return twoPass(h, n), "" }},
		{"onePass", func(h *ListNode, n int) (*ListNode, string) { return onePass(h, n), "" }},
		{"wrongNoDummy", wrongNoDummy},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			got, err := f.fn(fromSlice(c.a), c.n)
			if err != "" {
				bad = append(bad, fmt.Sprintf("%v n=%d → %s", c.a, c.n, err))
			} else if !slices.Equal(toSlice(got), expect(c.a, c.n)) {
				bad = append(bad, fmt.Sprintf("%v n=%d → %v", c.a, c.n, toSlice(got)))
			}
		}
		suffix := ""
		if len(bad) > 0 {
			suffix = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-13s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), suffix)
	}

	const L = 1_000_000
	values := make([]int, L)
	for i := range values {
		values[i] = i
	}
	bench := func(fn func(*ListNode, int) *ListNode, n int) float64 {
		ts := []float64{}
		for k := 0; k < 5; k++ {
			h := fromSlice(values)
			s := time.Now()
			fn(h, n)
			ts = append(ts, float64(time.Since(s).Microseconds())/1000)
		}
		slices.Sort(ts)
		return ts[2]
	}
	fmt.Printf("\nthời gian, L = %d:\n", L)
	fmt.Println("n          hai lượt   một lượt")
	for _, n := range []int{1, L / 2, L} {
		fmt.Printf("%-10d %6.2f ms %7.2f ms\n", n, bench(twoPass, n), bench(onePass, n))
	}
}
