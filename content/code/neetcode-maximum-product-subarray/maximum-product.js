function maximumProduct(values) {
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

function maximumByIntervals(nums) {
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

function check(got, expected) {
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
