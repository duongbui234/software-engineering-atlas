import assert from "node:assert/strict"

class TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null

  constructor(value: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.value = value
    this.left = left
    this.right = right
  }
}

class Pending<T> {
  private head = 0
  private items: T[]
  private byLevel: boolean

  constructor(items: T[], byLevel: boolean) {
    this.items = items
    this.byLevel = byLevel
  }

  get size() {
    return this.items.length - this.head
  }

  take(): T {
    if (!this.byLevel) return this.items.pop()!
    const item = this.items[this.head++]!
    if (2 * this.head >= this.items.length) {
      this.items = this.items.slice(this.head)
      this.head = 0
    }
    return item
  }

  addChildren(left: T, right: T) {
    if (this.byLevel) this.items.push(left, right)
    else this.items.push(right, left)
  }
}

function serialize(root: TreeNode | null, byLevel = false): string {
  const pending = new Pending([root], byLevel)
  const tokens: string[] = []
  while (pending.size > 0) {
    const node = pending.take()
    tokens.push(node === null ? "#" : String(node.value))
    if (node !== null) pending.addChildren(node.left, node.right)
  }
  return tokens.join(",")
}

type Slot = { parent: TreeNode; side: "left" | "right" }

function deserialize(wire: string, byLevel = false): TreeNode | null {
  const holder = new TreeNode(0)
  const pending = new Pending<Slot>([{ parent: holder, side: "left" }], byLevel)
  for (const token of wire.split(",")) {
    if (pending.size === 0) throw new Error("extra token")
    const { parent, side } = pending.take()
    if (token === "#") continue
    const value = Number(token)
    if (!Number.isInteger(value) || Math.abs(value) > 1000 || String(value) !== token) {
      throw new Error("invalid token")
    }
    const node = new TreeNode(value)
    parent[side] = node
    pending.addChildren({ parent: node, side: "left" }, { parent: node, side: "right" })
  }
  if (pending.size !== 0) throw new Error("missing token")
  return holder.left
}

const leaf = new TreeNode(5)
const examples = [
  [null, "#", "#"],
  [new TreeNode(0), "0,#,#", "0,#,#"],
  [new TreeNode(5, leaf), "5,5,#,#,#", "5,5,#,#,#"],
  [new TreeNode(5, null, leaf), "5,#,5,#,#", "5,#,5,#,#"],
  [
    new TreeNode(8, new TreeNode(-4, null, new TreeNode(0)), new TreeNode(8, new TreeNode(-1000), new TreeNode(1000))),
    "8,-4,#,0,#,#,8,-1000,#,#,1000,#,#",
    "8,-4,8,#,0,-1000,1000,#,#,#,#,#,#",
  ],
] as const
const invalid = ["", "1,#", "#,", "1x,#,#", "1001,#,#"]

for (const byLevel of [false, true]) {
  for (const [tree, preorder, level] of examples) {
    const wire = byLevel ? level : preorder
    assert.equal(serialize(tree, byLevel), wire)
    assert.deepEqual(deserialize(wire, byLevel), tree)
  }
  for (const side of ["left", "right"] as const) {
    const other = side === "left" ? "right" : "left"
    let chain: TreeNode | null = null
    for (let i = 9999; i >= 0; i--) {
      const node = new TreeNode(i % 11 - 5)
      node[side] = chain
      chain = node
    }
    const wire = serialize(chain, byLevel)
    assert.equal(wire.split(",").length, 20_001)
    let restored = deserialize(wire, byLevel)
    for (let i = 0; i < 10_000; i++) {
      assert(restored !== null)
      assert.equal(restored.value, i % 11 - 5)
      assert.equal(restored[other], null)
      restored = restored[side]
    }
    assert.equal(restored, null)
  }
  for (const wire of invalid) assert.throws(() => deserialize(wire, byLevel))
}
console.log(`${examples.length + 2 + invalid.length}/12 ca đúng`)
