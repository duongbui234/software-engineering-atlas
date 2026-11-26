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
echo "10/10 ca đúng\n";
