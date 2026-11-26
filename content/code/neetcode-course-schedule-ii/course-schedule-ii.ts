// LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
// Chạy: node course-schedule-ii.ts

let work = 0 // số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo

type Solver = (n: number, prereqs: number[][]) => number[]

// Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
function orderScan(n: number, prereqs: number[][]): number[] {
  const need: number[][] = Array.from({ length: n }, () => [])
  for (const [a, b] of prereqs) need[a].push(b) // muốn học a thì phải xong b
  const taken: boolean[] = new Array(n).fill(false)
  const order: number[] = []
  while (order.length < n) {
    let found = -1
    for (let c = 0; c < n && found < 0; c++) {
      work++ // cả môn đã học cũng tốn một lần nhìn qua
      if (taken[c]) continue
      let ready = true
      for (const b of need[c]) {
        work++
        if (!taken[b]) { ready = false; break }
      }
      if (ready) found = c
    }
    if (found < 0) return [] // còn môn chưa học mà không môn nào đủ điều kiện: có vòng
    taken[found] = true
    order.push(found)
  }
  return order
}

// Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. Chính hàng đợi là thứ tự. O(V+E).
function orderKahn(n: number, prereqs: number[][]): number[] {
  const next: number[][] = Array.from({ length: n }, () => [])
  const indegree: number[] = new Array(n).fill(0)
  for (const [a, b] of prereqs) {
    next[b].push(a) // cạnh b → a: học b xong mới mở khóa a
    indegree[a]++
  }
  const queue: number[] = []
  for (let c = 0; c < n; c++) if (indegree[c] === 0) queue.push(c)
  for (let head = 0; head < queue.length; head++) {
    const c = queue[head]
    work++
    for (const d of next[c]) {
      work++
      if (--indegree[d] === 0) queue.push(d)
    }
  }
  return queue.length === n ? queue : [] // thiếu môn nghĩa là có vòng
}

// Cách 3: DFS ba màu. Môn xong hết đường phía sau thì ghi vào post; đảo post là thứ tự. O(V+E).
function orderDfs(n: number, prereqs: number[][]): number[] {
  const next: number[][] = Array.from({ length: n }, () => [])
  for (const [a, b] of prereqs) next[b].push(a)
  const color: number[] = new Array(n).fill(0) // 0 trắng: chưa tới, 1 xám: đang trên đường đi, 2 đen: đã xong
  const post: number[] = []
  function visit(c: number): boolean {
    color[c] = 1
    work++
    for (const d of next[c]) {
      work++
      if (color[d] === 1) return false // quay lại một môn đang xám: vòng
      if (color[d] === 0 && !visit(d)) return false
    }
    color[c] = 2
    post.push(c)
    return true
  }
  for (let c = 0; c < n; c++) {
    if (color[c] === 0 && !visit(c)) return []
  }
  return post.reverse() // push rồi đảo một lần, không unshift từng phần tử
}

// Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
function wrongEdgeDirection(n: number, prereqs: number[][]): number[] {
  return orderKahn(n, prereqs.map(([a, b]) => [b, a]))
}

// Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
function wrongOneSetDfs(n: number, prereqs: number[][]): number[] {
  const next: number[][] = Array.from({ length: n }, () => [])
  for (const [a, b] of prereqs) next[b].push(a)
  const seen: boolean[] = new Array(n).fill(false)
  const post: number[] = []
  function visit(c: number): boolean {
    seen[c] = true
    for (const d of next[c]) {
      if (seen[d]) return false
      if (!visit(d)) return false
    }
    post.push(c)
    return true
  }
  for (let c = 0; c < n; c++) {
    if (!seen[c] && !visit(c)) return []
  }
  return post.reverse()
}

// Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
function wrongNoCycleCheck(n: number, prereqs: number[][]): number[] {
  const next: number[][] = Array.from({ length: n }, () => [])
  const indegree: number[] = new Array(n).fill(0)
  for (const [a, b] of prereqs) { next[b].push(a); indegree[a]++ }
  const queue: number[] = []
  for (let c = 0; c < n; c++) if (indegree[c] === 0) queue.push(c)
  for (let head = 0; head < queue.length; head++) {
    for (const d of next[queue[head]]) if (--indegree[d] === 0) queue.push(d)
  }
  return queue
}

// Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
function isValid(n: number, prereqs: number[][], order: number[], possible: boolean): boolean {
  if (!possible) return order.length === 0
  if (order.length !== n) return false
  const pos: number[] = new Array(n).fill(-1)
  for (let i = 0; i < n; i++) {
    const c = order[i]
    if (c < 0 || c >= n || pos[c] !== -1) return false
    pos[c] = i
  }
  return prereqs.every(([a, b]) => pos[b] < pos[a])
}

