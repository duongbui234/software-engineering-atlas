type Tree = { value: number; left: Tree; right: Tree } | null

function rebuild(preorder: number[], inorder: number[]): Tree {
  const position = new Map(inorder.map((value, index) => [value, index]))
  let next = 0
  function visit(lo: number, hi: number): Tree {
    if (lo === hi) return null
    const value = preorder[next++]
    const split = position.get(value)!
    return { value, left: visit(lo, split), right: visit(split + 1, hi) }
  }
  return visit(0, inorder.length)
}

function maxPath(root: NonNullable<Tree>): number {
  let best = root.value
  function gain(node: Tree): number {
    if (!node) return 0
    const left = Math.max(0, gain(node.left))
    const right = Math.max(0, gain(node.right))
    best = Math.max(best, node.value + left + right)
    return node.value + Math.max(left, right)
  }
  gain(root)
  return best
}

function encode(root: Tree): string {
  const tokens: string[] = []
  function visit(node: Tree) {
    if (!node) {
      tokens.push("#")
      return
    }
    tokens.push(String(node.value))
    visit(node.left)
    visit(node.right)
  }
  visit(root)
  return tokens.join(",")
}

function decode(data: string): Tree {
  const tokens = data.split(",")
  let next = 0
  function visit(): Tree {
    const token = tokens[next++]
    return token === "#" ? null : { value: Number(token), left: visit(), right: visit() }
  }
  return visit()
}

const wire = "8,3,#,6,#,#,11,-2,#,#,#"
const rebuilt = rebuild([8, 3, 6, 11, -2], [3, 6, 8, -2, 11])
const cases = [
  encode(rebuilt) === wire,
  encode(rebuild([8, 3], [3, 8])) === "8,3,#,#,#",
  encode(rebuild([8, 3], [8, 3])) === "8,#,3,#,#",
  maxPath(rebuilt!) === 28,
  maxPath(decode("-8,-3,#,#,-5,#,#")!) === -3,
  encode(decode(wire)) === wire,
  encode(decode("4,#,4,#,#")) === "4,#,4,#,#",
  decode("#") === null,
]
if (!cases.every(Boolean)) throw new Error("Có ca sai")
console.log(`${cases.length}/${cases.length} ca đúng`)
