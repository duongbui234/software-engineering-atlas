// Ga LINK-01: con trỏ trên danh sách liên kết. Giải 206, 21, 141, 143, 19.
// Chạy: go run linked_list_station.go
package main

import (
	"fmt"
	"reflect"
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

func toSlice(head *ListNode) []int {
	out := []int{}
	for p := head; p != nil; p = p.Next {
		out = append(out, p.Val)
	}
	return out
}

func withCycle(a []int, pos int) *ListNode {
	head := fromSlice(a)
	if pos < 0 || head == nil {
		return head
	}
	var target, tail *ListNode
	i := 0
	for p := head; p != nil; p = p.Next {
		if i == pos {
			target = p
		}
		tail = p
		i++
	}
	tail.Next = target
	return head
}

// 206: lật từng con trỏ.
func reverseList(head *ListNode) *ListNode {
	var prev *ListNode
	for cur := head; cur != nil; {
		next := cur.Next
		cur.Next = prev
		prev, cur = cur, next
	}
	return prev
}

// 21: nút giả là một giá trị ListNode trên stack; chỉ dùng con trỏ tới nó.
func mergeTwoLists(a, b *ListNode) *ListNode {
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

// 141: so hai con trỏ bằng ==, tức cùng địa chỉ.
func hasCycle(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}

// 143: tìm giữa, lật nửa sau, đan hai nửa.
func reorderList(head *ListNode) {
	if head == nil || head.Next == nil {
		return
	}
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	second := reverseList(slow.Next)
	slow.Next = nil
	for first := head; second != nil; {
		n1, n2 := first.Next, second.Next
		first.Next, second.Next = second, n1
		first, second = n1, n2
	}
}

// 19: nút giả, con trước đi trước n + 1 bước.
func removeNthFromEnd(head *ListNode, n int) *ListNode {
	dummy := &ListNode{0, head}
	lead, lag := dummy, dummy
	for i := 0; i <= n; i++ {
		lead = lead.Next
	}
	for lead != nil {
		lead, lag = lead.Next, lag.Next
	}
	lag.Next = lag.Next.Next
	return dummy.Next
}

func reordered(a []int) []int {
	h := fromSlice(a)
	reorderList(h)
	return toSlice(h)
}

func main() {
	type tc struct {
		name string
		got  any
		want any
	}
	cases := []tc{
		{"206 ví dụ", toSlice(reverseList(fromSlice([]int{1, 2, 3, 4, 5}))), []int{5, 4, 3, 2, 1}},
		{"206 rỗng", toSlice(reverseList(nil)), []int{}},
		{"21 ví dụ", toSlice(mergeTwoLists(fromSlice([]int{1, 2, 4}), fromSlice([]int{1, 3, 4}))), []int{1, 1, 2, 3, 4, 4}},
		{"21 hai rỗng", toSlice(mergeTwoLists(nil, nil)), []int{}},
		{"21 một rỗng", toSlice(mergeTwoLists(nil, fromSlice([]int{0}))), []int{0}},
		{"141 vòng về nút 1", hasCycle(withCycle([]int{3, 2, 0, -4}, 1)), true},
		{"141 vòng về nút 0", hasCycle(withCycle([]int{1, 2}, 0)), true},
		{"141 không vòng", hasCycle(withCycle([]int{1}, -1)), false},
		{"143 chẵn", reordered([]int{1, 2, 3, 4}), []int{1, 4, 2, 3}},
		{"143 lẻ", reordered([]int{1, 2, 3, 4, 5}), []int{1, 5, 2, 4, 3}},
		{"143 một nút", reordered([]int{1}), []int{1}},
		{"19 ví dụ", toSlice(removeNthFromEnd(fromSlice([]int{1, 2, 3, 4, 5}), 2)), []int{1, 2, 3, 5}},
		{"19 xóa nút duy nhất", toSlice(removeNthFromEnd(fromSlice([]int{1}), 1)), []int{}},
		{"19 xóa nút đầu", toSlice(removeNthFromEnd(fromSlice([]int{1, 2}), 2)), []int{2}},
	}
	bad := []string{}
	for _, c := range cases {
		if !reflect.DeepEqual(c.got, c.want) {
			bad = append(bad, c.name)
		}
	}
	fmt.Printf("linked_list_station %d/%d ca đúng", len(cases)-len(bad), len(cases))
	if len(bad) > 0 {
		fmt.Printf("; sai ở %v", bad)
	}
	fmt.Println()
}
