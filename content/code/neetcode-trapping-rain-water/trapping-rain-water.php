<?php
declare(strict_types=1);

function trap(array $height): int {
    $left = 0;
    $right = count($height) - 1;
    $leftMax = $rightMax = $water = 0;
    while ($left <= $right) {
        if ($leftMax <= $rightMax) {
            $leftMax = max($leftMax, $height[$left]);
            $water += $leftMax - $height[$left++];
        } else {
            $rightMax = max($rightMax, $height[$right]);
            $water += $rightMax - $height[$right--];
        }
    }
    return $water;
}

$cases = [[[0,1,0,2,1,0,1,3,2,1,2,1],6], [[4,2,0,3,2,5],9], [[],0], [[3,0,3],3], [[3,2,1],0]];
foreach ($cases as [$height, $expected]) {
    if (!(trap($height) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
