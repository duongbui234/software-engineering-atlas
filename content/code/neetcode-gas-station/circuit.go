// Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
// Chạy: go run circuit.go
package main

import (
	"fmt"
	"slices"
	"time"
)

// Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
func canCompleteBrute(gas, cost []int, steps *int64) int {
	n := len(gas)
	for s := 0; s < n; s++ {
		tank := 0
		ok := true
		for k := 0; k < n; k++ {
			j := (s + k) % n
			tank += gas[j] - cost[j]
			*steps++
			if tank < 0 {
				ok = false // hụt xăng trên đoạn j -> j+1
				break
			}
		}
		if ok {
			return s
		}
	}
	return -1
}

// Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
func canCompleteCircuit(gas, cost []int, steps *int64) int {
	total := 0 // tổng gas - cost của cả vòng
	tank := 0  // xăng còn lại tính từ start
	start := 0
	for i := range gas {
		d := gas[i] - cost[i]
		total += d
		tank += d
		*steps++
		if tank < 0 {
			start = i + 1 // không trạm nào trong [start, i] đi qua được i
			tank = 0
		}
	}
	if total < 0 {
		return -1
	}
	return start // tổng không âm thì start chắc chắn đi trọn vòng
}

// Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
func canCompletePrefix(gas, cost []int) int {
	prefix := 0
	lowest := 0 // tiền tố rỗng (trước trạm 0) bằng 0
	lowestAt := -1
	for i := range gas {
		prefix += gas[i] - cost[i]
		if prefix < lowest {
			lowest = prefix
			lowestAt = i
		}
	}
	if prefix < 0 {
		return -1
	}
	return lowestAt + 1
}

// Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
func canCompleteNoTotal(gas, cost []int) int {
	tank := 0
	start := 0
	for i := range gas {
		tank += gas[i] - cost[i]
		if tank < 0 {
			start = i + 1
			tank = 0
		}
	}
	return start
}

// Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
func completes(gas, cost []int, s int) bool {
	n := len(gas)
	if s < 0 || s >= n {
		return false
	}
	tank := 0
	for k := 0; k < n; k++ {
		j := (s + k) % n
		tank += gas[j] - cost[j]
		if tank < 0 {
			return false
		}
	}
	return true
}

// Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
func agrees(gas, cost []int) bool {
	var steps int64
	g := canCompleteCircuit(gas, cost, &steps)
	p := canCompletePrefix(gas, cost)
	b := canCompleteBrute(gas, cost, &steps)
	if g != p {
		return false
	}
	if b == -1 {
		return g == -1
	}
	return completes(gas, cost, g)
}

func main() {
	cases := []struct {
		gas, cost []int
		want      int
	}{
		{[]int{5}, []int{5}, 0},
		{[]int{2}, []int{3}, -1},
		{[]int{1, 6, 2}, []int{3, 1, 4}, 1},
		{[]int{4, 0, 5, 1, 2}, []int{2, 3, 1, 4, 2}, 2},
		{[]int{0, 0, 0, 9}, []int{2, 2, 2, 1}, 3},
		{[]int{3, 3, 3}, []int{3, 3, 4}, -1},
		{[]int{0, 2, 0}, []int{1, 0, 1}, 1},
	}
	ok := 0
	for _, c := range cases {
		var steps int64
		got := []int{canCompleteBrute(c.gas, c.cost, &steps), canCompleteCircuit(c.gas, c.cost, &steps), canCompletePrefix(c.gas, c.cost)}
		if slices.Equal(got, []int{c.want, c.want, c.want}) {
			ok++
		} else {
			fmt.Println("sai ở", c.gas, c.cost, got)
		}
	}
	fmt.Printf("%d/%d ca đúng\n", ok, len(cases))

	// Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
	total, good, wrong := 0, 0, 0
	var build func(gas, cost []int)
	build = func(gas, cost []int) {
		if len(gas) > 0 {
			total++
			if agrees(gas, cost) {
				good++
			}
			var steps int64
			b := canCompleteBrute(gas, cost, &steps)
			w := canCompleteNoTotal(gas, cost)
			if (b == -1 && w != -1) || (b != -1 && !completes(gas, cost, w)) {
				wrong++
			}
		}
		if len(gas) == 4 {
			return
		}
		for g := 0; g <= 2; g++ {
			for c := 0; c <= 2; c++ {
				build(append(slices.Clone(gas), g), append(slices.Clone(cost), c))
			}
		}
	}
	build(nil, nil)
	fmt.Printf("%d/%d ca đúng (đối chiếu vét cạn)\n", good, total)
	fmt.Printf("Bỏ kiểm tra tổng: sai %d/%d ca\n", wrong, total)

	// Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
	n := 10000
	gas := make([]int, n)
	cost := make([]int, n)
	for i := range gas {
		gas[i] = 1
	}
	cost[n-2] = n + 1 // trạm n-2: gas 1, cost n+1, tức hụt n
	gas[n-1] = 2
	var bs, gs int64
	t0 := time.Now()
	b := canCompleteBrute(gas, cost, &bs)
	bruteMs := float64(time.Since(t0).Microseconds()) / 1000
	t0 = time.Now()
	g := canCompleteCircuit(gas, cost, &gs)
	greedyMs := float64(time.Since(t0).Nanoseconds()) / 1e6
	fmt.Printf("n = %d, đáp án %d/%d: vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)\n", n, b, g, bs, bruteMs, gs, greedyMs)
}
