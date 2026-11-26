class LengthDictionary {
  private words = new Map<number, Set<string>>()
  comparisons = 0

  addWord(word: string) {
    let bucket = this.words.get(word.length)
    if (bucket === undefined) {
      bucket = new Set()
      this.words.set(word.length, bucket)
    }
    bucket.add(word)
  }

  search(pattern: string): boolean {
    this.comparisons = 0
    for (const word of this.words.get(pattern.length) ?? []) {
      let index = 0
      for (; index < pattern.length; index++) {
        this.comparisons++
        if (pattern[index] !== "." && pattern[index] !== word[index]) break
      }
      if (index === pattern.length) return true
    }
    return false
  }
}

class TrieNode {
  children = new Map<string, TrieNode>()
  terminal = false
}

class WordDictionary {
  private root = new TrieNode()
  visits = 0

  addWord(word: string) {
    let node = this.root
    for (const char of word) {
      let child = node.children.get(char)
      if (child === undefined) {
        child = new TrieNode()
        node.children.set(char, child)
      }
      node = child
    }
    node.terminal = true
  }

  search(pattern: string): boolean {
    this.visits = 0
    const match = (node: TrieNode, index: number): boolean => {
      this.visits++
      if (index === pattern.length) return node.terminal
      const char = pattern[index]
      if (char !== ".") {
        const child = node.children.get(char)
        return child !== undefined && match(child, index + 1)
      }
      for (const child of node.children.values()) {
        if (match(child, index + 1)) return true
      }
      return false
    }
    return match(this.root, 0)
  }
}

const queries = [
  ["", ".", false],
  ["ape ash cape caper cave dawn dusk", "ape", true],
  ["", "ap", false],
  ["", "a.h", true],
  ["", "a.z", false],
  ["", ".a.e", true],
  ["", "..wk", false],
  ["", "ca..r", true],
  ["", "cap.", true],
  ["", ".a", false],
  ["cap", "cap", true],
  ["cape", "cape", true],
] as const
const scan = new LengthDictionary()
const trie = new WordDictionary()
for (const [added, pattern, expected] of queries) {
  for (const dictionary of [scan, trie]) {
    if (added) for (const word of added.split(" ")) dictionary.addWord(word)
    if (dictionary.search(pattern) !== expected) throw new Error(pattern)
  }
}

const scanProbe = new LengthDictionary()
const trieProbe = new WordDictionary()
for (let value = 0; value < 1000; value++) {
  const word = "a" + String.fromCharCode(
    97 + Math.floor(value / 676),
    97 + Math.floor(value / 26) % 26,
    97 + value % 26,
  )
  scanProbe.addWord(word)
  trieProbe.addWord(word)
}
if (scanProbe.search("za..") || trieProbe.search("za..")) throw new Error("za..")
if (scanProbe.comparisons !== 1000 || trieProbe.visits !== 1) throw new Error("work")
console.log(`${queries.length}/${queries.length} ca đúng`)
console.log(`So sánh khi quét: ${scanProbe.comparisons}, trạng thái Trie: ${trieProbe.visits}`)
