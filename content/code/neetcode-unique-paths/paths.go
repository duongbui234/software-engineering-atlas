package main

import "fmt"

const limit = 2_000_000_000

func pathsBrute(m, n int, calls *int) int {
	var walk func(r, c int) int
	walk = func(r, c int) int {
		*calls++
		if r == m-1 && c == n-1 {
			return 1
		}
		total := 0
		if r+1 < m {
			total += walk(r+1, c)
		}
		if c+1 < n {
			total += walk(r, c+1)
		}
		return total
	}
	return walk(0, 0)
}

func pathsMemo(m, n int, calls *int) int {
	cache := make(map[[2]int]int)
	var walk func(r, c int) int
	walk = func(r, c int) int {
		*calls++
		if r == m-1 || c == n-1 {
			return 1
		}
		if saved, ok := cache[[2]int{r, c}]; ok {
			return saved
		}
		total := walk(r+1, c) + walk(r, c+1)
		cache[[2]int{r, c}] = total
		return total
	}
	return walk(0, 0)
}

func pathsTable(m, n int) int {
	ways := make([][]int, m)
	for r := range ways {
		ways[r] = make([]int, n)
		for c := range ways[r] {
			ways[r][c] = 1
		}
	}
	for r := 1; r < m; r++ {
		for c := 1; c < n; c++ {
			ways[r][c] = ways[r-1][c] + ways[r][c-1]
		}
	}
	return ways[m-1][n-1]
}

func pathsRow(m, n int) int {
	row := make([]int, n)
	for c := range row {
		row[c] = 1
	}
	for r := 1; r < m; r++ {
		for c := 1; c < n; c++ {
			row[c] += row[c-1]
		}
	}
	return row[n-1]
}

func pathsFormula(m, n int) int {
	k := min(m, n) - 1
	total := m + n - 2
	result := 1 // int là 64 bit trên máy 64 bit, đủ chứa tích trung gian
	for i := 1; i <= k; i++ {
		result = result * (total - k + i) / i
	}
	return result
}

func sameAnswer(m, n, expected int) bool {
	return pathsTable(m, n) == expected && pathsRow(m, n) == expected && pathsFormula(m, n) == expected
}

func check(ok bool) {
	if !ok {
		panic("ca kiểm tra sai")
	}
}

func main() {
	cases := [][3]int{{1, 1, 1}, {1, 7, 1}, {2, 2, 2}, {3, 2, 3}, {3, 7, 28}, {10, 10, 48620}, {23, 12, 193536720}}
	for _, tc := range cases {
		calls := 0
		check(sameAnswer(tc[0], tc[1], tc[2]) && pathsMemo(tc[0], tc[1], &calls) == tc[2])
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	checked := 0
	for m := 1; m <= 8; m++ {
		for n := 1; n <= 8; n++ {
			calls := 0
			brute := pathsBrute(m, n, &calls)
			check(sameAnswer(m, n, brute) && pathsMemo(m, n, &calls) == brute)
			checked++
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn, lưới tới 8×8)\n", checked, checked)

	// Pascal có chặn trên: ô nào vượt limit thì giữ ở limit + 1.
	var pascal [101][101]int
	for r := range pascal {
		for c := range pascal[r] {
			pascal[r][c] = 1
		}
	}
	for r := 2; r <= 100; r++ {
		for c := 2; c <= 100; c++ {
			pascal[r][c] = min(pascal[r-1][c]+pascal[r][c-1], limit+1)
		}
	}
	inside := 0
	for m := 1; m <= 100; m++ {
		for n := 1; n <= 100; n++ {
			if pascal[m][n] <= limit {
				check(sameAnswer(m, n, pascal[m][n]))
				inside++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)\n", inside, inside)

	bruteCalls, memoCalls := 0, 0
	pathsBrute(10, 10, &bruteCalls)
	pathsMemo(10, 10, &memoCalls)
	fmt.Printf("Lưới 10×10: vét cạn %d lượt gọi, memo %d lượt gọi\n", bruteCalls, memoCalls)
}
