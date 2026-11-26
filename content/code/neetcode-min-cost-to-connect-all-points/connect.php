<?php
declare(strict_types=1);

function distance(array $p, array $q): int
{
    return abs($p[0] - $q[0]) + abs($p[1] - $q[1]);
}

function prim(array $points): int
{
    $n = count($points);
    $inTree = array_fill(0, $n, false);
    $best = array_fill(0, $n, PHP_INT_MAX);
    $best[0] = 0;
    $total = 0;

    for ($step = 0; $step < $n; $step++) {
        $next = -1;
        for ($i = 0; $i < $n; $i++) {
            if (!$inTree[$i] && ($next === -1 || $best[$i] < $best[$next])) {
                $next = $i;
            }
        }
        $inTree[$next] = true;
        $total += $best[$next];
        for ($i = 0; $i < $n; $i++) {
            if (!$inTree[$i]) {
                $best[$i] = min($best[$i], distance($points[$next], $points[$i]));
            }
        }
    }
    return $total;
}

function root(array &$parent, int $i): int
{
    while ($parent[$i] !== $i) {
        $parent[$i] = $parent[$parent[$i]];
        $i = $parent[$i];
    }
    return $i;
}

function kruskal(array $points): int
{
    $n = count($points);
    $edges = [];
    for ($a = 0; $a < $n; $a++) {
        for ($b = $a + 1; $b < $n; $b++) {
            $edges[] = [distance($points[$a], $points[$b]), $a, $b];
        }
    }
    usort($edges, static fn(array $a, array $b): int => $a[0] <=> $b[0]);
    $parent = range(0, $n - 1);
    $size = array_fill(0, $n, 1);
    $total = 0;
    $used = 0;
    foreach ($edges as [$weight, $a, $b]) {
        $x = root($parent, $a);
        $y = root($parent, $b);
        if ($x === $y) {
            continue;
        }
        if ($size[$x] < $size[$y]) {
            [$x, $y] = [$y, $x];
        }
        $parent[$y] = $x;
        $size[$x] += $size[$y];
        $total += $weight;
        if (++$used === $n - 1) {
            break;
        }
    }
    return $total;
}

// TESTS
$cases = [
    [[[4, 8]], 0],
    [[[-2, 1], [1, 3]], 5],
    [[[0, 0], [2, 0], [0, 2], [2, 2]], 6],
    [[[0, 0], [10, 0], [11, 0], [22, 0]], 22],
    [[[-3, -3], [-3, 2], [0, 2], [0, 4]], 10],
    [[[-1000000, -1000000], [1000000, 1000000]], 4000000],
];
foreach ($cases as [$points, $expected]) {
    if (prim($points) !== $expected || kruskal($points) !== $expected) {
        throw new RuntimeException('Sai chi phí');
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
