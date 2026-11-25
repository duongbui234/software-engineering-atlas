// LC 98 Validate Binary Search Tree: vét cạn max/min cây con, truyền khoảng (đệ quy và lặp),
// trung thứ tự (đệ quy, lặp, Morris), và hai cách sai chạy thật.
// Chạy: go run validate_bst.go
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

const null = math.MinInt // đánh dấu chỗ trống khi dựng cây; không trùng giá trị nào của đề

// Dựng cây từ mảng theo tầng kiểu LeetCode.
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

func balancedBST(lo, hi int) *TreeNode {
	if lo > hi {
		return nil
	}
	mid := (lo + hi) / 2
	return &TreeNode{mid, balancedBST(lo, mid-1), balancedBST(mid+1, hi)}
}

func rightChain(n int) *TreeNode {
	var root *TreeNode
	for v := n; v >= 1; v-- {
		root = &TreeNode{Val: v, Right: root}
	}
	return root
}

func chainBadBottom(n int) *TreeNode {
	root := rightChain(n - 1)
	t := root
	for t.Right != nil {
		t = t.Right
	}
	t.Left = &TreeNode{Val: 0}
	return root
}

var visits int

// Sai: chỉ so nút với hai con trực tiếp.
func wrongParentChild(root *TreeNode) bool {
	if root == nil {
		return true
	}
	if root.Left != nil && root.Left.Val >= root.Val {
		return false
	}
	if root.Right != nil && root.Right.Val <= root.Val {
		return false
	}
	return wrongParentChild(root.Left) && wrongParentChild(root.Right)
}

func scan(node *TreeNode) (int, int) {
	mn, mx := math.MaxInt, math.MinInt
	stack := []*TreeNode{node}
	for len(stack) > 0 {
		t := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		visits++
		mn, mx = min(mn, t.Val), max(mx, t.Val)
		if t.Left != nil {
			stack = append(stack, t.Left)
		}
		if t.Right != nil {
			stack = append(stack, t.Right)
		}
	}
	return mn, mx
}

// Cách 1: vét cạn, ở mọi nút max(trái) < nút < min(phải). O(n·h).
func bruteMaxMin(root *TreeNode) bool {
	if root == nil {
		return true
	}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if node.Left != nil {
			if _, mx := scan(node.Left); mx >= node.Val {
				return false
			}
			stack = append(stack, node.Left)
		}
		if node.Right != nil {
			if mn, _ := scan(node.Right); mn <= node.Val {
				return false
			}
			stack = append(stack, node.Right)
		}
	}
	return true
}

// Cách 2: truyền khoảng mở; lo, hi là con trỏ, nil nghĩa là chưa có cận. Không cần giá trị canh.
func validBounds(root *TreeNode) bool {
	var walk func(node *TreeNode, lo, hi *int) bool
	walk = func(node *TreeNode, lo, hi *int) bool {
		if node == nil {
			return true
		}
		visits++
		if (lo != nil && node.Val <= *lo) || (hi != nil && node.Val >= *hi) {
			return false
		}
		return walk(node.Left, lo, &node.Val) && walk(node.Right, &node.Val, hi)
	}
	return walk(root, nil, nil)
}

// Cách 2b: cùng phép kiểm, ngăn xếp tự quản lý. int của Go 64 bit, giá trị đề chỉ 32 bit,
// nên math.MinInt và math.MaxInt làm cận "vô cực" được ở đây.
func validBoundsIterative(root *TreeNode) bool {
	if root == nil {
		return true
	}
	type item struct {
		node   *TreeNode
		lo, hi int
	}
	stack := []item{{root, math.MinInt, math.MaxInt}}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		visits++
		if it.node.Val <= it.lo || it.node.Val >= it.hi {
			return false
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, it.lo, it.node.Val})
		}
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, it.node.Val, it.hi})
		}
	}
	return true
}

// Cách 3: trung thứ tự đệ quy; hasPrev thay cho giá trị canh.
func validInorder(root *TreeNode) bool {
	prev, hasPrev := 0, false
	var walk func(node *TreeNode) bool
	walk = func(node *TreeNode) bool {
		if node == nil {
			return true
		}
		if !walk(node.Left) {
			return false
		}
		visits++
		if hasPrev && node.Val <= prev {
			return false
		}
		prev, hasPrev = node.Val, true
		return walk(node.Right)
	}
	return walk(root)
}

// Cách 3b: trung thứ tự lặp.
func validInorderIterative(root *TreeNode) bool {
	stack := []*TreeNode{}
	cur := root
	prev, hasPrev := 0, false
	for cur != nil || len(stack) > 0 {
		for cur != nil {
			stack = append(stack, cur)
			cur = cur.Left
		}
		cur = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		visits++
		if hasPrev && cur.Val <= prev {
			return false
		}
		prev, hasPrev = cur.Val, true
		cur = cur.Right
	}
	return true
}

