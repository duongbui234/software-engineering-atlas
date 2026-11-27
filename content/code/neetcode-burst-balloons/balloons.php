<?php
// Burst Balloons (LeetCode 312): bốn cách, từ vét cạn tới bảng theo độ dài khoảng.

// Vét cạn: thử mọi thứ tự nổ, mỗi lần bỏ một quả khỏi mảng còn lại
function burstBrute(array $arr, int &$calls): int {
    $calls++;
    $best = 0;
    $n = count($arr);
    for ($i = 0; $i < $n; $i++) {
        $left = $i > 0 ? $arr[$i - 1] : 1;
        $right = $i + 1 < $n ? $arr[$i + 1] : 1;
        $rest = $arr;
        array_splice($rest, $i, 1);
        $best = max($best, $left * $arr[$i] * $right + burstBrute($rest, $calls));
    }
    return $best;
}

// Cách SAI: chọn quả nổ ĐẦU TIÊN rồi giải hai bên như hai bài độc lập.
// Sau khi k nổ, hai bên kề nhau, nên hàng xóm thật không còn là p[k-1], p[k+1].
function burstFirstSplitWrong(array $nums): int {
    $p = array_merge([1], $nums, [1]);
    $memo = [];
    $solve = function (int $l, int $r) use (&$solve, &$memo, $p): int {
        if ($l > $r) return 0;
        if (isset($memo[$l][$r])) return $memo[$l][$r];
        $best = 0;
        for ($k = $l; $k <= $r; $k++) {
            $best = max($best, $p[$k - 1] * $p[$k] * $p[$k + 1] + $solve($l, $k - 1) + $solve($k + 1, $r));
        }
        return $memo[$l][$r] = $best;
    };
    return $solve(1, count($nums));
}

// Ghi nhớ: solve(l, r) = điểm lớn nhất khi nổ hết các quả nằm GIỮA l và r (không gồm l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hàng xóm của k chính là p[l] và p[r].
function burstMemo(array $nums, int &$calls): int {
    $p = array_merge([1], $nums, [1]);
    $n = count($p);
    $memo = array_fill(0, $n, array_fill(0, $n, -1));
    $solve = function (int $l, int $r) use (&$solve, &$memo, &$calls, $p): int {
        $calls++;
        if ($l + 1 >= $r) return 0;
        if ($memo[$l][$r] !== -1) return $memo[$l][$r];
        $best = 0;
        for ($k = $l + 1; $k < $r; $k++) {
            $best = max($best, $p[$l] * $p[$k] * $p[$r] + $solve($l, $k) + $solve($k, $r));
        }
        return $memo[$l][$r] = $best;
    };
    return $solve(0, $n - 1);
}

// Bảng: điền theo độ dài khoảng tăng dần, khoảng ngắn luôn có trước khoảng dài
function maxCoins(array $nums): int {
    $p = array_merge([1], $nums, [1]);
    $n = count($p);
    $dp = array_fill(0, $n, array_fill(0, $n, 0));
    for ($len = 2; $len < $n; $len++) {
        for ($l = 0; $l + $len < $n; $l++) {
            $r = $l + $len;
            $best = 0;
            for ($k = $l + 1; $k < $r; $k++) {
                $v = $p[$l] * $p[$k] * $p[$r] + $dp[$l][$k] + $dp[$k][$r];
                if ($v > $best) $best = $v;
            }
            $dp[$l][$r] = $best;
        }
    }
    return $dp[0][$n - 1];
}

$mixed = [];
for ($i = 0; $i < 300; $i++) $mixed[] = ($i * 37 + 11) % 101;
$cases = [
    [[7], 7],
    [[2, 3], 9],
    [[0, 0, 0], 0],
    [[4, 0, 4], 20],
    [[2, 9, 4], 84],
    [[5, 1, 1, 5], 60],
    [[9, 1, 8, 2, 7], 760],
    [[1, 2, 3, 4, 5, 6], 252],
    [array_fill(0, 300, 1), 300],
    [array_fill(0, 300, 100), 298010100],
    [$mixed, 116330212],
];
$ok = 0;
foreach ($cases as [$nums, $expected]) {
    $calls = 0;
    $good = maxCoins($nums) === $expected && burstMemo($nums, $calls) === $expected;
    if (count($nums) <= 6 && burstBrute($nums, $calls) !== $expected) $good = false;
    if ($good) $ok++;
}
echo "$ok/" . count($cases) . " ca đúng\n";

$arrays = [[]];
for ($k = 0; $k < count($arrays); $k++) {
    if (count($arrays[$k]) < 5) {
        for ($v = 0; $v <= 3; $v++) $arrays[] = array_merge($arrays[$k], [$v]);
    }
}
$exhaustiveOk = 0;
$total = 0;
foreach (array_slice($arrays, 1) as $nums) {
    $total++;
    $calls = 0;
    $expected = burstBrute($nums, $calls);
    if (maxCoins($nums) === $expected && burstMemo($nums, $calls) === $expected) $exhaustiveOk++;
}
echo "$exhaustiveOk/$total ca đúng (đối chiếu mọi thứ tự nổ)\n";

echo "Chia theo quả nổ đầu tiên với [2,3]: " . burstFirstSplitWrong([2, 3]) . ", đúng là " . maxCoins([2, 3]) . "\n";
$eight = [3, 1, 4, 1, 5, 9, 2, 6];
$bruteCalls = 0;
$memoCalls = 0;
burstBrute($eight, $bruteCalls);
burstMemo($eight, $memoCalls);
echo "8 quả: vét cạn $bruteCalls lượt gọi, memo $memoCalls lượt gọi\n";
