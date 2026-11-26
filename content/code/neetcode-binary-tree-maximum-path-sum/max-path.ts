type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null }

function node(value: number, left: TreeNode | null = null, right: TreeNode | null = null): TreeNode {
  return { value, left, right }
}

function brute(root: TreeNode): number {
  let best = root.value
  const parent = new Map<TreeNode, TreeNode | null>([[root, null]])
  const nodes = [root]
  for (const current of nodes) {
    for (const child of [current.left, current.right]) {
      if (child !== null) {
        parent.set(child, current)
        nodes.push(child)
      }
    }
  }

  for (const start of nodes) {
    const stack: [TreeNode, TreeNode | null, number][] = [[start, null, start.value]]
    while (stack.length > 0) {
      const [current, previous, sum] = stack.pop()!
      best = Math.max(best, sum)
      for (const next of [current.left, current.right, parent.get(current)!]) {
        if (next !== null && next !== previous) stack.push([next, current, sum + next.value])
      }
    }
  }
  return best
}

function recursive(root: TreeNode): number {
  let best = root.value
  function gain(current: TreeNode | null): number {
    if (current === null) return 0
    const left = Math.max(0, gain(current.left))
    const right = Math.max(0, gain(current.right))
    best = Math.max(best, current.value + left + right)
    return current.value + Math.max(left, right)
  }
  gain(root)
  return best
}

type Frame = { current: TreeNode; step: number; leftGain: number }

function frame(current: TreeNode): Frame {
  return { current, step: 0, leftGain: 0 }
}

function iterative(root: TreeNode): number {
  let best = root.value
  let returned = 0
  const stack = [frame(root)]

  while (stack.length > 0) {
    const top = stack[stack.length - 1]
    const { current } = top
    if (top.step === 0) {
      top.step = 1
      if (current.left !== null) stack.push(frame(current.left))
      continue
    }

    if (top.step === 1) {
      if (current.left !== null) top.leftGain = Math.max(0, returned)
      top.step = 2
      if (current.right !== null) stack.push(frame(current.right))
      continue
    }

    const rightGain = current.right === null ? 0 : Math.max(0, returned)
    best = Math.max(best, current.value + top.leftGain + rightGain)
    returned = current.value + Math.max(top.leftGain, rightGain)
    stack.pop()
  }
  return best
}

const cases: [TreeNode, number][] = [
  [node(-9), -9],
  [node(-6, node(-1), node(-4)), -1],
  [node(6, node(3), node(5)), 14],
  [node(-8, node(4, node(7), node(5)), node(-3)), 16],
  [node(8, node(2, node(4), node(5)), node(1)), 16],
  [node(5, node(-7, node(1)), node(4)), 9],
  [node(2, node(2, node(2)), node(2)), 8],
  [node(6, node(-2, node(9)), node(4)), 17],
]

let passed = 0
for (const [root, expected] of cases) {
  for (const solve of [brute, recursive, iterative]) {
    const actual = solve(root)
    if (actual !== expected) throw new Error(`${solve.name}: ${actual} != ${expected}`)
  }
  passed++
}

let deep = node(1)
for (let length = 1; length < 30_000; length++) deep = node(1, deep)
if (iterative(deep) !== 30_000) throw new Error("iterative: 30_000")
passed++

console.log(`${passed}/${cases.length + 1} ca đúng`)

export {}
