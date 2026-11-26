class MinHeap {
  items = []

  push(entry) {
    let index = this.items.length
    this.items.push(entry)
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2)
      if (this.items[parent][0] <= entry[0]) break
      this.items[index] = this.items[parent]
      index = parent
    }
    this.items[index] = entry
  }

  pop() {
    const first = this.items[0]
    const last = this.items.pop()
    if (this.items.length === 0) return first
    let index = 0
    while (2 * index + 1 < this.items.length) {
      let child = 2 * index + 1
      if (child + 1 < this.items.length && this.items[child + 1][0] < this.items[child][0]) child++
      if (last[0] <= this.items[child][0]) break
      this.items[index] = this.items[child]
      index = child
    }
    this.items[index] = last
    return first
  }
}

function leastCosts(
  graph,
  start,
  initial,
  extend,
) {
  const best = Array(graph.length).fill(Infinity)
  best[start] = initial
  const pending = new MinHeap()
  pending.push([initial, start])
  while (pending.items.length > 0) {
    const [cost, from] = pending.pop()
    if (cost !== best[from]) continue
    for (const [to, weight] of graph[from]) {
      const candidate = extend(cost, weight)
      if (candidate >= best[to]) continue
      best[to] = candidate
      pending.push([candidate, to])
    }
  }
  return best
}

function networkDelay(edges, n, start) {
  const graph = Array.from({ length: n }, () => [])
  for (const [from, to, time] of edges) graph[from - 1].push([to - 1, time])
  const lastArrival = Math.max(...leastCosts(graph, start - 1, 0, (cost, time) => cost + time))
  return lastArrival === Infinity ? -1 : lastArrival
}

function swimTime(grid) {
  const n = grid.length
  const graph = Array.from({ length: n * n }, () => [])
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      for (const [dr, dc] of directions) {
        const r = row + dr
        const c = col + dc
        if (0 <= r && r < n && 0 <= c && c < n) graph[row * n + col].push([r * n + c, grid[r][c]])
      }
    }
  }
  return leastCosts(graph, 0, grid[0][0], Math.max)[n * n - 1]
}

function cheapestFlight(n, flights, start, end, k) {
  let best = Array(n).fill(Infinity)
  best[start] = 0
  for (let used = 0; used <= k; used++) {
    const next = best.slice()
    for (const [from, to, price] of flights) next[to] = Math.min(next[to], best[from] + price)
    best = next
  }
  return best[end] === Infinity ? -1 : best[end]
}

let passed = 0
function check(got, expected) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)
  passed++
}
check(networkDelay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(networkDelay([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(networkDelay([[2, 1, 7]], 3, 2), -1)
check(networkDelay([], 1, 1), 0)
check(networkDelay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
check(swimTime([[0]]), 0)
check(swimTime([[3, 0], [2, 1]]), 3)
check(swimTime([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4)
check(swimTime([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4)
check(swimTime([[0, 1], [2, 3]]), 3)
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapestFlight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
console.log(passed + "/15 ca đúng")
