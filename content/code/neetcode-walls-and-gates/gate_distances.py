INF = 2**31 - 1
DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]


def from_room(rooms, start):
    rows, cols = len(rooms), len(rooms[0])
    queue = [start]
    distance = [-1] * (rows * cols)
    distance[start] = 0

    for head, cell in enumerate(queue):
        r, c = divmod(cell, cols)
        if rooms[r][c] == 0:
            return distance[cell], head + 1
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            neighbor = nr * cols + nc
            if rooms[nr][nc] == -1 or distance[neighbor] != -1:
                continue
            distance[neighbor] = distance[cell] + 1
            queue.append(neighbor)
    return INF, len(queue)


def per_room(rooms):
    popped = 0
    cols = len(rooms[0])
    for r, row in enumerate(rooms):
        for c in range(cols):
            if row[c] != INF:
                continue
            row[c], visits = from_room(rooms, r * cols + c)
            popped += visits
    return popped


def from_all_gates(rooms):
    rows, cols = len(rooms), len(rooms[0])
    queue = [r * cols + c for r in range(rows) for c in range(cols) if rooms[r][c] == 0]
    for cell in queue:
        r, c = divmod(cell, cols)
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if rooms[nr][nc] != INF:
                continue
            rooms[nr][nc] = rooms[r][c] + 1
            queue.append(nr * cols + nc)
    return len(queue)


def check(before, expected):
    for fill in (per_room, from_all_gates):
        work = [row[:] for row in before]
        fill(work)
        assert work == expected, fill.__name__


cases = [
    (
        [[0, -1, INF, INF, 0], [INF, INF, INF, -1, INF], [INF, -1, INF, -1, -1], [INF, INF, INF, -1, INF]],
        [[0, -1, 2, 1, 0], [1, 2, 3, -1, 1], [2, -1, 4, -1, -1], [3, 4, 5, -1, INF]],
    ),
    ([[INF, 0, INF, INF, 0, INF]], [[1, 0, 1, 1, 0, 1]]),
    ([[0, -1, INF]], [[0, -1, INF]]),
    ([[INF, INF], [INF, -1]], [[INF, INF], [INF, -1]]),
    ([[0]], [[0]]),
    ([[-1], [INF], [0], [INF]], [[-1], [1], [0], [1]]),
    ([[0, -1, INF], [INF, INF, INF]], [[0, -1, 4], [1, 2, 3]]),
]
for before, expected in cases:
    check(before, expected)
print(f"{len(cases)}/{len(cases)} ca đúng")

room_by_room = [[INF] * 24 for _ in range(24)]
room_by_room[0][0] = 0
in_one_pass = [row[:] for row in room_by_room]
repeated_pops = per_room(room_by_room)
shared_pops = from_all_gates(in_one_pass)
assert room_by_room == in_one_pass
print(f"Số lượt lấy ô khỏi hàng đợi: {repeated_pops} / {shared_pops}")
