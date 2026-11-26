<?php
declare(strict_types=1);

function leastInterval(array $tasks, int $cooldown): int
{
    if ($tasks === []) {
        return 0;
    }
    $counts = array_count_values($tasks);
    $most = max($counts);
    $leaders = 0;
    foreach ($counts as $count) {
        if ($count === $most) {
            $leaders++;
        }
    }
    return max(count($tasks), ($most - 1) * ($cooldown + 1) + $leaders);
}

$cases = [
    ['AAABBB', 2, 8],
    ['ACABDB', 1, 6],
    ['AAABBB', 3, 10],
    ['AAABBB', 0, 6],
    ['ABBB', 1, 5],
    ['AAAAAABCDEFG', 2, 16],
    ['AABBCCDD', 2, 8],
    ['AAABBBCCCDDE', 2, 12],
    ['AAAB', 3, 9],
    ['A', 100, 1],
];
foreach ($cases as [$tasks, $cooldown, $expected]) {
    if (leastInterval(str_split($tasks), $cooldown) !== $expected) {
        throw new RuntimeException("Sai với $tasks, n = $cooldown");
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
