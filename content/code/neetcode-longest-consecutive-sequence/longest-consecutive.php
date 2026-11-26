<?php
// LeetCode 128, Longest Consecutive Sequence: ba cách, một bản sai, và test.
// Chạy: php longest-consecutive.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1, vét cạn: với mỗi x, tìm x+1, x+2… bằng in_array, mỗi lần quét cả mảng. O(n³) ở ca tệ nhất.
function bruteForce(array $nums): int {
    $best = 0;
    foreach ($nums as $x) {
        $len = 1;
        while (in_array($x + $len, $nums, true)) $len++;
        $best = max($best, $len);
    }
    return $best;
}

// Cách 2, sắp xếp rồi quét. Mảng PHP truyền theo giá trị (copy-on-write),
// nên sort() ở đây chỉ sửa bản sao, không đụng mảng của người gọi.
function sortScan(array $nums): int {
    if (count($nums) === 0) return 0;
    sort($nums, SORT_NUMERIC);
    $best = 1; $len = 1;
    for ($i = 1, $n = count($nums); $i < $n; $i++) {
        if ($nums[$i] === $nums[$i - 1]) continue; // số trùng: bỏ qua, KHÔNG đứt dãy
        $len = $nums[$i] === $nums[$i - 1] + 1 ? $len + 1 : 1;
        $best = max($best, $len);
    }
    return $best;
}

// Cách 3, hash set: số làm KHÓA của mảng PHP; chỉ đếm từ đầu dãy. O(n) trung bình.
function hashSet(array $nums): int {
    $all = array_fill_keys($nums, true);
    $best = 0;
    foreach ($all as $x => $_) {            // duyệt KHÓA; giá trị chỉ là true
        if (isset($all[$x - 1])) continue;
        $len = 1;
        while (isset($all[$x + $len])) $len++;
        $best = max($best, $len);
    }
    return $best;
}

// Bản sai: coi số trùng là đứt dãy.
function sortScanResetOnDuplicate(array $nums): int {
    if (count($nums) === 0) return 0;
    sort($nums, SORT_NUMERIC);
    $best = 1; $len = 1;
    for ($i = 1, $n = count($nums); $i < $n; $i++) {
        $len = $nums[$i] === $nums[$i - 1] + 1 ? $len + 1 : 1;
        $best = max($best, $len);
    }
    return $best;
}

$cases = [
    [[100, 4, 200, 1, 3, 2], 4],
    [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1], 9],
    [[1, 0, 1, 2], 3],
    [[], 0],
    [[7], 1],
    [[-3, -1, -2, 5], 3],
    [[9, 10, 8], 3],
];
foreach (['bruteForce', 'sortScan', 'hashSet', 'sortScanResetOnDuplicate'] as $fn) {
    $bad = array_filter($cases, fn($c) => $fn($c[0]) !== $c[1]);
    $msg = $bad ? '; sai ở ' . implode(' ', array_map(fn($c) => json_encode($c[0]), $bad)) : '';
    printf("%-25s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $msg);
}
