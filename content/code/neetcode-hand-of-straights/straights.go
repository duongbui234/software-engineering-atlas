// Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
// Chạy: go run straights.go
package main

import (
	"fmt"
	"slices"
	"time"
)

func countOf(hand []int) map[int]int {
	count := make(map[int]int)
	for _, x := range hand {
		count[x]++
	}
	return count
}

// Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
func isStraightBrute(hand []int, k int) bool {
	count := countOf(hand)
	var goFrom func(idx int) bool
	goFrom = func(idx int) bool {
		for idx < len(hand) && count[hand[idx]] == 0 {
			idx++
		}
		if idx == len(hand) {
			return true // mọi lá đã vào nhóm
		}
		x := hand[idx]
		for s := x - k + 1; s <= x; s++ {
			ok := true
			for v := s; v < s+k; v++ {
				if count[v] == 0 {
					ok = false
					break
				}
			}
			if !ok {
				continue
			}
			for v := s; v < s+k; v++ {
				count[v]--
			}
			if goFrom(idx) {
				return true
			}
			for v := s; v < s+k; v++ {
				count[v]++
			}
		}
		return false
	}
	return goFrom(0)
}

// Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
func isNStraightHand(hand []int, k int, steps *int) bool {
	if len(hand)%k != 0 {
		return false // dừng sớm: không chia đều được
	}
	count := countOf(hand)
	sorted := slices.Clone(hand) // sắp bản sao, không đụng vào mảng của người gọi
	slices.Sort(sorted)
	for _, x := range sorted {
		if count[x] == 0 {
			continue // lá này đã nằm trong một nhóm trước
		}
		for v := x; v < x+k; v++ {
			*steps++
			if count[v] == 0 {
				return false // thiếu lá v để nối nhóm
			}
			count[v]--
		}
	}
	return true
}

// Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
func isNStraightByValue(hand []int, k int, steps *int) bool {
	if len(hand)%k != 0 {
		return false
	}
	count := countOf(hand)
	keys := make([]int, 0, len(count))
	for x := range count {
		keys = append(keys, x) // thứ tự duyệt map là ngẫu nhiên, nên phải sắp
	}
	slices.Sort(keys) // chỉ sắp các giá trị khác nhau
	for _, x := range keys {
		c := count[x]
		if c == 0 {
			continue
		}
		for v := x; v < x+k; v++ {
			*steps++
			if count[v] < c {
				return false // không đủ lá v cho c nhóm
			}
			count[v] -= c
		}
	}
	return true
}

// Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
func isNStraightOpen(hand []int, k int) bool {
	if len(hand)%k != 0 {
		return false
	}
	count := countOf(hand)
	keys := make([]int, 0, len(count))
	for x := range count {
		keys = append(keys, x)
	}
	slices.Sort(keys)
	started := []int{} // số nhóm mới mở tại từng giá trị, theo thứ tự
	head := 0
	open := 0 // số nhóm đang chờ lá kế tiếp
	prev := 0
	for _, x := range keys {
		c := count[x]
		if open > 0 && x != prev+1 {
			return false // nhóm đang mở cần prev+1 mà không có
		}
		if c < open {
			return false // không đủ lá x để nối mọi nhóm đang mở
		}
		started = append(started, c-open) // phần dư mở nhóm mới tại x
		open = c
		if len(started)-head == k {
			open -= started[head] // nhóm mở từ x-k+1 vừa đủ k lá
			head++
		}
		prev = x
	}
	return open == 0
}

// Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
func isNStraightNoSort(hand []int, k int) bool {
	if len(hand)%k != 0 {
		return false
	}
	count := countOf(hand)
	for _, x := range hand {
		if count[x] == 0 {
			continue
		}
		for v := x; v < x+k; v++ {
			if count[v] == 0 {
				return false
			}
			count[v]--
		}
	}
	return true
}

func main() {
	type tc struct {
		hand []int
		k    int
		want bool
	}
	cases := []tc{
		{[]int{5, 1, 3, 2, 4, 6}, 3, true},
		{[]int{1, 1, 2, 2, 3, 3}, 3, true},
		{[]int{3, 2, 2, 1, 4, 3}, 3, true},
		{[]int{1, 2, 4, 5, 6, 7}, 3, false},
		{[]int{7, 8, 9, 10}, 3, false},
		{[]int{4}, 1, true},
		{[]int{3, 3, 4, 4, 5, 6}, 3, false},
		{[]int{12, 10, 11, 13, 11, 12}, 3, true},
		{[]int{1000000000, 999999998, 999999999}, 3, true},
		{[]int{0, 1, 2, 3}, 2, true},
	}
	ok := 0
	var dummy int
	for _, c := range cases {
		got := []bool{isStraightBrute(c.hand, c.k), isNStraightHand(c.hand, c.k, &dummy), isNStraightByValue(c.hand, c.k, &dummy), isNStraightOpen(c.hand, c.k)}
		all := true
		for _, g := range got {
			if g != c.want {
				all = false
			}
		}
		if all {
			ok++
		} else {
			fmt.Println("sai ở", c.hand, c.k, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
	total, good, wrong := 0, 0, 0
	for mask := 1; mask < 1024; mask++ {
		sorted := []int{}
		m := mask
		for v := 0; v < 5; v++ {
			for r := 0; r < m%4; r++ {
				sorted = append(sorted, v)
			}
			m /= 4
		}
		half := len(sorted) / 2
		hand := append(slices.Clone(sorted[half:]), sorted[:half]...)
		for k := 1; k <= 5; k++ {
			total++
			want := isStraightBrute(hand, k)
			if isNStraightHand(hand, k, &dummy) == want && isNStraightByValue(hand, k, &dummy) == want && isNStraightOpen(hand, k) == want {
				good++
			}
			if isNStraightNoSort(hand, k) != want {
				wrong++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu trọng tài)\n", good, total)
	fmt.Printf("Bỏ sắp xếp: sai %d/%d ca\n", wrong, total)

	// Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
	n := 200000
	big := make([]int, n)
	for i := range big {
		big[i] = (i * 7919) % 1000
	}
	kBig := 10
	cardSteps, valueSteps := 0, 0
	t0 := time.Now()
	a := isNStraightHand(big, kBig, &cardSteps)
	cardMs := float64(time.Since(t0).Microseconds()) / 1000
	t0 = time.Now()
	b := isNStraightByValue(big, kBig, &valueSteps)
	valueMs := float64(time.Since(t0).Microseconds()) / 1000
	fmt.Printf("n = %d, k = %d, kết quả %v/%v: theo từng lá %d bước (%.1f ms), theo từng giá trị %d bước (%.1f ms)\n", n, kBig, a, b, cardSteps, cardMs, valueSteps, valueMs)
}
