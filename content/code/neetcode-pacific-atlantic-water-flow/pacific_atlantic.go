// LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
// Chạy: go run pacific_atlantic.go
package main

import (
	"fmt"
	"math/rand"
	"sort"
	"strings"
	"time"
)

type Grid [][]int

var dirs = [4][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

// Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi và xem nó chạm bờ nào. O((mn)^2).
func bruteForce(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	result := [][]int{}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			pacific, atlantic := false, false
			seen := make([]bool, m*n)
			seen[r*n+c] = true
			queue := []int{r*n + c}
			for head := 0; head < len(queue) && !(pacific && atlantic); head++ {
				cr, cc := queue[head]/n, queue[head]%n
				if cr == 0 || cc == 0 {
					pacific = true
				}
				if cr == m-1 || cc == n-1 {
					atlantic = true
				}
				for _, d := range dirs {
					nr, nc := cr+d[0], cc+d[1]
					if nr < 0 || nr >= m || nc < 0 || nc >= n {
						continue
					}
					if seen[nr*n+nc] || heights[nr][nc] > heights[cr][cc] {
						continue
					}
					seen[nr*n+nc] = true
					queue = append(queue, nr*n+nc)
				}
			}
			if pacific && atlantic {
				result = append(result, []int{r, c})
			}
		}
	}
	return result
}

func borders(m, n int) (pacific, atlantic []int) {
	for c := 0; c < n; c++ {
		pacific = append(pacific, c)
		atlantic = append(atlantic, (m-1)*n+c)
	}
	for r := 0; r < m; r++ {
		pacific = append(pacific, r*n)
		atlantic = append(atlantic, r*n+n-1)
	}
	return
}

// climb là BFS nhiều nguồn; ok(cao mới, cao cũ) quyết định có đi tiếp không.
func climb(heights Grid, seeds []int, ok func(next, cur int) bool) []bool {
	m, n := len(heights), len(heights[0])
	seen := make([]bool, m*n)
	queue := []int{}
	for _, s := range seeds {
		if !seen[s] {
			seen[s] = true
			queue = append(queue, s)
		}
	}
	for head := 0; head < len(queue); head++ {
		cr, cc := queue[head]/n, queue[head]%n
		for _, d := range dirs {
			nr, nc := cr+d[0], cc+d[1]
			if nr < 0 || nr >= m || nc < 0 || nc >= n {
				continue
			}
			if seen[nr*n+nc] || !ok(heights[nr][nc], heights[cr][cc]) {
				continue
			}
			seen[nr*n+nc] = true
			queue = append(queue, nr*n+nc)
		}
	}
	return seen
}

func uphill(next, cur int) bool { return next >= cur }

func intersect(a, b []bool, n int) [][]int {
	result := [][]int{}
	for i := range a {
		if a[i] && b[i] {
			result = append(result, []int{i / n, i % n})
		}
	}
	return result
}

// Cách 2: đi ngược từ bờ, BFS nhiều nguồn leo lên ô cao hơn hoặc bằng. O(mn).
func reverseBfs(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	pacific, atlantic := borders(m, n)
	return intersect(climb(heights, pacific, uphill), climb(heights, atlantic, uphill), n)
}

// Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
func climbStack(heights Grid, seeds []int) []bool {
	m, n := len(heights), len(heights[0])
	seen := make([]bool, m*n)
	stack := []int{}
	for _, s := range seeds {
		if !seen[s] {
			seen[s] = true
			stack = append(stack, s)
		}
	}
	for len(stack) > 0 {
		cur := stack[len(stack)-1]
		stack = stack[:len(stack)-1]
		cr, cc := cur/n, cur%n
		for _, d := range dirs {
			nr, nc := cr+d[0], cc+d[1]
			if nr < 0 || nr >= m || nc < 0 || nc >= n {
				continue
			}
			if seen[nr*n+nc] || heights[nr][nc] < heights[cr][cc] {
				continue
			}
			seen[nr*n+nc] = true
			stack = append(stack, nr*n+nc)
		}
	}
	return seen
}

