// LC 543 Diameter of Binary Tree: tính lại chiều cao, một lượt hậu thứ tự bằng closure, bản lặp, và bẫy truyền int theo giá trị.
// Chạy: go run diameter.go
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

func leftChain(n int) *TreeNode {
	var root *TreeNode
	for i := 0; i < n; i++ {
		root = &TreeNode{Val: i, Left: root}
	}
	return root
}

// height: số nút trên đường dài nhất đi xuống; cây rỗng là 0.
func height(node *TreeNode) int {
	if node == nil {
		return 0
	}
	return 1 + max(height(node.Left), height(node.Right))
}

// Cách 1: tính lại chiều cao ở mọi nút.
func diameterNaive(root *TreeNode) int {
	if root == nil {
		return 0
	}
	return max(height(root.Left)+height(root.Right), diameterNaive(root.Left), diameterNaive(root.Right))
}

// Cách 2: closure đệ quy phải khai báo trước (var dfs func...) rồi mới gán, để thân hàm gọi được chính nó.
func diameterOnePass(root *TreeNode) int {
	best := 0
	var dfs func(*TreeNode) int
	dfs = func(node *TreeNode) int {
		if node == nil {
			return 0
		}
		l, r := dfs(node.Left), dfs(node.Right)
		best = max(best, l+r) // closure giữ tham chiếu tới best của hàm ngoài
		return 1 + max(l, r)
	}
	dfs(root)
	return best
}

// Cách 3: tiền thứ tự bằng ngăn xếp, xử lý ngược. Chiều cao lưu trong map theo con trỏ nút.
func diameterIterative(root *TreeNode) int {
	if root == nil {
		return 0
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
	h := make(map[*TreeNode]int, len(order)+1) // h[nil] đọc ra 0, đúng chiều cao cây rỗng
	best := 0
	for i := len(order) - 1; i >= 0; i-- {
		node := order[i]
		l, r := h[node.Left], h[node.Right]
		best = max(best, l+r)
		h[node] = 1 + max(l, r)
	}
	return best
}

// SAI: hàm phụ nhận best kiểu int, tức một bản sao. Mọi cập nhật mất khi hàm trả về, kết quả luôn 0.
func dfsByValue(node *TreeNode, best int) int {
	if node == nil {
		return 0
	}
	l, r := dfsByValue(node.Left, best), dfsByValue(node.Right, best)
	best = max(best, l+r)
	return 1 + max(l, r)
}

func wrongByValue(root *TreeNode) int {
	best := 0
	dfsByValue(root, best)
	return best
}

// Sửa bản trên: truyền *int.
func dfsByPointer(node *TreeNode, best *int) int {
	if node == nil {
		return 0
	}
	l, r := dfsByPointer(node.Left, best), dfsByPointer(node.Right, best)
	*best = max(*best, l+r)
	return 1 + max(l, r)
}

func diameterPointer(root *TreeNode) int {
	best := 0
	dfsByPointer(root, &best)
	return best
}

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
	full := make([]int, 15)
	for i := range full {
		full[i] = i
	}
	type tc struct {
		name string
		make func() *TreeNode
		want int
	}
	cases := []tc{
		{"một nút", func() *TreeNode { return build([]int{7}) }, 0},
		{"hai nút", func() *TreeNode { return build([]int{7, 3}) }, 1},
		{"rẽ ở gốc", func() *TreeNode { return build([]int{1, 2, 3, null, 4, 5, 6}) }, 4},
		{"không đi qua gốc", func() *TreeNode { return build([]int{1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8}) }, 6},
		{"cây đầy 15 nút", func() *TreeNode { return build(full) }, 6},
		{"giá trị âm", func() *TreeNode { return build([]int{-1, -2, -3, -4, null, null, -5}) }, 4},
		{"chuỗi lệch 10⁴ nút (giới hạn đề)", func() *TreeNode { return leftChain(10000) }, 9999},
	}
	fns := []struct {
		name string
		fn   func(*TreeNode) int
	}{
		{"diameterNaive", diameterNaive}, {"diameterOnePass", diameterOnePass}, {"diameterIterative", diameterIterative},
		{"diameterPointer", diameterPointer}, {"wrongByValue", wrongByValue},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			if got := f.fn(c.make()); got != c.want {
				bad = append(bad, fmt.Sprintf("%s → %d", c.name, got))
			}
		}
		suffix := ""
		if len(bad) > 0 {
			suffix = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-18s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), suffix)
	}

	// Go không có giới hạn độ sâu cố định: stack của goroutine tự nới tới 1 GB. Đệ quy vẫn tốn hơn vòng lặp.
	fmt.Println("\nchuỗi lệch 10⁶ nút, trung vị 5 lần (ms)")
	root := leftChain(1000000)
	fmt.Printf("một lượt đệ quy  %8.2f  (kết quả %d)\n", median(func() { diameterOnePass(root) }, 5), diameterOnePass(root))
	fmt.Printf("bản lặp          %8.2f  (kết quả %d)\n", median(func() { diameterIterative(root) }, 5), diameterIterative(root))
}
