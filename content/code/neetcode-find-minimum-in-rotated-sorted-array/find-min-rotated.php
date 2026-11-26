<?php
// LeetCode 153, Find Minimum in Rotated Sorted Array: ba cách, hai bản sai và bản có số trùng (154).
// Chạy: php find-min-rotated.php
declare(strict_types=1);

// Cách 1, quét tuyến tính: O(n). min() có sẵn cũng là quét.
function linearScan(array $nums): int
{
    return min($nums);
}

// Cách 2, chia đôi so với nums[hi]. Bất biến: phần tử nhỏ nhất luôn nằm trong [lo, hi].
function binaryVsHi(array $nums): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] > $nums[$hi]) $lo = $mid + 1; // min nằm hẳn bên phải mid
        else $hi = $mid; // đoạn [mid, hi] tăng dần: min là mid hoặc ở bên trái
    }
    return $nums[$lo];
}

// Cách 3, tìm điểm gãy: phần tử đầu tiên nhỏ hơn nums[0].
function binaryVsFirst(array $nums): int
{
    $n = count($nums);
    if ($nums[0] <= $nums[$n - 1]) return $nums[0]; // không xoay: min ở đầu. $nums[-1] KHÔNG phải phần tử cuối trong PHP
    $lo = 0;
    $hi = $n - 1;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] >= $nums[0]) $lo = $mid + 1;
        else $hi = $mid;
    }
    return $nums[$lo];
}

// SAI: so với nums[lo] mà không kiểm ca không xoay.
function wrongVsLo(array $nums): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] >= $nums[$lo]) $lo = $mid + 1;
        else $hi = $mid;
    }
    return $nums[$lo];
}

// SAI: lo <= hi với hi = mid: khi lo == hi thì không bao giờ dừng. Có giới hạn bước để báo lỗi.
function wrongLoopCondition(array $nums): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    $steps = 0;
    while ($lo <= $hi) {
        if (++$steps > 100) throw new RuntimeException("lặp vô hạn");
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] > $nums[$hi]) $lo = $mid + 1;
        else $hi = $mid;
    }
    return $nums[$lo];
}

// LeetCode 154 (có số trùng): nums[mid] == nums[hi] thì chỉ bỏ được hi. Trả [min, số bước].
function binaryWithDuplicates(array $nums): array
{
    $lo = 0;
    $hi = count($nums) - 1;
    $steps = 0;
    while ($lo < $hi) {
        $steps++;
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] > $nums[$hi]) $lo = $mid + 1;
        elseif ($nums[$mid] < $nums[$hi]) $hi = $mid;
        else $hi--;
    }
    return [$nums[$lo], $steps];
}

$cases = [
    [[3, 4, 5, 1, 2], 1], [[4, 5, 6, 7, 0, 1, 2], 0], [[11, 13, 15, 17], 11], [[1], 1],
    [[2, 1], 1], [[1, 2], 1], [[5, 1, 2, 3, 4], 1], [[2, 3, 4, 5, 1], 1],
];
foreach (['linearScan', 'binaryVsHi', 'binaryVsFirst', 'wrongVsLo', 'wrongLoopCondition'] as $fn) {
    $bad = [];
    foreach ($cases as [$nums, $want]) {
        try { $got = $fn($nums); } catch (RuntimeException $e) { $got = $e->getMessage(); }
        if ($got !== $want) $bad[] = json_encode($nums) . " → $got";
    }
    echo str_pad($fn, 19) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở " . implode(" ", $bad) : "") . "\n";
}

echo "\nLeetCode 154, số bước vòng lặp\n";
foreach ([1_000, 10_000, 100_000] as $n) {
    $allSame = array_fill(0, $n, 1);
    $allSame[intdiv($n * 9, 10)] = 0;
    $k = intdiv($n * 37, 100);
    $distinct = [];
    for ($i = 0; $i < $n; $i++) $distinct[] = ($i + $k) % $n;
    printf("n = %-7d một số khác giữa toàn số 1: %6d bước;  không trùng: %d bước\n",
        $n, binaryWithDuplicates($allSame)[1], binaryWithDuplicates($distinct)[1]);
}
