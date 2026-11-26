package main

import (
	"fmt"
	"strings"
)

type index interface {
	insert(string)
	search(string) bool
	startsWith(string) bool
}

type wordSet map[string]struct{}

func (words wordSet) insert(word string) {
	words[word] = struct{}{}
}

func (words wordSet) search(word string) bool {
	_, found := words[word]
	return found
}

func (words wordSet) startsWith(prefix string) bool {
	for word := range words {
		if strings.HasPrefix(word, prefix) {
			return true
		}
	}
	return false
}

type trieNode struct {
	sparse   map[byte]*trieNode
	dense    *[26]*trieNode
	terminal bool
}

func newNode(dense bool) *trieNode {
	if dense {
		return &trieNode{dense: new([26]*trieNode)}
	}
	return &trieNode{sparse: make(map[byte]*trieNode)}
}

func (node *trieNode) get(letter byte) *trieNode {
	if node.dense != nil {
		return node.dense[letter-'a']
	}
	return node.sparse[letter]
}

func (node *trieNode) set(letter byte, child *trieNode) {
	if node.dense != nil {
		node.dense[letter-'a'] = child
	} else {
		node.sparse[letter] = child
	}
}

type trie struct {
	root  *trieNode
	dense bool
}

func (t trie) insert(word string) {
	node := t.root
	for i := 0; i < len(word); i++ {
		letter := word[i]
		child := node.get(letter)
		if child == nil {
			child = newNode(t.dense)
			node.set(letter, child)
		}
		node = child
	}
	node.terminal = true
}

func (t trie) search(word string) bool {
	node := t.walk(word)
	return node != nil && node.terminal
}

func (t trie) startsWith(prefix string) bool {
	return t.walk(prefix) != nil
}

func (t trie) walk(text string) *trieNode {
	node := t.root
	for i := 0; i < len(text); i++ {
		node = node.get(text[i])
		if node == nil {
			return nil
		}
	}
	return node
}

func main() {
	indexes := []index{wordSet{}, trie{newNode(false), false}, trie{newNode(true), true}}
	cases := 0
	check := func(actual, expected bool) {
		cases++
		if actual != expected {
			panic(fmt.Sprintf("Sai ca %d", cases))
		}
	}
	for _, lookup := range indexes {
		check(lookup.startsWith("ca"), false)
		for _, word := range []string{"cart", "car", "cab", "car"} {
			lookup.insert(word)
		}
		check(lookup.search("car"), true)
		check(lookup.search("cart"), true)
		check(lookup.search("cab"), true)
		check(lookup.search("ca"), false)
		check(lookup.startsWith("ca"), true)
		check(lookup.startsWith("cat"), false)
		check(lookup.startsWith("carton"), false)
		longWord := strings.Repeat("z", 2000)
		lookup.insert(longWord)
		check(lookup.search(longWord), true)
		check(lookup.search(longWord[:1999]), false)
		check(lookup.startsWith(longWord[:1999]), true)
	}
	fmt.Printf("%d/33 ca đúng\n", cases)
}
