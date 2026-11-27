<?php
declare(strict_types=1);

function brute(array $nums, int $target, int $i = 0): bool
{
    if ($target === 0) {
        return true;
    }
    if ($target < 0 || $i === count($nums)) {
        return false;
    }
    return brute($nums, $target - $nums[$i], $i + 1) || brute($nums, $target, $i + 1);
}

function table(array $nums, int $target): bool
{
    $empty = array_fill(0, $target + 1, false);
    $rows = [$empty];
    $rows[0][0] = true;
    foreach ($nums as $i => $x) {
        $rows[$i + 1] = $empty;
        for ($sum = 0; $sum <= $target; $sum++) {
            $rows[$i + 1][$sum] = $rows[$i][$sum] || ($sum >= $x && $rows[$i][$sum - $x]);
        }
    }
    return $rows[count($nums)][$target];
}

function descending(array $nums, int $target): bool
{
    $reachable = array_fill(0, $target + 1, false);
    $reachable[0] = true;
    foreach ($nums as $x) {
        for ($sum = $target; $sum >= $x; $sum--) {
            $reachable[$sum] = $reachable[$sum] || $reachable[$sum - $x];
        }
    }
    return $reachable[$target];
}

function bitset(array $nums, int $target): bool
{
    // Dịch một nhóm 16 bit vẫn vừa int có dấu 32 bit.
    $words = array_fill(0, intdiv($target, 16) + 1, 0);
    $words[0] = 1;
    foreach ($nums as $x) {
        $offset = intdiv($x, 16);
        $shift = $x % 16;
        for ($dst = count($words) - 1; $dst >= $offset; $dst--) {
            $src = $dst - $offset;
            $moved = ($words[$src] << $shift) & 0xffff;
            if ($shift !== 0 && $src > 0) {
                $moved |= $words[$src - 1] >> (16 - $shift);
            }
            $words[$dst] |= $moved;
        }
    }
    return ($words[intdiv($target, 16)] & (1 << ($target % 16))) !== 0;
}

$cases = [
    [[8], false],
    [[2, 2], true],
    [[3, 6, 7, 10], true],
    [[2, 3, 7], false],
    [[1, 4, 8], false],
    [[2, 2, 2], false],
    [[31, 31], true],
    [[32, 32], true],
    [[33, 33], true],
    [[31, 2, 30, 3], true],
    [[32, 1, 17, 16], true],
    [[33, 31, 30, 34], true],
    [[63, 2, 33, 32], true],
    [[100, 40, 40], false],
    [array_fill(0, 200, 100), true],
    [[...array_fill(0, 199, 100), 98], false],
];

foreach ($cases as [$nums, $expected]) {
    $total = array_sum($nums);
    $even = $total % 2 === 0;
    $target = intdiv($total, 2);
    foreach (['table', 'descending', 'bitset'] as $solve) {
        if (($even && $solve($nums, $target)) !== $expected) {
            throw new RuntimeException('Kết quả DP sai');
        }
    }
    if (count($nums) < 20 && ($even && brute($nums, $target)) !== $expected) {
        throw new RuntimeException('Kết quả vét cạn sai');
    }
}

printf("%d/%d ca đúng\n", count($cases), count($cases));
