DIRECTIONS = ((-1, 0), (1, 0), (0, -1), (0, 1))
INF = 2147483647


def blank_distances(grid):
    return [[-1] * len(row) for row in grid]


def cells_with(grid, value):
    return [(r, c) for r, row in enumerate(grid) for c, cell in enumerate(row) if cell == value]


def flood(grid, distance, queue, enter):
    for r, c in queue:
        distance[r][c] = 0
    head = 0
    while head < len(queue):
        r, c = queue[head]
        head += 1
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if not (0 <= nr < len(grid) and 0 <= nc < len(grid[nr])):
                continue
            if grid[nr][nc] != enter or distance[nr][nc] != -1:
                continue
            distance[nr][nc] = distance[r][c] + 1
            queue.append((nr, nc))
    return len(queue)


def islands(grid):
    distance = blank_distances(grid)
    count, largest = 0, 0
    for r, c in cells_with(grid, 1):
        if distance[r][c] == -1:
            count += 1
            largest = max(largest, flood(grid, distance, [(r, c)], 1))
    return count, largest


def minutes(grid):
    distance = blank_distances(grid)
    flood(grid, distance, cells_with(grid, 2), 1)
    last = 0
    for r, c in cells_with(grid, 1):
        if distance[r][c] == -1:
            return -1
        last = max(last, distance[r][c])
    return last


def nearest_gates(grid):
    distance = blank_distances(grid)
    flood(grid, distance, cells_with(grid, 0), INF)
    return [
        [distance[r][c] if value == INF and distance[r][c] != -1 else value
         for c, value in enumerate(row)]
        for r, row in enumerate(grid)
    ]


land = [[1, 0, 0, 1, 1], [0, 0, 0, 1, 1], [0, 1, 0, 1, 0], [1, 1, 0, 0, 0]]
oranges = [[2, 1, 1, 0, 2], [0, 1, 1, 1, 1]]
rooms = [[INF, -1, 0], [INF, INF, INF], [0, -1, INF]]
cases = [
    islands(land) == (3, 5),
    islands([[1, 0], [0, 1]]) == (2, 1),
    islands([[0]]) == (0, 0),
    minutes(oranges) == 3,
    minutes([[2, 0, 1]]) == -1,
    minutes([[0, 2]]) == 0,
    minutes([[1]]) == -1,
    nearest_gates(rooms) == [[2, -1, 0], [1, 2, 1], [0, -1, 2]],
    nearest_gates([[0, -1, INF]])[0][2] == INF,
    nearest_gates([[INF]])[0][0] == INF,
]
if not all(cases):
    raise AssertionError("Có ca sai")
print(f"{len(cases)}/{len(cases)} ca đúng")
