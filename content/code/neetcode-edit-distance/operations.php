<?php

// Vét cạn: solve(i, j) = số bước ít nhất để biến a[i:] thành b[j:]
function editDistanceBrute(string $a, string $b, int &$calls = 0): int {
    $solve = function (int $i, int $j) use (&$solve, $a, $b, &$calls): int {
        $calls++;
        if ($i === strlen($a)) return strlen($b) - $j; // chèn hết phần còn lại của b
        if ($j === strlen($b)) return strlen($a) - $i; // xóa hết phần còn lại của a
        if ($a[$i] === $b[$j]) return $solve($i + 1, $j + 1);
        return 1 + min($solve($i, $j + 1), $solve($i + 1, $j), $solve($i + 1, $j + 1));
    };
    return $solve(0, 0);
}

// Ghi nhớ: cùng công thức, mỗi cặp (i, j) chỉ tính một lần
function editDistanceMemo(string $a, string $b, int &$calls = 0): int {
    $memo = [];
    $width = strlen($b) + 1;
    $solve = function (int $i, int $j) use (&$solve, &$memo, $a, $b, $width, &$calls): int {
        $calls++;
        if ($i === strlen($a)) return strlen($b) - $j;
        if ($j === strlen($b)) return strlen($a) - $i;
        $key = $i * $width + $j;
        if (array_key_exists($key, $memo)) return $memo[$key];
        $result = $a[$i] === $b[$j]
            ? $solve($i + 1, $j + 1)
            : 1 + min($solve($i, $j + 1), $solve($i + 1, $j), $solve($i + 1, $j + 1));
        $memo[$key] = $result;
        return $result;
    };
    return $solve(0, 0);
}

// Bảng đầy đủ: dp[i][j] = khoảng cách giữa tiền tố a[0:i] và b[0:j]
function editDistanceTable(string $a, string $b): array {
    $m = strlen($a);
    $n = strlen($b);
    $dp = array_fill(0, $m + 1, array_fill(0, $n + 1, 0));
    for ($i = 0; $i <= $m; $i++) $dp[$i][0] = $i;
    for ($j = 0; $j <= $n; $j++) $dp[0][$j] = $j;
    for ($i = 1; $i <= $m; $i++) {
        for ($j = 1; $j <= $n; $j++) {
            $dp[$i][$j] = $a[$i - 1] === $b[$j - 1]
                ? $dp[$i - 1][$j - 1]
                : 1 + min($dp[$i - 1][$j], $dp[$i][$j - 1], $dp[$i - 1][$j - 1]);
        }
    }
    return $dp;
}

// Một hàng và một biến chéo: bản nộp LeetCode
function minDistance(string $a, string $b): int {
    if (strlen($b) > strlen($a)) [$a, $b] = [$b, $a]; // hàng dài theo chuỗi ngắn hơn
    $n = strlen($b);
    $row = range(0, $n);
    for ($i = 1; $i <= strlen($a); $i++) {
        $diagonal = $row[0]; // dp[i-1][j-1]
        $row[0] = $i;
        for ($j = 1; $j <= $n; $j++) {
            $above = $row[$j]; // dp[i-1][j], sắp bị ghi đè
            $row[$j] = $a[$i - 1] === $b[$j - 1]
                ? $diagonal
                : 1 + min($above, $row[$j - 1], $diagonal);
            $diagonal = $above;
        }
    }
    return $row[$n];
}

// Lần ngược bảng đầy đủ để in kịch bản sửa
function editScript(string $a, string $b): array {
    $dp = editDistanceTable($a, $b);
    $ops = [];
    $i = strlen($a);
    $j = strlen($b);
    while ($i > 0 || $j > 0) {
        if ($i > 0 && $j > 0 && $a[$i - 1] === $b[$j - 1] && $dp[$i][$j] === $dp[$i - 1][$j - 1]) {
            $ops[] = ['giữ', $a[$i - 1], $b[$j - 1]]; $i--; $j--;
        } elseif ($i > 0 && $j > 0 && $dp[$i][$j] === $dp[$i - 1][$j - 1] + 1) {
            $ops[] = ['thay', $a[$i - 1], $b[$j - 1]]; $i--; $j--;
        } elseif ($i > 0 && $dp[$i][$j] === $dp[$i - 1][$j] + 1) {
            $ops[] = ['xóa', $a[$i - 1], '']; $i--;
        } else {
            $ops[] = ['chèn', '', $b[$j - 1]]; $j--;
        }
    }
    return array_reverse($ops);
}

