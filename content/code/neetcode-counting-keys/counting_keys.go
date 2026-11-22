// Ga ARR-02, khóa chuẩn và đếm tần suất: biến mỗi phần tử thành một KHÓA, rồi đếm hoặc gom theo khóa đó.
// Chạy: go run counting_keys.go
package main

import (
	"fmt"
	"reflect"
	"sort"
	"strings"
)

// 242
func isAnagram(s, t string) bool {
	if len(s) != len(t) {
		return false
	}
	var count [26]int
	for i := 0; i < len(s); i++ {
		count[s[i]-'a']++
		count[t[i]-'a']--
	}
	return count == [26]int{} // mảng (không phải slice) so sánh được bằng ==
}

// 49: trong Go, MẢNG [26]int so sánh được nên làm khóa map trực tiếp; slice []int thì không.
func groupAnagrams(words []string) [][]string {
	groups := map[[26]int][]string{}
	var order [][26]int // map của Go duyệt theo thứ tự ngẫu nhiên; giữ thứ tự gặp lần đầu
	for _, w := range words {
		var key [26]int
		for i := 0; i < len(w); i++ {
			key[w[i]-'a']++
		}
		if _, ok := groups[key]; !ok {
			order = append(order, key)
		}
		groups[key] = append(groups[key], w)
	}
	out := make([][]string, 0, len(order))
	for _, k := range order {
		out = append(out, groups[k])
	}
	return out
}

// 347: bucket sort theo số lần xuất hiện.
func topKFrequent(nums []int, k int) []int {
	freq := map[int]int{}
	for _, x := range nums {
		freq[x]++
	}
	buckets := make([][]int, len(nums)+1)
	for x, c := range freq {
		buckets[c] = append(buckets[c], x)
	}
	out := []int{}
	for c := len(nums); c > 0 && len(out) < k; c-- {
		out = append(out, buckets[c]...)
	}
	return out[:k]
}

// 36: struct gồm các trường so sánh được cũng làm khóa map được.
func isValidSudoku(board [][]byte) bool {
	type key struct {
		kind  byte
		index int
		digit byte
	}
	seen := map[key]bool{}
	for r := 0; r < 9; r++ {
		for c := 0; c < 9; c++ {
			d := board[r][c]
			if d == '.' {
				continue
			}
			for _, k := range []key{{'r', r, d}, {'c', c, d}, {'b', r/3*3 + c/3, d}} {
				if seen[k] {
					return false
				}
				seen[k] = true
			}
		}
	}
	return true
}

func main() {
	rows := []string{"53..7....", "6..195...", ".98....6.", "8...6...3", "4..8.3..1", "7...2...6", ".6....28.", "...419..5", "....8..79"}
	board, broken := make([][]byte, 9), make([][]byte, 9)
	for i, r := range rows {
		board[i], broken[i] = []byte(r), []byte(r)
	}
	broken[0][0] = '8'
	norm := func(g [][]string) []string {
		out := []string{}
		for _, x := range g {
			y := append([]string{}, x...)
			sort.Strings(y)
			out = append(out, strings.Join(y, " "))
		}
		sort.Strings(out)
		return out
	}
	cases := []struct {
		name      string
		got, want any
	}{
		{"isAnagram anagram/nagaram", isAnagram("anagram", "nagaram"), true},
		{"isAnagram rat/car", isAnagram("rat", "car"), false},
		{"isAnagram aacc/ccac", isAnagram("aacc", "ccac"), false},
		{"groupAnagrams eat…bat", norm(groupAnagrams([]string{"eat", "tea", "tan", "ate", "nat", "bat"})), []string{"ate eat tea", "bat", "nat tan"}},
		{`groupAnagrams [""]`, groupAnagrams([]string{""}), [][]string{{""}}},
		{"topKFrequent [1,1,1,2,2,3] 2", topKFrequent([]int{1, 1, 1, 2, 2, 3}, 2), []int{1, 2}},
		{"topKFrequent [1] 1", topKFrequent([]int{1}, 1), []int{1}},
		{"isValidSudoku ví dụ 1", isValidSudoku(board), true},
		{"isValidSudoku 8 ở góc", isValidSudoku(broken), false},
	}
	ok := 0
	for _, c := range cases {
		if reflect.DeepEqual(c.got, c.want) {
			ok++
		} else {
			fmt.Println("SAI", c.name, c.got, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
}
