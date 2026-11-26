<?php
declare(strict_types=1);

function maximumProduct(array $values): int {
    $high = $low = $best = $values[0];
    for ($i = 1; $i < count($values); $i++) {
        $x = $values[$i];
        $extendHigh = $high * $x;
        $extendLow = $low * $x;
        $high = max($x, $extendHigh, $extendLow);
        $low = min($x, $extendHigh, $extendLow);
        $best = max($best, $high);
    }
    return $best;
}

function maximumByIntervals(array $nums): int {
    $best = $nums[0];
    for ($left = 0; $left < count($nums); $left++) {
        $product = 1;
        for ($right = $left; $right < count($nums); $right++) {
            $product *= $nums[$right];
            $best = max($best, $product);
        }
    }
    return $best;
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(maximumProduct([-2, 3, -4]), 24);
check(maximumByIntervals([-2, 3, -4]), 24);
check(maximumProduct([-3]), -3);
check(maximumByIntervals([-3]), -3);
check(maximumProduct([-2, -3, -4]), 12);
check(maximumByIntervals([-2, -3, -4]), 12);
check(maximumProduct([0, -2, 0, -3, -4]), 12);
check(maximumByIntervals([0, -2, 0, -3, -4]), 12);
check(maximumProduct([0, -3, 0]), 0);
check(maximumByIntervals([0, -3, 0]), 0);
check(maximumProduct([1]), 1);
check(maximumByIntervals([1]), 1);
check(maximumProduct([2, 3, 0, -2, -4]), 8);
check(maximumByIntervals([2, 3, 0, -2, -4]), 8);
echo "7/7 ca đúng\n";
