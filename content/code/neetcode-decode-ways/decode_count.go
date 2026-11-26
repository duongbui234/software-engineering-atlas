package main

import "fmt"

func decodeCount(s string) int {
	beforePrevious, previous := int64(0), int64(1)
	for i := 0; i < len(s); i++ {
		current := int64(0)
		if s[i] != '0' {
			current = previous
		}
		if i > 0 && (s[i-1] == '1' || (s[i-1] == '2' && s[i] <= '6')) {
			current += beforePrevious
		}
		if current == 0 {
			return 0
		}
		beforePrevious, previous = previous, min(current, 2_147_483_647)
	}
	return int(previous)
}

func decodeByCuts(s string, memoized bool) int {
	memo := map[int]int{}
	var visit func(int) int
	visit = func(index int) int {
		if index == len(s) {
			return 1
		}
		if s[index] == '0' {
			return 0
		}
		if saved, ok := memo[index]; ok {
			return saved
		}
		count := visit(index + 1)
		if index+1 < len(s) && (s[index] == '1' || (s[index] == '2' && s[index+1] <= '6')) {
			count += visit(index + 2)
		}
		if memoized {
			memo[index] = count
		}
		return count
	}
	return visit(0)
}

func main() {
	check := func(got, want int) {
		if got != want {
			panic(fmt.Sprintf("want %d, got %d", want, got))
		}
	}
	check(decodeCount("11204"), 2)
	check(decodeByCuts("11204", true), 2)
	check(decodeByCuts("11204", false), 2)
	check(decodeCount("27"), 1)
	check(decodeByCuts("27", true), 1)
	check(decodeByCuts("27", false), 1)
	check(decodeCount("1010"), 1)
	check(decodeByCuts("1010", true), 1)
	check(decodeByCuts("1010", false), 1)
	check(decodeCount("100"), 0)
	check(decodeByCuts("100", true), 0)
	check(decodeByCuts("100", false), 0)
	check(decodeCount("07"), 0)
	check(decodeByCuts("07", true), 0)
	check(decodeByCuts("07", false), 0)
	check(decodeCount("1234"), 3)
	check(decodeByCuts("1234", true), 3)
	check(decodeByCuts("1234", false), 3)
	check(decodeCount("301"), 0)
	check(decodeByCuts("301", true), 0)
	check(decodeByCuts("301", false), 0)
	check(decodeCount("9"), 1)
	check(decodeByCuts("9", true), 1)
	check(decodeByCuts("9", false), 1)
	check(decodeCount("0"), 0)
	check(decodeByCuts("0", true), 0)
	check(decodeByCuts("0", false), 0)
	check(decodeCount("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0)
	check(decodeByCuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", true), 0)
	fmt.Println("10/10 ca đúng")
}
