package main

import (
	"fmt"
	"reflect"
	"slices"
)

type cell struct{ r, c int }

var directions = [...]cell{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

const INF = 2147483647

func blankDistances(grid [][]int) [][]int {
	distance := make([][]int, len(grid))
	for r, row := range grid {
		distance[r] = make([]int, len(row))
		for c := range row {
			distance[r][c] = -1
		}
	}
	return distance
}

func cellsWith(grid [][]int, value int) []cell {
	var cells []cell
	for r, row := range grid {
		for c, item := range row {
			if item == value {
				cells = append(cells, cell{r, c})
			}
		}
	}
	return cells
}

func flood(grid, distance [][]int, queue []cell, enter int) int {
	for _, p := range queue {
		distance[p.r][p.c] = 0
	}
	for head := 0; head < len(queue); head++ {
		p := queue[head]
		for _, step := range directions {
			r, c := p.r+step.r, p.c+step.c
			if r < 0 || r >= len(grid) || c < 0 || c >= len(grid[r]) {
				continue
			}
			if grid[r][c] != enter || distance[r][c] != -1 {
				continue
			}
			distance[r][c] = distance[p.r][p.c] + 1
			queue = append(queue, cell{r, c})
		}
	}
	return len(queue)
}

func islands(grid [][]int) [2]int {
	distance := blankDistances(grid)
	count, largest := 0, 0
	for _, p := range cellsWith(grid, 1) {
		if distance[p.r][p.c] == -1 {
			count++
			largest = max(largest, flood(grid, distance, []cell{p}, 1))
		}
	}
	return [2]int{count, largest}
}

func minutes(grid [][]int) int {
	distance := blankDistances(grid)
	flood(grid, distance, cellsWith(grid, 2), 1)
	last := 0
	for _, p := range cellsWith(grid, 1) {
		d := distance[p.r][p.c]
		if d == -1 {
			return -1
		}
		last = max(last, d)
	}
	return last
}

func nearestGates(grid [][]int) [][]int {
	distance := blankDistances(grid)
	flood(grid, distance, cellsWith(grid, 0), INF)
	result := make([][]int, len(grid))
	for r, row := range grid {
		result[r] = slices.Clone(row)
		for c, value := range row {
			if value == INF && distance[r][c] != -1 {
				result[r][c] = distance[r][c]
			}
		}
	}
	return result
}

func main() {
	land := [][]int{{1, 0, 0, 1, 1}, {0, 0, 0, 1, 1}, {0, 1, 0, 1, 0}, {1, 1, 0, 0, 0}}
	oranges := [][]int{{2, 1, 1, 0, 2}, {0, 1, 1, 1, 1}}
	rooms := [][]int{{INF, -1, 0}, {INF, INF, INF}, {0, -1, INF}}
	cases := []bool{
		islands(land) == [2]int{3, 5},
		islands([][]int{{1, 0}, {0, 1}}) == [2]int{2, 1},
		islands([][]int{{0}}) == [2]int{0, 0},
		minutes(oranges) == 3,
		minutes([][]int{{2, 0, 1}}) == -1,
		minutes([][]int{{0, 2}}) == 0,
		minutes([][]int{{1}}) == -1,
		reflect.DeepEqual(nearestGates(rooms), [][]int{{2, -1, 0}, {1, 2, 1}, {0, -1, 2}}),
		nearestGates([][]int{{0, -1, INF}})[0][2] == INF,
		nearestGates([][]int{{INF}})[0][0] == INF,
	}
	for _, pass := range cases {
		if !pass {
			panic("Có ca sai")
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))
}
