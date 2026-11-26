const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]


function perWord(board, words) {
  const rows = board.length
  const cols = board[0].length
  const found = []
  let advances = 0

  function match(row, col, word, index) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false
    if (board[row][col] !== word[index]) return false
    advances++
    if (index + 1 === word.length) return true

    const letter = board[row][col]
    board[row][col] = "#"
    const hit = directions.some(([dr, dc]) => match(row + dr, col + dc, word, index + 1))
    board[row][col] = letter
    return hit
  }

  for (const word of words) {
    if (board.some((line, row) => line.some((_, col) => match(row, col, word, 0)))) {
      found.push(word)
    }
  }
  return { found, advances }
}

function withTrie(board, words) {
  const root = { children: new Map() }
  for (const word of words) {
    let node = root
    for (const letter of word) {
      let child = node.children.get(letter)
      if (!child) {
        child = { children: new Map() }
        node.children.set(letter, child)
      }
      node = child
    }
    node.word = word
  }

  const rows = board.length
  const cols = board[0].length
  const found = []
  let advances = 0

  function visit(row, col, parent) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return
    const letter = board[row][col]
    const node = parent.children.get(letter)
    if (!node) return
    advances++

    if (node.word !== undefined) {
      found.push(node.word)
      delete node.word
    }
    board[row][col] = "#"
    for (const [dr, dc] of directions) {
      if (!node.children.size) break
      visit(row + dr, col + dc, node)
    }
    board[row][col] = letter
    if (!node.children.size) parent.children.delete(letter)
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) visit(row, col, root)
  }
  return { found, advances }
}

const cases = [
  [["car", "tpx", "xex"], ["cap", "cape", "car", "cart", "capa", "cat"], ["cap", "cape", "car"]],
  [["aaa"], ["a", "aa", "aaa", "aaaa"], ["a", "aa", "aaa"]],
  [["ax", "xb"], ["ab", "axb", "axxb"], ["axb"]],
  [["z"], ["a", "z", "zz"], ["z"]],
  [["yx", "xy"], ["aaa", "zzz"], []],
]

for (const [rows, words, expected] of cases) {
  const board = rows.map(row => [...row])
  for (const search of [perWord, withTrie]) {
    const { found } = search(board, words)
    if (found.sort().join(",") !== expected.join(",")) throw new Error("Sai kết quả")
    if (board.map(row => row.join("")).join(",") !== rows.join(",")) {
      throw new Error("Bảng chữ đã thay đổi")
    }
  }
}

const board = Array.from({ length: 3 }, () => [..."aaa"])
const words = [..."bcdefghijk"].map(last => "aaaaa" + last)
const left = perWord(board, words)
const right = withTrie(board, words)
if (left.found.length || right.found.length || !right.advances || left.advances !== 10 * right.advances) {
  throw new Error("Sai số bước khớp")
}
console.log((cases.length + 1) + "/" + (cases.length + 1) + " ca đúng")
console.log("Bước khớp: " + left.advances + " / " + right.advances)
