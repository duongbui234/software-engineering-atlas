<?php
// Jump Game II (LeetCode 45): DP O(n²), BFS tường minh, tham lam theo lớp nhảy O(n)
// Chạy: php layers.php

// DP: best[j] = số bước ít nhất để tới j; mỗi ô i đẩy best[i] + 1 sang mọi ô nó với tới
function jumpDP(array $nums, int &$ops = 0): int {
    $n = count($nums);
    $best = array_fill(0, $n, PHP_INT_MAX);
    $best[0] = 0;
    for ($i = 0; $i < $n; $i++) {
        if ($best[$i] === PHP_INT_MAX) continue; // ô i chưa tới được: PHP_INT_MAX + 1 sẽ thành số thực
        for ($k = 1; $k <= $nums[$i] && $i + $k < $n; $k++) {
            $ops++;
            $best[$i + $k] = min($best[$i + $k], $best[$i] + 1);
        }
    }
    return $best[$n - 1];
}

// BFS tường minh: mỗi chỉ số là một đỉnh, cạnh i → i+1..i+nums[i]
function jumpBFS(array $nums, int &$ops = 0): int {
    $n = count($nums);
    $dist = array_fill(0, $n, -1);
    $dist[0] = 0;
    $queue = [0];
    for ($head = 0; $head < count($queue); $head++) {
        $i = $queue[$head];
        for ($k = 1; $k <= $nums[$i] && $i + $k < $n; $k++) {
            $ops++;
            if ($dist[$i + $k] === -1) {
                $dist[$i + $k] = $dist[$i] + 1;
                $queue[] = $i + $k;
            }
        }
    }
    return $dist[$n - 1];
}

// Cách chính: lớp nhảy. [.., end] là lớp hiện tại, far là chỗ xa nhất lớp sau với tới
function jump(array $nums, int &$ops = 0): int {
    $jumps = 0;
    $end = 0;
    $far = 0;
    for ($i = 0; $i < count($nums) - 1; $i++) { // dừng trước ô cuối
        $ops++;
        $far = max($far, $i + $nums[$i]);
        if ($i === $end) { // đi hết lớp hiện tại: phải nhảy thêm một bước
            $jumps++;
            $end = $far;
        }
    }
    return $jumps;
}

// Bản sai: vòng lặp chạy tới cả ô cuối, nên có thể đếm thêm một bước thừa
function jumpToLast(array $nums): int {
    $jumps = 0;
    $end = 0;
    $far = 0;
    for ($i = 0; $i < count($nums); $i++) {
        $far = max($far, $i + $nums[$i]);
        if ($i === $end) {
            $jumps++;
            $end = $far;
        }
    }
    return $jumps;
}

// Bản sai: từ chỗ đang đứng luôn nhảy xa nhất có thể; -1 nếu kẹt ở ô 0
function jumpFarthestNow(array $nums): int {
    $pos = 0;
    $jumps = 0;
    while ($pos < count($nums) - 1) {
        if ($nums[$pos] === 0) return -1;
        $pos = min($pos + $nums[$pos], count($nums) - 1);
        $jumps++;
    }
    return $jumps;
}

// Trọng tài độc lập: thử mọi đường nhảy bằng đệ quy, không nhớ gì
function bruteForce(array $nums, int $i = 0): int {
    if ($i === count($nums) - 1) return 0;
    $best = PHP_INT_MAX;
    for ($k = 1; $k <= $nums[$i] && $i + $k < count($nums); $k++) {
        $sub = bruteForce($nums, $i + $k);
        if ($sub !== PHP_INT_MAX) $best = min($best, 1 + $sub);
    }
    return $best;
}

$cases = [
    [[0], 0],
    [[5], 0],
    [[1, 1, 1, 1], 3],
    [[4, 0, 0, 0, 0], 1],
    [[3, 1, 0, 2, 0, 1], 2],
    [[2, 0, 2, 0, 1], 2],
    [[1, 2, 1, 1, 1], 3],
    [[1, 3, 0, 0, 5, 0, 0, 1], 3],
];
$ok = 0;
foreach ($cases as [$nums, $want]) {
    $got = [jumpDP($nums), jumpBFS($nums), jump($nums), bruteForce($nums)];
    if (count(array_filter($got, fn($g) => $g === $want)) === 4) $ok++;
    else echo "sai ở " . json_encode($nums) . " " . json_encode($got) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi mảng dài 1–6, giá trị 0–3, mà ô cuối với tới được
$total = 0;
$good = 0;
$wrong = 0;
$wrongNow = 0;
function build(array $arr): void {
    global $total, $good, $wrong, $wrongNow;
    if (count($arr) > 0) {
        $want = bruteForce($arr);
        if ($want !== PHP_INT_MAX) {
            $total++;
            if (jumpDP($arr) === $want && jumpBFS($arr) === $want && jump($arr) === $want) $good++;
            if (jumpToLast($arr) !== $want) $wrong++;
            if (jumpFarthestNow($arr) !== $want) $wrongNow++;
        }
    }
    if (count($arr) === 6) return;
    for ($v = 0; $v <= 3; $v++) build([...$arr, $v]);
}
build([]);
echo "$good/$total ca đúng (đối chiếu vét mọi đường nhảy)\n";
echo "Cho vòng lặp chạy tới ô cuối: sai $wrong/$total ca, [0] cho " . jumpToLast([0]) . " thay vì 0\n";
echo "Luôn nhảy xa nhất từ chỗ đang đứng: sai $wrongNow/$total ca, [2,4,1,1,1,1] cho " . jumpFarthestNow([2, 4, 1, 1, 1, 1]) . " thay vì 2\n";

// Đo: n = 10000, mọi ô bằng 1000 (giới hạn lớn nhất của đề)
$big = array_fill(0, 10000, 1000);
$dp = 0;
$bfs = 0;
$greedy = 0;
$answers = [jumpDP($big, $dp), jumpBFS($big, $bfs), jump($big, $greedy)];
echo "n = 10000, mọi ô 1000: " . implode('/', $answers) . " bước; DP $dp lượt cập nhật, BFS $bfs cạnh, lớp nhảy $greedy vòng\n";
