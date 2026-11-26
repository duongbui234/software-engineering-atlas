function decodeCount(s: string): number {
  let beforePrevious = 0
  let previous = 1
  for (let i = 0; i < s.length; i++) {
    let current = s[i] === "0" ? 0 : previous
    if (i > 0 && (s[i - 1] === "1" || (s[i - 1] === "2" && s[i] <= "6"))) {
      current += beforePrevious
    }
    if (current === 0) return 0
    beforePrevious = previous
    previous = Math.min(current, 2_147_483_647)
  }
  return previous
}

function decodeByCuts(s: string, memoized: boolean): number {
  const memo = new Map<number, number>()
  function visit(index: number): number {
    if (index === s.length) return 1
    if (s[index] === "0") return 0
    const saved = memo.get(index)
    if (saved !== undefined) return saved
    let count = visit(index + 1)
    if (index + 1 < s.length && (s[index] === "1" || (s[index] === "2" && s[index + 1] <= "6"))) {
      count += visit(index + 2)
    }
    if (memoized) memo.set(index, count)
    return count
  }
  return visit(0)
}

function check(got: number, expected: number) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)

}
check(decodeCount("11204"), 2)
check(decodeByCuts("11204", true), 2)
check(decodeByCuts("11204", false), 2)
check(decodeCount("27"), 1)
check(decodeByCuts("27", true), 1)
check(decodeByCuts("27", false), 1)
check(decodeCount("1010"), 1)
check(decodeByCuts("1010", true), 1)
check(decodeByCuts("1010", false), 1)
check(decodeCount("100"), 0)
check(decodeByCuts("100", true), 0)
check(decodeByCuts("100", false), 0)
check(decodeCount("07"), 0)
check(decodeByCuts("07", true), 0)
check(decodeByCuts("07", false), 0)
check(decodeCount("1234"), 3)
check(decodeByCuts("1234", true), 3)
check(decodeByCuts("1234", false), 3)
check(decodeCount("301"), 0)
check(decodeByCuts("301", true), 0)
check(decodeByCuts("301", false), 0)
check(decodeCount("9"), 1)
check(decodeByCuts("9", true), 1)
check(decodeByCuts("9", false), 1)
check(decodeCount("0"), 0)
check(decodeByCuts("0", true), 0)
check(decodeByCuts("0", false), 0)
check(decodeCount("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0)
check(decodeByCuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", true), 0)
console.log("10/10 ca đúng")

// Kiểm thêm các invariant bằng bộ sinh xác định.

let state = 29
function random(limit: number): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return (state >>> 16) % limit
}

let visits = 0
function enumerateSplits(s: string, index = 0): number {
  visits++
  if (index === s.length) return 1
  if (s[index] === "0") return 0
  let ways = enumerateSplits(s, index + 1)
  if (index + 1 < s.length && Number(s.slice(index, index + 2)) <= 26) {
    ways += enumerateSplits(s, index + 2)
  }
  return ways
}

for (let i = 0; i < 200; i++) {
  const digits = Array.from({ length: 1 + random(12) }, () => random(10)).join("")
  check(decodeCount(digits), enumerateSplits(digits))
}
const repeated = "1".repeat(18)
visits = 0
check(decodeCount(repeated), enumerateSplits(repeated))
console.log("201/201 ca đối chiếu; 18 chữ số 1: DFS " + visits + " lời gọi, DP 18 bước")
