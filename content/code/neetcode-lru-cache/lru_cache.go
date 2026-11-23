// LeetCode 146: LRU Cache. Danh sách hai chiều tự viết và container/list của thư viện chuẩn.
// Chạy: go run lru_cache.go
package main

import (
	"container/list"
	"fmt"
	"slices"
	"sort"
	"strings"
	"time"
)

type Cache interface {
	Get(key int) int
	Put(key, val int)
}

type dnode struct {
	key, val   int
	prev, next *dnode
}

// Cách 1: map tra key → nút; danh sách hai chiều có hai nút canh. Sau head là mới dùng nhất.
type LRUList struct {
	cap        int
	m          map[int]*dnode
	head, tail *dnode
}

func NewLRUList(capacity int) *LRUList {
	c := &LRUList{cap: capacity, m: make(map[int]*dnode, capacity), head: &dnode{}, tail: &dnode{}}
	c.head.next, c.tail.prev = c.tail, c.head
	return c
}

func (c *LRUList) unlink(n *dnode) { n.prev.next, n.next.prev = n.next, n.prev }
func (c *LRUList) pushFront(n *dnode) {
	n.prev, n.next = c.head, c.head.next
	c.head.next.prev = n
	c.head.next = n
}

func (c *LRUList) Get(key int) int {
	n, ok := c.m[key]
	if !ok {
		return -1
	}
	c.unlink(n)
	c.pushFront(n)
	return n.val
}

func (c *LRUList) Put(key, val int) {
	if n, ok := c.m[key]; ok {
		n.val = val
		c.unlink(n)
		c.pushFront(n)
		return
	}
	if len(c.m) == c.cap {
		old := c.tail.prev
		c.unlink(old)
		delete(c.m, old.key)
	}
	n := &dnode{key: key, val: val}
	c.m[key] = n
	c.pushFront(n)
}

// Cách 2: container/list là danh sách hai chiều có sẵn; Value là interface nên phải ép kiểu khi đọc.
type entry struct{ key, val int }

type LRUContainer struct {
	cap int
	m   map[int]*list.Element
	l   *list.List
}

func NewLRUContainer(capacity int) *LRUContainer {
	return &LRUContainer{cap: capacity, m: make(map[int]*list.Element, capacity), l: list.New()}
}

func (c *LRUContainer) Get(key int) int {
	e, ok := c.m[key]
	if !ok {
		return -1
	}
	c.l.MoveToFront(e)
	return e.Value.(*entry).val
}

func (c *LRUContainer) Put(key, val int) {
	if e, ok := c.m[key]; ok {
		e.Value.(*entry).val = val
		c.l.MoveToFront(e)
		return
	}
	if c.l.Len() == c.cap {
		old := c.l.Back()
		c.l.Remove(old)
		delete(c.m, old.Value.(*entry).key)
	}
	c.m[key] = c.l.PushFront(&entry{key, val})
}

// SAI: gỡ nút cuối khỏi danh sách nhưng quên xóa khỏi map.
type WrongKeepInMap struct{ *LRUList }

func (c WrongKeepInMap) Put(key, val int) {
	if n, ok := c.m[key]; ok {
		n.val = val
		c.unlink(n)
		c.pushFront(n)
		return
	}
	if len(c.m) == c.cap {
		c.unlink(c.tail.prev) // thiếu delete(c.m, old.key)
	}
	n := &dnode{key: key, val: val}
	c.m[key] = n
	c.pushFront(n)
}

// Bản chậm làm chuẩn: slice key theo thứ tự dùng.
type LRUSlow struct {
	cap   int
	order []int
	vals  map[int]int
}

func (c *LRUSlow) touch(key int) {
	i := slices.Index(c.order, key)
	c.order = append(slices.Delete(c.order, i, i+1), key)
}
func (c *LRUSlow) Get(key int) int {
	v, ok := c.vals[key]
	if !ok {
		return -1
	}
	c.touch(key)
	return v
}
func (c *LRUSlow) Put(key, val int) {
	if _, ok := c.vals[key]; ok {
		c.vals[key] = val
		c.touch(key)
		return
	}
	if len(c.order) == c.cap {
		delete(c.vals, c.order[0])
		c.order = c.order[1:]
	}
	c.order = append(c.order, key)
	c.vals[key] = val
}

