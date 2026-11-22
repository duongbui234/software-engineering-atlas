// Ga ARR-03: tiền tố, hậu tố và mã hóa. Giải 271 và 238, tự chạy test.
// Chạy: go run prefix_suffix_encoding.go
package main

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
)

// 271
func encode(strs []string) string {
	var b strings.Builder
	for _, s := range strs {
		b.WriteString(strconv.Itoa(len(s)) + "#" + s)
	}
	return b.String()
}

func decode(s string) []string {
	out := []string{}
	for i := 0; i < len(s); {
		h := i + strings.IndexByte(s[i:], '#')
		n, _ := strconv.Atoi(s[i:h])
		out = append(out, s[h+1:h+1+n])
		i = h + 1 + n
	}
	return out
}

// 238
func productExceptSelf(nums []int) []int {
	out := make([]int, len(nums))
	left := 1
	for i, x := range nums {
		out[i] = left
		left *= x
	}
	right := 1
	for i := len(nums) - 1; i >= 0; i-- {
		out[i] *= right
		right *= nums[i]
	}
	return out
}

func main() {
	eq := reflect.DeepEqual
	tests := []bool{
		eq(decode(encode([]string{"neet", "code", "love", "you"})), []string{"neet", "code", "love", "you"}),
		eq(decode(encode([]string{})), []string{}), eq(decode(encode([]string{""})), []string{""}),
		eq(decode(encode([]string{"12#ab", "#"})), []string{"12#ab", "#"}),
		eq(productExceptSelf([]int{1, 2, 3, 4}), []int{24, 12, 8, 6}), eq(productExceptSelf([]int{-1, 1, 0, -3, 3}), []int{0, 0, 9, 0, 0}),
		eq(productExceptSelf([]int{0, 0, 5}), []int{0, 0, 0}),
	}
	ok := 0
	for _, t := range tests {
		if t {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(tests))
}
