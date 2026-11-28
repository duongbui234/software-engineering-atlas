// Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
// Chạy: node search.ts

type Board = string[][]

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]
let calls = 0

// Cách 1: DFS với một bảng visited riêng.
function existVisited(board: Board, word: string): boolean {
    const rows = board.length, cols = board[0].length
    const visited = board.map((row) => row.map(() => false))
    function dfs(r: number, c: number, k: number): boolean {
        calls++
        if (k === word.length) return true
        if (r < 0 || c < 0 || r >= rows || c >= cols) return false
        if (visited[r][c] || board[r][c] !== word[k]) return false
        visited[r][c] = true
        for (const [dr, dc] of DIRS) {
            if (dfs(r + dr, c + dc, k + 1)) {
                visited[r][c] = false
                return true
            }
        }
        visited[r][c] = false
        return false
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true
        }
    }
    return false
}

// Cách 2: đánh dấu ngay trên lưới bằng '#', trả lại chữ cũ khi quay lui.
function existInPlace(board: Board, word: string): boolean {
    const rows = board.length, cols = board[0].length
    function dfs(r: number, c: number, k: number): boolean {
        calls++
        if (k === word.length) return true
        if (r < 0 || c < 0 || r >= rows || c >= cols) return false
        if (board[r][c] !== word[k]) return false
        const saved = board[r][c]
        board[r][c] = '#'
        let found = false
        for (const [dr, dc] of DIRS) {
            if (dfs(r + dr, c + dc, k + 1)) {
                found = true
                break
            }
        }
        board[r][c] = saved
        return found
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true
        }
    }
    return false
}

// Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
function existPruned(board: Board, word: string): boolean {
    const have = new Map<string, number>()
    for (const row of board) for (const ch of row) have.set(ch, (have.get(ch) ?? 0) + 1)
    const need = new Map<string, number>()
    for (const ch of word) need.set(ch, (need.get(ch) ?? 0) + 1)
    for (const [ch, n] of need) {
        if ((have.get(ch) ?? 0) < n) return false
    }
    const first = word[0], last = word[word.length - 1]
    if ((have.get(last) ?? 0) < (have.get(first) ?? 0)) {
        word = [...word].reverse().join('')
    }
    return existInPlace(board, word)
}

// Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
function bruteForce(board: Board, word: string): boolean {
    const rows = board.length, cols = board[0].length
    const used = board.map((row) => row.map(() => false))
    let hit = false
    function walk(r: number, c: number, text: string) {
        if (hit) return
        const next = text + board[r][c]
        if (next.length === word.length) {
            if (next === word) hit = true
            return
        }
        used[r][c] = true
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && !used[nr][nc]) walk(nr, nc, next)
        }
        used[r][c] = false
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) walk(r, c, '')
    return hit
}

const clone = (b: Board): Board => b.map((row) => [...row])
const same = (a: Board, b: Board) => a.every((row, r) => row.every((ch, c) => ch === b[r][c]))

const grid: Board = [['c', 'a', 't'], ['o', 'd', 's'], ['g', 'e', 'n']]
const cases: [Board, string, boolean][] = [
    [grid, 'cat', true],
    [grid, 'cod', true],
    [grid, 'dog', true],
    [grid, 'cats', true],
    [grid, 'neds', true],
    [grid, 'tact', false],
    [grid, 'cab', false],
    [[['z']], 'z', true],
    [[['z']], 'zz', false],
    [[['a', 'b'], ['b', 'a']], 'abab', true],
    [[['a', 'b'], ['b', 'a']], 'abaa', false],
    [[['a', 'b']], 'aba', false],
]

let ok = 0
for (const [board, word, want] of cases) {
    const b1 = clone(board), b2 = clone(board), b3 = clone(board)
    const got = [existVisited(b1, word), existInPlace(b2, word), existPruned(b3, word), bruteForce(board, word)]
    if (got.every((g) => g === want) && same(b2, board) && same(b3, board)) ok++
    else console.log('sai ở', JSON.stringify(board), word, got)
}
console.log(`${ok}/${cases.length} ca đúng`)

// Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
const words: string[] = []
for (let len = 1; len <= 4; len++) {
    for (let mask = 0; mask < 1 << len; mask++) {
        let w = ''
        for (let i = 0; i < len; i++) w += (mask >> i) & 1 ? 'b' : 'a'
        words.push(w)
    }
}
let total = 0, agree = 0
for (const cols of [2, 3]) {
    const cells = 2 * cols
    for (let mask = 0; mask < 1 << cells; mask++) {
        const board: Board = [[], []]
        for (let i = 0; i < cells; i++) board[Math.floor(i / cols)].push((mask >> i) & 1 ? 'b' : 'a')
        for (const w of words) {
            total++
            const want = bruteForce(board, w)
            const b2 = clone(board), b3 = clone(board)
            if (existVisited(clone(board), w) === want && existInPlace(b2, w) === want &&
                existPruned(b3, w) === want && same(b2, board) && same(b3, board)) agree++
        }
    }
}
console.log(`${agree}/${total} ca đúng (đối chiếu liệt kê mọi đường đi)`)

// Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
const trap: Board = Array.from({ length: 4 }, () => Array(4).fill('a'))
trap[3][3] = 'b'
trap[2][3] = 'c'
trap[3][2] = 'c'
calls = 0
existInPlace(clone(trap), 'aaaaaaab')
const plain = calls
calls = 0
existPruned(clone(trap), 'aaaaaaab')
console.log(`Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh ${plain} lượt gọi, đảo từ ${calls} lượt gọi`)
