<?php

declare(strict_types=1);

const LIMIT = 2147483647;

function enumerateCounts(int $amount, array $coins, int $index = 0): int
{
    if ($index === count($coins)) {
        return (int) ($amount === 0);
    }
    $ways = 0;
    for ($rest = $amount; $rest >= 0; $rest -= $coins[$index]) {
        $ways += enumerateCounts($rest, $coins, $index + 1);
    }
    return $ways;
}

function countTable(int $amount, array $coins): int
{
    $previous = array_fill(0, $amount + 1, 0);
    $previous[0] = 1;
    $rows = [$previous];
    foreach ($coins as $coin) {
        $current = $previous;
        for ($total = $coin; $total <= $amount; $total++) {
            $current[$total] = min(LIMIT, $previous[$total] + $current[$total - $coin]);
        }
        $rows[] = $current;
        $previous = $current;
    }
    return $rows[count($coins)][$amount];
}

function countCombinations(int $amount, array $coins): int
{
    $ways = array_fill(0, $amount + 1, 0);
    $ways[0] = 1;
    foreach ($coins as $coin) {
        for ($total = $coin; $total <= $amount; $total++) {
            $ways[$total] = min(LIMIT, $ways[$total] + $ways[$total - $coin]);
        }
    }
    return $ways[$amount];
}

$cases = [
    [8, [2, 3, 5], 3],
    [5, [3, 2], 1],
    [10, [5, 2, 3], 4],
    [7, [6, 4], 0],
    [16, [4], 1],
    [0, [7, 11], 1],
    [2, [3, 5000], 0],
    [4, [2, 1], 3],
    [120, [6, 1, 4, 9, 17], 4131],
    [4999, [...range(2, 598, 2), 4999], 1],
];
foreach ($cases as [$amount, $coins, $expected]) {
    if (
        countTable($amount, $coins) !== $expected ||
        countCombinations($amount, $coins) !== $expected ||
        ($amount <= 20 && enumerateCounts($amount, $coins) !== $expected)
    ) {
        throw new RuntimeException("Sai kết quả cho tổng {$amount}");
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
