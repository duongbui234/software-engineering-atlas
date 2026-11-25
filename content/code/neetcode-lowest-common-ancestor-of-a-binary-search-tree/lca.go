// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và cách hiểu sai "p luôn nhỏ hơn q".
// Chạy: go run lca.go
package main

import (
	"fmt"
	"math"
	"math/rand"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = math.MinInt32 // đánh dấu chỗ trống trong mảng theo tầng (vừa cả int 32 bit)

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

func find(root *TreeNode, v int) *TreeNode {
	node := root
	for node != nil && node.Val != v {
		if v < node.Val {
			node = node.Left
		} else {
			node = node.Right
		}
	}
	return node
}

// Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n.
func rightChain(n int) *TreeNode {
	var root *TreeNode
	for i := n - 1; i >= 0; i-- {
		root = &TreeNode{Val: i, Right: root}
	}
	return root
}

func balancedBST(lo, hi int) *TreeNode {
	if lo > hi {
		return nil
	}
	mid := (lo + hi) / 2
	return &TreeNode{Val: mid, Left: balancedBST(lo, mid-1), Right: balancedBST(mid+1, hi)}
}

// Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n).
func lcaGeneral(root, p, q *TreeNode) *TreeNode {
	if root == nil || root == p || root == q {
		return root
	}
	l := lcaGeneral(root.Left, p, q)
	r := lcaGeneral(root.Right, p, q)
	if l != nil && r != nil {
		return root
	}
	if l != nil {
		return l
	}
	return r
}

// Cách 2: hai đường đi từ gốc, nút chung cuối cùng.
func pathTo(root, target *TreeNode) []*TreeNode {
	var path []*TreeNode
	for node := root; node != nil; {
		path = append(path, node)
		if node == target {
			break
		}
		if target.Val < node.Val {
			node = node.Left
		} else {
			node = node.Right
		}
	}
	return path
}

func lcaPaths(root, p, q *TreeNode) *TreeNode {
	a, b := pathTo(root, p), pathTo(root, q)
	i := 0
	for i < len(a) && i < len(b) && a[i] == b[i] {
		i++
	}
	return a[i-1]
}

// Cách 3: đi xuống theo thứ tự, đệ quy.
func lcaRecursive(node, p, q *TreeNode) *TreeNode {
	if node == nil {
		return nil
	}
	if p.Val < node.Val && q.Val < node.Val {
		return lcaRecursive(node.Left, p, q)
	}
	if p.Val > node.Val && q.Val > node.Val {
		return lcaRecursive(node.Right, p, q)
	}
	return node
}

// Cách 4: vòng lặp, O(1) bộ nhớ.
func lcaIterative(root, p, q *TreeNode) *TreeNode {
	node := root
	for node != nil {
		if p.Val < node.Val && q.Val < node.Val {
			node = node.Left
		} else if p.Val > node.Val && q.Val > node.Val {
			node = node.Right
		} else {
			return node
		}
	}
	return nil
}

// Biến thể nhân hai hiệu. int của Go rộng 64 bit trên máy 64 bit, nên tích (tối đa 4·10^18) vừa;
// trên GOARCH=386 thì int chỉ 32 bit và tích tràn.
func lcaProduct(root, p, q *TreeNode) *TreeNode {
	node := root
	for node != nil {
		if (node.Val-p.Val)*(node.Val-q.Val) <= 0 {
			return node
		}
		if p.Val < node.Val {
			node = node.Left
		} else {
			node = node.Right
		}
	}
	return nil
}

// Hiểu sai: tưởng p luôn nhỏ hơn q.
func wrongAssumeOrdered(root, p, q *TreeNode) *TreeNode {
	node := root
	for node != nil {
		if q.Val < node.Val {
			node = node.Left
		} else if p.Val > node.Val {
			node = node.Right
		} else {
			return node
		}
	}
	return nil
}

type tcase struct {
	name       string
	make       func() *TreeNode
	p, q, want int
}

var T = []int{20, 10, 30, 5, 15, 25, 35, null, null, 12, 17}

var cases = []tcase{
	{"hai phía của gốc (5, 35)", func() *TreeNode { return build(T) }, 5, 35, 20},
	{"cùng bên trái (5, 17)", func() *TreeNode { return build(T) }, 5, 17, 10},
	{"p là tổ tiên của q (10, 12)", func() *TreeNode { return build(T) }, 10, 12, 10},
	{"p lớn hơn q (17, 12)", func() *TreeNode { return build(T) }, 17, 12, 15},
	{"cùng bên phải (25, 35)", func() *TreeNode { return build(T) }, 25, 35, 30},
	{"gốc là p (20, 17)", func() *TreeNode { return build(T) }, 20, 17, 20},
	{"cây 2 nút (2, 1)", func() *TreeNode { return build([]int{2, 1}) }, 2, 1, 2},
	{"giá trị ±10⁹ (10⁹, 10⁹ − 1)", func() *TreeNode { return build([]int{-1000000000, null, 1000000000, 999999999}) }, 1000000000, 999999999, 1000000000},
	{"cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", func() *TreeNode { return build([]int{0, null, 50000, null, 50001}) }, 50000, 50001, 50000},
	{"chuỗi tăng 10⁵ nút (99998, 99999)", func() *TreeNode { return rightChain(100000) }, 99998, 99999, 99998},
}

func check(name string, fn func(r, p, q *TreeNode) *TreeNode) {
	var bad []string
	for _, c := range cases {
		root := c.make()
		r := fn(root, find(root, c.p), find(root, c.q))
		got := "nil"
		if r != nil {
			got = fmt.Sprint(r.Val)
		}
		if got != fmt.Sprint(c.want) {
			bad = append(bad, c.name+" → "+got)
		}
	}
	tail := ""
	if len(bad) > 0 {
		tail = "; sai ở " + strings.Join(bad, ", ")
	}
	fmt.Printf("%-19s %d/%d ca đúng%s\n", name, len(cases)-len(bad), len(cases), tail)
}

func main() {
	check("lcaGeneral", lcaGeneral)
	check("lcaPaths", lcaPaths)
	check("lcaRecursive", lcaRecursive)
	check("lcaIterative", lcaIterative)
	check("lcaProduct", lcaProduct)
	check("wrongAssumeOrdered", wrongAssumeOrdered)

	// Đo trên BST cân 2^20 - 1 nút với cặp ngẫu nhiên.
	n := 1<<20 - 1
	root := balancedBST(0, n-1)
	rng := rand.New(rand.NewSource(20))
	type pair struct{ p, q *TreeNode }
	pairs := make([]pair, 2000)
	for i := range pairs {
		a := rng.Intn(n)
		b := rng.Intn(n - 1)
		if b >= a {
			b++
		}
		pairs[i] = pair{find(root, a), find(root, b)}
	}
	G := 40
	t0 := time.Now()
	for _, pr := range pairs[:G] {
		lcaGeneral(root, pr.p, pr.q)
	}
	gt := float64(time.Since(t0).Microseconds()) / float64(G)
	sink := 0
	t0 = time.Now()
	for rep := 0; rep < 50; rep++ {
		for _, pr := range pairs {
			sink += lcaIterative(root, pr.p, pr.q).Val
		}
	}
	wt := float64(time.Since(t0).Nanoseconds()) / 1000 / float64(50*len(pairs))
	fmt.Printf("\nBST cân %d nút, cặp ngẫu nhiên, mỗi truy vấn: tổng quát %.0f µs, đi theo thứ tự %.3f µs\n", n, gt, wt)
	_ = sink
}
