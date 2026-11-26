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

function swimByThreshold(grid, binary) {
  const n = grid.length
  function reachable(level) {
    const queue = [0]
    const seen = new Set(queue)
    for (let head = 0; head < queue.length; head++) {
      const key = queue[head]
      if (key === n * n - 1) return true
      const row = Math.floor(key / n)
      const col = key % n
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const r = row + dr
        const c = col + dc
        const next = r * n + c
        if (r >= 0 && r < n && c >= 0 && c < n && grid[r][c] <= level && !seen.has(next)) {
          seen.add(next)
          queue.push(next)
        }
      }
    }
    return false
  }

  let low = Math.max(grid[0][0], grid[n - 1][n - 1])
  let high = n * n - 1
  if (!binary) {
    while (!reachable(low)) low++
    return low
  }
  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (reachable(mid)) high = mid
    else low = mid + 1
  }
  return low
}

function check(got, expected) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)

}
check(swimTime([[0]]), 0)
check(swimByThreshold([[0]], true), 0)
check(swimByThreshold([[0]], false), 0)
check(swimTime([[3, 0], [2, 1]]), 3)
check(swimByThreshold([[3, 0], [2, 1]], true), 3)
check(swimByThreshold([[3, 0], [2, 1]], false), 3)
check(swimTime([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4)
check(swimByThreshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], true), 4)
check(swimByThreshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], false), 4)
check(swimTime([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4)
check(swimByThreshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], true), 4)
check(swimByThreshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], false), 4)
check(swimTime([[0, 1], [2, 3]]), 3)
check(swimByThreshold([[0, 1], [2, 3]], true), 3)
check(swimByThreshold([[0, 1], [2, 3]], false), 3)
console.log("5/5 ca đúng")
