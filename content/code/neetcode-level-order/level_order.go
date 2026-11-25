// Ga LINK-05: duyệt theo tầng và mang trạng thái. Giải 102, 199, 1448.
// Chạy: go run level_order.go
package main

import (
	"fmt"
	"math"
	"reflect"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = math.MinInt // đánh dấu "không có nút" trong mảng theo tầng

// Dựng cây từ mảng theo tầng kiểu LeetCode.
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

// 102: BFS bằng slice làm hàng đợi. Chụp size := len(queue) trước vòng for:
// con được append vào sau, nên vòng for chỉ lấy đúng các nút của tầng này.
func levelOrder(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue) // chụp kích thước tầng
		level := make([]int, 0, size)
		for i := 0; i < size; i++ {
			node := queue[i]
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		queue = queue[size:] // bỏ cả tầng vừa xử lý một lần
		res = append(res, level)
	}
	return res
}

// 102 cách hai: DFS tiền thứ tự mang độ sâu.
func levelOrderDfs(root *TreeNode) [][]int {
	res := [][]int{}
	var gofn func(*TreeNode, int)
	gofn = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if len(res) == depth {
			res = append(res, []int{})
		}
		res[depth] = append(res[depth], node.Val)
		gofn(node.Left, depth+1)
		gofn(node.Right, depth+1)
	}
	gofn(root, 0)
	return res
}

// 199: nút CUỐI của mỗi tầng.
func rightSideView(root *TreeNode) []int {
	res := []int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue)
		for i := 0; i < size; i++ {
			node := queue[i]
			if i == size-1 {
				res = append(res, node.Val)
			}
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		queue = queue[size:]
	}
	return res
}

// 199 cách hai: DFS đi PHẢI trước, mang độ sâu.
func rightSideViewDfs(root *TreeNode) []int {
	res := []int{}
	var gofn func(*TreeNode, int)
	gofn = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if len(res) == depth {
			res = append(res, node.Val)
		}
		gofn(node.Right, depth+1)
		gofn(node.Left, depth+1)
	}
	gofn(root, 0)
	return res
}

// 1448: tiền thứ tự, MANG XUỐNG giá trị lớn nhất trên đường từ gốc.
func goodNodes(root *TreeNode) int {
	var gofn func(*TreeNode, int) int
	gofn = func(node *TreeNode, maxSoFar int) int {
		if node == nil {
			return 0
		}
		good := 0
		if node.Val >= maxSoFar {
			good = 1
		}
		m := max(maxSoFar, node.Val)
		return good + gofn(node.Left, m) + gofn(node.Right, m)
	}
	return gofn(root, math.MinInt)
}

// 1448 cách hai: ngăn xếp các cặp (nút, max trên đường tới nó).
type item struct {
	node     *TreeNode
	maxSoFar int
}

func goodNodesIter(root *TreeNode) int {
	if root == nil {
		return 0
	}
	count := 0
	stack := []item{{root, math.MinInt}}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.node.Val >= it.maxSoFar {
			count++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, m})
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, m})
		}
	}
	return count
}

// 1448 cách ba: BFS, trạng thái đi cùng nút trong hàng đợi.
func goodNodesBfs(root *TreeNode) int {
	if root == nil {
		return 0
	}
	count := 0
	queue := []item{{root, math.MinInt}}
	for head := 0; head < len(queue); head++ {
		it := queue[head]
		if it.node.Val >= it.maxSoFar {
			count++
		}
		m := max(it.maxSoFar, it.node.Val)
		if it.node.Left != nil {
			queue = append(queue, item{it.node.Left, m})
		}
		if it.node.Right != nil {
			queue = append(queue, item{it.node.Right, m})
		}
	}
	return count
}

// ---- Các bản SAI ----

// BẪY 102: điều kiện i < len(queue) được tính lại mỗi vòng, nên vòng for chạy luôn qua con vừa append.
func levelOrderNoSnapshot(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		level := []int{}
		i := 0
		for ; i < len(queue); i++ {
			node := queue[i]
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		queue = queue[i:]
		res = append(res, level)
	}
	return res
}

// BẪY 199: chỉ đi theo con phải.
func rightSideViewOnlyRight(root *TreeNode) []int {
	res := []int{}
	for node := root; node != nil; node = node.Right {
		res = append(res, node.Val)
	}
	return res
}

// BẪY 1448: chỉ so với cha.
func goodNodesParentOnly(root *TreeNode) int {
	var gofn func(*TreeNode, int) int
	gofn = func(node *TreeNode, parent int) int {
		if node == nil {
			return 0
		}
		good := 0
		if node.Val >= parent {
			good = 1
		}
		return good + gofn(node.Left, node.Val) + gofn(node.Right, node.Val)
	}
	return gofn(root, math.MinInt)
}

// Vét cạn cho 1448: giữ cả đường đi, quét lại ở mỗi nút.
func goodNodesBrute(root *TreeNode) int {
	var path []int
	var gofn func(*TreeNode) int
	gofn = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		good := 1
		for _, v := range path {
			if v > node.Val {
				good = 0
				break
			}
		}
		path = append(path, node.Val)
		r := good + gofn(node.Left) + gofn(node.Right)
		path = path[:len(path)-1]
		return r
	}
	return gofn(root)
}

