const INF = 2 ** 31 - 1
const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function fromRoom(rooms, start) {
  const rows = rooms.length
  const cols = rooms[0].length
  const queue = [start]
  const distance = Array(rows * cols).fill(-1)
  distance[start] = 0

  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]
    const r = Math.floor(cell / cols)
    const c = cell % cols
    if (rooms[r][c] === 0) return [distance[cell], head + 1]
    for (const [dr, dc] of directions) {
      const nr = r + dr
      const nc = c + dc
      const next = nr * cols + nc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (rooms[nr][nc] === -1 || distance[next] !== -1) continue
      distance[next] = distance[cell] + 1
      queue.push(next)
    }
  }
  return [INF, queue.length]
}

function perRoom(rooms) {
  let popped = 0
  const cols = rooms[0].length
  for (let r = 0; r < rooms.length; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] !== INF) continue
      const [distance, visits] = fromRoom(rooms, r * cols + c)
      rooms[r][c] = distance
      popped += visits
    }
  }
  return popped
}

function fromAllGates(rooms) {
  const rows = rooms.length
  const cols = rooms[0].length
  const queue = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rooms[r][c] === 0) queue.push(r * cols + c)
    }
  }

  for (let head = 0; head < queue.length; head++) {
    const cell = queue[head]
    const r = Math.floor(cell / cols)
    const c = cell % cols
    for (const [dr, dc] of directions) {
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (rooms[nr][nc] !== INF) continue
      rooms[nr][nc] = rooms[r][c] + 1
      queue.push(nr * cols + nc)
    }
  }
  return queue.length
}

function check(before, expected) {
  for (const fill of [perRoom, fromAllGates]) {
    const work = before.map(row => row.slice())
    fill(work)
    if (JSON.stringify(work) !== JSON.stringify(expected)) throw new Error(fill.name)
  }
}

const cases = [
  [
    [[0, -1, INF, INF, 0], [INF, INF, INF, -1, INF], [INF, -1, INF, -1, -1], [INF, INF, INF, -1, INF]],
    [[0, -1, 2, 1, 0], [1, 2, 3, -1, 1], [2, -1, 4, -1, -1], [3, 4, 5, -1, INF]],
  ],
  [[[INF, 0, INF, INF, 0, INF]], [[1, 0, 1, 1, 0, 1]]],
  [[[0, -1, INF]], [[0, -1, INF]]],
  [[[INF, INF], [INF, -1]], [[INF, INF], [INF, -1]]],
  [[[0]], [[0]]],
  [[[-1], [INF], [0], [INF]], [[-1], [1], [0], [1]]],
  [[[0, -1, INF], [INF, INF, INF]], [[0, -1, 4], [1, 2, 3]]],
]
for (const [before, expected] of cases) check(before, expected)
console.log(`${cases.length}/${cases.length} ca đúng`)

const roomByRoom = Array.from({ length: 24 }, () => Array(24).fill(INF))
roomByRoom[0][0] = 0
const inOnePass = roomByRoom.map(row => row.slice())
const repeatedPops = perRoom(roomByRoom)
const sharedPops = fromAllGates(inOnePass)
if (JSON.stringify(roomByRoom) !== JSON.stringify(inOnePass)) throw new Error("24 × 24")
console.log(`Số lượt lấy ô khỏi hàng đợi: ${repeatedPops} / ${sharedPops}`)
