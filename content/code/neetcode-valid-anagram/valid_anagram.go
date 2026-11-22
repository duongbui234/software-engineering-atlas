// NC-02 Valid Anagram (LeetCode 242), Go.
// Chạy: go run valid_anagram.go
package main

import "fmt"

// Chữ thường a–z: string của Go là dãy byte, s[i] - 'a' là chỉ số 0..25.
func isAnagram(s, t string) bool {
	if len(s) != len(t) {
		return false
	}
	var count [26]int // mảng cố định, nằm trên stack, đã bằng 0
	for i := 0; i < len(s); i++ {
		count[s[i]-'a']++
		count[t[i]-'a']--
	}
	return count == [26]int{} // mảng Go so sánh được bằng ==
}

// Unicode: range trên string trả về từng rune (code point), không phải từng byte.
// (Muốn coi "é" ghép và "é" tách là một, cần thêm golang.org/x/text/unicode/norm.)
func isAnagramRunes(s, t string) bool {
	count := map[rune]int{}
	for _, r := range s {
		count[r]++
	}
	for _, r := range t {
		count[r]--
		if count[r] < 0 {
			return false
		}
	}
	for _, c := range count {
		if c != 0 {
			return false
		}
	}
	return true
}

func main() {
	fmt.Println(isAnagram("anagram", "nagaram"), isAnagram("rat", "car"), isAnagram("aacc", "ccac")) // true false false
	fmt.Println(`len("é") =`, len("é"), "byte; số rune =", len([]rune("é")))
	fmt.Println(isAnagramRunes("tiếng việt", "việt tiếng"), isAnagramRunes("😀🌃", "\U0001F703\U0001F200")) // true false
}
