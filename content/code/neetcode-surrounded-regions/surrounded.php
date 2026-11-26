<?php
// LC 130 Surrounded Regions: mọi cách giải trên trang, kèm các bản sai hay gặp.
// Chạy: php surrounded.php
declare(strict_types=1);

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// Cách 0: vét cạn. Với từng ô O, chạy một BFS riêng để xem nó có tới được biên không. O((mn)²).
$bruteVisits = 0;
function bruteForcePerCell(array &$board): void
{
    global $bruteVisits;
    $m = count($board);
    $n = count($board[0]);
    $stamp = array_fill(0, $m * $n, 0);
    $round = 0;
    $toFlip = [];
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            if ($board[$r][$c] !== 'O') continue;
            $round++;
            $queue = [$r * $n + $c];
            $stamp[$r * $n + $c] = $round;
            $escaped = false;
            for ($head = 0; $head < count($queue) && !$escaped; $head++) {
                $bruteVisits++;
                $cr = intdiv($queue[$head], $n);
                $cc = $queue[$head] % $n;
                if ($cr === 0 || $cr === $m - 1 || $cc === 0 || $cc === $n - 1) $escaped = true;
                foreach (DIRS as [$dr, $dc]) {
                    $nr = $cr + $dr;
                    $nc = $cc + $dc;
                    if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
                    if ($board[$nr][$nc] !== 'O' || $stamp[$nr * $n + $nc] === $round) continue;
                    $stamp[$nr * $n + $nc] = $round;
                    $queue[] = $nr * $n + $nc;
                }
            }
            if (!$escaped) $toFlip[] = $r * $n + $c; // chưa đổi ngay, để các ô sau còn đọc đúng
        }
    }
    foreach ($toFlip as $id) $board[intdiv($id, $n)][$id % $n] = 'X';
}

// Cách 1: tô từng vùng. Gom cả vùng bằng BFS, nhớ xem vùng có chạm biên không, duyệt xong mới đổi. O(mn).
function regionFill(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    $seen = array_fill(0, $m * $n, false);
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            if ($board[$r][$c] !== 'O' || $seen[$r * $n + $c]) continue;
            $region = [$r * $n + $c];
            $seen[$r * $n + $c] = true;
            $touchesBorder = false;
            for ($head = 0; $head < count($region); $head++) {
                $cr = intdiv($region[$head], $n);
                $cc = $region[$head] % $n;
                if ($cr === 0 || $cr === $m - 1 || $cc === 0 || $cc === $n - 1) $touchesBorder = true;
                foreach (DIRS as [$dr, $dc]) {
                    $nr = $cr + $dr;
                    $nc = $cc + $dc;
                    if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
                    if ($board[$nr][$nc] !== 'O' || $seen[$nr * $n + $nc]) continue;
                    $seen[$nr * $n + $nc] = true;
                    $region[] = $nr * $n + $nc;
                }
            }
            if (!$touchesBorder) foreach ($region as $id) $board[intdiv($id, $n)][$id % $n] = 'X';
        }
    }
}

// Cách 2 (nên dùng): đi ngược từ biên. Ô O trên biên vào hàng đợi, đánh dấu an toàn 'S',
// BFS lan 'S' vào trong. Cuối cùng: O còn lại thành X, S trả lại thành O.
function borderBfs(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    $queue = [];
    $seed = function (int $r, int $c) use (&$board, &$queue, $n): void {
        if ($board[$r][$c] === 'O') { $board[$r][$c] = 'S'; $queue[] = $r * $n + $c; }
    };
    for ($r = 0; $r < $m; $r++) { $seed($r, 0); $seed($r, $n - 1); }
    for ($c = 0; $c < $n; $c++) { $seed(0, $c); $seed($m - 1, $c); }
    for ($head = 0; $head < count($queue); $head++) {
        $cr = intdiv($queue[$head], $n);
        $cc = $queue[$head] % $n;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $cr + $dr;
            $nc = $cc + $dc;
            if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n || $board[$nr][$nc] !== 'O') continue;
            $board[$nr][$nc] = 'S';
            $queue[] = $nr * $n + $nc;
        }
    }
    finish($board);
}

function finish(array &$board): void
{
    foreach ($board as &$row) {
        foreach ($row as &$cell) $cell = $cell === 'O' ? 'X' : ($cell === 'S' ? 'O' : $cell);
        unset($cell);
    }
    unset($row);
}

// Cách 3: đi ngược từ biên, lan bằng DFS đệ quy. Độ sâu lời gọi có thể bằng số ô của vùng.
function markSafe(array &$board, int $r, int $c): void
{
    if ($r < 0 || $r >= count($board) || $c < 0 || $c >= count($board[0]) || $board[$r][$c] !== 'O') return;
    $board[$r][$c] = 'S';
    markSafe($board, $r - 1, $c);
    markSafe($board, $r + 1, $c);
    markSafe($board, $r, $c - 1);
    markSafe($board, $r, $c + 1);
}

