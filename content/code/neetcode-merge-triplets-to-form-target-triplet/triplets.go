// Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
// Chạy: go run triplets.go
package main

import (
	"fmt"
	"time"
)

// Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
func mergeTripletsBrute(triplets [][]int, target []int, steps *int64) bool {
	n := len(triplets)
	for mask := 1; mask < 1<<n; mask++ {
		a, b, c := 0, 0, 0
		for i := 0; i < n; i++ {
			*steps++
			if (mask>>i)&1 == 1 {
				t := triplets[i]
				a = max(a, t[0])
				b = max(b, t[1])
				c = max(c, t[2])
			}
		}
		if a == target[0] && b == target[1] && c == target[2] {
			return true
		}
	}
	return false
}

// Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
func mergeTriplets(triplets [][]int, target []int, steps *int64) bool {
	x, y, z := target[0], target[1], target[2]
	var found [3]bool
	for _, t := range triplets {
		*steps++
		if t[0] > x || t[1] > y || t[2] > z {
			continue // bộ không an toàn: gộp vào là vượt, không gỡ được
		}
		for k := 0; k < 3; k++ {
			if t[k] == target[k] {
				found[k] = true // bộ an toàn này mang đúng giá trị cần ở vị trí k
			}
		}
	}
	return found[0] && found[1] && found[2]
}

// Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
func mergeTripletsMax(triplets [][]int, target []int) bool {
	var m [3]int
	for _, t := range triplets {
		if t[0] > target[0] || t[1] > target[1] || t[2] > target[2] {
			continue
		}
		for k := 0; k < 3; k++ {
			m[k] = max(m[k], t[k])
		}
	}
	return m[0] == target[0] && m[1] == target[1] && m[2] == target[2]
}

// Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
func mergeTripletsNoFilter(triplets [][]int, target []int) bool {
	var found [3]bool
	for _, t := range triplets {
		for k := 0; k < 3; k++ {
			if t[k] == target[k] {
				found[k] = true
			}
		}
	}
	return found[0] && found[1] && found[2]
}

func main() {
	type tc struct {
		triplets [][]int
		target   []int
		want     bool
	}
	cases := []tc{
		{[][]int{{1, 2, 3}}, []int{1, 2, 3}, true},
		{[][]int{{2, 9, 5}, {1, 7, 1}}, []int{2, 7, 5}, false},
		{[][]int{{3, 1, 1}, {1, 4, 1}, {1, 1, 6}}, []int{3, 4, 6}, true},
		{[][]int{{3, 4, 6}, {5, 1, 1}}, []int{3, 4, 6}, true},
		{[][]int{{1, 1, 1}, {2, 2, 2}}, []int{3, 3, 3}, false},
		{[][]int{{4, 2, 1}, {1, 2, 4}, {4, 4, 4}}, []int{4, 2, 4}, true},
		{[][]int{{2, 3, 4}, {2, 3, 4}}, []int{2, 3, 5}, false},
	}
	ok := 0
	var s int64
	for _, c := range cases {
		got := []bool{mergeTripletsBrute(c.triplets, c.target, &s), mergeTriplets(c.triplets, c.target, &s), mergeTripletsMax(c.triplets, c.target)}
		if got[0] == c.want && got[1] == c.want && got[2] == c.want {
			ok++
		} else {
			fmt.Println("sai ở", c.triplets, c.target, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
	var values [][]int
	for a := 1; a <= 3; a++ {
		for b := 1; b <= 3; b++ {
			for c := 1; c <= 3; c++ {
				values = append(values, []int{a, b, c})
			}
		}
	}
	target := []int{2, 2, 2}
	total, good, wrong := 0, 0, 0
	var list [][]int
	var build func()
	build = func() {
		if len(list) > 0 {
			total++
			b := mergeTripletsBrute(list, target, &s)
			if mergeTriplets(list, target, &s) == b && mergeTripletsMax(list, target) == b {
				good++
			}
			if mergeTripletsNoFilter(list, target) != b {
				wrong++
			}
		}
		if len(list) == 4 {
			return
		}
		for _, v := range values {
			list = append(list, v)
			build()
			list = list[:len(list)-1]
		}
	}
	build()
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn)\n", good, total)
	fmt.Printf("Bỏ bước lọc: sai %d/%d ca\n", wrong, total)

	// Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
	var small [][]int
	for i := 0; i < 18; i++ {
		t := []int{i + 1, i + 1, i + 1}
		if i == 0 {
			t[0] = 1000
		}
		if i == 1 {
			t[1] = 1000
		}
		small = append(small, t)
	}
	big := []int{1000, 1000, 1000}
	var bs, gs int64
	t0 := time.Now()
	rb := mergeTripletsBrute(small, big, &bs)
	bruteMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	t0 = time.Now()
	rg := mergeTriplets(small, big, &gs)
	greedyMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	fmt.Printf("n = 18, đáp án %v/%v: vét cạn %d bước (%.1f ms), tham lam %d bước (%.3f ms)\n", rb, rg, bs, bruteMs, gs, greedyMs)

	// Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
	full := make([][]int, 100000)
	for i := range full {
		full[i] = []int{(7*i)%1000 + 1, (13*i)%1000 + 1, (31*i)%1000 + 1}
	}
	goal := []int{700, 800, 900}
	var fs int64
	t0 = time.Now()
	rf := mergeTriplets(full, goal, &fs)
	fullMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	fmt.Printf("n = 100000, đáp án %v: tham lam %d bước (%.2f ms)\n", rf, fs, fullMs)
}
