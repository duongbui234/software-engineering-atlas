<?php
// LeetCode 329: đường tăng dài nhất trong ma trận, ba cách giải
// Chạy: php -d xdebug.mode=off climb.php (Xdebug chặn đệ quy ở 512 tầng)

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
$calls = 0;

// Vét cạn: DFS từ mọi ô, không nhớ gì
function bruteClimb(array $grid, int $r, int $c): int {
    global $calls;
    $calls++;
    $best = 1;
    foreach (DIRS as [$dr, $dc]) {
        $nr = $r + $dr; $nc = $c + $dc;
        if (isset($grid[$nr][$nc]) && $grid[$nr][$nc] > $grid[$r][$c]) {
            $best = max($best, 1 + bruteClimb($grid, $nr, $nc));
        }
    }
    return $best;
}

function longestPathBrute(array $grid): int {
    $answer = 0;
    foreach ($grid as $r => $row) {
        foreach ($row as $c => $_) $answer = max($answer, bruteClimb($grid, $r, $c));
    }
    return $answer;
}

// DFS ghi nhớ: $memo[ô] = độ dài đường tăng dài nhất bắt đầu ở ô đó.
// Không cần tập "đang thăm": cạnh chỉ đi lên giá trị lớn hơn nên không có vòng.
function memoClimb(array $grid, array &$memo, int $r, int $c): int {
    global $calls;
    $calls++;
    $key = $r * count($grid[0]) + $c;
    if ($memo[$key] !== 0) return $memo[$key];
    $best = 1;
    foreach (DIRS as [$dr, $dc]) {
        $nr = $r + $dr; $nc = $c + $dc;
        if (isset($grid[$nr][$nc]) && $grid[$nr][$nc] > $grid[$r][$c]) {
            $best = max($best, 1 + memoClimb($grid, $memo, $nr, $nc));
        }
    }
    return $memo[$key] = $best;
}

function longestPathMemo(array $grid): int {
    $memo = array_fill(0, count($grid) * count($grid[0]), 0); // 0 = chưa tính, đáp án luôn ≥ 1
    $answer = 0;
    foreach ($grid as $r => $row) {
        foreach ($row as $c => $_) $answer = max($answer, memoClimb($grid, $memo, $r, $c));
    }
    return $answer;
}

// Bóc lớp theo thứ tự topo (Kahn): lớp đầu là các "đỉnh" không còn ô lớn hơn kề bên.
// Số lớp bóc được chính là độ dài đường dài nhất. Không đệ quy.
function longestIncreasingPath(array $grid): int {
    $rows = count($grid); $cols = count($grid[0]);
    $outDegree = array_fill(0, $rows * $cols, 0); // số ô kề lớn hơn
    $layer = [];
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            foreach (DIRS as [$dr, $dc]) {
                $nr = $r + $dr; $nc = $c + $dc;
                if (isset($grid[$nr][$nc]) && $grid[$nr][$nc] > $grid[$r][$c]) $outDegree[$r * $cols + $c]++;
            }
            if ($outDegree[$r * $cols + $c] === 0) $layer[] = $r * $cols + $c;
        }
    }
    $layers = 0;
    while ($layer) {
        $layers++;
        $next = [];
        foreach ($layer as $cell) {
            $r = intdiv($cell, $cols); $c = $cell % $cols;
            foreach (DIRS as [$dr, $dc]) {
                $nr = $r + $dr; $nc = $c + $dc;
                // ô nhỏ hơn kề bên mất một lối lên; hết lối thì vào lớp sau
                if (isset($grid[$nr][$nc]) && $grid[$nr][$nc] < $grid[$r][$c]) {
                    if (--$outDegree[$nr * $cols + $nc] === 0) $next[] = $nr * $cols + $nc;
                }
            }
        }
        $layer = $next;
    }
    return $layers;
}

// ---------- kiểm tra ----------
function snake(int $n): array {
    $grid = [];
    for ($r = 0; $r < $n; $r++)
        for ($c = 0; $c < $n; $c++) $grid[$r][$c] = $r * $n + ($r % 2 === 0 ? $c : $n - 1 - $c);
    return $grid;
}

