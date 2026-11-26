function cheapestFlight(n: number, flights: number[][], start: number, end: number, k: number): number {
  let best = Array<number>(n).fill(Infinity)
  best[start] = 0
  for (let used = 0; used <= k; used++) {
    const next = best.slice()
    for (const [from, to, price] of flights) next[to] = Math.min(next[to], best[from] + price)
    best = next
  }
  return best[end] === Infinity ? -1 : best[end]
}

function cheapestByRoutes(n: number, flights: number[][], start: number, end: number, k: number): number {
  const adj = Array.from({ length: n }, (): number[][] => [])
  for (const [from, to, price] of flights) adj[from].push([to, price])
  function visit(city: number, remaining: number): number {
    if (city === end) return 0
    if (remaining === 0) return Infinity
    let best = Infinity
    for (const [next, fare] of adj[city]) {
      best = Math.min(best, fare + visit(next, remaining - 1))
    }
    return best
  }
  const fare = visit(start, k + 1)
  return fare === Infinity ? -1 : fare
}

function check(got: number, expected: number) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)

}
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapestByRoutes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7)
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapestByRoutes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3)
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapestByRoutes(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8)
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapestByRoutes(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1)
check(cheapestFlight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
check(cheapestByRoutes(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6)
console.log("5/5 ca đúng")

// Kiểm thêm các invariant bằng bộ sinh xác định.

let state = 29
function random(limit: number): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return (state >>> 16) % limit
}

function enumerateFlights(flights: number[][], start: number, end: number, budget: number): number {
  if (start === end) return 0
  if (budget === 0) return Infinity
  let best = Infinity
  for (const [from, to, price] of flights) {
    if (from === start) best = Math.min(best, price + enumerateFlights(flights, to, end, budget - 1))
  }
  return best
}

for (let i = 0; i < 200; i++) {
  const n = 2 + random(4)
  const flights: number[][] = []
  for (let a = 0; a < n; a++) {
    for (let b = 0; b < n; b++) {
      if (a !== b && random(3) === 0) flights.push([a, b, 1 + random(8)])
    }
  }
  const k = random(n)
  const expected = enumerateFlights(flights, 0, n - 1, k + 1)
  check(cheapestFlight(n, flights, 0, n - 1, k), Number.isFinite(expected) ? expected : -1)
}
let calls = 0
function countRoutes(edges: number[][], remaining: number, from: number, to: number): number {
  calls++
  if (from === to) return 0
  if (remaining === 0) return Infinity
  let best = Infinity
  for (const [source, target, cost] of edges) {
    if (source === from) best = Math.min(best, cost + countRoutes(edges, remaining - 1, target, to))
  }
  return best
}
const layers = [[0], [1, 2], [3, 4], [5, 6], [7, 8], [9, 10], [11, 12], [13]]
const flights = layers.slice(1).flatMap((next, i) => layers[i].flatMap(from => next.map(to => [from, to, 1])))
check(cheapestFlight(14, flights, 0, 13, 6), countRoutes(flights, 7, 0, 13))
console.log("201/201 ca đối chiếu; DFS " + calls + " lời gọi, DP " + 7 * flights.length + " lượt xét cạnh")
