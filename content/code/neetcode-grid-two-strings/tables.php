<?php
// Ga DP-05: bảng theo lưới và theo hai tiền tố
function uniquePaths(int $m, int $n): int {
    $row = array_fill(0, $n, 1); // hàng 0: mọi ô có đúng một đường
    for ($i = 1; $i < $m; $i++) {
        for ($j = 1; $j < $n; $j++) $row[$j] += $row[$j - 1]; // trên + trái
    }
    return $row[$n - 1];
}

function longestCommonSubsequence(string $a, string $b): int {
    $n = strlen($a);
    $m = strlen($b);
    $dp = array_fill(0, $n + 1, array_fill(0, $m + 1, 0));
    for ($i = 1; $i <= $n; $i++) {
        for ($j = 1; $j <= $m; $j++) {
            $dp[$i][$j] = $a[$i - 1] === $b[$j - 1]
                ? $dp[$i - 1][$j - 1] + 1
                : max($dp[$i - 1][$j], $dp[$i][$j - 1]);
        }
    }
    return $dp[$n][$m];
}

function isInterleave(string $s1, string $s2, string $s3): bool {
    $n = strlen($s1);
    $m = strlen($s2);
    if ($n + $m !== strlen($s3)) return false;
    $row = array_fill(0, $m + 1, false);
    for ($i = 0; $i <= $n; $i++) {
        for ($j = 0; $j <= $m; $j++) {
            if ($i === 0 && $j === 0) { $row[$j] = true; continue; }
            $c = $s3[$i + $j - 1];
            $fromTop = $i > 0 && $row[$j] && $s1[$i - 1] === $c;
            $fromLeft = $j > 0 && $row[$j - 1] && $s2[$j - 1] === $c;
            $row[$j] = $fromTop || $fromLeft;
        }
    }
    return $row[$m];
}

function numDistinct(string $s, string $t): int {
    $m = strlen($t);
    $ways = array_fill(0, $m + 1, 0);
    $ways[0] = 1; // t rỗng: một cách, bỏ hết
    for ($i = 1; $i <= strlen($s); $i++) {
        for ($j = $m; $j >= 1; $j--) { // đi lùi để còn đọc hàng cũ
            if ($s[$i - 1] === $t[$j - 1]) $ways[$j] += $ways[$j - 1];
        }
    }
    return $ways[$m];
}

function minDistance(string $a, string $b): int {
    $m = strlen($b);
    $row = range(0, $m); // a rỗng: chèn j ký tự
    for ($i = 1; $i <= strlen($a); $i++) {
        $diag = $row[0]; // dp[i-1][j-1]
        $row[0] = $i;
        for ($j = 1; $j <= $m; $j++) {
            $top = $row[$j];
            $row[$j] = $a[$i - 1] === $b[$j - 1]
                ? $diag
                : 1 + min($diag, $top, $row[$j - 1]); // thay, xóa, chèn
            $diag = $top;
        }
    }
    return $row[$m];
}

$checks = [
    uniquePaths(3, 7) === 28,
    uniquePaths(3, 2) === 3,
    uniquePaths(1, 1) === 1,
    uniquePaths(23, 12) === 193536720,
    longestCommonSubsequence('abcde', 'ace') === 3,
    longestCommonSubsequence('abc', 'def') === 0,
    longestCommonSubsequence('map', 'mop') === 2,
    isInterleave('aabcc', 'dbbca', 'aadbbcbcac'),
    !isInterleave('aabcc', 'dbbca', 'aadbbbaccc'),
    isInterleave('', '', ''),
    !isInterleave('a', '', 'ab'),
    numDistinct('rabbbit', 'rabbit') === 3,
    numDistinct('babgbag', 'bag') === 5,
    numDistinct('a', 'b') === 0,
    minDistance('horse', 'ros') === 3,
    minDistance('intention', 'execution') === 5,
    minDistance('', 'abc') === 3,
];
foreach ($checks as $ok) if (!$ok) throw new Exception('Ca kiểm tra sai');
$n = count($checks);
echo "$n/$n ca đúng\n";
