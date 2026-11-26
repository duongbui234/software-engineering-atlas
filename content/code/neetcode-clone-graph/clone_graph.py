# LC 133 Clone Graph: ba cách đúng (DFS đệ quy, BFS, DFS lặp) và bốn cách sai hay gặp.
# Chạy: python3 clone_graph.py
from __future__ import annotations

import time
from collections import deque
from dataclasses import dataclass, field
from typing import Callable, Optional


class Node:
    def __init__(self, val: int, neighbors: Optional[list[Node]] = None):
        self.val = val
        # Không viết neighbors=[] làm giá trị mặc định: mọi nút sẽ dùng chung MỘT danh sách.
        self.neighbors = neighbors if neighbors is not None else []


# ---------- Cách 1: DFS đệ quy với sổ "cũ → mới" ----------
def clone_dfs(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    copies: dict[Node, Node] = {}  # nút gốc → bản sao; khóa là chính đối tượng (băm theo id)

    def visit(old: Node) -> Node:
        if old in copies:
            return copies[old]  # đã sao rồi: dùng lại
        copy = Node(old.val)
        copies[old] = copy  # ghi sổ TRƯỚC khi đi tiếp
        for nb in old.neighbors:
            copy.neighbors.append(visit(nb))
        return copy

    return visit(node)


# ---------- Cách 2: BFS với sổ "cũ → mới" ----------
def clone_bfs(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    copies = {node: Node(node.val)}
    queue = deque([node])
    while queue:
        old = queue.popleft()
        for nb in old.neighbors:
            if nb not in copies:
                copies[nb] = Node(nb.val)  # tạo bản sao lúc thấy lần đầu, rồi mới xếp hàng
                queue.append(nb)
            copies[old].neighbors.append(copies[nb])
    return copies[node]


# ---------- Cách 3: DFS lặp với ngăn xếp ----------
def clone_dfs_iterative(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    copies = {node: Node(node.val)}
    stack = [node]
    while stack:
        old = stack.pop()
        for nb in old.neighbors:
            if nb not in copies:
                copies[nb] = Node(nb.val)
                stack.append(nb)
            copies[old].neighbors.append(copies[nb])
    return copies[node]


# ---------- Sai 1: sao nông ----------
def wrong_shallow(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    return Node(node.val, node.neighbors)  # nút mới, nhưng hàng xóm là nút CŨ


# ---------- Sai 2: đệ quy không có sổ ----------
def wrong_no_map(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    copy = Node(node.val)
    for nb in node.neighbors:
        copy.neighbors.append(wrong_no_map(nb))
    return copy


# ---------- Sai 3: ghi sổ SAU khi đi hết hàng xóm ----------
def wrong_map_after_recurse(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    copies: dict[Node, Node] = {}

    def visit(old: Node) -> Node:
        if old in copies:
            return copies[old]
        copy = Node(old.val)
        for nb in old.neighbors:
            copy.neighbors.append(visit(nb))
        copies[old] = copy  # quá muộn
        return copy

    return visit(node)


# ---------- Sai 4: chỉ nhớ "đã thăm", không nhớ bản sao ----------
def wrong_set_only(node: Optional[Node]) -> Optional[Node]:
    if node is None:
        return None
    visited: set[Node] = set()

    def visit(old: Node) -> Node:
        visited.add(old)
        copy = Node(old.val)
        for nb in old.neighbors:
            copy.neighbors.append(Node(nb.val) if nb in visited else visit(nb))
        return copy

    return visit(node)


# ---------- Dựng đồ thị và kiểm tra ----------
def build(adj: list[list[int]]) -> Optional[Node]:
    if not adj:
        return None
    nodes = [Node(i + 1) for i in range(len(adj))]
    for i, nbs in enumerate(adj):
        nodes[i].neighbors = [nodes[v - 1] for v in nbs]
    return nodes[0]


def collect(start: Optional[Node]) -> list[Node]:
    if start is None:
        return []
    seen = {id(start)}
    order = [start]
    h = 0
    while h < len(order):
        for nb in order[h].neighbors:
            if id(nb) not in seen:
                seen.add(id(nb))
                order.append(nb)
        h += 1
    return order


def check(adj, original, copy) -> Optional[str]:
    if not adj:
        return None if copy is None else "đồ thị rỗng nhưng không trả None"
    if copy is None:
        return "trả None"
    old_ids = {id(n) for n in collect(original)}
    nodes = collect(copy)
    by_val: dict[int, Node] = {}
    for n in nodes:
        if id(n) in old_ids:
            return "dùng chung nút với bản gốc"
        if n.val in by_val:
            return f"nút {n.val} bị sao {sum(1 for x in nodes if x.val == n.val)} lần"
        by_val[n.val] = n
    if len(nodes) != len(adj):
        return f"có {len(nodes)} nút, cần {len(adj)}"
    for i, row in enumerate(adj):
        got = [x.val for x in by_val[i + 1].neighbors]
        if got != row:
            return f"hàng xóm của {i + 1} là {got}, cần {row}"
    orig = sorted(collect(original), key=lambda n: n.val)
    if [[x.val for x in n.neighbors] for n in orig] != adj:
        return "làm hỏng đồ thị gốc"
    return None


def mulberry32(seed: int) -> Callable[[], float]:
    a = seed & 0xFFFFFFFF

    def imul(x: int, y: int) -> int:
        return (x * y) & 0xFFFFFFFF

    def nxt() -> float:
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = a
        t = imul(t ^ (t >> 15), t | 1)
        t = (t ^ ((t + imul(t ^ (t >> 7), t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296

    return nxt


def random_graph(n: int, extra: int, rnd) -> list[list[int]]:
    adj: list[list[int]] = [[] for _ in range(n)]
    has: set[tuple[int, int]] = set()

    def add(a: int, b: int) -> None:
        if a == b or (a, b) in has:
            return
        has.add((a, b))
        has.add((b, a))
        adj[a].append(b + 1)
        adj[b].append(a + 1)

    for i in range(1, n):
        add(i, int(rnd() * i))
    for _ in range(extra):
        a = int(rnd() * n)
        b = int(rnd() * n)
        add(a, b)
    return adj


def chain(n: int) -> list[list[int]]:
    return [[v for v in (i, i + 2 if i < n - 1 else 0) if v > 0] for i in range(n)]


def complete(n: int) -> list[list[int]]:
    return [[j + 1 for j in range(n) if j != i] for i in range(n)]


CASES = [
    ("đồ thị rỗng", []),
    ("một nút, không cạnh", [[]]),
    ("hai nút nối nhau", [[2], [1]]),
    ("tam giác 1-2-3", [[2, 3], [1, 3], [1, 2]]),
    ("vuông 1-2-3-4 có đường chéo 1-3", [[2, 3, 4], [1, 3], [1, 2, 4], [1, 3]]),
    ("ngôi sao: 1 nối 2..6", [[2, 3, 4, 5, 6], [1], [1], [1], [1], [1]]),
    ("đường thẳng 5 nút", chain(5)),
    ("đồ thị đầy đủ 6 nút", complete(6)),
    ("đường thẳng 100 nút", chain(100)),
    ("ngẫu nhiên 100 nút, seed 42", random_graph(100, 200, mulberry32(42))),
]

FNS = [
    ("clone_dfs", clone_dfs),
    ("clone_bfs", clone_bfs),
    ("clone_dfs_iterative", clone_dfs_iterative),
    ("wrong_shallow", wrong_shallow),
    ("wrong_no_map", wrong_no_map),
    ("wrong_map_after_recurse", wrong_map_after_recurse),
    ("wrong_set_only", wrong_set_only),
]

all_ok = True
for name, fn in FNS:
    ok = 0
    fails = []
    for label, adj in CASES:
        g = build(adj)
        try:
            err = check(adj, g, fn(g))
        except Exception as e:  # RecursionError là một Exception
            err = f"ném {type(e).__name__}"
        if err is None:
            ok += 1
        else:
            fails.append(f"{label} → {err}")
    if not name.startswith("wrong") and ok != len(CASES):
        all_ok = False
    shown = ", ".join(fails[:2]) + (f" và {len(fails) - 2} ca khác" if len(fails) > 2 else "")
    print(f"{name:<24}{ok}/{len(CASES)} ca đúng" + (f"; sai ở {shown}" if fails else ""))

rnd = mulberry32(7)
agree = 0
for _ in range(500):
    n = 1 + int(rnd() * 100)
    adj = random_graph(n, int(rnd() * 3 * n), rnd)
    g = build(adj)
    if all(check(adj, g, f(g)) is None for f in (clone_dfs, clone_bfs, clone_dfs_iterative)):
        agree += 1
print(f"500 đồ thị ngẫu nhiên: cả ba cách đúng qua {agree}/500")


# Bẫy riêng của Python: @dataclass sinh __eq__ nên đặt __hash__ = None, nút không làm khóa dict được.
@dataclass
class DataNode:
    val: int
    neighbors: list = field(default_factory=list)


try:
    {DataNode(1): DataNode(1)}
    print("@dataclass làm khóa dict: chạy được")
except TypeError as e:
    print(f"@dataclass làm khóa dict: TypeError ({e})")

adj = chain(100_000)
g = build(adj)
for name, fn in FNS[:3]:
    try:
        t0 = time.perf_counter()
        c = fn(g)
        ms = (time.perf_counter() - t0) * 1000
        msg = ("đúng" if check(adj, g, c) is None else "sai") + f", {ms:.1f} ms"
    except RecursionError:
        msg = "ném RecursionError"
    print(f"đường thẳng 100 000 nút, {name}: {msg}")

print("clone_graph: các cách đúng đều qua" if all_ok else "clone_graph: CÓ CÁCH ĐÚNG BỊ SAI")
