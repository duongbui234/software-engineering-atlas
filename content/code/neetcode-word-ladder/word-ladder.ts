// LC 127 Word Ladder: BFS trên đồ thị ẩn, năm ngôn ngữ cùng một bộ ca.
// Chạy: node word-ladder.ts

let expanded = 0 // số từ đã lấy ra để tìm hàng xóm, dùng cho phép đo

function differByOne(a: string, b: string): boolean {
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i] && ++diff > 1) return false
  }
  return diff === 1
}

// Cách 1: BFS, tìm hàng xóm bằng cách so với từng từ chưa thăm. O(n²·L).
function ladderPairwise(begin: string, end: string, wordList: string[]): number {
  if (!wordList.includes(end)) return 0
  const seen = new Set([begin])
  let level = [begin]
  for (let words = 1; level.length > 0; words++) {
    const next: string[] = []
    for (const word of level) {
      expanded++
      if (word === end) return words
      for (const candidate of wordList) {
        if (!seen.has(candidate) && differByOne(word, candidate)) {
          seen.add(candidate) // đánh dấu lúc đưa vào
          next.push(candidate)
        }
      }
    }
    level = next
  }
  return 0
}

// Cách 2: BFS, sinh hàng xóm bằng cách đổi từng chữ thành a..z. O(n·L·26).
function ladderLetters(begin: string, end: string, wordList: string[]): number {
  const unseen = new Set(wordList)
  if (!unseen.has(end)) return 0
  unseen.delete(begin)
  const queue = [begin]
  const dist = new Map([[begin, 1]])
  for (let head = 0; head < queue.length; head++) {
    const word = queue[head]
    expanded++
    const d = dist.get(word)!
    if (word === end) return d
    const chars = word.split("")
    for (let i = 0; i < chars.length; i++) {
      const original = chars[i]
      for (let c = 97; c <= 122; c++) {
        chars[i] = String.fromCharCode(c)
        const candidate = chars.join("")
        if (unseen.has(candidate)) {
          unseen.delete(candidate)
          dist.set(candidate, d + 1)
          queue.push(candidate)
        }
      }
      chars[i] = original
    }
  }
  return 0
}

// Cách 3: gom từ theo mẫu có dấu *, ví dụ "c*ld" chứa cold và cald.
function ladderBuckets(begin: string, end: string, wordList: string[]): number {
  if (!wordList.includes(end)) return 0
  const buckets = new Map<string, string[]>()
  for (const word of wordList) {
    for (let i = 0; i < word.length; i++) {
      const key = word.slice(0, i) + "*" + word.slice(i + 1)
      if (!buckets.has(key)) buckets.set(key, [])
      buckets.get(key)!.push(word)
    }
  }
  const seen = new Set([begin])
  let level = [begin]
  for (let words = 1; level.length > 0; words++) {
    const next: string[] = []
    for (const word of level) {
      expanded++
      if (word === end) return words
      for (let i = 0; i < word.length; i++) {
        const key = word.slice(0, i) + "*" + word.slice(i + 1)
        for (const candidate of buckets.get(key) ?? []) {
          if (!seen.has(candidate)) {
            seen.add(candidate)
            next.push(candidate)
          }
        }
        buckets.delete(key) // một xô chỉ cần mở một lần
      }
    }
    level = next
  }
  return 0
}

// Cách 4: BFS hai đầu, luôn nới bên có tầng nhỏ hơn.
function ladderBidirectional(begin: string, end: string, wordList: string[]): number {
  const unseen = new Set(wordList)
  if (!unseen.has(end)) return 0
  unseen.delete(begin)
  unseen.delete(end)
  // mỗi phía: một mảng giữ thứ tự duyệt, một Set để hỏi "có trong tầng này không"
  let front = [begin], frontSet = new Set(front)
  let back = [end], backSet = new Set(back)
  for (let words = 2; front.length > 0 && back.length > 0; words++) {
    if (front.length > back.length) {
      [front, back] = [back, front];
      [frontSet, backSet] = [backSet, frontSet]
    }
    const next: string[] = []
    for (const word of front) {
      expanded++
      const chars = word.split("")
      for (let i = 0; i < chars.length; i++) {
        const original = chars[i]
        for (let c = 97; c <= 122; c++) {
          chars[i] = String.fromCharCode(c)
          const candidate = chars.join("")
          if (backSet.has(candidate)) return words // hai phía gặp nhau
          if (unseen.has(candidate)) {
            unseen.delete(candidate)
            next.push(candidate)
          }
        }
        chars[i] = original
      }
    }
    front = next
    frontSet = new Set(next)
  }
  return 0
}

