// LC 207 Course Schedule: có học hết được mọi môn không? Năm ngôn ngữ cùng một bộ ca.
// Chạy: node course-schedule.js

let work = 0 // số lần nhìn một cạnh (một môn tiên quyết), dùng cho phép đo

// Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
function buildGraph(n, prerequisites) {
  const adj= Array.from({ length: n }, () => [])
  const indegree = new Array(n).fill(0)
  for (const [a, b] of prerequisites) {
    adj[b].push(a)
    indegree[a]++
  }
  return { adj, indegree }
}

// Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
// Một lượt không học thêm được môn nào thì dừng. Xấu nhất O(V·(V + E)).
let passes = 0
function canFinishScan(n, prerequisites) {
  const needs= Array.from({ length: n }, () => [])
  for (const [a, b] of prerequisites) needs[a].push(b)
  const done = new Array(n).fill(false)
  let count = 0
  passes = 0
  let progress = true
  while (progress) {
    progress = false
    passes++
    for (let c = 0; c < n; c++) {
      if (done[c]) continue
      let ready = true
      for (const b of needs[c]) {
        work++
        if (!done[b]) { ready = false; break }
      }
      if (ready) { done[c] = true; count++; progress = true }
    }
  }
  return count === n
}

// Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
// của các môn đứng sau. Đếm số môn học được. O(V + E).
function canFinishKahn(n, prerequisites) {
  const { adj, indegree } = buildGraph(n, prerequisites)
  const queue = []
  for (let c = 0; c < n; c++) if (indegree[c] === 0) queue.push(c)
  let taken = 0
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head]
    taken++
    for (const v of adj[u]) {
      work++
      if (--indegree[v] === 0) queue.push(v)
    }
  }
  return taken === n // thiếu môn nào là môn đó kẹt trong một vòng
}

// Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
// đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
const WHITE = 0, GRAY = 1, BLACK = 2
function canFinishDfs(n, prerequisites) {
  const { adj } = buildGraph(n, prerequisites)
  const color = new Array(n).fill(WHITE)
  const visit = (u) => {
    color[u] = GRAY
    for (const v of adj[u]) {
      work++
      if (color[v] === GRAY) return false // quay về đỉnh đang trên đường: vòng
      if (color[v] === WHITE && !visit(v)) return false
    }
    color[u] = BLACK
    return true
  }
  for (let u = 0; u < n; u++) {
    if (color[u] === WHITE && !visit(u)) return false
  }
  return true
}

// Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
function canFinishDfsStack(n, prerequisites) {
  const { adj } = buildGraph(n, prerequisites)
  const color = new Array(n).fill(WHITE)
  const next = new Array(n).fill(0) // hàng xóm kế tiếp cần xem của mỗi đỉnh
  for (let s = 0; s < n; s++) {
    if (color[s] !== WHITE) continue
    const stack = [s]
    color[s] = GRAY
    while (stack.length > 0) {
      const u = stack[stack.length - 1]
      if (next[u] < adj[u].length) {
        const v = adj[u][next[u]++]
        work++
        if (color[v] === GRAY) return false
        if (color[v] === WHITE) { color[v] = GRAY; stack.push(v) }
      } else {
        color[u] = BLACK
        stack.pop()
      }
    }
  }
  return true
}

// Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
function wrongOneVisitedSet(n, prerequisites) {
  const { adj } = buildGraph(n, prerequisites)
  const visited = new Set()
  const visit = (u) => {
    if (visited.has(u)) return false
    visited.add(u)
    for (const v of adj[u]) if (!visit(v)) return false
    return true
  }
  for (let u = 0; u < n; u++) if (!visited.has(u) && !visit(u)) return false
  return true
}

// Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
function wrongHasStart(n, prerequisites) {
  const { indegree } = buildGraph(n, prerequisites)
  return indegree.some((d) => d === 0)
}

const cases = [
  ["hai môn", 2, [[1, 0]], true],
  ["hai môn chờ nhau", 2, [[1, 0], [0, 1]], false],
  ["kim cương", 4, [[1, 0], [2, 0], [3, 1], [3, 2]], true],
  ["ví dụ năm môn", 5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], true],
  ["học được một môn rồi kẹt", 4, [[1, 0], [2, 1], [3, 2], [1, 3]], false],
  ["môn tự cần chính nó", 2, [[1, 1]], false],
  ["không có tiên quyết", 3, [], true],
  ["hai mảnh, mảnh sau có vòng", 6, [[1, 0], [3, 2], [4, 3], [2, 4]], false],
]

function check(name, solve) {
  let ok = 0
  const wrong = []
  for (const [label, n, pre, want] of cases) {
    const got = solve(n, pre)
    if (got === want) ok++
    else wrong.push(`${label} → ${got}`)
  }
  console.log(`${name.padEnd(20)} ${ok}/${cases.length} ca đúng${wrong.length ? "; sai ở " + wrong.join(", ") : ""}`)
}

