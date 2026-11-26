type Cell = [number, number]
const directions: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]]
const INF = 2147483647

function blankDistances(grid: number[][]) {
  return grid.map(row => row.map(() => -1))
}

function cellsWith(grid: number[][], value: number): Cell[] {
  const cells: Cell[] = []
  grid.forEach((row, r) => row.forEach((cell, c) => {
    if (cell === value) cells.push([r, c])
  }))
  return cells
}

function flood(grid: number[][], distance: number[][], queue: Cell[], enter: number) {
  for (const [r, c] of queue) distance[r][c] = 0
  for (let head = 0; head < queue.length; head++) {
    const [r, c] = queue[head]
    for (const [dr, dc] of directions) {
      const nr = r + dr
      const nc = c + dc
      if (grid[nr]?.[nc] !== enter || distance[nr][nc] !== -1) continue
      distance[nr][nc] = distance[r][c] + 1
      queue.push([nr, nc])
    }
  }
  return queue.length
}

function islands(grid: number[][]) {
  const distance = blankDistances(grid)
  let count = 0
  let largest = 0
  for (const [r, c] of cellsWith(grid, 1)) {
    if (distance[r][c] !== -1) continue
    count++
    largest = Math.max(largest, flood(grid, distance, [[r, c]], 1))
  }
  return [count, largest]
}

function minutes(grid: number[][]) {
  const distance = blankDistances(grid)
  flood(grid, distance, cellsWith(grid, 2), 1)
  let last = 0
  for (const [r, c] of cellsWith(grid, 1)) {
    if (distance[r][c] === -1) return -1
    last = Math.max(last, distance[r][c])
  }
  return last
}

function nearestGates(grid: number[][]) {
  const distance = blankDistances(grid)
  flood(grid, distance, cellsWith(grid, 0), INF)
  return grid.map((row, r) => row.map((value, c) =>
    value === INF && distance[r][c] !== -1 ? distance[r][c] : value,
  ))
}

const land = [[1, 0, 0, 1, 1], [0, 0, 0, 1, 1], [0, 1, 0, 1, 0], [1, 1, 0, 0, 0]]
const oranges = [[2, 1, 1, 0, 2], [0, 1, 1, 1, 1]]
const rooms = [[INF, -1, 0], [INF, INF, INF], [0, -1, INF]]
const cases = [
  islands(land).join() === "3,5",
  islands([[1, 0], [0, 1]]).join() === "2,1",
  islands([[0]]).join() === "0,0",
  minutes(oranges) === 3,
  minutes([[2, 0, 1]]) === -1,
  minutes([[0, 2]]) === 0,
  minutes([[1]]) === -1,
  JSON.stringify(nearestGates(rooms)) === "[[2,-1,0],[1,2,1],[0,-1,2]]",
  nearestGates([[0, -1, INF]])[0][2] === INF,
  nearestGates([[INF]])[0][0] === INF,
]
if (!cases.every(Boolean)) throw new Error("Có ca sai")
console.log(`${cases.length}/${cases.length} ca đúng`)
