// LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng (chỉ số đầu hàng và q = q[1:]),
// hai danh sách, vạch ngăn tầng, DFS mang độ sâu; hai cách sai chạy thật; nil và slice rỗng qua JSON.
// Chạy: go run level_order.go
package main

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"reflect"
	"sort"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

const null = 1 << 30 // đánh dấu chỗ trống khi dựng cây từ mảng

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

// Cách 1: BFS, chụp kích thước tầng. Hàng đợi là slice + chỉ số đầu hàng.
func levelSnapshot(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	head := 0
	for head < len(queue) {
		size := len(queue) - head // chụp trước khi đẩy con vào
		level := make([]int, 0, size)
		for i := 0; i < size; i++ {
			node := queue[head]
			head++
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		res = append(res, level)
	}
	return res
}

// Cách 1 với q = q[1:]: cắt đầu slice thay vì giữ chỉ số. Đúng, để đo.
func levelSnapshotReslice(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		size := len(queue)
		level := make([]int, 0, size)
		for i := 0; i < size; i++ {
			node := queue[0]
			queue = queue[1:]
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		res = append(res, level)
	}
	return res
}

// Cách 2: hai danh sách.
func levelTwoLists(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	cur := []*TreeNode{root}
	for len(cur) > 0 {
		level := make([]int, len(cur))
		next := make([]*TreeNode, 0, 2*len(cur))
		for i, node := range cur {
			level[i] = node.Val
			if node.Left != nil {
				next = append(next, node.Left)
			}
			if node.Right != nil {
				next = append(next, node.Right)
			}
		}
		res = append(res, level)
		cur = next
	}
	return res
}

// Cách 3: nil trong hàng đợi là vạch "hết một tầng".
func levelMarker(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root, nil}
	level := []int{}
	for head := 0; head < len(queue); head++ {
		node := queue[head]
		if node == nil {
			res = append(res, level)
			level = []int{}
			if head+1 < len(queue) {
				queue = append(queue, nil)
			}
			continue
		}
		level = append(level, node.Val)
		if node.Left != nil {
			queue = append(queue, node.Left)
		}
		if node.Right != nil {
			queue = append(queue, node.Right)
		}
	}
	return res
}

// Cách 4: DFS tiền thứ tự mang độ sâu. Closure ghi thẳng vào res của hàm ngoài.
func levelDfs(root *TreeNode) [][]int {
	res := [][]int{}
	var walk func(node *TreeNode, depth int)
	walk = func(node *TreeNode, depth int) {
		if node == nil {
			return
		}
		if len(res) == depth {
			res = append(res, []int{})
		}
		res[depth] = append(res[depth], node.Val)
		walk(node.Left, depth+1)
		walk(node.Right, depth+1)
	}
	walk(root, 0)
	return res
}

// Sai 1: điều kiện vòng for đọc len(queue) mỗi vòng, mà queue đang dài ra.
func wrongLiveLen(root *TreeNode) [][]int {
	res := [][]int{}
	if root == nil {
		return res
	}
	queue := []*TreeNode{root}
	for len(queue) > 0 {
		level := []int{}
		n := 0
		for i := 0; i < len(queue); i++ {
			node := queue[i]
			n++
			level = append(level, node.Val)
			if node.Left != nil {
				queue = append(queue, node.Left)
			}
			if node.Right != nil {
				queue = append(queue, node.Right)
			}
		}
		queue = queue[n:]
		res = append(res, level)
	}
	return res
}

// Sai 2: truyền res theo giá trị. append bên trong tạo slice mới, hàm gọi không thấy.
func dfsByValue(node *TreeNode, depth int, res [][]int) {
	if node == nil {
		return
	}
	if len(res) == depth {
		res = append(res, []int{})
	}
	res[depth] = append(res[depth], node.Val)
	dfsByValue(node.Left, depth+1, res)
	dfsByValue(node.Right, depth+1, res)
}

func wrongPassByValue(root *TreeNode) [][]int {
	res := [][]int{}
	dfsByValue(root, 0, res)
	return res
}

// ---------- ca chạy thử ----------

type testCase struct {
	name string
	tree func() *TreeNode
	want [][]int
}

func seq(a, b int) []int {
	out := []int{}
	for v := a; v <= b; v++ {
		out = append(out, v)
	}
	return out
}

