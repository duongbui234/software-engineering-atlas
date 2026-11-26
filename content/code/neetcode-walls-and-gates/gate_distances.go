package main

import (
	"fmt"
	"slices"
)

const inf = 1<<31 - 1

var directions = [][2]int{{-1, 0}, {1, 0}, {0, -1}, {0, 1}}

func fromRoom(rooms [][]int, start int) (int, int) {
	rows, cols := len(rooms), len(rooms[0])
	queue := []int{start}
	distance := make([]int, rows*cols)
	for i := range distance {
		distance[i] = -1
	}
	distance[start] = 0

	for head := 0; head < len(queue); head++ {
		cell := queue[head]
		r, c := cell/cols, cell%cols
		if rooms[r][c] == 0 {
			return distance[cell], head + 1
		}
		for _, step := range directions {
			nr, nc := r+step[0], c+step[1]
			if nr < 0 || nr >= rows || nc < 0 || nc >= cols {
				continue
			}
			next := nr*cols + nc
			if rooms[nr][nc] == -1 || distance[next] != -1 {
				continue
			}
			distance[next] = distance[cell] + 1
			queue = append(queue, next)
		}
	}
	return inf, len(queue)
}

func perRoom(rooms [][]int) int {
	popped, cols := 0, len(rooms[0])
	for r, row := range rooms {
		for c, cell := range row {
			if cell != inf {
				continue
			}
			distance, visits := fromRoom(rooms, r*cols+c)
			row[c] = distance
			popped += visits
		}
	}
	return popped
}

func fromAllGates(rooms [][]int) int {
	rows, cols := len(rooms), len(rooms[0])
	queue := []int{}
	for r, row := range rooms {
		for c, cell := range row {
			if cell == 0 {
				queue = append(queue, r*cols+c)
			}
		}
	}

	for head := 0; head < len(queue); head++ {
		cell := queue[head]
		r, c := cell/cols, cell%cols
		for _, step := range directions {
			nr, nc := r+step[0], c+step[1]
			if nr < 0 || nr >= rows || nc < 0 || nc >= cols {
				continue
			}
			if rooms[nr][nc] != inf {
				continue
			}
			rooms[nr][nc] = rooms[r][c] + 1
			queue = append(queue, nr*cols+nc)
		}
	}
	return len(queue)
}

func clone(rooms [][]int) [][]int {
	copy := make([][]int, len(rooms))
	for r, row := range rooms {
		copy[r] = slices.Clone(row)
	}
	return copy
}

func checkEqual(a, b [][]int) {
	for r, row := range a {
		if !slices.Equal(row, b[r]) {
			panic("distance mismatch")
		}
	}
}

func main() {
	cases := [][2][][]int{
		{
			{{0, -1, inf, inf, 0}, {inf, inf, inf, -1, inf}, {inf, -1, inf, -1, -1}, {inf, inf, inf, -1, inf}},
			{{0, -1, 2, 1, 0}, {1, 2, 3, -1, 1}, {2, -1, 4, -1, -1}, {3, 4, 5, -1, inf}},
		},
		{{{inf, 0, inf, inf, 0, inf}}, {{1, 0, 1, 1, 0, 1}}},
		{{{0, -1, inf}}, {{0, -1, inf}}},
		{{{inf, inf}, {inf, -1}}, {{inf, inf}, {inf, -1}}},
		{{{0}}, {{0}}},
		{{{-1}, {inf}, {0}, {inf}}, {{-1}, {1}, {0}, {1}}},
		{{{0, -1, inf}, {inf, inf, inf}}, {{0, -1, 4}, {1, 2, 3}}},
	}
	for _, test := range cases {
		for _, fill := range []func([][]int) int{perRoom, fromAllGates} {
			work := clone(test[0])
			fill(work)
			checkEqual(work, test[1])
		}
	}
	fmt.Printf("%d/%d ca đúng\n", len(cases), len(cases))

	roomByRoom := make([][]int, 24)
	for r := range roomByRoom {
		roomByRoom[r] = make([]int, 24)
		for c := range roomByRoom[r] {
			roomByRoom[r][c] = inf
		}
	}
	roomByRoom[0][0] = 0
	inOnePass := clone(roomByRoom)
	repeatedPops := perRoom(roomByRoom)
	sharedPops := fromAllGates(inOnePass)
	checkEqual(roomByRoom, inOnePass)
	fmt.Printf("Số lượt lấy ô khỏi hàng đợi: %d / %d\n", repeatedPops, sharedPops)
}
