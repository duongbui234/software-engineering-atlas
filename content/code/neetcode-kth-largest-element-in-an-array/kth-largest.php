<?php
declare(strict_types=1);

function findKthLargest(array $nums, int $k): int
{
    $top = new SplMinHeap();
    foreach ($nums as $num) {
        if ($top->count() < $k) {
            $top->insert($num);
        } elseif ($num > $top->top()) {
            $top->extract();
            $top->insert($num);
        }
    }
    return $top->top();
}

$cases = [
    [[3, 2, 1, 5, 6, 4], 2, 5],
    [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4, 4],
    [[-5, -1, -2], 1, -1],
    [[-10000, 10000], 2, -10000],
    [[2, 2, 2, 2], 3, 2],
    [[42], 1, 42],
];
foreach ($cases as [$nums, $k, $expected]) {
    if (findKthLargest($nums, $k) !== $expected) {
        throw new RuntimeException("Sai với k = $k: " . json_encode($nums));
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
