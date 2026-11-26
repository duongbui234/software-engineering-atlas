<?php
declare(strict_types=1);

function largestRectangleArea(array $height): int {
    $stack = [];
    $best = 0;
    $height[] = 0;
    foreach ($height as $right => $current) {
        while ($stack && $height[end($stack)] > $current) {
            $h = $height[array_pop($stack)];
            $left = $stack ? end($stack) : -1;
            $best = max($best, $h * ($right - $left - 1));
        }
        $stack[] = $right;
    }
    return $best;
}

$cases = [[[2,1,5,6,2,3],10], [[2,4],4], [[4,3,2,1],6], [[2,2,2],6], [[2,0,2],2]];
foreach ($cases as [$height, $expected]) {
    if (!(largestRectangleArea($height) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
