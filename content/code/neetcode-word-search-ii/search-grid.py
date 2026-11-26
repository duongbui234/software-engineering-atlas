DIRECTIONS = ((0, 1), (1, 0), (0, -1), (-1, 0))


def per_word(board, words):
    rows, cols = len(board), len(board[0])
    found = []
    advances = 0

    def match(row, col, word, index):
        nonlocal advances
        if not (0 <= row < rows and 0 <= col < cols):
            return False
        if board[row][col] != word[index]:
            return False
        advances += 1
        if index + 1 == len(word):
            return True
        letter = board[row][col]
        board[row][col] = "#"
        hit = any(
            match(row + dr, col + dc, word, index + 1)
            for dr, dc in DIRECTIONS
        )
        board[row][col] = letter
        return hit

    for word in words:
        if any(match(r, c, word, 0) for r in range(rows) for c in range(cols)):
            found.append(word)
    return found, advances


class Node:
    def __init__(self):
        self.children = {}
        self.word = None


def with_trie(board, words):
    root = Node()
    for word in words:
        node = root
        for letter in word:
            if letter not in node.children:
                node.children[letter] = Node()
            node = node.children[letter]
        node.word = word

    rows, cols = len(board), len(board[0])
    found = []
    advances = 0

    def visit(row, col, parent):
        nonlocal advances
        if not (0 <= row < rows and 0 <= col < cols):
            return
        letter = board[row][col]
        node = parent.children.get(letter)
        if node is None:
            return
        advances += 1
        if node.word is not None:
            found.append(node.word)
            node.word = None
        board[row][col] = "#"
        for dr, dc in DIRECTIONS:
            if not node.children:
                break
            visit(row + dr, col + dc, node)
        board[row][col] = letter
        if not node.children:
            del parent.children[letter]

    for row in range(rows):
        for col in range(cols):
            visit(row, col, root)
    return found, advances


CASES = [
    (["car", "tpx", "xex"], ["cap", "cape", "car", "cart", "capa", "cat"], ["cap", "cape", "car"]),
    (["aaa"], ["a", "aa", "aaa", "aaaa"], ["a", "aa", "aaa"]),
    (["ax", "xb"], ["ab", "axb", "axxb"], ["axb"]),
    (["z"], ["a", "z", "zz"], ["z"]),
    (["yx", "xy"], ["aaa", "zzz"], []),
]

for rows, words, expected in CASES:
    board = [list(row) for row in rows]
    for search in (per_word, with_trie):
        found, _ = search(board, words)
        assert sorted(found) == expected
        assert ["".join(row) for row in board] == rows

board = [list("aaa") for _ in range(3)]
words = ["aaaaa" + last for last in "bcdefghijk"]
left, separate = per_word(board, words)
right, shared = with_trie(board, words)
assert not left and not right and separate == 10 * shared and shared > 0
print(f"{len(CASES) + 1}/{len(CASES) + 1} ca đúng")
print(f"Bước khớp: {separate} / {shared}")
