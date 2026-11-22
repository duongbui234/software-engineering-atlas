// NC-04 Group Anagrams (LeetCode 49), Go.
// Chạy: go run group_anagrams.go
package main

import (
	"fmt"
	"slices"
	"strings"
)

func groupAnagrams(strs []string) [][]string {
	// Mảng cố định [26]uint8 so sánh được bằng ==, nên làm khóa map trực tiếp,
	// không cần đổi thành chuỗi. uint8 đủ vì đề giới hạn mỗi từ tối đa 100 chữ (< 256).
	groups := map[[26]uint8][]string{}
	for _, s := range strs {
		var key [26]uint8
		for i := 0; i < len(s); i++ {
			key[s[i]-'a']++
		}
		groups[key] = append(groups[key], s)
	}
	out := make([][]string, 0, len(groups))
	for _, g := range groups { // thứ tự duyệt map ngẫu nhiên mỗi lần chạy
		out = append(out, g)
	}
	return out
}

func main() {
	inp := []string{"eat", "tea", "tan", "ate", "nat", "bat"}
	for run := 1; run <= 3; run++ {
		fmt.Printf("lần %d: %v\n", run, groupAnagrams(inp))
	}
	// Muốn test ổn định: sắp xếp từng nhóm rồi sắp xếp danh sách nhóm.
	g := groupAnagrams(inp)
	for _, x := range g {
		slices.Sort(x)
	}
	slices.SortFunc(g, func(a, b []string) int { return strings.Compare(a[0], b[0]) })
	fmt.Println("đã chuẩn hóa:", g)
}
