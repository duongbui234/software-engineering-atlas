<?php
function lcsBrute(string $a, string $b, int &$calls): int {
    $solve = function (int $i, int $j) use (&$solve, $a, $b, &$calls): int {
        $calls++;
        if ($i === strlen($a) || $j === strlen($b)) return 0;
        if ($a[$i] === $b[$j]) return 1 + $solve($i + 1, $j + 1);
        return max($solve($i + 1, $j), $solve($i, $j + 1));
    };
    return $solve(0, 0);
}

function lcsMemo(string $a, string $b, int &$calls): int {
    $cache = [];
    $solve = function (int $i, int $j) use (&$solve, &$cache, $a, $b, &$calls): int {
        $calls++;
        if ($i === strlen($a) || $j === strlen($b)) return 0;
        $key = $i * (strlen($b) + 1) + $j;
        if (array_key_exists($key, $cache)) return $cache[$key];
        $best = $a[$i] === $b[$j]
            ? 1 + $solve($i + 1, $j + 1)
            : max($solve($i + 1, $j), $solve($i, $j + 1));
        return $cache[$key] = $best;
    };
    return $solve(0, 0);
}

function lcsTable(string $a, string $b): array {
    // dp[i][j]: LCS của a[:i] và b[:j]; hàng 0 và cột 0 là tiền tố rỗng
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
    return $dp;
}

function lcsRow(string $a, string $b): int {
    if (strlen($b) > strlen($a)) [$a, $b] = [$b, $a];
    $m = strlen($b);
    $row = array_fill(0, $m + 1, 0);
    for ($i = 1; $i <= strlen($a); $i++) {
        $diagonal = 0; // dp[i-1][j-1], phải giữ trước khi ghi đè row[j]
        for ($j = 1; $j <= $m; $j++) {
            $above = $row[$j];
            $row[$j] = $a[$i - 1] === $b[$j - 1] ? $diagonal + 1 : max($above, $row[$j - 1]);
            $diagonal = $above;
        }
    }
    return $row[$m];
}

function rebuild(string $a, string $b, array $dp): string {
    $i = strlen($a);
    $j = strlen($b);
    $out = '';
    while ($i > 0 && $j > 0) {
        if ($a[$i - 1] === $b[$j - 1]) {
            $out .= $a[$i - 1];
            $i--;
            $j--;
        } elseif ($dp[$i - 1][$j] >= $dp[$i][$j - 1]) {
            $i--;
        } else {
            $j--;
        }
    }
    return strrev($out);
}

function isSubsequence(string $small, string $big): bool {
    $k = 0;
    for ($i = 0; $i < strlen($big) && $k < strlen($small); $i++) {
        if ($big[$i] === $small[$k]) $k++;
    }
    return $k === strlen($small);
}

function bySubsets(string $a, string $b): int {
    $best = 0;
    for ($mask = 0; $mask < 1 << strlen($a); $mask++) {
        $picked = '';
        for ($k = 0; $k < strlen($a); $k++) if ($mask >> $k & 1) $picked .= $a[$k];
        if (strlen($picked) > $best && isSubsequence($picked, $b)) $best = strlen($picked);
    }
    return $best;
}

function allAgree(string $a, string $b, int $expected): bool {
    $dp = lcsTable($a, $b);
    $path = rebuild($a, $b, $dp);
    return $dp[strlen($a)][strlen($b)] === $expected && lcsRow($a, $b) === $expected &&
        strlen($path) === $expected && isSubsequence($path, $a) && isSubsequence($path, $b);
}

function check(bool $ok): void {
    if (!$ok) throw new RuntimeException('ca kiểm tra sai');
}

$cases = [
    ['bread', 'boardgame', 3],
    ['abc', 'abc', 3],
    ['abc', 'xyz', 0],
    ['a', 'a', 1],
    ['a', 'b', 0],
    ['ezupkr', 'ubmrapg', 2],
    ['abcba', 'abcbcba', 5],
    [str_repeat('ab', 500), str_repeat('ba', 500), 999],
    [str_repeat('a', 1000), str_repeat('a', 1000), 1000],
];
foreach ($cases as [$a, $b, $expected]) {
    check(allAgree($a, $b, $expected));
    $calls = 0;
    if (strlen($a) <= 20) check(lcsMemo($a, $b, $calls) === $expected);
}
printf("%d/%d ca đúng\n", count($cases), count($cases));

$words = [];
for ($size = 1; $size <= 5; $size++) {
    for ($mask = 0; $mask < 1 << $size; $mask++) {
        $word = '';
        for ($k = $size - 1; $k >= 0; $k--) $word .= ($mask >> $k & 1) ? 'b' : 'a';
        $words[] = $word;
    }
}
$checked = 0;
foreach ($words as $a) {
    foreach ($words as $b) {
        $expected = bySubsets($a, $b);
        $calls = 0;
        check(allAgree($a, $b, $expected) && lcsMemo($a, $b, $calls) === $expected);
        if (strlen($a) + strlen($b) <= 8) check(lcsBrute($a, $b, $calls) === $expected);
        $checked++;
    }
}
printf("%d/%d ca đúng (đối chiếu mọi tập con, chuỗi a/b dài 1–5)\n", $checked, $checked);

$bruteCalls = 0;
$memoCalls = 0;
lcsBrute('abcdefghij', 'klmnopqrst', $bruteCalls);
lcsMemo('abcdefghij', 'klmnopqrst', $memoCalls);
printf("Hai chuỗi 10 ký tự không chung chữ: vét cạn %d lượt gọi, memo %d lượt gọi\n", $bruteCalls, $memoCalls);
echo 'Một LCS của bread và boardgame: ', rebuild('bread', 'boardgame', lcsTable('bread', 'boardgame')), "\n";