// Bộ sinh ngẫu nhiên mulberry32 (giống bản TypeScript), số học uint32.
func mulberry32(a uint32) func() float64 {
	return func() float64 {
		a += 0x6D2B79F5
		t := (a ^ a>>15) * (1 | a)
		t = (t + (t^t>>7)*(61|t)) ^ t
		return float64(t^t>>14) / 4294967296
	}
}

type op struct{ put, key, val int } // put = 0: get, put = 1: put

func randomOps(n, keys int, seed uint32) []op {
	r := mulberry32(seed)
	ops := make([]op, 0, n)
	for i := 0; i < n; i++ {
		k := int(r() * float64(keys))
		if r() < 0.5 {
			ops = append(ops, op{0, k, 0})
		} else {
			ops = append(ops, op{1, k, int(r() * 1000)})
		}
	}
	return ops
}

func run(c Cache, ops []op) []int {
	out := []int{}
	for _, o := range ops {
		if o.put == 0 {
			out = append(out, c.Get(o.key))
		} else {
			c.Put(o.key, o.val)
		}
	}
	return out
}

func g(k int) op    { return op{0, k, 0} }
func p(k, v int) op { return op{1, k, v} }

func main() {
	type tc struct {
		name string
		cap  int
		ops  []op
	}
	cases := []tc{
		{"ví dụ của đề", 2, []op{p(1, 1), p(2, 2), g(1), p(3, 3), g(2), p(4, 4), g(1), g(3), g(4)}},
		{"cập nhật key cũ", 2, []op{p(2, 1), p(1, 1), p(2, 3), p(4, 1), g(1), g(2)}},
		{"sức chứa 1", 1, []op{p(2, 1), g(2), p(3, 2), g(2), g(3)}},
		{"get key chưa có", 2, []op{g(5), p(5, 5), g(5)}},
		{"đẩy ra rồi thêm lại", 2, []op{p(1, 1), p(2, 2), p(3, 3), g(1), p(1, 10), g(1), g(2), g(3)}},
		{"ngẫu nhiên 1 (cap 3)", 3, randomOps(2000, 8, 1)},
		{"ngẫu nhiên 2 (cap 10)", 10, randomOps(2000, 25, 2)},
		{"ngẫu nhiên 3 (cap 50)", 50, randomOps(2000, 120, 3)},
	}
	impls := []struct {
		name string
		make func(int) Cache
	}{
		{"LRUList", func(c int) Cache { return NewLRUList(c) }},
		{"LRUContainer", func(c int) Cache { return NewLRUContainer(c) }},
		{"WrongKeepInMap", func(c int) Cache { return WrongKeepInMap{NewLRUList(c)} }},
	}
	for _, im := range impls {
		bad := []string{}
		for _, c := range cases {
			want := run(&LRUSlow{cap: c.cap, vals: map[int]int{}}, c.ops)
			if !slices.Equal(run(im.make(c.cap), c.ops), want) {
				bad = append(bad, c.name)
			}
		}
		msg := fmt.Sprintf("%-15s %d/%d ca đúng", im.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			msg += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(msg)
	}

	// Đo: 10⁶ thao tác, nửa get nửa put, key trong 0..2·cap − 1. Trung vị 5 lần chạy.
	fmt.Println("\nsức chứa   LRUList (tự viết)          LRUContainer (container/list)")
	for _, capacity := range []int{100, 10000} {
		ops := randomOps(1_000_000, 2*capacity, uint32(capacity))
		row := []string{}
		for _, make := range []func(int) Cache{impls[0].make, impls[1].make} {
			ts := []float64{}
			for r := 0; r < 5; r++ {
				c := make(capacity)
				t := time.Now()
				for _, o := range ops {
					if o.put == 0 {
						c.Get(o.key)
					} else {
						c.Put(o.key, o.val)
					}
				}
				ts = append(ts, float64(time.Since(t).Microseconds())/1000)
			}
			sort.Float64s(ts)
			row = append(row, fmt.Sprintf("%7.1f ms  %5.1f triệu/s", ts[2], 1e6/ts[2]/1000))
		}
		fmt.Printf("%-10d %s     %s\n", capacity, row[0], row[1])
	}
}
