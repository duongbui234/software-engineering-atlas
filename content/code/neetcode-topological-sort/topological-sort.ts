// Ga GRPH-03: sắp xếp topo cho ba bài Course Schedule, Course Schedule II, Alien Dictionary.
// Chạy: node topological-sort.ts

// ---------- Khuôn chung: thuật toán Kahn ----------
// n đỉnh 0..n-1, edges là các cặp [trước, sau]. Trả về thứ tự lấy ra được.
// Nếu thứ tự ngắn hơn n thì đồ thị có chu trình.
function kahn(n: number, edges: [number, number][]): number[] {
  const adj: number[][] = Array.from({ length: n }, () => [])
  const indeg = new Array<number>(n).fill(0)
  for (const [before, after] of edges) {
    adj[before].push(after)
    indeg[after]++ // "after" còn chờ thêm một việc
  }
  const queue: number[] = []
  for (let v = 0; v < n; v++) if (indeg[v] === 0) queue.push(v)
  const order: number[] = []
  for (let head = 0; head < queue.length; head++) {
    const v = queue[head]
    order.push(v)
    for (const w of adj[v]) {
      indeg[w]--
      if (indeg[w] === 0) queue.push(w) // hết việc phải chờ: sẵn sàng
    }
  }
  return order
}

// Đề cho [a, b] nghĩa là "học b trước a", tức cạnh b → a.
function toEdges(prerequisites: number[][]): [number, number][] {
  return prerequisites.map(([a, b]) => [b, a] as [number, number])
}

// ---------- 207. Course Schedule: chỉ hỏi có học hết được không ----------
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  return kahn(numCourses, toEdges(prerequisites)).length === numCourses
}

// Cách thứ hai: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = đã xong.
const WHITE = 0, GRAY = 1, BLACK = 2

function canFinishDfs(numCourses: number, prerequisites: number[][]): boolean {
  const adj: number[][] = Array.from({ length: numCourses }, () => [])
  for (const [b, a] of toEdges(prerequisites)) adj[b].push(a)
  const color = new Array<number>(numCourses).fill(WHITE)
  const hasCycleFrom = (v: number): boolean => {
    color[v] = GRAY
    for (const w of adj[v]) {
      if (color[w] === GRAY) return true // quay lại một đỉnh còn trên đường: chu trình
      if (color[w] === WHITE && hasCycleFrom(w)) return true
    }
    color[v] = BLACK
    return false
  }
  for (let v = 0; v < numCourses; v++) {
    if (color[v] === WHITE && hasCycleFrom(v)) return false
  }
  return true
}

// ---------- 210. Course Schedule II: trả về một thứ tự học ----------
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const order = kahn(numCourses, toEdges(prerequisites))
  return order.length === numCourses ? order : []
}

// DFS: một môn "xong" (tô đen) sau mọi môn đứng sau nó. Đảo ngược thứ tự xong là thứ tự topo.
function findOrderDfs(numCourses: number, prerequisites: number[][]): number[] {
  const adj: number[][] = Array.from({ length: numCourses }, () => [])
  for (const [b, a] of toEdges(prerequisites)) adj[b].push(a)
  const color = new Array<number>(numCourses).fill(WHITE)
  const finished: number[] = []
  const visit = (v: number): boolean => {
    color[v] = GRAY
    for (const w of adj[v]) {
      if (color[w] === GRAY) return false
      if (color[w] === WHITE && !visit(w)) return false
    }
    color[v] = BLACK
    finished.push(v)
    return true
  }
  for (let v = 0; v < numCourses; v++) {
    if (color[v] === WHITE && !visit(v)) return []
  }
  return finished.reverse()
}

// ---------- 269. Alien Dictionary: tự dựng cạnh từ các cặp từ kề nhau ----------
function alienOrder(words: string[]): string {
  const letters: string[] = [] // theo thứ tự xuất hiện đầu tiên
  const id = new Map<string, number>()
  for (const word of words) {
    for (const ch of word) {
      if (!id.has(ch)) {
        id.set(ch, letters.length)
        letters.push(ch)
      }
    }
  }
  const edges: [number, number][] = []
  const seenEdge = new Set<string>()
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i], b = words[i + 1]
    const len = Math.min(a.length, b.length)
    let j = 0
    while (j < len && a[j] === b[j]) j++
    if (j === len) {
      if (a.length > b.length) return "" // "abc" đứng trước "ab": danh sách sai
      continue // một từ là đầu của từ kia: không cho biết gì
    }
    const key = a[j] + b[j]
    if (!seenEdge.has(key)) { // mỗi cạnh chỉ thêm một lần, để danh sách kề và bậc vào khớp nhau
      seenEdge.add(key)
      edges.push([id.get(a[j])!, id.get(b[j])!])
    }
  }
  const order = kahn(letters.length, edges)
  return order.length === letters.length ? order.map((v) => letters[v]).join("") : ""
}

