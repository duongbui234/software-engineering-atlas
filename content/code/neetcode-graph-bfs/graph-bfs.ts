// Ga GRPH-02: một khuôn BFS cho bốn bài đồ thị.
// Chạy: node graph-bfs.ts

// ---------- Khuôn chung: BFS từ một hoặc nhiều điểm xuất phát ----------
// neighbors(x) trả về các đỉnh kề của x. key(x) biến đỉnh thành khóa để ghi sổ.
function bfs<T>(starts: T[], neighbors: (x: T) => T[], key: (x: T) => string): Map<string, number> {
  const dist = new Map<string, number>()
  const queue: T[] = []
  for (const s of starts) {
    if (dist.has(key(s))) continue
    dist.set(key(s), 0) // ghi sổ ngay khi xếp hàng
    queue.push(s)
  }
  for (let head = 0; head < queue.length; head++) {
    const x = queue[head]
    for (const y of neighbors(x)) {
      if (dist.has(key(y))) continue
      dist.set(key(y), dist.get(key(x))! + 1)
      queue.push(y)
    }
  }
  return dist
}

// ---------- 133. Clone Graph: sổ đã thăm kiêm bảng "cũ → mới" ----------
class GraphNode {
  val: number
  neighbors: GraphNode[] = []
  constructor(val: number) { this.val = val }
}

function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (!node) return null
  const copyOf = new Map<GraphNode, GraphNode>([[node, new GraphNode(node.val)]])
  const queue = [node]
  for (let head = 0; head < queue.length; head++) {
    const old = queue[head]
    for (const nb of old.neighbors) {
      if (!copyOf.has(nb)) { // lần đầu gặp: tạo bản sao rồi xếp hàng
        copyOf.set(nb, new GraphNode(nb.val))
        queue.push(nb)
      }
      copyOf.get(old)!.neighbors.push(copyOf.get(nb)!) // nối cạnh giữa hai bản sao
    }
  }
  return copyOf.get(node)!
}

// ---------- 417. Pacific Atlantic: đi ngược từ biển lên dốc ----------
type Cell = [number, number]
const DIRS: Cell[] = [[-1, 0], [1, 0], [0, -1], [0, 1]]

function pacificAtlantic(h: number[][]): Cell[] {
  const R = h.length, C = h[0].length
  const k = ([r, c]: Cell) => `${r},${c}`
  // Từ ô x, nước có thể chảy NGƯỢC lên ô y nếu y không thấp hơn x.
  const uphill = ([r, c]: Cell): Cell[] =>
    DIRS.map(([dr, dc]) => [r + dr, c + dc] as Cell)
      .filter(([nr, nc]) => nr >= 0 && nr < R && nc >= 0 && nc < C && h[nr][nc] >= h[r][c])
  const pacific: Cell[] = [], atlantic: Cell[] = []
  for (let r = 0; r < R; r++) { pacific.push([r, 0]); atlantic.push([r, C - 1]) }
  for (let c = 0; c < C; c++) { pacific.push([0, c]); atlantic.push([R - 1, c]) }
  const P = bfs(pacific, uphill, k), A = bfs(atlantic, uphill, k)
  const out: Cell[] = []
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (P.has(`${r},${c}`) && A.has(`${r},${c}`)) out.push([r, c])
  }
  return out
}

// Vét cạn để đối chiếu: từ mỗi ô, thả nước chảy xuống và xem nó chạm biển nào.
function pacificAtlanticBrute(h: number[][]): Cell[] {
  const R = h.length, C = h[0].length, out: Cell[] = []
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const downhill = ([x, y]: Cell): Cell[] =>
      DIRS.map(([dx, dy]) => [x + dx, y + dy] as Cell)
        .filter(([a, b]) => a >= 0 && a < R && b >= 0 && b < C && h[a][b] <= h[x][y])
    const seen = bfs([[r, c] as Cell], downhill, ([a, b]) => `${a},${b}`)
    let pac = false, atl = false
    for (const s of seen.keys()) {
      const [a, b] = s.split(",").map(Number)
      if (a === 0 || b === 0) pac = true
      if (a === R - 1 || b === C - 1) atl = true
    }
    if (pac && atl) out.push([r, c])
  }
  return out
}

// ---------- 130. Surrounded Regions: đi từ mép vào, ô nào chạm tới là an toàn ----------
function solve(board: string[][]): void {
  const R = board.length, C = board[0].length
  const k = ([r, c]: Cell) => `${r},${c}`
  const open = ([r, c]: Cell): Cell[] =>
    DIRS.map(([dr, dc]) => [r + dr, c + dc] as Cell)
      .filter(([nr, nc]) => nr >= 0 && nr < R && nc >= 0 && nc < C && board[nr][nc] === "O")
  const border: Cell[] = []
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if ((r === 0 || c === 0 || r === R - 1 || c === C - 1) && board[r][c] === "O") border.push([r, c])
  }
  const safe = bfs(border, open, k)
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (board[r][c] === "O" && !safe.has(`${r},${c}`)) board[r][c] = "X"
  }
}

