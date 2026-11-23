// Ga LINK-02: danh sách liên kết nâng cao. Giải 138, 2, 287, 146, 23, 25.
// Chạy: go run advanced_list_station.go
package main

import (
	"fmt"
	"slices"
	"strings"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

type RNode struct {
	Val          int
	Next, Random *RNode
}

func fromSlice(a []int) *ListNode {
	var head *ListNode
	for i := len(a) - 1; i >= 0; i-- {
		head = &ListNode{a[i], head}
	}
	return head
}

func toSlice(head *ListNode) []int {
	out := []int{}
	for p := head; p != nil; p = p.Next {
		out = append(out, p.Val)
	}
	return out
}

// 138: chèn bản sao sau mỗi nút, nối random qua bản sao, rồi tách hai danh sách.
func copyRandomList(head *RNode) *RNode {
	for p := head; p != nil; p = p.Next.Next {
		p.Next = &RNode{Val: p.Val, Next: p.Next}
	}
	for p := head; p != nil; p = p.Next.Next {
		if p.Random != nil {
			p.Next.Random = p.Random.Next
		}
	}
	dummy := &RNode{}
	tail := dummy
	for p := head; p != nil; p = p.Next {
		c := p.Next
		p.Next = c.Next
		tail.Next = c
		tail = c
	}
	return dummy.Next
}

// 2: cộng từng chữ số, mang số nhớ sang nút sau.
func addTwoNumbers(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail, carry := dummy, 0
	for a != nil || b != nil || carry > 0 {
		s := carry
		if a != nil {
			s, a = s+a.Val, a.Next
		}
		if b != nil {
			s, b = s+b.Val, b.Next
		}
		carry = s / 10
		tail.Next = &ListNode{Val: s % 10}
		tail = tail.Next
	}
	return dummy.Next
}

// 287: i → nums[i] là con trỏ next; số trùng là đầu vòng.
func findDuplicate(nums []int) int {
	slow, fast := nums[0], nums[nums[0]]
	for slow != fast {
		slow, fast = nums[slow], nums[nums[fast]]
	}
	p := 0
	for p != slow {
		p, slow = nums[p], nums[slow]
	}
	return p
}

// 146: map tra key → nút; danh sách hai chiều có hai nút canh.
type DNode struct {
	key, val   int
	prev, next *DNode
}

type LRUCache struct {
	cap        int
	m          map[int]*DNode
	head, tail *DNode
}

func NewLRUCache(capacity int) *LRUCache {
	c := &LRUCache{cap: capacity, m: map[int]*DNode{}, head: &DNode{}, tail: &DNode{}}
	c.head.next, c.tail.prev = c.tail, c.head
	return c
}

func (c *LRUCache) unlink(n *DNode) { n.prev.next, n.next.prev = n.next, n.prev }
func (c *LRUCache) pushFront(n *DNode) {
	n.prev, n.next = c.head, c.head.next
	c.head.next.prev = n
	c.head.next = n
}

func (c *LRUCache) Get(key int) int {
	n, ok := c.m[key]
	if !ok {
		return -1
	}
	c.unlink(n)
	c.pushFront(n)
	return n.val
}

func (c *LRUCache) Put(key, val int) {
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
	n := &DNode{key: key, val: val}
	c.m[key] = n
	c.pushFront(n)
}

// 23: trộn từng cặp, mỗi vòng số danh sách giảm một nửa.
func mergeTwo(a, b *ListNode) *ListNode {
	dummy := &ListNode{}
	tail := dummy
	for a != nil && b != nil {
		if a.Val <= b.Val {
			tail.Next, a = a, a.Next
		} else {
			tail.Next, b = b, b.Next
		}
		tail = tail.Next
	}
	if a != nil {
		tail.Next = a
	} else {
		tail.Next = b
	}
	return dummy.Next
}

func mergeKLists(lists []*ListNode) *ListNode {
	if len(lists) == 0 {
		return nil
	}
	for len(lists) > 1 {
		next := []*ListNode{}
		for i := 0; i < len(lists); i += 2 {
			if i+1 < len(lists) {
				next = append(next, mergeTwo(lists[i], lists[i+1]))
			} else {
				next = append(next, lists[i])
			}
		}
		lists = next
	}
	return lists[0]
}

// 25: đủ k nút thì lật khúc đó và nối lại.
func reverseKGroup(head *ListNode, k int) *ListNode {
	dummy := &ListNode{Next: head}
	groupPrev := dummy
	for {
		kth := groupPrev
		for i := 0; i < k && kth != nil; i++ {
			kth = kth.Next
		}
		if kth == nil {
			return dummy.Next
		}
		groupNext := kth.Next
		prev, cur := groupNext, groupPrev.Next
		for cur != groupNext {
			nx := cur.Next
			cur.Next, prev, cur = prev, cur, nx
		}
		first := groupPrev.Next
		groupPrev.Next = kth
		groupPrev = first
	}
}

type rspec struct {
	val, random int // random = -1: không trỏ đâu
}

func buildRandom(spec []rspec) *RNode {
	nodes := make([]*RNode, len(spec))
	for i, s := range spec {
		nodes[i] = &RNode{Val: s.val}
	}
	for i, s := range spec {
		if i+1 < len(nodes) {
			nodes[i].Next = nodes[i+1]
		}
		if s.random >= 0 {
			nodes[i].Random = nodes[s.random]
		}
	}
	if len(nodes) == 0 {
		return nil
	}
	return nodes[0]
}

func describeRandom(head *RNode) string {
	idx := map[*RNode]int{}
	i := 0
	for p := head; p != nil; p = p.Next {
		idx[p] = i
		i++
	}
	out := []string{}
	for p := head; p != nil; p = p.Next {
		r := "null"
		if p.Random != nil {
			r = fmt.Sprint(idx[p.Random])
		}
		out = append(out, fmt.Sprintf("%d:%s", p.Val, r))
	}
	return strings.Join(out, ",")
}

func sharesNode(a, b *RNode) bool {
	s := map[*RNode]bool{}
	for p := a; p != nil; p = p.Next {
		s[p] = true
	}
	for p := b; p != nil; p = p.Next {
		if s[p] {
			return true
		}
	}
	return false
}

type op struct {
	name     string
	key, val int
}

func runLRU(capacity int, ops []op) []int {
	c, out := NewLRUCache(capacity), []int{}
	for _, o := range ops {
		if o.name == "get" {
			out = append(out, c.Get(o.key))
		} else {
			c.Put(o.key, o.val)
		}
	}
	return out
}

func main() {
	type check struct {
		name string
		ok   func() bool
	}
	checks := []check{
		{"138 ví dụ của đề", func() bool {
			h := buildRandom([]rspec{{7, -1}, {13, 0}, {11, 4}, {10, 2}, {1, 0}})
			before := describeRandom(h)
			c := copyRandomList(h)
			return describeRandom(c) == before && describeRandom(h) == before && !sharesNode(h, c)
		}},
		{"138 danh sách rỗng", func() bool { return copyRandomList(nil) == nil }},
		{"2 ví dụ của đề", func() bool {
			return slices.Equal(toSlice(addTwoNumbers(fromSlice([]int{2, 4, 3}), fromSlice([]int{5, 6, 4}))), []int{7, 0, 8})
		}},
		{"2 hai số 0", func() bool { return slices.Equal(toSlice(addTwoNumbers(fromSlice([]int{0}), fromSlice([]int{0}))), []int{0}) }},
		{"2 nhớ tới cuối", func() bool {
			return slices.Equal(toSlice(addTwoNumbers(fromSlice([]int{9, 9, 9, 9, 9, 9, 9}), fromSlice([]int{9, 9, 9, 9}))), []int{8, 9, 9, 9, 0, 0, 0, 1})
		}},
		{"287 [1,3,4,2,2]", func() bool { return findDuplicate([]int{1, 3, 4, 2, 2}) == 2 }},
		{"287 [3,1,3,4,2]", func() bool { return findDuplicate([]int{3, 1, 3, 4, 2}) == 3 }},
		{"287 [3,3,3,3,3]", func() bool { return findDuplicate([]int{3, 3, 3, 3, 3}) == 3 }},
		{"146 ví dụ của đề", func() bool {
			return slices.Equal(runLRU(2, []op{{"put", 1, 1}, {"put", 2, 2}, {"get", 1, 0}, {"put", 3, 3}, {"get", 2, 0},
				{"put", 4, 4}, {"get", 1, 0}, {"get", 3, 0}, {"get", 4, 0}}), []int{1, -1, -1, 3, 4})
		}},
		{"146 cập nhật key cũ", func() bool {
			return slices.Equal(runLRU(2, []op{{"put", 2, 1}, {"put", 1, 1}, {"put", 2, 3}, {"put", 4, 1}, {"get", 1, 0}, {"get", 2, 0}}), []int{-1, 3})
		}},
		{"23 ví dụ của đề", func() bool {
			l := []*ListNode{fromSlice([]int{1, 4, 5}), fromSlice([]int{1, 3, 4}), fromSlice([]int{2, 6})}
			return slices.Equal(toSlice(mergeKLists(l)), []int{1, 1, 2, 3, 4, 4, 5, 6})
		}},
		{"23 không có danh sách", func() bool { return mergeKLists(nil) == nil }},
		{"23 một danh sách rỗng", func() bool { return mergeKLists([]*ListNode{nil}) == nil }},
		{"25 k = 2", func() bool { return slices.Equal(toSlice(reverseKGroup(fromSlice([]int{1, 2, 3, 4, 5}), 2)), []int{2, 1, 4, 3, 5}) }},
		{"25 k = 3", func() bool { return slices.Equal(toSlice(reverseKGroup(fromSlice([]int{1, 2, 3, 4, 5}), 3)), []int{3, 2, 1, 4, 5}) }},
	}
	bad := []string{}
	for _, c := range checks {
		if !c.ok() {
			bad = append(bad, c.name)
		}
	}
	msg := fmt.Sprintf("advanced_list_station %d/%d ca đúng", len(checks)-len(bad), len(checks))
	if len(bad) > 0 {
		msg += "; sai ở " + strings.Join(bad, ", ")
	}
	fmt.Println(msg)
}
