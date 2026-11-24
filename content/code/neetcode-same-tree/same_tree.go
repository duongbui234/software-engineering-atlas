// LC 100 Same Tree: đệ quy song song, ngăn xếp cặp nút, hàng đợi cặp nút, tuần tự hóa có đánh dấu nil.
// Chạy: go run same_tree.go
package main

import (
	"fmt"
	"runtime/debug"
	"slices"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

// none đánh dấu chỗ trống trong mảng theo tầng (giá trị nằm ngoài [-10⁴, 10⁴]).
const none = 1 << 30

// build dựng cây từ mảng theo tầng kiểu LeetCode.
func build(level []int) *TreeNode {
	if len(level) == 0 || level[0] == none {
		return nil
	}
	root := &TreeNode{Val: level[0]}
	queue := []*TreeNode{root}
	for i := 1; i < len(level); {
		node := queue[0]
		queue = queue[1:]
		if level[i] != none {
			node.Left = &TreeNode{Val: level[i]}
			queue = append(queue, node.Left)
		}
		i++
		if i < len(level) && level[i] != none {
			node.Right = &TreeNode{Val: level[i]}
			queue = append(queue, node.Right)
		}
		i++
	}
	return root
}

// chain dựng cây lệch n nút (trái hoặc phải) bằng vòng lặp.
func chain(n int, left bool) *TreeNode {
	var root *TreeNode
	for i := 0; i < n; i++ {
		t := &TreeNode{Val: 1}
		if left {
			t.Left = root
		} else {
			t.Right = root
		}
		root = t
	}
	return root
}

// Cách 1: đệ quy song song. O(n) thời gian, O(h) ngăn xếp gọi hàm.
func isSameRecursive(p, q *TreeNode) bool {
	if p == nil || q == nil {
		return p == q // chỉ đúng khi cả hai cùng nil
	}
	return p.Val == q.Val && isSameRecursive(p.Left, q.Left) && isSameRecursive(p.Right, q.Right)
}

type pair struct{ a, b *TreeNode }

// Cách 2: ngăn xếp các cặp nút (DFS).
func isSameStack(p, q *TreeNode) bool {
	stack := []pair{{p, q}}
	for len(stack) > 0 {
		c := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if c.a == nil && c.b == nil {
			continue
		}
		if c.a == nil || c.b == nil || c.a.Val != c.b.Val {
			return false
		}
		stack = append(stack, pair{c.a.Right, c.b.Right}, pair{c.a.Left, c.b.Left})
	}
	return true
}

// Cách 3: hàng đợi các cặp nút (BFS).
func isSameQueue(p, q *TreeNode) bool {
	queue := []pair{{p, q}}
	for head := 0; head < len(queue); head++ {
		c := queue[head]
		if c.a == nil && c.b == nil {
			continue
		}
		if c.a == nil || c.b == nil || c.a.Val != c.b.Val {
			return false
		}
		queue = append(queue, pair{c.a.Left, c.b.Left}, pair{c.a.Right, c.b.Right})
	}
	return true
}

// serialize: preorder, nil ghi thành none. Vòng lặp.
func serialize(root *TreeNode) []int {
	out := []int{}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if n == nil {
			out = append(out, none)
			continue
		}
		out = append(out, n.Val)
		stack = append(stack, n.Right, n.Left)
	}
	return out
}

// Cách 4: tuần tự hóa có đánh dấu nil rồi so hai slice.
func isSameSerialize(p, q *TreeNode) bool { return slices.Equal(serialize(p), serialize(q)) }

// SAI: so giá trị trước khi kiểm nil. Đúng một bên nil thì đọc nil.Val: panic.
func wrongValBeforeNil(p, q *TreeNode) bool {
	if p == nil && q == nil {
		return true
	}
	return p.Val == q.Val && wrongValBeforeNil(p.Left, q.Left) && wrongValBeforeNil(p.Right, q.Right)
}

type testCase struct {
	name string
	p, q *TreeNode
	want bool
}