// Vét cạn: một ô O bị lật khi lượt tô từ chính nó không chạm mép.
function solveBrute(board: string[][]): string[][] {
  const R = board.length, C = board[0].length
  return board.map((row, r) => row.map((v, c) => {
    if (v !== "O") return v
    const open = ([x, y]: Cell): Cell[] =>
      DIRS.map(([dx, dy]) => [x + dx, y + dy] as Cell)
        .filter(([a, b]) => a >= 0 && a < R && b >= 0 && b < C && board[a][b] === "O")
    const seen = bfs([[r, c] as Cell], open, ([a, b]) => `${a},${b}`)
    for (const s of seen.keys()) {
      const [a, b] = s.split(",").map(Number)
      if (a === 0 || b === 0 || a === R - 1 || b === C - 1) return "O"
    }
    return "X"
  }))
}

// ---------- 127. Word Ladder: đồ thị ẩn, hàng xóm sinh theo luật ----------
let expanded = 0 // đếm số từ được lấy ra khỏi hàng để so ba cách

// Cách 1: so từng cặp. Mỗi lần lấy một từ ra, quét cả danh sách.
function ladderNaive(begin: string, end: string, words: string[]): number {
  if (!words.includes(end)) return 0
  const dist = new Map<string, number>([[begin, 1]])
  const queue = [begin]
  const oneApart = (a: string, b: string) => {
    let diff = 0
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && ++diff > 1) return false
    return diff === 1
  }
  for (let head = 0; head < queue.length; head++) {
    const w = queue[head]; expanded++
    for (const v of words) {
      if (dist.has(v) || !oneApart(w, v)) continue
      if (v === end) return dist.get(w)! + 1
      dist.set(v, dist.get(w)! + 1)
      queue.push(v)
    }
  }
  return 0
}

// Cách 2: xô theo mẫu. "hot" nằm trong các xô "*ot", "h*t", "ho*".
function ladderBuckets(begin: string, end: string, words: string[]): number {
  if (!words.includes(end)) return 0
  const buckets = new Map<string, string[]>()
  for (const w of [begin, ...words]) {
    for (let i = 0; i < w.length; i++) {
      const p = w.slice(0, i) + "*" + w.slice(i + 1)
      if (!buckets.has(p)) buckets.set(p, [])
      buckets.get(p)!.push(w)
    }
  }
  const dist = new Map<string, number>([[begin, 1]])
  const queue = [begin]
  for (let head = 0; head < queue.length; head++) {
    const w = queue[head]; expanded++
    for (let i = 0; i < w.length; i++) {
      for (const v of buckets.get(w.slice(0, i) + "*" + w.slice(i + 1))!) {
        if (dist.has(v)) continue
        if (v === end) return dist.get(w)! + 1
        dist.set(v, dist.get(w)! + 1)
        queue.push(v)
      }
    }
  }
  return 0
}

// Cách 3: BFS hai đầu. Mỗi vòng mở rộng phía có ít từ hơn, dừng khi hai phía chạm nhau.
function ladderBidirectional(begin: string, end: string, words: string[]): number {
  const dict = new Set(words)
  if (!dict.has(end)) return 0
  let front = new Set([begin]), back = new Set([end])
  const seen = new Set([begin, end])
  let length = 1
  while (front.size && back.size) {
    if (front.size > back.size) [front, back] = [back, front]
    const next = new Set<string>()
    length++
    for (const w of front) {
      expanded++
      for (let i = 0; i < w.length; i++) {
        for (let ch = 97; ch <= 122; ch++) {
          const v = w.slice(0, i) + String.fromCharCode(ch) + w.slice(i + 1)
          if (back.has(v)) return length
          if (!dict.has(v) || seen.has(v)) continue
          seen.add(v)
          next.add(v)
        }
      }
    }
    front = next
  }
  return 0
}

// ---------- Kiểm tra ----------
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildGraph(adj: number[][]): GraphNode | null {
  if (adj.length === 0) return null
  const nodes = adj.map((_, i) => new GraphNode(i + 1))
  adj.forEach((list, i) => { nodes[i].neighbors = list.map(v => nodes[v - 1]) })
  return nodes[0]
}

function toAdj(node: GraphNode | null): { adj: number[][]; nodes: Set<GraphNode> } {
  const nodes = new Set<GraphNode>()
  if (!node) return { adj: [], nodes }
  const queue = [node]; nodes.add(node)
  for (let head = 0; head < queue.length; head++) {
    for (const nb of queue[head].neighbors) if (!nodes.has(nb)) { nodes.add(nb); queue.push(nb) }
  }
  const adj: number[][] = []
  for (const n of nodes) adj[n.val - 1] = n.neighbors.map(x => x.val)
  return { adj, nodes }
}

