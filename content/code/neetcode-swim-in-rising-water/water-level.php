<?php
declare(strict_types=1);

function leastCosts(array $graph, int $start, int $initial, callable $extend): array {
    $best = array_fill(0, count($graph), PHP_INT_MAX);
    $best[$start] = $initial;
    $pending = new SplPriorityQueue();
    $pending->insert([$initial, $start], -$initial);
    while (!$pending->isEmpty()) {
        [$cost, $source] = $pending->extract();
        if ($cost !== $best[$source]) {
            continue;
        }
        foreach ($graph[$source] as [$target, $weight]) {
            $candidate = $extend($cost, $weight);
            if ($candidate < $best[$target]) {
                $best[$target] = $candidate;
                $pending->insert([$candidate, $target], -$candidate);
            }
        }
    }
    return $best;
}

function swimTime(array $grid): int {
    $n = count($grid);
    $graph = array_fill(0, $n * $n, []);
    $directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for ($row = 0; $row < $n; $row++) {
        for ($col = 0; $col < $n; $col++) {
            foreach ($directions as [$dr, $dc]) {
                $r = $row + $dr;
                $c = $col + $dc;
                if (0 <= $r && $r < $n && 0 <= $c && $c < $n) {
                    $graph[$row * $n + $col][] = [$r * $n + $c, $grid[$r][$c]];
                }
            }
        }
    }
    return leastCosts($graph, 0, $grid[0][0], 'max')[$n * $n - 1];
}

function swimByThreshold(array $grid, bool $binary): int {
    $n = count($grid);
    $reachable = static function (int $level) use ($n, $grid): bool {
        $queue = [[0, 0]];
        $seen = [0 => true];
        for ($head = 0; $head < count($queue); $head++) {
            [$row, $col] = $queue[$head];
            if ($row === $n - 1 && $col === $n - 1) return true;
            foreach ([[1, 0], [-1, 0], [0, 1], [0, -1]] as [$dr, $dc]) {
                $r = $row + $dr;
                $c = $col + $dc;
                $key = $r * $n + $c;
                if ($r >= 0 && $r < $n && $c >= 0 && $c < $n && $grid[$r][$c] <= $level && !isset($seen[$key])) {
                    $seen[$key] = true;
                    $queue[] = [$r, $c];
                }
            }
        }
        return false;
    };
    $low = max($grid[0][0], $grid[$n - 1][$n - 1]);
    $high = $n * $n - 1;
    if (!$binary) {
        while (!$reachable($low)) $low++;
        return $low;
    }
    while ($low < $high) {
        $mid = intdiv($low + $high, 2);
        if ($reachable($mid)) $high = $mid;
        else $low = $mid + 1;
    }
    return $low;
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(swimTime([[0]]), 0);
check(swimByThreshold([[0]], true), 0);
check(swimByThreshold([[0]], false), 0);
check(swimTime([[3, 0], [2, 1]]), 3);
check(swimByThreshold([[3, 0], [2, 1]], true), 3);
check(swimByThreshold([[3, 0], [2, 1]], false), 3);
check(swimTime([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4);
check(swimByThreshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], true), 4);
check(swimByThreshold([[0, 8, 7], [1, 6, 5], [2, 3, 4]], false), 4);
check(swimTime([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4);
check(swimByThreshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], true), 4);
check(swimByThreshold([[0, 1, 8], [7, 2, 6], [5, 3, 4]], false), 4);
check(swimTime([[0, 1], [2, 3]]), 3);
check(swimByThreshold([[0, 1], [2, 3]], true), 3);
check(swimByThreshold([[0, 1], [2, 3]], false), 3);
echo "5/5 ca đúng\n";
