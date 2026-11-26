// LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
// Chạy: node surrounded.ts
type Board = string[][]

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]]

// Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không.
// Thời gian O((mn)²): cả vùng bị duyệt lại một lần cho mỗi ô của nó.
let bruteVisits = 0
function bruteForcePerCell(board: Board): void {
  const m = board.length, n = board[0].length
  const stamp = new Int32Array(m * n)
  let round = 0
  const toFlip: number[] = []
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] !== 'O') continue
      round++
      const queue = [r * n + c]
      stamp[r * n + c] = round
      let escaped = false
      for (let head = 0; head < queue.length && !escaped; head++) {
        bruteVisits++
        const cr = Math.floor(queue[head] / n), cc = queue[head] % n
        if (cr === 0 || cr === m - 1 || cc === 0 || cc === n - 1) escaped = true
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue
          if (board[nr][nc] !== 'O' || stamp[nr * n + nc] === round) continue
          stamp[nr * n + nc] = round
          queue.push(nr * n + nc)
        }
      }
      if (!escaped) toFlip.push(r * n + c) // chưa đổi ngay, để các ô sau còn đọc đúng
    }
  }
  for (const id of toFlip) board[Math.floor(id / n)][id % n] = 'X'
}

// Cách 1: tô từng vùng. Gom cả vùng bằng BFS, nhớ xem vùng có chạm biên không,
// duyệt xong mới đổi. O(mn).
function regionFill(board: Board): void {
  const m = board.length, n = board[0].length
  const seen = new Uint8Array(m * n)
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] !== 'O' || seen[r * n + c]) continue
      const region = [r * n + c]
      seen[r * n + c] = 1
      let touchesBorder = false
      for (let head = 0; head < region.length; head++) {
        const cr = Math.floor(region[head] / n), cc = region[head] % n
        if (cr === 0 || cr === m - 1 || cc === 0 || cc === n - 1) touchesBorder = true
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc
          if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue
          if (board[nr][nc] !== 'O' || seen[nr * n + nc]) continue
          seen[nr * n + nc] = 1
          region.push(nr * n + nc)
        }
      }
      if (!touchesBorder) for (const id of region) board[Math.floor(id / n)][id % n] = 'X'
    }
  }
}

// Cách 2 (nên dùng): đi ngược từ biên. Mọi ô O trên biên vào hàng đợi cùng lúc
// và được đánh dấu an toàn 'S'. BFS lan 'S' vào trong. Cuối cùng quét một lượt:
// O còn lại bị vây nên thành X, S trả lại thành O.
function borderBfs(board: Board): void {
  const m = board.length, n = board[0].length
  const queue: number[] = []
  const seed = (r: number, c: number) => {
    if (board[r][c] === 'O') { board[r][c] = 'S'; queue.push(r * n + c) }
  }
  for (let r = 0; r < m; r++) { seed(r, 0); seed(r, n - 1) }
  for (let c = 0; c < n; c++) { seed(0, c); seed(m - 1, c) }
  for (let head = 0; head < queue.length; head++) {
    const cr = Math.floor(queue[head] / n), cc = queue[head] % n
    for (const [dr, dc] of DIRS) {
      const nr = cr + dr, nc = cc + dc
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] !== 'O') continue
      board[nr][nc] = 'S'
      queue.push(nr * n + nc)
    }
  }
  finish(board)
}

function finish(board: Board): void {
  for (const row of board) {
    for (let c = 0; c < row.length; c++) row[c] = row[c] === 'O' ? 'X' : row[c] === 'S' ? 'O' : row[c]
  }
}

// Cách 3: cùng ý tưởng đi ngược từ biên, lan bằng DFS đệ quy.
// Ngắn nhất, nhưng độ sâu lời gọi có thể bằng số ô của vùng (40 000 ở 200×200).
function borderDfsRecursive(board: Board): void {
  const m = board.length, n = board[0].length
  const dfs = (r: number, c: number): void => {
    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== 'O') return
    board[r][c] = 'S'
    dfs(r - 1, c); dfs(r + 1, c); dfs(r, c - 1); dfs(r, c + 1)
  }
  for (let r = 0; r < m; r++) { dfs(r, 0); dfs(r, n - 1) }
  for (let c = 0; c < n; c++) { dfs(0, c); dfs(m - 1, c) }
  finish(board)
}

