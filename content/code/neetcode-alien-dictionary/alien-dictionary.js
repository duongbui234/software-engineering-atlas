// LC 269 Alien Dictionary: rút thứ tự chữ cái từ một danh sách từ đã xếp sẵn.
// Chạy: node alien-dictionary.js
const A = 97 // mã của chữ 'a'
const code = (ch) => ch.charCodeAt(0) - A
const chr = (i) => String.fromCharCode(A + i)

// Bước chung: so từng cặp từ KỀ NHAU, lấy chữ khác ĐẦU TIÊN làm một cạnh u → v.
// Trả null khi danh sách tự mâu thuẫn: một từ đứng trước phần đầu của chính nó.
function buildGraph(words) {
  const present = Array(26).fill(false)
  for (const w of words) for (const ch of w) present[code(ch)] = true // chữ nào có mặt cũng phải ra
  const adj = Array.from({ length: 26 }, () => Array(26).fill(false))
  const indeg = Array(26).fill(0)
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i]
    const b = words[i + 1]
    const len = Math.min(a.length, b.length)
    let j = 0
    while (j < len && a[j] === b[j]) j++
    if (j === len) {
      if (a.length > b.length) return null // "abc" đứng trước "ab": danh bạ sai
      continue // "ab" trước "abc": hợp lệ, không có manh mối
    }
    const u = code(a[j])
    const v = code(b[j])
    if (!adj[u][v]) {
      adj[u][v] = true
      indeg[v]++ // cạnh trùng chỉ đếm một lần
    }
  }
  return { present, adj, indeg }
}

// Kahn trên một đồ thị đã dựng: chữ nào không còn chữ nào phải đứng trước (bậc vào 0) thì viết ra.
function kahnOrder(g) {
  const indeg = g.indeg.slice()
  const queue = []
  for (let c = 0; c < 26; c++) if (g.present[c] && indeg[c] === 0) queue.push(c)
  let out = ""
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head]
    out += chr(u)
    for (let v = 0; v < 26; v++) {
      if (g.adj[u][v] && --indeg[v] === 0) queue.push(v)
    }
  }
  const total = g.present.filter(Boolean).length
  return out.length === total ? out : "" // thiếu chữ nghĩa là có vòng
}

// Cách 2: dựng đồ thị rồi chạy Kahn.
function alienOrderKahn(words) {
  const g = buildGraph(words)
  return g ? kahnOrder(g) : ""
}

// Cách 3: DFS ba màu. Trắng = chưa thăm, xám = đang trên đường đi, đen = xong.
function alienOrderDfs(words) {
  const g = buildGraph(words)
  if (!g) return ""
  const [WHITE, GRAY, BLACK] = [0, 1, 2]
  const color = Array(26).fill(WHITE)
  const post = []
  const visit = (u) => {
    color[u] = GRAY
    for (let v = 0; v < 26; v++) {
      if (!g.adj[u][v]) continue
      if (color[v] === GRAY) return false // quay về một chữ đang trên đường: có vòng
      if (color[v] === WHITE && !visit(v)) return false
    }
    color[u] = BLACK
    post.push(u) // u xong sau mọi chữ phải đứng sau nó
    return true
  }
  for (let u = 0; u < 26; u++) {
    if (g.present[u] && color[u] === WHITE && !visit(u)) return ""
  }
  return post.reverse().map(chr).join("")
}

// Biến thể LintCode 892: nhiều đáp án thì trả chuỗi nhỏ nhất theo a..z.
// Mỗi lượt lấy chữ NHỎ NHẤT đang sẵn sàng. Chỉ có 26 chữ nên quét 26 ô thay cho một min-heap.
function alienOrderSmallest(words) {
  const g = buildGraph(words)
  if (!g) return ""
  const indeg = g.indeg.slice()
  const done = Array(26).fill(false)
  const total = g.present.filter(Boolean).length
  let out = ""
  while (out.length < total) {
    let pick = -1
    for (let c = 0; c < 26; c++) {
      if (g.present[c] && !done[c] && indeg[c] === 0) {
        pick = c
        break
      }
    }
    if (pick === -1) return "" // còn chữ mà không chữ nào sẵn sàng: có vòng
    done[pick] = true
    out += chr(pick)
    for (let v = 0; v < 26; v++) if (g.adj[pick][v]) indeg[v]--
  }
  return out
}

