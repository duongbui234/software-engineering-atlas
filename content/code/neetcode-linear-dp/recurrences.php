<?php
declare(strict_types=1);

function countStairs(int $n): int {
    $older = $latest = 1;
    for ($i = 2; $i <= $n; $i++) {
        [$older, $latest] = [$latest, $older + $latest];
    }
    return $latest;
}

function cheapestStairs(array $cost): int {
    $older = $latest = 0;
    for ($i = 2; $i <= count($cost); $i++) {
        [$older, $latest] = [$latest, min($latest + $cost[$i-1], $older + $cost[$i-2])];
    }
    return $latest;
}

function robRange(array $nums, int $start, int $end): int {
    $older = $latest = 0;
    for ($i = $start; $i < $end; $i++) {
        [$older, $latest] = [$latest, max($latest, $older + $nums[$i])];
    }
    return $latest;
}

function robRing(array $nums): int {
    $n = count($nums);
    if ($n === 1) return $nums[0];
    return max(robRange($nums, 0, $n-1), robRange($nums, 1, $n));
}

function decode(string $s): int {
    $older = 1;
    $latest = $s[0] === '0' ? 0 : 1;
    for ($i = 1; $i < strlen($s); $i++) {
        $pair = (int) substr($s, $i-1, 2);
        $next = ($s[$i] === '0' ? 0 : $latest) + ($pair >= 10 && $pair <= 26 ? $older : 0);
        [$older, $latest] = [$latest, min($next, 2147483647)];
    }
    return $latest;
}

function maxProduct(array $nums): int {
    $high = $low = $best = $nums[0];
    for ($i = 1; $i < count($nums); $i++) {
        $x = $nums[$i];
        $a = $x * $high;
        $b = $x * $low;
        $high = max($x, $a, $b);
        $low = min($x, $a, $b);
        $best = max($best, $high);
    }
    return $best;
}

$checks = [
    countStairs(6) === 13,
    cheapestStairs([6,2,8,1]) === 3,
    robRange([4,1,1,7,2],0,5) === 11,
    robRing([9,1,1,9]) === 10,
    robRing([7]) === 7,
    decode('127') === 2,
    decode(str_repeat('1', 60) . '00') === 0,
    decode('100') === 0,
    maxProduct([-3,2,-4]) === 24,
    maxProduct([-2,0,-1]) === 0,
];
if (in_array(false, $checks, true)) throw new RuntimeException('Kết quả sai');
printf("%d/%d ca đúng\n", count($checks), count($checks));
