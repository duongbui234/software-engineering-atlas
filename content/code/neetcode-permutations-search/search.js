// Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
// Chạy: node search.js

let permuteCalls = 0

// Permutations: không có start; đánh dấu phần tử đã nằm trong path.
function permute(nums) {
    const result = []
    const path = []
    const used = Array(nums.length).fill(false)
    function walk() {
        permuteCalls++
        if (path.length === nums.length) {
            result.push([...path]) // chép path, vì path còn đổi tiếp
            return
        }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue // đã nằm trong path
            used[i] = true // đánh dấu
            path.push(nums[i]) // chọn
            walk() // đi sâu
            path.pop() // gỡ lựa chọn
            used[i] = false // gỡ dấu
        }
    }
    walk()
    return result
}

// Word Search: ghi đè ô đang đi qua, khôi phục khi quay lui.
function exist(board, word) {
    const rows = board.length
    const cols = board[0].length
    function dfs(r, c, k) {
        if (r < 0 || c < 0 || r >= rows || c >= cols || board[r][c] !== word[k]) return false
        if (k === word.length - 1) return true
        const saved = board[r][c]
        board[r][c] = "#" // đánh dấu đang đi qua
        const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1)
        board[r][c] = saved // khôi phục
        return found
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (dfs(r, c, 0)) return true
        }
    }
    return false
}

// Palindrome Partitioning: chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome.
function partition(s) {
    const result = []
    const path = []
    function isPalindrome(lo, hi) {
        while (lo < hi) {
            if (s[lo] !== s[hi]) return false
            lo++
            hi--
        }
        return true
    }
    function walk(start) {
        if (start === s.length) {
            result.push([...path])
            return
        }
        for (let end = start; end < s.length; end++) {
            if (!isPalindrome(start, end)) continue // cắt nhánh sớm
            path.push(s.slice(start, end + 1))
            walk(end + 1)
            path.pop()
        }
    }
    walk(0)
    return result
}

let queenCalls = 0

// N-Queens: mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ.
function solveNQueens(n) {
    const result = []
    const colOf = []
    const cols = new Set()
    const diag = new Set() // chéo chính: r - c
    const anti = new Set() // chéo phụ: r + c
    function place(r) {
        queenCalls++
        if (r === n) {
            result.push(colOf.map((c) => ".".repeat(c) + "Q" + ".".repeat(n - c - 1)))
            return
        }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue
            cols.add(c)
            diag.add(r - c)
            anti.add(r + c)
            colOf.push(c)
            place(r + 1)
            colOf.pop()
            cols.delete(c)
            diag.delete(r - c)
            anti.delete(r + c)
        }
    }
    place(0)
    return result
}

function key(lists) {
    return JSON.stringify(lists.map((x) => JSON.stringify(x)).sort())
}
function grid(rows) {
    return rows.map((row) => row.split(""))
}
const board = ["TOP", "ARE", "NED"]

const cases = [
    ["permute [4,7,9]", () => key(permute([4, 7, 9])), key([[4, 7, 9], [4, 9, 7], [7, 4, 9], [7, 9, 4], [9, 4, 7], [9, 7, 4]])],
    ["permute [5]", () => key(permute([5])), key([[5]])],
    ["permute 6 số", () => new Set(permute([1, 2, 3, 4, 5, 6]).map((p) => p.join())).size, 720],
    ["exist TOP", () => exist(grid(board), "TOP"), true],
    ["exist TAN", () => exist(grid(board), "TAN"), true],
    ["exist PERE", () => exist(grid(board), "PERE"), true],
    ["exist ROPED", () => exist(grid(board), "ROPED"), true],
    ["exist TOT (không dùng lại ô)", () => exist(grid(board), "TOT"), false],
    ["exist ARENA", () => exist(grid(board), "ARENA"), false],
    ["exist NEED", () => exist(grid(board), "NEED"), false],
    ["partition noon", () => key(partition("noon")), key([["noon"], ["n", "oo", "n"], ["n", "o", "o", "n"]])],
    ["partition abc", () => key(partition("abc")), key([["a", "b", "c"]])],
    ["partition aaa", () => key(partition("aaa")), key([["aaa"], ["a", "aa"], ["aa", "a"], ["a", "a", "a"]])],
    ["partition 8 chữ a", () => partition("aaaaaaaa").length, 128],
    ["partition racecar", () => partition("racecar").length, 4],
    ["nQueens 4", () => key(solveNQueens(4)), key([[".Q..", "...Q", "Q...", "..Q."], ["..Q.", "Q...", "...Q", ".Q.."]])],
    ["nQueens 1", () => key(solveNQueens(1)), key([["Q"]])],
    ["nQueens 3", () => solveNQueens(3).length, 0],
    ["nQueens 6", () => solveNQueens(6).length, 4],
]

let ok = 0
const fails = []
for (const [name, run, want] of cases) {
    if (run() === want) ok++
    else fails.push(name)
}
console.log(`${ok}/${cases.length} ca đúng`)
if (fails.length > 0) console.log("sai ở: " + fails.join("; "))

permuteCalls = 0
const perms = permute([1, 2, 3, 4, 5, 6, 7, 8]).length
queenCalls = 0
const boards = solveNQueens(8).length
console.log(`Hoán vị 8 số: ${permuteCalls} lần gọi, ${perms} kết quả`)
console.log(`8 hậu: ${queenCalls} lần gọi, ${boards} lời giải`)