// Kiểm tra: danh sách có thật sự xếp đúng theo bảng chữ `rank` không?
function isSorted(words, rank) {
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i]
    const b = words[i + 1]
    const len = Math.min(a.length, b.length)
    let j = 0
    while (j < len && a[j] === b[j]) j++
    if (j === len) {
      if (a.length > b.length) return false
      continue
    }
    if (rank[code(a[j])] > rank[code(b[j])]) return false
  }
  return true
}

function lettersOf(words) {
  const seen = Array(26).fill(false)
  for (const w of words) for (const ch of w) seen[code(ch)] = true
  let s = ""
  for (let c = 0; c < 26; c++) if (seen[c]) s += chr(c)
  return s
}

// Cách 1: vét cạn. Thử mọi hoán vị theo thứ tự từ điển, dừng ở hoán vị đầu tiên hợp lệ.
let tried = 0

function alienOrderBrute(words) {
  const letters = lettersOf(words)
  const rank = Array(26).fill(0)
  const used = Array(letters.length).fill(false)
  const perm = []
  const go = () => {
    if (perm.length === letters.length) {
      tried++
      perm.forEach((ch, i) => (rank[code(ch)] = i))
      return isSorted(words, rank)
    }
    for (let i = 0; i < letters.length; i++) {
      if (used[i]) continue
      used[i] = true
      perm.push(letters[i])
      if (go()) return true
      used[i] = false
      perm.pop()
    }
    return false
  }
  return go() ? perm.join("") : ""
}

// Một đáp án đúng khi: danh sách hợp lệ thì chuỗi chứa đủ mỗi chữ một lần và xếp đúng danh sách;
// danh sách mâu thuẫn thì chuỗi rỗng. LeetCode nhận MỌI thứ tự hợp lệ, nên không so với một chuỗi cố định.
function isValidAnswer(words, answer, expectValid) {
  if (!expectValid) return answer === ""
  if (answer.length !== lettersOf(words).length) return false
  if ([...answer].sort().join("") !== lettersOf(words)) return false
  const rank = Array(26).fill(0)
  ;[...answer].forEach((ch, i) => (rank[code(ch)] = i))
  return isSorted(words, rank)
}

const cases = [
  [["bcae", "bcd", "cb", "cab", "ad"], true], // ví dụ trong bài
  [["zx"], true], // một từ: không có manh mối nào, thứ tự nào cũng được
  [["abc", "ab"], false], // từ dài đứng trước phần đầu của nó
  [["a", "b", "a"], false], // a trước b và b trước a: vòng
  [["ab", "ab"], true], // hai từ giống nhau
  [["ab", "abc"], true], // phần đầu đứng trước: hợp lệ
  [["ac", "ab", "zc", "zb"], true], // cạnh c → b xuất hiện hai lần
  [["ab", "ba"], true], // chỉ chữ khác ĐẦU TIÊN mới là manh mối
]

let ok = 0
cases.forEach(([words, expectValid], i) => {
  tried = 0
  const kahn = alienOrderKahn(words)
  const dfs = alienOrderDfs(words)
  const small = alienOrderSmallest(words)
  const brute = alienOrderBrute(words)
  const good =
    [kahn, dfs, small, brute].every((ans) => isValidAnswer(words, ans, expectValid)) &&
    small === brute
  if (good) ok++
  const show = (s) => (s === "" ? '""' : s)
  console.log(
    `ca ${i + 1} [${words.join(" ")}]: Kahn ${show(kahn)}, DFS ${show(dfs)}, nhỏ nhất ${show(small)}, vét cạn ${show(brute)} (${tried} hoán vị) ${good ? "đúng" : "SAI"}`,
  )
})
console.log(`${ok}/${cases.length} ca đúng`)

