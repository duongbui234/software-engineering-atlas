<?php
declare(strict_types=1);

function wordBreak(string $s, array $words): bool {
    $length = strlen($s);
    $reachable = array_fill(0, $length + 1, false);
    $reachable[0] = true;
    for ($start = 0; $start < $length; $start++) {
        if (!$reachable[$start]) continue;
        foreach ($words as $word) {
            $end = $start + strlen($word);
            if ($end <= $length && substr_compare($s, $word, $start, strlen($word)) === 0) {
                $reachable[$end] = true;
            }
        }
    }
    return $reachable[$length];
}

function lisLength(array $nums): int {
    $tails = [];
    foreach ($nums as $value) {
        $lo = 0;
        $hi = count($tails);
        while ($lo < $hi) {
            $mid = $lo + intdiv($hi - $lo, 2);
            if ($tails[$mid] < $value) $lo = $mid + 1;
            else $hi = $mid;
        }
        $tails[$lo] = $value;
    }
    return count($tails);
}

$prefixes = array_map(fn(int $i): string => str_repeat('a', $i), range(1, 20));
$checks = [
    wordBreak('atlasroute', ['at', 'atlas', 'route']),
    wordBreak('trailtrail', ['trail']),
    !wordBreak('mapz', ['ma', 'map', 'ap']),
    wordBreak('ababa', ['aba', 'ab']),
    !wordBreak(str_repeat('a', 299) . 'b', $prefixes),
    wordBreak(str_repeat('a', 300), [str_repeat('a', 20)]),
    wordBreak('survey', ['survey']),
    !wordBreak('map', ['mapping']),
    lisLength([-5, -3, -1, 0]) === 4,
    lisLength([10, 8, 6, 4]) === 1,
    lisLength([7, 7, 7]) === 1,
    lisLength([3, 5, 6, 2, 4]) === 3,
    lisLength([4, 4, 1, 2, 2, 3]) === 3,
    lisLength([6, 8, 2, 3, 5, 9]) === 4,
    lisLength(range(-1250, 1249)) === 2500,
    lisLength(array_fill(0, 2500, -10000)) === 1,
];
foreach ($checks as $index => $ok) {
    if (!$ok) throw new RuntimeException('Ca kiểm tra sai: ' . ($index + 1));
}
printf("%d/%d ca đúng\n", count($checks), count($checks));