function borderDfsRecursive(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    for ($r = 0; $r < $m; $r++) { markSafe($board, $r, 0); markSafe($board, $r, $n - 1); }
    for ($c = 0; $c < $n; $c++) { markSafe($board, 0, $c); markSafe($board, $m - 1, $c); }
    finish($board);
}

// Cách 4: DFS với ngăn xếp tự quản lý, không phụ thuộc giới hạn đệ quy.
function borderDfsIterative(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    $stack = [];
    $seed = function (int $r, int $c) use (&$board, &$stack, $n): void {
        if ($board[$r][$c] === 'O') { $board[$r][$c] = 'S'; $stack[] = $r * $n + $c; }
    };
    for ($r = 0; $r < $m; $r++) { $seed($r, 0); $seed($r, $n - 1); }
    for ($c = 0; $c < $n; $c++) { $seed(0, $c); $seed($m - 1, $c); }
    while ($stack) {
        $id = array_pop($stack);
        $cr = intdiv($id, $n);
        $cc = $id % $n;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $cr + $dr;
            $nc = $cc + $dc;
            if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n || $board[$nr][$nc] !== 'O') continue;
            $board[$nr][$nc] = 'S';
            $stack[] = $nr * $n + $nc;
        }
    }
    finish($board);
}

// Cách 5: Union-Find với một nút ảo "biên".
function unionFind(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    $border = $m * $n;
    $parent = range(0, $m * $n);
    $size = array_fill(0, $m * $n + 1, 1);
    $find = function (int $x) use (&$parent): int {
        $root = $x;
        while ($parent[$root] !== $root) $root = $parent[$root];
        while ($parent[$x] !== $root) { $next = $parent[$x]; $parent[$x] = $root; $x = $next; }
        return $root;
    };
    $union = function (int $a, int $b) use (&$parent, &$size, $find): void {
        $ra = $find($a);
        $rb = $find($b);
        if ($ra === $rb) return;
        if ($size[$ra] < $size[$rb]) [$ra, $rb] = [$rb, $ra];
        $parent[$rb] = $ra;
        $size[$ra] += $size[$rb];
    };
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            if ($board[$r][$c] !== 'O') continue;
            $id = $r * $n + $c;
            if ($r === 0 || $r === $m - 1 || $c === 0 || $c === $n - 1) $union($id, $border);
            if ($r + 1 < $m && $board[$r + 1][$c] === 'O') $union($id, $id + $n);
            if ($c + 1 < $n && $board[$r][$c + 1] === 'O') $union($id, $id + 1);
        }
    }
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            if ($board[$r][$c] === 'O' && $find($r * $n + $c) !== $find($border)) $board[$r][$c] = 'X';
        }
    }
}

// SAI 1: đổi mọi ô O không nằm trên biên.
function wrongNotOnBorder(array &$board): void
{
    $m = count($board);
    $n = count($board[0]);
    for ($r = 1; $r < $m - 1; $r++) for ($c = 1; $c < $n - 1; $c++) if ($board[$r][$c] === 'O') $board[$r][$c] = 'X';
}

// SAI 2: đổi ô thành X ngay lúc tìm; && còn dừng sớm nên phần còn lại của vùng không được thăm.
function surroundedSearch(array &$board, int $r, int $c): bool
{
    if ($r < 0 || $r >= count($board) || $c < 0 || $c >= count($board[0])) return false; // ra ngoài: vùng chạm biên
    if ($board[$r][$c] !== 'O') return true;
    $board[$r][$c] = 'X'; // đổi luôn, coi như "đã thăm"
    return surroundedSearch($board, $r - 1, $c) && surroundedSearch($board, $r + 1, $c)
        && surroundedSearch($board, $r, $c - 1) && surroundedSearch($board, $r, $c + 1);
}

function wrongFlipDuringSearch(array &$board): void
{
    for ($r = 0; $r < count($board); $r++) {
        for ($c = 0; $c < count($board[0]); $c++) if ($board[$r][$c] === 'O') surroundedSearch($board, $r, $c);
    }
}

// SAI 3 (bản PHP): quên dấu & ở tham số. Hàm nhận một bản sao của mảng, làm đúng trên bản sao,
// người gọi vẫn giữ bảng cũ.
function wrongNewBoard(array $board): void
{
    borderBfs($board);
}

// ---------- ca thử ----------
function parse(array $rows): array
{
    return array_map('str_split', $rows);
}
function show(array $b): string
{
    return implode('/', array_map('implode', $b));
}
function square(int $n, callable $fill): array
{
    $b = [];
    for ($r = 0; $r < $n; $r++) for ($c = 0; $c < $n; $c++) $b[$r][$c] = $fill($r, $c);
    return $b;
}

