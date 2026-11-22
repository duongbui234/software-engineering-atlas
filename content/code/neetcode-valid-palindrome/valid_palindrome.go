// LeetCode 125, Valid Palindrome: hai cách và test.
// Chạy: go run valid_palindrome.go
package main

import (
	"fmt"
	"slices"
)

func isAlnum(c byte) bool { return c >= '0' && c <= '9' || c >= 'A' && c <= 'Z' || c >= 'a' && c <= 'z' }

func lower(c byte) byte {
	if c >= 'A' && c <= 'Z' {
		return c + 32
	}
	return c
}

func cleanReverse(s string) bool {
	clean := []byte{}
	for i := 0; i < len(s); i++ { // duyệt theo byte: đề chỉ có ASCII
		if isAlnum(s[i]) {
			clean = append(clean, lower(s[i]))
		}
	}
	rev := slices.Clone(clean)
	slices.Reverse(rev)
	return slices.Equal(clean, rev)
}

func twoPointers(s string) bool {
	for i, j := 0, len(s)-1; i < j; {
		switch {
		case !isAlnum(s[i]):
			i++
		case !isAlnum(s[j]):
			j--
		case lower(s[i]) != lower(s[j]):
			return false
		default:
			i, j = i+1, j-1
		}
	}
	return true
}

func main() {
	cases := []struct {
		s    string
		want bool
	}{{"A man, a plan, a canal: Panama", true}, {"race a car", false}, {" ", true}, {"", true},
		{"0P", false}, {"a_", true}, {"No 'x' in Nixon", true}, {".,", true}}
	for _, f := range []struct {
		name string
		fn   func(string) bool
	}{{"cleanReverse", cleanReverse}, {"twoPointers", twoPointers}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.s) == c.want {
				ok++
			}
		}
		fmt.Printf("%-13s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
