// Ga LINK-03: đệ quy trên cây. Giải 226, 104, 543, 110, 100, 572.
// Chạy: go run tree_recursion.go
package main

import (
	"fmt"
	"slices"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = -1 << 31 // đánh dấu "không có nút" trong mảng theo tầng

// Dựng cây từ mảng theo tầng kiểu LeetCode; null là chỗ trống.
func fromLevel(a []int) *TreeNode {
	if len(a) == 0 || a[0] == null {
		return nil
	}
	root := &TreeNode{Val: a[0]}
	queue := []*TreeNode{root}
	i := 1
	for q := 0; q < len(queue) && i < len(a); q++ {
		node := queue[q]
		if i < len(a) && a[i] != null {
			node.Left = &TreeNode{Val: a[i]}
			queue = append(queue, node.Left)
		}
		i++
		if i < len(a) && a[i] != null {
			node.Right = &TreeNode{Val: a[i]}
			queue = append(queue, node.Right)
		}
		i++
	}
	return root
}

func toLevel(root *TreeNode) []int {
	out := []int{}
	queue := []*TreeNode{root}
	for q := 0; q < len(queue); q++ {
		if node := queue[q]; node != nil {
			out = append(out, node.Val)
			queue = append(queue, node.Left, node.Right)
		} else {
			out = append(out, null)
		}
	}
	for len(out) > 0 && out[len(out)-1] == null {
		out = out[:len(out)-1]
	}
	return out
}

// 226: đổi chỗ hai con ở mọi nút.
func invertTree(root *TreeNode) *TreeNode {
	if root == nil {
		return nil
	}
	root.Left, root.Right = invertTree(root.Right), invertTree(root.Left)
	return root
}

// 104: chiều cao = 1 + chiều cao con cao hơn.
func maxDepth(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return 1 + max(maxDepth(root.Left), maxDepth(root.Right))
}

// 104 không đệ quy: ngăn xếp tự quản lý giữ (nút, độ sâu).
func maxDepthIter(root *TreeNode) int {
	type item struct {
		node  *TreeNode
		depth int
	}
	best := 0
	stack := []item{}
	if root != nil {
		stack = append(stack, item{root, 1})
	}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		best = max(best, it.depth)
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, it.depth + 1})
		}
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, it.depth + 1})
		}
	}
	return best
}

// 543: closure TRẢ VỀ chiều cao, đường kính được GHI vào biến best bên ngoài.
func diameterOfBinaryTree(root *TreeNode) int {
	best := 0
	var height func(*TreeNode) int
	height = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		l, r := height(node.Left), height(node.Right)
		best = max(best, l+r)
		return 1 + max(l, r)
	}
	height(root)
	return best
}

// 543 không đệ quy: hậu thứ tự bằng ngăn xếp, cờ "đã thăm con".
func diameterIter(root *TreeNode) int {
	if root == nil {
		return 0
	}
	type item struct {
		node         *TreeNode
		childrenDone bool
	}
	h := map[*TreeNode]int{nil: 0}
	stack := []item{{root, false}}
	best := 0
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.childrenDone {
			l, r := h[it.node.Left], h[it.node.Right]
			best = max(best, l+r)
			h[it.node] = 1 + max(l, r)
		} else {
			stack = append(stack, item{it.node, true})
			if it.node.Right != nil {
				stack = append(stack, item{it.node.Right, false})
			}
			if it.node.Left != nil {
				stack = append(stack, item{it.node.Left, false})
			}
		}
	}
	return best
}

// 110: trả chiều cao, hoặc -1 làm giá trị canh "đã lệch ở dưới".
func isBalanced(root *TreeNode) bool {
	var check func(*TreeNode) int
	check = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		l := check(node.Left)
		if l == -1 {
			return -1
		}
		r := check(node.Right)
		if r == -1 || l-r > 1 || r-l > 1 {
			return -1
		}
		return 1 + max(l, r)
	}
	return check(root) != -1
}