function scriptWorks(string $a, string $b, array $ops, int $distance): bool {
    $consumed = implode('', array_column($ops, 1));
    $produced = implode('', array_column($ops, 2));
    $cost = count(array_filter($ops, fn($op) => $op[0] !== 'giữ'));
    return $consumed === $a && $produced === $b && $cost === $distance;
}

function describe(array $ops): string {
    return implode(', ', array_map(fn($op) => match ($op[0]) {
        'giữ' => "giữ {$op[1]}",
        'thay' => "thay {$op[1]}→{$op[2]}",
        'xóa' => "xóa {$op[1]}",
        default => "chèn {$op[2]}",
    }, $ops));
}

// BFS trên chính các chuỗi, độc lập với công thức DP
function bfsDistance(string $a, string $b): int {
    $limit = max(strlen($a), strlen($b));
    $seen = [$a => 0];
    $queue = [$a];
    for ($head = 0; $head < count($queue); $head++) {
        $s = $queue[$head];
        $d = $seen[$s];
        if ($s === $b) return $d;
        $next = [];
        for ($p = 0; $p < strlen($s); $p++) {
            $next[] = substr($s, 0, $p) . substr($s, $p + 1);
            $next[] = substr($s, 0, $p) . ($s[$p] === 'a' ? 'b' : 'a') . substr($s, $p + 1);
        }
        if (strlen($s) < $limit) {
            for ($p = 0; $p <= strlen($s); $p++) {
                $next[] = substr($s, 0, $p) . 'a' . substr($s, $p);
                $next[] = substr($s, 0, $p) . 'b' . substr($s, $p);
            }
        }
        foreach ($next as $t) {
            if (!array_key_exists($t, $seen)) { $seen[$t] = $d + 1; $queue[] = $t; }
        }
    }
    return -1;
}

$cases = [
    ['', '', 0],
    ['', 'abc', 3],
    ['abc', '', 3],
    ['abc', 'abc', 0],
    ['cat', 'cut', 1],
    ['table', 'tables', 1],
    ['ab', 'ba', 2],
    ['kitten', 'sitting', 3],
    ['flaw', 'lawn', 2],
    ['sunday', 'saturday', 3],
    ['pqrst', 'qrstu', 2],
    [str_repeat('ab', 250), str_repeat('ba', 250), 2],
    [str_repeat('a', 500), str_repeat('b', 500), 500],
];
$ok = 0;
foreach ($cases as [$a, $b, $expected]) {
    $results = [minDistance($a, $b), editDistanceMemo($a, $b), editDistanceTable($a, $b)[strlen($a)][strlen($b)]];
    if (strlen($a) + strlen($b) <= 16) $results[] = editDistanceBrute($a, $b);
    $allMatch = count(array_filter($results, fn($r) => $r !== $expected)) === 0;
    if ($allMatch && scriptWorks($a, $b, editScript($a, $b), $expected)) $ok++;
}
echo "$ok/" . count($cases) . " ca đúng\n";

$words = [''];
for ($k = 0; $k < count($words); $k++) {
    if (strlen($words[$k]) < 4) { $words[] = $words[$k] . 'a'; $words[] = $words[$k] . 'b'; }
}
$exhaustiveOk = 0;
$total = 0;
foreach ($words as $a) {
    foreach ($words as $b) {
        $total++;
        $expected = bfsDistance($a, $b);
        $results = [editDistanceBrute($a, $b), editDistanceMemo($a, $b), minDistance($a, $b),
            editDistanceTable($a, $b)[strlen($a)][strlen($b)]];
        $allMatch = count(array_filter($results, fn($r) => $r !== $expected)) === 0;
        if ($allMatch && scriptWorks($a, $b, editScript($a, $b), $expected)) $exhaustiveOk++;
    }
}
echo "$exhaustiveOk/$total ca đúng (đối chiếu BFS)\n";

$brute = 0;
$memo = 0;
editDistanceBrute(str_repeat('a', 8), str_repeat('b', 8), $brute);
editDistanceMemo(str_repeat('a', 8), str_repeat('b', 8), $memo);
echo "Vét cạn: $brute lượt gọi, memo: $memo lượt gọi\n";
echo "kitten → sitting: " . describe(editScript('kitten', 'sitting')) . "\n";