// SAI: DFS trả độ dài đường đầu tiên tìm thấy, không phải đường ngắn nhất.
function wrongDfsFirstPath(begin: string, end: string, wordList: string[]): number {
  const unseen = new Set(wordList)
  if (!unseen.has(end)) return 0
  unseen.delete(begin)
  function dfs(word: string, words: number): number {
    if (word === end) return words
    const chars = word.split("")
    for (let i = 0; i < chars.length; i++) {
      const original = chars[i]
      for (let c = 97; c <= 122; c++) {
        chars[i] = String.fromCharCode(c)
        const candidate = chars.join("")
        if (unseen.has(candidate)) {
          unseen.delete(candidate)
          const found = dfs(candidate, words + 1)
          if (found) return found
        }
      }
      chars[i] = original
    }
    return 0
  }
  return dfs(begin, 1)
}

// SAI: đếm số bước (cạnh) thay vì số từ.
function wrongCountEdges(begin: string, end: string, wordList: string[]): number {
  const words = ladderLetters(begin, end, wordList)
  return words === 0 ? 0 : words - 1
}

// SAI: thấy endWord cách một chữ là trả về ngay, quên kiểm endWord có trong danh sách.
function wrongSkipEndCheck(begin: string, end: string, wordList: string[]): number {
  const unseen = new Set(wordList)
  unseen.delete(begin)
  let level = [begin]
  for (let words = 1; level.length > 0; words++) {
    const next: string[] = []
    for (const word of level) {
      if (differByOne(word, end)) return words + 1
      for (const candidate of unseen) {
        if (differByOne(word, candidate)) {
          unseen.delete(candidate)
          next.push(candidate)
        }
      }
    }
    level = next
  }
  return 0
}

type Case = { name: string; begin: string; end: string; list: string[]; want: number }
const cases: Case[] = [
  { name: "cold → warm", begin: "cold", end: "warm", list: ["cord", "card", "ward", "warm", "corm", "worm", "word"], want: 5 },
  { name: "cat → dog", begin: "cat", end: "dog", list: ["cot", "cog", "dog", "bat"], want: 4 },
  { name: "đích không có trong danh sách", begin: "cat", end: "dog", list: ["cot", "cog"], want: 0 },
  { name: "không có đường", begin: "aaa", end: "bbb", list: ["bbb", "abc"], want: 0 },
  { name: "một bước", begin: "ab", end: "cb", list: ["cb"], want: 2 },
  { name: "từ đầu nằm trong danh sách", begin: "pen", end: "pin", list: ["pen", "pin"], want: 2 },
  { name: "từ một chữ", begin: "a", end: "c", list: ["a", "b", "c"], want: 2 },
  { name: "DFS đi vòng", begin: "aa", end: "bb", list: ["ca", "cb", "bb", "ab"], want: 3 },
]

const solvers: [string, (b: string, e: string, l: string[]) => number][] = [
  ["ladderPairwise", ladderPairwise],
  ["ladderLetters", ladderLetters],
  ["ladderBuckets", ladderBuckets],
  ["ladderBidirectional", ladderBidirectional],
  ["wrongDfsFirstPath", wrongDfsFirstPath],
  ["wrongCountEdges", wrongCountEdges],
  ["wrongSkipEndCheck", wrongSkipEndCheck],
]

for (const [name, solve] of solvers) {
  const wrong: string[] = []
  for (const c of cases) {
    const got = solve(c.begin, c.end, [...c.list])
    if (got !== c.want) wrong.push(`${c.name} → ${got}`)
  }
  const ok = cases.length - wrong.length
  console.log(`${name.padEnd(20)} ${ok}/${cases.length} ca đúng${wrong.length ? "; sai ở " + wrong.join(", ") : ""}`)
}

// Đối chiếu ngẫu nhiên: bốn cách đúng phải ra cùng đáp án.
let seed = 42
function rand(n: number): number {
  seed = (seed * 48271) % 2147483647 // Park–Miller: tích luôn nhỏ hơn 2^53
  return seed % n
}
function randomWord(len: number, alphabet: number): string {
  let s = ""
  for (let i = 0; i < len; i++) s += String.fromCharCode(97 + rand(alphabet))
  return s
}
let agree = 0
const trials = 2000
for (let t = 0; t < trials; t++) {
  const len = 2 + rand(3)
  const set = new Set<string>()
  const size = 1 + rand(Math.min(30, 3 ** len))
  while (set.size < size) set.add(randomWord(len, 3))
  const list = [...set]
  const begin = randomWord(len, 3)
  const end = list[rand(list.length)]
  if (begin === end) { agree++; continue }
  const answers = [ladderPairwise, ladderLetters, ladderBuckets, ladderBidirectional].map(f => f(begin, end, [...list]))
  if (answers.every(a => a === answers[0])) agree++
}
console.log(`ngẫu nhiên: ${agree}/${trials} bộ từ điển, bốn cách khớp nhau`)

