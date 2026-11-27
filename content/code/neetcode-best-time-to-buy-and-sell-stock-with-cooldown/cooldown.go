// LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
package main

import "fmt"

const NEG = -1_000_000_000 // trạng thái chưa thể xảy ra

// Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
func maxProfitBrute(prices []int, calls *int) int {
	var goFn func(day int, holding bool) int
	goFn = func(day int, holding bool) int {
		*calls++
		if day >= len(prices) {
			return 0
		}
		wait := goFn(day+1, holding)
		if holding {
			return max(wait, prices[day]+goFn(day+2, false)) // bán, nhảy qua ngày nghỉ
		}
		return max(wait, -prices[day]+goFn(day+1, true)) // mua
	}
	return goFn(0, false)
}

// Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm)
func maxProfitMemo(prices []int, calls *int) int {
	n := len(prices)
	memo := [2][]int{make([]int, n), make([]int, n)}
	seen := [2][]bool{make([]bool, n), make([]bool, n)}
	var goFn func(day, holding int) int
	goFn = func(day, holding int) int {
		*calls++
		if day >= n {
			return 0
		}
		if seen[holding][day] {
			return memo[holding][day]
		}
		wait := goFn(day+1, holding)
		var act int
		if holding == 1 {
			act = prices[day] + goFn(day+2, 0)
		} else {
			act = -prices[day] + goFn(day+1, 1)
		}
		memo[holding][day], seen[holding][day] = max(wait, act), true
		return memo[holding][day]
	}
	return goFn(0, 0)
}

// Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
func maxProfitTable(prices []int) int {
	n := len(prices)
	hold, sold, rest := make([]int, n), make([]int, n), make([]int, n)
	hold[0], sold[0] = -prices[0], NEG
	for i := 1; i < n; i++ {
		hold[i] = max(hold[i-1], rest[i-1]-prices[i])
		sold[i] = hold[i-1] + prices[i]
		rest[i] = max(rest[i-1], sold[i-1])
	}
	return max(sold[n-1], rest[n-1])
}

// Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
func maxProfit(prices []int) int {
	hold, sold, rest := -prices[0], NEG, 0
	for _, price := range prices[1:] {
		hold, sold, rest = max(hold, rest-price), hold+price, max(rest, sold)
	}
	return max(sold, rest)
}

// Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
func bestByTrades(prices []int, start int) int {
	best := 0
	for b := start; b < len(prices); b++ {
		for s := b + 1; s < len(prices); s++ {
			best = max(best, prices[s]-prices[b]+bestByTrades(prices, s+2))
		}
	}
	return best
}

func main() {
	zigzag, ramps := make([]int, 5000), make([]int, 5000)
	for i := range zigzag {
		zigzag[i] = 3
		if i%2 == 0 {
			zigzag[i] = 1
		}
		ramps[i] = i % 1000
	}
	cases := []struct {
		prices   []int
		expected int
	}{
		{[]int{7}, 0},
		{[]int{4, 2}, 0},
		{[]int{2, 9}, 7},
		{[]int{2, 6, 1, 7}, 6},
		{[]int{1, 3, 1, 5}, 4},
		{[]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}, 9},
		{[]int{9, 8, 7, 6, 5}, 0},
		{[]int{1, 3, 1, 3, 1, 3, 1, 3}, 4},
		{[]int{3, 3, 3, 3}, 0},
		{[]int{6, 1, 6, 1, 6, 0, 9}, 14},
		{[]int{4, 1, 2, 8, 0, 5, 6}, 8},
		{zigzag, 2500},
		{ramps, 4991},
	}
	ok := 0
	for _, c := range cases {
		var calls int
		results := []int{maxProfit(c.prices), maxProfitTable(c.prices), maxProfitMemo(c.prices, &calls)}
		if len(c.prices) <= 16 {
			results = append(results, maxProfitBrute(c.prices, &calls))
		}
		if len(c.prices) <= 10 {
			results = append(results, bestByTrades(c.prices, 0))
		}
		if allEqual(results, c.expected) {
			ok++
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	exhaustiveOk, total := 0, 0
	arrays := [][]int{{}}
	for k := 0; k < len(arrays); k++ {
		if len(arrays[k]) == 6 {
			continue
		}
		for v := 0; v <= 3; v++ {
			prices := append(append([]int{}, arrays[k]...), v)
			arrays = append(arrays, prices)
			total++
			var calls int
			results := []int{maxProfitBrute(prices, &calls), maxProfitMemo(prices, &calls), maxProfitTable(prices), maxProfit(prices)}
			if allEqual(results, bestByTrades(prices, 0)) {
				exhaustiveOk++
			}
		}
	}
	fmt.Printf("%d/%d ca đúng (đối chiếu liệt kê giao dịch)\n", exhaustiveOk, total)

	sample := []int{3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4}
	var bruteCalls, memoCalls int
	maxProfitBrute(sample, &bruteCalls)
	maxProfitMemo(sample, &memoCalls)
	fmt.Printf("20 ngày: vét cạn %d lượt gọi, memo %d lượt gọi\n", bruteCalls, memoCalls)
}

func allEqual(results []int, expected int) bool {
	for _, r := range results {
		if r != expected {
			return false
		}
	}
	return true
}
