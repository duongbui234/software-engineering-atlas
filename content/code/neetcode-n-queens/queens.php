<?php
// N-Queens (LeetCode 51): vét mọi hoán vị, quay lui với ba tập xung đột, đếm bằng bitmask
// Chạy: php -d xdebug.mode=off queens.php

$calls = 0;

// Đổi danh sách cột ($cols[$r] là cột của hậu ở hàng r) thành bàn cờ dạng chuỗi
function toBoard(array $cols): array {
    $n = count($cols);
    return array_map(fn($c) => str_repeat('.', $c) . 'Q' . str_repeat('.', $n - $c - 1), $cols);
}

// Cách 1: mỗi hàng một hậu, mỗi cột một hậu, tức một hoán vị cột; dựng xong mới xét hai đường chéo
function solveBrute(int $n): array {
    $result = [];
    $cols = [];
    $used = array_fill(0, $n, false);
    $walk = function () use (&$walk, &$result, &$cols, &$used, $n) {
        global $calls;
        $calls++;
        if (count($cols) === $n) {
            if (diagonalsOk($cols)) $result[] = toBoard($cols);
            return;
        }
        for ($c = 0; $c < $n; $c++) {
            if ($used[$c]) continue;
            $used[$c] = true;
            $cols[] = $c;
            $walk();
            array_pop($cols);
            $used[$c] = false;
        }
    };
    $walk();
    return $result;
}

function diagonalsOk(array $cols): bool {
    $n = count($cols);
    for ($a = 0; $a < $n; $a++)
        for ($b = $a + 1; $b < $n; $b++)
            if (abs($cols[$a] - $cols[$b]) === $b - $a) return false;
    return true;
}

// Cách 2: đặt từng hàng; ba mảng đánh dấu cột, chéo chính (r - c + n - 1) và chéo phụ (r + c)
function solveNQueens(int $n): array {
    $result = [];
    $cols = [];
    $colUsed = array_fill(0, $n, false);
    $diag = array_fill(0, 2 * $n - 1, false);
    $anti = array_fill(0, 2 * $n - 1, false);
    $place = function (int $r) use (&$place, &$result, &$cols, &$colUsed, &$diag, &$anti, $n) {
        global $calls;
        $calls++;
        if ($r === $n) {
            $result[] = toBoard($cols); // chỉ dựng chuỗi ở lá
            return;
        }
        for ($c = 0; $c < $n; $c++) {
            $d = $r - $c + $n - 1;
            $a = $r + $c;
            if ($colUsed[$c] || $diag[$d] || $anti[$a]) continue;
            $colUsed[$c] = $diag[$d] = $anti[$a] = true;
            $cols[] = $c;
            $place($r + 1);
            array_pop($cols);
            $colUsed[$c] = $diag[$d] = $anti[$a] = false; // gỡ cả ba dấu
        }
    };
    $place(0);
    return $result;
}

// Cách 3: chỉ đếm; ba tập là ba số nguyên, bit 1 là cột bị chiếu ở hàng đang xét
function countBits(int $n): int {
    $full = (1 << $n) - 1;
    $go = function (int $cols, int $left, int $right) use (&$go, $full): int {
        global $calls;
        $calls++;
        if ($cols === $full) return 1;
        $count = 0;
        $free = $full & ~($cols | $left | $right);
        while ($free !== 0) {
            $bit = $free & -$free; // bit 1 thấp nhất: một cột còn trống
            $free -= $bit;
            // chéo dịch một cột sang trái hoặc phải khi xuống hàng sau
            $count += $go($cols | $bit, (($left | $bit) << 1) & $full, ($right | $bit) >> 1);
        }
        return $count;
    };
    return $go(0, 0, 0);
}

// Bản sai: quên gỡ dấu chéo phụ khi quay lui
function countForgetAnti(int $n): int {
    $colUsed = array_fill(0, $n, false);
    $diag = array_fill(0, 2 * $n - 1, false);
    $anti = array_fill(0, 2 * $n - 1, false);
    $place = function (int $r) use (&$place, &$colUsed, &$diag, &$anti, $n): int {
        if ($r === $n) return 1;
        $count = 0;
        for ($c = 0; $c < $n; $c++) {
            $d = $r - $c + $n - 1;
            $a = $r + $c;
            if ($colUsed[$c] || $diag[$d] || $anti[$a]) continue;
            $colUsed[$c] = $diag[$d] = $anti[$a] = true;
            $count += $place($r + 1);
            $colUsed[$c] = $diag[$d] = false;
        }
        return $count;
    };
    return $place(0);
}

// Kiểm tra độc lập: đọc lại bàn cờ từ chuỗi
function validBoard(array $board, int $n): bool {
    if (count($board) !== $n) return false;
    $cols = $diags = $antis = [];
    foreach ($board as $r => $row) {
        if (strlen($row) !== $n || !preg_match('/^\.*Q\.*$/D', $row)) return false;
        $c = strpos($row, 'Q');
        $cols[$c] = true;
        $diags[$r - $c] = true;
        $antis[$r + $c] = true;
    }
    return count($cols) === $n && count($diags) === $n && count($antis) === $n;
}

function boardsKey(array $boards): string {
    $keys = array_map(fn($b) => implode('/', $b), $boards);
    sort($keys);
    return implode('|', $keys);
}

$known = [1, 0, 0, 2, 10, 4, 40, 92, 352];
$ok = 0;
$total = 0;
$check = function (bool $cond, string $name) use (&$ok, &$total) {
    $total++;
    if ($cond) $ok++;
    else echo "sai ở $name\n";
};
for ($n = 1; $n <= 9; $n++) {
    $check(count(solveNQueens($n)) === $known[$n - 1] && countBits($n) === $known[$n - 1], "n = $n");
}
$found = false;
foreach (solveNQueens(5) as $b) if (implode('/', $b) === 'Q..../..Q../....Q/.Q.../...Q.') $found = true;
$check($found, 'n = 5 có bàn mẫu');
$six = solveNQueens(6);
$allValid = true;
$seen = [];
foreach ($six as $b) {
    $allValid = $allValid && validBoard($b, 6);
    $seen[implode('/', $b)] = true;
}
$check($allValid, 'n = 6 mọi bàn hợp lệ');
$check(count($seen) === count($six), 'n = 6 không trùng');
echo "$ok/$total ca đúng\n";

$crossOk = 0;
for ($n = 1; $n <= 7; $n++) if (boardsKey(solveBrute($n)) === boardsKey(solveNQueens($n))) $crossOk++;
echo "$crossOk/7 ca đúng (đối chiếu vét mọi hoán vị)\n";

$calls = 0; solveBrute(8); $brute = $calls;
$calls = 0; solveNQueens(8); $sets = $calls;
$calls = 0; countBits(8); $bits = $calls;
echo "n = 8: vét hoán vị $brute lượt gọi, ba tập $sets lượt gọi, bitmask $bits lượt gọi\n";
echo "Quên gỡ chéo phụ: n = 8 ra " . countForgetAnti(8) . " bàn, đúng là 92\n";
