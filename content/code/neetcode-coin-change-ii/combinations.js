import assert from 'node:assert/strict'

const LIMIT = 2_147_483_647

function enumerate(amount, coins, index = 0) {
  if (index === coins.length) return Number(amount === 0)
  const coin = coins[index]
  let ways = 0
  for (let rest = amount; rest >= 0; rest -= coin) {
    ways += enumerate(rest, coins, index + 1)
  }
  return ways
}

function countTable(amount, coins) {
  const rows = [Array(amount + 1).fill(0)]
  rows[0][0] = 1
  for (const coin of coins) {
    const previous = rows[rows.length - 1]
    const current = previous.slice()
    for (let total = coin; total <= amount; total++) {
      current[total] = Math.min(LIMIT, previous[total] + current[total - coin])
    }
    rows.push(current)
  }
  return rows
}

function countCombinations(amount, coins) {
  const ways = Array(amount + 1).fill(0)
  ways[0] = 1
  for (const coin of coins) {
    for (let total = coin; total <= amount; total++) {
      ways[total] = Math.min(LIMIT, ways[total] + ways[total - coin])
    }
  }
  return ways
}

const manyEven = Array.from({ length: 299 }, (_, i) => 2 * (i + 1))
const cases = [
  [8, [2, 3, 5], 3],
  [5, [3, 2], 1],
  [10, [5, 2, 3], 4],
  [7, [6, 4], 0],
  [16, [4], 1],
  [0, [7, 11], 1],
  [2, [3, 5000], 0],
  [4, [2, 1], 3],
  [120, [6, 1, 4, 9, 17], 4131],
  [4999, [...manyEven, 4999], 1],
]
for (const [amount, coins, expected] of cases) {
  const full = countTable(amount, coins)
  const compact = countCombinations(amount, coins)
  assert.equal(full[coins.length][amount], expected)
  assert.equal(compact[amount], expected)
  if (amount <= 20) assert.equal(enumerate(amount, coins), expected)
}
console.log(`${cases.length}/${cases.length} ca đúng`)

let compared = 0
for (let mask = 1; mask < 64; mask++) {
  const coins = [1, 2, 3, 4, 5, 6].filter((_, i) => (mask & (1 << i)) !== 0)
  for (let amount = 0; amount <= 20; amount++) {
    const expected = enumerate(amount, coins)
    assert.equal(countTable(amount, coins)[coins.length][amount], expected)
    assert.equal(countCombinations(amount, coins)[amount], expected)
    compared++
  }
}
console.log(`Đối chiếu vét cạn: ${compared} ca`)

const amount = 4999
const coins = [...manyEven, amount]
const full = countTable(amount, coins)
const compact = countCombinations(amount, coins)
console.log(`Ô đếm: bảng 2D ${full.reduce((sum, row) => sum + row.length, 0)}, mảng 1D ${compact.length}`)
console.log(`Ô 4998 sau khi chặn: ${compact[4998]}; đáp án 4999: ${compact[4999]}`)
