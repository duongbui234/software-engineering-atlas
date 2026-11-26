<?php
// NC-03 Two Sum (LeetCode 1): vét cạn, hai con trỏ, hash map một lượt; bẫy ép kiểu khóa.
// Chạy: php two-sum.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1, vét cạn: thử mọi cặp i < j. O(n²).
function bruteForce(array $nums, int $target): ?array {
    $n = count($nums);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++)
            if ($nums[$i] + $nums[$j] === $target) return [$i, $j];
    return null;
}

// Cách 2, sắp xếp + hai con trỏ: O(n log n). asort giữ khóa (chỉ số gốc) đi theo giá trị.
function twoPointers(array $nums, int $target): ?array {
    asort($nums);                 // sắp theo giá trị, KHÔNG đánh lại khóa
    $idx = array_keys($nums);     // chỉ số gốc theo thứ tự giá trị tăng dần
    $l = 0; $r = count($idx) - 1;
    while ($l < $r) {
        $sum = $nums[$idx[$l]] + $nums[$idx[$r]];
        if ($sum === $target) return [min($idx[$l], $idx[$r]), max($idx[$l], $idx[$r])];
        if ($sum < $target) $l++; else $r--;
    }
    return null;
}

// Cách 3, hash map một lượt: hỏi "đã gặp target - x chưa?" rồi mới ghi x. O(n).
function onePass(array $nums, int $target): ?array {
    $seen = []; // giá trị → chỉ số
    foreach ($nums as $i => $x) {
        $need = $target - $x;
        if (isset($seen[$need])) return [$seen[$need], $i]; // hỏi TRƯỚC khi ghi
        $seen[$x] = $i;
    }
    return null;
}

// Biến thể sai: ghi TRƯỚC rồi mới hỏi.
function onePassWrongOrder(array $nums, int $target): ?array {
    $seen = [];
    foreach ($nums as $i => $x) {
        $seen[$x] = $i;
        if (isset($seen[$target - $x])) return [$seen[$target - $x], $i];
    }
    return null;
}

$cases = [
    [[2, 7, 11, 15], 9, [0, 1]],
    [[3, 2, 4], 6, [1, 2]],
    [[3, 3], 6, [0, 1]],
    [[-3, 4, 3, 90], 0, [0, 2]],
    [[1_000_000_000, -999_999_999, 5], 1, [0, 1]],
];
foreach (['bruteForce', 'twoPointers', 'onePass', 'onePassWrongOrder'] as $fn) {
    $bad = array_values(array_filter($cases, fn($c) => $fn($c[0], $c[1]) !== $c[2]));
    printf("%-18s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases),
        $bad ? sprintf('; sai ở %s, target %d → %s', json_encode($bad[0][0]), $bad[0][1], json_encode($fn($bad[0][0], $bad[0][1]))) : '');
}

// ── bẫy: khóa mảng PHP bị ép kiểu ───────────────────────────────────────────
$m = [];
$m['1'] = 'chuỗi "1"';
$m[1] = 'số 1';
$m[1.7] = 'số thực 1.7'; // bị cắt thành khóa 1 (PHP 8.1+ còn báo Deprecated)
echo "\nkhóa '1', 1 và 1.7 dồn vào: ", json_encode(array_keys($m)), ' → ', $m[1], "\n";
