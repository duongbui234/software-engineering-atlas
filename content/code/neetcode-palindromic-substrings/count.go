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

func countSubstrings(text string, reuseMirror bool) int {
	return palindromes(text, reuseMirror).count
}

// TESTS
func main() {
	cases := []struct {
		text string
		want int
	}{
		{"", 0}, {"c", 1}, {"xabbaq", 8}, {"tacocatx", 11},
		{"abab", 6}, {"zzzz", 10}, {"xyz", 3}, {strings.Repeat("a", 1000), 500500},
	}
	for _, test := range cases {
		if countSubstrings(test.text, false) != test.want || countSubstrings(test.text, true) != test.want {
			panic("Sai số đoạn đối xứng")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
