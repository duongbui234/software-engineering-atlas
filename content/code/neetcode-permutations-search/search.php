<?php
// Ga MISC-02: quay lui khi thứ tự có ý nghĩa, với trạng thái phải gỡ ra.
// Chạy: php search.php

$permuteCalls = 0;
$queenCalls = 0;

// Permutations: không có start; đánh dấu phần tử đã nằm trong path.
function permute(array $nums): array {
    global $permuteCalls;
    $result = [];
    $path = [];
    $used = array_fill(0, count($nums), false);
    $walk = function () use (&$walk, &$result, &$path, &$used, $nums, &$permuteCalls) {
        $permuteCalls++;
        if (count($path) === count($nums)) {
            $result[] = $path; // mảng PHP được chép khi gán, nên đây là một bản chụp
            return;
        }
        foreach ($nums as $i => $value) {
            if ($used[$i]) continue; // đã nằm trong path
            $used[$i] = true; // đánh dấu
            $path[] = $value; // chọn
            $walk(); // đi sâu
            array_pop($path); // gỡ lựa chọn
            $used[$i] = false; // gỡ dấu
        }
    };
    $walk();
    return $result;
}

// Word Search: ghi đè ô đang đi qua, khôi phục khi quay lui.
function exist(array $board, string $word): bool {
    $rows = count($board);
    $cols = count($board[0]);
    $dfs = function (int $r, int $c, int $k) use (&$dfs, &$board, $word, $rows, $cols): bool {
        if ($r < 0 || $c < 0 || $r >= $rows || $c >= $cols || $board[$r][$c] !== $word[$k]) return false;
        if ($k === strlen($word) - 1) return true;
        $saved = $board[$r][$c];
        $board[$r][$c] = '#'; // đánh dấu đang đi qua
        $found = $dfs($r + 1, $c, $k + 1) || $dfs($r - 1, $c, $k + 1) || $dfs($r, $c + 1, $k + 1) || $dfs($r, $c - 1, $k + 1);
        $board[$r][$c] = $saved; // khôi phục
        return $found;
    };
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($dfs($r, $c, 0)) return true;
        }
    }
    return false;
}

// Palindrome Partitioning: chọn vị trí cắt tiếp theo, chỉ đi sâu nếu mảnh vừa cắt là palindrome.
function partition(string $s): array {
    $n = strlen($s);
    $result = [];
    $path = [];
    $isPalindrome = function (int $lo, int $hi) use ($s): bool {
        while ($lo < $hi) {
            if ($s[$lo++] !== $s[$hi--]) return false;
        }
        return true;
    };
    $walk = function (int $start) use (&$walk, &$result, &$path, $s, $n, $isPalindrome) {
        if ($start === $n) {
            $result[] = $path;
            return;
        }
        for ($end = $start; $end < $n; $end++) {
            if (!$isPalindrome($start, $end)) continue; // cắt nhánh sớm
            $path[] = substr($s, $start, $end - $start + 1);
            $walk($end + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// N-Queens: mỗi hàng một hậu; ba tập xung đột cho cột, chéo chính và chéo phụ.
function solveNQueens(int $n): array {
    global $queenCalls;
    $result = [];
    $colOf = [];
    $cols = [];
    $diag = []; // chéo chính: r - c
    $anti = []; // chéo phụ: r + c
    $place = function (int $r) use (&$place, &$result, &$colOf, &$cols, &$diag, &$anti, $n, &$queenCalls) {
        $queenCalls++;
        if ($r === $n) {
            $result[] = array_map(fn($c) => str_repeat('.', $c) . 'Q' . str_repeat('.', $n - $c - 1), $colOf);
            return;
        }
        for ($c = 0; $c < $n; $c++) {
            if (isset($cols[$c]) || isset($diag[$r - $c]) || isset($anti[$r + $c])) continue;
            $cols[$c] = $diag[$r - $c] = $anti[$r + $c] = true;
            $colOf[] = $c;
            $place($r + 1);
            array_pop($colOf);
            unset($cols[$c], $diag[$r - $c], $anti[$r + $c]);
        }
    };
    $place(0);
    return $result;
}

function canon(array $lists): string {
    $parts = array_map('json_encode', $lists);
    sort($parts);
    return implode('|', $parts);
}

function grid(array $rows): array {
    return array_map('str_split', $rows);
}

$board = ['TOP', 'ARE', 'NED'];
$cases = [
    ['permute [4,7,9]', fn() => canon(permute([4, 7, 9])), canon([[4, 7, 9], [4, 9, 7], [7, 4, 9], [7, 9, 4], [9, 4, 7], [9, 7, 4]])],
    ['permute [5]', fn() => canon(permute([5])), canon([[5]])],
    ['permute 6 số', fn() => count(array_unique(array_map('json_encode', permute([1, 2, 3, 4, 5, 6])))), 720],
    ['exist TOP', fn() => exist(grid($board), 'TOP'), true],
    ['exist TAN', fn() => exist(grid($board), 'TAN'), true],
    ['exist PERE', fn() => exist(grid($board), 'PERE'), true],
    ['exist ROPED', fn() => exist(grid($board), 'ROPED'), true],
    ['exist TOT (không dùng lại ô)', fn() => exist(grid($board), 'TOT'), false],
    ['exist ARENA', fn() => exist(grid($board), 'ARENA'), false],
    ['exist NEED', fn() => exist(grid($board), 'NEED'), false],
    ['partition noon', fn() => canon(partition('noon')), canon([['noon'], ['n', 'oo', 'n'], ['n', 'o', 'o', 'n']])],
    ['partition abc', fn() => canon(partition('abc')), canon([['a', 'b', 'c']])],
    ['partition aaa', fn() => canon(partition('aaa')), canon([['aaa'], ['a', 'aa'], ['aa', 'a'], ['a', 'a', 'a']])],
    ['partition 8 chữ a', fn() => count(partition('aaaaaaaa')), 128],
    ['partition racecar', fn() => count(partition('racecar')), 4],
    ['nQueens 4', fn() => canon(solveNQueens(4)), canon([['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']])],
    ['nQueens 1', fn() => canon(solveNQueens(1)), canon([['Q']])],
    ['nQueens 3', fn() => count(solveNQueens(3)), 0],
    ['nQueens 6', fn() => count(solveNQueens(6)), 4],
];

$ok = 0;
$fails = [];
foreach ($cases as [$name, $run, $want]) {
    if ($run() === $want) $ok++;
    else $fails[] = $name;
}
echo "$ok/" . count($cases) . " ca đúng\n";
if ($fails) echo "sai ở: " . implode('; ', $fails) . "\n";

$permuteCalls = 0;
$perms = count(permute([1, 2, 3, 4, 5, 6, 7, 8]));
$queenCalls = 0;
$boards = count(solveNQueens(8));
echo "Hoán vị 8 số: $permuteCalls lần gọi, $perms kết quả\n";
echo "8 hậu: $queenCalls lần gọi, $boards lời giải\n";
