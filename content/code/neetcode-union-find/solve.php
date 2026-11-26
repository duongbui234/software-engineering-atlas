<?php
declare(strict_types=1);

final class DisjointSet
{
    private array $parent;
    private array $size;
    public int $count;

    public function __construct(int $n)
    {
        $this->parent = range(0, $n - 1);
        $this->size = array_fill(0, $n, 1);
        $this->count = $n;
    }

    public function find(int $node): int
    {
        while ($node !== $this->parent[$node]) {
            $this->parent[$node] = $this->parent[$this->parent[$node]];
            $node = $this->parent[$node];
        }
        return $node;
    }

    public function union(int $a, int $b): bool
    {
        [$ra, $rb] = [$this->find($a), $this->find($b)];
        if ($ra === $rb) {
            return false;
        }
        if ($this->size[$ra] < $this->size[$rb]) {
            [$ra, $rb] = [$rb, $ra];
        }
        $this->parent[$rb] = $ra;
        $this->size[$ra] += $this->size[$rb];
        $this->count--;
        return true;
    }
}

function adjacency(int $n, array $edges): array
{
    $adj = array_fill(0, $n, []);
    foreach ($edges as [$a, $b]) {
        $adj[$a][] = $b;
        $adj[$b][] = $a;
    }
    return $adj;
}

function walk(array $adj, int $start, array &$seen): int
{
    $pending = [$start];
    $seen[$start] = true;
    $visited = 0;
    while ($pending !== []) {
        $node = array_pop($pending);
        $visited++;
        foreach ($adj[$node] as $next) {
            if (!$seen[$next]) {
                $seen[$next] = true;
                $pending[] = $next;
            }
        }
    }
    return $visited;
}

function redundantByDsu(int $n, array $edges): array
{
    $ds = new DisjointSet($n + 1);
    foreach ($edges as [$a, $b]) {
        if (!$ds->union($a, $b)) {
            return [$a, $b];
        }
    }
    throw new InvalidArgumentException('Cần đúng một cạnh dư');
}

function redundantByWalk(int $n, array $edges): array
{
    $adj = adjacency($n + 1, []);
    foreach ($edges as [$a, $b]) {
        $seen = array_fill(0, $n + 1, false);
        walk($adj, $a, $seen);
        if ($seen[$b]) {
            return [$a, $b];
        }
        $adj[$a][] = $b;
        $adj[$b][] = $a;
    }
    throw new InvalidArgumentException('Cần đúng một cạnh dư');
}

function componentsByDsu(int $n, array $edges): int
{
    $ds = new DisjointSet($n);
    foreach ($edges as [$a, $b]) {
        $ds->union($a, $b);
    }
    return $ds->count;
}

function componentsByWalk(int $n, array $edges): int
{
    $adj = adjacency($n, $edges);
    $seen = array_fill(0, $n, false);
    $count = 0;
    for ($v = 0; $v < $n; $v++) {
        if (!$seen[$v]) {
            walk($adj, $v, $seen);
            $count++;
        }
    }
    return $count;
}

function treeByDsu(int $n, array $edges): bool
{
    if (count($edges) !== $n - 1) {
        return false;
    }
    $ds = new DisjointSet($n);
    foreach ($edges as [$a, $b]) {
        if (!$ds->union($a, $b)) {
            return false;
        }
    }
    return true;
}

function treeByWalk(int $n, array $edges): bool
{
    if (count($edges) !== $n - 1) {
        return false;
    }
    $seen = array_fill(0, $n, false);
    return walk(adjacency($n, $edges), 0, $seen) === $n;
}

if (redundantByDsu(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]) !== [1, 2] || redundantByWalk(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]) !== [1, 2]) {
    throw new RuntimeException('Ca redundant n=5');
}
if (redundantByDsu(4, [[1, 4], [1, 3], [2, 4], [2, 3]]) !== [2, 3] || redundantByWalk(4, [[1, 4], [1, 3], [2, 4], [2, 3]]) !== [2, 3]) {
    throw new RuntimeException('Ca redundant n=4');
}
if (redundantByDsu(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]) !== [3, 4] || redundantByWalk(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]) !== [3, 4]) {
    throw new RuntimeException('Ca redundant n=6');
}

if (componentsByDsu(7, [[0, 2], [2, 4], [0, 4], [1, 3]]) !== 4 || componentsByWalk(7, [[0, 2], [2, 4], [0, 4], [1, 3]]) !== 4) {
    throw new RuntimeException('Ca components n=7');
}
if (componentsByDsu(5, [[3, 4], [1, 2], [0, 4], [2, 3]]) !== 1 || componentsByWalk(5, [[3, 4], [1, 2], [0, 4], [2, 3]]) !== 1) {
    throw new RuntimeException('Ca components n=5');
}
if (componentsByDsu(1, []) !== 1 || componentsByWalk(1, []) !== 1) {
    throw new RuntimeException('Ca components n=1');
}
if (componentsByDsu(6, [[2, 5]]) !== 5 || componentsByWalk(6, [[2, 5]]) !== 5) {
    throw new RuntimeException('Ca components n=6');
}
if (componentsByDsu(4, []) !== 4 || componentsByWalk(4, []) !== 4) {
    throw new RuntimeException('Ca components n=4');
}

if (treeByDsu(1, []) !== true || treeByWalk(1, []) !== true) {
    throw new RuntimeException('Ca tree n=1');
}
if (treeByDsu(3, [[0, 2], [2, 1]]) !== true || treeByWalk(3, [[0, 2], [2, 1]]) !== true) {
    throw new RuntimeException('Ca tree n=3');
}
if (treeByDsu(5, [[0, 1], [1, 2], [0, 2], [3, 4]]) !== false || treeByWalk(5, [[0, 1], [1, 2], [0, 2], [3, 4]]) !== false) {
    throw new RuntimeException('Ca tree n=5');
}
if (treeByDsu(5, [[0, 1], [1, 2], [3, 4]]) !== false || treeByWalk(5, [[0, 1], [1, 2], [3, 4]]) !== false) {
    throw new RuntimeException('Ca tree n=5');
}
if (treeByDsu(4, [[0, 1], [1, 3], [2, 3], [0, 2]]) !== false || treeByWalk(4, [[0, 1], [1, 3], [2, 3], [0, 2]]) !== false) {
    throw new RuntimeException('Ca tree n=4');
}
echo "26/26 ca đúng\n";
