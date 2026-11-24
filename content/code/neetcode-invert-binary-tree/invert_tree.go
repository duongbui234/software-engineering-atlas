// LC 226 Invert Binary Tree: đổi chỗ hai con ở mọi nút, bằng đệ quy, ngăn xếp tự quản, hoặc BFS theo tầng.
// Chạy: go run invert_tree.go
package main

import (
	"fmt"
	"slices"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = -1 << 31 // đánh dấu chỗ trống trong mảng theo tầng

// fromLevel dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
func fromLevel(vals []int) *TreeNode {
	if len(vals) == 0 || vals[0] == null {
		return nil
	}
	root := &TreeNode{Val: vals[0]}
	queue := []*TreeNode{root}
	for i := 1; i < len(vals); {
		node := queue[0]
		queue = queue[1:]
		for _, child := range []**TreeNode{&node.Left, &node.Right} {
			if i < len(vals) && vals[i] != null {
				*child = &TreeNode{Val: vals[i]}
				queue = append(queue, *child)
			}
			i++
		}
	}
	return root
}

// toLevel đọc cây ra chuỗi theo tầng, bỏ các null ở cuối.
func toLevel(root *TreeNode) string {
	out := []string{}
	queue := []*TreeNode{root}
	for head := 0; head < len(queue); head++ {
		node := queue[head]
		if node == nil {
			out = append(out, "null")
			continue
		}
		out = append(out, fmt.Sprint(node.Val))
		queue = append(queue, node.Left, node.Right)
	}
	for len(out) > 0 && out[len(out)-1] == "null" {
		out = out[:len(out)-1]
	}
	return "[" + strings.Join(out, ",") + "]"
}

// Cách 1: đệ quy. Gán nhiều giá trị: Go tính xong cả vế phải rồi mới gán.
func invertRecursive(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	root.Left, root.Right = invertRecursive(root.Right), invertRecursive(root.Left)
	return root
}

// Cách 2: ngăn xếp tự quản là một slice.
func invertStack(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		node.Left, node.Right = node.Right, node.Left
		if node.Left != nil {
			stack = append(stack, node.Left)
		}
		if node.Right != nil {
			stack = append(stack, node.Right)
		}
	}
	return root
}

// Cách 3: BFS theo tầng; hàng đợi là slice + chỉ số đầu.
func invertBfs(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	queue := []*TreeNode{root}
	for head := 0; head < len(queue); head++ {
		node := queue[head]
		node.Left, node.Right = node.Right, node.Left
		if node.Left != nil {
			queue = append(queue, node.Left)
		}
		if node.Right != nil {
			queue = append(queue, node.Right)
		}
	}
	return root
}

// SAI: hai câu gán nối tiếp. Câu thứ hai đọc root.Left đã bị ghi đè.
func wrongOverwrite(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	root.Left = wrongOverwrite(root.Right)
	root.Right = wrongOverwrite(root.Left)
	return root
}

// mulberry32: trạng thái uint32, phép nhân uint32 tự cắt về 32 bit như Math.imul.
func mulberry32(seed uint32) func() float64 {
	a := seed
	return func() float64 {
		a += 0x6d2b79f5
		t := (a ^ (a >> 15)) * (1 | a)
		t = (t + (t^(t>>7))*(61|t)) ^ t
		return float64(t^(t>>14)) / 4294967296
	}
}

func randomTree(rnd func() float64, n int) *TreeNode {
	if n == 0 {
		return nil
	}
	root := &TreeNode{}
	slots := []**TreeNode{&root.Left, &root.Right}
	for i := 1; i < n; i++ {
		j := int(rnd() * float64(len(slots)))
		s := slots[j]
		slots[j] = slots[len(slots)-1]
		slots = slots[:len(slots)-1]
		node := &TreeNode{Val: i}
		*s = node
		slots = append(slots, &node.Left, &node.Right)
	}
	return root
}

// Gương độc lập: viết cây theo thứ tự phải → gốc → trái.
func ser(t *TreeNode, mirror bool) string {
	if t == nil {
		return "#"
	}
	a, b := t.Left, t.Right
	if mirror {
		a, b = b, a
	}
	return fmt.Sprintf("(%s %d %s)", ser(a, mirror), t.Val, ser(b, mirror))
}

func medianMs(fn func(*TreeNode) *TreeNode, root *TreeNode) string {
	ts := []float64{}
	for r := 0; r < 5; r++ {
		t0 := time.Now()
		fn(root)
		ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
	}
	slices.Sort(ts)
	return fmt.Sprintf("%.2f", ts[2])
}

func main() {
	cases := []struct {
		name string
		in   []int
		want string
	}{
		{"cây rỗng", []int{}, "[]"},
		{"một nút", []int{1}, "[1]"},
		{"chỉ có con trái", []int{1, 2}, "[1,null,2]"},
		{"ba nút", []int{2, 1, 3}, "[2,3,1]"},
		{"cây đủ 3 tầng", []int{5, 3, 8, 1, 4, 7, 9}, "[5,8,3,9,7,4,1]"},
		{"chuỗi trái thành chuỗi phải", []int{1, 2, null, 3}, "[1,null,2,null,3]"},
		{"lệch hai bên", []int{1, 2, 3, null, 4, null, 5}, "[1,3,2,5,null,4]"},
		{"giá trị âm và 0", []int{0, -1, null, -2, -3}, "[0,null,-1,-3,-2]"},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) *TreeNode
	}{
		{"invertRecursive", invertRecursive},
		{"invertStack", invertStack},
		{"invertBfs", invertBfs},
		{"wrongOverwrite", wrongOverwrite},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			if got := toLevel(f.fn(fromLevel(c.in))); got != c.want {
				bad = append(bad, c.name+" → "+got)
			}
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-16s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), tail)
	}

	rnd := mulberry32(226)
	ok := []int{0, 0, 0}
	for t := 0; t < 2000; t++ {
		n, seed := int(rnd()*41), uint32(rnd()*(1<<31))
		for j := 0; j < 3; j++ {
			root := randomTree(mulberry32(seed), n) // mỗi cách đảo một bản riêng của cùng một cây
			want := ser(root, true)
			if ser(fns[j].fn(root), false) == want {
				ok[j]++
			}
		}
	}
	fmt.Printf("\nngẫu nhiên: %s %d/2000, %s %d/2000, %s %d/2000\n", fns[0].name, ok[0], fns[1].name, ok[1], fns[2].name, ok[2])

	n := 1<<20 - 1
	nodes := make([]*TreeNode, n)
	for i := range nodes {
		nodes[i] = &TreeNode{Val: i}
	}
	for i := 0; 2*i+2 < n; i++ {
		nodes[i].Left, nodes[i].Right = nodes[2*i+1], nodes[2*i+2]
	}
	fmt.Printf("\nCây đầy đủ %d nút, trung vị 5 lần (ms)\n", n)
	for j := 0; j < 3; j++ {
		fmt.Printf("%-16s %8s\n", fns[j].name, medianMs(fns[j].fn, nodes[0]))
	}

	fmt.Println("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)")
	fmt.Println("d            đệ quy   ngăn xếp        BFS")
	for _, d := range []int{1_000, 100_000, 1_000_000} {
		root := &TreeNode{}
		cur := root
		for i := 1; i < d; i++ {
			cur.Left = &TreeNode{Val: i}
			cur = cur.Left
		}
		fmt.Printf("%-10d", d)
		for j := 0; j < 3; j++ {
			fmt.Printf(" %10s", medianMs(fns[j].fn, root))
		}
		fmt.Println()
	}
}
