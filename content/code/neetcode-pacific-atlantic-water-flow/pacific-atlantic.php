<?php
// LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
// Chạy: php pacific-atlantic.php
declare(strict_types=1);

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi và xem nó chạm được bờ nào. O((mn)^2).
function bruteForce(array $heights): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $result = [];
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            $pacific = false;
            $atlantic = false;
            $seen = array_fill(0, $m * $n, false);
            $queue = [$r * $n + $c];
            $seen[$r * $n + $c] = true;
            for ($head = 0; $head < count($queue) && !($pacific && $atlantic); $head++) {
                $cr = intdiv($queue[$head], $n);
                $cc = $queue[$head] % $n;
                if ($cr === 0 || $cc === 0) $pacific = true;
                if ($cr === $m - 1 || $cc === $n - 1) $atlantic = true;
                foreach (DIRS as [$dr, $dc]) {
                    $nr = $cr + $dr;
                    $nc = $cc + $dc;
                    if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
                    if ($seen[$nr * $n + $nc] || $heights[$nr][$nc] > $heights[$cr][$cc]) continue;
                    $seen[$nr * $n + $nc] = true;
                    $queue[] = $nr * $n + $nc;
                }
            }
            if ($pacific && $atlantic) $result[] = [$r, $c];
        }
    }
    return $result;
}

// Cách 2: đi ngược từ bờ. BFS nhiều nguồn, leo lên ô cao hơn hoặc bằng. O(mn).
function climbBfs(array $heights, array $seeds): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $seen = array_fill(0, $m * $n, false);
    $queue = [];
    foreach ($seeds as $s) {
        if (!$seen[$s]) { $seen[$s] = true; $queue[] = $s; }
    }
    for ($head = 0; $head < count($queue); $head++) {
        $cr = intdiv($queue[$head], $n);
        $cc = $queue[$head] % $n;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $cr + $dr;
            $nc = $cc + $dc;
            if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
            if ($seen[$nr * $n + $nc] || $heights[$nr][$nc] < $heights[$cr][$cc]) continue;
            $seen[$nr * $n + $nc] = true;
            $queue[] = $nr * $n + $nc;
        }
    }
    return $seen;
}

function borders(int $m, int $n): array
{
    $pacific = [];
    $atlantic = [];
    for ($c = 0; $c < $n; $c++) { $pacific[] = $c; $atlantic[] = ($m - 1) * $n + $c; }
    for ($r = 0; $r < $m; $r++) { $pacific[] = $r * $n; $atlantic[] = $r * $n + $n - 1; }
    return [$pacific, $atlantic];
}

function intersect(array $a, array $b, int $n): array
{
    $result = [];
    foreach ($a as $i => $hit) {
        if ($hit && $b[$i]) $result[] = [intdiv($i, $n), $i % $n];
    }
    return $result;
}

function reverseBfs(array $heights): array
{
    $n = count($heights[0]);
    [$pacific, $atlantic] = borders(count($heights), $n);
    return intersect(climbBfs($heights, $pacific), climbBfs($heights, $atlantic), $n);
}

// Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
function climbStack(array $heights, array $seeds): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $seen = array_fill(0, $m * $n, false);
    $stack = [];
    foreach ($seeds as $s) {
        if (!$seen[$s]) { $seen[$s] = true; $stack[] = $s; }
    }
    while ($stack) {
        $cur = array_pop($stack);
        $cr = intdiv($cur, $n);
        $cc = $cur % $n;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $cr + $dr;
            $nc = $cc + $dc;
            if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
            if ($seen[$nr * $n + $nc] || $heights[$nr][$nc] < $heights[$cr][$cc]) continue;
            $seen[$nr * $n + $nc] = true;
            $stack[] = $nr * $n + $nc;
        }
    }
    return $seen;
}

function reverseDfsIterative(array $heights): array
{
    $n = count($heights[0]);
    [$pacific, $atlantic] = borders(count($heights), $n);
    return intersect(climbStack($heights, $pacific), climbStack($heights, $atlantic), $n);
}

