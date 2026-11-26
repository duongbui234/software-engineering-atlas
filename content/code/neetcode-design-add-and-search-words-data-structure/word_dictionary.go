package main

import (
	"fmt"
	"strings"
)

type lengthDictionary struct {
	words       map[int]map[string]struct{}
	comparisons int
}

func (d *lengthDictionary) addWord(word string) {
	bucket := d.words[len(word)]
	if bucket == nil {
		bucket = make(map[string]struct{})
		d.words[len(word)] = bucket
	}
	bucket[word] = struct{}{}
}

func (d *lengthDictionary) search(pattern string) bool {
	d.comparisons = 0
	for word := range d.words[len(pattern)] {
		index := 0
		for ; index < len(pattern); index++ {
			d.comparisons++
			if pattern[index] != '.' && pattern[index] != word[index] {
				break
			}
		}
		if index == len(pattern) {
			return true
		}
	}
	return false
}

type trieNode struct {
	children map[byte]*trieNode
	terminal bool
}

type wordDictionary struct {
	root   trieNode
	visits int
}

func (d *wordDictionary) addWord(word string) {
	node := &d.root
	for index := 0; index < len(word); index++ {
		char := word[index]
		child := node.children[char]
		if child == nil {
			if node.children == nil {
				node.children = make(map[byte]*trieNode)
			}
			child = &trieNode{}
			node.children[char] = child
		}
		node = child
	}
	node.terminal = true
}

func (d *wordDictionary) search(pattern string) bool {
	d.visits = 0
	var match func(*trieNode, int) bool
	match = func(node *trieNode, index int) bool {
		d.visits++
		if index == len(pattern) {
			return node.terminal
		}
		char := pattern[index]
		if char != '.' {
			child := node.children[char]
			return child != nil && match(child, index+1)
		}
		for _, child := range node.children {
			if match(child, index+1) {
				return true
			}
		}
		return false
	}
	return match(&d.root, 0)
}

func main() {
	queries := []struct {
		added    string
		pattern  string
		expected bool
	}{
		{"", ".", false},
		{"ape ash cape caper cave dawn dusk", "ape", true},
		{"", "ap", false},
		{"", "a.h", true},
		{"", "a.z", false},
		{"", ".a.e", true},
		{"", "..wk", false},
		{"", "ca..r", true},
		{"", "cap.", true},
		{"", ".a", false},
		{"cap", "cap", true},
		{"cape", "cape", true},
	}
	scan := lengthDictionary{words: make(map[int]map[string]struct{})}
	trie := wordDictionary{}
	for _, query := range queries {
		for _, word := range strings.Fields(query.added) {
			scan.addWord(word)
			trie.addWord(word)
		}
		if scan.search(query.pattern) != query.expected || trie.search(query.pattern) != query.expected {
			panic(query.pattern)
		}
	}

	scanProbe := lengthDictionary{words: make(map[int]map[string]struct{})}
	trieProbe := wordDictionary{}
	for value := 0; value < 1000; value++ {
		word := string([]byte{'a', byte(97 + value/676), byte(97 + value/26%26), byte(97 + value%26)})
		scanProbe.addWord(word)
		trieProbe.addWord(word)
	}
	if scanProbe.search("za..") || trieProbe.search("za..") {
		panic("za..")
	}
	if scanProbe.comparisons != 1000 || trieProbe.visits != 1 {
		panic("work")
	}
	fmt.Printf("%d/%d ca đúng\n", len(queries), len(queries))
	fmt.Printf("So sánh khi quét: %d, trạng thái Trie: %d\n", scanProbe.comparisons, trieProbe.visits)
}
