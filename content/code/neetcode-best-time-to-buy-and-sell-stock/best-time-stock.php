<?php
// LeetCode 121, Best Time to Buy and Sell Stock: ba cách, một bản sai, test.
// Chạy: php best-time-stock.php
declare(strict_types=1);

// Cách 1, vét cạn: thử mọi cặp (ngày mua i, ngày bán j > i).
function bruteForce(array $prices): int {
    $best = 0;
    $n = count($prices);
    for ($i = 0; $i < $n; $i++)
        for ($j = $i + 1; $j < $n; $j++) $best = max($best, $prices[$j] - $prices[$i]);
    return $best;
}

// SAI: lấy giá cao nhất trừ giá thấp nhất, bỏ qua thứ tự ngày (bán trước khi mua).
function maxMinusMin(array $prices): int {
    return max($prices) - min($prices);
}

// Cách 2, giá thấp nhất từ trước tới nay: mỗi ngày hỏi "nếu bán hôm nay thì lời bao nhiêu?".
function runningMin(array $prices): int {
    $minSoFar = PHP_INT_MAX;
    $best = 0;
    foreach ($prices as $p) {
        // ngày đầu: p - PHP_INT_MAX là số âm (không tràn vì p ≥ 0), nên best vẫn là 0
        $best = max($best, $p - $minSoFar);
        $minSoFar = min($minSoFar, $p);
    }
    return $best;
}

// Cách 3, hai con trỏ: left là ngày mua, right là ngày bán; gặp giá rẻ hơn thì dời left tới đó.
function twoPointers(array $prices): int {
    $left = 0;
    $best = 0;
    for ($right = 1; $right < count($prices); $right++) {
        if ($prices[$right] < $prices[$left]) $left = $right;
        else $best = max($best, $prices[$right] - $prices[$left]);
    }
    return $best;
}

$cases = [
    [[7, 1, 5, 3, 6, 4], 5], [[7, 6, 4, 3, 1], 0], [[2, 4, 1], 2], [[1], 0], [[3, 3, 3], 0], [[2, 1, 2, 1, 0, 1, 2], 2],
];
foreach (['bruteForce', 'maxMinusMin', 'runningMin', 'twoPointers'] as $fn) {
    $bad = [];
    foreach ($cases as [$p, $want]) {
        $got = $fn($p);
        if ($got !== $want) $bad[] = json_encode($p) . " → $got";
    }
    $ok = count($cases) - count($bad);
    echo str_pad($fn, 12) . " $ok/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
