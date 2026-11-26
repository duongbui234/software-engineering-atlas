# LC 127 Word Ladder: BFS trên đồ thị ẩn, cùng bộ ca với bản TypeScript.
# Chạy: python3 word_ladder.py
import time
from collections import deque, defaultdict

LETTERS = "abcdefghijklmnopqrstuvwxyz"
expanded = 0  # số từ đã lấy ra để tìm hàng xóm, dùng cho phép đo


def differ_by_one(a, b):
    diff = 0
    for x, y in zip(a, b):
        if x != y:
            diff += 1
            if diff > 1:
                return False
    return diff == 1


# Cách 1: BFS, so với từng từ trong danh sách. O(n²·L).
def ladder_pairwise(begin, end, word_list):
    global expanded
    if end not in word_list:
        return 0
    seen = {begin}
    level = [begin]
    words = 1
    while level:
        nxt = []
        for word in level:
            expanded += 1
            if word == end:
                return words
            for candidate in word_list:
                if candidate not in seen and differ_by_one(word, candidate):
                    seen.add(candidate)  # đánh dấu lúc đưa vào
                    nxt.append(candidate)
        level = nxt
        words += 1
    return 0


# Cách 2: BFS, đổi từng chữ thành a..z. O(n·L·26).
def ladder_letters(begin, end, word_list):
    global expanded
    unseen = set(word_list)
    if end not in unseen:
        return 0
    unseen.discard(begin)
    queue = deque([(begin, 1)])
    while queue:
        word, d = queue.popleft()
        expanded += 1
        if word == end:
            return d
        for i in range(len(word)):
            prefix, suffix = word[:i], word[i + 1:]
            for ch in LETTERS:
                candidate = prefix + ch + suffix
                if candidate in unseen:
                    unseen.remove(candidate)
                    queue.append((candidate, d + 1))
    return 0


# Cách 3: gom từ theo mẫu có dấu *, ví dụ "c*ld".
def ladder_buckets(begin, end, word_list):
    global expanded
    if end not in word_list:
        return 0
    buckets = defaultdict(list)
    for word in word_list:
        for i in range(len(word)):
            buckets[word[:i] + "*" + word[i + 1:]].append(word)
    seen = {begin}
    level = [begin]
    words = 1
    while level:
        nxt = []
        for word in level:
            expanded += 1
            if word == end:
                return words
            for i in range(len(word)):
                key = word[:i] + "*" + word[i + 1:]
                for candidate in buckets.pop(key, ()):  # một xô chỉ mở một lần
                    if candidate not in seen:
                        seen.add(candidate)
                        nxt.append(candidate)
        level = nxt
        words += 1
    return 0


# Cách 4: BFS hai đầu, luôn nới bên có tầng nhỏ hơn.
def ladder_bidirectional(begin, end, word_list):
    global expanded
    unseen = set(word_list)
    if end not in unseen:
        return 0
    unseen.discard(begin)
    unseen.discard(end)
    front, front_set = [begin], {begin}
    back, back_set = [end], {end}
    words = 2
    while front and back:
        if len(front) > len(back):
            front, back = back, front
            front_set, back_set = back_set, front_set
        nxt = []
        for word in front:
            expanded += 1
            for i in range(len(word)):
                prefix, suffix = word[:i], word[i + 1:]
                for ch in LETTERS:
                    candidate = prefix + ch + suffix
                    if candidate in back_set:
                        return words  # hai phía gặp nhau
                    if candidate in unseen:
                        unseen.remove(candidate)
                        nxt.append(candidate)
        front, front_set = nxt, set(nxt)
        words += 1
    return 0


# SAI: DFS trả độ dài đường đầu tiên tìm thấy.
def wrong_dfs_first_path(begin, end, word_list):
    unseen = set(word_list)
    if end not in unseen:
        return 0
    unseen.discard(begin)

    def dfs(word, words):
        if word == end:
            return words
        for i in range(len(word)):
            for ch in LETTERS:
                candidate = word[:i] + ch + word[i + 1:]
                if candidate in unseen:
                    unseen.remove(candidate)
                    found = dfs(candidate, words + 1)
                    if found:
                        return found
        return 0

    return dfs(begin, 1)


# SAI: đếm số bước (cạnh) thay vì số từ.
def wrong_count_edges(begin, end, word_list):
    words = ladder_letters(begin, end, word_list)
    return 0 if words == 0 else words - 1


# SAI: thấy endWord cách một chữ là trả về, quên kiểm endWord có trong danh sách.
def wrong_skip_end_check(begin, end, word_list):
    seen = {begin}
    level = [begin]
    words = 1
    while level:
        nxt = []
        for word in level:
            if differ_by_one(word, end):
                return words + 1
            for candidate in word_list:
                if candidate not in seen and differ_by_one(word, candidate):
                    seen.add(candidate)
                    nxt.append(candidate)
        level = nxt
        words += 1
    return 0


