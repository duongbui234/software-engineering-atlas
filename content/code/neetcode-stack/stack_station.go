// Ga ARR-06: ngăn xếp. Giải 20, 155, 150 và 22, tự chạy test.
// Chạy: go run stack_station.go
package main

import (
	"fmt"
	"slices"
	"strconv"
)

// 20
func isValid(s string) bool {
	open := map[rune]rune{')': '(', ']': '[', '}': '{'}
	st := []rune{}
	for _, ch := range s {
		want, isClose := open[ch]
		if !isClose {
			st = append(st, ch)
		} else if len(st) == 0 || st[len(st)-1] != want {
			return false
		} else {
			st = st[:len(st)-1]
		}
	}
	return len(st) == 0
}

// 155: mỗi tầng nhớ kèm min tới tầng đó.
type MinStack struct{ st [][2]int }

func (m *MinStack) Push(x int) {
	lo := x
	if len(m.st) > 0 {
		lo = min(x, m.GetMin())
	}
	m.st = append(m.st, [2]int{x, lo})
}
func (m *MinStack) Pop()        { m.st = m.st[:len(m.st)-1] }
func (m *MinStack) Top() int    { return m.st[len(m.st)-1][0] }
func (m *MinStack) GetMin() int { return m.st[len(m.st)-1][1] }

// 150
func evalRPN(tokens []string) int {
	st := []int{}
	for _, t := range tokens {
		n, err := strconv.Atoi(t)
		if err == nil { // Atoi đọc được "-11" là số; "-" một mình thì lỗi, tức là toán tử
			st = append(st, n)
			continue
		}
		a, b := st[len(st)-2], st[len(st)-1]
		st = st[:len(st)-2]
		switch t {
		case "+":
			st = append(st, a+b)
		case "-":
			st = append(st, a-b)
		case "*":
			st = append(st, a*b)
		default:
			st = append(st, a/b) // chia số nguyên trong Go làm tròn về 0, đúng ý đề
		}
	}
	return st[0]
}

// 22
func generateParenthesis(n int) []string {
	out := []string{}
	cur := make([]byte, 0, 2*n)
	var gen func(open, close int)
	gen = func(open, close int) {
		if len(cur) == 2*n {
			out = append(out, string(cur))
			return
		}
		if open < n {
			cur = append(cur, '(')
			gen(open+1, close)
			cur = cur[:len(cur)-1]
		}
		if close < open {
			cur = append(cur, ')')
			gen(open, close+1)
			cur = cur[:len(cur)-1]
		}
	}
	gen(0, 0)
	return out
}

func main() {
	ms := &MinStack{}
	ms.Push(-2)
	ms.Push(0)
	ms.Push(-3)
	m1 := ms.GetMin()
	ms.Pop()
	tests := []bool{
		isValid("()[]{}"), !isValid("([)]"), !isValid("(("),
		m1 == -3 && ms.Top() == 0 && ms.GetMin() == -2,
		evalRPN([]string{"2", "1", "+", "3", "*"}) == 9, evalRPN([]string{"4", "13", "5", "/", "+"}) == 6,
		evalRPN([]string{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}) == 22, evalRPN([]string{"-7", "2", "/"}) == -3,
		slices.Equal(generateParenthesis(3), []string{"((()))", "(()())", "(())()", "()(())", "()()()"}), len(generateParenthesis(4)) == 14,
	}
	ok := 0
	for _, t := range tests {
		if t {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(tests))
}
