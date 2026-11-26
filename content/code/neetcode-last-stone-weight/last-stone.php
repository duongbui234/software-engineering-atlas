<?php
declare(strict_types=1);

function lastStoneWeight(array $stones): int
{
    $heap = new SplMaxHeap();
    foreach ($stones as $stone) {
        $heap->insert($stone);
    }

    while ($heap->count() > 1) {
        $heavier = $heap->extract();
        $lighter = $heap->extract();
        if ($heavier > $lighter) {
            $heap->insert($heavier - $lighter);
        }
    }

    return $heap->isEmpty() ? 0 : $heap->extract();
}

$cases = [
    [[2, 7, 4, 1, 8, 1], 1],
    [[1], 1],
    [[3, 3], 0],
    [[3, 3, 3], 3],
    [[4, 4, 2, 2], 0],
    [[10, 2, 9], 1],
    [[1000, 1], 999],
];
foreach ($cases as [$stones, $expected]) {
    if (lastStoneWeight($stones) !== $expected) {
        throw new RuntimeException('Sai với ' . json_encode($stones));
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
