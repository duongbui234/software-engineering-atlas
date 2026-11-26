// LC 127 Word Ladder: BFS trên đồ thị ẩn, cùng bộ ca với bản TypeScript.
// Chạy: go run word_ladder.go
package main

import (
	"fmt"
	"strings"
	"time"
)

var expanded = 0 // số từ đã lấy ra để tìm hàng xóm, dùng cho phép đo

func differByOne(a, b string) bool {
	diff := 0
	for i := 0; i < len(a); i++ {
		if a[i] != b[i] {
			diff++
			if diff > 1 {
				return false
			}
		}
	}
	return diff == 1
}

func contains(list []string, w string) bool {
	for _, x := range list {
		if x == w {
			return true
		}
	}
	return false
}

func toSet(list []string) map[string]bool {
	s := make(map[string]bool, len(list))
	for _, w := range list {
		s[w] = true
	}
	return s
}

// Cách 1: BFS, so với từng từ trong danh sách. O(n²·L).
func ladderPairwise(begin, end string, wordList []string) int {
	if !contains(wordList, end) {
		return 0
	}
	seen := map[string]bool{begin: true}
	level := []string{begin}
	for words := 1; len(level) > 0; words++ {
		var next []string
		for _, word := range level {
			expanded++
			if word == end {
				return words
			}
			for _, candidate := range wordList {
				if !seen[candidate] && differByOne(word, candidate) {
					seen[candidate] = true // đánh dấu lúc đưa vào
					next = append(next, candidate)
				}
			}
		}
		level = next
	}
	return 0
}

// Cách 2: BFS, đổi từng chữ thành a..z. O(n·L·26).
// Dùng []byte để sửa một chữ tại chỗ; string(buf) tạo một chuỗi mới cho mỗi lần tra.
func ladderLetters(begin, end string, wordList []string) int {
	unseen := toSet(wordList)
	if !unseen[end] {
		return 0
	}
	delete(unseen, begin)
	queue := []string{begin}
	dist := map[string]int{begin: 1}
	for head := 0; head < len(queue); head++ {
		word := queue[head]
		expanded++
		d := dist[word]
		if word == end {
			return d
		}
		buf := []byte(word)
		for i := range buf {
			original := buf[i]
			for c := byte('a'); c <= 'z'; c++ {
				buf[i] = c
				candidate := string(buf)
				if unseen[candidate] {
					delete(unseen, candidate)
					dist[candidate] = d + 1
					queue = append(queue, candidate)
				}
			}
			buf[i] = original
		}
	}
	return 0
}

// Cách 3: gom từ theo mẫu có dấu *, ví dụ "c*ld".
func ladderBuckets(begin, end string, wordList []string) int {
	if !contains(wordList, end) {
		return 0
	}
	buckets := map[string][]string{}
	for _, word := range wordList {
		for i := range word {
			key := word[:i] + "*" + word[i+1:]
			buckets[key] = append(buckets[key], word)
		}
	}
	seen := map[string]bool{begin: true}
	level := []string{begin}
	for words := 1; len(level) > 0; words++ {
		var next []string
		for _, word := range level {
			expanded++
			if word == end {
				return words
			}
			for i := range word {
				key := word[:i] + "*" + word[i+1:]
				for _, candidate := range buckets[key] {
					if !seen[candidate] {
						seen[candidate] = true
						next = append(next, candidate)
					}
				}
				delete(buckets, key) // một xô chỉ mở một lần
			}
		}
		level = next
	}
	return 0
}

// Cách 4: BFS hai đầu, luôn nới bên có tầng nhỏ hơn.
func ladderBidirectional(begin, end string, wordList []string) int {
	unseen := toSet(wordList)
	if !unseen[end] {
		return 0
	}
	delete(unseen, begin)
	delete(unseen, end)
	front, frontSet := []string{begin}, map[string]bool{begin: true}
	back, backSet := []string{end}, map[string]bool{end: true}
	for words := 2; len(front) > 0 && len(back) > 0; words++ {
		if len(front) > len(back) {
			front, back = back, front
			frontSet, backSet = backSet, frontSet
		}
		var next []string
		for _, word := range front {
			expanded++
			buf := []byte(word)
			for i := range buf {
				original := buf[i]
				for c := byte('a'); c <= 'z'; c++ {
					buf[i] = c
					candidate := string(buf)
					if backSet[candidate] {
						return words // hai phía gặp nhau
					}
					if unseen[candidate] {
						delete(unseen, candidate)
						next = append(next, candidate)
					}
				}
				buf[i] = original
			}
		}
		front, frontSet = next, toSet(next)
	}
	return 0
}