$ring = fn(int $r, int $c): string => ($r === 0 || $c === 0 || $r === 199 || $c === 199) ? 'X' : 'O';
$cases = [
    ['ví dụ 5×5 ở trên', parse(['XXXXX', 'XOOXX', 'XXOXX', 'XOXOO', 'XOXXX']),
        parse(['XXXXX', 'XXXXX', 'XXXXX', 'XOXOO', 'XOXXX'])],
    ['một ô O', parse(['O']), parse(['O'])],
    ['một ô X', parse(['X']), parse(['X'])],
    ['3×3 toàn O', parse(['OOO', 'OOO', 'OOO']), parse(['OOO', 'OOO', 'OOO'])],
    ['vòng X bao một ô O', parse(['XXX', 'XOX', 'XXX']), parse(['XXX', 'XXX', 'XXX'])],
    ['một hàng OXO', parse(['OXO']), parse(['OXO'])],
    ['chạm chéo không tính là nối', parse(['OXXX', 'XOXX', 'XXOX', 'XXXX']), parse(['OXXX', 'XXXX', 'XXXX', 'XXXX'])],
    ['đường vòng vèo ra biên', parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX']),
        parse(['XXXXXX', 'XOOOOX', 'XXXXOX', 'XOOOOX', 'XOXXXX', 'XOXXXX'])],
    ['200×200 toàn O', square(200, fn() => 'O'), square(200, fn() => 'O')],
    ['200×200 viền X, trong toàn O', square(200, $ring), square(200, fn() => 'X')],
];

$solvers = ['bruteForcePerCell', 'regionFill', 'borderBfs', 'borderDfsRecursive', 'borderDfsIterative', 'unionFind',
    'wrongNotOnBorder', 'wrongFlipDuringSearch', 'wrongNewBoard'];

foreach ($solvers as $name) {
    $ok = 0;
    $bad = [];
    // vét cạn chỉ chạy các ca nhỏ: ở 200×200 nó cần khoảng 1,5·10⁹ lượt thăm
    $mine = $name === 'bruteForcePerCell' ? array_filter($cases, fn($tc) => count($tc[1]) <= 10) : $cases;
    foreach ($mine as [$caseName, $start, $want]) {
        $board = $start; // mảng PHP được chép khi ghi: mỗi ca có bảng riêng
        try {
            $name($board);
            if (show($board) === show($want)) $ok++;
            else $bad[] = $caseName;
        } catch (Throwable $e) {
            $bad[] = "$caseName → ném " . get_class($e);
        }
    }
    $note = count($mine) < count($cases) ? ' (chỉ các ca nhỏ)' : '';
    echo str_pad($name, 22) . ' ' . $ok . '/' . count($mine) . " ca đúng{$note}" . ($bad ? '; sai ở ' . implode(', ', $bad) : '') . "\n";
}

// Đối chiếu ngẫu nhiên: các cách đúng phải ra cùng bảng với vét cạn.
$state = 42;
$rand = function () use (&$state): float {
    $state = ($state * 1103515245 + 12345) % 2147483648;
    return $state / 2147483648;
};
$trials = 2000;
$agree = 0;
for ($t = 0; $t < $trials; $t++) {
    $m = 1 + (int) floor($rand() * 8);
    $n = 1 + (int) floor($rand() * 8);
    $board = [];
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) $board[$r][$c] = $rand() < 0.6 ? 'O' : 'X';
    $ref = $board;
    bruteForcePerCell($ref);
    $all = true;
    foreach (['regionFill', 'borderBfs', 'borderDfsRecursive', 'borderDfsIterative', 'unionFind'] as $solve) {
        $b = $board;
        $solve($b);
        if (show($b) !== show($ref)) $all = false;
    }
    if ($all) $agree++;
}
echo "đối chiếu ngẫu nhiên: {$agree}/{$trials} bảng, năm cách đúng khớp vét cạn\n";

// Đo: vét cạn O((mn)²) so với tô từng vùng O(mn) trên bảng viền X, trong toàn O.
// Bỏ cỡ 90×90: PHP cần khoảng 20 giây cho 60 triệu lượt thăm của vét cạn.
foreach ([30, 60] as $size) {
    $make = fn() => square($size, fn(int $r, int $c): string =>
        ($r === 0 || $c === 0 || $r === $size - 1 || $c === $size - 1) ? 'X' : 'O');
    $b = $make();
    $bruteVisits = 0;
    $t0 = hrtime(true);
    bruteForcePerCell($b);
    $brute = (hrtime(true) - $t0) / 1e6;
    $b = $make();
    $t0 = hrtime(true);
    regionFill($b);
    $fast = (hrtime(true) - $t0) / 1e6;
    printf("%d×%d: vét cạn %d lượt thăm, %.1f ms; tô từng vùng %.2f ms\n", $size, $size, $bruteVisits, $brute, $fast);
}
