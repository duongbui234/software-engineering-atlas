<?php
// Ga DP-06: DP có trạng thái. Chạy: php -d xdebug.mode=off states.php

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function maxProfitCooldown(array $prices): int {
    $hold = PHP_INT_MIN >> 1; // đang giữ một cổ phiếu
    $sold = PHP_INT_MIN >> 1; // vừa bán hôm nay, mai phải nghỉ
    $rest = 0;                // tay không, được mua
    foreach ($prices as $price) {
        $prevSold = $sold;
        $sold = $hold + $price;
        $hold = max($hold, $rest - $price);
        $rest = max($rest, $prevSold);
    }
    return max($rest, $sold);
}

function longestIncreasingPath(array $grid): int {
    $m = count($grid);
    $n = count($grid[0]);
    $memo = array_fill(0, $m, array_fill(0, $n, 0));
    $dfs = function (int $r, int $c) use (&$dfs, &$memo, $grid, $m, $n): int {
        if ($memo[$r][$c] > 0) return $memo[$r][$c];
        $best = 1;
        foreach (DIRS as [$dr, $dc]) {
            $nr = $r + $dr;
            $nc = $c + $dc;
            if ($nr >= 0 && $nr < $m && $nc >= 0 && $nc < $n && $grid[$nr][$nc] > $grid[$r][$c]) {
                $best = max($best, 1 + $dfs($nr, $nc));
            }
        }
        return $memo[$r][$c] = $best;
    };
    $answer = 0;
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) $answer = max($answer, $dfs($r, $c));
    }
    return $answer;
}

function longestIncreasingPathLayers(array $grid): int {
    $m = count($grid);
    $n = count($grid[0]);
    $out = array_fill(0, $m, array_fill(0, $n, 0));
    $layer = [];
    for ($r = 0; $r < $m; $r++) {
        for ($c = 0; $c < $n; $c++) {
            foreach (DIRS as [$dr, $dc]) {
                $nr = $r + $dr;
                $nc = $c + $dc;
                if ($nr >= 0 && $nr < $m && $nc >= 0 && $nc < $n && $grid[$nr][$nc] > $grid[$r][$c]) $out[$r][$c]++;
            }
            if ($out[$r][$c] === 0) $layer[] = [$r, $c];
        }
    }
    $layers = 0;
    while ($layer) {
        $layers++;
        $next = [];
        foreach ($layer as [$r, $c]) {
            foreach (DIRS as [$dr, $dc]) {
                $nr = $r + $dr;
                $nc = $c + $dc;
                if ($nr >= 0 && $nr < $m && $nc >= 0 && $nc < $n && $grid[$nr][$nc] < $grid[$r][$c]) {
                    if (--$out[$nr][$nc] === 0) $next[] = [$nr, $nc];
                }
            }
        }
        $layer = $next;
    }
    return $layers;
}

$stockCases = [
    [[5], 0], [[5, 4, 3], 0], [[1, 2], 1], [[1, 3, 2, 8], 7], [[2, 4, 1, 7], 6],
    [[1, 4, 2, 7], 6], [[3, 1, 4, 8, 2, 6], 7], [[6, 1, 6, 4, 3, 0, 2], 7], [[1, 2, 4, 2, 5, 7, 2, 4, 9, 0], 11],
];
$gridCases = [
    [[[7]], 1], [[[1, 2], [4, 3]], 4], [[[3, 3], [3, 3]], 1],
    [[[5, 4, 3], [6, 1, 2], [7, 8, 9]], 9], [[[1, 2, 3, 4, 5]], 5], [[[3], [2], [1]], 3],
];
$ok = 0;
$total = 0;
foreach ($stockCases as [$prices, $want]) {
    $total++;
    if (maxProfitCooldown($prices) === $want) $ok++;
    else echo "sai ở " . json_encode($prices) . "\n";
}
foreach ($gridCases as [$grid, $want]) {
    $total++;
    if (longestIncreasingPath($grid) === $want && longestIncreasingPathLayers($grid) === $want) $ok++;
    else echo "sai ở " . json_encode($grid) . "\n";
}
echo "$ok/$total ca đúng\n";
