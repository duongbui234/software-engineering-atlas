// LC 2 Add Two Numbers: cộng từng chữ số có nhớ, đổi qua uint64 (tràn), và math/big.
// Chạy: go run add_two_numbers.go
package main

import (
	"fmt"
	"math/big"
	"math/rand/v2"
	"slices"
	"sort"
	"strings"
	"time"
)

type ListNode struct {
	Val  int
	Next *ListNode
}

func build(d []int) *ListNode {
	var head *ListNode
	for i := len(d) - 1; i >= 0; i-- {
		head = &ListNode{d[i], head}
	}
	return head
}

func toSlice(h *ListNode) []int {
	var out []int
	for ; h != nil; h = h.Next {
		out = append(out, h.Val)
	}
	return out
}

// Cách chuẩn: cộng từng cặp chữ số, mang số nhớ sang nút sau, nút giả giữ đầu kết quả.
func addDigits(l1, l2 *ListNode) *ListNode {
	dummy := &ListNode{}
	tail, carry := dummy, 0
	for l1 != nil || l2 != nil || carry != 0 {
		sum := carry
		if l1 != nil {
			sum += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			sum += l2.Val
			l2 = l2.Next
		}
		carry = sum / 10
		tail.Next = &ListNode{Val: sum % 10}
		tail = tail.Next
	}
	return dummy.Next
}

// SAI: đổi ra uint64. Quá 20 chữ số thì phép nhân và cộng tràn, quay vòng theo 2^64 mà không báo lỗi.
func wrongViaUint64(l1, l2 *ListNode) *ListNode {
	toNum := func(l *ListNode) uint64 {
		var n, p uint64 = 0, 1
		for ; l != nil; l = l.Next {
			n += uint64(l.Val) * p
			p *= 10
		}
		return n
	}
	s := fmt.Sprint(toNum(l1) + toNum(l2))
	d := make([]int, len(s))
	for i := range s {
		d[len(s)-1-i] = int(s[i] - '0')
	}
	return build(d)
}

// Đúng nhưng vòng vèo: math/big (số nguyên không giới hạn).
func viaBig(l1, l2 *ListNode) *ListNode {
	toBig := func(l *ListNode) *big.Int {
		d := toSlice(l)
		var sb strings.Builder
		for i := len(d) - 1; i >= 0; i-- {
			sb.WriteByte(byte('0' + d[i]))
		}
		n, _ := new(big.Int).SetString(sb.String(), 10)
		return n
	}
	s := new(big.Int).Add(toBig(l1), toBig(l2)).String()
	d := make([]int, len(s))
	for i := range s {
		d[len(s)-1-i] = int(s[i] - '0')
	}
	return build(d)
}

func reference(a, b []int) []int {
	var out []int
	carry := 0
	for i := 0; i < max(len(a), len(b)) || carry > 0; i++ {
		s := carry
		if i < len(a) {
			s += a[i]
		}
		if i < len(b) {
			s += b[i]
		}
		out = append(out, s%10)
		carry = s / 10
	}
	return out
}

func randomDigits(r *rand.Rand, n int) []int {
	d := make([]int, n)
	for i := range d {
		d[i] = r.IntN(10)
	}
	if n > 1 && d[n-1] == 0 {
		d[n-1] = 1 + r.IntN(9)
	}
	return d
}

func main() {
	r := rand.New(rand.NewPCG(2, 2))
	type tc struct {
		name string
		a, b []int
	}
	cases := []tc{
		{"ví dụ 1 của đề", []int{2, 4, 3}, []int{5, 6, 4}},
		{"ví dụ 2", []int{0}, []int{0}},
		{"ví dụ 3", []int{9, 9, 9, 9, 9, 9, 9}, []int{9, 9, 9, 9}},
		{"[9,9] + [1]", []int{9, 9}, []int{1}},
		{"dài lệch nhau", []int{1}, []int{9, 9, 9, 9, 9, 8}},
		{"100 chữ số (giới hạn đề)", randomDigits(r, 100), randomDigits(r, 100)},
	}
	fns := []struct {
		name string
		fn   func(a, b *ListNode) *ListNode
	}{{"addDigits", addDigits}, {"wrongViaUint64", wrongViaUint64}, {"viaBig", viaBig}}
	for _, f := range fns {
		var bad []string
		for _, c := range cases {
			got := toSlice(f.fn(build(c.a), build(c.b)))
			if !slices.Equal(got, reference(c.a, c.b)) {
				bad = append(bad, fmt.Sprintf("%s → %d chữ số", c.name, len(got)))
			}
		}
		line := fmt.Sprintf("%-15s %d/%d ca đúng", f.name, len(cases)-len(bad), len(cases))
		if len(bad) > 0 {
			line += "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Println(line)
	}
	// 2^64 - 1 cộng 1: uint64 quay về 0.
	maxU := []int{5, 1, 6, 1, 5, 5, 9, 0, 7, 3, 7, 0, 4, 4, 7, 6, 4, 4, 8, 1} // 18446744073709551615, hàng đơn vị trước
	fmt.Printf("\n18446744073709551615 + 1 qua uint64: %v (đúng: %v)\n", toSlice(wrongViaUint64(build(maxU), build([]int{1}))), reference(maxU, []int{1}))

	fmt.Println("\nn chữ số   từng chữ số     qua math/big")
	for _, n := range []int{1000, 10000, 100000, 1000000} {
		a, b := randomDigits(r, n), randomDigits(r, n)
		var cells []string
		for _, fn := range []func(a, b *ListNode) *ListNode{addDigits, viaBig} {
			ts := make([]float64, 5)
			for i := range ts {
				l1, l2 := build(a), build(b)
				t0 := time.Now()
				fn(l1, l2)
				ts[i] = float64(time.Since(t0).Microseconds()) / 1000
			}
			sort.Float64s(ts)
			cells = append(cells, fmt.Sprintf("%9.2f ms", ts[2]))
		}
		fmt.Printf("%-10d %s\n", n, strings.Join(cells, "   "))
	}
}
