<?php
// Ga DP-07: DP khoảng (Burst Balloons) và DP khớp mẫu (Regular Expression Matching).
// Chạy: php intervals.php

// best[l][r] = số xu nhiều nhất khi nổ hết bóng nằm giữa l và r (không tính l, r).
// Chọn k là quả nổ CUỐI CÙNG trong khoảng: lúc đó hai bên của k là l và r.
function maxCoins(array $nums): int {
    $vals = array_merge([1], $nums, [1]); // thêm hai quả bóng giá 1 ở hai đầu
    $size = count($vals);
    $best = array_fill(0, $size, array_fill(0, $size, 0));
    for ($gap = 2; $gap < $size; $gap++) { // khoảng ngắn trước, dài sau
        for ($l = 0; $l + $gap < $size; $l++) {
            $r = $l + $gap;
            for ($k = $l + 1; $k < $r; $k++) {
                $coins = $vals[$l] * $vals[$k] * $vals[$r] + $best[$l][$k] + $best[$k][$r];
                if ($coins > $best[$l][$r]) $best[$l][$r] = $coins;
            }
        }
    }
    return $best[0][$size - 1];
}

// match[i][j] = s[0:i] khớp trọn p[0:j]. Dấu * đi cùng ký tự đứng trước nó.
function isMatch(string $s, string $p): bool {
    $m = strlen($s);
    $n = strlen($p);
    $match = array_fill(0, $m + 1, array_fill(0, $n + 1, false));
    $match[0][0] = true;
    for ($i = 0; $i <= $m; $i++) {
        for ($j = 1; $j <= $n; $j++) {
            if ($p[$j - 1] === '*') {
                // dùng x* không lần nào (đọc lùi hai cột), hoặc ăn thêm một ký tự của s
                $eats = $i > 0 && ($p[$j - 2] === '.' || $p[$j - 2] === $s[$i - 1]) && $match[$i - 1][$j];
                $match[$i][$j] = $match[$i][$j - 2] || $eats;
            } else {
                $match[$i][$j] = $i > 0 && ($p[$j - 1] === '.' || $p[$j - 1] === $s[$i - 1]) && $match[$i - 1][$j - 1];
            }
        }
    }
    return $match[$m][$n];
}

$balloonCases = [
    [[2, 4, 3], 33], [[5], 5], [[1, 5], 10], [[0, 4], 4],
    [[3, 3, 3], 39], [[9, 1, 2, 8], 243], [[4, 2, 7, 1, 6], 296],
];
$patternCases = [
    ["", "", true], ["", "a*", true], ["", "a*b*.*", true], ["abc", "abc", true],
    ["abc", "a.c", true], ["abc", "ab", false], ["aaa", "a*", true], ["aaa", "ab*a*", true],
    ["xyz", ".*", true], ["xyz", ".*q", false], ["ab", ".*c", false], ["aaab", "a*ab", true],
    ["ba", "a*ba*", true], ["a", "ab*", true], ["bbbba", ".*a*a", true], ["ab", "a*", false],
];
$ok = 0;
foreach ($balloonCases as [$nums, $want]) {
    $got = maxCoins($nums);
    if ($got === $want) $ok++;
    else echo "sai ở: maxCoins([" . implode(",", $nums) . "]) = $got, cần $want\n";
}
foreach ($patternCases as [$s, $p, $want]) {
    $got = isMatch($s, $p);
    if ($got === $want) $ok++;
    else echo "sai ở: isMatch(\"$s\", \"$p\") = " . var_export($got, true) . ", cần " . var_export($want, true) . "\n";
}
echo $ok . "/" . (count($balloonCases) + count($patternCases)) . " ca đúng\n";
