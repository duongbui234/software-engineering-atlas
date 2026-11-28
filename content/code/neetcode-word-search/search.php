<?php
// Word Search (LeetCode 79): tìm một từ trên lưới chữ, mỗi bước sang ô kề cạnh, không dùng lại ô.
// Chạy: php -d xdebug.mode=off search.php

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
$calls = 0;

// Cách 1: DFS với một bảng visited riêng.
function existVisited(array $board, string $word): bool {
    $rows = count($board);
    $cols = count($board[0]);
    $visited = array_fill(0, $rows, array_fill(0, $cols, false));
    $dfs = function (int $r, int $c, int $k) use (&$dfs, &$visited, $board, $word, $rows, $cols): bool {
        global $calls;
        $calls++;
        if ($k === strlen($word)) return true;
        if ($r < 0 || $c < 0 || $r >= $rows || $c >= $cols) return false;
        if ($visited[$r][$c] || $board[$r][$c] !== $word[$k]) return false;
        $visited[$r][$c] = true;
        foreach (DIRS as [$dr, $dc]) {
            if ($dfs($r + $dr, $c + $dc, $k + 1)) {
                $visited[$r][$c] = false;
                return true;
            }
        }
        $visited[$r][$c] = false;
        return false;
    };
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($dfs($r, $c, 0)) return true;
        }
    }
    return false;
}

// Cách 2: đánh dấu ngay trên lưới bằng '#', trả lại chữ cũ khi quay lui.
// Mảng PHP được chép khi truyền vào hàm, nên nhận &$board để sửa đúng lưới của người gọi.
function existInPlace(array &$board, string $word): bool {
    $rows = count($board);
    $cols = count($board[0]);
    $dfs = function (int $r, int $c, int $k) use (&$dfs, &$board, $word, $rows, $cols): bool {
        global $calls;
        $calls++;
        if ($k === strlen($word)) return true;
        if ($r < 0 || $c < 0 || $r >= $rows || $c >= $cols) return false;
        if ($board[$r][$c] !== $word[$k]) return false;
        $saved = $board[$r][$c];
        $board[$r][$c] = '#';
        $found = false;
        foreach (DIRS as [$dr, $dc]) {
            if ($dfs($r + $dr, $c + $dc, $k + 1)) {
                $found = true;
                break;
            }
        }
        $board[$r][$c] = $saved;
        return $found;
    };
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($dfs($r, $c, 0)) return true;
        }
    }
    return false;
}

// Cách 3: cắt nhánh trước khi tìm. Đếm chữ, rồi đảo từ nếu chữ cuối hiếm hơn chữ đầu.
function existPruned(array &$board, string $word): bool {
    $have = array_count_values(array_merge(...$board));
    $need = count_chars($word, 1);
    foreach ($need as $byte => $n) {
        if (($have[chr($byte)] ?? 0) < $n) return false;
    }
    if (($have[$word[-1]] ?? 0) < ($have[$word[0]] ?? 0)) {
        $word = strrev($word);
    }
    return existInPlace($board, $word);
}

// Trọng tài: liệt kê mọi đường đi đơn dài |word| trên lưới, ghép chữ rồi so cả chuỗi.
function bruteForce(array $board, string $word): bool {
    $rows = count($board);
    $cols = count($board[0]);
    $used = array_fill(0, $rows, array_fill(0, $cols, false));
    $walk = function (int $r, int $c, string $text) use (&$walk, &$used, $board, $word, $rows, $cols): bool {
        $next = $text . $board[$r][$c];
        if (strlen($next) === strlen($word)) return $next === $word;
        $used[$r][$c] = true;
        $hit = false;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $r + $dr;
            $nc = $c + $dc;
            if ($nr >= 0 && $nc >= 0 && $nr < $rows && $nc < $cols && !$used[$nr][$nc] && $walk($nr, $nc, $next)) {
                $hit = true;
                break;
            }
        }
        $used[$r][$c] = false;
        return $hit;
    };
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($walk($r, $c, '')) return true;
        }
    }
    return false;
}

function board(string ...$rows): array {
    return array_map('str_split', $rows);
}

$grid = board('cat', 'ods', 'gen');
$cases = [
    [$grid, 'cat', true],
    [$grid, 'cod', true],
    [$grid, 'dog', true],
    [$grid, 'cats', true],
    [$grid, 'neds', true],
    [$grid, 'tact', false],
    [$grid, 'cab', false],
    [board('z'), 'z', true],
    [board('z'), 'zz', false],
    [board('ab', 'ba'), 'abab', true],
    [board('ab', 'ba'), 'abaa', false],
    [board('ab'), 'aba', false],
];

$ok = 0;
foreach ($cases as [$board, $word, $want]) {
    $b1 = $board; // gán mảng là chép
    $b2 = $board;
    $b3 = $board;
    $got = [existVisited($b1, $word), existInPlace($b2, $word), existPruned($b3, $word), bruteForce($board, $word)];
    $good = $b2 === $board && $b3 === $board;
    foreach ($got as $g) if ($g !== $want) $good = false;
    if ($good) $ok++;
    else echo "sai ở $word ", json_encode($got), "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi lưới 2×2 và 2×3 trên {a, b}, mọi từ trên {a, b} dài 1–4.
$words = [];
for ($len = 1; $len <= 4; $len++) {
    for ($mask = 0; $mask < 1 << $len; $mask++) {
        $w = '';
        for ($i = 0; $i < $len; $i++) $w .= (($mask >> $i) & 1) ? 'b' : 'a';
        $words[] = $w;
    }
}
$total = 0;
$agree = 0;
foreach ([2, 3] as $cols) {
    $cells = 2 * $cols;
    for ($mask = 0; $mask < 1 << $cells; $mask++) {
        $board = [[], []];
        for ($i = 0; $i < $cells; $i++) $board[intdiv($i, $cols)][] = (($mask >> $i) & 1) ? 'b' : 'a';
        foreach ($words as $w) {
            $total++;
            $want = bruteForce($board, $w);
            $b2 = $board;
            $b3 = $board;
            if (existVisited($board, $w) === $want && existInPlace($b2, $w) === $want
                && existPruned($b3, $w) === $want && $b2 === $board && $b3 === $board) $agree++;
        }
    }
}
echo "$agree/$total ca đúng (đối chiếu liệt kê mọi đường đi)\n";

// Phép đo: lưới 4×4 toàn chữ a, chữ b ở góc dưới phải bị hai chữ c chắn, từ aaaaaaab không có.
$trap = board('aaaa', 'aaaa', 'aaac', 'aacb');
$t1 = $trap;
$t2 = $trap;
$calls = 0;
existInPlace($t1, 'aaaaaaab');
$plain = $calls;
$calls = 0;
existPruned($t2, 'aaaaaaab');
echo "Lưới 4×4 toàn a, b ở góc bị c chắn, từ aaaaaaab: không cắt nhánh $plain lượt gọi, đảo từ $calls lượt gọi\n";
