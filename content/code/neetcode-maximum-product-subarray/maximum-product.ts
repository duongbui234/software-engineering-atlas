function maximumProduct(values: number[]): number {
  let high = values[0]
  let low = values[0]
  let best = values[0]
  for (let i = 1; i < values.length; i++) {
    const x = values[i]
    const extendHigh = high * x
    const extendLow = low * x
    high = Math.max(x, extendHigh, extendLow)
    low = Math.min(x, extendHigh, extendLow)
    best = Math.max(best, high)
  }
  return best
}

function maximumByIntervals(nums: number[]): number {
  let best = -Infinity
  for (let left = 0; left < nums.length; left++) {
    let product = 1
    for (let right = left; right < nums.length; right++) {
      product *= nums[right]
      best = Math.max(best, product)
    }
  }
  return best
}

function check(got: number, expected: number) {
  if (got !== expected) throw new Error("want " + expected + ", got " + got)

}
check(maximumProduct([-2, 3, -4]), 24)
check(maximumByIntervals([-2, 3, -4]), 24)
check(maximumProduct([-3]), -3)
check(maximumByIntervals([-3]), -3)
check(maximumProduct([-2, -3, -4]), 12)
check(maximumByIntervals([-2, -3, -4]), 12)
check(maximumProduct([0, -2, 0, -3, -4]), 12)
check(maximumByIntervals([0, -2, 0, -3, -4]), 12)
check(maximumProduct([0, -3, 0]), 0)
check(maximumByIntervals([0, -3, 0]), 0)
check(maximumProduct([1]), 1)
check(maximumByIntervals([1]), 1)
check(maximumProduct([2, 3, 0, -2, -4]), 8)
check(maximumByIntervals([2, 3, 0, -2, -4]), 8)
console.log("7/7 ca đúng")

// Kiểm thêm các invariant bằng bộ sinh xác định.

let state = 29
function random(limit: number): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0
  return (state >>> 16) % limit
}

let multiplications = 0
function enumerateIntervals(nums: number[]): number {
  let best = -Infinity
  for (let left = 0; left < nums.length; left++) {
    let product = 1
    for (let right = left; right < nums.length; right++) {
      product *= nums[right]
      multiplications++
      best = Math.max(best, product)
    }
  }
  return best
}

for (let i = 0; i < 200; i++) {
  const values = Array.from({ length: 1 + random(10) }, () => random(9) - 4)
  check(maximumProduct(values), enumerateIntervals(values))
}
const alternating = Array.from({ length: 1000 }, (_, i) => i % 2 ? -1 : 1)
multiplications = 0
check(maximumProduct(alternating), enumerateIntervals(alternating))
console.log("201/201 ca đối chiếu; mảng 1000 số: vét cạn " + multiplications + " phép nhân, DP 1998")
