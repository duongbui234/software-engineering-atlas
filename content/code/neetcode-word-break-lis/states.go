package main

import (
	"fmt"
	"sort"
	"strings"
)

func wordBreak(s string, words []string) bool {
	reachable := make([]bool, len(s)+1)
	reachable[0] = true
	for start := 0; start < len(s); start++ {
		if !reachable[start] {
			continue
		}
		for _, word := range words {
			if strings.HasPrefix(s[start:], word) {
				reachable[start+len(word)] = true
			}
		}
	}
	return reachable[len(s)]
}

func lisLength(nums []int) int {
	tails := []int{}
	for _, value := range nums {
		i := sort.SearchInts(tails, value)
		if i == len(tails) {
			tails = append(tails, value)
		} else {
			tails[i] = value
		}
	}
	return len(tails)
}

func main() {
	prefixes := make([]string, 20)
	for i := range prefixes {
		prefixes[i] = strings.Repeat("a", i+1)
	}
	increasing := make([]int, 2500)
	duplicate := make([]int, 2500)
	for i := range increasing {
		increasing[i] = i - 1250
		duplicate[i] = -10000
	}
	checks := []bool{
		wordBreak("atlasroute", []string{"at", "atlas", "route"}),
		wordBreak("trailtrail", []string{"trail"}),
		!wordBreak("mapz", []string{"ma", "map", "ap"}),
		wordBreak("ababa", []string{"aba", "ab"}),
		!wordBreak(strings.Repeat("a", 299)+"b", prefixes),
		wordBreak(strings.Repeat("a", 300), []string{strings.Repeat("a", 20)}),
		wordBreak("survey", []string{"survey"}),
		!wordBreak("map", []string{"mapping"}),
		lisLength([]int{-5, -3, -1, 0}) == 4,
		lisLength([]int{10, 8, 6, 4}) == 1,
		lisLength([]int{7, 7, 7}) == 1,
		lisLength([]int{3, 5, 6, 2, 4}) == 3,
		lisLength([]int{4, 4, 1, 2, 2, 3}) == 3,
		lisLength([]int{6, 8, 2, 3, 5, 9}) == 4,
		lisLength(increasing) == 2500,
		lisLength(duplicate) == 1,
	}
	for i, ok := range checks {
		if !ok {
			panic(fmt.Sprintf("Ca kiểm tra sai: %d", i+1))
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(checks), len(checks))
}
