<?php
// LeetCode 36, Valid Sudoku: ba cách và test.
// Chạy: php valid-sudoku.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1, ba lượt: kiểm hàng, cột, từng ô 3×3.
function threePass(array $board): bool {
    $unique = function (array $cells): bool {
        $seen = [];
        foreach ($cells as $d) {
            if ($d === '.') continue;
            if (isset($seen[$d])) return false;
            $seen[$d] = true;
        }
        return true;
    };
    for ($i = 0; $i < 9; $i++) {
        $row = $board[$i];
        $col = array_column($board, $i); // cột i của mảng hai chiều
        $br = intdiv($i, 3) * 3; $bc = ($i % 3) * 3;
        $box = [];
        for ($r = $br; $r < $br + 3; $r++) for ($c = $bc; $c < $bc + 3; $c++) $box[] = $board[$r][$c];
        if (!$unique($row) || !$unique($col) || !$unique($box)) return false;
    }
    return true;
}

// Cách 2, một lượt với 27 "set". array_fill(0, 9, []) an toàn trong PHP:
// mảng là GIÁ TRỊ, mỗi ô là một bản riêng (khác hẳn Array(9).fill(new Set()) của JS).
function onePass(array $board): bool {
    $rows = array_fill(0, 9, []); $cols = array_fill(0, 9, []); $boxes = array_fill(0, 9, []);
    for ($r = 0; $r < 9; $r++) {
        for ($c = 0; $c < 9; $c++) {
            $d = $board[$r][$c];
            if ($d === '.') continue;
            $b = intdiv($r, 3) * 3 + intdiv($c, 3);
            if (isset($rows[$r][$d]) || isset($cols[$c][$d]) || isset($boxes[$b][$d])) return false;
            $rows[$r][$d] = $cols[$c][$d] = $boxes[$b][$d] = true;
        }
    }
    return true;
}

// Cách 3, bitmask 9 bit cho mỗi hàng/cột/ô.
function bitmask(array $board): bool {
    $rows = $cols = $boxes = array_fill(0, 9, 0);
    for ($r = 0; $r < 9; $r++) {
        for ($c = 0; $c < 9; $c++) {
            $d = $board[$r][$c];
            if ($d === '.') continue;
            $bit = 1 << ((int) $d - 1);
            $b = intdiv($r, 3) * 3 + intdiv($c, 3);
            if ((($rows[$r] | $cols[$c] | $boxes[$b]) & $bit) !== 0) return false; // cần ngoặc quanh &
            $rows[$r] |= $bit; $cols[$c] |= $bit; $boxes[$b] |= $bit;
        }
    }
    return true;
}

// Bản sai: chỉ số ô 3×3 thiếu nhân 3.
function wrongBoxIndex(array $board): bool {
    $seen = [];
    for ($r = 0; $r < 9; $r++) {
        for ($c = 0; $c < 9; $c++) {
            $d = $board[$r][$c];
            if ($d === '.') continue;
            $b = intdiv($r, 3) + intdiv($c, 3);
            foreach (["r$r$d", "c$c$d", "b$b$d"] as $k) {
                if (isset($seen[$k])) return false;
                $seen[$k] = true;
            }
        }
    }
    return true;
}

$parse = fn(array $rows): array => array_map('str_split', $rows);
$example = $parse(['53..7....', '6..195...', '.98....6.', '8...6...3', '4..8.3..1', '7...2...6', '.6....28.', '...419..5', '....8..79']);
$withChange = function (int $r, int $c, string $d) use ($example): array { $b = $example; $b[$r][$c] = $d; return $b; }; // $b là bản sao
$cases = [
    ['ví dụ hợp lệ', $example, true],
    ['8 ở góc (trùng cột và ô 3×3)', $withChange(0, 0, '8'), false],
    ['trùng hàng 0', $withChange(0, 8, '5'), false],
    ['trùng chỉ trong ô 3×3', $withChange(1, 1, '8'), false],
    ['bảng trống', $parse(array_fill(0, 9, '.........')), true],
    ['hai số 1 ở hai ô khác nhau', $parse(['...1.....', '.........', '.........', '1........', '.........', '.........', '.........', '.........', '.........']), true],
];
foreach (['threePass', 'onePass', 'bitmask', 'wrongBoxIndex'] as $fn) {
    $bad = array_column(array_filter($cases, fn($c) => $fn($c[1]) !== $c[2]), 0);
    printf("%-14s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở: ' . implode(', ', $bad) : '');
}

// ── bẫy: & đứng sau != về độ ưu tiên ─────────────────────────────────────────
$x = 0b101; $bit = 0b010;
echo "\n\$x = 0b101, \$bit = 0b010: (\$x & \$bit) !== 0 → ", var_export(($x & $bit) !== 0, true),
     " | \$x & \$bit != 0 → ", var_export($x & $bit != 0, true), " (thành \$x & true = 1: báo nhầm là có)\n";
