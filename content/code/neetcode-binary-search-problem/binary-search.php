<?php
// LeetCode 704, Binary Search: tìm tuyến tính, hai quy ước khoảng, cận dưới và hai bản sai.
// Chạy: php binary-search.php
declare(strict_types=1);

function linearScan(array $nums, int $target): int
{
    foreach ($nums as $i => $x) if ($x === $target) return $i;
    return -1;
}

// Khoảng đóng [lo, hi]: bất biến "nếu target có mặt thì nó nằm trong nums[lo..hi]".
function closedInterval(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo <= $hi) {
        $mid = $lo + (($hi - $lo) >> 1); // int PHP là 64 bit; intdiv($lo + $hi, 2) cũng an toàn
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid - 1;
    }
    return -1;
}

// Khoảng nửa mở [lo, hi): hi là vị trí ĐẦU TIÊN không còn xét.
function halfOpen(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums);
    while ($lo < $hi) {
        $mid = intdiv($lo + $hi, 2); // KHÔNG viết ($lo + $hi) / 2: phép / của PHP ra float khi chia không hết
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    return -1;
}

// Cận dưới: vị trí đầu tiên có nums[i] >= target. PHP không có hàm tìm nhị phân cho mảng.
function lowerBound(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums);
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    return $lo;
}

function viaLowerBound(array $nums, int $target): int
{
    $i = lowerBound($nums, $target);
    return $i < count($nums) && $nums[$i] === $target ? $i : -1;
}

// SAI 1: khoảng đóng nhưng điều kiện lặp là lo < hi, nên khoảng một phần tử cuối cùng không bao giờ được xét.
function wrongLoopCondition(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid - 1;
    }
    return -1;
}

// SAI 2: lo = mid thay vì mid + 1: lặp mãi khi hi = lo + 1. Có giới hạn số vòng để chương trình dừng.
function wrongLoEqualsMid(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    $steps = 0;
    while ($lo <= $hi) {
        if (++$steps > 1000) throw new RuntimeException("lặp mãi");
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $lo = $mid;
        else $hi = $mid - 1;
    }
    return -1;
}

$cases = [
    [[-1, 0, 3, 5, 9, 12], 9, 4], [[-1, 0, 3, 5, 9, 12], 2, -1], [[5], 5, 0], [[5], 7, -1],
    [[1, 3], 3, 1], [[1, 3], 0, -1], [[1, 3, 5, 7, 9, 11, 13], 13, 6], [[1, 3, 5, 7, 9, 11, 13], 1, 0],
];
foreach (['linearScan', 'closedInterval', 'halfOpen', 'viaLowerBound', 'wrongLoopCondition', 'wrongLoEqualsMid'] as $fn) {
    $bad = [];
    foreach ($cases as [$nums, $t, $want]) {
        try { $got = $fn($nums, $t); } catch (RuntimeException $e) { $got = $e->getMessage(); }
        if ($got !== $want) $bad[] = json_encode($nums) . " t=$t → $got";
    }
    $ok = count($cases) - count($bad);
    echo str_pad($fn, 18) . " $ok/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}

// Trong PHP, int là 64 bit nên lo + hi không tràn ở cỡ này; nhưng / ra float.
$lo = 1_500_000_000;
$hi = 2_000_000_000;
echo "\nlo = $lo, hi = $hi\n";
echo "(lo + hi + 1) / 2   = " . var_export(($lo + $hi + 1) / 2, true) . "  (tổng lẻ: ra float)\n";
echo "intdiv(lo + hi, 2)  = " . intdiv($lo + $hi, 2) . "\n";
