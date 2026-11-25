// LC 199 Binary Tree Right Side View: BFS chụp cỡ tầng (lấy nút cuối), BFS phải trước (lấy nút đầu),
// DFS phải trước (ghi khi gặp tầng mới), DFS trái trước ghi đè, và ba cách sai chạy thật.
// Chạy: go run right_side.go
package main

import (
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = -1 << 31 // chỗ trống trong mảng theo tầng (ngoài miền giá trị −100..100)

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

func leftChain(n int) *TreeNode {
	var root *TreeNode
	for v := n; v >= 1; v-- {
		root = &TreeNode{Val: v, Left: root}
	}
	return root
}

func complete(n int) *TreeNode {
	arr := make([]int, n)
	for i := range arr {
		arr[i] = i + 1
	}
	return build(arr)
}

// Cách 1: BFS, chụp cỡ tầng; nút cuối của tầng là nút nhìn thấy.
func bfsLast(root *TreeNode) []int {
	res := []int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue) // chụp cỡ tầng
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
		queue = queue[size:] // bỏ cả tầng vừa xử lý: O(1), chỉ dời đầu slice
	}
	return res
}

// Cách 2: BFS đẩy con phải trước; nút đầu của tầng là nút nhìn thấy.
func bfsRightFirst(root *TreeNode) []int {
	res := []int{}
	if root == nil {
		return res
	}
	level := []*TreeNode{root}
	for len(level) > 0 {
		res = append(res, level[0].Val)
		next := make([]*TreeNode, 0, 2*len(level))
		for _, node := range level {
			if node.Right != nil {
				next = append(next, node.Right)
			}
			if node.Left != nil {
				next = append(next, node.Left)
			}
		}
		level = next
	}
	return res
}

// Cách 3: DFS phải trước; nút đầu tiên chạm tới độ sâu mới là nút nhìn thấy.
func dfsRightFirst(root *TreeNode) []int {
	res := []int{}
	var walk func(node *TreeNode, depth int)
	walk = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if depth == len(res) {
			res = append(res, node.Val)
		}
		walk(node.Right, depth+1)
		walk(node.Left, depth+1)
	}
	walk(root, 0)
	return res
}

// Cách 3b: DFS phải trước, bản lặp.
func dfsRightFirstIterative(root *TreeNode) []int {
	res := []int{}
	if root == nil {
		return res
	}
	type item struct {
		node  *TreeNode
		depth int
	}
	stack := []item{{root, 0}}
	for len(stack) > 0 {
		it := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if it.depth == len(res) {
			res = append(res, it.node.Val)
		}
		if it.node.Left != nil {
			stack = append(stack, item{it.node.Left, it.depth + 1})
		}
		if it.node.Right != nil {
			stack = append(stack, item{it.node.Right, it.depth + 1})
		}
	}
	return res
}

// Cách 4: DFS trái trước, ghi đè res[depth].
func dfsOverwrite(root *TreeNode) []int {
	res := []int{}
	var walk func(node *TreeNode, depth int)
	walk = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if depth == len(res) {
			res = append(res, node.Val)
		} else {
			res[depth] = node.Val
		}
		walk(node.Left, depth+1)
		walk(node.Right, depth+1)
	}
	walk(root, 0)
	return res
}

// SAI: chỉ đi theo con trỏ phải.
func wrongRightPointers(root *TreeNode) []int {
	res := []int{}
	for node := root; node != nil; node = node.Right {
		res = append(res, node.Val)
	}
	return res
}

// SAI: DFS trái trước mà vẫn ghi lần đầu gặp tầng.
func wrongLeftFirst(root *TreeNode) []int {
	res := []int{}
	var walk func(node *TreeNode, depth int)
	walk = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if depth == len(res) {
			res = append(res, node.Val)
		}
		walk(node.Left, depth+1)
		walk(node.Right, depth+1)
	}
	walk(root, 0)
	return res
}

// SAI: điều kiện vòng for đọc lại len(queue) mỗi lượt; append làm nó lớn lên nên cả cây thành một "tầng".
func wrongLiveLength(root *TreeNode) []int {
	res := []int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		var last *TreeNode
		n := 0
		for i := 0; i < len(queue); i++ {
			last = queue[i]
			n++
			if last.Left != nil {
				queue = append(queue, last.Left)
			}
			if last.Right != nil {
				queue = append(queue, last.Right)
			}
		}
		res = append(res, last.Val)
		queue = queue[n:]
	}
	return res
}

type tcase struct {
	name string
	make func() *TreeNode
	want []int
}

func seq(n int) []int {
	a := make([]int, n)
	for i := range a {
		a[i] = i + 1
	}
	return a
}

func show(a []int) string {
	s := make([]string, len(a))
	for i, v := range a {
		s[i] = fmt.Sprint(v)
	}
	if len(a) > 8 {
		return fmt.Sprintf("[%s,…,%d] (%d số)", strings.Join(s[:3], ","), a[len(a)-1], len(a))
	}
	return "[" + strings.Join(s, ",") + "]"
}

