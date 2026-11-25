// LeetCode 1448 Count Good Nodes in Binary Tree.
// Một nút là "tốt" nếu trên đường từ gốc xuống nó không có nút nào lớn hơn nó.
// Các cách: vét cạn leo ngược về gốc, DFS mang max đường đi xuống (đệ quy và lặp), BFS mang max, và các bản sai hay gặp.
// Chạy: go run good_nodes.go
package main

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = math.MinInt // đánh dấu chỗ trống trong mảng theo tầng

// build dựng cây từ mảng theo tầng kiểu LeetCode.
func build(arr []int) *TreeNode {
	if len(arr) == 0 || arr[0] == null {
		return nil
	}
	root := &TreeNode{Val: arr[0]}
	queue := []*TreeNode{root}
	head, i := 0, 1
	for i < len(arr) {
		node := queue[head]
		head++
		if i < len(arr) && arr[i] != null {
			node.Left = &TreeNode{Val: arr[i]}
			queue = append(queue, node.Left)
		}
		i++
		if i < len(arr) && arr[i] != null {
			node.Right = &TreeNode{Val: arr[i]}
			queue = append(queue, node.Right)
		}
		i++
	}
	return root
}

// chain dựng chuỗi n nút, mọi nút chỉ có con một phía.
func chain(n int, valueAt func(int) int, right bool) *TreeNode {
	root := &TreeNode{Val: valueAt(0)}
	cur := root
	for i := 1; i < n; i++ {
		next := &TreeNode{Val: valueAt(i)}
		if right {
			cur.Right = next
		} else {
			cur.Left = next
		}
		cur = next
	}
	return root
}

// ---------- Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). ----------
var compares int

func goodBrute(root *TreeNode) int {
	if root == nil {
		return 0
	}
	parent := map[*TreeNode]*TreeNode{root: nil}
	order := []*TreeNode{root}
	for i := 0; i < len(order); i++ {
		for _, child := range []*TreeNode{order[i].Left, order[i].Right} {
			if child != nil {
				parent[child] = order[i]
				order = append(order, child)
			}
		}
	}
	good := 0
	for _, node := range order {
		ok := true
		for a := parent[node]; a != nil; a = parent[a] {
			compares++
			if a.Val > node.Val {
				ok = false
				break
			}
		}
		if ok {
			good++
		}
	}
	return good
}

// ---------- Cách 2: DFS tiền thứ tự, mang max xuống. O(n), O(h). ----------
func goodDfs(root *TreeNode) int {
	var walk func(node *TreeNode, maxSoFar int) int
	walk = func(node *TreeNode, maxSoFar int) int {
		if node == nil {
			return 0
		}
		good := 0
		if node.Val >= maxSoFar { // bằng max vẫn là tốt
			good = 1
		}
		m := max(maxSoFar, node.Val)
		return good + walk(node.Left, m) + walk(node.Right, m)
	}
	return walk(root, math.MinInt) // MinInt (64 bit) nhỏ hơn mọi giá trị đề cho
}

type item struct {
	node     *TreeNode
	maxSoFar int
}

// ---------- Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max). ----------
func goodIterative(root *TreeNode) int {
	if root == nil {
		return 0
	}
	good := 0
	stack := []item{{root, root.Val}}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.node.Val >= it.maxSoFar {
			good++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, m})
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, m})
		}
	}
	return good
}

// ---------- Cách 4: BFS theo tầng. queue = queue[1:] chỉ dời đầu lát cắt, O(1). ----------
func goodBfs(root *TreeNode) int {
	if root == nil {
		return 0
	}
	good := 0
	queue := []item{{root, root.Val}}
	for len(queue) > 0 {
		it := queue[0]
		queue = queue[1:]
		if it.node.Val >= it.maxSoFar {
			good++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Left != nil {
			queue = append(queue, item{it.node.Left, m})
		}
		if it.node.Right != nil {
			queue = append(queue, item{it.node.Right, m})
		}
	}
	return good
}

// ---------- Các bản sai ----------
// Sai 1: so ngặt. Nút bằng max của đường đi cũng là nút tốt.
func wrongStrict(root *TreeNode) int {
	if root == nil {
		return 0
	}
	good := 1 // gốc luôn tốt
	stack := []item{}
	if root.Right != nil {
		stack = append(stack, item{root.Right, root.Val})
	}
	if root.Left != nil {
		stack = append(stack, item{root.Left, root.Val})
	}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.node.Val > it.maxSoFar { // sai: phải là >=
			good++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, m})
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, m})
		}
	}
	return good
}

// Sai 2: khởi tạo max bằng 0. Giá trị có thể âm.
func wrongInitZero(root *TreeNode) int {
	if root == nil {
		return 0
	}
	good := 0
	stack := []item{{root, 0}}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.node.Val >= it.maxSoFar {
			good++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, m})
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, m})
		}
	}
	return good
}

// Sai 3: một biến max dùng chung cho cả cây. Max của nhánh trái rò sang nhánh phải.
func wrongSharedMax(root *TreeNode) int {
	if root == nil {
		return 0
	}
	mx, good := math.MinInt, 0
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if node.Val >= mx {
			good++
			mx = node.Val
		}
		if node.Right != nil {
			stack = append(stack, node.Right)
		}
		if node.Left != nil {
			stack = append(stack, node.Left)
		}
	}
	return good
}

