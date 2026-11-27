// Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
// Chạy: node intervals.ts

// best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r.
function maxCoins(nums: number[]): number {
    const vals = [1, ...nums, 1] // thêm hai quả bóng giá 1 ở hai đầu
    const size = vals.length
    const best = Array.from({ length: size }, () => Array(size).fill(0))
    for (let gap = 2; gap < size; gap++) { // khoảng ngắn trước, dài sau
        for (let l = 0; l + gap < size; l++) {
            const r = l + gap
            for (let k = l + 1; k < r; k++) {
                const coins = vals[l] * vals[k] * vals[r] + best[l][k] + best[k][r]
                if (coins > best[l][r]) best[l][r] = coins
            }
        }
    }
    return best[0][size - 1]
}

// match[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó.
function isMatch(s: string, p: string): boolean {
    const m = s.length, n = p.length
    const match = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false))
    match[0][0] = true
    for (let i = 0; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === "*") {
                // dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
                const eats = i > 0 && (p[j - 2] === "." || p[j - 2] === s[i - 1]) && match[i - 1][j]
                match[i][j] = match[i][j - 2] || eats
            } else {
                match[i][j] = i > 0 && (p[j - 1] === "." || p[j - 1] === s[i - 1]) && match[i - 1][j - 1]
            }
        }
    }
    return match[m][n]
}

const balloonCases: [number[], number][] = [
    [[2, 4, 3], 33], [[5], 5], [[1, 5], 10], [[0, 4], 4],
    [[3, 3, 3], 39], [[9, 1, 2, 8], 243], [[4, 2, 7, 1, 6], 296],
]
const patternCases: [string, string, boolean][] = [
    ["", "", true], ["", "a*", true], ["", "a*b*.*", true], ["abc", "abc", true],
    ["abc", "a.c", true], ["abc", "ab", false], ["aaa", "a*", true], ["aaa", "ab*a*", true],
    ["xyz", ".*", true], ["xyz", ".*q", false], ["ab", ".*c", false], ["aaab", "a*ab", true],
    ["ba", "a*ba*", true], ["a", "ab*", true], ["bbbba", ".*a*a", true], ["ab", "a*", false],
]
let ok = 0
const fails: string[] = []
for (const [nums, want] of balloonCases) {
    const got = maxCoins(nums)
    if (got === want) ok++; else fails.push(`maxCoins([${nums}]) = ${got}, cần ${want}`)
}
for (const [s, p, want] of patternCases) {
    const got = isMatch(s, p)
    if (got === want) ok++; else fails.push(`isMatch("${s}", "${p}") = ${got}, cần ${want}`)
}
for (const f of fails) console.log("sai ở:", f)
console.log(`${ok}/${balloonCases.length + patternCases.length} ca đúng`)
