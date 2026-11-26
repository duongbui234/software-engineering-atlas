<?php
declare(strict_types=1);

function kClosest(array $points, int $k): array
{
    $heap = new SplPriorityQueue();
    $heap->setExtractFlags(SplPriorityQueue::EXTR_BOTH);

    foreach ($points as [$x, $y]) {
        $distance = $x * $x + $y * $y;
        if ($heap->count() < $k) {
            $heap->insert([$x, $y], $distance);
        } elseif ($distance < $heap->top()['priority']) {
            $heap->extract();
            $heap->insert([$x, $y], $distance);
        }
    }

    $result = [];
    while (!$heap->isEmpty()) {
        $result[] = $heap->extract()['data'];
    }
    return $result;
}

$cases = [
    [[[1, 3], [-2, 2]], 1, [[-2, 2]]],
    [[[3, 3], [5, -1], [-2, 4]], 2, [[3, 3], [-2, 4]]],
    [[[0, 0]], 1, [[0, 0]]],
    [[[1, -1], [-1, 1], [2, 2]], 2, [[1, -1], [-1, 1]]],
    [[[10000, -10000], [0, 9999]], 2, [[10000, -10000], [0, 9999]]],
];
foreach ($cases as [$points, $k, $expected]) {
    $actual = kClosest($points, $k);
    sort($actual);
    sort($expected);
    if ($actual !== $expected) {
        throw new RuntimeException("Sai với k = $k: " . json_encode($points));
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