check("canFinishScan", canFinishScan)
check("canFinishKahn", canFinishKahn)
check("canFinishDfs", canFinishDfs)
check("canFinishDfsStack", canFinishDfsStack)
check("wrongOneVisitedSet", wrongOneVisitedSet)
check("wrongHasStart", wrongHasStart)

// Bộ sinh số giả ngẫu nhiên MINSTD: năm ngôn ngữ ra cùng một dãy, cùng đồ thị.
let seed = 20261126
function rand(k) {
  seed = (seed * 48271) % 2147483647
  return seed % k
}

// Đối chiếu bốn cách đúng trên 2 000 đồ thị nhỏ ngẫu nhiên (có thể có vòng, có môn tự cần mình).
let agree = 0, finishable = 0
for (let t = 0; t < 2000; t++) {
  const n = 1 + rand(8)
  const m = rand(n * 2 + 1)
  const seen = new Set()
  const pre = []
  for (let i = 0; i < m; i++) {
    const a = rand(n), b = rand(n)
    if (seen.has(a * n + b)) continue
    seen.add(a * n + b)
    pre.push([a, b])
  }
  const r = [canFinishScan, canFinishKahn, canFinishDfs, canFinishDfsStack].map((f) => f(n, pre))
  if (r.every((x) => x === r[0])) agree++
  if (r[0]) finishable++
}
console.log(`ngẫu nhiên: ${agree}/2000 đồ thị, bốn cách khớp nhau (${finishable} học hết được, ${2000 - finishable} có vòng)`)

function measure(name, solve, n, pre, extra = () => "") {
  let best = Infinity, got = false, w = 0
  for (let r = 0; r < 3; r++) {
    work = 0
    const t0 = performance.now()
    got = solve(n, pre)
    best = Math.min(best, performance.now() - t0)
    w = work
  }
  console.log(`  ${name.padEnd(18)} ${got}, ${w} lần nhìn cạnh${extra()}, ${best.toFixed(1)} ms`)
}

// Chuỗi 2 000 môn, môn i cần môn i+1: mỗi lượt quét chỉ học thêm được đúng một môn.
const N = 2000
const reversedChain = []
for (let i = 0; i + 1 < N; i++) reversedChain.push([i, i + 1])
console.log(`chuỗi ${N} môn, môn i cần môn i+1:`)
measure("canFinishScan", canFinishScan, N, reversedChain, () => `, ${passes} lượt quét`)
measure("canFinishKahn", canFinishKahn, N, reversedChain)
measure("canFinishDfs", canFinishDfs, N, reversedChain)
measure("canFinishDfsStack", canFinishDfsStack, N, reversedChain)

// 2 000 môn, 5 000 cặp không vòng: xếp môn theo một hoán vị ngẫu nhiên, chỉ cho môn sau cần môn trước.
const perm = Array.from({ length: N }, (_, i) => i)
for (let i = N - 1; i > 0; i--) {
  const j = rand(i + 1)
  ;[perm[i], perm[j]] = [perm[j], perm[i]]
}
const dagSeen = new Set()
const dag = []
while (dag.length < 5000) {
  const x = rand(N), y = rand(N)
  if (x === y) continue
  const lo = Math.min(x, y), hi = Math.max(x, y)
  if (dagSeen.has(lo * N + hi)) continue
  dagSeen.add(lo * N + hi)
  dag.push([perm[hi], perm[lo]])
}
console.log(`ngẫu nhiên ${N} môn, 5000 cặp, không vòng:`)
measure("canFinishScan", canFinishScan, N, dag, () => `, ${passes} lượt quét`)
measure("canFinishKahn", canFinishKahn, N, dag)
measure("canFinishDfs", canFinishDfs, N, dag)
measure("canFinishDfsStack", canFinishDfsStack, N, dag)

// Đệ quy sâu: môn i+1 cần môn i, nên DFS từ môn 0 đi một mạch hết chuỗi.
console.log("đệ quy sâu, chuỗi môn i+1 cần môn i:")
for (const len of [2000, 100000]) {
  const chain = []
  for (let i = 0; i + 1 < len; i++) chain.push([i + 1, i])
  const parts = []
  for (const [name, solve] of [["canFinishDfs", canFinishDfs], ["canFinishDfsStack", canFinishDfsStack], ["canFinishKahn", canFinishKahn]]) {
    try {
      parts.push(`${name} ${solve(len, chain)}`)
    } catch (e) {
      parts.push(`${name} lỗi ${e.name} (tràn ngăn xếp)`)
    }
  }
  console.log(`  ${len} môn: ${parts.join("; ")}`)
}
