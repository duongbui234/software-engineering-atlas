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

function cheapestByRoutes(n, flights, start, end, k) {
  const adj = Array.from({ length: n }, () => [])
  for (const [from, to, price] of flights) adj[from].push([to, price])
  function visit(city, remaining) {
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

function check(got, expected) {
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
