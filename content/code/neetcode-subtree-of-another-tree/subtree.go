// LC 572 Subtree of Another Tree: so ở mọi nút O(m·n), tuần tự hóa + tìm chuỗi (có sẵn hoặc KMP),
// hash Merkle kiểm lại khi trùng, và đánh số cây con (không va chạm).
// Chạy: go run subtree.go
package main

import (
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"
)

type TreeNode struct {
	Val         int
	Left, Right *TreeNode
}

// none đánh dấu chỗ trống (ngoài khoảng giá trị [-10⁴, 10⁴] của đề).
const none = 1 << 30

func build(level []int) *TreeNode {
	if len(level) == 0 || level[0] == none {
		return nil
	}
	root := &TreeNode{Val: level[0]}
	queue := []*TreeNode{root}
	for i := 1; i < len(level); {
		node := queue[0]
		queue = queue[1:]
		if level[i] != none {
			node.Left = &TreeNode{Val: level[i]}
			queue = append(queue, node.Left)
		}
		i++
		if i < len(level) && level[i] != none {
			node.Right = &TreeNode{Val: level[i]}
			queue = append(queue, node.Right)
		}
		i++
	}
	return root
}

// chain: cây lệch trái n nút giá trị 1, nút sâu nhất mang giá trị bottom.
func chain(n, bottom int) *TreeNode {
	var root *TreeNode
	for i := 0; i < n; i++ {
		v := 1
		if i == 0 {
			v = bottom
		}
		root = &TreeNode{Val: v, Left: root}
	}
	return root
}

// isSame: so hai cây (bài 100), bản vòng lặp.
func isSame(p, q *TreeNode) bool {
	stack := []*TreeNode{p, q}
	for len(stack) > 0 {
		a, b := stack[len(stack)-2], stack[len(stack)-1]
		stack = stack[:len(stack)-2]
		if a == nil && b == nil {
			continue
		}
		if a == nil || b == nil || a.Val != b.Val {
			return false
		}
		stack = append(stack, a.Right, b.Right, a.Left, b.Left)
	}
	return true
}

func preorderNodes(root *TreeNode) []*TreeNode {
	out := []*TreeNode{}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if n != nil {
			out = append(out, n)
			stack = append(stack, n.Right, n.Left)
		}
	}
	return out
}

// Cách 1 (dạng đệ quy quen thuộc).
func isSameRec(p, q *TreeNode) bool {
	if p == nil || q == nil {
		return p == q
	}
	return p.Val == q.Val && isSameRec(p.Left, q.Left) && isSameRec(p.Right, q.Right)
}

func isSubtreeRecursive(root, sub *TreeNode) bool {
	if root == nil {
		return sub == nil
	}
	return isSameRec(root, sub) || isSubtreeRecursive(root.Left, sub) || isSubtreeRecursive(root.Right, sub)
}

// Cách 1 (vòng lặp): thử so ở từng nút. O(m·n) xấu nhất.
func isSubtreeNaive(root, sub *TreeNode) bool {
	if sub == nil {
		return true
	}
	for _, n := range preorderNodes(root) {
		if isSame(n, sub) {
			return true
		}
	}
	return false
}

// serializeString: mỗi nút ",giá trị", mỗi chỗ trống ",#". Dấu phẩy đứng TRƯỚC mỗi phần tử.
func serializeString(root *TreeNode) string {
	var sb strings.Builder
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if n == nil {
			sb.WriteString(",#")
			continue
		}
		sb.WriteByte(',')
		sb.WriteString(strconv.Itoa(n.Val))
		stack = append(stack, n.Right, n.Left)
	}
	return sb.String()
}

// Cách 2a: tuần tự hóa rồi strings.Contains.
func isSubtreeString(root, sub *TreeNode) bool {
	return strings.Contains(serializeString(root), serializeString(sub))
}

