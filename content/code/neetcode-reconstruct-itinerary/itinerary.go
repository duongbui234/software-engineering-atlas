package main

import (
	"fmt"
	"slices"
	"strings"
)

func findItinerary(tickets [][2]string) []string {
	outgoing := make(map[string][]string)
	for _, ticket := range tickets {
		from, to := ticket[0], ticket[1]
		outgoing[from] = append(outgoing[from], to)
	}
	for _, destinations := range outgoing {
		slices.Sort(destinations)
		slices.Reverse(destinations)
	}

	stack := []string{"JFK"}
	suffix := make([]string, 0, len(tickets)+1)
	for len(stack) > 0 {
		last := len(stack) - 1
		current := stack[last]
		destinations := outgoing[current]
		if len(destinations) > 0 {
			end := len(destinations) - 1
			stack = append(stack, destinations[end])
			outgoing[current] = destinations[:end]
		} else {
			suffix = append(suffix, current)
			stack = stack[:last]
		}
	}
	slices.Reverse(suffix)
	return suffix
}

// TESTS
func main() {
	cases := []struct {
		tickets [][2]string
		want    string
	}{
		{[][2]string{{"BBB", "CCC"}, {"JFK", "AAA"}, {"AAA", "BBB"}}, "JFK AAA BBB CCC"},
		{[][2]string{{"JFK", "AAA"}, {"JFK", "BBB"}, {"BBB", "JFK"}}, "JFK BBB JFK AAA"},
		{[][2]string{{"JFK", "AAA"}, {"JFK", "AAA"}, {"AAA", "JFK"}}, "JFK AAA JFK AAA"},
		{[][2]string{{"JFK", "BBB"}, {"BBB", "JFK"}, {"JFK", "AAA"}, {"AAA", "JFK"}}, "JFK AAA JFK BBB JFK"},
		{[][2]string{{"JFK", "AAA"}, {"AAA", "CCC"}, {"CCC", "JFK"}, {"AAA", "BBB"}, {"BBB", "AAA"}}, "JFK AAA BBB AAA CCC JFK"},
	}
	for _, test := range cases {
		if strings.Join(findItinerary(test.tickets), " ") != test.want {
			panic("Sai hành trình")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