// Cách 3c: Morris, bộ nhớ thêm O(1); đi tới hết để gỡ mọi sợi nối tạm.
func validMorris(root *TreeNode) bool {
	cur := root
	prev, hasPrev, ok := 0, false, true
	visit := func(n *TreeNode) {
		visits++
		if hasPrev && n.Val <= prev {
			ok = false
		}
		prev, hasPrev = n.Val, true
	}
	for cur != nil {
		if cur.Left == nil {
			visit(cur)
			cur = cur.Right
			continue
		}
		p := cur.Left
		for p.Right != nil && p.Right != cur {
			p = p.Right
		}
		if p.Right == nil {
			p.Right = cur
			cur = cur.Left
		} else {
			p.Right = nil
			visit(cur)
			cur = cur.Right
		}
	}
	return ok
}

// Sai: cận ban đầu là MinInt32 và MaxInt32, như thể không nút nào bằng chúng.
func wrongInt32Sentinel(root *TreeNode) bool {
	var walk func(node *TreeNode, lo, hi int) bool
	walk = func(node *TreeNode, lo, hi int) bool {
		if node == nil {
			return true
		}
		if node.Val <= lo || node.Val >= hi {
			return false
		}
		return walk(node.Left, lo, node.Val) && walk(node.Right, node.Val, hi)
	}
	return walk(root, math.MinInt32, math.MaxInt32)
}

func medianMs(fn func(*TreeNode) bool, root *TreeNode) (int, float64) {
	ts := make([]float64, 5)
	v := 0
	for k := range ts {
		visits = 0
		t0 := time.Now()
		fn(root)
		ts[k] = float64(time.Since(t0).Nanoseconds()) / 1e6
		v = visits
	}
	sort.Float64s(ts)
	return v, ts[2]
}

func main() {
	type tc struct {
		name string
		make func() *TreeNode
		want bool
	}
	cases := []tc{
		{"một nút", func() *TreeNode { return build([]int{1}) }, true},
		{"ba nút đúng", func() *TreeNode { return build([]int{2, 1, 3}) }, true},
		{"cháu phải nhỏ hơn ông", func() *TreeNode { return build([]int{8, 3, 10, null, null, 6, 12}) }, false},
		{"cháu trái lớn hơn ông", func() *TreeNode { return build([]int{8, 3, 10, 1, 9}) }, false},
		{"trùng bên trái", func() *TreeNode { return build([]int{5, 5}) }, false},
		{"trùng bên phải", func() *TreeNode { return build([]int{5, null, 5}) }, false},
		{"một nút INT_MIN", func() *TreeNode { return build([]int{math.MinInt32}) }, true},
		{"một nút INT_MAX", func() *TreeNode { return build([]int{math.MaxInt32}) }, true},
		{"INT_MIN rồi INT_MAX", func() *TreeNode { return build([]int{math.MinInt32, null, math.MaxInt32}) }, true},
		{"INT_MAX trùng", func() *TreeNode { return build([]int{math.MaxInt32, math.MaxInt32}) }, false},
		{"cây cân 10^4 nút", func() *TreeNode { return balancedBST(1, 10000) }, true},
		{"chuỗi phải 10^4 nút", func() *TreeNode { return rightChain(10000) }, true},
		{"chuỗi 10^4 nút, đáy sai", func() *TreeNode { return chainBadBottom(10000) }, false},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) bool
	}{
		{"bruteMaxMin", bruteMaxMin}, {"validBounds", validBounds}, {"validBoundsIterative", validBoundsIterative},
		{"validInorder", validInorder}, {"validInorderIterative", validInorderIterative}, {"validMorris", validMorris},
		{"wrongParentChild", wrongParentChild}, {"wrongInt32Sentinel", wrongInt32Sentinel},
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
		fmt.Printf("%-21s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), suffix)
	}

	fmt.Println("\nsố lần ghé nút và thời gian trung vị 5 lần (ms), cây đúng")
	fmt.Println("cây                n   vét cạn: ghé       ms   khoảng (đệ quy)   trung thứ tự (lặp)   Morris")
	for _, row := range []struct {
		label string
		root  *TreeNode
		n     int
	}{
		{"cây cân", balancedBST(1, 10000), 10000},
		{"chuỗi phải", rightChain(1000), 1000},
		{"chuỗi phải", rightChain(4000), 4000},
		{"chuỗi phải", rightChain(10000), 10000},
	} {
		bv, bt := medianMs(bruteMaxMin, row.root)
		_, kt := medianMs(validBounds, row.root)
		_, it := medianMs(validInorderIterative, row.root)
		_, mt := medianMs(validMorris, row.root)
		fmt.Printf("%-11s %6d %14d %8.2f %17.3f %20.3f %8.3f\n", row.label, row.n, bv, bt, kt, it, mt)
	}
}
