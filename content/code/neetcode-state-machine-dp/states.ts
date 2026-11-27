// Ga DP-06: DP có trạng thái. Chạy: node states.ts

// Best Time to Buy and Sell Stock with Cooldown: ba trạng thái cuối mỗi ngày.
function maxProfitCooldown(prices: number[]): number {
    let hold = -Infinity // đang giữ một cổ phiếu
    let sold = -Infinity // vừa bán hôm nay, mai phải nghỉ
    let rest = 0         // tay không, được mua
    for (const price of prices) {
        const prevSold = sold
        sold = hold + price
        hold = Math.max(hold, rest - price)
        rest = Math.max(rest, prevSold)
    }
    return Math.max(rest, sold)
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

// Longest Increasing Path in a Matrix: DFS có ghi nhớ, thứ tự do đệ quy tự tìm.
function longestIncreasingPath(grid: number[][]): number {
    const m = grid.length, n = grid[0].length
    const memo: number[][] = Array.from({length: m}, () => Array(n).fill(0))
    function dfs(r: number, c: number): number {
        if (memo[r][c] > 0) return memo[r][c]
        let best = 1
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c]) {
                best = Math.max(best, 1 + dfs(nr, nc))
            }
        }
        memo[r][c] = best
        return best
    }
    let answer = 0
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) answer = Math.max(answer, dfs(r, c))
    return answer
}

// Cùng bài, không đệ quy: bóc dần các ô không còn hàng xóm lớn hơn (thứ tự topo).
function longestIncreasingPathLayers(grid: number[][]): number {
    const m = grid.length, n = grid[0].length
    const out: number[][] = Array.from({length: m}, () => Array(n).fill(0))
    let layer: number[][] = []
    for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) {
        for (const [dr, dc] of DIRS) {
            const nr = r + dr, nc = c + dc
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] > grid[r][c]) out[r][c]++
        }
        if (out[r][c] === 0) layer.push([r, c])
    }
    let layers = 0
    while (layer.length > 0) {
        layers++
        const next: number[][] = []
        for (const [r, c] of layer) {
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] < grid[r][c]) {
                    if (--out[nr][nc] === 0) next.push([nr, nc])
                }
            }
        }
        layer = next
    }
    return layers
}

const stockCases: [number[], number][] = [
    [[5], 0], [[5, 4, 3], 0], [[1, 2], 1], [[1, 3, 2, 8], 7], [[2, 4, 1, 7], 6],
    [[1, 4, 2, 7], 6], [[3, 1, 4, 8, 2, 6], 7], [[6, 1, 6, 4, 3, 0, 2], 7], [[1, 2, 4, 2, 5, 7, 2, 4, 9, 0], 11],
]
const gridCases: [number[][], number][] = [
    [[[7]], 1], [[[1, 2], [4, 3]], 4], [[[3, 3], [3, 3]], 1],
    [[[5, 4, 3], [6, 1, 2], [7, 8, 9]], 9], [[[1, 2, 3, 4, 5]], 5], [[[3], [2], [1]], 3],
]
let ok = 0, total = 0
for (const [prices, want] of stockCases) {
    total++
    if (maxProfitCooldown(prices) === want) ok++
    else console.log("sai ở", prices)
}
for (const [grid, want] of gridCases) {
    total++
    if (longestIncreasingPath(grid) === want && longestIncreasingPathLayers(grid) === want) ok++
    else console.log("sai ở", JSON.stringify(grid))
}
console.log(`${ok}/${total} ca đúng`)
