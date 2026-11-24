// LC 110 Balanced Binary Tree: từ trên xuống, từ dưới lên với giá trị canh -1, bản lặp, và bẫy quên kiểm tra -1.
// Chạy: go run balanced.go
package main

import (
	"fmt"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = -1 << 31 // đánh dấu chỗ trống trong mảng theo tầng

// build dựng cây từ mảng theo tầng kiểu LeetCode.
func build(arr []int) *TreeNode {
	if len(arr) == 0 || arr[0] == null {
		return nil
	}
	root := &TreeNode{Val: arr[0]}
	queue := []*TreeNode{root}
	i := 1
	for q := 0; q < len(queue) && i < len(arr); q++ {
		node := queue[q]
		if arr[i] != null {
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

func seq(n int) []int {
	a := make([]int, n)
	for i := range a {
		a[i] = i
	}
	return a
}

func leftChain(n int) *TreeNode {
	var root *TreeNode
	for i := 0; i < n; i++ {
		root = &TreeNode{Val: i, Left: root}
	}
	return root
}

func fibTree(h int) *TreeNode {
	if h <= 0 {
		return nil
	}
	return &TreeNode{Val: h, Left: fibTree(h - 1), Right: fibTree(h - 2)}
}

// combTree: sống dài L, nút sống thứ i có con phải là chuỗi L-1-i nút. Mọi nút sống đều cân, đáp án false.
func combTree(L int) *TreeNode {
	var spine *TreeNode
	for i := L - 1; i >= 0; i-- {
		spine = &TreeNode{Val: i, Left: spine, Right: leftChain(L - 1 - i)}
	}
	return spine
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func height(node *TreeNode) int {
	if node == nil {
		return 0
	}
	return 1 + max(height(node.Left), height(node.Right))
}

// Cách 1: từ trên xuống.
func balancedTopDown(root *TreeNode) bool {
	if root == nil {
		return true
	}
	return abs(height(root.Left)-height(root.Right)) <= 1 && balancedTopDown(root.Left) && balancedTopDown(root.Right)
}

// Cách 2: từ dưới lên, -1 nghĩa là "đã lệch".
func check(node *TreeNode) int {
	if node == nil {
		return 0
	}
	l := check(node.Left)
	if l == -1 {
		return -1
	}
	r := check(node.Right)
	if r == -1 || abs(l-r) > 1 {
		return -1
	}
	return 1 + max(l, r)
}

func balancedBottomUp(root *TreeNode) bool { return check(root) != -1 }

// Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược; h[nil] đọc ra 0.
func balancedIterative(root *TreeNode) bool {
	if root == nil {
		return true
	}
	order := []*TreeNode{}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		order = append(order, node)
		if node.Left != nil {
			stack = append(stack, node.Left)
		}
		if node.Right != nil {
			stack = append(stack, node.Right)
		}
	}
	h := make(map[*TreeNode]int, len(order))
	for i := len(order) - 1; i >= 0; i-- {
		node := order[i]
		l, r := h[node.Left], h[node.Right]
		if abs(l-r) > 1 {
			return false
		}
		h[node] = 1 + max(l, r)
	}
	return true
}

// SAI: quên kiểm tra -1 từ con.
func checkNoSentinel(node *TreeNode) int {
	if node == nil {
		return 0
	}
	l, r := checkNoSentinel(node.Left), checkNoSentinel(node.Right)
	if abs(l-r) > 1 {
		return -1
	}
	return 1 + max(l, r)
}

func wrongIgnoreSentinel(root *TreeNode) bool { return checkNoSentinel(root) != -1 }

func median(f func(), reps int) float64 {
	ts := make([]float64, reps)
	for i := range ts {
		t0 := time.Now()
		f()
		ts[i] = float64(time.Since(t0).Microseconds()) / 1000
	}
	sort.Float64s(ts)
	return ts[reps/2]
}

func main() {
	type tc struct {
		name string
		make func() *TreeNode
		want bool
	}
	cases := []tc{
		{"cây rỗng", func() *TreeNode { return nil }, true},
		{"một nút", func() *TreeNode { return build([]int{1}) }, true},
		{"cây đầy 7 nút", func() *TreeNode { return build([]int{1, 2, 3, 4, 5, 6, 7}) }, true},
		{"lệch ngay ở gốc", func() *TreeNode { return build([]int{1, 2, null, 3}) }, false},
		{"gốc cân, con lệch", func() *TreeNode { return build([]int{1, 2, 3, 4, null, null, 5, 6, null, null, 7}) }, false},
		{"chuỗi 4 nút (-1 cạnh 0)", func() *TreeNode { return build([]int{1, 2, null, 3, null, 4}) }, false},
		{"cây Fibonacci bậc 5", func() *TreeNode { return fibTree(5) }, true},
		{"cây đủ 5000 nút", func() *TreeNode { return build(seq(5000)) }, true},
		{"chuỗi lệch 5000 nút (giới hạn đề)", func() *TreeNode { return leftChain(5000) }, false},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) bool
	}{
		{"balancedTopDown", balancedTopDown}, {"balancedBottomUp", balancedBottomUp},
		{"balancedIterative", balancedIterative}, {"wrongIgnoreSentinel", wrongIgnoreSentinel},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			if got := f.fn(c.make()); got != c.want {
				bad = append(bad, fmt.Sprintf("%s → %v", c.name, got))
			}
		}
		suffix := ""
		if len(bad) > 0 {
			suffix = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-20s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), suffix)
	}

	fmt.Println("\ntrung vị 5 lần (ms)")
	fmt.Println("cây                        trên xuống   dưới lên    bản lặp")
	perfect := build(seq(1<<20 - 1))
	comb := combTree(1000)
	for _, row := range []struct {
		name string
		root *TreeNode
	}{{"hoàn hảo 2^20 - 1 nút", perfect}, {"răng lược L = 1000", comb}} {
		fmt.Printf("%-26s %10.2f %10.2f %10.2f\n", row.name,
			median(func() { balancedTopDown(row.root) }, 5),
			median(func() { balancedBottomUp(row.root) }, 5),
			median(func() { balancedIterative(row.root) }, 5))
	}
}
