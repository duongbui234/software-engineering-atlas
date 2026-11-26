package main

import (
	"fmt"
	"sort"
	"strings"
)

type trieNode struct {
	children map[byte]*trieNode
	word     string
}

func makeNode() *trieNode {
	return &trieNode{children: make(map[byte]*trieNode)}
}

func insert(node *trieNode, word string) {
	for i := range len(word) {
		letter := word[i]
		if node.children[letter] == nil {
			node.children[letter] = makeNode()
		}
		node = node.children[letter]
	}
	node.word = word
}

func walk(node *trieNode, text string) *trieNode {
	for i := range len(text) {
		node = node.children[text[i]]
		if node == nil {
			return nil
		}
	}
	return node
}

func matches(node *trieNode, pattern string, i int) bool {
	if i == len(pattern) {
		return node.word != ""
	}
	if pattern[i] == '.' {
		for _, child := range node.children {
			if matches(child, pattern, i+1) {
				return true
			}
		}
		return false
	}
	child := node.children[pattern[i]]
	return child != nil && matches(child, pattern, i+1)
}

func findWords(board [][]byte, words []string) []string {
	root := makeNode()
	for _, word := range words {
		insert(root, word)
	}
	found := make(map[string]bool)
	var visit func(int, int, *trieNode)
	visit = func(row, col int, parent *trieNode) {
		if row < 0 || row >= len(board) || col < 0 || col >= len(board[row]) {
			return
		}
		letter := board[row][col]
		node := parent.children[letter]
		if letter == '#' || node == nil {
			return
		}
		if node.word != "" {
			found[node.word] = true
		}
		board[row][col] = '#'
		visit(row-1, col, node)
		visit(row+1, col, node)
		visit(row, col-1, node)
		visit(row, col+1, node)
		board[row][col] = letter
	}
	for r, row := range board {
		for c := range row {
			visit(r, c, root)
		}
	}
	result := make([]string, 0, len(found))
	for word := range found {
		result = append(result, word)
	}
	sort.Strings(result)
	return result
}

func main() {
	root := makeNode()
	for _, word := range []string{"cart", "cat", "dog"} {
		insert(root, word)
	}
	board := [][]byte{[]byte("cat"), []byte("dre")}
	cases := []bool{
		walk(root, "car") != nil,
		walk(root, "car").word == "",
		walk(root, "cart").word == "cart",
		walk(root, "cab") == nil,
		matches(root, "ca.", 0),
		matches(root, "c..t", 0),
		matches(root, ".og", 0),
		!matches(root, "c.t.", 0),
		!matches(root, "do", 0),
		strings.Join(findWords(board, []string{"car", "care", "cat", "cart", "cata"}), ",") == "car,care,cat",
		string(board[0]) == "cat" && string(board[1]) == "dre",
		strings.Join(findWords([][]byte{[]byte("aa")}, []string{"a", "aa", "aaa"}), ",") == "a,aa",
	}
	insert(root, "car")
	cases = append(cases, walk(root, "car").word == "car" && walk(root, "cart").word == "cart")
	for _, pass := range cases {
		if !pass {
			panic("Có ca sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
