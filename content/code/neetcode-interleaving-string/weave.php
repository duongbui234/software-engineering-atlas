<?php
declare(strict_types=1);

function interleaveSearch(string $s1, string $s2, string $s3, bool $memo, int &$calls): bool {
    if (strlen($s1) + strlen($s2) !== strlen($s3)) return false;
    $cache = $memo ? [] : null;
    $search = function (int $i, int $j) use (&$search, &$cache, &$calls, $s1, $s2, $s3): bool {
        $calls++;
        if ($i === strlen($s1) && $j === strlen($s2)) return true;
        $key = $i . ',' . $j;
        if ($cache !== null && isset($cache[$key])) return $cache[$key];
        $k = $i + $j;
        $found = ($i < strlen($s1) && $s1[$i] === $s3[$k] && $search($i + 1, $j))
            || ($j < strlen($s2) && $s2[$j] === $s3[$k] && $search($i, $j + 1));
        if ($cache !== null) $cache[$key] = $found;
        return $found;
    };
    return $search(0, 0);
}

function interleaveTable(string $s1, string $s2, string $s3): bool {
    $m = strlen($s1);
    $n = strlen($s2);
    if ($m + $n !== strlen($s3)) return false;
    // ok[i][j]: s1[:i] và s2[:j] đan thành s3[:i + j]
    $ok = array_fill(0, $m + 1, array_fill(0, $n + 1, false));
    $ok[0][0] = true;
    for ($i = 0; $i <= $m; $i++) {
        for ($j = 0; $j <= $n; $j++) {
            if ($i > 0 && $ok[$i - 1][$j] && $s1[$i - 1] === $s3[$i + $j - 1]) $ok[$i][$j] = true;
            if ($j > 0 && $ok[$i][$j - 1] && $s2[$j - 1] === $s3[$i + $j - 1]) $ok[$i][$j] = true;
        }
    }
    return $ok[$m][$n];
}

function interleaveRow(string $s1, string $s2, string $s3): bool {
    $m = strlen($s1);
    $n = strlen($s2);
    if ($m + $n !== strlen($s3)) return false;
    $row = array_fill(0, $n + 1, false);
    for ($i = 0; $i <= $m; $i++) {
        for ($j = 0; $j <= $n; $j++) {
            if ($i === 0 && $j === 0) {
                $row[$j] = true;
                continue;
            }
            // row[j] còn giữ hàng i - 1 (ô trên), row[j - 1] đã là hàng i (ô trái)
            $fromTop = $i > 0 && $row[$j] && $s1[$i - 1] === $s3[$i + $j - 1];
            $fromLeft = $j > 0 && $row[$j - 1] && $s2[$j - 1] === $s3[$i + $j - 1];
            $row[$j] = $fromTop || $fromLeft;
        }
    }
    return $row[$n];
}

function allMatch(string $s1, string $s2, string $s3, bool $expected): bool {
    $calls = 0;
    if (interleaveTable($s1, $s2, $s3) !== $expected || interleaveRow($s1, $s2, $s3) !== $expected
        || interleaveSearch($s1, $s2, $s3, true, $calls) !== $expected) return false;
    return strlen($s3) > 24 || interleaveSearch($s1, $s2, $s3, false, $calls) === $expected;
}

function interleaveOracle(string $s1, string $s2, string $s3): bool {
    $total = strlen($s3);
    if (strlen($s1) + strlen($s2) !== $total) return false;
    for ($mask = 0; $mask < 1 << $total; $mask++) {
        $first = '';
        $second = '';
        for ($k = 0; $k < $total; $k++) {
            if ($mask & (1 << $k)) $first .= $s3[$k];
            else $second .= $s3[$k];
        }
        if ($first === $s1 && $second === $s2) return true;
    }
    return false;
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
    ['ab', 'cd', 'acbd', true],
    ['ab', 'cd', 'acdb', true],
    ['ab', 'cd', 'badc', false],
    ['ab', 'ac', 'acab', true],
    ['a', 'b', 'abc', false],
    ['', '', '', true],
    ['', 'kiwi', 'kiwi', true],
    ['', 'kiwi', 'kiwj', false],
    ['aab', 'aac', 'aacaab', true],
    ['aab', 'aac', 'abaaac', false],
    [$a(100), $a(100), $a(200), true],
    [$a(100), $a(99) . 'b', $a(198) . 'ba', true],
    [$a(100), $a(99) . 'b', $a(198) . 'bb', false],
];
foreach ($cases as [$s1, $s2, $s3, $expected]) {
    if (!allMatch($s1, $s2, $s3, $expected)) throw new Exception('Ca kiểm tra sai');
}
printf("%d/%d ca đúng\n", count($cases), count($cases));

$words = array_merge(...array_map('stringsOf', [0, 1, 2, 3]));
$probes = 0;
foreach ($words as $s1) {
    foreach ($words as $s2) {
        foreach ([strlen($s1) + strlen($s2), strlen($s1) + strlen($s2) + 1] as $size) {
            foreach (stringsOf($size) as $s3) {
                if (!allMatch($s1, $s2, $s3, interleaveOracle($s1, $s2, $s3))) {
                    throw new Exception('Ca vét đối chiếu sai');
                }
                $probes++;
            }
        }
    }
}
printf("%d/%d ca đúng (vét mọi cách chia)\n", $probes, $probes);

$brute = 0;
$memo = 0;
interleaveSearch($a(10), $a(10), $a(19) . 'b', false, $brute);
interleaveSearch($a(10), $a(10), $a(19) . 'b', true, $memo);
printf("Vét cạn: %d lượt gọi, memo: %d lượt gọi\n", $brute, $memo);
