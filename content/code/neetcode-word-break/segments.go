package main

import (
	"fmt"
	"strings"
)

func searchWordBreak(s string, words []string, memo bool) bool {
	var cache map[int]bool
	if memo {
		cache = make(map[int]bool)
	}
	var search func(int) bool
	search = func(i int) bool {
		if i == len(s) {
			return true
		}
		if saved, ok := cache[i]; ok {
			return saved
		}
		found := false
		for _, word := range words {
			if strings.HasPrefix(s[i:], word) && search(i+len(word)) {
				found = true
				break
			}
		}
		if cache != nil {
			cache[i] = found
		}
		return found
	}
	return search(0)
}

func wordBreakDp(s string, words []string) bool {
	reachable := make([]bool, len(s)+1)
	reachable[0] = true
	for i := 0; i < len(s); i++ {
		if !reachable[i] {
			continue
		}
		for _, word := range words {
			if strings.HasPrefix(s[i:], word) {
				reachable[i+len(word)] = true
			}
		}
	}
	return reachable[len(s)]
}

func main() {
	maxWord := "abcdefghijklmnopqrst"
	cases := []struct {
		s        string
		words    []string
		expected bool
	}{
		{"cabin", []string{"cab", "ca", "bin"}, true},
		{"cabin", []string{"cab", "bin"}, false},
		{"cabin", []string{"c", "ca", "bin"}, true},
		{"mintminttea", []string{"mint", "tea"}, true},
		{"teas", []string{"teashop", "tea", "s"}, true},
		{"s", []string{"ss"}, false},
		{"bot", []string{"bot"}, true},
		{"ababab", []string{"ab", "aba"}, true},
		{strings.Repeat("a", 18) + "b", []string{"a", "aa"}, false},
		{strings.Repeat(maxWord, 15), []string{maxWord}, true},
		{strings.Repeat("a", 299) + "b", []string{"a", "aa"}, false},
	}
	for _, c := range cases {
		if wordBreakDp(c.s, c.words) != c.expected ||
			searchWordBreak(c.s, c.words, true) != c.expected ||
			(len(c.s) <= 20 && searchWordBreak(c.s, c.words, false) != c.expected) {
			panic("ca kiểm tra sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