// ---- Dữ liệu thử ----

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
	if n == 0 {
		return nil
	}
	node := &TreeNode{Val: int(math.Floor(rand()*11)) - 5}
	leftSize := int(math.Floor(rand() * float64(n)))
	node.Left = randomTree(leftSize, rand)
	node.Right = randomTree(n-1-leftSize, rand)
	return node
}

func rightChain(n int) *TreeNode {
	root := &TreeNode{Val: 1}
	cur := root
	for v := 2; v <= n; v++ {
		cur.Right = &TreeNode{Val: v}
		cur = cur.Right
	}
	return root
}

func perfectTree(d, i int) *TreeNode {
	if d == 0 {
		return nil
	}
	return &TreeNode{Val: i, Left: perfectTree(d-1, 2*i), Right: perfectTree(d-1, 2*i+1)}
}

var wrongSnap, wrongRight, wrongParent int

func lastOfEach(lo [][]int) []int {
	r := []int{}
	for _, l := range lo {
		r = append(r, l[len(l)-1])
	}
	return r
}

func randomCase() bool {
	rand := mulberry32(42)
	ok := true
	for t := 0; t < 300; t++ {
		root := randomTree(1+int(math.Floor(rand()*40)), rand)
		lo, rv, g := levelOrder(root), rightSideView(root), goodNodesBrute(root)
		if !reflect.DeepEqual(lo, levelOrderDfs(root)) {
			ok = false
		}
		if !reflect.DeepEqual(rv, rightSideViewDfs(root)) || !reflect.DeepEqual(rv, lastOfEach(lo)) {
			ok = false
		}
		if goodNodes(root) != g || goodNodesIter(root) != g || goodNodesBfs(root) != g {
			ok = false
		}
		if !reflect.DeepEqual(levelOrderNoSnapshot(root), lo) {
			wrongSnap++
		}
		if !reflect.DeepEqual(rightSideViewOnlyRight(root), rv) {
			wrongRight++
		}
		if goodNodesParentOnly(root) != g {
			wrongParent++
		}
	}
	return ok
}

const N = 100_000

func main() {
	n := null
	eq := reflect.DeepEqual
	cases := []struct {
		name string
		fn   func() bool
	}{
		{"102 cây rỗng", func() bool { return eq(levelOrder(nil), [][]int{}) }},
		{"102 một nút", func() bool { return eq(levelOrder(fromLevel([]int{1})), [][]int{{1}}) }},
		{"102 bốn tầng", func() bool {
			return eq(levelOrder(fromLevel([]int{1, 2, 3, 4, n, 5, 6, n, 7})), [][]int{{1}, {2, 3}, {4, 5, 6}, {7}})
		}},
		{"102 chỉ nhánh trái", func() bool { return eq(levelOrder(fromLevel([]int{1, 2, n, 3})), [][]int{{1}, {2}, {3}}) }},
		{"199 cây rỗng", func() bool { return eq(rightSideView(nil), []int{}) }},
		{"199 nhánh trái sâu hơn", func() bool { return eq(rightSideView(fromLevel([]int{1, 2, 3, 4})), []int{1, 3, 4}) }},
		{"199 chỉ nhánh trái", func() bool { return eq(rightSideView(fromLevel([]int{5, 4, n, 3})), []int{5, 4, 3}) }},
		{"199 bốn tầng", func() bool {
			return eq(rightSideView(fromLevel([]int{1, 2, 3, 4, n, 5, 6, n, 7})), []int{1, 3, 6, 7})
		}},
		{"1448 cây bảy nút", func() bool { return goodNodes(fromLevel([]int{2, 1, 5, n, 3, 4, 6})) == 4 }},
		{"1448 cháu nhỏ hơn ông", func() bool { return goodNodes(fromLevel([]int{5, 1, n, 3})) == 1 }},
		{"1448 giá trị bằng nhau", func() bool { return goodNodes(fromLevel([]int{2, 2, 2})) == 3 }},
		{"1448 gốc âm", func() bool { return goodNodes(fromLevel([]int{-1})) == 1 }},
		{"300 cây ngẫu nhiên: mọi cách khớp nhau và khớp vét cạn", randomCase},
		{"chuỗi lệch 10^5 nút: 1448 bản ngăn xếp, 102 và 199", func() bool {
			c := rightChain(N)
			return goodNodesIter(c) == N && len(levelOrder(c)) == N && len(rightSideView(c)) == N
		}},
	}
	pass := 0
	for _, c := range cases {
		if c.fn() {
			pass++
		} else {
			fmt.Printf("  sai: %s\n", c.name)
		}
	}
	fmt.Printf("level_order %d/%d ca đúng\n", pass, len(cases))
	fmt.Printf("bẫy trên 300 cây ngẫu nhiên: không chụp kích thước tầng sai %d cây, chỉ đi con phải sai %d cây, chỉ so với cha sai %d cây\n",
		wrongSnap, wrongRight, wrongParent)

	// Go tự nới stack của goroutine (tới 1 GB), nên đệ quy 10^5 tầng chạy được.
	chain := rightChain(N)
	t0 := time.Now()
	r := goodNodes(chain)
	fmt.Printf("1448 đệ quy trên chuỗi 10^5 nút: chạy được, %d nút tốt, %.1f ms\n", r, float64(time.Since(t0).Microseconds())/1000)

	perfect := perfectTree(20, 1)
	t0 = time.Now()
	levelOrder(perfect)
	fmt.Printf("102 trên cây đầy đủ 2^20 - 1 nút: %.1f ms\n", float64(time.Since(t0).Microseconds())/1000)
}
