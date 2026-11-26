package main

import (
	"fmt"
	"slices"
	"strings"
)

var directions = [][2]int{{0, 1}, {1, 0}, {0, -1}, {-1, 0}}

type result struct {
	found    []string
	advances int
}

func perWord(board [][]byte, words []string) result {
	rows, cols := len(board), len(board[0])
	out := result{}
	var match func(int, int, string, int) bool
	match = func(row, col int, word string, index int) bool {
		if row < 0 || row >= rows || col < 0 || col >= cols {
			return false
		}
		letter := board[row][col]
		if letter != word[index] {
			return false
		}
		out.advances++
		if index+1 == len(word) {
			return true
		}

		board[row][col] = '#'
		hit := false
		for _, dir := range directions {
			if match(row+dir[0], col+dir[1], word, index+1) {
				hit = true
				break
			}
		}
		board[row][col] = letter
		return hit
	}

wordsLoop:
	for _, word := range words {
		for row := range rows {
			for col := range cols {
				if match(row, col, word, 0) {
					out.found = append(out.found, word)
					continue wordsLoop
				}
			}
		}
	}
	return out
}

type node struct {
	children map[byte]*node
	word     string
}

func withTrie(board [][]byte, words []string) result {
	root := &node{children: make(map[byte]*node)}
	for _, word := range words {
		parent := root
		for index := range len(word) {
			letter := word[index]
			child := parent.children[letter]
			if child == nil {
				child = &node{children: make(map[byte]*node)}
				parent.children[letter] = child
			}
			parent = child
		}
		parent.word = word
	}

	rows, cols := len(board), len(board[0])
	out := result{}
	var visit func(int, int, *node)
	visit = func(row, col int, parent *node) {
		if row < 0 || row >= rows || col < 0 || col >= cols {
			return
		}
		letter := board[row][col]
		child := parent.children[letter]
		if child == nil {
			return
		}
		out.advances++
		if child.word != "" {
			out.found = append(out.found, child.word)
			child.word = ""
		}
		board[row][col] = '#'
		for _, dir := range directions {
			if len(child.children) == 0 {
				break
			}
			visit(row+dir[0], col+dir[1], child)
		}
		board[row][col] = letter
		if len(child.children) == 0 {
			delete(parent.children, letter)
		}
	}

	for row := range rows {
		for col := range cols {
			visit(row, col, root)
		}
	}
	return out
}

func makeBoard(rows []string) [][]byte {
	board := make([][]byte, len(rows))
	for index, row := range rows {
		board[index] = []byte(row)
	}
	return board
}

func main() {
	cases := []struct{ rows, words, expected []string }{
		{[]string{"car", "tpx", "xex"}, []string{"cap", "cape", "car", "cart", "capa", "cat"}, []string{"cap", "cape", "car"}},
		{[]string{"aaa"}, []string{"a", "aa", "aaa", "aaaa"}, []string{"a", "aa", "aaa"}},
		{[]string{"ax", "xb"}, []string{"ab", "axb", "axxb"}, []string{"axb"}},
		{[]string{"z"}, []string{"a", "z", "zz"}, []string{"z"}},
		{[]string{"yx", "xy"}, []string{"aaa", "zzz"}, nil},
	}
	for _, fixture := range cases {
		board := makeBoard(fixture.rows)
		for _, search := range []func([][]byte, []string) result{perWord, withTrie} {
			found := search(board, fixture.words).found
			slices.Sort(found)
			if !slices.Equal(found, fixture.expected) {
				panic("Sai kết quả")
			}
			for index, row := range board {
				if string(row) != fixture.rows[index] {
					panic("Bảng chữ đã thay đổi")
				}
			}
		}
	}

	board := makeBoard([]string{"aaa", "aaa", "aaa"})
	var words []string
	for _, last := range strings.Split("bcdefghijk", "") {
		words = append(words, "aaaaa"+last)
	}
	left, right := perWord(board, words), withTrie(board, words)
	if len(left.found) != 0 || len(right.found) != 0 || right.advances == 0 || left.advances != 10*right.advances {
		panic("Sai số bước khớp")
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases)+1, len(cases)+1)
	fmt.Printf("Bước khớp: %d / %d\n", left.advances, right.advances)
}
