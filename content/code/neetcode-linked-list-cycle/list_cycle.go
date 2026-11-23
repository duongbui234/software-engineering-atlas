// LC 141 Linked List Cycle: map các con trỏ đã thăm, rùa và thỏ (Floyd), tìm đầu vòng (LC 142), và bản quên kiểm fast.Next.
// Chạy: go run list_cycle.go
package main

import (
	"fmt"
	"runtime"
	"sort"
	"strings"
	"time"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

func build(vals []int, pos int) (*ListNode, []*ListNode) {
	nodes := make([]*ListNode, len(vals))
	for i, v := range vals {
		nodes[i] = &ListNode{Val: v}
	}
	for i := 0; i+1 < len(nodes); i++ {
		nodes[i].Next = nodes[i+1]
	}
	if pos >= 0 && len(nodes) > 0 {
		nodes[len(nodes)-1].Next = nodes[pos]
	}
	if len(nodes) == 0 {
		return nil, nodes
	}
	return nodes[0], nodes
}

// Cách 1: map khóa là con trỏ *ListNode, tức là địa chỉ nút, không phải giá trị.
func hasCycleSet(head *ListNode) bool {
	seen := map[*ListNode]bool{}
	for cur := head; cur != nil; cur = cur.Next {
		if seen[cur] {
			return true
		}
		seen[cur] = true
	}
	return false
}

// Cách 2: rùa và thỏ. Kiểm cả fast và fast.Next trước khi nhảy hai bước.
func hasCycleFloyd(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}

// LC 142: gặp nhau xong, đưa một con về đầu; cùng đi 1 bước, chỗ gặp lại là đầu vòng.
func detectCycle(head *ListNode) *ListNode {
	slow, fast := head, head
	for fast != nil && fast.Next != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			a := head
			for a != slow {
				a = a.Next
				slow = slow.Next
			}
			return a
		}
	}
	return nil
}

// SAI: quên kiểm fast.Next. Danh sách không vòng có số nút lẻ thì fast.Next là nil, fast.Next.Next làm panic.
func wrongNoNextCheck(head *ListNode) bool {
	slow, fast := head, head
	for fast != nil {
		slow = slow.Next
		fast = fast.Next.Next
		if slow == fast {
			return true
		}
	}
	return false
}

type tcase struct {
	name string
	vals []int
	pos  int
	want bool
}

var cases = []tcase{
	{"ví dụ 1 của đề", []int{3, 2, 0, -4}, 1, true},
	{"ví dụ 2 của đề", []int{1, 2}, 0, true},
	{"ví dụ 3 của đề", []int{1}, -1, false},
	{"rỗng", []int{}, -1, false},
	{"một nút tự trỏ", []int{1}, 0, true},
	{"giá trị trùng, không vòng", []int{1, 1, 1}, -1, false},
	{"chẵn, không vòng", []int{1, 2, 3, 4, 5, 6}, -1, false},
	{"lẻ, không vòng", []int{1, 2, 3, 4, 5}, -1, false},
	{"nút cuối tự trỏ", []int{1, 2, 3, 4, 5}, 4, true},
	{"toàn số 0, có vòng", []int{0, 0, 0, 0, 0}, 1, true},
}

func run(fn func(*ListNode) bool, head *ListNode) (got string) {
	defer func() {
		if r := recover(); r != nil {
			got = "panic"
		}
	}()
	return fmt.Sprint(fn(head))
}

func check(name string, fn func(*ListNode) bool) {
	bad := []string{}
	for _, c := range cases {
		head, _ := build(c.vals, c.pos)
		if got := run(fn, head); got != fmt.Sprint(c.want) {
			bad = append(bad, c.name+" → "+got)
		}
	}
	msg := fmt.Sprintf("%-17s %d/%d ca đúng", name, len(cases)-len(bad), len(cases))
	if len(bad) > 0 {
		msg += "; sai ở " + strings.Join(bad, ", ")
	}
	fmt.Println(msg)
}

func medianMs(fn func(), reps int) float64 {
	ts := make([]float64, reps)
	for i := range ts {
		t0 := time.Now()
		fn()
		ts[i] = float64(time.Since(t0).Microseconds()) / 1000
	}
	sort.Float64s(ts)
	return ts[reps/2]
}

func main() {
	check("hasCycleSet", hasCycleSet)
	check("hasCycleFloyd", hasCycleFloyd)
	check("wrongNoNextCheck", wrongNoNextCheck)
	ok := 0
	for _, c := range cases {
		head, nodes := build(c.vals, c.pos)
		var want *ListNode
		if c.pos >= 0 {
			want = nodes[c.pos]
		}
		if detectCycle(head) == want {
			ok++
		}
	}
	fmt.Printf("%-17s %d/%d ca đúng (LC 142)\n", "detectCycle", ok, len(cases))

	fmt.Println("\nn nút      dạng            map          Floyd        bộ nhớ map")
	for _, n := range []int{100000, 1000000} {
		for _, d := range []struct {
			label string
			pos   int
		}{{"không vòng", -1}, {"vòng ở giữa", n / 2}} {
			head, _ := build(make([]int, n), d.pos)
			tSet := medianMs(func() { hasCycleSet(head) }, 5)
			tFloyd := medianMs(func() { hasCycleFloyd(head) }, 5)
			var m0, m1 runtime.MemStats
			runtime.GC()
			runtime.ReadMemStats(&m0)
			hasCycleSet(head)
			runtime.ReadMemStats(&m1)
			mb := float64(m1.TotalAlloc-m0.TotalAlloc) / 1e6
			fmt.Printf("%-10d %-15s %8.2f ms  %8.2f ms  %8.1f MB cấp phát\n", n, d.label, tSet, tFloyd, mb)
		}
	}
}
