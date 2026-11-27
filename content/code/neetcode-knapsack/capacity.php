<?php
declare(strict_types=1);

function canPartition(array $nums): bool {
    $sum = array_sum($nums);
    if ($sum % 2 !== 0) return false;
    $goal = intdiv($sum,2);
    $reachable = array_fill(0,$goal+1,false);
    $reachable[0] = true;
    foreach ($nums as $x) {
        for ($s=$goal;$s >= $x;$s--) $reachable[$s] = $reachable[$s] || $reachable[$s-$x];
    }
    return $reachable[$goal];
}

function minCoins(array $coins,int $amount): int {
    $best = array_fill(0,$amount+1,$amount+1);
    $best[0] = 0;
    foreach ($coins as $coin) {
        for ($s=$coin;$s <= $amount;$s++) $best[$s] = min($best[$s],$best[$s-$coin]+1);
    }
    return $best[$amount] === $amount+1 ? -1 : $best[$amount];
}

function coinCombinations(array $coins,int $amount): int {
    $ways = array_fill(0,$amount+1,0);
    $ways[0] = 1;
    foreach ($coins as $coin) {
        for ($s=$coin;$s <= $amount;$s++) $ways[$s] = min(2147483647,$ways[$s]+$ways[$s-$coin]);
    }
    return $ways[$amount];
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

$manyEvenCoins = range(2,598,2);
$manyEvenCoins[] = 4999;
$checks = [
    canPartition([4,4,6,2]),
    !canPartition([2,3,7]),
    minCoins([1,4,6],8) === 2,
    minCoins([4,6],7) === -1,
    minCoins([2147483647],0) === 0,
    coinCombinations([2,3,4],7) === 2,
    coinCombinations([4,6],0) === 1,
    coinCombinations($manyEvenCoins,4999) === 1,
    countBySubset([0,0,2,3],-1) === 4,
    countBySubset([2,5],0) === 0,
];
if (in_array(false,$checks,true)) throw new RuntimeException('Ca kiểm tra sai');
printf("%d/%d ca đúng\n",count($checks),count($checks));
