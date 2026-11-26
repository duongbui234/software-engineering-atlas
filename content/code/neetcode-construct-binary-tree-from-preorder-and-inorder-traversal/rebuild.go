package main

import (
	"fmt"
	"slices"
)

type treeNode struct {
	value       int
	left, right *treeNode
}

type rebuild func(preorder, inorder []int) *treeNode

func buildRanges(preorder []int, findRoot func(value, lo int) int) *treeNode {
	next := 0
	var build func(lo, hi int) *treeNode
	build = func(lo, hi int) *treeNode {
		if lo == hi {
			return nil
		}
		node := &treeNode{value: preorder[next]}
		next++
		mid := findRoot(node.value, lo)
		node.left = build(lo, mid)
		node.right = build(mid+1, hi)
		return node
	}
	return build(0, len(preorder))
}

func byScan(preorder, inorder []int) *treeNode {
	return buildRanges(preorder, func(value, lo int) int {
		for inorder[lo] != value {
			lo++
		}
		return lo
	})
}

func byIndex(preorder, inorder []int) *treeNode {
	index := make(map[int]int, len(inorder))
	for i, value := range inorder {
		index[value] = i
	}
	return buildRanges(preorder, func(value, _ int) int { return index[value] })
}

func byStack(preorder, inorder []int) *treeNode {
	if len(preorder) == 0 {
		return nil
	}
	root := &treeNode{value: preorder[0]}
	pending := []*treeNode{root}
	nextIn := 0

	for _, value := range preorder[1:] {
		child := &treeNode{value: value}
		parent := pending[len(pending)-1]
		if parent.value != inorder[nextIn] {
			parent.left = child
		} else {
			for len(pending) > 0 && pending[len(pending)-1].value == inorder[nextIn] {
				parent = pending[len(pending)-1]
				pending = pending[:len(pending)-1]
				nextIn++
			}
			parent.right = child
		}
		pending = append(pending, child)
	}
	return root
}

func check(root *treeNode, preorder, inorder []int) {
	var before, between []int
	var pending []*treeNode
	for root != nil || len(pending) > 0 {
		for root != nil {
			before = append(before, root.value)
			pending = append(pending, root)
			root = root.left
		}
		root = pending[len(pending)-1]
		pending = pending[:len(pending)-1]
		between = append(between, root.value)
		root = root.right
	}
	if !slices.Equal(before, preorder) || !slices.Equal(between, inorder) {
		panic("thứ tự duyệt không khớp")
	}
}

func main() {
	cases := []struct{ preorder, inorder []int }{
		{[]int{-3000}, []int{-3000}},
		{[]int{8, 14, 5, -2, 4, 0}, []int{14, 5, 8, 4, -2, 0}},
		{[]int{1, 2, 3, 4}, []int{4, 3, 2, 1}},
		{[]int{1, 2, 3, 4}, []int{1, 2, 3, 4}},
		{[]int{1, -2, 3, -4}, []int{-2, -4, 3, 1}},
	}
	ok := 0
	for _, build := range []rebuild{byScan, byIndex, byStack} {
		for _, c := range cases {
			check(build(c.preorder, c.inorder), c.preorder, c.inorder)
			ok++
		}
	}

	straight, reverse := make([]int, 3000), make([]int, 3000)
	for i := range straight {
		straight[i], reverse[i] = i+1, len(straight)-i
	}
	for _, inorder := range [][]int{straight, reverse} {
		check(byStack(straight, inorder), straight, inorder)
		ok++
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases)*3+2)
}
