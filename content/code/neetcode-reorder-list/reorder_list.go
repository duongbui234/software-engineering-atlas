// LC 143 Reorder List: ba bước, slice các nút, và bản quên cắt nửa đầu.
// Chạy: go run reorder_list.go
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

func build(vals []int) *ListNode {
	var head *ListNode
	for i := len(vals) - 1; i >= 0; i-- {
		head = &ListNode{vals[i], head}
	}
	return head
}

func toSlice(head *ListNode, limit int) ([]int, bool) {
	out := []int{}
	for cur := head; cur != nil; cur = cur.Next {
		if len(out) >= limit {
			return out, false
		}
		out = append(out, cur.Val)
	}
	return out, true
}

func expected(vals []int) []int {
	out := []int{}
	for i, j := 0, len(vals)-1; i <= j; i, j = i+1, j-1 {
		out = append(out, vals[i])
		if i != j {
			out = append(out, vals[j])
		}
	}
	return out
}

func reverse(head *ListNode) *ListNode {
	var prev *ListNode
	for cur := head; cur != nil; {
		nxt := cur.Next
		cur.Next = prev
		prev, cur = cur, nxt
	}
	return prev
}

// Cách 1: tìm giữa, cắt, đảo nửa sau, đan xen.
func reorderThreeSteps(head *ListNode) {
	if head == nil || head.Next == nil {
		return
	}
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	second := reverse(slow.Next)
	slow.Next = nil
	for first := head; second != nil; {
		n1, n2 := first.Next, second.Next
		first.Next, second.Next = second, n1
		first, second = n1, n2
	}
}

// Cách 2: slice các con trỏ nút, nối lại bằng hai chỉ số.
func reorderSlice(head *ListNode) {
	nodes := []*ListNode{}
	for cur := head; cur != nil; cur = cur.Next {
		nodes = append(nodes, cur)
	}
	i, j := 0, len(nodes)-1
	for i < j {
		nodes[i].Next = nodes[j]
		i++
		if i == j {
			break
		}
		nodes[j].Next = nodes[i]
		j--
	}
	if len(nodes) > 0 {
		nodes[i].Next = nil
	}
}

// SAI: quên slow.Next = nil, danh sách kết quả có vòng.
func wrongNoCut(head *ListNode) {
	if head == nil || head.Next == nil {
		return
	}
	slow, fast := head, head
	for fast.Next != nil && fast.Next.Next != nil {
		slow, fast = slow.Next, fast.Next.Next
	}
	second := reverse(slow.Next)
	for first := head; second != nil; {
		n1, n2 := first.Next, second.Next
		first.Next, second.Next = second, n1
		first, second = n1, n2
	}
}

func main() {
	cases := [][]int{{1, 2, 3, 4}, {1, 2, 3, 4, 5}, {1}, {1, 2}, {1, 2, 3}, {}, {10, 20, 30, 40, 50, 60}, {7, 7, 7, 8, 8}}
	fns := []struct {
		name string
		fn   func(*ListNode)
	}{{"reorderThreeSteps", reorderThreeSteps}, {"reorderSlice", reorderSlice}, {"wrongNoCut", wrongNoCut}}
	for _, f := range fns {
		bad := []string{}
		for _, vals := range cases {
			head := build(vals)
			f.fn(head)
			got, ok := toSlice(head, 2*len(vals)+2)
			want := expected(vals)
			if !ok {
				bad = append(bad, fmt.Sprint(vals)+" → vòng")
			} else if fmt.Sprint(got) != fmt.Sprint(want) {
				bad = append(bad, fmt.Sprint(vals)+" → "+fmt.Sprint(got))
			}
		}
		msg := fmt.Sprintf("%-17s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			msg += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(msg)
	}

	fmt.Println("\nn nút      ba bước                slice các nút")
	for _, n := range []int{100000, 1000000} {
		row := fmt.Sprintf("%-10d", n)
		for _, fn := range []func(*ListNode){reorderThreeSteps, reorderSlice} {
			ts := []float64{}
			var alloc uint64
			for r := 0; r < 5; r++ {
				vals := make([]int, n)
				for i := range vals {
					vals[i] = i
				}
				head := build(vals)
				var m0, m1 runtime.MemStats
				runtime.GC()
				runtime.ReadMemStats(&m0)
				t0 := time.Now()
				fn(head)
				ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
				runtime.ReadMemStats(&m1)
				alloc = m1.TotalAlloc - m0.TotalAlloc
			}
			sort.Float64s(ts)
			row += fmt.Sprintf(" %8.2f ms %6.1f MB  ", ts[2], float64(alloc)/1e6)
		}
		fmt.Println(row)
	}
}
