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

function findItinerary(array $tickets): array
{
    $outgoing = [];
    foreach ($tickets as [$from, $to]) {
        $outgoing[$from][] = $to;
    }
    foreach (array_keys($outgoing) as $airport) {
        rsort($outgoing[$airport], SORT_STRING);
    }

    $stack = ['JFK'];
    $suffix = [];
    while ($stack !== []) {
        $current = $stack[array_key_last($stack)];
        if (!empty($outgoing[$current])) {
            $stack[] = array_pop($outgoing[$current]);
        } else {
            $suffix[] = array_pop($stack);
        }
    }
    return array_reverse($suffix);
}

// EXAMPLE
$points = [[0, 0], [4, 0], [5, 0], [5, 2]];
$tickets = [['JFK', 'AAA'], ['JFK', 'BBB'], ['BBB', 'JFK']];
if (prim($points) !== 7 || kruskal($points) !== 7) {
    throw new RuntimeException('Sai giá nối');
}
if (findItinerary($tickets) !== ['JFK', 'BBB', 'JFK', 'AAA']) {
    throw new RuntimeException('Sai hành trình');
}
echo "2/2 ca đúng\n";
