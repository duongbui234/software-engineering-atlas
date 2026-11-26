<?php
declare(strict_types=1);

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function simulate(array $grid): array
{
    $fresh = 0;
    foreach ($grid as $row) {
        $fresh += count(array_keys($row, 1, true));
    }
    $minutes = 0;
    $scans = 0;

    while ($fresh > 0) {
        $next = [];
        foreach ($grid as $r => $row) {
            foreach ($row as $c => $value) {
                $scans++;
                if ($value !== 1) {
                    continue;
                }
                foreach (DIRECTIONS as [$dr, $dc]) {
                    if (($grid[$r + $dr][$c + $dc] ?? null) === 2) {
                        $next[] = [$r, $c];
                        break;
                    }
                }
            }
        }
        if (!$next) {
            return ['minutes' => -1, 'scans' => $scans];
        }
        foreach ($next as [$r, $c]) {
            $grid[$r][$c] = 2;
        }
        $fresh -= count($next);
        $minutes++;
    }
    return ['minutes' => $minutes, 'scans' => $scans];
}

function spread(array $grid): array
{
    $queue = [];
    $fresh = 0;
    foreach ($grid as $r => $row) {
        foreach ($row as $c => $value) {
            if ($value === 2) $queue[] = [$r, $c];
            if ($value === 1) $fresh++;
        }
    }

    $head = 0;
    $minutes = 0;
    while ($head < count($queue)) {
        $end = count($queue);
        while ($head < $end) {
            [$r, $c] = $queue[$head++];
            foreach (DIRECTIONS as [$dr, $dc]) {
                $nr = $r + $dr;
                $nc = $c + $dc;
                if (($grid[$nr][$nc] ?? null) !== 1) {
                    continue;
                }
                $grid[$nr][$nc] = 2;
                $fresh--;
                $queue[] = [$nr, $nc];
            }
        }
        if (count($queue) > $end) $minutes++;
    }
    return ['minutes' => $fresh === 0 ? $minutes : -1, 'pops' => $head];
}

$cases = [
    [[[2, 1, 1, 0, 2], [0, 1, 1, 1, 1]], 3],
    [[[2, 1, 0, 1], [0, 1, 0, 1]], -1],
    [[[0, 2, 0]], 0],
    [[[1]], -1],
    [[[0]], 0],
    [[[2, 1, 2]], 1],
    [[[2, 1, 1, 1, 1, 1, 1, 1, 1, 1]], 9],
];

foreach ($cases as [$grid, $expected]) {
    if (simulate($grid)['minutes'] !== $expected || spread($grid)['minutes'] !== $expected) {
        throw new RuntimeException('unexpected result for ' . json_encode($grid));
    }
}

[$corridor] = $cases[count($cases) - 1];
$scans = simulate($corridor)['scans'];
$pops = spread($corridor)['pops'];
if ($scans !== 90 || $pops !== 10) {
    throw new RuntimeException('unexpected operation counts');
}
$n = count($cases);
echo "{$n}/{$n} ca đúng\n";
echo "Quét: {$scans}; lấy khỏi hàng đợi: {$pops}\n";
