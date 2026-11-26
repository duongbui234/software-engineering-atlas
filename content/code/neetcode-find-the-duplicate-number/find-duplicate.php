<?php
declare(strict_types=1);

function findDuplicate(array $nums): int {
    $slow = $fast = 0;
    do {
        $slow = $nums[$slow];
        $fast = $nums[$nums[$fast]];
    } while ($slow !== $fast);
    $entry = 0;
    while ($entry !== $slow) {
        $entry = $nums[$entry];
        $slow = $nums[$slow];
    }
    return $entry;
}

$cases = [[[1,3,4,2,2],2], [[3,1,3,4,2],3], [[3,3,3,3,3],3], [[1,1],1], [[1,2,3,4,4],4]];
foreach ($cases as [$nums, $expected]) {
    if (!(findDuplicate($nums) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
