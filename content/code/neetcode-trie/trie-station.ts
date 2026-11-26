type TrieNode = { children: Map<string, TrieNode>; word: string | null }
const makeNode = (): TrieNode => ({ children: new Map(), word: null })

function insert(root: TrieNode, word: string) {
  let node = root
  for (const letter of word) {
    let child = node.children.get(letter)
    if (!child) {
      child = makeNode()
      node.children.set(letter, child)
    }
    node = child
  }
  node.word = word
}

function walk(root: TrieNode, text: string): TrieNode | undefined {
  let node = root
  for (const letter of text) {
    const child = node.children.get(letter)
    if (!child) return undefined
    node = child
  }
  return node
}

function matches(node: TrieNode, pattern: string, i = 0): boolean {
  if (i === pattern.length) return node.word !== null
  if (pattern[i] === ".") {
    for (const child of node.children.values()) {
      if (matches(child, pattern, i + 1)) return true
    }
    return false
  }
  const child = node.children.get(pattern[i])
  return child !== undefined && matches(child, pattern, i + 1)
}

function findWords(board: string[][], words: string[]): string[] {
  const root = makeNode()
  for (const word of words) insert(root, word)
  const found = new Set<string>()
  function visit(row: number, col: number, parent: TrieNode) {
    const letter = board[row]?.[col]
    if (letter === undefined || letter === "#") return
    const node = parent.children.get(letter)
    if (!node) return
    if (node.word !== null) found.add(node.word)
    board[row][col] = "#"
    visit(row - 1, col, node)
    visit(row + 1, col, node)
    visit(row, col - 1, node)
    visit(row, col + 1, node)
    board[row][col] = letter
  }
  board.forEach((row, r) => row.forEach((_, c) => visit(r, c, root)))
  return [...found].sort()
}

const root = makeNode()
for (const word of ["cart", "cat", "dog"]) insert(root, word)
const board = [["c", "a", "t"], ["d", "r", "e"]]
const cases = [
  walk(root, "car") !== undefined,
  walk(root, "car")?.word === null,
  walk(root, "cart")?.word === "cart",
  walk(root, "cab") === undefined,
  matches(root, "ca."),
  matches(root, "c..t"),
  matches(root, ".og"),
  !matches(root, "c.t."),
  !matches(root, "do"),
  findWords(board, ["car", "care", "cat", "cart", "cata"]).join(",") === "car,care,cat",
  board.map(row => row.join("")).join(",") === "cat,dre",
  findWords([["a", "a"]], ["a", "aa", "aaa"]).join(",") === "a,aa",
]
insert(root, "car")
cases.push(walk(root, "car")?.word === "car" && walk(root, "cart")?.word === "cart")
if (!cases.every(Boolean)) throw new Error("Có ca sai")
console.log(`${cases.length}/${cases.length} ca đúng`)
