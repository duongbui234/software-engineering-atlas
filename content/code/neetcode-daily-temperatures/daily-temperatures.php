<?php
// LeetCode 739, Daily Temperatures: ba cách, một bản sai, test và đo.
// Chạy: php daily-temperatures.php
declare(strict_types=1);

function bruteForce(array $t): array {
    $n = count($t);
    $out = array_fill(0, $n, 0);
    for ($i = 0; $i < $n; $i++) {
        for ($j = $i + 1; $j < $n; $j++) {
            if ($t[$j] > $t[$i]) {
                $out[$i] = $j - $i;
                break;
            }
        }
    }
    return $out;
}

// Cách 2, ngăn xếp đơn điệu: mảng PHP dùng làm ngăn xếp, giữ CHỈ SỐ, nhiệt độ giảm dần từ đáy lên đỉnh.
function monotonicStack(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = [];
    foreach ($t as $i => $x) {
        while ($stack && $x > $t[$stack[count($stack) - 1]]) { // mảng rỗng là falsy: kiểm trước khi đọc đỉnh
            $j = array_pop($stack);
            $out[$j] = $i - $j;
        }
        $stack[] = $i;
    }
    return $out;
}

// Cùng thuật toán với SplStack (danh sách liên kết kép bên trong).
function splStack(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = new SplStack();
    foreach ($t as $i => $x) {
        while (!$stack->isEmpty() && $x > $t[$stack->top()]) {
            $j = $stack->pop();
            $out[$j] = $i - $j;
        }
        $stack->push($i);
    }
    return $out;
}

// Cách 3, đi từ phải và nhảy theo đáp án: không cần ngăn xếp.
function jumpFromRight(array $t): array {
    $n = count($t);
    $out = array_fill(0, $n, 0);
    for ($i = $n - 2; $i >= 0; $i--) {
        $j = $i + 1;
        while ($j < $n && $t[$j] <= $t[$i]) {
            if ($out[$j] === 0) { $j = $n; break; } // j không có ngày ấm hơn, nên i cũng không
            $j += $out[$j]; // nhảy thẳng tới ngày ấm hơn j
        }
        if ($j < $n) $out[$i] = $j - $i;
    }
    return $out;
}

// SAI: lấy ra cả khi bằng nhiệt độ (>=).
function popOnEqual(array $t): array {
    $out = array_fill(0, count($t), 0);
    $stack = [];
    foreach ($t as $i => $x) {
        while ($stack && $x >= $t[$stack[count($stack) - 1]]) {
            $j = array_pop($stack);
            $out[$j] = $i - $j;
        }
        $stack[] = $i;
    }
    return $out;
}

$cases = [
    [[73, 74, 75, 71, 69, 72, 76, 73], [1, 1, 4, 2, 1, 1, 0, 0]], [[30, 40, 50, 60], [1, 1, 1, 0]], [[30, 60, 90], [1, 1, 0]],
    [[90, 80, 70], [0, 0, 0]], [[70, 70, 71], [2, 1, 0]], [[50], [0]],
    [[55, 38, 53, 81, 61, 93, 97, 32, 43, 78], [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]],
];
foreach (['bruteForce', 'monotonicStack', 'splStack', 'jumpFromRight', 'popOnEqual'] as $fn) {
    $bad = [];
    foreach ($cases as [$t, $want]) {
        $got = $fn($t);
        if ($got !== $want) $bad[] = json_encode($t) . ' → ' . json_encode($got);
    }
    printf("%-15s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}

// Đo ở n = 10^5 (giới hạn của đề), dữ liệu giảm dần: ngăn xếp dài nhất.
$t = [];
for ($i = 0; $i < 100000; $i++) $t[] = 100 - intdiv(70 * $i, 100000);
echo "\nn = 100000 giảm dần (ms, trung vị 3 lần):";
foreach (['monotonicStack', 'splStack', 'jumpFromRight'] as $fn) {
    $ms = [];
    for ($r = 0; $r < 3; $r++) {
        $s = hrtime(true);
        $fn($t);
        $ms[] = (hrtime(true) - $s) / 1e6;
    }
    sort($ms);
    printf(" %s %.1f", $fn, $ms[1]);
}
echo "\n";