// Cách 4: DFS đệ quy. Độ sâu lời gọi có thể bằng số ô.
function visit(array $heights, array &$seen, int $r, int $c): void
{
    $m = count($heights);
    $n = count($heights[0]);
    $seen[$r * $n + $c] = true;
    foreach (DIRS as [$dr, $dc]) {
        $nr = $r + $dr;
        $nc = $c + $dc;
        if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
        if ($seen[$nr * $n + $nc] || $heights[$nr][$nc] < $heights[$r][$c]) continue;
        visit($heights, $seen, $nr, $nc);
    }
}

function reverseDfsRecursive(array $heights): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $climb = function (array $seeds) use ($heights, $m, $n): array {
        $seen = array_fill(0, $m * $n, false);
        foreach ($seeds as $s) {
            if (!$seen[$s]) visit($heights, $seen, intdiv($s, $n), $s % $n);
        }
        return $seen;
    };
    [$pacific, $atlantic] = borders($m, $n);
    return intersect($climb($pacific), $climb($atlantic), $n);
}

// Khung BFS chung cho các bản sai: $step quyết định có bước từ ô hiện tại sang ô kế không.
function climbWith(array $heights, array $seeds, callable $step): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $seen = array_fill(0, $m * $n, false);
    $queue = [];
    foreach ($seeds as $s) {
        if (!$seen[$s]) { $seen[$s] = true; $queue[] = $s; }
    }
    for ($head = 0; $head < count($queue); $head++) {
        $cr = intdiv($queue[$head], $n);
        $cc = $queue[$head] % $n;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $cr + $dr;
            $nc = $cc + $dc;
            if ($nr < 0 || $nr >= $m || $nc < 0 || $nc >= $n) continue;
            if ($seen[$nr * $n + $nc] || !$step($heights[$cr][$cc], $heights[$nr][$nc])) continue;
            $seen[$nr * $n + $nc] = true;
            $queue[] = $nr * $n + $nc;
        }
    }
    return $seen;
}

// Sai 1: đi ngược nhưng vẫn so như lúc nước chảy xuôi (xuống ô thấp hơn).
function wrongDirection(array $heights): array
{
    $n = count($heights[0]);
    [$pacific, $atlantic] = borders(count($heights), $n);
    $down = fn(int $cur, int $next): bool => $next <= $cur;
    return intersect(climbWith($heights, $pacific, $down), climbWith($heights, $atlantic, $down), $n);
}

// Sai 2: so ngặt (chỉ leo lên ô cao hơn hẳn), quên rằng nước chảy qua ô bằng nhau.
function wrongStrict(array $heights): array
{
    $n = count($heights[0]);
    [$pacific, $atlantic] = borders(count($heights), $n);
    $up = fn(int $cur, int $next): bool => $next > $cur;
    return intersect(climbWith($heights, $pacific, $up), climbWith($heights, $atlantic, $up), $n);
}

// Sai 3: mỗi đại dương chỉ gieo một cạnh (Thái Bình Dương: hàng trên; Đại Tây Dương: hàng dưới).
function wrongOneEdge(array $heights): array
{
    $m = count($heights);
    $n = count($heights[0]);
    $pacific = [];
    $atlantic = [];
    for ($c = 0; $c < $n; $c++) { $pacific[] = $c; $atlantic[] = ($m - 1) * $n + $c; }
    return intersect(climbBfs($heights, $pacific), climbBfs($heights, $atlantic), $n);
}

// ---------- Kiểm chung ----------

function cellKey(array $cells): string
{
    $parts = array_map(fn(array $cell): string => "{$cell[0]},{$cell[1]}", $cells);
    sort($parts, SORT_STRING);
    return implode(' ', $parts);
}

function rowMajor(int $m, int $n): array
{
    $grid = [];
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) $grid[$r][$c] = $r * $n + $c;
    return $grid;
}
function flatGrid(int $m, int $n): array
{
    return array_fill(0, $m, array_fill(0, $n, 1));
}
function allCells(int $m, int $n): array
{
    $out = [];
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) $out[] = [$r, $c];
    return $out;
}
function rowMajorAnswer(int $m, int $n): array
{
    $out = [];
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) if ($r === $m - 1 || $c === $n - 1) $out[] = [$r, $c];
    return $out;
}