func main() {
	cases := []tcase{
		{"cây rỗng", func() *TreeNode { return build(nil) }, []int{}},
		{"một nút", func() *TreeNode { return build([]int{7}) }, []int{7}},
		{"cây đầy 7 nút", func() *TreeNode { return build([]int{1, 2, 3, 4, 5, 6, 7}) }, []int{1, 3, 7}},
		{"nhánh trái sâu hơn", func() *TreeNode { return build([]int{1, 2, 3, 4}) }, []int{1, 3, 4}},
		{"chỉ có nhánh trái", func() *TreeNode { return build([]int{1, 2, null, 3}) }, []int{1, 2, 3}},
		{"chỉ có nhánh phải", func() *TreeNode { return build([]int{1, null, 2, null, 3}) }, []int{1, 2, 3}},
		{"đáy nằm dưới cây con trái", func() *TreeNode { return build([]int{1, 2, 3, null, 5, null, null, 6}) }, []int{1, 3, 5, 6}},
		{"zíc zắc", func() *TreeNode { return build([]int{1, 2, 3, 4, null, null, null, null, 5}) }, []int{1, 3, 4, 5}},
		{"giá trị âm và biên", func() *TreeNode { return build([]int{0, -100, 100, -50}) }, []int{0, 100, -50}},
		{"chuỗi trái 100 nút", func() *TreeNode { return leftChain(100) }, seq(100)},
		{"cây đầy đủ 100 nút", func() *TreeNode { return complete(100) }, []int{1, 3, 7, 15, 31, 63, 100}},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) []int
	}{
		{"bfsLast", bfsLast},
		{"bfsRightFirst", bfsRightFirst},
		{"dfsRightFirst", dfsRightFirst},
		{"dfsRightFirstIterative", dfsRightFirstIterative},
		{"dfsOverwrite", dfsOverwrite},
		{"wrongRightPointers", wrongRightPointers},
		{"wrongLeftFirst", wrongLeftFirst},
		{"wrongLiveLength", wrongLiveLength},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			got := show(f.fn(c.make()))
			if got != show(c.want) {
				bad = append(bad, c.name+" → "+got)
			}
		}
		line := fmt.Sprintf("%-22s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			line += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(line)
	}

	// Đối chiếu ngẫu nhiên.
	rng := rand.New(rand.NewSource(42))
	randomTree := func(n int) *TreeNode {
		if n == 0 {
			return nil
		}
		root := &TreeNode{Val: rng.Intn(201) - 100}
		nodes := []*TreeNode{root}
		for len(nodes) < n {
			p := nodes[rng.Intn(len(nodes))]
			t := &TreeNode{Val: rng.Intn(201) - 100}
			if rng.Float64() < 0.5 {
				if p.Left == nil {
					p.Left = t
					nodes = append(nodes, t)
				}
			} else if p.Right == nil {
				p.Right = t
				nodes = append(nodes, t)
			}
		}
		return root
	}
	const trials = 3000
	agree, rightWrong := 0, 0
	for t := 0; t < trials; t++ {
		root := randomTree(rng.Intn(31))
		ref := show(bfsLast(root))
		if show(bfsRightFirst(root)) == ref && show(dfsRightFirst(root)) == ref &&
			show(dfsRightFirstIterative(root)) == ref && show(dfsOverwrite(root)) == ref {
			agree++
		}
		if show(wrongRightPointers(root)) != ref {
			rightWrong++
		}
	}
	fmt.Printf("\nđối chiếu %d cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau %d/%d; wrongRightPointers sai %d cây\n",
		trials, agree, trials, rightWrong)

	median := func(fn func()) float64 {
		ts := make([]float64, 5)
		for i := range ts {
			t0 := time.Now()
			fn()
			ts[i] = float64(time.Since(t0).Microseconds()) / 1000
		}
		sort.Float64s(ts)
		return ts[2]
	}
	fmt.Println("\nthời gian trung vị 5 lần (ms)")
	for _, e := range []struct {
		label string
		n     int
	}{{"2^17 − 1", 1<<17 - 1}, {"2^20 − 1", 1<<20 - 1}} {
		r := complete(e.n)
		fmt.Printf("cây đầy đủ %-9s bfsLast %.2f   bfsRightFirst %.2f   dfsRightFirst %.2f   dfsRightFirstIterative %.2f\n",
			e.label, median(func() { bfsLast(r) }), median(func() { bfsRightFirst(r) }),
			median(func() { dfsRightFirst(r) }), median(func() { dfsRightFirstIterative(r) }))
	}
	// Ngăn xếp goroutine tự lớn, nên đệ quy trên chuỗi dài vẫn chạy (ngoài giới hạn đề, chỉ để so).
	fmt.Printf("dfsRightFirst trên chuỗi trái 10^6 nút: %d số\n", len(dfsRightFirst(leftChain(1000000))))
}
