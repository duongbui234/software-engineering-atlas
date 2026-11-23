// LeetCode 355: Design Twitter. Chạy: go run design_twitter.go
// postTweet, follow, unfollow, và getNewsFeed: 10 tweet mới nhất của chính mình và người mình theo dõi.
package main

import (
	"container/heap"
	"fmt"
	"slices"
	"strings"
)

type tweet struct{ time, id int }

// item của heap: tweet mới nhất chưa lấy của một nguồn, và vị trí của nó trong danh sách nguồn đó.
type item struct{ time, id, user, idx int }

// feedHeap là max-heap theo time: Less trả a > b. container/heap gọi Push/Pop qua con trỏ.
type feedHeap []item

func (h feedHeap) Len() int           { return len(h) }
func (h feedHeap) Less(i, j int) bool { return h[i].time > h[j].time }
func (h feedHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *feedHeap) Push(x any)        { *h = append(*h, x.(item)) }
func (h *feedHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

type Twitter struct {
	time    int
	tweets  map[int][]tweet          // userId → tweet, cũ trước mới sau
	follows map[int]map[int]struct{} // followerId → tập followeeId
}

func Constructor() Twitter {
	return Twitter{tweets: map[int][]tweet{}, follows: map[int]map[int]struct{}{}}
}

func (t *Twitter) PostTweet(userId, tweetId int) {
	t.tweets[userId] = append(t.tweets[userId], tweet{t.time, tweetId})
	t.time++
}

func (t *Twitter) GetNewsFeed(userId int) []int {
	h := &feedHeap{}
	add := func(u int) {
		if lst := t.tweets[u]; len(lst) > 0 {
			i := len(lst) - 1
			*h = append(*h, item{lst[i].time, lst[i].id, u, i})
		}
	}
	add(userId)
	for u := range t.follows[userId] { // đọc map nil an toàn: vòng lặp không chạy
		add(u)
	}
	heap.Init(h)
	feed := []int{}
	for h.Len() > 0 && len(feed) < 10 {
		top := heap.Pop(h).(item) // heap.Pop của gói, không phải h.Pop
		feed = append(feed, top.id)
		if top.idx > 0 {
			p := t.tweets[top.user][top.idx-1]
			heap.Push(h, item{p.time, p.id, top.user, top.idx - 1})
		}
	}
	return feed
}

func (t *Twitter) Follow(followerId, followeeId int) {
	if followerId == followeeId {
		return
	}
	if t.follows[followerId] == nil { // ghi vào map con nil sẽ panic: phải tạo trước
		t.follows[followerId] = map[int]struct{}{}
	}
	t.follows[followerId][followeeId] = struct{}{}
}

func (t *Twitter) Unfollow(followerId, followeeId int) {
	delete(t.follows[followerId], followeeId) // delete trên map nil không làm gì
}

type op struct {
	kind string
	a, b int
	want []int
}

func main() {
	hon10 := []op{{"follow", 1, 2, nil}}
	for i := 0; i < 12; i++ {
		hon10 = append(hon10, op{"post", 1 + i%2, 100 + i, nil})
	}
	hon10 = append(hon10, op{"feed", 1, 0, []int{111, 110, 109, 108, 107, 106, 105, 104, 103, 102}})
	cases := []struct {
		label string
		ops   []op
	}{
		{"ví dụ của đề", []op{{"post", 1, 5, nil}, {"feed", 1, 0, []int{5}}, {"follow", 1, 2, nil}, {"post", 2, 6, nil}, {"feed", 1, 0, []int{6, 5}}, {"unfollow", 1, 2, nil}, {"feed", 1, 0, []int{5}}}},
		{"chưa ai đăng gì", []op{{"feed", 7, 0, []int{}}}},
		{"thấy tweet của chính mình", []op{{"post", 1, 1, nil}, {"post", 1, 2, nil}, {"feed", 1, 0, []int{2, 1}}}},
		{"xen kẽ hai người", []op{{"follow", 1, 2, nil}, {"post", 1, 10, nil}, {"post", 2, 20, nil}, {"post", 1, 11, nil}, {"post", 2, 21, nil}, {"feed", 1, 0, []int{21, 11, 20, 10}}}},
		{"hơn 10 tweet", hon10},
		{"tự follow rồi tự unfollow", []op{{"post", 1, 5, nil}, {"follow", 1, 1, nil}, {"unfollow", 1, 1, nil}, {"feed", 1, 0, []int{5}}}},
		{"unfollow người chưa theo dõi", []op{{"post", 2, 9, nil}, {"unfollow", 1, 2, nil}, {"feed", 1, 0, []int{}}}},
		{"follow hai lần", []op{{"follow", 1, 2, nil}, {"follow", 1, 2, nil}, {"post", 2, 3, nil}, {"feed", 1, 0, []int{3}}, {"unfollow", 1, 2, nil}, {"feed", 1, 0, []int{}}}},
		{"tweet đăng trước khi follow vẫn hiện", []op{{"post", 2, 1, nil}, {"post", 2, 2, nil}, {"follow", 1, 2, nil}, {"feed", 1, 0, []int{2, 1}}}},
	}
	var bad []string
	for _, c := range cases {
		tw := Constructor()
		ok := true
		var got []string
		for _, o := range c.ops {
			switch o.kind {
			case "post":
				tw.PostTweet(o.a, o.b)
			case "follow":
				tw.Follow(o.a, o.b)
			case "unfollow":
				tw.Unfollow(o.a, o.b)
			default:
				f := tw.GetNewsFeed(o.a)
				got = append(got, fmt.Sprint(f))
				ok = ok && slices.Equal(f, o.want)
			}
		}
		if !ok {
			bad = append(bad, c.label+" → "+strings.Join(got, " "))
		}
	}
	fmt.Printf("Twitter  %d/%d ca đúng", len(cases)-len(bad), len(cases))
	if len(bad) > 0 {
		fmt.Print("; sai ở: ", strings.Join(bad, "; "))
	}
	fmt.Println()

	// Bẫy: map[int]map[int]struct{} có map con nil cho người chưa follow ai. Đọc và delete thì được, ghi thì panic.
	follows := map[int]map[int]struct{}{}
	_, has := follows[1][2]
	fmt.Println("\nđọc map con nil:", has)
	func() {
		defer func() { fmt.Println("ghi vào map con nil:", recover()) }()
		follows[1][2] = struct{}{}
	}()
}
