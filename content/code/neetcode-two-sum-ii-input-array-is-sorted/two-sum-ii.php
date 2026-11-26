<?php
// LeetCode 167, Two Sum II (mảng đã sắp xếp): bốn cách, một bản sai, và test.
// Chạy: php two-sum-ii.php   (PHP 8.2)
// Kết quả là chỉ số ĐẾM TỪ 1: [i + 1, j + 1].
declare(strict_types=1);

function bruteForce(array $nums, int $target): array {
    $n = count($nums);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++) if ($nums[$i] + $nums[$j] === $target) return [$i + 1, $j + 1];
    return [];
}

// Với mỗi nums[i], tìm nhị phân phần bù trong đoạn BÊN PHẢI i. O(n log n), O(1) bộ nhớ.
function binarySearch(array $nums, int $target): array {
    $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        $lo = $i + 1; $hi = $n - 1;
        $want = $target - $nums[$i];
        while ($lo <= $hi) {
            $mid = intdiv($lo + $hi, 2); // ($lo + $hi) / 2 cho ra float khi tổng lẻ
            if ($nums[$mid] === $want) return [$i + 1, $mid + 1];
            if ($nums[$mid] < $want) $lo = $mid + 1; else $hi = $mid - 1;
        }
    }
    return [];
}

// Khuôn của ga 1 (hash map một lượt): đúng, O(n), nhưng tốn O(n) bộ nhớ.
function hashMap(array $nums, int $target): array {
    $seen = [];
    foreach ($nums as $i => $x) {
        if (isset($seen[$target - $x])) return [$seen[$target - $x] + 1, $i + 1];
        $seen[$x] = $i;
    }
    return [];
}

// Hai con trỏ: tổng nhỏ quá thì tăng trái, lớn quá thì giảm phải. O(n), O(1) bộ nhớ.
function twoPointers(array $nums, int $target): array {
    $i = 0; $j = count($nums) - 1;
    while ($i < $j) {
        $sum = $nums[$i] + $nums[$j];
        if ($sum === $target) return [$i + 1, $j + 1];
        if ($sum < $target) $i++; // nums[i] cộng với số LỚN NHẤT còn lại vẫn thiếu
        else $j--;                // nums[j] cộng với số NHỎ NHẤT còn lại vẫn thừa
    }
    return [];
}

// SAI: tìm nhị phân trên CẢ mảng, nên có thể ghép một phần tử với chính nó.
function binarySearchWholeArray(array $nums, int $target): array {
    $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        $lo = 0; $hi = $n - 1;
        $want = $target - $nums[$i];
        while ($lo <= $hi) {
            $mid = intdiv($lo + $hi, 2);
            if ($nums[$mid] === $want) return [$i + 1, $mid + 1];
            if ($nums[$mid] < $want) $lo = $mid + 1; else $hi = $mid - 1;
        }
    }
    return [];
}

$cases = [
    [[2, 7, 11, 15], 9, [1, 2]], [[2, 3, 4], 6, [1, 3]], [[-1, 0], -1, [1, 2]],
    [[3, 3], 6, [1, 2]], [[1, 2, 3, 4, 4, 9, 56, 90], 8, [4, 5]], [[-10, -3, 0, 5, 9], 6, [2, 5]],
];
foreach (['bruteForce', 'binarySearch', 'hashMap', 'twoPointers', 'binarySearchWholeArray'] as $fn) {
    $bad = [];
    foreach ($cases as [$n, $t, $w]) {
        $got = $fn($n, $t);
        if ($got !== $w) $bad[] = json_encode($n) . ", $t → [" . implode(',', $got) . ']';
    }
    printf("%-22s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(' ', $bad) : '');
}