// SAI: DFS trả độ dài đường đầu tiên tìm thấy.
func wrongDfsFirstPath(begin, end string, wordList []string) int {
	unseen := toSet(wordList)
	if !unseen[end] {
		return 0
	}
	delete(unseen, begin)
	var dfs func(word string, words int) int
	dfs = func(word string, words int) int {
		if word == end {
			return words
		}
		buf := []byte(word)
		for i := range buf {
			original := buf[i]
			for c := byte('a'); c <= 'z'; c++ {
				buf[i] = c
				candidate := string(buf)
				if unseen[candidate] {
					delete(unseen, candidate)
					if found := dfs(candidate, words+1); found != 0 {
						return found
					}
				}
			}
			buf[i] = original
		}
		return 0
	}
	return dfs(begin, 1)
}

// SAI: đếm số bước (cạnh) thay vì số từ.
func wrongCountEdges(begin, end string, wordList []string) int {
	words := ladderLetters(begin, end, wordList)
	if words == 0 {
		return 0
	}
	return words - 1
}

// SAI: thấy endWord cách một chữ là trả về, quên kiểm endWord có trong danh sách.
func wrongSkipEndCheck(begin, end string, wordList []string) int {
	seen := map[string]bool{begin: true}
	level := []string{begin}
	for words := 1; len(level) > 0; words++ {
		var next []string
		for _, word := range level {
			if differByOne(word, end) {
				return words + 1
			}
			for _, candidate := range wordList {
				if !seen[candidate] && differByOne(word, candidate) {
					seen[candidate] = true
					next = append(next, candidate)
				}
			}
		}
		level = next
	}
	return 0
}

type testCase struct {
	name, begin, end string
	list             []string
	want             int
}

var cases = []testCase{
	{"cold → warm", "cold", "warm", []string{"cord", "card", "ward", "warm", "corm", "worm", "word"}, 5},
	{"cat → dog", "cat", "dog", []string{"cot", "cog", "dog", "bat"}, 4},
	{"đích không có trong danh sách", "cat", "dog", []string{"cot", "cog"}, 0},
	{"không có đường", "aaa", "bbb", []string{"bbb", "abc"}, 0},
	{"một bước", "ab", "cb", []string{"cb"}, 2},
	{"từ đầu nằm trong danh sách", "pen", "pin", []string{"pen", "pin"}, 2},
	{"từ một chữ", "a", "c", []string{"a", "b", "c"}, 2},
	{"DFS đi vòng", "aa", "bb", []string{"ca", "cb", "bb", "ab"}, 3},
}

type solver struct {
	name  string
	solve func(string, string, []string) int
}

var solvers = []solver{
	{"ladderPairwise", ladderPairwise},
	{"ladderLetters", ladderLetters},
	{"ladderBuckets", ladderBuckets},
	{"ladderBidirectional", ladderBidirectional},
	{"wrongDfsFirstPath", wrongDfsFirstPath},
	{"wrongCountEdges", wrongCountEdges},
	{"wrongSkipEndCheck", wrongSkipEndCheck},
}

var seed int64 = 42

func rnd(n int) int {
	seed = seed * 48271 % 2147483647 // Park–Miller
	return int(seed % int64(n))
}

func randomWord(length, alphabet int) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = byte('a' + rnd(alphabet))
	}
	return string(b)
}

// Hai từ điển 5000 từ dài 6: "dày" (chữ a..e ngẫu nhiên) và "thưa" (mỗi từ mới đổi một chữ của từ có sẵn).
func makeDict(kind string) []string {
	seed = 7
	seen := map[string]bool{}
	var words []string
	if kind == "dày" {
		for len(words) < 5000 {
			w := randomWord(6, 5)
			if !seen[w] {
				seen[w] = true
				words = append(words, w)
			}
		}
		return words
	}
	words = []string{randomWord(6, 26)}
	seen[words[0]] = true
	for len(words) < 5000 {
		buf := []byte(words[rnd(len(words))])
		pos := rnd(6)
		buf[pos] = byte('a' + rnd(26))
		w := string(buf)
		if !seen[w] {
			seen[w] = true
			words = append(words, w)
		}
	}
	return words
}

