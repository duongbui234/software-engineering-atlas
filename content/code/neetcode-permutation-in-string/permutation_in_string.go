// LeetCode 567, Permutation in String: ba cách và test.
// Chạy: go run permutation_in_string.go
package main

import (
	"fmt"
	"slices"
)

func sortEachWindow(s1, s2 string) bool {
	key := []byte(s1)
	slices.Sort(key)
	for i := 0; i+len(s1) <= len(s2); i++ {
		w := []byte(s2[i : i+len(s1)]) // chuyển sang []byte là sao chép, nên sắp xếp không đụng s2
		slices.Sort(w)
		if string(w) == string(key) {
			return true
		}
	}
	return false
}

func slideCompare26(s1, s2 string) bool {
	m := len(s1)
	if m > len(s2) {
		return false
	}
	var need, have [26]int
	for i := 0; i < m; i++ {
		need[s1[i]-'a']++
		have[s2[i]-'a']++
	}
	if need == have { // mảng cố định so sánh được bằng == theo nội dung
		return true
	}
	for r := m; r < len(s2); r++ {
		have[s2[r]-'a']++
		have[s2[r-m]-'a']--
		if need == have {
			return true
		}
	}
	return false
}

func matchesCounter(s1, s2 string) bool {
	m := len(s1)
	if m > len(s2) {
		return false
	}
	var diff [26]int
	for i := 0; i < m; i++ {
		diff[s1[i]-'a']--
		diff[s2[i]-'a']++
	}
	matches := 0
	for _, d := range diff {
		if d == 0 {
			matches++
		}
	}
	bump := func(c byte, delta int) {
		if diff[c] == 0 {
			matches--
		}
		diff[c] += delta
		if diff[c] == 0 {
			matches++
		}
	}
	for r := m; r < len(s2) && matches < 26; r++ {
		bump(s2[r]-'a', 1)
		bump(s2[r-m]-'a', -1)
	}
	return matches == 26
}

func main() {
	cases := []struct {
		s1, s2 string
		want   bool
	}{{"ab", "eidbaooo", true}, {"ab", "eidboaoo", false}, {"adc", "dcda", true}, {"abc", "ab", false},
		{"a", "a", true}, {"aab", "abbab", false}, {"aab", "xxbaa", true}, {"hello", "ooolleoooleh", false}}
	for _, f := range []struct {
		name string
		fn   func(string, string) bool
	}{{"sortEachWindow", sortEachWindow}, {"slideCompare26", slideCompare26}, {"matchesCounter", matchesCounter}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.s1, c.s2) == c.want {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
}
