package main

import (
	"container/list"
	"fmt"
	"strconv"
	"strings"
)

type node struct {
	value       int
	left, right *node
}

type pending[T any] struct {
	items   list.List
	byLevel bool
}

func (p *pending[T]) take() T {
	next := p.items.Back()
	if p.byLevel {
		next = p.items.Front()
	}
	return p.items.Remove(next).(T)
}

func (p *pending[T]) addChildren(left, right T) {
	if p.byLevel {
		p.items.PushBack(left)
		p.items.PushBack(right)
	} else {
		p.items.PushBack(right)
		p.items.PushBack(left)
	}
}

func serialize(root *node, byLevel bool) string {
	work := pending[*node]{byLevel: byLevel}
	work.items.PushBack(root)
	tokens := []string{}
	for work.items.Len() > 0 {
		current := work.take()
		if current == nil {
			tokens = append(tokens, "#")
		} else {
			tokens = append(tokens, strconv.Itoa(current.value))
			work.addChildren(current.left, current.right)
		}
	}
	return strings.Join(tokens, ",")
}

func deserialize(wire string, byLevel bool) (*node, error) {
	var root *node
	work := pending[**node]{byLevel: byLevel}
	work.items.PushBack(&root)
	for _, token := range strings.Split(wire, ",") {
		if work.items.Len() == 0 {
			return nil, fmt.Errorf("extra token")
		}
		slot := work.take()
		if token == "#" {
			continue
		}
		value, err := strconv.Atoi(token)
		if err != nil || value < -1000 || value > 1000 || strconv.Itoa(value) != token {
			return nil, fmt.Errorf("invalid token")
		}
		current := &node{value: value}
		*slot = current
		work.addChildren(&current.left, &current.right)
	}
	if work.items.Len() != 0 {
		return nil, fmt.Errorf("missing token")
	}
	return root, nil
}

func equalSmall(a, b *node) bool {
	if a == nil || b == nil {
		return a == b
	}
	return a.value == b.value && equalSmall(a.left, b.left) && equalSmall(a.right, b.right)
}

func check(ok bool) {
	if !ok {
		panic("test failed")
	}
}

func main() {
	leaf := &node{value: 5}
	examples := []struct {
		tree            *node
		preorder, level string
	}{
		{nil, "#", "#"},
		{&node{value: 0}, "0,#,#", "0,#,#"},
		{&node{value: 5, left: leaf}, "5,5,#,#,#", "5,5,#,#,#"},
		{&node{value: 5, right: leaf}, "5,#,5,#,#", "5,#,5,#,#"},
		{
			&node{8, &node{value: -4, right: &node{value: 0}}, &node{8, &node{value: -1000}, &node{value: 1000}}},
			"8,-4,#,0,#,#,8,-1000,#,#,1000,#,#",
			"8,-4,8,#,0,-1000,1000,#,#,#,#,#,#",
		},
	}
	invalid := []string{"", "1,#", "#,", "1x,#,#", "1001,#,#"}

	for _, byLevel := range []bool{false, true} {
		for _, ex := range examples {
			wire := ex.preorder
			if byLevel {
				wire = ex.level
			}
			check(serialize(ex.tree, byLevel) == wire)
			restored, err := deserialize(wire, byLevel)
			check(err == nil && equalSmall(restored, ex.tree))
		}
		for _, left := range []bool{false, true} {
			var chain *node
			for i := 9999; i >= 0; i-- {
				if left {
					chain = &node{value: i%11 - 5, left: chain}
				} else {
					chain = &node{value: i%11 - 5, right: chain}
				}
			}
			wire := serialize(chain, byLevel)
			check(strings.Count(wire, ",") == 20_000)
			restored, err := deserialize(wire, byLevel)
			check(err == nil)
			for i := 0; i < 10_000; i++ {
				check(restored != nil && restored.value == i%11-5)
				if left {
					check(restored.right == nil)
					restored = restored.left
				} else {
					check(restored.left == nil)
					restored = restored.right
				}
			}
			check(restored == nil)
		}
		for _, wire := range invalid {
			_, err := deserialize(wire, byLevel)
			check(err != nil)
		}
	}
	fmt.Printf("%d/12 ca đúng\n", len(examples)+2+len(invalid))
}
