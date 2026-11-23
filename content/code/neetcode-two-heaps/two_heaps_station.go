// Ga SRCH-04, hai heap và lập lịch: giải 621, 355 và 295 bằng container/heap.
// Chạy: go run two_heaps_station.go
package main

import (
	"container/heap"
	"fmt"
	"reflect"
	"strings"
)

// intHeap là min-heap số nguyên; maxIntHeap chỉ đổi Less.
type intHeap []int

func (h intHeap) Len() int           { return len(h) }
func (h intHeap) Less(i, j int) bool { return h[i] < h[j] }
func (h intHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *intHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *intHeap) Pop() any          { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

type maxIntHeap struct{ intHeap }

func (h maxIntHeap) Less(i, j int) bool { return h.intHeap[i] > h.intHeap[j] }

// 621: max-heap số lần còn lại; việc vừa chạy nghỉ trong hàng chờ tới thời điểm được chạy lại.
func leastInterval(tasks string, n int) int {
	count := map[rune]int{}
	for _, t := range tasks {
		count[t]++
	}
	ready := &maxIntHeap{}
	for _, c := range count {
		heap.Push(ready, c)
	}
	type wait struct{ left, at int }
	var cooling []wait
	time := 0
	for ready.Len() > 0 || len(cooling) > 0 {
		time++
		if ready.Len() > 0 {
			if left := heap.Pop(ready).(int) - 1; left > 0 {
				cooling = append(cooling, wait{left, time + n})
			}
		}
		if len(cooling) > 0 && cooling[0].at == time {
			heap.Push(ready, cooling[0].left)
			cooling = cooling[1:]
		}
	}
	return time
}

// 355: bảng tin là trộn k danh sách tweet (k-way merge) bằng max-heap theo thời điểm.
type tweet struct{ at, id int }
type cursor struct{ at, user, i int }
type cursorHeap []cursor

func (h cursorHeap) Len() int           { return len(h) }
func (h cursorHeap) Less(i, j int) bool { return h[i].at > h[j].at }
func (h cursorHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *cursorHeap) Push(x any)        { *h = append(*h, x.(cursor)) }
func (h *cursorHeap) Pop() any          { old := *h; x := old[len(old)-1]; *h = old[:len(old)-1]; return x }

type Twitter struct {
	clock   int
	tweets  map[int][]tweet
	follows map[int]map[int]bool
}

func NewTwitter() *Twitter {
	return &Twitter{tweets: map[int][]tweet{}, follows: map[int]map[int]bool{}}
}

func (t *Twitter) PostTweet(user, id int) {
	t.tweets[user] = append(t.tweets[user], tweet{t.clock, id})
	t.clock++
}

func (t *Twitter) GetNewsFeed(user int) []int {
	h := &cursorHeap{}
	users := map[int]bool{user: true}
	for u := range t.follows[user] {
		users[u] = true
	}
	for u := range users {
		if l := t.tweets[u]; len(l) > 0 {
			heap.Push(h, cursor{l[len(l)-1].at, u, len(l) - 1})
		}
	}
	feed := []int{}
	for h.Len() > 0 && len(feed) < 10 {
		c := heap.Pop(h).(cursor)
		l := t.tweets[c.user]
		feed = append(feed, l[c.i].id)
		if c.i > 0 {
			heap.Push(h, cursor{l[c.i-1].at, c.user, c.i - 1})
		}
	}
	return feed
}

func (t *Twitter) Follow(a, b int) {
	if t.follows[a] == nil {
		t.follows[a] = map[int]bool{}
	}
	t.follows[a][b] = true
}

func (t *Twitter) Unfollow(a, b int) { delete(t.follows[a], b) }

// 295: lower là max-heap giữ nửa nhỏ, upper là min-heap giữ nửa lớn.
type MedianFinder struct {
	lower *maxIntHeap
	upper *intHeap
}

func NewMedianFinder() *MedianFinder { return &MedianFinder{&maxIntHeap{}, &intHeap{}} }

func (m *MedianFinder) AddNum(x int) {
	heap.Push(m.lower, x)
	heap.Push(m.upper, heap.Pop(m.lower))
	if m.upper.Len() > m.lower.Len() {
		heap.Push(m.lower, heap.Pop(m.upper))
	}
}

func (m *MedianFinder) FindMedian() float64 {
	if m.lower.Len() > m.upper.Len() {
		return float64(m.lower.intHeap[0])
	}
	return float64(m.lower.intHeap[0]+(*m.upper)[0]) / 2
}

func medians(xs []int) []float64 {
	m, out := NewMedianFinder(), []float64{}
	for _, x := range xs {
		m.AddNum(x)
		out = append(out, m.FindMedian())
	}
	return out
}

func main() {
	type check struct {
		label     string
		got, want any
	}
	ex := func() [][]int {
		t, out := NewTwitter(), [][]int{}
		t.PostTweet(1, 5)
		out = append(out, t.GetNewsFeed(1))
		t.Follow(1, 2)
		t.PostTweet(2, 6)
		out = append(out, t.GetNewsFeed(1))
		t.Unfollow(1, 2)
		return append(out, t.GetNewsFeed(1))
	}
	ten := func() []int {
		t := NewTwitter()
		for i := 1; i <= 11; i++ {
			t.PostTweet(1, i)
		}
		return t.GetNewsFeed(1)
	}
	self := func() []int {
		t := NewTwitter()
		t.PostTweet(1, 7)
		t.Follow(1, 1)
		return t.GetNewsFeed(1)
	}
	three := func() []int {
		t := NewTwitter()
		t.PostTweet(1, 1)
		t.PostTweet(2, 2)
		t.PostTweet(3, 3)
		t.PostTweet(1, 4)
		t.Follow(1, 2)
		t.Follow(1, 3)
		return t.GetNewsFeed(1)
	}
	checks := []check{
		{"621 ví dụ 1", leastInterval("AAABBB", 2), 8},
		{"621 ví dụ 2", leastInterval("ACABDB", 1), 6},
		{"621 ví dụ 3", leastInterval("AAABBB", 3), 10},
		{"621 nhiều loại việc", leastInterval("AAAAAABCDEFG", 2), 16},
		{"621 n = 0", leastInterval("AAB", 0), 3},
		{"355 ví dụ của đề", ex(), [][]int{{5}, {6, 5}, {5}}},
		{"355 chỉ 10 tweet mới nhất", ten(), []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}},
		{"355 tự theo dõi mình", self(), []int{7}},
		{"355 xen kẽ ba người", three(), []int{4, 3, 2, 1}},
		{"295 ví dụ của đề", medians([]int{1, 2, 3})[1:], []float64{1.5, 2}},
		{"295 giảm dần", medians([]int{5, 4, 3, 2, 1}), []float64{5, 4.5, 4, 3.5, 3}},
		{"295 số âm", medians([]int{-1, -2, -3, -4}), []float64{-1, -1.5, -2, -2.5}},
		{"295 trùng nhau", medians([]int{7, 7, 7, 7})[3], 7.0},
		{"295 xen kẽ", medians([]int{6, 10, 2, 6, 5, 0}), []float64{6, 8, 6, 6, 6, 5.5}},
	}
	var bad []string
	for _, c := range checks {
		if !reflect.DeepEqual(c.got, c.want) {
			bad = append(bad, fmt.Sprintf("%s → %v", c.label, c.got))
		}
	}
	msg := ""
	if len(bad) > 0 {
		msg = "; sai ở: " + strings.Join(bad, "; ")
	}
	fmt.Printf("two_heaps_station %d/%d ca đúng%s\n", len(checks)-len(bad), len(checks), msg)
}