const square = [[2, 4], [1, 3], [2, 4], [1, 3]]
const original = buildGraph(square)
const copy = cloneGraph(original)
const spiral = [[1, 2, 3], [8, 9, 4], [7, 6, 5]]
const rand = mulberry32(42)

const randomGrids = Array.from({ length: 200 }, () => {
  const R = 1 + Math.floor(rand() * 5), C = 1 + Math.floor(rand() * 5)
  return Array.from({ length: R }, () => Array.from({ length: C }, () => Math.floor(rand() * 4)))
})
const randomBoards = Array.from({ length: 200 }, () => {
  const R = 1 + Math.floor(rand() * 6), C = 1 + Math.floor(rand() * 6)
  return Array.from({ length: R }, () => Array.from({ length: C }, () => (rand() < 0.55 ? "O" : "X")))
})
const flipped = (b: string[][]) => { const x = b.map(r => [...r]); solve(x); return x }

const words = ["cord", "card", "ward", "warm", "word", "worm", "wore", "core", "cold"]
const randomWords = Array.from({ length: 300 }, () =>
  Array.from({ length: 3 }, () => "abcd"[Math.floor(rand() * 4)]).join(""))
const pairs = Array.from({ length: 200 }, () =>
  [randomWords[Math.floor(rand() * 300)], randomWords[Math.floor(rand() * 300)]])
  .filter(([a, b]) => a !== b)

const cases: [string, boolean][] = [
  ["133 bản sao giữ đúng cạnh", JSON.stringify(toAdj(copy).adj) === JSON.stringify(square)],
  ["133 bản sao không dùng chung nút nào", [...toAdj(copy).nodes].every(n => !toAdj(original).nodes.has(n))],
  ["133 đồ thị rỗng", cloneGraph(null) === null],
  ["133 một nút không cạnh", JSON.stringify(toAdj(cloneGraph(buildGraph([[]]))).adj) === "[[]]"],
  ["417 lưới xoắn ốc", JSON.stringify(pacificAtlantic(spiral)) === "[[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]"],
  ["417 một ô", JSON.stringify(pacificAtlantic([[5]])) === "[[0,0]]"],
  ["417 khớp vét cạn trên 200 lưới ngẫu nhiên",
    randomGrids.every(g => JSON.stringify(pacificAtlantic(g)) === JSON.stringify(pacificAtlanticBrute(g)))],
  ["130 vùng kín bị lật, ô ở mép giữ nguyên", JSON.stringify(flipped([
    ["X", "X", "X", "X"], ["X", "O", "O", "X"], ["X", "X", "O", "X"], ["X", "O", "X", "X"]]))
    === JSON.stringify([["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "X", "X", "X"], ["X", "O", "X", "X"]])],
  ["130 vùng nối ra mép thì an toàn", JSON.stringify(flipped([
    ["X", "O", "X"], ["X", "O", "X"], ["X", "X", "X"]])) === JSON.stringify([["X", "O", "X"], ["X", "O", "X"], ["X", "X", "X"]])],
  ["130 khớp vét cạn trên 200 bảng ngẫu nhiên",
    randomBoards.every(b => JSON.stringify(flipped(b)) === JSON.stringify(solveBrute(b)))],
  ["127 cold → warm cần 5 từ", ladderBuckets("cold", "warm", words) === 5],
  ["127 đích không có trong danh sách", ladderBuckets("cold", "warm", words.filter(w => w !== "warm")) === 0],
  ["127 đích cách một chữ", ladderBidirectional("cold", "cord", words) === 2],
  ["127 ba cách khớp nhau trên 200 cặp ngẫu nhiên", pairs.every(([a, b]) => {
    const x = ladderNaive(a, b, randomWords), y = ladderBuckets(a, b, randomWords), z = ladderBidirectional(a, b, randomWords)
    return x === y && y === z
  })],
]
const ok = cases.filter(([, pass]) => pass).length
for (const [name, pass] of cases) if (!pass) console.log("SAI:", name)
console.log(`graph-bfs ${ok}/${cases.length} ca đúng`)

// ---------- Đo: Word Ladder với 5000 từ sáu chữ ----------
const big = new Set<string>()
const r2 = mulberry32(7)
while (big.size < 5000) big.add(Array.from({ length: 6 }, () => "abcde"[Math.floor(r2() * 5)]).join(""))
const list = [...big]
const begin = "aaaaaa", target = "eeeeee"
list.push(target)
for (const [name, f] of [["so từng cặp", ladderNaive], ["xô theo mẫu", ladderBuckets], ["BFS hai đầu", ladderBidirectional]] as const) {
  expanded = 0
  const t0 = performance.now()
  const len = f(begin, target, list)
  const ms = performance.now() - t0
  console.log(`127 ${name}: dài ${len}, lấy ra ${expanded} từ, ${ms.toFixed(1)} ms`)
}