func reverseDfsIterative(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	pacific, atlantic := borders(m, n)
	return intersect(climbStack(heights, pacific), climbStack(heights, atlantic), n)
}

// Cách 4: DFS đệ quy. Stack của goroutine tự nới, nên 40 000 tầng vẫn chạy.
func reverseDfsRecursive(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	climbRec := func(seeds []int) []bool {
		seen := make([]bool, m*n)
		var visit func(r, c int)
		visit = func(r, c int) {
			seen[r*n+c] = true
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr < 0 || nr >= m || nc < 0 || nc >= n {
					continue
				}
				if seen[nr*n+nc] || heights[nr][nc] < heights[r][c] {
					continue
				}
				visit(nr, nc)
			}
		}
		for _, s := range seeds {
			if !seen[s] {
				visit(s/n, s%n)
			}
		}
		return seen
	}
	pacific, atlantic := borders(m, n)
	return intersect(climbRec(pacific), climbRec(atlantic), n)
}

// Sai 1: đi ngược nhưng vẫn so như nước chảy xuôi.
func wrongDirection(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	down := func(next, cur int) bool { return next <= cur }
	pacific, atlantic := borders(m, n)
	return intersect(climb(heights, pacific, down), climb(heights, atlantic, down), n)
}

// Sai 2: so ngặt, quên rằng nước chảy qua ô cao bằng nhau.
func wrongStrict(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	strict := func(next, cur int) bool { return next > cur }
	pacific, atlantic := borders(m, n)
	return intersect(climb(heights, pacific, strict), climb(heights, atlantic, strict), n)
}

// Sai 3: mỗi đại dương chỉ gieo một cạnh (hàng trên, hàng dưới).
func wrongOneEdge(heights Grid) [][]int {
	m, n := len(heights), len(heights[0])
	var pacific, atlantic []int
	for c := 0; c < n; c++ {
		pacific = append(pacific, c)
		atlantic = append(atlantic, (m-1)*n+c)
	}
	return intersect(climb(heights, pacific, uphill), climb(heights, atlantic, uphill), n)
}

// ---------- Kiểm chung ----------

func key(cells [][]int) string {
	parts := make([]string, len(cells))
	for i, p := range cells {
		parts[i] = fmt.Sprintf("%d,%d", p[0], p[1])
	}
	sort.Strings(parts)
	return strings.Join(parts, " ")
}

func rowMajor(m, n int) Grid {
	g := make(Grid, m)
	for r := range g {
		g[r] = make([]int, n)
		for c := range g[r] {
			g[r][c] = r*n + c
		}
	}
	return g
}

func rowMajorAnswer(m, n int) [][]int {
	out := [][]int{}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			if r == m-1 || c == n-1 {
				out = append(out, []int{r, c})
			}
		}
	}
	return out
}

func flatGrid(m, n int) Grid {
	g := make(Grid, m)
	for r := range g {
		g[r] = make([]int, n)
		for c := range g[r] {
			g[r][c] = 1
		}
	}
	return g
}

func allCells(m, n int) [][]int {
	out := [][]int{}
	for r := 0; r < m; r++ {
		for c := 0; c < n; c++ {
			out = append(out, []int{r, c})
		}
	}
	return out
}

type testCase struct {
	name    string
	heights Grid
	want    [][]int
}

