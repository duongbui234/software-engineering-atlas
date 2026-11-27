<?php
const LIMIT = 2_000_000_000;

function pathsBrute(int $m, int $n, int &$calls): int {
    $walk = function (int $r, int $c) use (&$walk, $m, $n, &$calls): int {
        $calls++;
        if ($r === $m - 1 && $c === $n - 1) return 1;
        $total = 0;
        if ($r + 1 < $m) $total += $walk($r + 1, $c);
        if ($c + 1 < $n) $total += $walk($r, $c + 1);
        return $total;
    };
    return $walk(0, 0);
}

function pathsMemo(int $m, int $n, int &$calls): int {
    $cache = [];
    $walk = function (int $r, int $c) use (&$walk, &$cache, $m, $n, &$calls): int {
        $calls++;
        if ($r === $m - 1 || $c === $n - 1) return 1;
        $key = $r * $n + $c;
        if (array_key_exists($key, $cache)) return $cache[$key];
        return $cache[$key] = $walk($r + 1, $c) + $walk($r, $c + 1);
    };
    return $walk(0, 0);
}

function pathsTable(int $m, int $n): int {
    $ways = array_fill(0, $m, array_fill(0, $n, 1));
    for ($r = 1; $r < $m; $r++) {
        for ($c = 1; $c < $n; $c++) {
            $ways[$r][$c] = $ways[$r - 1][$c] + $ways[$r][$c - 1];
        }
    }
    return $ways[$m - 1][$n - 1];
}

function pathsRow(int $m, int $n): int {
    $row = array_fill(0, $n, 1);
    for ($r = 1; $r < $m; $r++) {
        for ($c = 1; $c < $n; $c++) $row[$c] += $row[$c - 1];
    }
    return $row[$n - 1];
}

function pathsFormula(int $m, int $n): int {
    $k = min($m, $n) - 1;
    $total = $m + $n - 2;
    $result = 1;
    for ($i = 1; $i <= $k; $i++) {
        // intdiv giữ kiểu int; dùng / sẽ ra float
        $result = intdiv($result * ($total - $k + $i), $i);
    }
    return $result;
}

function sameAnswer(int $m, int $n, int $expected): bool {
    return pathsTable($m, $n) === $expected && pathsRow($m, $n) === $expected && pathsFormula($m, $n) === $expected;
}

function check(bool $ok): void {
    if (!$ok) throw new RuntimeException('ca kiểm tra sai');
}

$cases = [[1, 1, 1], [1, 7, 1], [2, 2, 2], [3, 2, 3], [3, 7, 28], [10, 10, 48620], [23, 12, 193536720]];
foreach ($cases as [$m, $n, $expected]) {
    $calls = 0;
    check(sameAnswer($m, $n, $expected) && pathsMemo($m, $n, $calls) === $expected);
}
printf("%d/%d ca đúng\n", count($cases), count($cases));

$checked = 0;
for ($m = 1; $m <= 8; $m++) {
    for ($n = 1; $n <= 8; $n++) {
        $calls = 0;
        $brute = pathsBrute($m, $n, $calls);
        check(sameAnswer($m, $n, $brute) && pathsMemo($m, $n, $calls) === $brute);
        $checked++;
    }
}
printf("%d/%d ca đúng (đối chiếu vét cạn, lưới tới 8×8)\n", $checked, $checked);

// Pascal có chặn trên: ô nào vượt LIMIT thì giữ ở LIMIT + 1.
$pascal = array_fill(0, 101, array_fill(0, 101, 1));
for ($r = 2; $r <= 100; $r++) {
    for ($c = 2; $c <= 100; $c++) {
        $pascal[$r][$c] = min($pascal[$r - 1][$c] + $pascal[$r][$c - 1], LIMIT + 1);
    }
}
$inside = 0;
for ($m = 1; $m <= 100; $m++) {
    for ($n = 1; $n <= 100; $n++) {
        if ($pascal[$m][$n] <= LIMIT) {
            check(sameAnswer($m, $n, $pascal[$m][$n]));
            $inside++;
        }
    }
}
printf("%d/%d ca đúng (mọi lưới 1..100 có đáp án ≤ 2·10⁹)\n", $inside, $inside);

$bruteCalls = 0;
$memoCalls = 0;
pathsBrute(10, 10, $bruteCalls);
pathsMemo(10, 10, $memoCalls);
printf("Lưới 10×10: vét cạn %d lượt gọi, memo %d lượt gọi\n", $bruteCalls, $memoCalls);
