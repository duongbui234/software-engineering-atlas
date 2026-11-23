// LeetCode 981: Time Based Key-Value Store. Chạy: go run time_map.go
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".
package main

import (
	"fmt"
	"sort"
	"strings"
)

type history struct {
	times  []int
	values []string
}

// Map trỏ tới *history: m.store[key].times = … với map[string]history là lỗi biên dịch
// ("cannot assign to struct field … in map"), vì giá trị trong map không lấy địa chỉ được.
type TimeMap struct {
	store map[string]*history
}

func Constructor() TimeMap { return TimeMap{store: map[string]*history{}} }

func (m *TimeMap) Set(key, value string, timestamp int) {
	h := m.store[key]
	if h == nil {
		h = &history{}
		m.store[key] = h
	}
	h.times = append(h.times, timestamp) // đề hứa timestamp tăng dần: append giữ mảng đã sắp
	h.values = append(h.values, value)
}

func (m *TimeMap) Get(key string, timestamp int) string {
	h := m.store[key]
	if h == nil {
		return ""
	}
	// sort.Search trả chỉ số nhỏ nhất làm điều kiện đúng: mốc đầu tiên > timestamp
	i := sort.Search(len(h.times), func(i int) bool { return h.times[i] > timestamp })
	if i == 0 {
		return ""
	}
	return h.values[i-1]
}

type op struct {
	kind, key, value string
	t                int
}

func main() {
	S := func(k, v string, t int) op { return op{"set", k, v, t} }
	G := func(k string, t int, want string) op { return op{"get", k, want, t} }
	cases := []struct {
		label string
		ops   []op
	}{
		{"ví dụ của đề", []op{S("foo", "bar", 1), G("foo", 1, "bar"), G("foo", 3, "bar"), S("foo", "bar2", 4), G("foo", 4, "bar2"), G("foo", 5, "bar2")}},
		{"key chưa từng set", []op{G("x", 10, "")}},
		{"t nhỏ hơn mốc đầu", []op{S("a", "v", 5), G("a", 4, ""), G("a", 5, "v")}},
		{"t nằm giữa hai mốc", []op{S("a", "v1", 10), S("a", "v2", 20), G("a", 15, "v1")}},
		{"t lớn hơn mốc cuối", []op{S("a", "v1", 10), S("a", "v2", 20), G("a", 99, "v2")}},
		{"hai key xen kẽ", []op{S("a", "a1", 1), S("b", "b1", 2), S("a", "a2", 3), G("b", 3, "b1"), G("a", 2, "a1"), G("b", 1, "")}},
		{"trùng mốc ở giữa", []op{S("k", "1", 1), S("k", "2", 2), S("k", "3", 3), G("k", 2, "2")}},
		{"timestamp 10⁷", []op{S("k", "lo", 1), S("k", "hi", 10_000_000), G("k", 9_999_999, "lo"), G("k", 10_000_000, "hi")}},
	}
	var bad []string
	for _, c := range cases {
		m := Constructor()
		ok := true
		for _, o := range c.ops {
			if o.kind == "set" {
				m.Set(o.key, o.value, o.t)
			} else if m.Get(o.key, o.t) != o.value {
				ok = false
			}
		}
		if !ok {
			bad = append(bad, c.label)
		}
	}
	fmt.Printf("TimeMap  %d/%d ca đúng", len(cases)-len(bad), len(cases))
	if len(bad) > 0 {
		fmt.Printf("; sai ở: %s", strings.Join(bad, "; "))
	}
	fmt.Println()

	// Map trả giá trị rỗng cho key không có: với map[string]*history đó là nil, nên phải kiểm nil trước khi đọc.
	var missing *history = map[string]*history{}["x"]
	fmt.Println("map[string]*history{}[\"x\"] == nil:", missing == nil)
}
