// Ga DP-05: bảng theo lưới và theo hai tiền tố
function uniquePaths(m, n) {
    const row = Array(n).fill(1) // hàng 0: mọi ô có đúng một đường
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) row[j] += row[j - 1] // trên + trái
    }
    return row[n - 1]
}

function longestCommonSubsequence(a, b) {
    const dp = Array.from({length: a.length + 1}, () => Array(b.length + 1).fill(0))
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1])
        }
    }
    return dp[a.length][b.length]
}

function isInterleave(s1, s2, s3) {
    if (s1.length + s2.length !== s3.length) return false
    const row = Array(s2.length + 1).fill(false)
    for (let i = 0; i <= s1.length; i++) {
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0 && j === 0) row[j] = true
            else {
                const c = s3[i + j - 1]
                const fromTop = i > 0 && row[j] && s1[i - 1] === c
                const fromLeft = j > 0 && row[j - 1] && s2[j - 1] === c
                row[j] = fromTop || fromLeft
            }
        }
    }
    return row[s2.length]
}

function numDistinct(s, t) {
    const ways = Array(t.length + 1).fill(0)
    ways[0] = 1 // t rỗng: một cách, bỏ hết
    for (let i = 1; i <= s.length; i++) {
        for (let j = t.length; j >= 1; j--) { // đi lùi để còn đọc hàng cũ
            if (s[i - 1] === t[j - 1]) ways[j] += ways[j - 1]
        }
    }
    return ways[t.length]
}

function minDistance(a, b) {
    const row = Array.from({length: b.length + 1}, (_, j) => j) // a rỗng: chèn j ký tự
    for (let i = 1; i <= a.length; i++) {
        let diag = row[0] // dp[i-1][j-1]
        row[0] = i
        for (let j = 1; j <= b.length; j++) {
            const top = row[j]
            row[j] = a[i - 1] === b[j - 1]
                ? diag
                : 1 + Math.min(diag, top, row[j - 1]) // thay, xóa, chèn
            diag = top
        }
    }
    return row[b.length]
}

const checks = [
    uniquePaths(3, 7) === 28,
    uniquePaths(3, 2) === 3,
    uniquePaths(1, 1) === 1,
    uniquePaths(23, 12) === 193536720,
    longestCommonSubsequence('abcde', 'ace') === 3,
    longestCommonSubsequence('abc', 'def') === 0,
    longestCommonSubsequence('map', 'mop') === 2,
    isInterleave('aabcc', 'dbbca', 'aadbbcbcac'),
    !isInterleave('aabcc', 'dbbca', 'aadbbbaccc'),
    isInterleave('', '', ''),
    !isInterleave('a', '', 'ab'),
    numDistinct('rabbbit', 'rabbit') === 3,
    numDistinct('babgbag', 'bag') === 5,
    numDistinct('a', 'b') === 0,
    minDistance('horse', 'ros') === 3,
    minDistance('intention', 'execution') === 5,
    minDistance('', 'abc') === 3,
]
if (!checks.every(Boolean)) throw new Error('Ca kiểm tra sai')
console.log(`${checks.length}/${checks.length} ca đúng`)
