<?php
// LeetCode 239, Sliding Window Maximum: bốn cách, một bản sai, test.
// Chạy: php sliding-window-max.php
declare(strict_types=1);

// Cách 1, vét cạn: mỗi cửa sổ tìm max lại từ đầu. O(n·k).
function bruteForce(array $nums, int $k): array {
    $out = [];
    for ($i = 0; $i + $k <= count($nums); $i++) $out[] = max(array_slice($nums, $i, $k));
    return $out;
}

// SAI: giữ một max chạy, chỉ so với phần tử mới. Khi max cũ trượt ra khỏi cửa sổ, nó vẫn bị giữ lại.
function runningMaxOnly(array $nums, int $k): array {
    $out = [];
    $m = PHP_INT_MIN;
    foreach ($nums as $i => $x) {
        $m = max($m, $x);
        if ($i >= $k - 1) $out[] = $m;
    }
    return $out;
}

// Cách 2, chia khối k: max tiền tố trong khối và max hậu tố trong khối.
function blocks(array $nums, int $k): array {
    $n = count($nums);
    $pre = $nums; // gán là chép
    $suf = $nums;
    for ($i = 1; $i < $n; $i++) if ($i % $k) $pre[$i] = max($pre[$i - 1], $nums[$i]);
    for ($i = $n - 2; $i >= 0; $i--) if (($i + 1) % $k) $suf[$i] = max($suf[$i + 1], $nums[$i]);
    $out = [];
    for ($i = 0; $i + $k <= $n; $i++) $out[] = max($suf[$i], $pre[$i + $k - 1]);
    return $out;
}

// Cách 3, hàng đợi đơn điệu: mảng chỉ số + head/tail. Giá trị theo chỉ số giảm dần từ head.
function monotonicDeque(array $nums, int $k): array {
    $q = []; // q[head..tail-1] là hàng đợi; array_shift sẽ đánh lại chỉ số cả mảng
    $head = 0;
    $tail = 0;
    $out = [];
    foreach ($nums as $i => $x) {
        if ($head < $tail && $q[$head] <= $i - $k) $head++; // đầu hàng đã trượt ra khỏi cửa sổ
        while ($head < $tail && $nums[$q[$tail - 1]] <= $x) $tail--; // bỏ mọi phần tử không lớn hơn phần tử mới
        $q[$tail++] = $i;
        if ($i >= $k - 1) $out[] = $nums[$q[$head]];
    }
    return $out;
}

// Cách 3 nhưng bỏ đầu hàng bằng array_shift(): đúng, nhưng array_shift đánh lại chỉ số cả mảng, O(k) mỗi lần.
function monotonicShift(array $nums, int $k): array {
    $q = [];
    $out = [];
    foreach ($nums as $i => $x) {
        if ($q && $q[0] <= $i - $k) array_shift($q);
        while ($q && $nums[$q[count($q) - 1]] <= $x) array_pop($q);
        $q[] = $i;
        if ($i >= $k - 1) $out[] = $nums[$q[0]];
    }
    return $out;
}

$cases = [
    [[1, 3, -1, -3, 5, 3, 6, 7], 3, [3, 3, 5, 5, 6, 7]], [[1], 1, [1]], [[9, 8, 7, 6, 5], 2, [9, 8, 7, 6]],
    [[1, 2, 3, 4], 4, [4]], [[4, 4, 4, 1], 2, [4, 4, 4]], [[-7, -8, 7, 5, 7, 1, 6, 0], 4, [7, 7, 7, 7, 7]], [[5, 1, 2, 3], 2, [5, 2, 3]],
];
foreach (['bruteForce', 'runningMaxOnly', 'blocks', 'monotonicDeque', 'monotonicShift'] as $fn) {
    $bad = [];
    foreach ($cases as [$a, $k, $want]) {
        $got = $fn($a, $k);
        if ($got !== $want) $bad[] = "[" . implode(',', $a) . "] k=$k → [" . implode(',', $got) . "]";
    }
    echo str_pad($fn, 15) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
