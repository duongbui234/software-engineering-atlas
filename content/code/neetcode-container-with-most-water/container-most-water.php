<?php
declare(strict_types=1);

function maxArea(array $height): int {
    $left = 0;
    $right = count($height) - 1;
    $best = 0;
    while ($left < $right) {
        $best = max($best, ($right - $left) * min($height[$left], $height[$right]));
        if ($height[$left] < $height[$right]) {
            $left++;
        } else {
            $right--;
        }
    }
    return $best;
}

$cases = [[[1,8,6,2,5,4,8,3,7],49], [[1,1],1], [[4,0,4],8], [[1,2,3,4],4]];
foreach ($cases as [$input, $expected]) {
    if (!(maxArea($input) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