func farthest(words []string) string {
	unseen := toSet(words)
	delete(unseen, words[0])
	level, last := []string{words[0]}, words[0]
	for len(level) > 0 {
		last = level[len(level)-1]
		var next []string
		for _, w := range level {
			buf := []byte(w)
			for i := range buf {
				original := buf[i]
				for c := byte('a'); c <= 'z'; c++ {
					buf[i] = c
					candidate := string(buf)
					if unseen[candidate] {
						delete(unseen, candidate)
						next = append(next, candidate)
					}
				}
				buf[i] = original
			}
		}
		level = next
	}
	return last
}

func bench(kind string) {
	words := makeDict(kind)
	begin, end := words[0], farthest(words)
	fmt.Printf("từ điển %s, 5000 từ: %s → %s\n", kind, begin, end)
	for _, s := range solvers[:4] {
		expanded = 0
		t0 := time.Now()
		ans := s.solve(begin, end, words)
		ms := float64(time.Since(t0).Microseconds()) / 1000
		fmt.Printf("  %-20s đáp án %d, lấy ra %d từ, %.1f ms\n", s.name, ans, expanded, ms)
	}
}

// Bẫy đánh dấu lúc lấy ra: đáp án vẫn đúng nhưng hàng đợi phình to.
func pushesMarkOnDequeue(begin, end string, wordList []string) (int, int) {
	dict := toSet(wordList)
	visited := map[string]bool{}
	type item struct {
		word string
		d    int
	}
	queue := []item{{begin, 1}}
	pushes := 1
	for head := 0; head < len(queue); head++ {
		it := queue[head]
		if visited[it.word] {
			continue
		}
		visited[it.word] = true // đánh dấu muộn: lúc lấy ra
		if it.word == end {
			return it.d, pushes
		}
		buf := []byte(it.word)
		for i := range buf {
			original := buf[i]
			for c := byte('a'); c <= 'z'; c++ {
				buf[i] = c
				candidate := string(buf)
				if dict[candidate] && !visited[candidate] {
					queue = append(queue, item{candidate, it.d + 1})
					pushes++
				}
			}
			buf[i] = original
		}
	}
	return 0, pushes
}

func main() {
	for _, s := range solvers {
		var wrong []string
		for _, c := range cases {
			list := append([]string(nil), c.list...)
			if got := s.solve(c.begin, c.end, list); got != c.want {
				wrong = append(wrong, fmt.Sprintf("%s → %d", c.name, got))
			}
		}
		tail := ""
		if len(wrong) > 0 {
			tail = "; sai ở " + strings.Join(wrong, ", ")
		}
		fmt.Printf("%-20s %d/%d ca đúng%s\n", s.name, len(cases)-len(wrong), len(cases), tail)
	}

	agree, trials := 0, 2000
	for t := 0; t < trials; t++ {
		length := 2 + rnd(3)
		limit := 1
		for i := 0; i < length; i++ {
			limit *= 3
		}
		if limit > 30 {
			limit = 30
		}
		size := 1 + rnd(limit)
		seen := map[string]bool{}
		var words []string
		for len(words) < size {
			w := randomWord(length, 3)
			if !seen[w] {
				seen[w] = true
				words = append(words, w)
			}
		}
		begin := randomWord(length, 3)
		end := words[rnd(len(words))]
		if begin == end {
			agree++
			continue
		}
		first := ladderPairwise(begin, end, words)
		same := true
		for _, s := range solvers[1:4] {
			if s.solve(begin, end, words) != first {
				same = false
			}
		}
		if same {
			agree++
		}
	}
	fmt.Printf("ngẫu nhiên: %d/%d bộ từ điển, bốn cách khớp nhau\n", agree, trials)

	bench("dày")
	bench("thưa")

	words := makeDict("dày")
	end := farthest(words)
	ans, pushes := pushesMarkOnDequeue(words[0], end, words)
	good := ladderLetters(words[0], end, words)
	fmt.Printf("từ điển dày, đánh dấu lúc lấy ra: đáp án %d, %d lượt đưa vào hàng đợi; đánh dấu lúc đưa vào: đáp án %d, tối đa 5000 lượt\n", ans, pushes, good)
}
