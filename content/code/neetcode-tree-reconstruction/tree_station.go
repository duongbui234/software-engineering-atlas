package main

import (
	"fmt"
	"strconv"
	"strings"
)

type Tree struct {
	value       int
	left, right *Tree
}

func rebuild(preorder, inorder []int) *Tree {
	position := make(map[int]int, len(inorder))
	for index, value := range inorder {
		position[value] = index
	}
	next := 0
	var visit func(int, int) *Tree
	visit = func(lo, hi int) *Tree {
		if lo == hi {
			return nil
		}
		value := preorder[next]
		next++
		split := position[value]
		return &Tree{value, visit(lo, split), visit(split+1, hi)}
	}
	return visit(0, len(inorder))
}

func maxPath(root *Tree) int {
	best := root.value
	var gain func(*Tree) int
	gain = func(node *Tree) int {
		if node == nil {
			return 0
		}
		left := max(0, gain(node.left))
		right := max(0, gain(node.right))
		best = max(best, node.value+left+right)
		return node.value + max(left, right)
	}
	gain(root)
	return best
}

func encode(root *Tree) string {
	var tokens []string
	var visit func(*Tree)
	visit = func(node *Tree) {
		if node == nil {
			tokens = append(tokens, "#")
			return
		}
		tokens = append(tokens, strconv.Itoa(node.value))
		visit(node.left)
		visit(node.right)
	}
	visit(root)
	return strings.Join(tokens, ",")
}

func decode(data string) *Tree {
	tokens := strings.Split(data, ",")
	next := 0
	var visit func() *Tree
	visit = func() *Tree {
		token := tokens[next]
		next++
		if token == "#" {
			return nil
		}
		value, err := strconv.Atoi(token)
		if err != nil {
			panic(err)
		}
		return &Tree{value, visit(), visit()}
	}
	return visit()
}

func main() {
	wire := "8,3,#,6,#,#,11,-2,#,#,#"
	rebuilt := rebuild([]int{8, 3, 6, 11, -2}, []int{3, 6, 8, -2, 11})
	cases := []bool{
		encode(rebuilt) == wire,
		encode(rebuild([]int{8, 3}, []int{3, 8})) == "8,3,#,#,#",
		encode(rebuild([]int{8, 3}, []int{8, 3})) == "8,#,3,#,#",
		maxPath(rebuilt) == 28,
		maxPath(decode("-8,-3,#,#,-5,#,#")) == -3,
		encode(decode(wire)) == wire,
		encode(decode("4,#,4,#,#")) == "4,#,4,#,#",
		decode("#") == nil,
	}
	for _, pass := range cases {
		if !pass {
			panic("Có ca sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
