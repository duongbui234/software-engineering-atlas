// N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
// Chạy: node queens.ts

const counter = { calls: 0 }

// Đổi danh sách cột (cols[r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
function toBoard(cols: number[]): string[] {
    const n = cols.length
    return cols.map(c => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1))
}

// Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
function solveBrute(n: number): string[][] {
    const result: string[][] = []
    const cols: number[] = []
    const used = Array(n).fill(false)
    const walk = () => {
        counter.calls++
        if (cols.length === n) {
            if (diagonalsOk(cols)) result.push(toBoard(cols))
            return
        }
        for (let c = 0; c < n; c++) {
            if (used[c]) continue
            used[c] = true
            cols.push(c)
            walk()
            cols.pop()
            used[c] = false
        }
    }
    walk()
    return result
}

function diagonalsOk(cols: number[]): boolean {
    for (let a = 0; a < cols.length; a++)
        for (let b = a + 1; b < cols.length; b++)
            if (Math.abs(cols[a] - cols[b]) === b - a) return false
    return true
}

// Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
function solveNQueens(n: number): string[][] {
    const result: string[][] = []
    const cols: number[] = []
    const colUsed = Array(n).fill(false)
    const diag = Array(2 * n - 1).fill(false)
    const anti = Array(2 * n - 1).fill(false)
    const place = (r: number) => {
        counter.calls++
        if (r === n) {
            result.push(toBoard(cols)) // chỉ dựng chuỗi ở lá
            return
        }
        for (let c = 0; c < n; c++) {
            const d = r - c + n - 1
            const a = r + c
            if (colUsed[c] || diag[d] || anti[a]) continue
            colUsed[c] = diag[d] = anti[a] = true
            cols.push(c)
            place(r + 1)
            cols.pop()
            colUsed[c] = diag[d] = anti[a] = false // gỡ cả ba dấu
        }
    }
    place(0)
    return result
}

// Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
function countBits(n: number): number {
    const full = (1 << n) - 1
    const go = (cols: number, left: number, right: number): number => {
        counter.calls++
        if (cols === full) return 1
        let count = 0
        let free = full & ~(cols | left | right)
        while (free !== 0) {
            const bit = free & -free // bit 1 thấp nhất: một cột còn trống
            free -= bit
            // chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
            count += go(cols | bit, ((left | bit) << 1) & full, (right | bit) >> 1)
        }
        return count
    }
    return go(0, 0, 0)
}

// Bản sai: quên gỡ dấu chéo phụ khi quay lui
function countForgetAnti(n: number): number {
    const colUsed = Array(n).fill(false)
    const diag = Array(2 * n - 1).fill(false)
    const anti = Array(2 * n - 1).fill(false)
    const place = (r: number): number => {
        if (r === n) return 1
        let count = 0
        for (let c = 0; c < n; c++) {
            const d = r - c + n - 1
            const a = r + c
            if (colUsed[c] || diag[d] || anti[a]) continue
            colUsed[c] = diag[d] = anti[a] = true
            count += place(r + 1)
            colUsed[c] = diag[d] = false
        }
        return count
    }
    return place(0)
}

// Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
function validBoard(board: string[], n: number): boolean {
    if (board.length !== n) return false
    const cols = new Set<number>(), diags = new Set<number>(), antis = new Set<number>()
    for (let r = 0; r < n; r++) {
        const row = board[r]
        if (row.length !== n || [...row].filter(ch => ch === 'Q').length !== 1) return false
        if ([...row].some(ch => ch !== 'Q' && ch !== '.')) return false
        const c = row.indexOf('Q')
        cols.add(c); diags.add(r - c); antis.add(r + c)
    }
    return cols.size === n && diags.size === n && antis.size === n
}

const key = (boards: string[][]) => boards.map(b => b.join('/')).sort().join('|')

const KNOWN = [1, 0, 0, 2, 10, 4, 40, 92, 352]
let ok = 0
let total = 0
const check = (cond: boolean, name: string) => {
    total++
    if (cond) ok++
    else console.log('sai ở', name)
}
for (let n = 1; n <= 9; n++) {
    check(solveNQueens(n).length === KNOWN[n - 1] && countBits(n) === KNOWN[n - 1], `n = ${n}`)
}
check(solveNQueens(5).some(b => b.join('/') === 'Q..../..Q../....Q/.Q.../...Q.'), 'n = 5 có bàn mẫu')
const six = solveNQueens(6)
check(six.every(b => validBoard(b, 6)), 'n = 6 mọi bàn hợp lệ')
check(new Set(six.map(b => b.join('/'))).size === six.length, 'n = 6 không trùng')
console.log(`${ok}/${total} ca đúng`)

let crossOk = 0
for (let n = 1; n <= 7; n++) if (key(solveBrute(n)) === key(solveNQueens(n))) crossOk++
console.log(`${crossOk}/7 ca đúng (đối chiếu vét mọi hoán vị)`)

counter.calls = 0; solveBrute(8); const brute = counter.calls
counter.calls = 0; solveNQueens(8); const sets = counter.calls
counter.calls = 0; countBits(8); const bits = counter.calls
console.log(`n = 8: vét hoán vị ${brute} lượt gọi, ba tập ${sets} lượt gọi, bitmask ${bits} lượt gọi`)
console.log(`Quên gỡ chéo phụ: n = 8 ra ${countForgetAnti(8)} bàn, đúng là 92`)
