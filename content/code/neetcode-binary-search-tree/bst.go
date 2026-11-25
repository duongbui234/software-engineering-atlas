// Ga LINK-04: cây nhị phân tìm kiếm (BST). Giải 235, 98, 230.
// Chạy: go run bst.go

package main

import (
	"fmt"
	"math"
	"sort"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = math.MinInt // đánh dấu chỗ trống trong mảng theo tầng

// Dựng cây từ mảng theo tầng kiểu LeetCode.
func fromLevel(a ...int) *TreeNode {
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

// Tìm nút có giá trị v bằng chính tính chất BST.
func find(root *TreeNode, v int) *TreeNode {
	for root != nil && root.Val != v {
		if v < root.Val {
			root = root.Left
		} else {
			root = root.Right
		}
	}
	return root
}

// 235: đi một đường từ gốc. Cả hai nhỏ hơn → trái; cả hai lớn hơn → phải; còn lại → đây là đáp án.
func lowestCommonAncestor(root, p, q *TreeNode) *TreeNode {
	node := root
	for {
		if p.Val < node.Val && q.Val < node.Val {
			node = node.Left
		} else if p.Val > node.Val && q.Val > node.Val {
			node = node.Right
		} else {
			return node
		}
	}
}

// LCA cho cây nhị phân bất kỳ (bài 236): không dùng thứ tự, hỏi cả hai cây con. O(n).
func lcaGeneric(node, p, q *TreeNode) *TreeNode {
	if node == nil || node == p || node == q {
		return node
	}
	l, r := lcaGeneric(node.Left, p, q), lcaGeneric(node.Right, p, q)
	if l != nil && r != nil {
		return node
	}
	if l != nil {
		return l
	}
	return r
}

// 98: mỗi nút phải nằm trong khoảng mở (lo, hi) do MỌI tổ tiên đặt ra.
// int của Go là 64 bit, nên math.MinInt/MaxInt nằm ngoài mọi giá trị int32 của đề.
func isValidBST(root *TreeNode) bool {
	var check func(*TreeNode, int, int) bool
	check = func(node *TreeNode, lo, hi int) bool {
		if node == nil {
			return true
		}
		if node.Val <= lo || node.Val >= hi {
			return false
		}
		return check(node.Left, lo, node.Val) && check(node.Right, node.Val, hi)
	}
	return check(root, math.MinInt, math.MaxInt)
}

// 98 cách hai: trung thứ tự bằng ngăn xếp, giá trị phải tăng ngặt. Không đệ quy.
func isValidBSTInorder(root *TreeNode) bool {
	var stack []*TreeNode
	node, first, prev := root, true, 0
	for node != nil || len(stack) > 0 {
		for node != nil {
			stack = append(stack, node)
			node = node.Left
		}
		node = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if !first && node.Val <= prev {
			return false
		}
		first, prev = false, node.Val
		node = node.Right
	}
	return true
}

// BẪY của 98: chỉ so nút với hai con trực tiếp.
func isValidBSTParentChild(node *TreeNode) bool {
	if node == nil {
		return true
	}
	if node.Left != nil && node.Left.Val >= node.Val {
		return false
	}
	if node.Right != nil && node.Right.Val <= node.Val {
		return false
	}
	return isValidBSTParentChild(node.Left) && isValidBSTParentChild(node.Right)
}

// 230: trung thứ tự của BST là dãy tăng. Đi bằng ngăn xếp, đếm, dừng ở nút thứ k: O(h + k).
func kthSmallest(root *TreeNode, k int) int {
	var stack []*TreeNode
	node := root
	for {
		for node != nil {
			stack = append(stack, node)
			node = node.Left
		}
		node = stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		k--
		if k == 0 {
			return node.Val
		}
		node = node.Right
	}
}

// 230 cách thẳng: gom cả trung thứ tự ra slice. Luôn O(n).
func inorderValues(root *TreeNode, out []int) []int {
	if root != nil {
		out = inorderValues(root.Left, out)
		out = append(out, root.Val)
		out = inorderValues(root.Right, out)
	}
	return out
}

func kthSmallestFull(root *TreeNode, k int) int { return inorderValues(root, nil)[k-1] }

func insert(root *TreeNode, v int) bool {
	p := root
	for {
		if v == p.Val {
			return false
		}
		if v < p.Val {
			if p.Left == nil {
				p.Left = &TreeNode{Val: v}
				return true
			}
			p = p.Left
		} else {
			if p.Right == nil {
				p.Right = &TreeNode{Val: v}
				return true
			}
			p = p.Right
		}
	}
}

// BST cân bằng từ dãy 0, 2, 4, …: chọn giữa làm gốc.
func balanced(lo, hi int) *TreeNode {
	if lo > hi {
		return nil
	}
	mid := (lo + hi) / 2
	return &TreeNode{2 * mid, balanced(lo, mid-1), balanced(mid+1, hi)}
}

func preorder(root *TreeNode, out []*TreeNode) []*TreeNode {
	if root != nil {
		out = append(out, root)
		out = preorder(root.Left, out)
		out = preorder(root.Right, out)
	}
	return out
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

var broken, naiveWrong int

// 300 BST ngẫu nhiên: 230 so với dãy đã sắp, 235 với LCA tổng quát, 98 trước và sau khi sửa bừa một nút.
func randomChecks() bool {
	rand := mulberry32(42)
	for t := 0; t < 300; t++ {
		n := 1 + int(rand()*30)
		root := &TreeNode{Val: int(rand() * 100)}
		for size := 1; size < n; {
			if insert(root, int(rand()*100)) {
				size++
			}
		}
		sorted := inorderValues(root, nil)
		for k := 1; k <= n; k++ {
			if kthSmallest(root, k) != sorted[k-1] {
				return false
			}
		}
		if n >= 2 {
			i := int(rand() * float64(n))
			j := (i + 1 + int(rand()*float64(n-1))) % n
			p, q := find(root, sorted[i]), find(root, sorted[j])
			if lowestCommonAncestor(root, p, q) != lcaGeneric(root, p, q) {
				return false
			}
		}
		if !isValidBST(root) || !isValidBSTInorder(root) {
			return false
		}
		victim := preorder(root, nil)[int(rand()*float64(n))]
		victim.Val = int(rand() * 100)
		vals := inorderValues(root, nil)
		ok := sort.SliceIsSorted(vals, func(a, b int) bool { return vals[a] < vals[b] })
		for x := 1; x < len(vals); x++ {
			if vals[x-1] == vals[x] {
				ok = false // trùng giá trị cũng là hỏng
			}
		}
		if isValidBST(root) != ok || isValidBSTInorder(root) != ok {
			return false
		}
		if !ok {
			broken++
			if isValidBSTParentChild(root) {
				naiveWrong++
			}
		}
	}
	return true
}

func sample() *TreeNode { return fromLevel(20, 10, 30, 5, 15, 25, 35, null, null, 12, 17) }
func lcaOf(a, b int) int {
	r := sample()
	return lowestCommonAncestor(r, find(r, a), find(r, b)).Val
}
func chain(n int) *TreeNode {
	r := &TreeNode{Val: 0}
	p := r
	for v := 1; v < n; v++ {
		p.Right = &TreeNode{Val: v}
		p = p.Right
	}
	return r
}

func median(f func()) float64 {
	ts := make([]float64, 5)
	for k := range ts {
		t0 := time.Now()
		f()
		ts[k] = float64(time.Since(t0).Nanoseconds()) / 1e6
	}
	sort.Float64s(ts)
	return ts[2]
}

func fmtMs(ms float64) string {
	if ms < 1 {
		return fmt.Sprintf("%.1f µs", ms*1000)
	}
	return fmt.Sprintf("%.1f ms", ms)
}

func main() {
	deep := func() *TreeNode { return fromLevel(10, 5, 15, null, null, 12, 20, 9) }
	full := func() *TreeNode { return fromLevel(20, 10, 30, 5, 15, 25, 35) }
	cases := []struct {
		name string
		f    func() bool
	}{
		{"235 hai nút ở hai nhánh của gốc", func() bool { return lcaOf(10, 30) == 20 }},
		{"235 một nút là tổ tiên của nút kia", func() bool { return lcaOf(10, 17) == 10 }},
		{"235 hai lá cùng một cha", func() bool { return lcaOf(12, 17) == 15 }},
		{"235 tách nhau ở tầng giữa", func() bool { return lcaOf(5, 12) == 10 }},
		{"98 cây ba nút đúng thứ tự", func() bool { return isValidBST(fromLevel(5, 3, 8)) && isValidBSTInorder(fromLevel(5, 3, 8)) }},
		{"98 nút sâu vi phạm khoảng của tổ tiên", func() bool {
			return !isValidBST(deep()) && !isValidBSTInorder(deep()) && isValidBSTParentChild(deep())
		}},
		{"98 giá trị trùng không hợp lệ", func() bool { return !isValidBST(fromLevel(5, 5)) && !isValidBST(fromLevel(5, null, 5)) }},
		{"98 một nút bằng 2^31 − 1", func() bool {
			return isValidBST(fromLevel(2147483647)) && isValidBSTInorder(fromLevel(2147483647))
		}},
		{"98 hai đầu mút của int", func() bool { return isValidBST(fromLevel(-2147483648, null, 2147483647)) }},
		{"230 nhỏ nhất, giữa, lớn nhất", func() bool {
			return kthSmallest(full(), 1) == 5 && kthSmallest(full(), 4) == 20 && kthSmallest(full(), 7) == 35
		}},
		{"230 cây chỉ có nhánh trái", func() bool { return kthSmallest(fromLevel(4, 3, null, 2, null, 1), 2) == 2 }},
		{"230 cây chỉ có nhánh phải", func() bool { return kthSmallest(fromLevel(1, null, 2, null, 3), 3) == 3 }},
		{"random 300 BST: 235, 98, 230", randomChecks},
		{"98 và 230 trên chuỗi lệch 10^5 nút", func() bool {
			return isValidBSTInorder(chain(100_000)) && kthSmallest(chain(100_000), 99_999) == 99_998
		}},
	}
	ok := 0
	for _, c := range cases {
		if c.f() {
			ok++
		} else {
			fmt.Println("SAI:", c.name)
		}
	}
	fmt.Printf("bst %d/%d ca đúng\n", ok, len(cases))
	fmt.Printf("98 trên 300 cây bị sửa một nút: %d cây hỏng, cách chỉ so cha-con nhận nhầm %d cây\n", broken, naiveWrong)

	// Đo trên BST cân bằng 10^6 nút (giá trị 0, 2, 4, …), cao 20.
	const N = 1_000_000
	big := balanced(0, N-1)
	rand := mulberry32(7)
	// Cặp hai giá trị liền nhau (v, v + 2): tổ tiên chung nằm sâu, đường đi dài gần bằng chiều cao.
	pairs := make([][2]*TreeNode, 1000)
	for t := range pairs {
		v := 2 * int(rand()*(N-1))
		pairs[t] = [2]*TreeNode{find(big, v), find(big, v+2)}
	}
	var sink *TreeNode
	walk := median(func() {
		for _, pq := range pairs {
			sink = lowestCommonAncestor(big, pq[0], pq[1])
		}
	}) / float64(len(pairs))
	generic := median(func() {
		for t := 0; t < 5; t++ {
			sink = lcaGeneric(big, pairs[t][0], pairs[t][1])
		}
	}) / 5
	_ = sink
	fmt.Printf("235 trên BST cân bằng 10^6 nút: đi theo giá trị %.2f µs/truy vấn, LCA tổng quát %.1f ms/truy vấn\n", walk*1000, generic)
	for _, k := range []int{10, N / 2} {
		reps := 1
		if k < 1000 {
			reps = 1000 // k nhỏ chạy quá nhanh nên lặp 1000 lần rồi chia
		}
		early := median(func() {
			for r := 0; r < reps; r++ {
				kthSmallest(big, k)
			}
		}) / float64(reps)
		fmt.Printf("230 trên BST cân bằng 10^6 nút, k = %d: dừng sớm %s, gom cả cây %s\n", k, fmtMs(early), fmtMs(median(func() { kthSmallestFull(big, k) })))
	}
}