// Cách 4: DFS với ngăn xếp tự quản lý, không phụ thuộc giới hạn đệ quy.
function borderDfsIterative(board: Board): void {
  const m = board.length, n = board[0].length
  const stack: number[] = []
  const seed = (r: number, c: number) => {
    if (board[r][c] === 'O') { board[r][c] = 'S'; stack.push(r * n + c) }
  }
  for (let r = 0; r < m; r++) { seed(r, 0); seed(r, n - 1) }
  for (let c = 0; c < n; c++) { seed(0, c); seed(m - 1, c) }
  while (stack.length > 0) {
    const id = stack.pop()!
    const cr = Math.floor(id / n), cc = id % n
    for (const [dr, dc] of DIRS) {
      const nr = cr + dr, nc = cc + dc
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || board[nr][nc] !== 'O') continue
      board[nr][nc] = 'S'
      stack.push(nr * n + nc)
    }
  }
  finish(board)
}

// Cách 5: Union-Find với một nút ảo "biên". Ô O trên biên nối vào nút ảo,
// ô O nối với hàng xóm O bên phải và bên dưới. Ô O nào không cùng nhóm với nút ảo thì bị vây.
function unionFind(board: Board): void {
  const m = board.length, n = board[0].length
  const BORDER = m * n
  const parent = Array.from({ length: m * n + 1 }, (_, i) => i)
  const size = new Array(m * n + 1).fill(1)
  const find = (x: number): number => {
    let root = x
    while (parent[root] !== root) root = parent[root]
    while (parent[x] !== root) { const next = parent[x]; parent[x] = root; x = next }
    return root
  }
  const union = (a: number, b: number) => {
    let ra = find(a), rb = find(b)
    if (ra === rb) return
    if (size[ra] < size[rb]) [ra, rb] = [rb, ra]
    parent[rb] = ra
    size[ra] += size[rb]
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] !== 'O') continue
      const id = r * n + c
      if (r === 0 || r === m - 1 || c === 0 || c === n - 1) union(id, BORDER)
      if (r + 1 < m && board[r + 1][c] === 'O') union(id, id + n)
      if (c + 1 < n && board[r][c + 1] === 'O') union(id, id + 1)
    }
  }
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === 'O' && find(r * n + c) !== find(BORDER)) board[r][c] = 'X'
    }
  }
}

// SAI 1: đổi mọi ô O không nằm trên biên. Bỏ qua chuyện ô bên trong vẫn có thể nối ra biên.
function wrongNotOnBorder(board: Board): void {
  const m = board.length, n = board[0].length
  for (let r = 1; r < m - 1; r++) for (let c = 1; c < n - 1; c++) if (board[r][c] === 'O') board[r][c] = 'X'
}

// SAI 2: đổi ô thành X ngay lúc tìm, rồi mới biết vùng chạm biên thì đã muộn.
// Toán tử && còn dừng sớm, nên phần còn lại của vùng không được thăm.
function wrongFlipDuringSearch(board: Board): void {
  const m = board.length, n = board[0].length
  const surrounded = (r: number, c: number): boolean => {
    if (r < 0 || r >= m || c < 0 || c >= n) return false // ra ngoài: vùng chạm biên
    if (board[r][c] !== 'O') return true
    board[r][c] = 'X' // đổi luôn, coi như "đã thăm"
    return surrounded(r - 1, c) && surrounded(r + 1, c) && surrounded(r, c - 1) && surrounded(r, c + 1)
  }
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (board[r][c] === 'O') surrounded(r, c)
}

// SAI 3: làm đúng trên một bản sao rồi gán lại tham số. Người gọi vẫn giữ bảng cũ.
function wrongNewBoard(board: Board): void {
  board = board.map(row => [...row])
  borderBfs(board)
}

// ---------- ca thử ----------
const parse = (rows: string[]): Board => rows.map(row => row.split(''))
const show = (b: Board) => b.map(row => row.join('')).join('/')
const square = (n: number, fill: (r: number, c: number) => string): Board =>
  Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => fill(r, c)))