CASES = [
    ("cold → warm", "cold", "warm", ["cord", "card", "ward", "warm", "corm", "worm", "word"], 5),
    ("cat → dog", "cat", "dog", ["cot", "cog", "dog", "bat"], 4),
    ("đích không có trong danh sách", "cat", "dog", ["cot", "cog"], 0),
    ("không có đường", "aaa", "bbb", ["bbb", "abc"], 0),
    ("một bước", "ab", "cb", ["cb"], 2),
    ("từ đầu nằm trong danh sách", "pen", "pin", ["pen", "pin"], 2),
    ("từ một chữ", "a", "c", ["a", "b", "c"], 2),
    ("DFS đi vòng", "aa", "bb", ["ca", "cb", "bb", "ab"], 3),
]

SOLVERS = [
    ("ladder_pairwise", ladder_pairwise),
    ("ladder_letters", ladder_letters),
    ("ladder_buckets", ladder_buckets),
    ("ladder_bidirectional", ladder_bidirectional),
    ("wrong_dfs_first_path", wrong_dfs_first_path),
    ("wrong_count_edges", wrong_count_edges),
    ("wrong_skip_end_check", wrong_skip_end_check),
]

for name, solve in SOLVERS:
    wrong = []
    for label, begin, end, lst, want in CASES:
        got = solve(begin, end, list(lst))
        if got != want:
            wrong.append(f"{label} → {got}")
    ok = len(CASES) - len(wrong)
    tail = "; sai ở " + ", ".join(wrong) if wrong else ""
    print(f"{name:<20} {ok}/{len(CASES)} ca đúng{tail}")

seed = 42


def rand(n):
    global seed
    seed = seed * 48271 % 2147483647  # Park–Miller
    return seed % n


def random_word(length, alphabet):
    return "".join(chr(97 + rand(alphabet)) for _ in range(length))


agree = 0
TRIALS = 2000
for _ in range(TRIALS):
    length = 2 + rand(3)
    size = 1 + rand(min(30, 3 ** length))
    words, seen_words = [], set()
    while len(words) < size:
        w = random_word(length, 3)
        if w not in seen_words:
            seen_words.add(w)
            words.append(w)
    begin = random_word(length, 3)
    end = words[rand(len(words))]
    if begin == end:
        agree += 1
        continue
    answers = [f(begin, end, list(words)) for f in (ladder_pairwise, ladder_letters, ladder_buckets, ladder_bidirectional)]
    if all(a == answers[0] for a in answers):
        agree += 1
print(f"ngẫu nhiên: {agree}/{TRIALS} bộ từ điển, bốn cách khớp nhau")


# Hai từ điển 5000 từ dài 6: "dày" (chữ a..e ngẫu nhiên) và "thưa" (mỗi từ mới đổi một chữ của từ có sẵn).
def make_dict(kind):
    global seed
    seed = 7
    words, seen_words = [], set()
    if kind == "dày":
        while len(words) < 5000:
            w = random_word(6, 5)
            if w not in seen_words:
                seen_words.add(w)
                words.append(w)
        return words
    words = [random_word(6, 26)]
    seen_words.add(words[0])
    while len(words) < 5000:
        chars = list(words[rand(len(words))])
        pos = rand(6)  # Python tính vế phải trước vế trái, nên tách ra cho cố định
        chars[pos] = chr(97 + rand(26))
        w = "".join(chars)
        if w not in seen_words:
            seen_words.add(w)
            words.append(w)
    return words


def farthest(words):
    unseen = set(words)
    unseen.discard(words[0])
    level, last = [words[0]], words[0]
    while level:
        last = level[-1]
        nxt = []
        for w in level:
            for i in range(len(w)):
                for ch in LETTERS:
                    candidate = w[:i] + ch + w[i + 1:]
                    if candidate in unseen:
                        unseen.remove(candidate)
                        nxt.append(candidate)
        level = nxt
    return last


def bench(kind):
    global expanded
    words = make_dict(kind)
    begin, end = words[0], farthest(words)
    print(f"từ điển {kind}, 5000 từ: {begin} → {end}")
    for name, solve in SOLVERS[:4]:
        expanded = 0
        t0 = time.perf_counter()
        ans = solve(begin, end, words)
        ms = (time.perf_counter() - t0) * 1000
        print(f"  {name:<20} đáp án {ans}, lấy ra {expanded} từ, {ms:.1f} ms")


bench("dày")
bench("thưa")


# Bẫy đánh dấu lúc lấy ra: đáp án vẫn đúng nhưng hàng đợi phình to.
def pushes_mark_on_dequeue(begin, end, word_list):
    dictionary = set(word_list)
    visited = set()
    queue = deque([(begin, 1)])
    pushes = 1
    while queue:
        word, d = queue.popleft()
        if word in visited:
            continue
        visited.add(word)  # đánh dấu muộn: lúc lấy ra
        if word == end:
            return d, pushes
        for i in range(len(word)):
            for ch in LETTERS:
                candidate = word[:i] + ch + word[i + 1:]
                if candidate in dictionary and candidate not in visited:
                    queue.append((candidate, d + 1))
                    pushes += 1
    return 0, pushes


words = make_dict("dày")
end = farthest(words)
ans, pushes = pushes_mark_on_dequeue(words[0], end, words)
good = ladder_letters(words[0], end, words)
print(f"từ điển dày, đánh dấu lúc lấy ra: đáp án {ans}, {pushes} lượt đưa vào hàng đợi; đánh dấu lúc đưa vào: đáp án {good}, tối đa 5000 lượt")