// 100: đi song song hai cây.
func isSameTree(p, q *TreeNode) bool {
	if p == nil || q == nil {
		return p == q
	}
	return p.Val == q.Val && isSameTree(p.Left, q.Left) && isSameTree(p.Right, q.Right)
}

// 572: thử mọi nút làm gốc, so cả cây. O(m · n) trường hợp xấu nhất.
func isSubtree(root, sub *TreeNode) bool {
	if root == nil {
		return sub == nil
	}
	return isSameTree(root, sub) || isSubtree(root.Left, sub) || isSubtree(root.Right, sub)
}

// Bản ngây thơ để so: tính lại chiều cao từ đầu ở mỗi nút.
func heightSlow(n *TreeNode) int {
	if n == nil {
		return 0
	}
	return 1 + max(heightSlow(n.Left), heightSlow(n.Right))
}

func diameterSlow(n *TreeNode) int {
	if n == nil {
		return 0
	}
	return max(heightSlow(n.Left)+heightSlow(n.Right), diameterSlow(n.Left), diameterSlow(n.Right))
}

func balancedSlow(n *TreeNode) bool {
	if n == nil {
		return true
	}
	d := heightSlow(n.Left) - heightSlow(n.Right)
	return d >= -1 && d <= 1 && balancedSlow(n.Left) && balancedSlow(n.Right)
}

// Bộ sinh ngẫu nhiên mulberry32 trên uint32: phép nhân tự tràn về 32 bit.
func mulberry32(a uint32) func() float64 {
	return func() float64 {
		a += 0x6D2B79F5
		t := (a ^ (a >> 15)) * (1 | a)
		t = (t + (t^(t>>7))*(61|t)) ^ t
		return float64(t^(t>>14)) / 4294967296
	}
}

func randomTree(n int, rand func() float64) *TreeNode {
	var root *TreeNode
	for k := 0; k < n; k++ {
		node := &TreeNode{Val: int(rand() * 3)}
		if root == nil {
			root = node
			continue
		}
		p := root
		for {
			if rand() < 0.5 {
				if p.Left == nil {
					p.Left = node
					break
				}
				p = p.Left
			} else {
				if p.Right == nil {
					p.Right = node
					break
				}
				p = p.Right
			}
		}
	}
	return root
}

func nodes(root *TreeNode) []*TreeNode {
	out := []*TreeNode{}
	stack := []*TreeNode{}
	if root != nil {
		stack = append(stack, root)
	}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		out = append(out, n)
		if n.Left != nil {
			stack = append(stack, n.Left)
		}
		if n.Right != nil {
			stack = append(stack, n.Right)
		}
	}
	return out
}

func clone(n *TreeNode) *TreeNode {
	if n == nil {
		return nil
	}
	return &TreeNode{n.Val, clone(n.Left), clone(n.Right)}
}

func chain(n int) *TreeNode {
	var root *TreeNode
	for k := 0; k < n; k++ {
		root = &TreeNode{Val: k, Left: root}
	}
	return root
}

func randomCasesAgree() bool {
	rand := mulberry32(42)
	for t := 0; t < 300; t++ {
		root := randomTree(int(rand()*40), rand)
		if maxDepth(root) != maxDepthIter(root) {
			return false
		}
		if diameterOfBinaryTree(root) != diameterSlow(root) || diameterIter(root) != diameterSlow(root) {
			return false
		}
		if isBalanced(root) != balancedSlow(root) {
			return false
		}
		if !isSameTree(invertTree(invertTree(clone(root))), root) {
			return false
		}
		all := nodes(root)
		if len(all) > 0 && !isSubtree(root, clone(all[int(rand()*float64(len(all)))])) {
			return false
		}
	}
	return true
}

func median(f func()) float64 {
	ts := []float64{}
	for k := 0; k < 5; k++ {
		t0 := time.Now()
		f()
		ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
	}
	sort.Float64s(ts)
	return ts[2]
}

