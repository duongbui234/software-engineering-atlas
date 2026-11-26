package main

import (
	"fmt"
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

func countSubstrings(text string, reuseMirror bool) int {
	return palindromes(text, reuseMirror).count
}

// EXAMPLE
func main() {
	text := "xabbaq"
	for _, reuseMirror := range []bool{false, true} {
		if longestPalindrome(text, reuseMirror) != "abba" {
			panic("Sai đoạn dài nhất")
		}
		if countSubstrings(text, reuseMirror) != 8 {
			panic("Sai số đoạn")
		}
	}
	fmt.Println("2/2 ca đúng")
}