type Case = { name: string, board: Board, want: Board }
const cases: Case[] = [
  { name: 'ví dụ 5×5 ở trên', board: parse(['XXXXX', 'XOOXX', 'XXOXX', 'XOXOO', 'XOXXX']),
    want: parse(['XXXXX', 'XXXXX', 'XXXXX', 'XOXOO', 'XOXXX']) },
  { name: 'một ô O', board: parse(['O']), want: parse(['O']) },
  { name: 'một ô X', board: parse(['X']), want: parse(['X']) },
  { name: '3×3 toàn O', board: parse(['OOO', 'OOO', 'OOO']), want: parse(['OOO', 'OOO', 'OOO']) },
  { name: 'vòng X bao một ô O', board: parse(['XXX', 'XOX', 'XXX']), want: parse(['XXX', 'XXX', 'XXX']) },
  { name: 'một hàng OXO', board: parse(['OXO']), want: parse(['OXO']) },
  { name: 'chạm chéo không tính là nối', board: parse(['OXXX', 'XOXX', 'XXOX', 'XXXX']),
    want: parse(['OXXX', 'XXXX', 'XXXX', 'XXXX']) },
  { name: 'đường vòng vèo ra biên', board: parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX']),
    want: parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX']) },
  { name: '200×200 toàn O', board: square(200, () => 'O'), want: square(200, () => 'O') },
  { name: '200×200 viền X, trong toàn O',
    board: square(200, (r, c) => (r === 0 || c === 0 || r === 199 || c === 199 ? 'X' : 'O')),
    want: square(200, () => 'X') },
]

const solvers: [string, (b: Board) => void][] = [
  ['bruteForcePerCell', bruteForcePerCell], ['regionFill', regionFill], ['borderBfs', borderBfs],
  ['borderDfsRecursive', borderDfsRecursive], ['borderDfsIterative', borderDfsIterative], ['unionFind', unionFind],
  ['wrongNotOnBorder', wrongNotOnBorder], ['wrongFlipDuringSearch', wrongFlipDuringSearch], ['wrongNewBoard', wrongNewBoard],
]

for (const [name, solve] of solvers) {
  let ok = 0
  const bad: string[] = []
  // vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
  const mine = solve === bruteForcePerCell ? cases.filter(tc => tc.board.length <= 10) : cases
  for (const tc of mine) {
    const board = tc.board.map(row => [...row])
    try {
      solve(board)
      if (show(board) === show(tc.want)) ok++
      else bad.push(tc.name)
    } catch (e) {
      bad.push(`${tc.name} → ném ${(e as Error).name}`)
    }
  }
  const note = mine.length < cases.length ? ' (chỉ các ca nhỏ)' : ''
  console.log(`${name.padEnd(22)} ${ok}/${mine.length} ca đúng${note}${bad.length ? '; sai ở ' + bad.join(', ') : ''}`)
}

// Đối chiếu ngẫu nhiên: các cách đúng phải ra cùng bảng với vét cạn.
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(42)
const TRIALS = 2000
let agree = 0
for (let t = 0; t < TRIALS; t++) {
  const m = 1 + Math.floor(rand() * 8), n = 1 + Math.floor(rand() * 8)
  const board: Board = Array.from({ length: m }, () => Array.from({ length: n }, () => (rand() < 0.6 ? 'O' : 'X')))
  const ref = board.map(row => [...row])
  bruteForcePerCell(ref)
  const all = [regionFill, borderBfs, borderDfsRecursive, borderDfsIterative, unionFind].every(solve => {
    const b = board.map(row => [...row])
    solve(b)
    return show(b) === show(ref)
  })
  if (all) agree++
}
console.log(`đối chiếu ngẫu nhiên: ${agree}/${TRIALS} bảng, năm cách đúng khớp vét cạn`)

// Đo: vét cạn O((mn)²) so với tô từng vùng O(mn) trên bảng viền X, trong toàn O
// (cả phần trong là một vùng bị vây, nên cả hai đều phải duyệt hết nó).
for (const size of [30, 60, 90]) {
  const make = () => square(size, (r, c) => (r === 0 || c === 0 || r === size - 1 || c === size - 1 ? 'X' : 'O'))
  let b = make()
  bruteVisits = 0
  let t0 = performance.now()
  bruteForcePerCell(b)
  const brute = performance.now() - t0
  b = make()
  t0 = performance.now()
  regionFill(b)
  const fast = performance.now() - t0
  console.log(`${size}×${size}: vét cạn ${bruteVisits} lượt thăm, ${brute.toFixed(1)} ms; tô từng vùng ${fast.toFixed(2)} ms`)
}
