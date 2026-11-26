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

function networkByRounds(array $edges, int $n, int $start): int {
    $best = array_fill(0, $n, PHP_INT_MAX);
    $best[$start - 1] = 0;
    for ($layer = 1; $layer < $n; $layer++) {
        $next = $best;
        foreach ($edges as [$from, $to, $weight]) {
            $cost = $best[$from - 1];
            if ($cost !== PHP_INT_MAX) {
                $next[$to - 1] = min($next[$to - 1], $cost + $weight);
            }
        }
        $best = $next;
    }
    $last = max($best);
    return $last === PHP_INT_MAX ? -1 : $last;
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(networkDelay([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7);
check(networkByRounds([[1, 2, 9], [1, 3, 2], [3, 2, 1], [2, 4, 4]], 4, 1), 7);
check(networkDelay([[1, 2, 0], [2, 3, 0]], 3, 1), 0);
check(networkByRounds([[1, 2, 0], [2, 3, 0]], 3, 1), 0);
check(networkDelay([[2, 1, 7]], 3, 2), -1);
check(networkByRounds([[2, 1, 7]], 3, 2), -1);
check(networkDelay([], 1, 1), 0);
check(networkByRounds([], 1, 1), 0);
check(networkDelay([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4);
check(networkByRounds([[1, 2, 8], [1, 3, 2], [3, 2, 6], [3, 4, 1], [4, 2, 1]], 4, 1), 4);
echo "5/5 ca đúng\n";
