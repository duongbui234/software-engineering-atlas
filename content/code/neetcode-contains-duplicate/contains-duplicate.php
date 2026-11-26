<?php
// NC-01 Contains Duplicate (LeetCode 217): bốn cách giải và test.
// Chạy: php contains-duplicate.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1, vét cạn: so mọi cặp. O(n²) thời gian, O(1) bộ nhớ.
function bruteForce(array $nums): bool {
    $n = count($nums);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++)
            if ($nums[$i] === $nums[$j]) return true;
    return false;
}

// Cách 2, sắp xếp rồi quét. Mảng PHP truyền theo giá trị (copy-on-write),
// nên sort() ở đây không đụng tới mảng của người gọi.
function sortThenScan(array $nums): bool {
    sort($nums, SORT_NUMERIC);
    for ($i = 1, $n = count($nums); $i < $n; $i++) if ($nums[$i] === $nums[$i - 1]) return true;
    return false;
}

// Cách 3, sổ đã thấy: dùng chính số làm khóa của mảng PHP (bảng băm). O(n) trung bình.
function hashSet(array $nums): bool {
    $seen = [];
    foreach ($nums as $x) {
        if (isset($seen[$x])) return true; // isset: tra khóa O(1), không quét giá trị
        $seen[$x] = true;
    }
    return false;
}

// Cách 4, một dòng: array_unique so sánh theo chuỗi và luôn đọc hết mảng.
function setSize(array $nums): bool {
    return count(array_unique($nums)) !== count($nums);
}

// ── test ─────────────────────────────────────────────────────────────────────
$cases = [
    [[1, 2, 3, 1], true],
    [[1, 2, 3, 4], false],
    [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2], true],
    [[], false],
    [[7], false],
    [[-1_000_000_000, 1_000_000_000, -1_000_000_000], true],
];
$solutions = ['bruteForce', 'sortThenScan', 'hashSet', 'setSize'];
$failed = 0;
foreach ($solutions as $fn)
    foreach ($cases as [$input, $want])
        if ($fn($input) !== $want) { $failed++; echo "SAI $fn(" . json_encode($input) . ")\n"; }
printf("test: %d cách × %d ca, %d ca sai\n", count($solutions), count($cases), $failed);

// ── bẫy: in_array không có tham số thứ ba so sánh lỏng (==) ──────────────────
echo "in_array('1e1', ['10'])       → ", var_export(in_array('1e1', ['10']), true), "\n"; // true: hai chuỗi số được so như số
echo "in_array('1e1', ['10'], true) → ", var_export(in_array('1e1', ['10'], true), true), "\n"; // false: so nghiêm ngặt
