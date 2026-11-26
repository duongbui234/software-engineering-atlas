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

function networkByRounds(edges, n, start) {
  let best = Array(n).fill(Infinity)
  best[start - 1] = 0
  for (let layer = 1; layer < n; layer++) {
    const next = best.slice()
    for (const [from, to, weight] of edges) {
      next[to - 1] = Math.min(next[to - 1], best[from - 1] + weight)
    }
    best = next
  }
  const last = Math.max(...best)
  return last === Infinity ? -1 : last
}

function check(got, expected) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)

}
check(networkDelay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(networkByRounds([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7)
check(networkDelay([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(networkByRounds([[1, 2, 0], [2, 3, 0]], 3, 1), 0)
check(networkDelay([[2, 1, 7]], 3, 2), -1)
check(networkByRounds([[2, 1, 7]], 3, 2), -1)
check(networkDelay([], 1, 1), 0)
check(networkByRounds([], 1, 1), 0)
check(networkDelay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
check(networkByRounds([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4)
console.log("5/5 ca đúng")
