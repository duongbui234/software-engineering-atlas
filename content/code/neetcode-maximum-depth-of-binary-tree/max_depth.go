// LC 104 Maximum Depth of Binary Tree: đệ quy hậu thứ tự, DFS bằng ngăn xếp tự quản, BFS đếm tầng.
// Chạy: go run max_depth.go
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

// Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng (nil) sâu 0.
func maxDepthRecursive(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return 1 + max(maxDepthRecursive(root.Left), maxDepthRecursive(root.Right))
}

type item struct {
	node  *TreeNode
	depth int
}

// Cách 2: DFS với ngăn xếp tự quản; mỗi phần tử mang theo độ sâu của nút.
func maxDepthStack(root *TreeNode) int {
	if root == nil {
		return 0
	}
	best := 0
	stack := []item{{root, 1}}
	for len(stack) > 0 {
		top := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		best = max(best, top.depth)
		if top.node.Left != nil {
			stack = append(stack, item{top.node.Left, top.depth + 1})
		}
		if top.node.Right != nil {
			stack = append(stack, item{top.node.Right, top.depth + 1})
		}
	}
	return best
}

// Cách 3: BFS theo tầng; số vòng ngoài là độ sâu.
func maxDepthBfs(root *TreeNode) int {
	if root == nil {
		return 0
	}
	level, depth := []*TreeNode{root}, 0
	for len(level) > 0 {
		depth++
		var next []*TreeNode
		for _, node := range level {
			if node.Left != nil {
				next = append(next, node.Left)
			}
			if node.Right != nil {
				next = append(next, node.Right)
			}
		}
		level = next
	}
	return depth
}

// SAI: chỉ kiểm nil ở con trước khi gọi đệ quy, quên kiểm chính root. Cây rỗng thì root.Left panic.
func wrongNoRootCheck(root *TreeNode) int {
	l, r := 0, 0
	if root.Left != nil {
		l = wrongNoRootCheck(root.Left)
	}
	if root.Right != nil {
		r = wrongNoRootCheck(root.Right)
	}
	return 1 + max(l, r)
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

// randomTree: mỗi nút mới gắn vào một chỗ trống chọn ngẫu nhiên; trả kèm độ sâu đúng.
func randomTree(rnd func() float64, n int) (*TreeNode, int) {
	if n == 0 {
		return nil, 0
	}
	type slot struct {
		ptr   **TreeNode
		depth int
	}
	root := &TreeNode{}
	slots := []slot{{&root.Left, 2}, {&root.Right, 2}}
	depth := 1
	for i := 1; i < n; i++ {
		j := int(rnd() * float64(len(slots)))
		s := slots[j]
		slots[j] = slots[len(slots)-1]
		slots = slots[:len(slots)-1]
		node := &TreeNode{Val: i}
		*s.ptr = node
		depth = max(depth, s.depth)
		slots = append(slots, slot{&node.Left, s.depth + 1}, slot{&node.Right, s.depth + 1})
	}
	return root, depth
}

func chain(d int) *TreeNode {
	root := &TreeNode{}
	cur := root
	for i := 1; i < d; i++ {
		cur.Left = &TreeNode{Val: i}
		cur = cur.Left
	}
	return root
}

func medianMs(fn func(*TreeNode) int, root *TreeNode, want int) string {
	ts := []float64{}
	got := 0
	for r := 0; r < 5; r++ {
		t0 := time.Now()
		got = fn(root)
		ts = append(ts, float64(time.Since(t0).Microseconds())/1000)
	}
	if got != want {
		return fmt.Sprintf("sai %d", got)
	}
	slices.Sort(ts)
	return fmt.Sprintf("%.2f", ts[2])
}

// run gọi fn và biến panic thành chuỗi để in ra.
func run(fn func(*TreeNode) int, root *TreeNode) (got int, err string) {
	defer func() {
		if r := recover(); r != nil {
			err = "panic"
		}
	}()
	return fn(root), ""
}

func main() {
	cases := []struct {
		name string
		vals []int
		want int
	}{
		{"cây rỗng", []int{}, 0},
		{"một nút", []int{5}, 1},
		{"chỉ có con phải", []int{1, null, 2}, 2},
		{"cây đủ 3 tầng", []int{1, 2, 3, 4, 5, 6, 7}, 3},
		{"nhánh sâu bên phải", []int{8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13}, 4},
		{"chuỗi trái 6 nút", []int{1, 2, null, 3, null, 4, null, 5, null, 6}, 6},
		{"zigzag 5 tầng", []int{1, 2, null, null, 3, 4, null, null, 5}, 5},
		{"giá trị âm và 0", []int{0, -1, -2, null, -3}, 3},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) int
	}{
		{"maxDepthRecursive", maxDepthRecursive},
		{"maxDepthStack", maxDepthStack},
		{"maxDepthBfs", maxDepthBfs},
		{"wrongNoRootCheck", wrongNoRootCheck},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			got, err := run(f.fn, fromLevel(c.vals))
			if err != "" {
				bad = append(bad, c.name+" → "+err)
			} else if got != c.want {
				bad = append(bad, fmt.Sprintf("%s → %d (đúng là %d)", c.name, got, c.want))
			}
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-18s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), tail)
	}

	rnd := mulberry32(104)
	ok := []int{0, 0, 0}
	for t := 0; t < 2000; t++ {
		root, want := randomTree(rnd, int(rnd()*41))
		for j := 0; j < 3; j++ {
			if fns[j].fn(root) == want {
				ok[j]++
			}
		}
	}
	fmt.Printf("\nngẫu nhiên: %s %d/2000, %s %d/2000, %s %d/2000\n", fns[0].name, ok[0], fns[1].name, ok[1], fns[2].name, ok[2])

	// Goroutine bắt đầu với ngăn xếp vài KB và tự nới (tối đa 1 GB trên máy 64 bit), nên đệ quy 10⁷ tầng
	// vẫn chạy. Vượt 1 GB thì không phải panic bắt được mà là lỗi chết cả chương trình.
	fmt.Println("\nChuỗi lệch trái d nút, trung vị 5 lần (ms)")
	fmt.Println("d            đệ quy   ngăn xếp        BFS")
	for _, d := range []int{1_000, 100_000, 1_000_000, 10_000_000} {
		root := chain(d)
		fmt.Printf("%-10d", d)
		for j := 0; j < 3; j++ {
			fmt.Printf(" %10s", medianMs(fns[j].fn, root, d))
		}
		fmt.Println()
	}

	n := 1<<20 - 1
	nodes := make([]TreeNode, n)
	for i := 0; 2*i+2 < n; i++ {
		nodes[i].Left, nodes[i].Right = &nodes[2*i+1], &nodes[2*i+2]
	}
	fmt.Printf("\nCây đầy đủ %d nút, trung vị 5 lần (ms)\n", n)
	for j := 0; j < 3; j++ {
		fmt.Printf("%-18s %8s\n", fns[j].name, medianMs(fns[j].fn, &nodes[0], 20))
	}
}
