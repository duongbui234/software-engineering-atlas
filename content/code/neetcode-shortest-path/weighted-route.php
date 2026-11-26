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

function networkDelay(array $edges, int $n, int $start): int {
    $graph = array_fill(0, $n, []);
    foreach ($edges as [$from, $to, $time]) {
        $graph[$from - 1][] = [$to - 1, $time];
    }
    $lastArrival = max(leastCosts($graph, $start - 1, 0, fn($cost, $time) => $cost + $time));
    return $lastArrival === PHP_INT_MAX ? -1 : $lastArrival;
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

function cheapestFlight(int $n, array $flights, int $start, int $end, int $k): int {
    $best = array_fill(0, $n, PHP_INT_MAX);
    $best[$start] = 0;
    for ($used = 0; $used <= $k; $used++) {
        $next = $best;
        foreach ($flights as [$from, $to, $price]) {
            if ($best[$from] !== PHP_INT_MAX) {
                $next[$to] = min($next[$to], $best[$from] + $price);
            }
        }
        $best = $next;
    }
    return $best[$end] === PHP_INT_MAX ? -1 : $best[$end];
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(networkDelay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7);
check(networkDelay([[1, 2, 0], [2, 3, 0]], 3, 1), 0);
check(networkDelay([[2, 1, 7]], 3, 2), -1);
check(networkDelay([], 1, 1), 0);
check(networkDelay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4);
check(swimTime([[0]]), 0);
check(swimTime([[3, 0], [2, 1]]), 3);
check(swimTime([[0, 8, 7], [1, 6, 5], [2, 3, 4]]), 4);
check(swimTime([[0, 1, 8], [7, 2, 6], [5, 3, 4]]), 4);
check(swimTime([[0, 1], [2, 3]]), 3);
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7);
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3);
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8);
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1);
check(cheapestFlight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6);
echo "15/15 ca đúng\n";
