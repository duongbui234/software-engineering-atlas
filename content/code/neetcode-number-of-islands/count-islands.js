const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function floodBfs(grid) {
  const rows = grid.length, cols = grid[0].length
  const seen = new Uint8Array(rows * cols)
  let result = 0

  for (let start = 0; start < seen.length; start++) {
    if (grid[Math.floor(start / cols)][start % cols] !== 1 || seen[start]) continue

    result++
    const queue = [start]
    seen[start] = 1
    for (let head = 0; head < queue.length; head++) {
      const cell = queue[head]
      const row = Math.floor(cell / cols), col = cell % cols
      for (const [dr, dc] of directions) {
        const r = row + dr, c = col + dc
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) continue
        const next = r * cols + c
        if (seen[next]) continue
        seen[next] = 1
        queue.push(next)
      }
    }
  }
  return result
}

function floodDfsInPlace(grid) {
  const rows = grid.length, cols = grid[0].length
  let result = 0

  for (let start = 0; start < rows * cols; start++) {
    const row = Math.floor(start / cols), col = start % cols
    if (grid[row][col] !== 1) continue

    result++
    const stack = [start]
    grid[row][col] = 0
    while (stack.length > 0) {
      const cell = stack.pop()
      const cr = Math.floor(cell / cols), cc = cell % cols
      for (const [dr, dc] of directions) {
        const r = cr + dr, c = cc + dc
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 1) continue
        grid[r][c] = 0
        stack.push(r * cols + c)
      }
    }
  }
  return result
}

const cases = [
  {grid: ["10011", "00011", "01010", "11000"], want: 3},
  {grid: ["100", "010", "001"], want: 3},
  {grid: ["000", "000"], want: 0},
  {grid: ["11111"], want: 1},
  {grid: ["11", "11"], want: 1},
  {grid: Array.from({length: 300}, () => "1".repeat(300)), want: 1},
]
for (const {grid, want} of cases) {
  const cells = grid.map(row => Array.from(row, Number))
  if (floodBfs(cells) !== want || cells.some((row, i) => row.join("") !== grid[i])) {
    throw new Error("BFS sai")
  }
  if (floodDfsInPlace(cells) !== want || cells.some(row => row.some(value => value !== 0))) {
    throw new Error("DFS sai")
  }
}
console.log(`${cases.length}/${cases.length} ca đúng`)