// Sai 4: truyền biến đếm theo giá trị. Mỗi lời gọi tăng bản sao của riêng nó; gốc chỉ thấy phần của gốc.
func wrongCountByValue(root *TreeNode) int {
	var walk func(node *TreeNode, maxSoFar int, count int)
	result := 0
	walk = func(node *TreeNode, maxSoFar int, count int) {
		if node == nil {
			return
		}
		if node.Val >= maxSoFar {
			count++
		}
		m := max(maxSoFar, node.Val)
		walk(node.Left, m, count)
		walk(node.Right, m, count)
		if node == root {
			result = count
		}
	}
	walk(root, math.MinInt, 0)
	return result
}

type testCase struct {
	name string
	tree *TreeNode
	want int
}

const N = 100_000

func main() {
	upChain := chain(N, func(i int) int { return -10_000 + i/5 }, true)   // không giảm: mọi nút đều tốt
	downChain := chain(N, func(i int) int { return 10_000 - i/5 }, false) // không tăng: chỉ 5 nút đầu (bằng gốc) là tốt

	cases := []testCase{
		{"một nút", build([]int{7}), 1},
		{"một nút âm", build([]int{-10000}), 1},
		{"ba nút", build([]int{2, 1, 3}), 2},
		{"bằng max vẫn tốt", build([]int{5, 5, 5}), 3},
		{"toàn số âm", build([]int{-3, -5, -1, -4, null, null, -2}), 2},
		{"max nhánh trái lớn", build([]int{1, 9, 2, null, null, 2, 3}), 5},
		{"cây đầy 7 nút", build([]int{4, 2, 6, 1, 3, 5, 7}), 3},
		{"xuống thấp rồi vượt lại", build([]int{6, 2, null, 1, 7}), 2},
		{"chuỗi không giảm 10^5 nút", upChain, N},
		{"chuỗi không tăng 10^5 nút", downChain, 5},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) int
	}{
		{"goodBrute", goodBrute},
		{"goodDfs", goodDfs},
		{"goodIterative", goodIterative},
		{"goodBfs", goodBfs},
		{"wrongStrict", wrongStrict},
		{"wrongInitZero", wrongInitZero},
		{"wrongSharedMax", wrongSharedMax},
		{"wrongCountByValue", wrongCountByValue},
	}
	width := 0
	for _, f := range fns {
		width = max(width, len(f.name))
	}
	for _, f := range fns {
		ok := 0
		var fails []string
		for _, c := range cases {
			if f.name == "goodBrute" && c.tree == upChain {
				ok++ // vét cạn trên chuỗi 10^5 nút là 5·10^9 phép so; đo riêng ở dưới
				continue
			}
			if got := f.fn(c.tree); got == c.want {
				ok++
			} else {
				fails = append(fails, fmt.Sprintf("%s → %d", c.name, got))
			}
		}
		line := fmt.Sprintf("%-*s %d/%d ca đúng", width, f.name, ok, len(cases))
		if len(fails) > 0 {
			line += "; sai ở " + strings.Join(fails, ", ")
		}
		fmt.Println(line)
	}

	median := func(fn func()) float64 {
		ts := make([]float64, 5)
		for r := range ts {
			t := time.Now()
			fn()
			ts[r] = float64(time.Since(t).Microseconds()) / 1000
		}
		sort.Float64s(ts)
		return ts[2]
	}

	fmt.Println("\nchuỗi không giảm (mọi nút tốt, vét cạn không dừng sớm), trung vị 5 lần (ms)")
	fmt.Println("n        vét cạn: phép so       ms   DFS lặp ms")
	for _, n := range []int{1000, 2000, 4000, 10000} {
		tree := chain(n, func(i int) int { return i }, true)
		compares = 0
		goodBrute(tree)
		c := compares
		tb := median(func() { goodBrute(tree) })
		ti := median(func() { goodIterative(tree) })
		fmt.Printf("%-8d %16d %10.2f %12.3f\n", n, c, tb, ti)
	}

	// Cây đầy đủ 10^5 nút (cao 17), giá trị giả ngẫu nhiên: cùng bộ sinh tuyến tính ở cả năm ngôn ngữ.
	seed := int64(42)
	vals := make([]int, N)
	for i := range vals {
		seed = (seed*1103515245 + 12345) % (1 << 31)
		vals[i] = int(seed%20001) - 10000
	}
	full := build(vals)
	compares = 0
	fullWant := goodBrute(full)
	fmt.Printf("\ncây đầy đủ 10^5 nút (cao 17): %d nút tốt, vét cạn %d phép so\n", fullWant, compares)
	for _, f := range []struct {
		name string
		fn   func(*TreeNode) int
	}{{"vét cạn", goodBrute}, {"DFS đệ quy", goodDfs}, {"DFS lặp", goodIterative}, {"BFS", goodBfs}} {
		if f.fn(full) != fullWant {
			panic(f.name)
		}
		fmt.Printf("%-16s %8.2f ms\n", f.name, median(func() { f.fn(full) }))
	}
	fmt.Printf("\nDFS đệ quy trên chuỗi 10^5 nút: %d (ngăn xếp goroutine tự lớn lên)\n", goodDfs(upChain))
}