func main() {
	limitArr := make([]int, 2000)
	for i := range limitArr {
		limitArr[i] = (i*37)%2001 - 1000
	}
	split := [][]int{}
	for start, w := 0, 1; start < len(limitArr); start, w = start+w, w*2 {
		end := start + w
		if end > len(limitArr) {
			end = len(limitArr)
		}
		split = append(split, limitArr[start:end])
	}
	chainWant := [][]int{}
	for i := 1; i <= 2000; i++ {
		chainWant = append(chainWant, []int{i})
	}
	n := null
	cases := []testCase{
		{"cây rỗng", func() *TreeNode { return nil }, [][]int{}},
		{"một nút", func() *TreeNode { return build([]int{7}) }, [][]int{{7}}},
		{"ba tầng có chỗ trống", func() *TreeNode { return build([]int{5, 2, 8, n, 4, 7, 9}) }, [][]int{{5}, {2, 8}, {4, 7, 9}}},
		{"chỉ con trái", func() *TreeNode { return build([]int{1, 2, n, 3, n, 4}) }, [][]int{{1}, {2}, {3}, {4}}},
		{"chỉ con phải", func() *TreeNode { return build([]int{1, n, 2, n, 3}) }, [][]int{{1}, {2}, {3}}},
		{"cây đầy 15 nút", func() *TreeNode { return build(seq(1, 15)) }, [][]int{{1}, {2, 3}, seq(4, 7), seq(8, 15)}},
		{"nhánh so le", func() *TreeNode { return build([]int{1, 2, 3, 4, n, n, 5, 6, n, n, 7}) }, [][]int{{1}, {2, 3}, {4, 5}, {6, 7}}},
		{"giá trị âm và trùng", func() *TreeNode { return build([]int{0, -1000, 1000, -1000, n, n, 1000}) }, [][]int{{0}, {-1000, 1000}, {-1000, 1000}}},
		{"cây đủ 2000 nút", func() *TreeNode { return build(limitArr) }, split},
		{"chuỗi trái 2000 nút", func() *TreeNode { return leftChain(2000) }, chainWant},
	}

	short := func(x [][]int) string {
		b, _ := json.Marshal(x)
		s := string(b)
		if len(s) > 40 {
			return s[:37] + "..."
		}
		return s
	}
	run := func(name string, fn func(*TreeNode) [][]int) {
		ok := 0
		bad := []string{}
		for _, c := range cases {
			got := fn(c.tree())
			if reflect.DeepEqual(got, c.want) {
				ok++
			} else {
				bad = append(bad, c.name+" → "+short(got))
			}
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-20s %d/%d ca đúng%s\n", name, ok, len(cases), tail)
	}
	run("levelSnapshot", levelSnapshot)
	run("levelSnapshotReslice", levelSnapshotReslice)
	run("levelTwoLists", levelTwoLists)
	run("levelMarker", levelMarker)
	run("levelDfs", levelDfs)
	run("wrongLiveLen", wrongLiveLen)
	run("wrongPassByValue", wrongPassByValue)

	// nil và slice rỗng giống nhau với len(), khác nhau khi đi qua encoding/json.
	var nilRes [][]int
	a, _ := json.Marshal(nilRes)
	b, _ := json.Marshal([][]int{})
	fmt.Printf("\ncây rỗng qua json.Marshal: var res [][]int → %s, [][]int{} → %s\n", a, b)

	// đối chiếu ngẫu nhiên
	rng := rand.New(rand.NewSource(42))
	randomTree := func(n int) *TreeNode {
		if n == 0 {
			return nil
		}
		nodes := []*TreeNode{{Val: rng.Intn(2001) - 1000}}
		for len(nodes) < n {
			p := nodes[rng.Intn(len(nodes))]
			c := &TreeNode{Val: rng.Intn(2001) - 1000}
			if rng.Intn(2) == 0 {
				if p.Left == nil {
					p.Left = c
					nodes = append(nodes, c)
				}
			} else if p.Right == nil {
				p.Right = c
				nodes = append(nodes, c)
			}
		}
		return nodes[0]
	}
	agree := 0
	for t := 0; t < 3000; t++ {
		r := randomTree(rng.Intn(60))
		x := levelSnapshot(r)
		if reflect.DeepEqual(x, levelSnapshotReslice(r)) && reflect.DeepEqual(x, levelTwoLists(r)) &&
			reflect.DeepEqual(x, levelMarker(r)) && reflect.DeepEqual(x, levelDfs(r)) {
			agree++
		}
	}
	fmt.Printf("\nđối chiếu 3000 cây ngẫu nhiên 0..59 nút: năm cách khớp nhau %d/3000\n", agree)

	// đo
	timed := func(fn func(*TreeNode) [][]int, root *TreeNode) float64 {
		xs := []float64{}
		for k := 0; k < 5; k++ {
			t0 := time.Now()
			fn(root)
			xs = append(xs, float64(time.Since(t0).Microseconds())/1000)
		}
		sort.Float64s(xs)
		return xs[2]
	}
	fmt.Println("\nthời gian trung vị 5 lần (ms), cây đầy")
	fmt.Printf("%8s %10s %11s %8s %14s %10s %7s\n", "n", "rộng nhất", "chụp tầng", "q[1:]", "hai danh sách", "vạch ngăn", "DFS")
	for _, size := range []int{2000, 1<<17 - 1, 1<<20 - 1} {
		root := build(seq(0, size-1))
		width := 0
		for _, l := range levelSnapshot(root) {
			if len(l) > width {
				width = len(l)
			}
		}
		fmt.Printf("%8d %10d %11.2f %8.2f %14.2f %10.2f %7.2f\n", size, width,
			timed(levelSnapshot, root), timed(levelSnapshotReslice, root), timed(levelTwoLists, root),
			timed(levelMarker, root), timed(levelDfs, root))
	}
}
