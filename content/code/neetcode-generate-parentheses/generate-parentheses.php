<?php
// LeetCode 22, Generate Parentheses: ba cách đúng, hai bản sai, test.
// Chạy: php generate-parentheses.php
declare(strict_types=1);

function generateAllFilter(int $n): array {
    $out = [];
    for ($mask = 0; $mask < (1 << (2 * $n)); $mask++) { // 2^(2n) bộ, bit 1 là "("
        $s = '';
        $bal = 0;
        for ($i = 2 * $n - 1; $i >= 0; $i--) {
            $open = ($mask >> $i) & 1;
            $s .= $open ? '(' : ')';
            $bal += $open ? 1 : -1;
            if ($bal < 0) break;
        }
        if ($bal === 0 && strlen($s) === 2 * $n) $out[] = $s;
    }
    return $out;
}

// Cách 2: quay lui, chuỗi truyền theo giá trị: $s . '(' là chuỗi mới, không cần gỡ.
function backtrack(int $n): array {
    $out = [];
    $go = function (string $s, int $open, int $close) use (&$go, &$out, $n): void {
        if (strlen($s) === 2 * $n) {
            $out[] = $s;
            return;
        }
        if ($open < $n) $go($s . '(', $open + 1, $close);
        if ($close < $open) $go($s . ')', $open, $close + 1);
    };
    $go('', 0, 0);
    return $out;
}

// Cách 3: ngăn xếp tự quản.
function explicitStack(int $n): array {
    $out = [];
    $st = [['', 0, 0]];
    while ($st) {
        [$s, $open, $close] = array_pop($st);
        if (strlen($s) === 2 * $n) {
            $out[] = $s;
            continue;
        }
        if ($close < $open) $st[] = [$s . ')', $open, $close + 1];
        if ($open < $n) $st[] = [$s . '(', $open + 1, $close];
    }
    return $out;
}

// SAI: điều kiện đóng là close < n thay vì close < open.
function wrongCloseLtN(int $n): array {
    $out = [];
    $go = function (string $s, int $open, int $close) use (&$go, &$out, $n): void {
        if (strlen($s) === 2 * $n) {
            $out[] = $s;
            return;
        }
        if ($open < $n) $go($s . '(', $open + 1, $close);
        if ($close < $n) $go($s . ')', $open, $close + 1);
    };
    $go('', 0, 0);
    return $out;
}

// SAI: bộ đệm dùng chung truyền THAM CHIẾU (&$buf) nhưng quên gỡ ký tự sau khi thử.
function forgetUndo(int $n): array {
    $out = [];
    $buf = '';
    $go = function (int $open, int $close) use (&$go, &$out, &$buf, $n): void {
        if (strlen($buf) >= 2 * $n) {
            $out[] = $buf; // chuỗi PHP là giá trị: dòng này đã chép, cái hỏng là ký tự thừa
            return;
        }
        if ($open < $n) {
            $buf .= '(';
            $go($open + 1, $close); // thiếu: $buf = substr($buf, 0, -1);
        }
        if ($close < $open) {
            $buf .= ')';
            $go($open, $close + 1);
        }
    };
    $go(0, 0);
    return $out;
}

function valid(string $s): bool {
    $bal = 0;
    foreach (str_split($s) as $ch) {
        $bal += $ch === '(' ? 1 : -1;
        if ($bal < 0) return false;
    }
    return $bal === 0;
}

function catalan(int $n): int {
    $c = 1;
    for ($i = 0; $i < $n; $i++) $c = intdiv($c * 2 * (2 * $i + 1), $i + 2);
    return $c;
}

function correct(array $out, int $n): bool {
    if (count($out) !== catalan($n) || count(array_unique($out)) !== count($out)) return false;
    foreach ($out as $s) if (strlen($s) !== 2 * $n || !valid($s)) return false;
    return true;
}

foreach (['generateAllFilter', 'backtrack', 'explicitStack', 'wrongCloseLtN', 'forgetUndo'] as $fn) {
    $ok = 0;
    for ($n = 1; $n <= 8; $n++) if (correct($fn($n), $n)) $ok++;
    printf("%-18s %d/8 ca đúng\n", $fn, $ok);
}
echo "\nforgetUndo(2) = " . json_encode(forgetUndo(2)) . "\n";
echo 'backtrack(3)  = ' . json_encode(backtrack(3)) . "\n";