// Phép đo trên hai từ điển 5000 từ dài 6:
// "dày": từ ngẫu nhiên trên chữ a..e, mỗi từ có nhiều hàng xóm;
// "thưa": từ sinh dần trên chữ a..z, mỗi từ mới đổi một chữ của một từ có sẵn.
function makeDict(kind: "dày" | "thưa"): string[] {
  seed = 7
  const set = new Set<string>()
  if (kind === "dày") {
    while (set.size < 5000) set.add(randomWord(6, 5))
    return [...set]
  }
  const list = [randomWord(6, 26)]
  set.add(list[0])
  while (list.length < 5000) {
    const chars = list[rand(list.length)].split("")
    const pos = rand(6) // gọi rand theo thứ tự cố định ở mọi ngôn ngữ
    chars[pos] = String.fromCharCode(97 + rand(26))
    const word = chars.join("")
    if (!set.has(word)) { set.add(word); list.push(word) }
  }
  return list
}

// Đích: từ xa nhất tính từ list[0], để mọi cách phải đi hết đồ thị.
function farthest(list: string[]): string {
  const begin = list[0]
  const unseen = new Set(list)
  unseen.delete(begin)
  let level = [begin], last = begin
  while (level.length) {
    last = level[level.length - 1]
    const next: string[] = []
    for (const w of level) {
      for (let i = 0; i < w.length; i++) {
        for (let c = 97; c <= 122; c++) {
          const candidate = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1)
          if (unseen.has(candidate)) { unseen.delete(candidate); next.push(candidate) }
        }
      }
    }
    level = next
  }
  return last
}

function bench(kind: "dày" | "thưa") {
  const list = makeDict(kind)
  const begin = list[0], end = farthest(list)
  console.log(`từ điển ${kind}, 5000 từ: ${begin} → ${end}`)
  for (const [name, solve] of solvers.slice(0, 4)) {
    expanded = 0
    const t0 = performance.now()
    const ans = solve(begin, end, list)
    const ms = performance.now() - t0
    console.log(`  ${name.padEnd(20)} đáp án ${ans}, lấy ra ${expanded} từ, ${ms.toFixed(1)} ms`)
  }
}
bench("dày")
bench("thưa")

// Bẫy đánh dấu lúc lấy ra: đáp án vẫn đúng nhưng hàng đợi phình to.
function pushesMarkOnDequeue(begin: string, end: string, wordList: string[]): [number, number] {
  const dict = new Set(wordList)
  const visited = new Set<string>()
  const queue: [string, number][] = [[begin, 1]]
  let pushes = 1
  for (let head = 0; head < queue.length; head++) {
    const [word, d] = queue[head]
    if (visited.has(word)) continue
    visited.add(word) // đánh dấu muộn: lúc lấy ra
    if (word === end) return [d, pushes]
    const chars = word.split("")
    for (let i = 0; i < chars.length; i++) {
      const original = chars[i]
      for (let c = 97; c <= 122; c++) {
        chars[i] = String.fromCharCode(c)
        const candidate = chars.join("")
        if (dict.has(candidate) && !visited.has(candidate)) { queue.push([candidate, d + 1]); pushes++ }
      }
      chars[i] = original
    }
  }
  return [0, pushes]
}
{
  const list = makeDict("dày")
  const end = farthest(list)
  const [ans, pushes] = pushesMarkOnDequeue(list[0], end, list)
  const good = ladderLetters(list[0], end, list)
  console.log(`từ điển dày, đánh dấu lúc lấy ra: đáp án ${ans}, ${pushes} lượt đưa vào hàng đợi; đánh dấu lúc đưa vào: đáp án ${good}, tối đa 5000 lượt`)
}

// Bẫy riêng của JS/TS: dựng từ ứng viên bằng split/join chậm hơn ghép slice.
{
  const list = makeDict("dày")
  const set = new Set(list)
  const joinWay = () => {
    let hits = 0
    for (const w of list) {
      const chars = w.split("")
      for (let i = 0; i < chars.length; i++) {
        const original = chars[i]
        for (let c = 97; c <= 122; c++) {
          chars[i] = String.fromCharCode(c)
          if (set.has(chars.join(""))) hits++
        }
        chars[i] = original
      }
    }
    return hits
  }
  const sliceWay = () => {
    let hits = 0
    for (const w of list) {
      for (let i = 0; i < w.length; i++) {
        const prefix = w.slice(0, i), suffix = w.slice(i + 1)
        for (let c = 97; c <= 122; c++) {
          if (set.has(prefix + String.fromCharCode(c) + suffix)) hits++
        }
      }
    }
    return hits
  }
  joinWay(); sliceWay() // chạy nháp một lần cho JIT
  let t0 = performance.now()
  const a = joinWay()
  const joinMs = performance.now() - t0
  t0 = performance.now()
  const b = sliceWay()
  const sliceMs = performance.now() - t0
  console.log(`sinh ${5000 * 6 * 26} từ ứng viên (${a} = ${b} lần trúng): split/join ${joinMs.toFixed(1)} ms, ghép slice ${sliceMs.toFixed(1)} ms`)
}