func main() {
	cases := []testCase{
		{"một ô", Grid{{7}}, [][]int{{0, 0}}},
		{"một hàng", Grid{{4, 1, 6}}, [][]int{{0, 0}, {0, 1}, {0, 2}}},
		{"một cột", Grid{{2}, {9}, {2}}, [][]int{{0, 0}, {1, 0}, {2, 0}}},
		{"mặt phẳng 3×3", Grid{{5, 5, 5}, {5, 5, 5}, {5, 5, 5}}, allCells(3, 3)},
		{"cái chén", Grid{{3, 3, 3}, {3, 1, 3}, {3, 3, 3}},
			[][]int{{0, 0}, {0, 1}, {0, 2}, {1, 0}, {1, 2}, {2, 0}, {2, 1}, {2, 2}}},
		{"góc trũng", Grid{{9, 9, 1}, {9, 9, 9}, {1, 9, 9}}, allCells(3, 3)},
		{"sống núi giữa", Grid{{1, 2, 3}, {8, 9, 4}, {7, 6, 5}},
			[][]int{{0, 2}, {1, 0}, {1, 1}, {1, 2}, {2, 0}, {2, 1}, {2, 2}}},
		{"bậc bằng nhau", Grid{{1, 1, 1, 1}, {1, 2, 2, 1}, {1, 2, 2, 1}, {1, 1, 1, 1}}, allCells(4, 4)},
		{"lưới tăng 200×200", rowMajor(200, 200), rowMajorAnswer(200, 200)},
		{"mặt phẳng 200×200", flatGrid(200, 200), allCells(200, 200)},
	}
	solvers := []struct {
		name  string
		solve func(Grid) [][]int
	}{
		{"bruteForce", bruteForce},
		{"reverseBfs", reverseBfs},
		{"reverseDfsIterative", reverseDfsIterative},
		{"reverseDfsRecursive", reverseDfsRecursive},
		{"wrongDirection", wrongDirection},
		{"wrongStrict", wrongStrict},
		{"wrongOneEdge", wrongOneEdge},
	}
	for _, s := range solvers {
		ok, total := 0, 0
		bad := []string{}
		for _, t := range cases {
			if s.name == "bruteForce" && len(t.heights) > 50 {
				continue // 40 000 ô: vét cạn quá chậm, đo riêng bên dưới
			}
			total++
			if key(s.solve(t.heights)) == key(t.want) {
				ok++
			} else {
				bad = append(bad, t.name)
			}
		}
		skipped := ""
		if total < len(cases) {
			skipped = " (bỏ hai ca 200×200)"
		}
		tail := ""
		if len(bad) > 0 {
			tail = "; sai ở " + strings.Join(bad, ", ")
		}
		fmt.Printf("%-20s %d/%d ca đúng%s%s\n", s.name, ok, total, skipped, tail)
	}

	rng := rand.New(rand.NewSource(42))
	randomGrid := func(m, n, k int) Grid {
		g := make(Grid, m)
		for r := range g {
			g[r] = make([]int, n)
			for c := range g[r] {
				g[r][c] = rng.Intn(k)
			}
		}
		return g
	}
	agree, trials := 0, 2000
	for t := 0; t < trials; t++ {
		h := randomGrid(1+rng.Intn(7), 1+rng.Intn(7), 1+rng.Intn(5))
		want := key(bruteForce(h))
		if key(reverseBfs(h)) == want && key(reverseDfsIterative(h)) == want && key(reverseDfsRecursive(h)) == want {
			agree++
		}
	}
	fmt.Printf("ngẫu nhiên: %d/%d lưới, ba cách đi ngược khớp vét cạn\n", agree, trials)

	timed := func(fn func()) float64 {
		t0 := time.Now()
		fn()
		return float64(time.Since(t0).Microseconds()) / 1000
	}
	for _, size := range []int{20, 40, 80} {
		h := flatGrid(size, size)
		brute := timed(func() { bruteForce(h) })
		rev := timed(func() { reverseBfs(h) })
		fmt.Printf("mặt phẳng %d×%d: vét cạn %.1f ms, đi ngược %.2f ms\n", size, size, brute, rev)
	}
	big := flatGrid(200, 200)
	fmt.Printf("mặt phẳng 200×200: đi ngược BFS %.1f ms, DFS đệ quy %.1f ms\n",
		timed(func() { reverseBfs(big) }), timed(func() { reverseDfsRecursive(big) }))
}
