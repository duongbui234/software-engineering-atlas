<?php
declare(strict_types=1);

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

function cheapestByRoutes(int $n, array $flights, int $start, int $end, int $k): int {
    $adj = array_fill(0, $n, []);
    foreach ($flights as [$from, $to, $fare]) $adj[$from][] = [$to, $fare];
    $visit = static function (int $city, int $remaining) use (&$visit, $adj, $end): int {
        if ($city === $end) return 0;
        if ($remaining === 0) return PHP_INT_MAX;
        $best = PHP_INT_MAX;
        foreach ($adj[$city] as [$next, $fare]) {
            $tail = $visit($next, $remaining - 1);
            if ($tail !== PHP_INT_MAX) $best = min($best, $fare + $tail);
        }
        return $best;
    };
    $fare = $visit($start, $k + 1);
    return $fare === PHP_INT_MAX ? -1 : $fare;
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7);
check(cheapestByRoutes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 1), 7);
check(cheapestFlight(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3);
check(cheapestByRoutes(4, [[0, 1, 1], [1, 2, 1], [0, 2, 6], [2, 3, 1]], 0, 3, 2), 3);
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8);
check(cheapestByRoutes(3, [[0, 1, 1], [1, 2, 1], [0, 2, 8]], 0, 2, 0), 8);
check(cheapestFlight(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1);
check(cheapestByRoutes(3, [[0, 1, 1], [1, 2, 1]], 0, 2, 0), -1);
check(cheapestFlight(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6);
check(cheapestByRoutes(3, [[0, 1, 4], [1, 0, 1], [1, 2, 2]], 0, 2, 2), 6);
echo "5/5 ca đúng\n";
