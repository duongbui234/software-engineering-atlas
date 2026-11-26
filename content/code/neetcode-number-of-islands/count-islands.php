<?php
declare(strict_types=1);

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function floodBfs(array $grid): int
{
    $rows = count($grid);
    $cols = count($grid[0]);
    $seen = array_fill(0, $rows * $cols, false);
    $result = 0;

    for ($start = 0; $start < $rows * $cols; $start++) {
        if ($grid[intdiv($start, $cols)][$start % $cols] !== 1 || $seen[$start]) {
            continue;
        }

        $result++;
        $queue = [$start];
        $seen[$start] = true;
        for ($head = 0; $head < count($queue); $head++) {
            $cell = $queue[$head];
            $row = intdiv($cell, $cols);
            $col = $cell % $cols;
            foreach (DIRECTIONS as [$dr, $dc]) {
                $r = $row + $dr;
                $c = $col + $dc;
                if ($r < 0 || $r >= $rows || $c < 0 || $c >= $cols || $grid[$r][$c] !== 1) {
                    continue;
                }
                $next = $r * $cols + $c;
                if ($seen[$next]) {
                    continue;
                }
                $seen[$next] = true;
                $queue[] = $next;
            }
        }
    }
    return $result;
}

function floodDfsInPlace(array &$grid): int
{
    $rows = count($grid);
    $cols = count($grid[0]);
    $result = 0;

    for ($start = 0; $start < $rows * $cols; $start++) {
        $row = intdiv($start, $cols);
        $col = $start % $cols;
        if ($grid[$row][$col] !== 1) {
            continue;
        }

        $result++;
        $stack = [$start];
        $grid[$row][$col] = 0;
        while ($stack) {
            $cell = array_pop($stack);
            $cr = intdiv($cell, $cols);
            $cc = $cell % $cols;
            foreach (DIRECTIONS as [$dr, $dc]) {
                $r = $cr + $dr;
                $c = $cc + $dc;
                if ($r < 0 || $r >= $rows || $c < 0 || $c >= $cols || $grid[$r][$c] !== 1) {
                    continue;
                }
                $grid[$r][$c] = 0;
                $stack[] = $r * $cols + $c;
            }
        }
    }
    return $result;
}

$cases = [
    [["10011", "00011", "01010", "11000"], 3],
    [["100", "010", "001"], 3],
    [["000", "000"], 0],
    [["11111"], 1],
    [["11", "11"], 1],
    [array_fill(0, 300, str_repeat("1", 300)), 1],
];
foreach ($cases as [$rows, $want]) {
    $cells = array_map(fn(string $row): array => array_map('intval', str_split($row)), $rows);
    $before = $cells;
    if (floodBfs($cells) !== $want || $cells !== $before) {
        throw new RuntimeException("BFS sai");
    }
    if (floodDfsInPlace($cells) !== $want) {
        throw new RuntimeException("DFS sai");
    }
    foreach ($cells as $row) {
        if (array_sum($row) !== 0) {
            throw new RuntimeException("DFS sai");
        }
    }
}
$n = count($cases);
echo "{$n}/{$n} ca đúng\n";