var cases = []testCase{
	{"giống hệt", build([]int{1, 2, 3}), build([]int{1, 2, 3}), true},
	{"con trái và con phải", build([]int{1, 2}), build([]int{1, none, 2}), false},
	{"đổi chỗ giá trị", build([]int{1, 2, 1}), build([]int{1, 1, 2}), false},
	{"hai cây rỗng", build(nil), build(nil), true},
	{"một bên rỗng", build(nil), build([]int{1}), false},
	{"một nút", build([]int{5}), build([]int{5}), true},
	{"giá trị lớn hơn 127", build([]int{1000, 2000}), build([]int{1000, 2000}), true},
	{"số âm", build([]int{-10000, none, 7}), build([]int{-10000, none, 7}), true},
	{"cây đầy 7 nút", build([]int{1, 2, 3, 4, 5, 6, 7}), build([]int{1, 2, 3, 4, 5, 6, 7}), true},
	{"khác lá cuối", build([]int{1, 2, 3, 4, 5, 6, 7}), build([]int{1, 2, 3, 4, 5, 6, 8}), false},
	{"lệch trái và lệch phải", chain(50, true), chain(50, false), false},
	{"lệch trái 100 nút", chain(100, true), chain(100, true), true},
}

// call chạy fn và đổi panic thành chuỗi "panic".
func call(fn func(p, q *TreeNode) bool, p, q *TreeNode) (got string) {
	defer func() {
		if r := recover(); r != nil {
			got = "panic"
		}
	}()
	return fmt.Sprint(fn(p, q))
}

func main() {
	fns := []struct {
		name string
		fn   func(p, q *TreeNode) bool
	}{
		{"isSameRecursive", isSameRecursive}, {"isSameStack", isSameStack}, {"isSameQueue", isSameQueue},
		{"isSameSerialize", isSameSerialize}, {"wrongValBeforeNil", wrongValBeforeNil},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			if got := call(f.fn, c.p, c.q); got != fmt.Sprint(c.want) {
				bad = append(bad, c.name+" → "+got)
			}
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-18s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), tail)
	}

	// Ngăn xếp của goroutine tự lớn tới giới hạn 1 GB (debug.SetMaxStack), nên đệ quy sâu 10⁶ vẫn chạy.
	fmt.Println()
	for _, d := range []int{1_000_000, 10_000_000} {
		p, q := chain(d, true), chain(d, true)
		t0 := time.Now()
		ok := isSameRecursive(p, q)
		fmt.Printf("cây lệch %d nút, đệ quy: %v, %.1f ms\n", d, ok, float64(time.Since(t0).Microseconds())/1000)
	}
	prev := debug.SetMaxStack(1 << 30)
	fmt.Printf("giới hạn ngăn xếp mặc định: %d byte\n", prev)

	// Đo: hai cây giống hệt 10⁶ nút (cây tìm kiếm nhị phân từ khóa ngẫu nhiên mulberry32), trung vị 5 lần.
	rnd := mulberry32(7)
	keys := make([]int, 1_000_000)
	for i := range keys {
		keys[i] = int(rnd() * (1 << 31))
	}
	p, q := bst(keys), bst(keys)
	fmt.Println("\nhai cây giống hệt 10⁶ nút, trung vị 5 lần (ms)")
	for _, f := range fns[:4] {
		ts := []float64{}
		for r := 0; r < 5; r++ {
			t0 := time.Now()
			f.fn(p, q)
			ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
		}
		sort.Float64s(ts)
		fmt.Printf("%-16s %8.2f\n", f.name, ts[2])
	}
}

func bst(keys []int) *TreeNode {
	var root *TreeNode
	for _, k := range keys {
		t := &TreeNode{Val: k}
		if root == nil {
			root = t
			continue
		}
		cur := root
		for {
			if k < cur.Val {
				if cur.Left == nil {
					cur.Left = t
					break
				}
				cur = cur.Left
			} else {
				if cur.Right == nil {
					cur.Right = t
					break
				}
				cur = cur.Right
			}
		}
	}
	return root
}

// mulberry32: trạng thái uint32, phép nhân tràn số theo modulo 2³² đúng như Math.imul.
func mulberry32(seed uint32) func() float64 {
	a := seed
	return func() float64 {
		a += 0x6D2B79F5
		t := (a ^ (a >> 15)) * (1 | a)
		t = (t + (t^(t>>7))*(61|t)) ^ t
		return float64(t^(t>>14)) / 4294967296
	}
}