const cases: [string, number, number[][], boolean][] = [
  ["ví dụ sáu môn", 6, [[4, 3], [4, 0], [1, 4], [5, 4], [2, 1], [2, 5]], true],
  ["không có điều kiện", 3, [], true],
  ["một môn", 1, [], true],
  ["hai môn", 2, [[0, 1]], true],
  ["vòng hai môn", 2, [[0, 1], [1, 0]], false],
  ["vòng ba môn", 3, [[0, 1], [1, 2], [2, 0]], false],
  ["hình kim cương", 4, [[0, 2], [1, 2], [3, 0], [3, 1]], true],
  ["vòng ở một góc", 5, [[1, 0], [2, 1], [1, 2], [3, 0], [4, 3]], false],
]

const solvers: [string, Solver][] = [
  ["orderScan", orderScan],
  ["orderKahn", orderKahn],
  ["orderDfs", orderDfs],
  ["wrongEdgeDirection", wrongEdgeDirection],
  ["wrongOneSetDfs", wrongOneSetDfs],
  ["wrongNoCycleCheck", wrongNoCycleCheck],
]

for (const [name, solve] of solvers) {
  const wrong = cases.filter(([, n, p, possible]) => !isValid(n, p, solve(n, p), possible)).map(([label]) => label)
  const tail = wrong.length ? "; sai ở " + wrong.join(", ") : ""
  console.log(`${name.padEnd(20)} ${cases.length - wrong.length}/${cases.length} ca đúng${tail}`)
}

// Thứ tự không duy nhất: đếm mọi hoán vị hợp lệ của ví dụ sáu môn.
function permutations(n: number): number[][] {
  if (n === 0) return [[]]
  const out: number[][] = []
  for (const p of permutations(n - 1)) {
    for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), n - 1, ...p.slice(i)])
  }
  return out
}
const [, exN, exP] = cases[0]
const fromKahn = orderKahn(exN, exP)
const fromDfs = orderDfs(exN, exP)
const allValid = permutations(exN).filter((o) => isValid(exN, exP, o, true)).length
console.log(`ví dụ sáu môn: Kahn → [${fromKahn}], DFS → [${fromDfs}]; cả hai hợp lệ: ${isValid(exN, exP, fromKahn, true) && isValid(exN, exP, fromDfs, true)}; có ${allValid}/720 thứ tự hợp lệ`)
console.log(`chấm bằng cách so với đáp án cố định [${fromKahn}]: DFS bị chấm ${fromDfs.join() === fromKahn.join() ? "đúng" : "sai"}`)

// Số ngẫu nhiên MINSTD: năm ngôn ngữ sinh cùng một dãy.
let seed = 42
function rand(k: number): number {
  seed = (seed * 48271) % 2147483647
  return seed % k
}

// Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
let agree = 0
let cyclic = 0
const trials = 1000
for (let t = 0; t < trials; t++) {
  const n = 1 + rand(6)
  const m = rand(n * (n - 1) + 1)
  const keys = new Set<number>()
  const p: number[][] = []
  for (let i = 0; i < m; i++) {
    const a = rand(n)
    const b = rand(n)
    if (a !== b && !keys.has(a * n + b)) { keys.add(a * n + b); p.push([a, b]) }
  }
  const possible = permutations(n).some((o) => isValid(n, p, o, true))
  if (!possible) cyclic++
  if ([orderScan, orderKahn, orderDfs].every((solve) => isValid(n, p, solve(n, p), possible))) agree++
}
console.log(`ngẫu nhiên: ${agree}/${trials} đồ thị, ba cách đều hợp lệ (${cyclic} đồ thị có vòng)`)

// Đo trên 2 000 môn.
const N = 2000
const forward: number[][] = [] // môn i+1 cần môn i
const backward: number[][] = [] // môn i cần môn i+1
for (let i = 0; i + 1 < N; i++) { forward.push([i + 1, i]); backward.push([i, i + 1]) }
const rank: number[] = Array.from({ length: N }, (_, i) => i)
for (let i = N - 1; i > 0; i--) {
  const j = rand(i + 1)
  ;[rank[i], rank[j]] = [rank[j], rank[i]]
}
const randomDag: number[][] = []
const dagKeys = new Set<number>()
while (randomDag.length < 20000) {
  const u = rand(N)
  const v = rand(N)
  if (u === v) continue
  const [a, b] = rank[u] > rank[v] ? [u, v] : [v, u] // môn hạng cao cần môn hạng thấp
  if (dagKeys.has(a * N + b)) continue
  dagKeys.add(a * N + b)
  randomDag.push([a, b])
}
const graphs: [string, number[][]][] = [
  ["chuỗi xuôi (i+1 cần i)", forward],
  ["chuỗi ngược (i cần i+1)", backward],
  ["DAG ngẫu nhiên, 20000 điều kiện", randomDag],
]
for (const [label, p] of graphs) {
  console.log(`${label}, ${N} môn:`)
  for (const [name, solve] of solvers.slice(0, 3)) {
    work = 0
    const t0 = performance.now()
    const order = solve(N, p)
    const ms = performance.now() - t0
    console.log(`  ${name.padEnd(10)} hợp lệ: ${isValid(N, p, order, true)}, ${work} bước, ${ms.toFixed(2)} ms`)
  }
}
