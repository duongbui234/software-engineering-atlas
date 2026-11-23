// LeetCode 155, Min Stack: ba cách, một bản sai (tràn int32), test.
// Chạy: go run min_stack.go
package main

import (
	"fmt"
	"slices"
)

type MinStackLike interface {
	Push(x int)
	Pop()
	Top() int
	GetMin() int
}

// Mỗi tầng nhớ cặp (giá trị, min tới tầng này).
type pair struct{ val, min int }
type PairMinStack struct{ a []pair }

func (s *PairMinStack) Push(x int) {
	m := x
	if len(s.a) > 0 {
		m = min(x, s.a[len(s.a)-1].min)
	}
	s.a = append(s.a, pair{x, m})
}
func (s *PairMinStack) Pop()        { s.a = s.a[:len(s.a)-1] }
func (s *PairMinStack) Top() int    { return s.a[len(s.a)-1].val }
func (s *PairMinStack) GetMin() int { return s.a[len(s.a)-1].min }

type TwoStackMinStack struct{ a, mins []int }

func (s *TwoStackMinStack) Push(x int) {
	s.a = append(s.a, x)
	if len(s.mins) == 0 || x <= s.mins[len(s.mins)-1] {
		s.mins = append(s.mins, x)
	}
}
func (s *TwoStackMinStack) Pop() {
	x := s.a[len(s.a)-1]
	s.a = s.a[:len(s.a)-1]
	if x == s.mins[len(s.mins)-1] {
		s.mins = s.mins[:len(s.mins)-1]
	}
}
func (s *TwoStackMinStack) Top() int    { return s.a[len(s.a)-1] }
func (s *TwoStackMinStack) GetMin() int { return s.mins[len(s.mins)-1] }

// Lưu hiệu x − min cũ. int của Go là 64 bit trên máy 64 bit, nên hiệu hai số 32 bit không tràn.
type DiffMinStack struct {
	d   []int
	min int
}

func (s *DiffMinStack) Push(x int) {
	if len(s.d) == 0 {
		s.d, s.min = append(s.d, 0), x
		return
	}
	s.d = append(s.d, x-s.min)
	s.min = min(s.min, x)
}
func (s *DiffMinStack) Pop() {
	diff := s.d[len(s.d)-1]
	s.d = s.d[:len(s.d)-1]
	if diff < 0 {
		s.min -= diff
	}
}
func (s *DiffMinStack) Top() int {
	if diff := s.d[len(s.d)-1]; diff >= 0 {
		return s.min + diff
	}
	return s.min
}
func (s *DiffMinStack) GetMin() int { return s.min }

// SAI: cùng cách lưu hiệu nhưng bằng int32. -2147483648 − 2147483647 tràn và quay vòng thành 1, lặng lẽ.
type Diff32MinStack struct {
	d   []int32
	min int32
}

func (s *Diff32MinStack) Push(x int) {
	v := int32(x)
	if len(s.d) == 0 {
		s.d, s.min = append(s.d, 0), v
		return
	}
	s.d = append(s.d, v-s.min)
	s.min = min(s.min, v)
}
func (s *Diff32MinStack) Pop() {
	diff := s.d[len(s.d)-1]
	s.d = s.d[:len(s.d)-1]
	if diff < 0 {
		s.min -= diff
	}
}
func (s *Diff32MinStack) Top() int {
	if diff := s.d[len(s.d)-1]; diff >= 0 {
		return int(s.min + diff)
	}
	return int(s.min)
}
func (s *Diff32MinStack) GetMin() int { return int(s.min) }

type op struct {
	name string
	x    int
}

func main() {
	p := func(x int) op { return op{"push", x} }
	pop, top, gm := op{"pop", 0}, op{"top", 0}, op{"getMin", 0}
	cases := []struct {
		name string
		ops  []op
		want []int
	}{
		{"ví dụ của đề", []op{p(-2), p(0), p(-3), gm, pop, top, gm}, []int{-3, 0, -2}},
		{"min lặp lại", []op{p(0), p(1), p(0), gm, pop, gm}, []int{0, 0}},
		{"tăng dần", []op{p(1), p(2), p(3), gm, pop, pop, gm}, []int{1, 1}},
		{"giảm dần", []op{p(3), p(2), p(1), gm, pop, gm, pop, gm}, []int{1, 2, 3}},
		{"biên 32 bit", []op{p(2147483647), p(-2147483648), gm, top, pop, gm, top}, []int{-2147483648, -2147483648, 2147483647, 2147483647}},
		{"số lớn hơn 127", []op{p(500), pop, p(700), gm}, []int{700}},
	}
	impls := []struct {
		name string
		make func() MinStackLike
	}{
		{"PairMinStack", func() MinStackLike { return &PairMinStack{} }},
		{"TwoStackMinStack", func() MinStackLike { return &TwoStackMinStack{} }},
		{"DiffMinStack", func() MinStackLike { return &DiffMinStack{} }},
		{"Diff32MinStack", func() MinStackLike { return &Diff32MinStack{} }},
	}
	for _, im := range impls {
		var bad []string
		for _, c := range cases {
			s, out := im.make(), []int{}
			for _, o := range c.ops {
				switch o.name {
				case "push":
					s.Push(o.x)
				case "pop":
					s.Pop()
				case "top":
					out = append(out, s.Top())
				default:
					out = append(out, s.GetMin())
				}
			}
			if !slices.Equal(out, c.want) {
				bad = append(bad, fmt.Sprintf("%s → %v", c.name, out))
			}
		}
		msg := ""
		if len(bad) > 0 {
			msg = fmt.Sprintf("; sai ở: %v", bad)
		}
		fmt.Printf("%-17s %d/%d ca đúng%s\n", im.name, len(cases)-len(bad), len(cases), msg)
	}
}
