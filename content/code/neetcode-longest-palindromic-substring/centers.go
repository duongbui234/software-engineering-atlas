package main

import (
	"fmt"
	"strings"
)

type stats struct{ start, length, count int }

func palindromes(text string, reuseMirror bool) stats {
	last := 2 * len(text)
	var radius []int
	if reuseMirror {
		radius = make([]int, last+1)
	}
	center, right := 0, 0
	answer := stats{}

	for i := 0; i <= last; i++ {
		length := 0
		if reuseMirror && i < right {
			length = min(radius[2*center-i], right-i)
		}
		for i-length > 0 && i+length < last {
			left, next := i-length-1, i+length+1
			if left%2 != 0 && text[left/2] != text[next/2] {
				break
			}
			length++
		}
		if reuseMirror {
			radius[i] = length
			if i+length > right {
				center, right = i, i+length
			}
		}
		if length > answer.length {
			answer.start, answer.length = (i-length)/2, length
		}
		answer.count += (length + 1) / 2
	}
	return answer
}

func longestPalindrome(text string, reuseMirror bool) string {
	result := palindromes(text, reuseMirror)
	return text[result.start : result.start+result.length]
}

// TESTS
func main() {
	cases := [][2]string{
		{"", ""}, {"c", "c"}, {"xabbaq", "abba"}, {"tacocatx", "tacocat"},
		{"abab", "aba"}, {"zzzz", "zzzz"}, {"xyz", "x"}, {strings.Repeat("a", 1000), strings.Repeat("a", 1000)},
	}
	for _, test := range cases {
		if longestPalindrome(test[0], false) != test[1] || longestPalindrome(test[0], true) != test[1] {
			panic("Sai đoạn đối xứng")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
