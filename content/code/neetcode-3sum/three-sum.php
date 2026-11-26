<?php
// LeetCode 15, 3Sum: ba cách, hai bản sai, và test.
// Chạy: php three-sum.php   (PHP 8.2)
declare(strict_types=1);

// Vét cạn: thử mọi bộ ba, lọc trùng bằng khóa chuỗi "a,b,c". O(n³).
function bruteForce(array $nums): array {
    $seen = []; $out = []; $n = count($nums);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++)
            for ($k = $j + 1; $k < $n; $k++)
                if ($nums[$i] + $nums[$j] + $nums[$k] === 0) {
                    $t = [$nums[$i], $nums[$j], $nums[$k]];
                    sort($t);
                    $key = implode(',', $t);
                    if (!isset($seen[$key])) { $seen[$key] = true; $out[] = $t; }
                }
    return $out;
}

// Cố định nums[i], tìm cặp còn lại bằng hash set (khuôn ga 1). O(n²), vẫn cần khóa để lọc trùng.
function hashPerAnchor(array $nums): array {
    $seen = []; $out = []; $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        $met = [];
        for ($j = $i + 1; $j < $n; $j++) {
            $need = -$nums[$i] - $nums[$j];
            if (isset($met[$need])) {
                $t = [$nums[$i], $nums[$j], $need];
                sort($t);
                $key = implode(',', $t);
                if (!isset($seen[$key])) { $seen[$key] = true; $out[] = $t; }
            }
            $met[$nums[$j]] = true;
        }
    }
    return $out;
}

// Sắp xếp + hai con trỏ: cố định a = nums[i], tìm b + c = −a trên đoạn bên phải.
// sort() sửa mảng tại chỗ và trả về bool, nên KHÔNG viết $a = sort($nums).
function sortTwoPointers(array $nums): array {
    $a = $nums; sort($a); $out = []; $n = count($a);
    for ($i = 0; $i < $n - 2; $i++) {
        if ($a[$i] > 0) break; // số nhỏ nhất đã dương thì tổng ba số không thể bằng 0
        if ($i > 0 && $a[$i] === $a[$i - 1]) continue; // cùng giá trị neo: mọi bộ ba đã được tìm
        $lo = $i + 1; $hi = $n - 1;
        while ($lo < $hi) {
            $s = $a[$i] + $a[$lo] + $a[$hi];
            if ($s < 0) $lo++;
            elseif ($s > 0) $hi--;
            else {
                $out[] = [$a[$i], $a[$lo], $a[$hi]];
                $lo++; $hi--;
                while ($lo < $hi && $a[$lo] === $a[$lo - 1]) $lo++; // nhảy qua b trùng
            }
        }
    }
    return $out;
}

// SAI 1: không bỏ trùng. Cùng một bộ ba xuất hiện nhiều lần.
function noDuplicateSkip(array $nums): array {
    $a = $nums; sort($a); $out = []; $n = count($a);
    for ($i = 0; $i < $n - 2; $i++) {
        $lo = $i + 1; $hi = $n - 1;
        while ($lo < $hi) {
            $s = $a[$i] + $a[$lo] + $a[$hi];
            if ($s < 0) $lo++;
            elseif ($s > 0) $hi--;
            else { $out[] = [$a[$i], $a[$lo], $a[$hi]]; $lo++; $hi--; }
        }
    }
    return $out;
}

// SAI 2: sắp xếp theo chuỗi (SORT_STRING), giống sort() không hàm so sánh của JS.
function sortAsString(array $nums): array {
    $a = $nums; sort($a, SORT_STRING); $out = []; $n = count($a);
    for ($i = 0; $i < $n - 2; $i++) {
        if ($i > 0 && $a[$i] === $a[$i - 1]) continue;
        $lo = $i + 1; $hi = $n - 1;
        while ($lo < $hi) {
            $s = $a[$i] + $a[$lo] + $a[$hi];
            if ($s < 0) $lo++;
            elseif ($s > 0) $hi--;
            else { $out[] = [$a[$i], $a[$lo], $a[$hi]]; $lo++; $hi--; while ($lo < $hi && $a[$lo] === $a[$lo - 1]) $lo++; }
        }
    }
    return $out;
}

function norm(array $r): string {
    $keys = array_map(function ($t) { sort($t); return implode(',', $t); }, $r);
    sort($keys, SORT_STRING);
    return implode(' | ', $keys);
}
$cases = [
    [[-1, 0, 1, 2, -1, -4], [[-1, -1, 2], [-1, 0, 1]]], [[0, 1, 1], []], [[0, 0, 0], [[0, 0, 0]]],
    [[0, 0, 0, 0], [[0, 0, 0]]], [[-2, 0, 1, 1, 2], [[-2, 0, 2], [-2, 1, 1]]],
    [[-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6], [[-4, -2, 6], [-4, 0, 4], [-4, 1, 3], [-4, 2, 2], [-2, -2, 4], [-2, 0, 2]]],
    [[-10, 5, 5, -1, 11, -1], [[-10, -1, 11], [-10, 5, 5]]],
];
foreach (['bruteForce', 'hashPerAnchor', 'sortTwoPointers', 'noDuplicateSkip', 'sortAsString'] as $fn) {
    $bad = array_map(fn($c) => json_encode($c[0]), array_filter($cases, fn($c) => norm($fn($c[0])) !== norm($c[1])));
    printf("%-16s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(' ', $bad) : '');
}