// Bản sai: mỗi bản sửa đúng một chỗ của buildGraph rồi vẫn chạy kahnOrder.
function buildGraphBuggy(words, bug) {
  const present = Array(26).fill(false)
  for (const w of words) for (const ch of w) present[code(ch)] = true
  const adj = Array.from({ length: 26 }, () => Array(26).fill(false))
  const indeg = Array(26).fill(0)
  for (let i = 0; i + 1 < words.length; i++) {
    const a = words[i]
    const b = words[i + 1]
    const len = Math.min(a.length, b.length)
    let j = 0
    while (j < len && a[j] === b[j]) j++
    if (j === len) {
      if (a.length > b.length && bug !== "noPrefix") return null // noPrefix: quên kiểm tra
      continue
    }
    for (; j < len; j++) {
      if (a[j] === b[j]) continue
      const u = code(a[j])
      const v = code(b[j])
      if (bug === "dupIndeg") indeg[v]++ // dupIndeg: đếm cả cạnh trùng
      if (!adj[u][v]) {
        adj[u][v] = true
        if (bug !== "dupIndeg") indeg[v]++
      }
      if (bug !== "allDiffs") break // allDiffs: lấy MỌI chữ khác làm manh mối
    }
  }
  if (bug === "edgeLettersOnly") {
    // edgeLettersOnly: chỉ tính những chữ có mặt trong một cạnh nào đó
    for (let c = 0; c < 26; c++) present[c] = adj[c].some(Boolean) || adj.some((row) => row[c])
  }
  return { present, adj, indeg }
}

for (const bug of ["allDiffs", "noPrefix", "edgeLettersOnly", "dupIndeg"]) {
  const wrong = (w) => {
    const g = buildGraphBuggy(w, bug)
    return g ? kahnOrder(g) : ""
  }
  const right = cases.filter(([w, v]) => isValidAnswer(w, wrong(w), v)).length
  console.log(`bản sai ${bug}: đúng ${right}/${cases.length} ca`)
}

// Đối chiếu ngẫu nhiên: 2 000 danh sách nhỏ, một nửa xếp theo một bảng chữ ngẫu nhiên.
let seed = 2026

function rnd(n) {
  seed ^= seed << 13
  seed >>>= 0
  seed ^= seed >>> 17
  seed ^= seed << 5
  seed >>>= 0
  return seed % n
}

function compareBy(rank) {
  return (a, b) => {
    const len = Math.min(a.length, b.length)
    for (let j = 0; j < len; j++) if (a[j] !== b[j]) return rank[code(a[j])] - rank[code(b[j])]
    return a.length - b.length
  }
}

let agree = 0,
  validCount = 0
const RUNS = 2000
for (let t = 0; t < RUNS; t++) {
  const k = 2 + rnd(5)
  const order = Array.from({ length: k }, (_, i) => i)
  for (let i = k - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const rank = Array(26).fill(0)
  order.forEach((c, i) => (rank[c] = i))
  const n = 1 + rnd(6)
  const words = []
  for (let i = 0; i < n; i++) {
    const len = 1 + rnd(4)
    let w = ""
    for (let j = 0; j < len; j++) w += chr(rnd(k))
    words.push(w)
  }
  if (rnd(2) === 0) words.sort(compareBy(rank))
  const brute = alienOrderBrute(words)
  const valid = brute !== ""
  if (valid) validCount++
  const answers = [alienOrderKahn(words), alienOrderDfs(words), alienOrderSmallest(words)]
  if (answers.every((ans) => isValidAnswer(words, ans, valid)) && answers[2] === brute) agree++
}
console.log(
  `đối chiếu ${RUNS} danh sách ngẫu nhiên (${validCount} hợp lệ): khớp vét cạn ${agree}/${RUNS}`,
)

// Đo: k chữ, 100 từ xếp theo bảng chữ ngược (k-1)..a, tức hoán vị cuối cùng vét cạn gặp.
for (const k of [7, 8, 9]) {
  let target = ""
  for (let c = k - 1; c >= 0; c--) target += chr(c)
  const rank = Array(26).fill(0)
  target.split("").forEach((ch, i) => (rank[code(ch)] = i))
  const words = []
  for (let i = 0; i < 100; i++) {
    const len = 1 + rnd(10)
    let w = ""
    for (let j = 0; j < len; j++) w += chr(rnd(k))
    words.push(w)
  }
  words.sort(compareBy(rank))
  tried = 0
  let t0 = performance.now()
  const brute = alienOrderBrute(words)
  const bruteMs = performance.now() - t0
  t0 = performance.now()
  let kahn = ""
  for (let r = 0; r < 1000; r++) kahn = alienOrderKahn(words)
  const kahnUs = performance.now() - t0 // tổng 1 000 lần (ms) = µs mỗi lần
  console.log(
    `đo ${k} chữ, 100 từ: vét cạn ra ${brute} sau ${tried} hoán vị, ${bruteMs.toFixed(1)} ms; Kahn ra ${kahn}, ${kahnUs.toFixed(1)} µs`,
  )
}
