class LengthDictionary:
    def __init__(self):
        self.words = {}
        self.comparisons = 0

    def add_word(self, word):
        bucket = self.words.get(len(word))
        if bucket is None:
            bucket = set()
            self.words[len(word)] = bucket
        bucket.add(word)

    def search(self, pattern):
        self.comparisons = 0
        for word in self.words.get(len(pattern), ()):
            for actual, expected in zip(word, pattern):
                self.comparisons += 1
                if expected != "." and actual != expected:
                    break
            else:
                return True
        return False


class TrieNode:
    def __init__(self):
        self.children = {}
        self.terminal = False


class WordDictionary:
    def __init__(self):
        self.root = TrieNode()
        self.visits = 0

    def add_word(self, word):
        node = self.root
        for char in word:
            child = node.children.get(char)
            if child is None:
                child = TrieNode()
                node.children[char] = child
            node = child
        node.terminal = True

    def search(self, pattern):
        self.visits = 0

        def match(node, index):
            self.visits += 1
            if index == len(pattern):
                return node.terminal
            char = pattern[index]
            if char != ".":
                child = node.children.get(char)
                return child is not None and match(child, index + 1)
            return any(match(child, index + 1) for child in node.children.values())

        return match(self.root, 0)


queries = [
    ("", ".", False),
    ("ape ash cape caper cave dawn dusk", "ape", True),
    ("", "ap", False),
    ("", "a.h", True),
    ("", "a.z", False),
    ("", ".a.e", True),
    ("", "..wk", False),
    ("", "ca..r", True),
    ("", "cap.", True),
    ("", ".a", False),
    ("cap", "cap", True),
    ("cape", "cape", True),
]
scan = LengthDictionary()
trie = WordDictionary()
for added, pattern, expected in queries:
    for dictionary in (scan, trie):
        for word in added.split():
            dictionary.add_word(word)
        if dictionary.search(pattern) != expected:
            raise AssertionError(pattern)

scan_probe = LengthDictionary()
trie_probe = WordDictionary()
for value in range(1000):
    word = "a" + "".join(chr(97 + digit) for digit in (value // 676, value // 26 % 26, value % 26))
    scan_probe.add_word(word)
    trie_probe.add_word(word)
if scan_probe.search("za..") or trie_probe.search("za.."):
    raise AssertionError("za..")
if (scan_probe.comparisons, trie_probe.visits) != (1000, 1):
    raise AssertionError("work")
print(f"{len(queries)}/{len(queries)} ca đúng")
print(f"So sánh khi quét: {scan_probe.comparisons}, trạng thái Trie: {trie_probe.visits}")
