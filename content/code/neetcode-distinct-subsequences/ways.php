<?php
declare(strict_types=1);

const CAP = 1 << 31; // đáp án LeetCode luôn nhỏ hơn mức này

function countSearch(string $s, string $t, bool $memo, int &$calls): int {
    $cache = $memo ? [] : null;
    $search = function (int $i, int $j) use (&$search, &$cache, &$calls, $s, $t): int {
        $calls++;
        if ($j === strlen($t)) return 1;
        if (strlen($s) - $i < strlen($t) - $j) return 0;
        $key = $i . ',' . $j;
        if ($cache !== null && isset($cache[$key])) return $cache[$key];
        $ways = $search($i + 1, $j);
        if ($s[$i] === $t[$j]) $ways = min($ways + $search($i + 1, $j + 1), CAP);
        if ($cache !== null) $cache[$key] = $ways;
        return $ways;
    };
    return $search(0, 0);
}

function countTable(string $s, string $t): int {
    $m = strlen($s);
    $n = strlen($t);
    // ways[i][j]: số cách chọn t[:j] làm dãy con của s[:i]
    $ways = array_fill(0, $m + 1, array_fill(0, $n + 1, 0));
    for ($i = 0; $i <= $m; $i++) $ways[$i][0] = 1;
    for ($i = 1; $i <= $m; $i++) {
        for ($j = 1; $j <= $n; $j++) {
            $ways[$i][$j] = $ways[$i - 1][$j];
            if ($s[$i - 1] === $t[$j - 1]) $ways[$i][$j] = min($ways[$i][$j] + $ways[$i - 1][$j - 1], CAP);
        }
    }
    return $ways[$m][$n];
}

function fillRow(string $s, string $t, int $cap): array {
    $n = strlen($t);
    $row = array_fill(0, $n + 1, 0);
    $row[0] = 1;
    for ($i = 0; $i < strlen($s); $i++) {
        // đi ngược để row[j - 1] vẫn là giá trị của hàng trước
        for ($j = $n; $j >= 1; $j--) {
            if ($s[$i] === $t[$j - 1]) $row[$j] = min($row[$j] + $row[$j - 1], $cap);
        }
    }
    return $row;
}

function countRow(string $s, string $t, int $cap = CAP): int {
    return fillRow($s, $t, $cap)[strlen($t)];
}

function allMatch(string $s, string $t, int $expected): bool {
    $calls = 0;
    if (countTable($s, $t) !== $expected || countRow($s, $t) !== $expected
        || countSearch($s, $t, true, $calls) !== $expected) return false;
    return strlen($s) > 20 || countSearch($s, $t, false, $calls) === $expected;
}

function countOracle(string $s, string $t): int {
    $found = 0;
    for ($mask = 0; $mask < 1 << strlen($s); $mask++) {
        $picked = '';
        for ($k = 0; $k < strlen($s); $k++) if ($mask & (1 << $k)) $picked .= $s[$k];
        if ($picked === $t) $found++;
    }
    return $found;
}

function stringsOf(int $size): array {
    $out = [];
    for ($mask = 0; $mask < 1 << $size; $mask++) {
        $word = '';
        for ($k = $size - 1; $k >= 0; $k--) $word .= ($mask & (1 << $k)) ? 'b' : 'a';
        $out[] = $word;
    }
    return $out;
}

$a = fn(int $count): string => str_repeat('a', $count);
$cases = [
    ['banana', 'ban', 3],
    ['banana', 'ana', 4],
    ['aaa', 'aa', 3],
    ['ab', 'abc', 0],
    ['abc', 'd', 0],
    ['Aa', 'a', 1],
    ['mississippi', 'sip', 12],
    [$a(1000), $a(3), 166167000],
    [$a(1000), $a(1000), 1],
    [$a(1000), $a(499) . 'b', 0],
    [str_repeat('ab', 100), 'abab', 4249575],
];
foreach ($cases as [$s, $t, $expected]) {
    if (!allMatch($s, $t, $expected)) throw new Exception('Ca kiểm tra sai');
}
printf("%d/%d ca đúng\n", count($cases), count($cases));

$targets = array_merge(...array_map('stringsOf', [1, 2, 3]));
$probes = 0;
for ($size = 0; $size < 8; $size++) {
    foreach (stringsOf($size) as $s) {
        foreach ($targets as $t) {
            $expected = countOracle($s, $t);
            if (!allMatch($s, $t, $expected) || countRow($s, $t, 3) !== min($expected, 3)) {
                throw new Exception('Ca vét đối chiếu sai');
            }
            $probes++;
        }
    }
}
printf("%d/%d ca đúng (vét mọi tập vị trí)\n", $probes, $probes);

$row = fillRow($a(1000), $a(499) . 'b', CAP);
$full = count(array_filter($row, fn(int $value): bool => $value === CAP));
printf("Hàng cuối: %d/%d ô chạm 2^31, đáp án %d\n", $full, count($row), $row[500]);
