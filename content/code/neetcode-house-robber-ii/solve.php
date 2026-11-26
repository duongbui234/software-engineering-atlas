<?php
declare(strict_types=1);

function rolling(array $nums, int $start, int $end): int
{
    $twoBack = 0;
    $oneBack = 0;
    for ($i = $start; $i < $end; $i++) {
        [$twoBack, $oneBack] = [$oneBack, max($oneBack, $twoBack + $nums[$i])];
    }
    return $oneBack;
}

function table(array $nums, int $start, int $end): int
{
    $best = array_fill(0, $end - $start + 2, 0);
    for ($i = $start; $i < $end; $i++) {
        $j = $i - $start;
        $best[$j + 2] = max($best[$j + 1], $best[$j] + $nums[$i]);
    }
    return $best[count($best) - 1];
}

function brute(array $nums, int $i, int $end): int
{
    if ($i >= $end) {
        return 0;
    }
    return max(brute($nums, $i + 1, $end), $nums[$i] + brute($nums, $i + 2, $end));
}

function rob(array $nums, callable $solve): int
{
    if (count($nums) === 1) {
        return $nums[0];
    }
    return max($solve($nums, 0, count($nums) - 1), $solve($nums, 1, count($nums)));
}

$cases = [
    [[8], 8],
    [[0, 0, 0], 0],
    [[8, 11, 8], 11],
    [[9, 1, 1, 9], 10],
    [[4, 9, 1, 8, 3, 7], 24],
    [[10, 1], 10],
];
$passed = 0;
foreach ($cases as [$nums, $expected]) {
    foreach (['brute', 'table', 'rolling'] as $solve) {
        if (rob($nums, $solve) !== $expected) {
            throw new RuntimeException('Sai ca ' . json_encode($nums));
        }
        $passed++;
    }
}
foreach (['table', 'rolling'] as $solve) {
    if (rob(array_fill(0, 100, 3), $solve) !== 150) {
        throw new RuntimeException('Sai ca dài');
    }
    $passed++;
}
printf("%d/%d ca đúng\n", $passed, count($cases) * 3 + 2);