func serializeInts(root *TreeNode) []int {
	out := []int{}
	stack := []*TreeNode{root}
	for len(stack) > 0 {
		n := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		if n == nil {
			out = append(out, none)
			continue
		}
		out = append(out, n.Val)
		stack = append(stack, n.Right, n.Left)
	}
	return out
}

func kmpContains(text, pat []int) bool {
	fail := make([]int, len(pat))
	for i, k := 1, 0; i < len(pat); i++ {
		for k > 0 && pat[i] != pat[k] {
			k = fail[k-1]
		}
		if pat[i] == pat[k] {
			k++
		}
		fail[i] = k
	}
	for i, k := 0, 0; i < len(text); i++ {
		for k > 0 && text[i] != pat[k] {
			k = fail[k-1]
		}
		if text[i] == pat[k] {
			k++
		}
		if k == len(pat) {
			return true
		}
	}
	return false
}

// Cách 2b: tuần tự hóa thành slice số rồi KMP.
func isSubtreeKmp(root, sub *TreeNode) bool {
	return kmpContains(serializeInts(root), serializeInts(sub))
}

const nullHash uint32 = 0x165667b1

// fmix32: hàm trộn cuối của MurmurHash3; uint32 tự cắt về 32 bit sau mỗi phép nhân.
func fmix32(h uint32) uint32 {
	h ^= h >> 16
	h *= 0x85ebca6b
	h ^= h >> 13
	h *= 0xc2b2ae35
	return h ^ h>>16
}

func nodeHash(val int, hl, hr uint32) uint32 {
	return fmix32(hl*0x9e3779b1 ^ (hr^0x85ebca6b)*0xc2b2ae35 ^ uint32(int32(val)+0x27d4eb2f))
}

func subtreeHashes(root *TreeNode) map[*TreeNode]uint32 {
	hashes := map[*TreeNode]uint32{}
	get := func(n *TreeNode) uint32 {
		if n == nil {
			return nullHash
		}
		return hashes[n]
	}
	nodes := preorderNodes(root)
	for i := len(nodes) - 1; i >= 0; i-- {
		n := nodes[i]
		hashes[n] = nodeHash(n.Val, get(n.Left), get(n.Right))
	}
	return hashes
}

// Cách 3: hash Merkle, trùng hash thì so lại thật.
func isSubtreeHash(root, sub *TreeNode) bool {
	if sub == nil {
		return true
	}
	target := subtreeHashes(sub)[sub]
	for n, h := range subtreeHashes(root) {
		if h == target && isSame(n, sub) {
			return true
		}
	}
	return false
}

type triple struct{ val, l, r int }

// Cách 4: đánh số cây con. Khóa là struct (giá trị, số con trái, số con phải), dùng thẳng làm khóa map.
func isSubtreeIds(root, sub *TreeNode) bool {
	if sub == nil {
		return true
	}
	ids := map[triple]int{}
	idOf := map[*TreeNode]int{nil: 0}
	subNodes := preorderNodes(sub)
	for i := len(subNodes) - 1; i >= 0; i-- {
		n := subNodes[i]
		k := triple{n.Val, idOf[n.Left], idOf[n.Right]}
		if _, ok := ids[k]; !ok {
			ids[k] = len(ids) + 1
		}
		idOf[n] = ids[k]
	}
	target := idOf[sub]
	rootNodes := preorderNodes(root)
	for i := len(rootNodes) - 1; i >= 0; i-- {
		n := rootNodes[i]
		id, ok := ids[triple{n.Val, idOf[n.Left], idOf[n.Right]}]
		if !ok {
			id = -1 // không có trong sub
		}
		if id == target {
			return true
		}
		idOf[n] = id
	}
	return false
}

// SAI: tuần tự hóa không ghi chỗ trống: chỉ còn dãy giá trị preorder.
func wrongNoNullMarkers(root, sub *TreeNode) bool {
	vals := func(t *TreeNode) string {
		var sb strings.Builder
		for _, n := range preorderNodes(t) {
			sb.WriteString("," + strconv.Itoa(n.Val))
		}
		return sb.String()
	}
	return strings.Contains(vals(root), vals(sub))
}

