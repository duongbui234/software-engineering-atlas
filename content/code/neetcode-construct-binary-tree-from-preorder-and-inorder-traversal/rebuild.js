import assert from "node:assert/strict"

class TreeNode {
  left = null
  right = null

  constructor(value) {
    this.value = value
  }
}

function buildRanges(preorder, findRoot) {
  let next = 0

  function build(lo, hi) {
    if (lo === hi) return null
    const root = new TreeNode(preorder[next++])
    const mid = findRoot(root.value, lo)
    root.left = build(lo, mid)
    root.right = build(mid + 1, hi)
    return root
  }

  return build(0, preorder.length)
}

function scanFrom(inorder, value, lo) {
  while (inorder[lo] !== value) lo++
  return lo
}

const byScan = (preorder, inorder) =>
  buildRanges(preorder, (value, lo) => scanFrom(inorder, value, lo))

const byIndex = (preorder, inorder) => {
  const index = new Map(inorder.map((value, i) => [value, i]))
  return buildRanges(preorder, (value) => index.get(value))
}

const byStack = (preorder, inorder) => {
  if (preorder.length === 0) return null
  const root = new TreeNode(preorder[0])
  const pending = [root]
  let nextIn = 0

  for (let i = 1; i < preorder.length; i++) {
    const child = new TreeNode(preorder[i])
    let parent = pending[pending.length - 1]

    if (parent.value !== inorder[nextIn]) {
      parent.left = child
    } else {
      while (pending.length && pending[pending.length - 1].value === inorder[nextIn]) {
        parent = pending.pop()
        nextIn++
      }
      parent.right = child
    }

    pending.push(child)
  }

  return root
}

function check(root, preorder, inorder) {
  const before = []
  const between = []
  const pending = []
  while (root || pending.length) {
    while (root) {
      before.push(root.value)
      pending.push(root)
      root = root.left
    }
    root = pending.pop()
    between.push(root.value)
    root = root.right
  }
  assert.deepEqual(before, preorder)
  assert.deepEqual(between, inorder)
}

const cases = [
  [[-3000], [-3000]],
  [[8, 14, 5, -2, 4, 0], [14, 5, 8, 4, -2, 0]],
  [[1, 2, 3, 4], [4, 3, 2, 1]],
  [[1, 2, 3, 4], [1, 2, 3, 4]],
  [[1, -2, 3, -4], [-2, -4, 3, 1]],
]

let ok = 0
for (const rebuild of [byScan, byIndex, byStack]) {
  for (const [preorder, inorder] of cases) {
    check(rebuild(preorder, inorder), preorder, inorder)
    ok++
  }
}

const straight = Array.from({ length: 3000 }, (_, i) => i + 1)
for (const inorder of [straight, [...straight].reverse()]) {
  check(byStack(straight, inorder), straight, inorder)
  ok++
}
console.log(`${ok}/${cases.length * 3 + 2} ca đúng`)

const preorder = straight.slice(0, 500)
const inorder = [...preorder].reverse()
let comparisons = 0
let lookups = 0
check(buildRanges(preorder, (value, lo) => {
  const mid = scanFrom(inorder, value, lo)
  comparisons += mid - lo + 1
  return mid
}), preorder, inorder)
const index = new Map(inorder.map((value, i) => [value, i]))
check(buildRanges(preorder, (value) => {
  lookups++
  return index.get(value)
}), preorder, inorder)
console.log(`so sánh quét: ${comparisons}, lượt tra chỉ mục: ${lookups}`)
