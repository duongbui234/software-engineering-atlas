// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng và test.
// Chạy: go run eval_rpn.go
package main

import (
	"fmt"
	"strconv"
)

func apply(op string, a, b int) int {
	switch op {
	case "+":
		return a + b
	case "-":
		return a - b
	case "*":
		return a * b
	}
	return a / b // chia số nguyên của Go làm tròn về 0, đúng như đề
}

func isOp(t string) bool { return t == "+" || t == "-" || t == "*" || t == "/" }

func evalStack(tokens []string) int {
	st := []int{}
	for _, t := range tokens {
		if isOp(t) {
			a, b := st[len(st)-2], st[len(st)-1]
			st = st[:len(st)-2]
			st = append(st, apply(t, a, b))
		} else {
			n, _ := strconv.Atoi(t) // Atoi đọc được cả "-11"
			st = append(st, n)
		}
	}
	return st[0]
}

func evalRecursive(tokens []string) int {
	i := len(tokens) - 1
	var walk func() int
	walk = func() int {
		t := tokens[i]
		i--
		if !isOp(t) {
			n, _ := strconv.Atoi(t)
			return n
		}
		b := walk()
		a := walk()
		return apply(t, a, b)
	}
	return walk()
}

func main() {
	cases := []struct {
		tokens []string
		want   int
	}{
		{[]string{"2", "1", "+", "3", "*"}, 9},
		{[]string{"4", "13", "5", "/", "+"}, 6},
		{[]string{"10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"}, 22},
		{[]string{"3", "4", "-"}, -1},
		{[]string{"7", "-2", "/"}, -3},
		{[]string{"-7", "2", "/"}, -3},
		{[]string{"42"}, 42},
	}
	for _, f := range []struct {
		name string
		fn   func([]string) int
	}{{"evalStack", evalStack}, {"evalRecursive", evalRecursive}} {
		ok := 0
		for _, c := range cases {
			if f.fn(c.tokens) == c.want {
				ok++
			}
		}
		fmt.Printf("%-14s %d/%d ca đúng\n", f.name, ok, len(cases))
	}
	// Stack của goroutine tự nới (tới 1 GB mặc định), nên đệ quy 10⁶ tầng vẫn chạy.
	deep := []string{"1"}
	for k := 0; k < 1_000_000; k++ {
		deep = append(deep, "1", "+")
	}
	fmt.Printf("\nđệ quy 10⁶ tầng: %d\n", evalRecursive(deep))
}
