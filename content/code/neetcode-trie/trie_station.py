class TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None


def insert(root, word):
    node = root
    for letter in word:
        if letter not in node.children:
            node.children[letter] = TrieNode()
        node = node.children[letter]
    node.word = word


def walk(root, text):
    node = root
    for letter in text:
        node = node.children.get(letter)
        if node is None:
            break
    return node


def matches(node, pattern, i=0):
    if i == len(pattern):
        return node.word is not None
    if pattern[i] == ".":
        return any(matches(child, pattern, i + 1) for child in node.children.values())
    child = node.children.get(pattern[i])
    return child is not None and matches(child, pattern, i + 1)


def find_words(board, words):
    root = TrieNode()
    for word in words:
        insert(root, word)
    found = set()

    def visit(row, col, parent):
        if not (0 <= row < len(board) and 0 <= col < len(board[row])):
            return
        letter = board[row][col]
        if letter == "#":
            return
        node = parent.children.get(letter)
        if node is None:
            return
        if node.word is not None:
            found.add(node.word)
        board[row][col] = "#"
        visit(row - 1, col, node)
        visit(row + 1, col, node)
        visit(row, col - 1, node)
        visit(row, col + 1, node)
        board[row][col] = letter

    for r, row in enumerate(board):
        for c in range(len(row)):
            visit(r, c, root)
    return sorted(found)


root = TrieNode()
for word in ("cart", "cat", "dog"):
    insert(root, word)
board = [list("cat"), list("dre")]
cases = [
    walk(root, "car") is not None,
    walk(root, "car").word is None,
    walk(root, "cart").word == "cart",
    walk(root, "cab") is None,
    matches(root, "ca."),
    matches(root, "c..t"),
    matches(root, ".og"),
    not matches(root, "c.t."),
    not matches(root, "do"),
    find_words(board, ["car", "care", "cat", "cart", "cata"]) == ["car", "care", "cat"],
    board == [list("cat"), list("dre")],
    find_words([list("aa")], ["a", "aa", "aaa"]) == ["a", "aa"],
]
insert(root, "car")
cases.append(walk(root, "car").word == "car" and walk(root, "cart").word == "cart")
if not all(cases):
    raise AssertionError("Có ca sai")
print(f"{len(cases)}/{len(cases)} ca đúng")
