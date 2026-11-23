// LC 138 Copy List with Random Pointer: map con trỏ cũ → mới, đan nút, và bẫy chép giá trị struct (*cur).
// Chạy: go run copy_random_list.go
package main

import (
	"fmt"
	"math/rand/v2"
	"runtime"
	"sort"
	"strings"
	"time"
)

type Node struct {
	Val    int
	Next   *Node
	Random *Node
}

type entry struct {
	val int
	rnd int // -1: null
}

func build(spec []entry) *Node {
	nodes := make([]*Node, len(spec))
	for i, e := range spec {
		nodes[i] = &Node{Val: e.val}
	}
	for i, e := range spec {
		if i+1 < len(nodes) {
			nodes[i].Next = nodes[i+1]
		}
		if e.rnd >= 0 {
			nodes[i].Random = nodes[e.rnd]
		}
	}
	if len(nodes) == 0 {
		return nil
	}
	return nodes[0]
}

func toSpec(head *Node) []entry {
	var nodes []*Node
	for cur := head; cur != nil && len(nodes) <= 100000; cur = cur.Next {
		nodes = append(nodes, cur)
	}
	index := map[*Node]int{}
	for i, n := range nodes {
		index[n] = i
	}
	out := make([]entry, len(nodes))
	for i, n := range nodes {
		r := -1
		if n.Random != nil {
			if j, ok := index[n.Random]; ok {
				r = j
			} else {
				r = -2
			}
		}
		out[i] = entry{n.Val, r}
	}
	return out
}

// Cách 1: map con trỏ nút cũ → nút mới, hai lượt. Khóa *Node so bằng địa chỉ.
func copyTwoPass(head *Node) *Node {
	m := map[*Node]*Node{nil: nil}
	for cur := head; cur != nil; cur = cur.Next {
		m[cur] = &Node{Val: cur.Val}
	}
	for cur := head; cur != nil; cur = cur.Next {
		m[cur].Next = m[cur.Next]
		m[cur].Random = m[cur.Random]
	}
	return m[head]
}

// Cách 3: đan bản sao sau nút gốc, đặt random, tách ra.
func copyInterleave(head *Node) *Node {
	if head == nil {
		return nil
	}
	for cur := head; cur != nil; cur = cur.Next.Next {
		cur.Next = &Node{Val: cur.Val, Next: cur.Next}
	}
	for cur := head; cur != nil; cur = cur.Next.Next {
		if cur.Random != nil {
			cur.Next.Random = cur.Random.Next
		}
	}
	newHead := head.Next
	for cur := head; cur != nil; cur = cur.Next {
		c := cur.Next
		cur.Next = c.Next
		if c.Next != nil {
			c.Next = c.Next.Next
		}
	}
	return newHead
}

// SAI: c := *cur chép cả struct, nên Next và Random của bản sao vẫn là con trỏ vào danh sách CŨ (chép nông).
func wrongStructCopy(head *Node) *Node {
	if head == nil {
		return nil
	}
	c := *head
	return &c
}

func check(fn func(*Node) *Node, spec []entry) string {
	head := build(spec)
	originals := map[*Node]bool{}
	for cur := head; cur != nil; cur = cur.Next {
		originals[cur] = true
	}
	c := fn(head)
	for cur := c; cur != nil; cur = cur.Next {
		if originals[cur] || (cur.Random != nil && originals[cur.Random]) {
			return "dùng chung nút với danh sách gốc"
		}
	}
	if fmt.Sprint(toSpec(c)) != fmt.Sprint(spec) {
		return "sai cấu trúc"
	}
	if fmt.Sprint(toSpec(head)) != fmt.Sprint(spec) {
		return "danh sách gốc bị đổi"
	}
	return ""
}

type tc struct {
	name string
	spec []entry
}

var cases = []tc{
	{"ví dụ 1 của đề", []entry{{7, -1}, {13, 0}, {11, 4}, {10, 2}, {1, 0}}},
	{"ví dụ 2", []entry{{1, 1}, {2, 1}}},
	{"ví dụ 3 (giá trị trùng)", []entry{{3, -1}, {3, 0}, {3, -1}}},
	{"rỗng", []entry{}},
	{"một nút tự trỏ", []entry{{5, 0}}},
	{"mọi random null", []entry{{1, -1}, {2, -1}, {3, -1}}},
	{"mọi random trỏ nút cuối", []entry{{1, 3}, {2, 3}, {3, 3}, {4, 3}}},
}

func median(f func() time.Duration) float64 {
	ts := make([]float64, 5)
	for i := range ts {
		ts[i] = float64(f().Microseconds()) / 1000
	}
	sort.Float64s(ts)
	return ts[2]
}

func main() {
	fns := []struct {
		name string
		fn   func(*Node) *Node
	}{{"copyTwoPass", copyTwoPass}, {"copyInterleave", copyInterleave}, {"wrongStructCopy", wrongStructCopy}}
	for _, f := range fns {
		var bad []string
		for _, c := range cases {
			if err := check(f.fn, c.spec); err != "" {
				bad = append(bad, c.name+" → "+err)
			}
		}
		line := fmt.Sprintf("%-16s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			line += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(line)
	}

	r := rand.New(rand.NewPCG(138, 2))
	fmt.Println("\nn nút      hai lượt (map)               đan nút")
	for _, n := range []int{100000, 1000000} {
		spec := make([]entry, n)
		for i := range spec {
			rnd := -1
			if r.Float64() >= 0.2 {
				rnd = r.IntN(n)
			}
			spec[i] = entry{r.IntN(20001) - 10000, rnd}
		}
		var cells []string
		for _, fn := range []func(*Node) *Node{copyTwoPass, copyInterleave} {
			var alloc uint64
			ms := median(func() time.Duration {
				head := build(spec)
				runtime.GC()
				var a, b runtime.MemStats
				runtime.ReadMemStats(&a)
				t0 := time.Now()
				fn(head)
				d := time.Since(t0)
				runtime.ReadMemStats(&b)
				alloc = b.TotalAlloc - a.TotalAlloc
				return d
			})
			cells = append(cells, fmt.Sprintf("%9.2f ms %7.1f MB cấp phát", ms, float64(alloc)/1e6))
		}
		fmt.Printf("%-10d %s\n", n, strings.Join(cells, "   "))
	}
}