func medianMs(fn func(), reps int) float64 {
	ts := make([]float64, reps)
	for r := range ts {
		t0 := time.Now()
		fn()
		ts[r] = float64(time.Since(t0).Microseconds()) / 1000
	}
	sort.Float64s(ts)
	return ts[reps/2]
}

func main() {
	cases := []struct {
		name      string
		root, sub *TreeNode
		want      bool
	}{
		{"khớp nhánh trái", build([]int{7, 8, 9, 4, 5}), build([]int{8, 4, 5}), true},
		{"nút 5 có thêm con", build([]int{7, 8, 9, 4, 5, none, none, none, none, 6}), build([]int{8, 4, 5}), false},
		{"12 và 2", build([]int{12}), build([]int{2}), false},
		{"-3 và 3", build([]int{-3}), build([]int{3}), false},
		{"trùng cả cây", build([]int{1, 2, 3}), build([]int{1, 2, 3}), true},
		{"sub là lá", build([]int{1, 2, 3}), build([]int{3}), true},
		{"lá và nút có con", build([]int{1, 2, 3, none, none, 4}), build([]int{3}), false},
		{"giá trị lặp", build([]int{1, 1}), build([]int{1}), true},
		{"trái và phải", build([]int{1, 2}), build([]int{1, none, 2}), false},
		{"cùng tổng giá trị", build([]int{1, 2, 3}), build([]int{3, 1, 2}), false},
		{"số âm", build([]int{-1, -2, -3}), build([]int{-3}), true},
		{"trùng Objects.hash", build([]int{1, 1}), build([]int{1, none, 961}), false},
		{"lệch 2000 và 1000", chain(2000, 1), chain(1000, 1), true},
		{"lệch, đáy khác", chain(2000, 1), chain(1000, 2), false},
	}
	fns := []struct {
		name string
		fn   func(root, sub *TreeNode) bool
	}{
		{"isSubtreeRecursive", isSubtreeRecursive}, {"isSubtreeNaive", isSubtreeNaive},
		{"isSubtreeString", isSubtreeString}, {"isSubtreeKmp", isSubtreeKmp},
		{"isSubtreeHash", isSubtreeHash}, {"isSubtreeIds", isSubtreeIds},
		{"wrongNoNullMarkers", wrongNoNullMarkers},
	}
	for _, f := range fns {
		bad := []string{}
		for _, c := range cases {
			if got := f.fn(c.root, c.sub); got != c.want {
				bad = append(bad, fmt.Sprintf("%s → %v", c.name, got))
			}
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-19s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), tail)
	}

	fmt.Println("\nroot lệch m nút, sub lệch n nút khác ở đáy, trung vị 5 lần (ms)")
	fmt.Printf("%-9s %-8s %8s %8s %8s %8s %8s\n", "m", "n", "mọi nút", "Contains", "KMP", "hash", "đánh số")
	for _, mn := range [][2]int{{2000, 1000}, {20000, 10000}, {200000, 100000}, {2_000_000, 1_000_000}} {
		m, n := mn[0], mn[1]
		root, sub := chain(m, 1), chain(n, 2)
		row := []string{}
		for _, f := range fns[1:6] {
			if f.name == "isSubtreeNaive" && m > 2000 { // cỡ 20000 mất khoảng 17 giây
				row = append(row, "")
				continue
			}
			reps := 5
			if m > 200000 {
				reps = 3
			}
			row = append(row, fmt.Sprintf("%.2f", medianMs(func() { f.fn(root, sub) }, reps)))
		}
		fmt.Printf("%-9d %-8d %8s %8s %8s %8s %8s\n", m, n, row[0], row[1], row[2], row[3], row[4])
	}
}
