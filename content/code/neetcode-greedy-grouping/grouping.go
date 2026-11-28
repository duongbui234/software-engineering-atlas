// Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.
package main

import (
	"fmt"
	"slices"
)

// Hand of Straights: lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó.
func isNStraightHand(hand []int, groupSize int) bool {
	if len(hand)%groupSize != 0 {
		return false
	}
	count := map[int]int{}
	for _, x := range hand {
		count[x]++
	}
	keys := make([]int, 0, len(count))
	for x := range count {
		keys = append(keys, x)
	}
	slices.Sort(keys) // map trong Go không có thứ tự: phải sắp
	for _, x := range keys {
		c := count[x] // c lá x còn lại: cả c lá đều phải mở nhóm
		if c == 0 {
			continue
		}
		for v := x; v < x+groupSize; v++ {
			if count[v] < c {
				return false // thiếu lá v: có nhóm không đi tiếp được
			}
			count[v] -= c
		}
	}
	return true
}

// Merge Triplets: bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại.
func mergeTriplets(triplets [][]int, target []int) bool {
	var good [3]bool // vị trí i đã có bộ an toàn chạm đúng target[i] chưa
	for _, t := range triplets {
		if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
			continue // dùng là hỏng vĩnh viễn
		}
		for i := 0; i < 3; i++ {
			if t[i] == target[i] {
				good[i] = true
			}
		}
	}
	return good[0] && good[1] && good[2]
}

// Partition Labels: phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó.
func partitionLabels(s string) []int {
	var last [26]int
	for i := 0; i < len(s); i++ {
		last[s[i]-'a'] = i
	}
	sizes := []int{}
	start, end := 0, 0 // end: mốc xa nhất mà phần hiện tại buộc phải chạm
	for i := 0; i < len(s); i++ {
		end = max(end, last[s[i]-'a'])
		if i == end { // không chữ nào của phần này còn ở phía sau: cắt
			sizes = append(sizes, end-start+1)
			start = i + 1
		}
	}
	return sizes
}

// Valid Parenthesis String: giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có.
func checkValidString(s string) bool {
	lo, hi := 0, 0 // lo: mọi '*' nghiêng về ')'; hi: mọi '*' nghiêng về '('
	for _, c := range s {
		switch c {
		case '(':
			lo, hi = lo+1, hi+1
		case ')':
			lo, hi = lo-1, hi-1
		default:
			lo, hi = lo-1, hi+1
		}
		if hi < 0 {
			return false // kể cả khi mọi '*' là '(' vẫn thừa ')'
		}
		lo = max(lo, 0) // số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
	}
	return lo == 0
}

type tc struct {
	name string
	run  func() any
	want any
}

func main() {
	labels := func(s string) any { return fmt.Sprint(partitionLabels(s)) }
	// Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
	cases := []tc{
		{"hand thiếu lá 7", func() any { return isNStraightHand([]int{3, 1, 5, 8, 2, 6, 4, 5, 3}, 3) }, false},
		{"hand ba nhóm", func() any { return isNStraightHand([]int{1, 2, 2, 3, 3, 4, 4, 5, 6}, 3) }, true},
		{"hand không chia hết", func() any { return isNStraightHand([]int{1, 2, 3, 4, 5}, 4) }, false},
		{"hand nhóm cỡ 1", func() any { return isNStraightHand([]int{7}, 1) }, true},
		{"hand chưa sắp", func() any { return isNStraightHand([]int{2, 1}, 2) }, true},
		{"hand hai nhóm giống nhau", func() any { return isNStraightHand([]int{1, 1, 2, 2, 3, 3}, 3) }, true},
		{"hand hở ở 3", func() any { return isNStraightHand([]int{1, 2, 4, 5, 6, 7}, 3) }, false},
		{"triplets bỏ bộ vượt", func() any {
			return mergeTriplets([][]int{{1, 4, 2}, {3, 1, 5}, {2, 6, 9}, {3, 4, 1}}, []int{3, 4, 5})
		}, true},
		{"triplets thiếu vị trí 3", func() any { return mergeTriplets([][]int{{4, 1, 1}, {1, 4, 1}}, []int{4, 4, 4}) }, false},
		{"triplets một bộ đúng", func() any { return mergeTriplets([][]int{{5, 5, 5}}, []int{5, 5, 5}) }, true},
		{"triplets bộ duy nhất chạm bị vượt", func() any { return mergeTriplets([][]int{{2, 9, 1}, {1, 1, 3}}, []int{2, 2, 3}) }, false},
		{"triplets không chạm", func() any { return mergeTriplets([][]int{{1, 2, 3}, {1, 2, 3}}, []int{1, 2, 4}) }, false},
		{"labels hai phần", func() any { return labels("abacdcbe") }, "[7 1]"},
		{"labels từng chữ", func() any { return labels("xyz") }, "[1 1 1]"},
		{"labels một chữ", func() any { return labels("aaaa") }, "[4]"},
		{"labels nối dài", func() any { return labels("abcab") }, "[5]"},
		{"labels năm phần", func() any { return labels("ccbbaddx") }, "[2 2 1 2 1]"},
		{"paren sao ở giữa", func() any { return checkValidString("(*)") }, true},
		{"paren sao làm (", func() any { return checkValidString("(*))") }, true},
		{"paren mở ở cuối", func() any { return checkValidString("*)(") }, false},
		{"paren đóng trước", func() any { return checkValidString(")*") }, false},
		{"paren thừa mở", func() any { return checkValidString("(((*") }, false},
		{"paren một sao", func() any { return checkValidString("*") }, true},
		{"paren hai sao", func() any { return checkValidString("((*)*)") }, true},
		{"paren sao làm )", func() any { return checkValidString("(*(*)") }, true},
		{"paren sao không cứu", func() any { return checkValidString("**((") }, false},
	}
	ok := 0
	for _, c := range cases {
		got := c.run()
		if got == c.want {
			ok++
		} else {
			fmt.Printf("SAI %s: được %v, cần %v\n", c.name, got, c.want)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))
}
