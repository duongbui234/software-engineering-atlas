// NC-05 Top K Frequent Elements (LeetCode 347), Go: container/heap và bucket sort.
// Chạy: go run top_k_frequent.go
package main

import (
	"container/heap"
	"fmt"
)

type entry struct{ val, freq int }

// container/heap không phải một kiểu có sẵn: bạn cài 5 phương thức, gói heap lo phần nổi/chìm.
type minHeap []entry

func (h minHeap) Len() int           { return len(h) }
func (h minHeap) Less(i, j int) bool { return h[i].freq < h[j].freq }
func (h minHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x any)        { *h = append(*h, x.(entry)) }
func (h *minHeap) Pop() any {
	old := *h
	x := old[len(old)-1]
	*h = old[:len(old)-1]
	return x
}

func topKHeap(nums []int, k int) []int {
	count := map[int]int{}
	for _, x := range nums {
		count[x]++
	}
	h := &minHeap{}
	for v, f := range count {
		heap.Push(h, entry{v, f}) // gọi heap.Push, không gọi h.Push trực tiếp
		if h.Len() > k {
			heap.Pop(h)
		}
	}
	out := make([]int, h.Len())
	for i := len(out) - 1; i >= 0; i-- {
		out[i] = heap.Pop(h).(entry).val
	}
	return out
}

func topKBuckets(nums []int, k int) []int {
	count := map[int]int{}
	for _, x := range nums {
		count[x]++
	}
	buckets := make([][]int, len(nums)+1)
	for v, f := range count {
		buckets[f] = append(buckets[f], v)
	}
	out := make([]int, 0, k)
	for f := len(nums); f > 0 && len(out) < k; f-- {
		for _, v := range buckets[f] {
			out = append(out, v)
			if len(out) == k {
				break
			}
		}
	}
	return out
}

func main() {
	for _, c := range []struct {
		nums []int
		k    int
	}{{[]int{1, 1, 1, 2, 2, 3}, 2}, {[]int{1}, 1}, {[]int{4, 4, 4, 4, -1, -1, -1, 2, 2, 7}, 3}} {
		fmt.Println(c.nums, c.k, "→ heap", topKHeap(c.nums, c.k), "| bucket", topKBuckets(c.nums, c.k))
	}
}
