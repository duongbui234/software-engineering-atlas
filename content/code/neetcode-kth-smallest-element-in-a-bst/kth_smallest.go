// LC 230 Kth Smallest Element in a BST: sắp xếp, trung thứ tự hết cây, trung thứ tự dừng sớm (đệ quy và ngăn xếp),
// Morris, và cây có cỡ cây con cho câu hỏi phụ "chèn/xóa liên tục".
// Chạy: go run kth_smallest.go
package main

import (
	"fmt"
	"math/rand"
	"slices"
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

func leftChain(n int) *TreeNode {
	var root *TreeNode
	for v := 1; v <= n; v++ {
		root = &TreeNode{Val: v, Left: root}
	}
	return root
}

func rightChain(n int) *TreeNode {
	var root *TreeNode
	for v := n; v >= 1; v-- {
		root = &TreeNode{Val: v, Right: root}
	}
	return root
}

// balancedRange dựng cây cân từ lo..hi; giá trị nhỏ thứ k là lo + k - 1.
func balancedRange(lo, hi int) *TreeNode {
	if lo > hi {
		return nil
	}
	mid := (lo + hi) / 2
	return &TreeNode{Val: mid, Left: balancedRange(lo, mid-1), Right: balancedRange(mid+1, hi)}
}

// Cách 1: gom mọi giá trị, sắp xếp, lấy phần tử k-1. O(n log n).
func kthSort(root *TreeNode, k int) int {
	vals := []int{}
	stack := []*TreeNode{}
	if root != nil {
		stack = append(stack, root)
	}
	for len(stack) > 0 {
		node := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		vals = append(vals, node.Val)
		if node.Left != nil {
			stack = append(stack, node.Left)
		}
		if node.Right != nil {
			stack = append(stack, node.Right)
		}
	}
	slices.Sort(vals)
	return vals[k-1]
}

// Cách 2: trung thứ tự đệ quy gom hết (dãy tăng), lấy phần tử k-1. O(n).
func kthInorderAll(root *TreeNode, k int) int {
	out := []int{}
	var walk func(*TreeNode) // phải khai báo trước thì closure mới gọi lại chính nó được
	walk = func(node *TreeNode) {
		if node == nil {
			return
		}
		walk(node.Left)
		out = append(out, node.Val)
		walk(node.Right)
	}
	walk(root)
	return out[k-1]
}

// Cách 3: trung thứ tự đệ quy, đếm và dừng khi đủ k. O(h + k).
// count và answer nằm ngoài closure, nên mọi tầng đệ quy cùng sửa một biến.
func kthRecursive(root *TreeNode, k int) int {
	count, answer := 0, -1
	var walk func(*TreeNode)
	walk = func(node *TreeNode) {
		if node == nil || count >= k {
			return
		}
		walk(node.Left)
		if count >= k {
			return
		}
		count++
		if count == k {
			answer = node.Val
			return
		}
		walk(node.Right)
	}
	walk(root)
	return answer
}

// Cách 4: trung thứ tự bằng ngăn xếp tự quản lý, lấy ra đủ k nút. O(h + k).
func kthIterative(root *TreeNode, k int) int {
	stack := []*TreeNode{}
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

// Cách 5: Morris, O(1) bộ nhớ. Chỉ dừng khi đã có đáp án và không còn sợi chỉ nào.
func kthMorris(root *TreeNode, k int) int {
	cur, count, answer, pending := root, 0, -1, 0
	for cur != nil {
		if cur.Left == nil {
			count++
			if count == k {
				answer = cur.Val
			}
			if count >= k && pending == 0 {
				break
			}
			cur = cur.Right
		} else {
			pred := cur.Left
			for pred.Right != nil && pred.Right != cur {
				pred = pred.Right
			}
			if pred.Right == nil {
				pred.Right = cur // buộc chỉ quay về cur
				pending++
				cur = cur.Left
			} else {
				pred.Right = nil // gỡ chỉ
				pending--
				count++
				if count == k {
					answer = cur.Val
				}
				if count >= k && pending == 0 {
					break
				}
				cur = cur.Right
			}
		}
	}
	return answer
}

// Cách 6 (câu hỏi phụ): mỗi nút nhớ cỡ cây con.
type SizedNode struct {
	Val         int
	Left, Right *SizedNode
	Size        int
}

func sizeOf(n *SizedNode) int {
	if n == nil {
		return 0
	}
	return n.Size
}

// kthBySize đi đúng một đường từ gốc: O(h).
func kthBySize(root *SizedNode, k int) int {
	node := root
	for {
		leftSize := sizeOf(node.Left)
		switch {
		case k <= leftSize:
			node = node.Left
		case k == leftSize+1:
			return node.Val
		default:
			k -= leftSize + 1
			node = node.Right
		}
	}
}

func insertSized(node *SizedNode, v int) *SizedNode {
	if node == nil {
		return &SizedNode{Val: v, Size: 1}
	}
	if v < node.Val {
		node.Left = insertSized(node.Left, v)
	} else {
		node.Right = insertSized(node.Right, v)
	}
	node.Size++
	return node
}

func removeSized(node *SizedNode, v int) *SizedNode {
	switch {
	case v < node.Val:
		node.Left = removeSized(node.Left, v)
	case v > node.Val:
		node.Right = removeSized(node.Right, v)
	default:
		if node.Left == nil {
			return node.Right
		}
		if node.Right == nil {
			return node.Left
		}
		succ := node.Right
		for succ.Left != nil {
			succ = succ.Left
		}
		node.Val = succ.Val
		node.Right = removeSized(node.Right, succ.Val)
	}
	node.Size = 1 + sizeOf(node.Left) + sizeOf(node.Right)
	return node
}

// augment chép cây thường thành cây có size, không đệ quy.
func augment(root *TreeNode) *SizedNode {
	if root == nil {
		return nil
	}
	type pair struct {
		t *TreeNode
		s *SizedNode
	}
	top := &SizedNode{Val: root.Val}
	order := []*SizedNode{}
	stack := []pair{{root, top}}
	for len(stack) > 0 {
		p := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		order = append(order, p.s)
		if p.t.Left != nil {
			p.s.Left = &SizedNode{Val: p.t.Left.Val}
			stack = append(stack, pair{p.t.Left, p.s.Left})
		}
		if p.t.Right != nil {
			p.s.Right = &SizedNode{Val: p.t.Right.Val}
			stack = append(stack, pair{p.t.Right, p.s.Right})
		}
	}
	for i := len(order) - 1; i >= 0; i-- {
		order[i].Size = 1 + sizeOf(order[i].Left) + sizeOf(order[i].Right)
	}
	return top
}

func kthAugmented(root *TreeNode, k int) int { return kthBySize(augment(root), k) }

// SAI: truyền count theo giá trị. Mỗi tầng tăng bản sao của riêng nó; số đếm không đi ngược lên cha.
func wrongCountByValue(root *TreeNode, k int) int {
	var walk func(node *TreeNode, count int) (int, bool)
	walk = func(node *TreeNode, count int) (int, bool) {
		if node == nil {
			return 0, false
		}
		if v, ok := walk(node.Left, count); ok {
			return v, true
		}
		count++
		if count == k {
			return node.Val, true
		}
		return walk(node.Right, count)
	}
	v, _ := walk(root, 0)
	return v
}

// SAI: Morris trả về ngay khi đủ k, để lại sợi chỉ trong cây.
func wrongMorrisEarlyReturn(root *TreeNode, k int) int {
	cur, count := root, 0
	for cur != nil {
		if cur.Left == nil {
			count++
			if count == k {
				return cur.Val
			}
			cur = cur.Right
		} else {
			pred := cur.Left
			for pred.Right != nil && pred.Right != cur {
				pred = pred.Right
			}
			if pred.Right == nil {
				pred.Right = cur
				cur = cur.Left
			} else {
				pred.Right = nil
				count++
				if count == k {
					return cur.Val
				}
				cur = cur.Right
			}
		}
	}
	return -1
}

type link struct{ n, l, r *TreeNode }

func snapshot(root *TreeNode) []link {
	out := []link{}
	stack := []*TreeNode{}
	if root != nil {
		stack = append(stack, root)
	}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		out = append(out, link{n, n.Left, n.Right})
		if n.Left != nil {
			stack = append(stack, n.Left)
		}
		if n.Right != nil {
			stack = append(stack, n.Right)
		}
	}
	return out
}

func intact(snap []link) bool {
	for _, x := range snap {
		if x.n.Left != x.l || x.n.Right != x.r {
			return false
		}
	}
	return true
}

type tcase struct {
	name string
	make func() *TreeNode
	k    int
	want int
}

func median(f func(), reps int) float64 {
	ts := make([]float64, reps)
	for r := range ts {
		t0 := time.Now()
		f()
		ts[r] = float64(time.Since(t0).Nanoseconds()) / 1e6
	}
	sort.Float64s(ts)
	return ts[reps/2]
}

func main() {
	full := func() *TreeNode { return build([]int{8, 4, 12, 2, 6, 10, 14}) }
	zero := func() *TreeNode { return build([]int{3, 1, 5, 0, 2, 4, 6}) }
	cases := []tcase{
		{"một nút, k = 1", func() *TreeNode { return build([]int{9}) }, 1, 9},
		{"cây đầy 7 nút, k = 1", full, 1, 2},
		{"cây đầy 7 nút, k = 4 (gốc)", full, 4, 8},
		{"cây đầy 7 nút, k = 7", full, 7, 14},
		{"có giá trị 0, k = 1", zero, 1, 0},
		{"có giá trị 0, k = 2", zero, 2, 1},
		{"đáp án trong cây con phải của con trái, k = 3", func() *TreeNode { return build([]int{10, 5, 15, null, 7, null, 20, 6, 8}) }, 3, 7},
		{"chuỗi lệch trái 10⁴ nút, k = 1", func() *TreeNode { return leftChain(10000) }, 1, 1},
		{"chuỗi lệch trái 10⁴ nút, k = 5000", func() *TreeNode { return leftChain(10000) }, 5000, 5000},
		{"chuỗi lệch phải 10⁴ nút, k = 10⁴", func() *TreeNode { return rightChain(10000) }, 10000, 10000},
	}
	fns := []struct {
		name string
		f    func(*TreeNode, int) int
	}{
		{"kthSort", kthSort}, {"kthInorderAll", kthInorderAll}, {"kthRecursive", kthRecursive},
		{"kthIterative", kthIterative}, {"kthMorris", kthMorris}, {"kthAugmented", kthAugmented},
		{"wrongCountByValue", wrongCountByValue}, {"wrongMorrisEarlyReturn", wrongMorrisEarlyReturn},
	}
	for _, fn := range fns {
		bad := []string{}
		for _, c := range cases {
			root := c.make()
			snap := snapshot(root)
			got := fn.f(root, c.k)
			if got != c.want {
				bad = append(bad, fmt.Sprintf("%s → %d", c.name, got))
			} else if !intact(snap) {
				bad = append(bad, fmt.Sprintf("%s → %d nhưng cây bị đổi", c.name, got))
			}
		}
		msg := ""
		if len(bad) > 0 {
			msg = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-22s %d/%d ca đúng%s\n", fn.name, len(cases)-len(bad), len(cases), msg)
	}

	rnd := rand.New(rand.NewSource(230))
	T, agree := 2000, 0
	for t := 0; t < T; t++ {
		n := 1 + rnd.Intn(30)
		vals := rnd.Perm(101)[:n]
		var root *TreeNode
		for _, v := range vals {
			root = insertBST(root, v)
		}
		k := 1 + rnd.Intn(n)
		s := slices.Clone(vals)
		slices.Sort(s)
		ok := true
		for _, fn := range fns[:6] {
			if fn.f(root, k) != s[k-1] {
				ok = false
			}
		}
		if ok {
			agree++
		}
	}
	fmt.Printf("\nđối chiếu %d cây tìm kiếm ngẫu nhiên 1..30 nút: sáu cách khớp với mảng sắp xếp %d/%d\n", T, agree, T)

	rnd = rand.New(rand.NewSource(7))
	var sroot *SizedNode
	srt := []int{}
	queries, ok := 0, 0
	for op := 0; op < 5000; op++ {
		r := rnd.Float64()
		if len(srt) == 0 || r < 0.45 {
			v := rnd.Intn(10001)
			i, found := slices.BinarySearch(srt, v)
			if found {
				continue
			}
			sroot = insertSized(sroot, v)
			srt = slices.Insert(srt, i, v)
		} else if r < 0.7 {
			i := rnd.Intn(len(srt))
			sroot = removeSized(sroot, srt[i])
			srt = slices.Delete(srt, i, i+1)
		} else {
			k := 1 + rnd.Intn(len(srt))
			queries++
			if kthBySize(sroot, k) == srt[k-1] && sizeOf(sroot) == len(srt) {
				ok++
			}
		}
	}
	fmt.Printf("cây có size: 5000 thao tác chèn/xóa/hỏi ngẫu nhiên, %d/%d câu hỏi khớp mảng sắp xếp\n", ok, queries)

	n := 1<<20 - 1
	root := balancedRange(0, n-1)
	sized := augment(root)
	fmt.Printf("\ncây cân %d nút (cao 20), thời gian trung vị 5 lần (ms)\n", n)
	fmt.Println("k          sắp xếp  trung thứ tự hết  đệ quy dừng sớm  ngăn xếp   Morris   theo size")
	for _, k := range []int{1, 100, (n + 1) / 2, n} {
		ms := []float64{}
		for _, fn := range fns[:5] {
			ms = append(ms, median(func() { fn.f(root, k) }, 5))
		}
		ms = append(ms, median(func() { kthBySize(sized, k) }, 5))
		if kthIterative(root, k) != k-1 || kthMorris(root, k) != k-1 || kthBySize(sized, k) != k-1 {
			panic("sai đáp án")
		}
		w := []int{8, 18, 17, 10, 9, 12}
		line := fmt.Sprintf("%-8d", k)
		for i, m := range ms {
			line += fmt.Sprintf("%*.3f", w[i], m)
		}
		fmt.Println(line)
	}

	rnd = rand.New(rand.NewSource(99))
	n, Q := 100000, 2000
	var big *SizedNode
	used := map[int]bool{}
	for len(used) < n {
		v := rnd.Intn(1_000_000_000)
		if !used[v] {
			used[v] = true
			big = insertSized(big, v)
		}
	}
	ks := make([]int, Q)
	for i := range ks {
		ks[i] = 1 + rnd.Intn(n)
	}
	s1, s2 := 0, 0
	t1 := median(func() {
		s1 = 0
		for _, k := range ks {
			s1 += kthIterativeSized(big, k)
		}
	}, 3)
	t2 := median(func() {
		s2 = 0
		for _, k := range ks {
			s2 += kthBySize(big, k)
		}
	}, 3)
	if s1 != s2 {
		panic("hai cách lệch nhau")
	}
	fmt.Printf("\ncây ngẫu nhiên %d nút, %d câu hỏi k ngẫu nhiên: ngăn xếp %.1f ms, theo size %.2f ms\n", n, Q, t1, t2)
}

// kthIterativeSized là cách 4 viết lại cho kiểu SizedNode (Go không có kiểu cấu trúc như TypeScript).
func kthIterativeSized(root *SizedNode, k int) int {
	stack := []*SizedNode{}
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

func insertBST(root *TreeNode, v int) *TreeNode {
	t := &TreeNode{Val: v}
	if root == nil {
		return t
	}
	cur := root
	for {
		if v < cur.Val {
			if cur.Left == nil {
				cur.Left = t
				return root
			}
			cur = cur.Left
		} else {
			if cur.Right == nil {
				cur.Right = t
				return root
			}
			cur = cur.Right
		}
	}
}
