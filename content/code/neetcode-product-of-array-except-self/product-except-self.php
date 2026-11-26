<?php
// LeetCode 238, Product of Array Except Self: bốn cách, một bản sai, test.
// Chạy: php product-except-self.php   (PHP 8.2)
declare(strict_types=1);

function bruteForce(array $nums): array {
    $out = [];
    foreach ($nums as $i => $_) {
        $p = 1;
        foreach ($nums as $j => $x) if ($j !== $i) $p *= $x;
        $out[] = $p;
    }
    return $out;
}

// SAI: chia cho chính nó. PHP 8 ném DivisionByZeroError khi gặp số 0.
// intdiv thay cho "/": "/" trả float khi không chia hết.
function naiveDivision(array $nums): array {
    $total = array_product($nums);
    return array_map(fn($x) => intdiv($total, $x), $nums);
}

// Chia nhưng đếm số 0.
function divisionZeroAware(array $nums): array {
    $zeros = 0; $prod = 1;
    foreach ($nums as $x) { if ($x === 0) $zeros++; else $prod *= $x; }
    return array_map(fn($x) => $zeros > 1 ? 0 : ($zeros === 1 ? ($x === 0 ? $prod : 0) : intdiv($prod, $x)), $nums);
}

// Hai mảng phụ: prefix[i] = tích trước i, suffix[i] = tích sau i.
function prefixSuffixArrays(array $nums): array {
    $n = count($nums);
    $prefix = array_fill(0, $n, 1); $suffix = array_fill(0, $n, 1);
    for ($i = 1; $i < $n; $i++) $prefix[$i] = $prefix[$i - 1] * $nums[$i - 1];
    for ($i = $n - 2; $i >= 0; $i--) $suffix[$i] = $suffix[$i + 1] * $nums[$i + 1];
    $out = [];
    for ($i = 0; $i < $n; $i++) $out[] = $prefix[$i] * $suffix[$i];
    return $out;
}

// O(1) bộ nhớ phụ: lượt 1 ghi tiền tố, lượt 2 nhân hậu tố bằng một biến chạy.
function prefixSuffixInPlace(array $nums): array {
    $n = count($nums);
    $out = array_fill(0, $n, 1);
    $left = 1;
    for ($i = 0; $i < $n; $i++) { $out[$i] = $left; $left *= $nums[$i]; }
    $right = 1;
    for ($i = $n - 1; $i >= 0; $i--) { $out[$i] *= $right; $right *= $nums[$i]; }
    return $out;
}

$cases = [
    [[1, 2, 3, 4], [24, 12, 8, 6]], [[-1, 1, 0, -3, 3], [0, 0, 9, 0, 0]], [[2, 3], [3, 2]],
    [[0, 0, 5], [0, 0, 0]], [[0, 4, 5], [20, 0, 0]], [[-2, -3, 4], [-12, -8, 6]],
];
foreach (['bruteForce', 'naiveDivision', 'divisionZeroAware', 'prefixSuffixArrays', 'prefixSuffixInPlace'] as $fn) {
    $bad = [];
    foreach ($cases as [$nums, $want]) {
        try { if ($fn($nums) !== $want) $bad[] = json_encode($nums); }
        catch (DivisionByZeroError $e) { $bad[] = json_encode($nums) . ': ' . get_class($e); }
    }
    printf("%-20s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; lỗi ở ' . implode(', ', $bad) : '');
}

// ── bẫy: int tràn thì PHP lặng lẽ đổi sang float ─────────────────────────────
$big = PHP_INT_MAX;
echo "\nPHP_INT_MAX * 2 = ", var_export($big * 2, true), " (", get_debug_type($big * 2), ", mất chính xác)\n";
