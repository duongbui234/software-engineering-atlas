type Neighbor = [node: number, weight: number]
type Entry = [cost: number, node: number]

class MinHeap {
  items: Entry[] = []

  push(entry: Entry) {
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

  pop(): Entry {
    const first = this.items[0]
    const last = this.items.pop()!
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
  graph: Neighbor[][],
  start: number,
  initial: number,
  extend: (cost: number, weight: number) => number,
): number[] {
  const best = Array<number>(graph.length).fill(Infinity)
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

function networkDelay(edges: number[][], n: number, start: number): number {
  const graph = Array.from({ length: n }, (): Neighbor[] => [])
  for (const [from, to, time] of edges) graph[from - 1].push([to - 1, time])
  const lastArrival = Math.max(...leastCosts(graph, start - 1, 0, (cost, time) => cost + time))
  return lastArrival === Infinity ? -1 : lastArrival
}

function networkByRounds(edges: number[][], n: number, start: number): number {
  let best = Array<number>(n).fill(Infinity)
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

function check(got: number, expected: number) {
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

// Kiểm thêm các invariant bằng bộ sinh xác định.

let state = 29
function random(limit: number): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return (state >>> 16) % limit
}

function oracle(edges: number[][], n: number, start: number): number {
  let best = Array<number>(n).fill(Infinity)
  best[start - 1] = 0
  for (let layer = 1; layer < n; layer++) {
    const next = best.slice()
    for (const [from, to, weight] of edges) next[to - 1] = Math.min(next[to - 1], best[from - 1] + weight)
    best = next
  }
  const last = Math.max(...best)
  return Number.isFinite(last) ? last : -1
}

for (let i = 0; i < 200; i++) {
  const n = 2 + random(5)
  const edges: number[][] = []
  for (let a = 1; a <= n; a++) {
    for (let b = 1; b <= n; b++) {
      if (a !== b && random(3) === 0) edges.push([a, b, random(11)])
    }
  }
  const start = 1 + random(n)
  check(networkDelay(edges, n, start), oracle(edges, n, start))
}
const chain = Array.from({ length: 99 }, (_, i) => [i + 1, i + 2, 1])
const time = networkDelay(chain, 100, 1)
check(time, oracle(chain, 100, 1))
console.log("201/201 ca đối chiếu; cạnh chuỗi: Dijkstra 99, quét lớp 9801")