// ---------- Kiểm tra ----------
function isValidOrder(n: number, prerequisites: number[][], order: number[]): boolean {
  if (order.length !== n) return false
  const pos = new Array<number>(n).fill(-1)
  order.forEach((v, i) => { pos[v] = i })
  if (pos.includes(-1)) return false
  return prerequisites.every(([a, b]) => pos[b] < pos[a])
}

// Danh sách từ có được xếp đúng theo bảng chữ `alphabet` không, và có đủ mọi chữ không.
function sortedBy(words: string[], alphabet: string): boolean {
  const rank = new Map<string, number>()
  for (let i = 0; i < alphabet.length; i++) rank.set(alphabet[i], i)
  const all = new Set(words.join(""))
  if (all.size !== alphabet.length || [...all].some((c) => !rank.has(c))) return false
  const cmp = (a: string, b: string): number => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) return rank.get(a[i])! - rank.get(b[i])!
    }
    return a.length - b.length
  }
  for (let i = 0; i + 1 < words.length; i++) if (cmp(words[i], words[i + 1]) > 0) return false
  return true
}

// Bộ sinh số giả ngẫu nhiên cố định hạt giống, để lần chạy nào cũng như nhau.
let seed = 42
function rand(k: number): number {
  seed = (seed * 48271) % 2147483647
  return seed % k
}

function randomPrereqs(n: number, m: number): number[][] {
  const out: number[][] = []
  for (let i = 0; i < m; i++) out.push([rand(n), rand(n)])
  return out
}

// Trang phục buổi sáng: 0 tất, 1 quần, 2 áo sơ mi, 3 giày, 4 thắt lưng, 5 cà vạt, 6 áo khoác.
const outfit = [[3, 0], [3, 1], [4, 1], [4, 2], [5, 2], [6, 5], [6, 4]]
const chain = Array.from({ length: 1999 }, (_, i) => [i + 1, i])
const graphs: [number, number[][]][] = []
for (let t = 0; t < 300; t++) {
  const n = 1 + rand(8)
  graphs.push([n, randomPrereqs(n, rand(10))])
}
const alienLists: string[][] = []
for (let t = 0; t < 200; t++) {
  const pool = "abcdef".slice(0, 2 + rand(5))
  const list: string[] = []
  for (let k = 0; k < 2 + rand(6); k++) {
    let w = ""
    for (let c = 0; c < 1 + rand(3); c++) w += pool[rand(pool.length)]
    list.push(w)
  }
  // xếp theo một bảng chữ đảo ngược, để đáp án không trùng thứ tự a-z
  const alphabet = [...pool].reverse().join("")
  list.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) return alphabet.indexOf(a[i]) - alphabet.indexOf(b[i])
    }
    return a.length - b.length
  })
  alienLists.push(list)
}

const cases: [string, boolean][] = [
  ["207 hai môn, một điều kiện", canFinish(2, [[1, 0]]) === true],
  ["207 hai môn chờ nhau: chu trình", canFinish(2, [[1, 0], [0, 1]]) === false],
  ["207 môn tự cần chính nó", canFinish(1, [[0, 0]]) === false],
  ["207 chuỗi 2 000 môn", canFinish(2000, chain) && canFinishDfs(2000, chain)],
  ["207 Kahn và DFS ba màu khớp nhau trên 300 đồ thị",
    graphs.every(([n, p]) => canFinish(n, p) === canFinishDfs(n, p))],
  ["210 trang phục buổi sáng", findOrder(7, outfit).join(",") === "0,1,2,3,4,5,6"],
  ["210 DFS cũng cho thứ tự hợp lệ", isValidOrder(7, outfit, findOrderDfs(7, outfit))],
  ["210 có chu trình thì trả mảng rỗng", findOrder(3, [[0, 1], [1, 2], [2, 0]]).length === 0],
  ["210 thứ tự hợp lệ trên 300 đồ thị",
    graphs.every(([n, p]) => {
      const o = findOrder(n, p)
      return canFinish(n, p) ? isValidOrder(n, p, o) && isValidOrder(n, p, findOrderDfs(n, p)) : o.length === 0
    })],
  ["269 ví dụ bốn từ", alienOrder(["ba", "bc", "ac", "cab"]) === "bac"],
  ["269 hai chữ ngược nhau: chu trình", alienOrder(["z", "x", "z"]) === ""],
  ["269 từ dài đứng trước đầu của nó", alienOrder(["abc", "ab"]) === ""],
  ["269 chữ không có cạnh vẫn phải có mặt", sortedBy(["za", "zb"], alienOrder(["za", "zb"]))],
  ["269 khớp bảng chữ trên 200 danh sách ngẫu nhiên",
    alienLists.every((l) => sortedBy(l, alienOrder(l)))],
]

let ok = 0
for (const [name, pass] of cases) {
  if (pass) ok++
  else console.log("SAI:", name)
}
console.log(`topological-sort ${ok}/${cases.length} ca đúng`)