func main() {
	T := func(a ...int) *TreeNode { return fromLevel(a) }
	n := null
	checks := []struct {
		name string
		ok   func() bool
	}{
		{"226 ví dụ của đề", func() bool { return slices.Equal(toLevel(invertTree(T(4, 2, 7, 1, 3, 6, 9))), []int{4, 7, 2, 9, 6, 3, 1}) }},
		{"226 cây rỗng", func() bool { return invertTree(nil) == nil }},
		{"104 ví dụ của đề", func() bool { return maxDepth(T(3, 9, 20, n, n, 15, 7)) == 3 }},
		{"104 chỉ có nhánh phải", func() bool { return maxDepth(T(1, n, 2)) == 2 }},
		{"543 ví dụ của đề", func() bool { return diameterOfBinaryTree(T(1, 2, 3, 4, 5)) == 3 }},
		{"543 hai nút", func() bool { return diameterOfBinaryTree(T(1, 2)) == 1 }},
		{"543 đường dài nhất không qua gốc", func() bool { return diameterOfBinaryTree(T(1, 2, n, 3, 4, 5, n, n, 6)) == 4 }},
		{"110 cây cân bằng", func() bool { return isBalanced(T(3, 9, 20, n, n, 15, 7)) }},
		{"110 lệch ở nhánh trái", func() bool { return !isBalanced(T(1, 2, 2, 3, 3, n, n, 4, 4)) }},
		{"110 gốc cân nhưng con lệch", func() bool { return !isBalanced(T(1, 2, 2, 3, n, n, 3, 4, n, n, 4)) }},
		{"100 hai cây giống nhau", func() bool { return isSameTree(T(1, 2, 3), T(1, 2, 3)) }},
		{"100 cùng giá trị, khác hình", func() bool { return !isSameTree(T(1, 2), T(1, n, 2)) }},
		{"572 có cây con", func() bool { return isSubtree(T(3, 4, 5, 1, 2), T(4, 1, 2)) }},
		{"572 khớp đầu nhưng thừa nút dưới", func() bool { return !isSubtree(T(3, 4, 5, 1, 2, n, n, n, n, 0), T(4, 1, 2)) }},
		{"300 cây ngẫu nhiên khớp bản chậm", randomCasesAgree},
		{"chuỗi lệch 100 000 nút, bản lặp", func() bool {
			return maxDepthIter(chain(100_000)) == 100_000 && diameterIter(chain(100_000)) == 99_999
		}},
	}
	bad := []string{}
	for _, c := range checks {
		if !c.ok() {
			bad = append(bad, c.name)
		}
	}
	msg := fmt.Sprintf("tree_recursion %d/%d ca đúng", len(checks)-len(bad), len(checks))
	if len(bad) > 0 {
		msg += "; sai ở " + strings.Join(bad, ", ")
	}
	fmt.Println(msg)

	// Đo 1: stack của goroutine tự lớn dần (mặc định tối đa 1 GB trên máy 64 bit), nên đệ quy sâu vẫn chạy.
	for _, size := range []int{100_000, 1_000_000} {
		deep := chain(size)
		t0 := time.Now()
		d := maxDepth(deep)
		fmt.Printf("104 đệ quy trên chuỗi %d nút: cao %d, %.1f ms\n", size, d, float64(time.Since(t0).Microseconds())/1000)
	}

	// Đo 2: cây ngẫu nhiên 10^6 nút, đệ quy so với ngăn xếp tự quản lý.
	big := randomTree(1_000_000, mulberry32(7))
	rec := median(func() { diameterOfBinaryTree(big) })
	it := median(func() { diameterIter(big) })
	fmt.Printf("543 trên cây ngẫu nhiên 10^6 nút (cao %d): đệ quy %.1f ms, ngăn xếp %.1f ms\n", maxDepthIter(big), rec, it)
}