// Hàng chẵn là lối đi zigzag, hàng lẻ là tường giá trị 0 chừa một ô nối.
// Từ ô (0, 0) chỉ có đúng một ô kề lớn hơn, nên DFS đi một mạch hết đường.
function corridor(int $n): array {
    $grid = array_fill(0, $n, array_fill(0, $n, 0));
    $value = 0;
    for ($k = 0; 2 * $k < $n; $k++) {
        $r = 2 * $k;
        for ($i = 0; $i < $n; $i++) $grid[$r][$k % 2 === 0 ? $i : $n - 1 - $i] = ++$value;
        if ($r + 2 < $n) $grid[$r + 1][$k % 2 === 0 ? $n - 1 : 0] = ++$value;
    }
    return $grid;
}

$small = [
    [[[1]], 1],
    [[[7, 7], [7, 7]], 1],
    [[[1, 2, 3], [6, 5, 4], [7, 8, 9]], 9],
    [[[5, 4], [2, 3]], 4],
    [[[1, 3, 2, 4, 5]], 3],
    [[[3], [2], [1]], 3],
    [[[0, 2147483647]], 2],
    [[[7, 8, 1], [6, 2, 3], [5, 4, 9]], 6],
];
$big = [
    [array_fill(0, 200, array_fill(0, 200, 5)), 1],
    [snake(200), 40000],
    [corridor(200), 20100],
];
$ok = 0;
foreach ($small as [$grid, $want]) {
    if (longestPathBrute($grid) === $want && longestPathMemo($grid) === $want && longestIncreasingPath($grid) === $want) $ok++;
    else echo 'sai: ', json_encode($grid), "\n";
}
foreach ($big as [$grid, $want]) {
    if (longestIncreasingPath($grid) === $want) $ok++;
    else echo "sai ở lưới lớn, mong $want\n";
}
echo "$ok/" . (count($small) + count($big)) . " ca đúng\n";

// Đối chiếu: mọi lưới r×c (r·c ≤ 6) giá trị 0..2, và mọi lưới 2×3, 3×2 là hoán vị của 1..6
$total = 0; $agree = 0;
$check = function (array $grid) use (&$total, &$agree) {
    $total++;
    $want = longestPathBrute($grid);
    if (longestPathMemo($grid) === $want && longestIncreasingPath($grid) === $want) $agree++;
};
for ($rows = 1; $rows <= 6; $rows++) {
    for ($cols = 1; $rows * $cols <= 6; $cols++) {
        $size = $rows * $cols;
        for ($code = 0; $code < 3 ** $size; $code++) {
            $flat = [];
            for ($k = 0, $x = $code; $k < $size; $k++, $x = intdiv($x, 3)) $flat[] = $x % 3;
            $check(array_chunk($flat, $cols));
        }
    }
}
function permute(array $items, array $prefix, array &$out): void {
    if (!$items) { $out[] = $prefix; return; }
    foreach ($items as $i => $v) {
        $rest = $items;
        unset($rest[$i]);
        permute($rest, [...$prefix, $v], $out);
    }
}
$perms = [];
permute([1, 2, 3, 4, 5, 6], [], $perms);
foreach ($perms as $p) {
    $check(array_chunk($p, 3));
    $check(array_chunk($p, 2));
}
echo "$agree/$total ca đúng (đối chiếu vét cạn)\n";

// Đếm lượt gọi trên lưới 10×10 có giá trị i + j: rất nhiều đường tăng chồng lên nhau
$diagonal = [];
for ($r = 0; $r < 10; $r++) for ($c = 0; $c < 10; $c++) $diagonal[$r][$c] = $r + $c;
$calls = 0;
longestPathBrute($diagonal);
$bruteCalls = $calls;
$calls = 0;
longestPathMemo($diagonal);
echo "Lưới 10×10 giá trị i+j: vét cạn $bruteCalls lượt gọi, memo $calls lượt gọi\n";

// Lưới hành lang 200×200: DFS từ ô (0, 0) phải đệ quy sâu 20099 tầng.
// PHP 8.2 không giới hạn số tầng (khi tắt Xdebug), mỗi tầng nằm trên vùng nhớ của PHP.
$deep = corridor(200);
echo 'Lưới hành lang 200×200: bóc lớp ', longestIncreasingPath($deep), ', memo đệ quy ', longestPathMemo($deep), "\n";
