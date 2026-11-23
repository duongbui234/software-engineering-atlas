// LeetCode 621, Task Scheduler: mô phỏng bằng container/heap, công thức khung và phép đo.
// Chạy: go run task_scheduler.go
package main

import (
	"container/heap"
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"
)

// maxHeap: Less trả h[i] > h[j] nên đỉnh là số lần còn lại LỚN nhất.
type maxHeap []int

func (h maxHeap) Len() int           { return len(h) }
func (h maxHeap) Less(i, j int) bool { return h[i] > h[j] }
func (h maxHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *maxHeap) Push(x any)        { *h = append(*h, x.(int)) }
func (h *maxHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

// cooling: một việc đang nguội, còn c lần, chạy lại được sau nhịp ready.
type cooling struct{ c, ready int }

// LeetCode cho tasks kiểu []byte; t - 'A' là chỉ số 0..25.
func leastIntervalHeap(tasks []byte, n int) int {
	var cnt [26]int
	for _, t := range tasks {
		cnt[t-'A']++
	}
	h := maxHeap{}
	for _, c := range cnt {
		if c > 0 {
			h = append(h, c)
		}
	}
	heap.Init(&h)
	var queue []cooling
	t := 0
	for h.Len() > 0 || len(queue) > 0 {
		t++
		if h.Len() > 0 {
			c := heap.Pop(&h).(int) - 1
			if c > 0 {
				queue = append(queue, cooling{c, t + n})
			}
		}
		if len(queue) > 0 && queue[0].ready == t {
			heap.Push(&h, queue[0].c)
			queue = queue[1:]
		}
	}
	return t
}

// Công thức khung: max(số việc, (f - 1)(n + 1) + k).
func leastIntervalFormula(tasks []byte, n int) int {
	var cnt [26]int
	f := 0
	for _, t := range tasks {
		cnt[t-'A']++
		f = max(f, cnt[t-'A'])
	}
	k := 0
	for _, c := range cnt {
		if c == f {
			k++
		}
	}
	return max(len(tasks), (f-1)*(n+1)+k)
}

// Theo vòng: mỗi vòng n + 1 nhịp, sắp số lần giảm dần rồi chạy tối đa n + 1 việc nhiều nhất.
func leastIntervalRounds(tasks []byte, n int) int {
	cnt := make([]int, 26)
	for _, t := range tasks {
		cnt[t-'A']++
	}
	total := 0
	for {
		sort.Sort(sort.Reverse(sort.IntSlice(cnt)))
		if cnt[0] == 0 {
			return total
		}
		ran := 0
		for i := 0; i < 26 && ran < n+1 && cnt[i] > 0; i++ {
			cnt[i]--
			ran++
		}
		if countPositive(cnt) == 0 {
			return total + ran // vòng cuối không cần nghỉ cho đủ n + 1
		}
		total += n + 1
	}
}

func countPositive(cnt []int) int {
	k := 0
	for _, c := range cnt {
		if c > 0 {
			k++
		}
	}
	return k
}

func main() {
	cases := []struct {
		s    string
		n    int
		want int
	}{
		{"AAABBB", 2, 8}, {"ACABDB", 1, 6}, {"AAABBB", 3, 10}, {"AAABBB", 0, 6}, {"A", 100, 1},
		{"AAAAAABCDEFG", 2, 16}, {"ABBB", 1, 5}, {"AABBCCDD", 1, 8}, {"AAABBBCCCDDE", 2, 12}, {"AAAB", 3, 9},
	}
	fns := []struct {
		name string
		fn   func([]byte, int) int
	}{{"leastIntervalHeap", leastIntervalHeap}, {"leastIntervalFormula", leastIntervalFormula}, {"leastIntervalRounds", leastIntervalRounds}}
	for _, f := range fns {
		var bad []string
		for _, c := range cases {
			if got := f.fn([]byte(c.s), c.n); got != c.want {
				bad = append(bad, fmt.Sprintf("%s n=%d → %d", c.s, c.n, got))
			}
		}
		msg := ""
		if len(bad) > 0 {
			msg = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-21s %d/%d ca đúng%s\n", f.name, len(cases)-len(bad), len(cases), msg)
	}

	rng := rand.New(rand.NewSource(621))
	gen := func(size, letters int) []byte {
		b := make([]byte, size)
		for i := range b {
			b[i] = byte('A' + rng.Intn(letters))
		}
		return b
	}
	agree := 0
	for r := 0; r < 300; r++ {
		t := gen(1+rng.Intn(2000), 1+rng.Intn(26))
		n := rng.Intn(101)
		want := leastIntervalFormula(t, n)
		if leastIntervalHeap(t, n) == want && leastIntervalRounds(t, n) == want {
			agree++
		}
	}
	fmt.Printf("\nngẫu nhiên: ba cách khớp ở %d/300 bộ\n", agree)

	median := func(fn func([]byte, int) int, t []byte, n int) float64 {
		ts := make([]float64, 5)
		for r := range ts {
			t0 := time.Now()
			fn(t, n)
			ts[r] = float64(time.Since(t0).Microseconds()) / 1000
		}
		sort.Float64s(ts)
		return ts[2]
	}
	fmt.Println("\nsố việc   n      heap        theo vòng   công thức")
	for _, c := range [][2]int{{10000, 2}, {100000, 100}, {1000000, 100}} {
		t := gen(c[0], 26)
		fmt.Printf("%-9d %-6d %7.2f ms %8.2f ms %8.2f ms\n", c[0], c[1],
			median(leastIntervalHeap, t, c[1]), median(leastIntervalRounds, t, c[1]), median(leastIntervalFormula, t, c[1]))
	}
}
