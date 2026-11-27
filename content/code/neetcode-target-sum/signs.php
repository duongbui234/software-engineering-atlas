<?php
declare(strict_types=1);

function enumerateSigns(array $nums, int $index, int $target): int {
    if ($index === count($nums)) return (int)($target === 0);
    return enumerateSigns($nums, $index+1, $target-$nums[$index])
        + enumerateSigns($nums, $index+1, $target+$nums[$index]);
}

function countBySignedSum(array $nums, int $target): int {
    $ways = [0 => 1];
    foreach ($nums as $x) {
        $next = [];
        foreach ($ways as $sum => $count) {
            foreach ([$sum+$x,$sum-$x] as $key) {
                $next[$key] = ($next[$key] ?? 0) + $count;
            }
        }
        $ways = $next;
    }
    return $ways[$target] ?? 0;
}

function countBySubset(array $nums, int $target): int {
    $sum = array_sum($nums);
    $twice = $sum - $target;
    if (abs($target) > $sum || $twice % 2 !== 0) return 0;
    $goal = intdiv($twice, 2);
    $ways = array_fill(0, $goal+1, 0);
    $ways[0] = 1;
    foreach ($nums as $x) {
        for ($s=$goal; $s >= $x; $s--) $ways[$s] += $ways[$s-$x];
    }
    return $ways[$goal];
}

$cases = [
    [[1,2,5],4,1], [[0,0,2,3],1,4], [[0,0,2,3],-1,4],
    [[2,5],0,0], [[2,5],8,0], [[2,5],-8,0],
    [[3,3,3,3],0,6], [[1000],-1000,1], [[0],0,2],
    [array_fill(0,20,0),0,1048576], [array_fill(0,16,1),0,12870],
];
foreach ($cases as [$nums,$target,$want]) {
    if (countBySignedSum($nums,$target) !== $want || countBySubset($nums,$target) !== $want ||
        (count($nums)<=16 && enumerateSigns($nums,0,$target) !== $want)) throw new RuntimeException('Ca kiểm tra sai');
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