$cases = [
    ['một ô', [[7]], [[0, 0]]],
    ['một hàng', [[4, 1, 6]], [[0, 0], [0, 1], [0, 2]]],
    ['một cột', [[2], [9], [2]], [[0, 0], [1, 0], [2, 0]]],
    ['mặt phẳng 3×3', [[5, 5, 5], [5, 5, 5], [5, 5, 5]], allCells(3, 3)],
    ['cái chén', [[3, 3, 3], [3, 1, 3], [3, 3, 3]],
        [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]]],
    ['góc trũng', [[9, 9, 1], [9, 9, 9], [1, 9, 9]], allCells(3, 3)],
    ['sống núi giữa', [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
        [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]],
    ['bậc bằng nhau', [[1, 1, 1, 1], [1, 2, 2, 1], [1, 2, 2, 1], [1, 1, 1, 1]], allCells(4, 4)],
    ['lưới tăng 200×200', rowMajor(200, 200), rowMajorAnswer(200, 200)],
    ['mặt phẳng 200×200', flatGrid(200, 200), allCells(200, 200)],
];

$solvers = [
    'bruteForce' => 'bruteForce',
    'reverseBfs' => 'reverseBfs',
    'reverseDfsIterative' => 'reverseDfsIterative',
    'reverseDfsRecursive' => 'reverseDfsRecursive',
    'wrongDirection' => 'wrongDirection',
    'wrongStrict' => 'wrongStrict',
    'wrongOneEdge' => 'wrongOneEdge',
];

foreach ($solvers as $name => $solve) {
    $ok = 0;
    $total = 0;
    $bad = [];
    foreach ($cases as [$caseName, $heights, $want]) {
        if ($name === 'bruteForce' && count($heights) > 50) continue; // 40 000 ô: vét cạn quá chậm
        $total++;
        try {
            if (cellKey($solve($heights)) === cellKey($want)) $ok++;
            else $bad[] = $caseName;
        } catch (Throwable $e) {
            $bad[] = "$caseName → ném " . get_class($e);
        }
    }
    $tail = $bad ? '; sai ở ' . implode(', ', $bad) : '';
    $skipped = $total < count($cases) ? ' (bỏ hai ca 200×200)' : '';
    echo str_pad($name, 20) . " {$ok}/{$total} ca đúng{$skipped}{$tail}\n";
}

// Lưới ngẫu nhiên: mọi cách đúng phải khớp vét cạn.
$seed = 42;
$rand = function (int $k) use (&$seed): int {
    $seed = ($seed * 1103515245 + 12345) % 2147483648;
    return $seed % $k;
};
$agree = 0;
$trials = 2000;
for ($t = 0; $t < $trials; $t++) {
    $m = 1 + $rand(7);
    $n = 1 + $rand(7);
    $k = 1 + $rand(5);
    $h = [];
    for ($r = 0; $r < $m; $r++) for ($c = 0; $c < $n; $c++) $h[$r][$c] = $rand($k);
    $want = cellKey(bruteForce($h));
    if (cellKey(reverseBfs($h)) === $want && cellKey(reverseDfsIterative($h)) === $want && cellKey(reverseDfsRecursive($h)) === $want) $agree++;
}
echo "ngẫu nhiên: {$agree}/{$trials} lưới, ba cách đi ngược khớp vét cạn\n";

// Phép đo: vét cạn so với đi ngược.
function timeMs(callable $fn): float
{
    $t0 = hrtime(true);
    $fn();
    return (hrtime(true) - $t0) / 1e6;
}
foreach ([20, 40, 80] as $size) {
    $h = flatGrid($size, $size);
    $brute = timeMs(fn() => bruteForce($h));
    $rev = timeMs(fn() => reverseBfs($h));
    printf("mặt phẳng %d×%d: vét cạn %.1f ms, đi ngược %.2f ms\n", $size, $size, $brute, $rev);
}
$big = flatGrid(200, 200);
printf("mặt phẳng 200×200: đi ngược BFS %.1f ms\n", timeMs(fn() => reverseBfs($big)));
