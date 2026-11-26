import assert from "node:assert/strict"

class WordSet {
  words = new Set()
  lastChecks = 0

  insert(word) {
    this.words.add(word)
  }

  search(word) {
    return this.words.has(word)
  }

  startsWith(prefix) {
    this.lastChecks = 0
    for (const word of this.words) {
      this.lastChecks++
      if (word.startsWith(prefix)) return true
    }
    return false
  }
}

class TrieNode {
  children
  terminal = false

  constructor(dense) {
    this.children = dense ? Array(26).fill(undefined) : new Map()
  }

  get(letter) {
    return Array.isArray(this.children)
      ? this.children[letter.charCodeAt(0) - 97]
      : this.children.get(letter)
  }

  set(letter, child) {
    if (Array.isArray(this.children)) this.children[letter.charCodeAt(0) - 97] = child
    else this.children.set(letter, child)
  }
}

class Trie {
  root
  dense
  lastChecks = 0

  constructor(dense) {
    this.dense = dense
    this.root = new TrieNode(dense)
  }

  insert(word) {
    let node = this.root
    for (const letter of word) {
      let child = node.get(letter)
      if (!child) {
        child = new TrieNode(this.dense)
        node.set(letter, child)
      }
      node = child
    }
    node.terminal = true
  }

  search(word) {
    return this.walk(word)?.terminal === true
  }

  startsWith(prefix) {
    return this.walk(prefix) !== undefined
  }

  walk(text) {
    this.lastChecks = 0
    let node = this.root
    for (const letter of text) {
      this.lastChecks++
      const child = node.get(letter)
      if (!child) return undefined
      node = child
    }
    return node
  }
}

const indexes = [new WordSet(), new Trie(false), new Trie(true)]
const longWord = "z".repeat(2000)
let cases = 0
for (const index of indexes) {
  const check = (actual, expected) => {
    assert.equal(actual, expected)
    cases++
  }
  check(index.startsWith("ca"), false)
  index.insert("cart")
  index.insert("car")
  index.insert("cab")
  index.insert("car")
  check(index.search("car"), true)
  check(index.search("cart"), true)
  check(index.search("cab"), true)
  check(index.search("ca"), false)
  check(index.startsWith("ca"), true)
  check(index.startsWith("cat"), false)
  check(index.startsWith("carton"), false)
  index.insert(longWord)
  check(index.search(longWord), true)
  check(index.search(longWord.slice(0, -1)), false)
  check(index.startsWith(longWord.slice(0, -1)), true)
}

const probes = [new WordSet(), new Trie(false), new Trie(true)]
const letters = "abcdefghijklmnopqrstuvwxyz"
for (const index of probes) {
  for (const second of letters) {
    for (const third of letters) index.insert("a" + second + third)
  }
  assert.equal(index.startsWith("z"), false)
}
assert.deepEqual(probes.map((index) => index.lastChecks), [676, 1, 1])
console.log(`${cases}/33 ca đúng`)
console.log(`Lượt thử tiền tố: ${probes.map((index) => index.lastChecks).join(", ")}`)
