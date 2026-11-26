class WordSet:
    def __init__(self):
        self.words = set()

    def insert(self, word):
        self.words.add(word)

    def search(self, word):
        return word in self.words

    def starts_with(self, prefix):
        return any(word.startswith(prefix) for word in self.words)


class TrieNode:
    def __init__(self, dense):
        self.children = [None] * 26 if dense else {}
        self.terminal = False

    def get(self, letter):
        if isinstance(self.children, list):
            return self.children[ord(letter) - ord("a")]
        return self.children.get(letter)

    def set(self, letter, child):
        key = ord(letter) - ord("a") if isinstance(self.children, list) else letter
        self.children[key] = child


class Trie:
    def __init__(self, dense):
        self.dense = dense
        self.root = TrieNode(dense)

    def insert(self, word):
        node = self.root
        for letter in word:
            child = node.get(letter)
            if child is None:
                child = TrieNode(self.dense)
                node.set(letter, child)
            node = child
        node.terminal = True

    def search(self, word):
        node = self.walk(word)
        return node is not None and node.terminal

    def starts_with(self, prefix):
        return self.walk(prefix) is not None

    def walk(self, text):
        node = self.root
        for letter in text:
            node = node.get(letter)
            if node is None:
                return None
        return node


def check_index(index):
    assert not index.starts_with("ca")
    for word in ("cart", "car", "cab", "car"):
        index.insert(word)
    assert index.search("car")
    assert index.search("cart")
    assert index.search("cab")
    assert not index.search("ca")
    assert index.starts_with("ca")
    assert not index.starts_with("cat")
    assert not index.starts_with("carton")
    long_word = "z" * 2000
    index.insert(long_word)
    assert index.search(long_word)
    assert not index.search(long_word[:-1])
    assert index.starts_with(long_word[:-1])


if __name__ == "__main__":
    for index in (WordSet(), Trie(False), Trie(True)):
        check_index(index)
    print("33/33 ca đúng")
