// LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// Vét cạn: DFS từ mọi ô, không nhớ gì
function longestPathBrute(grid: number[][], counter = { calls: 0 }): number {
    const rows = grid.length, cols = grid[0].length
    const climb = (r: number, c: number): number => {
        counter.calls++
        let best = 1
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + climb(nr, nc))
            }
        }
        return best
    }
    let answer = 0
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) answer = Math.max(answer, climb(r, c))
    return answer
}

// DFS ghi nhớ: memo[ô] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
// Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng.
function longestPathMemo(grid: number[][], counter = { calls: 0 }): number {
    const rows = grid.length, cols = grid[0].length
    const memo = new Array(rows * cols).fill(0) // 0 = chưa tính, đáp án luôn ≥ 1
    const climb = (r: number, c: number): number => {
        counter.calls++
        const key = r * cols + c
        if (memo[key] !== 0) return memo[key]
        let best = 1
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + climb(nr, nc))
            }
        }
        memo[key] = best
        return best
    }
    let answer = 0
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) answer = Math.max(answer, climb(r, c))
    return answer
}

// Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
// Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy.
function longestIncreasingPath(grid: number[][]): number {
    const rows = grid.length, cols = grid[0].length
    const outDegree = new Array(rows * cols).fill(0) // số ô kề lớn hơn
    let layer: number[] = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] > grid[r][c]) {
                    outDegree[r * cols + c]++
                }
            }
            if (outDegree[r * cols + c] === 0) layer.push(r * cols + c)
        }
    }
    let layers = 0
    while (layer.length > 0) {
        layers++
        const next: number[] = []
        for (const cell of layer) {
            const r = Math.floor(cell / cols), c = cell % cols
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc
                // ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] < grid[r][c]) {
                    if (--outDegree[nr * cols + nc] === 0) next.push(nr * cols + nc)
                }
            }
        }
        layer = next
    }
    return layers
}

// ---------- kiểm tra ----------
function snake(n: number): number[][] {
    return Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) => r * n + (r % 2 === 0 ? c : n - 1 - c)))
}

// Hành lang: hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
// Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường.
function corridor(n: number): number[][] {
    const grid = Array.from({ length: n }, () => Array(n).fill(0))
    let value = 0
    for (let k = 0; 2 * k < n; k++) {
        const r = 2 * k
        for (let i = 0; i < n; i++) grid[r][k % 2 === 0 ? i : n - 1 - i] = ++value
        if (r + 2 < n) grid[r + 1][k % 2 === 0 ? n - 1 : 0] = ++value
    }
    return grid
}

const small: [number[][], number][] = [
    [[[1]], 1],
    [[[7, 7], [7, 7]], 1],
    [[[1, 2, 3], [6, 5, 4], [7, 8, 9]], 9],
    [[[5, 4], [2, 3]], 4],
    [[[1, 3, 2, 4, 5]], 3],
    [[[3], [2], [1]], 3],
    [[[0, 2147483647]], 2],
    [[[7, 8, 1], [6, 2, 3], [5, 4, 9]], 6],
]
const big: [number[][], number][] = [
    [Array.from({ length: 200 }, () => Array(200).fill(5)), 1],
    [snake(200), 40000],
    [corridor(200), 20100],
]
let ok = 0
for (const [grid, want] of small) {
    if (longestPathBrute(grid) === want && longestPathMemo(grid) === want && longestIncreasingPath(grid) === want) ok++
    else console.log('sai:', JSON.stringify(grid))
}
for (const [grid, want] of big) {
    if (longestIncreasingPath(grid) === want) ok++
    else console.log('sai ở lưới lớn, mong', want)
}
console.log(`${ok}/${small.length + big.length} ca đúng`)

// Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
let total = 0, agree = 0
const check = (grid: number[][]) => {
    total++
    const want = longestPathBrute(grid)
    if (longestPathMemo(grid) === want && longestIncreasingPath(grid) === want) agree++
}
const shape = (flat: number[], rows: number, cols: number) =>
    Array.from({ length: rows }, (_, r) => flat.slice(r * cols, r * cols + cols))
for (let rows = 1; rows <= 6; rows++) {
    for (let cols = 1; rows * cols <= 6; cols++) {
        const size = rows * cols
        for (let code = 0; code < 3 ** size; code++) {
            const flat: number[] = []
            for (let k = 0, x = code; k < size; k++, x = Math.floor(x / 3)) flat.push(x % 3)
            check(shape(flat, rows, cols))
        }
    }
}
const permute = (items: number[], prefix: number[], out: number[][]) => {
    if (items.length === 0) { out.push(prefix); return }
    items.forEach((v, i) => permute([...items.slice(0, i), ...items.slice(i + 1)], [...prefix, v], out))
}
const perms: number[][] = []
permute([1, 2, 3, 4, 5, 6], [], perms)
for (const p of perms) { check(shape(p, 2, 3)); check(shape(p, 3, 2)) }
console.log(`${agree}/${total} ca đúng (đối chiếu vét cạn)`)

// Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
const diagonal = Array.from({ length: 10 }, (_, r) => Array.from({ length: 10 }, (_, c) => r + c))
const bruteCount = { calls: 0 }, memoCount = { calls: 0 }
longestPathBrute(diagonal, bruteCount)
longestPathMemo(diagonal, memoCount)
console.log(`Lưới 10×10 giá trị i+j: vét cạn ${bruteCount.calls} lượt gọi, memo ${memoCount.calls} lượt gọi`)

// Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng
const deep = corridor(200)
let memoResult: string
try { memoResult = String(longestPathMemo(deep)) }
catch (e) { memoResult = `tràn ngăn xếp (${(e as Error).name})` }
console.log(`Lưới hành lang 200×200: bóc lớp ${longestIncreasingPath(deep)}, memo đệ quy ${memoResult}`)
