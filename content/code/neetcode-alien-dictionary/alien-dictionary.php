<?php
declare(strict_types=1);

function alienOrder(array $words): string {
    $edges = $indegree = [];
    foreach ($words as $word) {
        foreach (str_split($word) as $letter) {
            $indegree[$letter] = 0;
        }
    }
    for ($i = 1; $i < count($words); $i++) {
        [$a, $b] = [$words[$i - 1], $words[$i]];
        $limit = min(strlen($a), strlen($b));
        $j = 0;
        while ($j < $limit && $a[$j] === $b[$j]) {
            $j++;
        }
        if ($j === $limit) {
            if (strlen($a) > strlen($b)) return '';
        } elseif (!isset($edges[$a[$j]][$b[$j]])) {
            $edges[$a[$j]][$b[$j]] = true;
            $indegree[$b[$j]]++;
        }
    }
    $queue = array_keys(array_filter($indegree, fn(int $n): bool => $n === 0));
    for ($head = 0; $head < count($queue); $head++) {
        foreach ($edges[$queue[$head]] ?? [] as $next => $_) {
            if (--$indegree[$next] === 0) $queue[] = $next;
        }
    }
    return count($queue) === count($indegree) ? implode($queue) : '';
}

$cases = [
    [['wrt','wrf','er','ett','rftt'], 'wertf'],
    [['z','x','z'], ''],
    [['abc','ab'], ''],
    [['ab','ab','ac'], 'abc'],
    [['z'], 'z'],
];
foreach ($cases as [$words, $expected]) {
    if (!(alienOrder($words) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
