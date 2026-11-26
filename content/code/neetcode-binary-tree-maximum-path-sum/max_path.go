package main

import "fmt"

type Node struct {
	value       int
	left, right *Node
}

func leaf(value int) *Node {
	return &Node{value: value}
}

type Walk struct {
	current, previous *Node
	sum               int
}

func brute(root *Node) int {
	best := root.value
	parent := map[*Node]*Node{root: nil}
	nodes := []*Node{root}
	for cursor := 0; cursor < len(nodes); cursor++ {
		current := nodes[cursor]
		for _, child := range []*Node{current.left, current.right} {
			if child != nil {
				parent[child] = current
				nodes = append(nodes, child)
			}
		}
	}

	for _, start := range nodes {
		stack := []Walk{{start, nil, start.value}}
		for len(stack) > 0 {
			walk := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			best = max(best, walk.sum)
			for _, neighbor := range []*Node{walk.current.left, walk.current.right, parent[walk.current]} {
				if neighbor != nil && neighbor != walk.previous {
					stack = append(stack, Walk{neighbor, walk.current, walk.sum + neighbor.value})
				}
			}
		}
	}
	return best
}

func recursive(root *Node) int {
	best := root.value
	var gain func(*Node) int
	gain = func(current *Node) int {
		if current == nil {
			return 0
		}
		left := max(0, gain(current.left))
		right := max(0, gain(current.right))
		best = max(best, current.value+left+right)
		return current.value + max(left, right)
	}
	gain(root)
	return best
}

type Frame struct {
	current        *Node
	step, leftGain int
}

func iterative(root *Node) int {
	best := root.value
	returned := 0
	stack := []Frame{{current: root}}

	for len(stack) > 0 {
		top := &stack[len(stack)-1]
		current := top.current
		if top.step == 0 {
			top.step = 1
			if current.left != nil {
				stack = append(stack, Frame{current: current.left})
			}
			continue
		}

		if top.step == 1 {
			if current.left != nil {
				top.leftGain = max(0, returned)
			}
			top.step = 2
			if current.right != nil {
				stack = append(stack, Frame{current: current.right})
			}
			continue
		}

		rightGain := 0
		if current.right != nil {
			rightGain = max(0, returned)
		}
		best = max(best, current.value+top.leftGain+rightGain)
		returned = current.value + max(top.leftGain, rightGain)
		stack = stack[:len(stack)-1]
	}
	return best
}

func main() {
	cases := []struct {
		root     *Node
		expected int
	}{
		{leaf(-9), -9},
		{&Node{-6, leaf(-1), leaf(-4)}, -1},
		{&Node{6, leaf(3), leaf(5)}, 14},
		{&Node{-8, &Node{4, leaf(7), leaf(5)}, leaf(-3)}, 16},
		{&Node{8, &Node{2, leaf(4), leaf(5)}, leaf(1)}, 16},
		{&Node{5, &Node{-7, leaf(1), nil}, leaf(4)}, 9},
		{&Node{2, &Node{2, leaf(2), nil}, leaf(2)}, 8},
		{&Node{6, &Node{-2, leaf(9), nil}, leaf(4)}, 17},
	}
	passed := 0
	for _, test := range cases {
		for _, solve := range []func(*Node) int{brute, recursive, iterative} {
			if actual := solve(test.root); actual != test.expected {
				panic(fmt.Sprintf("%d != %d", actual, test.expected))
			}
		}
		passed++
	}

	deep := leaf(1)
	for length := 1; length < 30_000; length++ {
		deep = &Node{1, deep, nil}
	}
	if iterative(deep) != 30_000 {
		panic("iterative: 30_000")
	}
	passed++

	fmt.Printf("%d/%d ca đúng\n", passed, len(cases)+1)
}
