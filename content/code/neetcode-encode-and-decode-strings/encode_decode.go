// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: go run encode_decode.go
package main

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"unicode/utf8"
)

func joinEncode(strs []string) string { return strings.Join(strs, ",") } // SAI: [] và [""] cùng ra ""

func joinDecode(s string) []string {
	if s == "" {
		return []string{}
	}
	return strings.Split(s, ",")
}

func escapeEncode(strs []string) string {
	var b strings.Builder
	for _, s := range strs {
		b.WriteString(strings.ReplaceAll(strings.ReplaceAll(s, "/", "//"), ",", "/,"))
		b.WriteByte(',')
	}
	return b.String()
}

func escapeDecode(s string) []string {
	out := []string{}
	var cur strings.Builder
	for i := 0; i < len(s); i++ { // duyệt theo byte: "/" và "," là ASCII nên không cắt nhầm giữa ký tự UTF-8
		switch s[i] {
		case '/':
			i++
			cur.WriteByte(s[i])
		case ',':
			out = append(out, cur.String())
			cur.Reset()
		default:
			cur.WriteByte(s[i])
		}
	}
	return out
}

func lengthEncode(strs []string) string {
	var b strings.Builder
	for _, s := range strs {
		b.WriteString(strconv.Itoa(len(s))) // len của string Go đếm BYTE
		b.WriteByte('#')
		b.WriteString(s)
	}
	return b.String()
}

func lengthDecode(s string) []string {
	out := []string{}
	for i := 0; i < len(s); {
		h := i + strings.IndexByte(s[i:], '#')
		n, _ := strconv.Atoi(s[i:h])
		out = append(out, s[h+1:h+1+n]) // cắt theo byte, khớp với len lúc mã hóa
		i = h + 1 + n
	}
	return out
}

func main() {
	cases := [][]string{{"neet", "code", "love", "you"}, {"we", "say", ":", "yes"}, {}, {""}, {"", ""},
		{"a,b", "c"}, {"12#ab", "#"}, {"a/", "/,"}, {"😀é", "x"}}
	for _, v := range []struct {
		name string
		enc  func([]string) string
		dec  func(string) []string
	}{{"join(\",\")", joinEncode, joinDecode}, {"thoát ký tự", escapeEncode, escapeDecode}, {"tiền tố độ dài", lengthEncode, lengthDecode}} {
		ok := 0
		for _, c := range cases {
			if reflect.DeepEqual(v.dec(v.enc(c)), c) {
				ok++
			}
		}
		fmt.Printf("%-15s %d/%d ca đúng\n", v.name, ok, len(cases))
	}
	fmt.Printf("\nlen(\"😀\") = %d, utf8.RuneCountInString(\"😀\") = %d\n", len("😀"), utf8.RuneCountInString("😀"))
}
