<?php
// LeetCode 74, Search a 2D Matrix: bốn cách, hai bản sai và test.
// Chạy: php search-2d-matrix.php
declare(strict_types=1);

// Cách 1, quét hết: O(m·n).
function linearScan(array $matrix, int $target): bool
{
    foreach ($matrix as $row) if (in_array($target, $row, true)) return true;
    return false;
}

// Cách 2, hai lần chia đôi: tìm hàng cuối cùng có phần tử đầu ≤ target, rồi chia đôi trong hàng đó.
function twoBinarySearch(array $matrix, int $target): bool
{
    $lo = 0;
    $hi = count($matrix); // nửa mở [lo, hi): đếm số hàng có phần tử đầu ≤ target
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($matrix[$mid][0] <= $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    $r = $lo - 1; // hàng cuối cùng có phần tử đầu ≤ target
    if ($r < 0) return false; // $matrix[-1] không lỗi trong PHP: ra null kèm cảnh báo
    $row = $matrix[$r];
    $a = 0;
    $b = count($row);
    while ($a < $b) {
        $mid = ($a + $b) >> 1;
        if ($row[$mid] < $target) $a = $mid + 1;
        else $b = $mid;
    }
    return $a < count($row) && $row[$a] === $target;
}

// Cách 3, một lần chia đôi trên chỉ số phẳng k ∈ [0, m·n): hàng = ⌊k/n⌋, cột = k mod n (n là số CỘT).
function flatBinarySearch(array $matrix, int $target): bool
{
    $m = count($matrix);
    $n = count($matrix[0]);
    $lo = 0;
    $hi = $m * $n;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        $x = $matrix[intdiv($mid, $n)][$mid % $n]; // intdiv, không phải /: / ra float
        if ($x === $target) return true;
        if ($x < $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    return false;
}

// Cách 4, bậc thang từ góc trên phải: lớn hơn target thì sang trái, nhỏ hơn thì xuống. O(m + n).
function staircase(array $matrix, int $target): bool
{
    $r = 0;
    $c = count($matrix[0]) - 1;
    while ($r < count($matrix) && $c >= 0) {
        $x = $matrix[$r][$c];
        if ($x === $target) return true;
        if ($x > $target) $c--;
        else $r++;
    }
    return false;
}

// SAI: lấy lo (hàng đầu tiên có phần tử đầu > target) thay vì lo − 1.
function wrongRowPick(array $matrix, int $target): bool
{
    $lo = 0;
    $hi = count($matrix);
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($matrix[$mid][0] <= $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    if ($lo >= count($matrix)) return false;
    return in_array($target, $matrix[$lo], true);
}

// SAI: chia chỉ số phẳng cho số HÀNG m thay vì số cột n. Đúng khi ma trận vuông, sai khi m ≠ n.
function wrongFlatIndex(array $matrix, int $target): bool
{
    $m = count($matrix);
    $lo = 0;
    $hi = $m * count($matrix[0]);
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        $x = $matrix[intdiv($mid, $m)][$mid % $m] ?? null; // ?? nuốt ô không tồn tại thành null
        if ($x === $target) return true;
        if ($x !== null && $x < $target) $lo = $mid + 1;
        else $hi = $mid;
    }
    return false;
}

$ex = [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]];
$cases = [
    ["ví dụ → 3", $ex, 3, true], ["ví dụ → 13", $ex, 13, false], ["ví dụ → 60 (cuối)", $ex, 60, true],
    ["ví dụ → 23 (đầu hàng cuối)", $ex, 23, true], ["ví dụ → 0 (nhỏ hơn hết)", $ex, 0, false],
    ["ví dụ → 61 (lớn hơn hết)", $ex, 61, false], ["[[1]] → 1", [[1]], 1, true], ["[[1]] → 2", [[1]], 2, false],
    ["một cột [[1],[3]] → 3", [[1], [3]], 3, true], ["vuông [[1,2],[3,4]] → 4", [[1, 2], [3, 4]], 4, true],
];
foreach (['linearScan', 'twoBinarySearch', 'flatBinarySearch', 'staircase', 'wrongRowPick', 'wrongFlatIndex'] as $fn) {
    $bad = [];
    foreach ($cases as [$d, $m, $t, $want]) if ($fn($m, $t) !== $want) $bad[] = $d;
    echo str_pad($fn, 17) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở: " . implode(", ", $bad) : "") . "\n";
}
