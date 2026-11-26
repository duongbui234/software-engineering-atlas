type Grid = number[][]
type Cell = [number, number]

const directions: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function simulate(grid: Grid) {
  let fresh = grid.reduce((count, row) => count + row.filter(value => value === 1).length, 0)
  let minutes = 0
  let scans = 0

  while (fresh > 0) {
    const next: Cell[] = []
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        scans++
        if (grid[r][c] === 1 && directions.some(([dr, dc]) => grid[r + dr]?.[c + dc] === 2)) {
          next.push([r, c])
        }
      }
    }
    if (next.length === 0) return { minutes: -1, scans }
    for (const [r, c] of next) grid[r][c] = 2
    fresh -= next.length
    minutes++
  }
  return { minutes, scans }
}

function spread(grid: Grid) {
  const queue: Cell[] = []
  let fresh = 0
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 2) queue.push([r, c])
      if (grid[r][c] === 1) fresh++
    }
  }

  let head = 0
  let minutes = 0
  while (head < queue.length) {
    const end = queue.length
    while (head < end) {
      const [r, c] = queue[head++]
      for (const [dr, dc] of directions) {
        const nr = r + dr
        const nc = c + dc
        if (grid[nr]?.[nc] !== 1) continue
        grid[nr][nc] = 2
        fresh--
        queue.push([nr, nc])
      }
    }
    if (queue.length > end) minutes++
  }
  return { minutes: fresh === 0 ? minutes : -1, pops: head }
}

const cases: [Grid, number][] = [
  [[[2, 1, 1, 0, 2], [0, 1, 1, 1, 1]], 3],
  [[[2, 1, 0, 1], [0, 1, 0, 1]], -1],
  [[[0, 2, 0]], 0],
  [[[1]], -1],
  [[[0]], 0],
  [[[2, 1, 2]], 1],
  [[[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]], 9],
]
const clone = (grid: Grid) => grid.map(row => row.slice())

for (const [grid, expected] of cases) {
  if (simulate(clone(grid)).minutes !== expected || spread(clone(grid)).minutes !== expected) {
    throw new Error(`unexpected result for ${JSON.stringify(grid)}`)
  }
}

const [corridor] = cases[cases.length - 1]
const { scans } = simulate(clone(corridor))
const { pops } = spread(clone(corridor))
if (scans !== 90 || pops !== 10) throw new Error("unexpected operation counts")
console.log(`${cases.length}/${cases.length} ca đúng`)
console.log(`Quét: ${scans}; lấy khỏi hàng đợi: ${pops}`)
