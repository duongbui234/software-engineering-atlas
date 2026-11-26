<?php
declare(strict_types=1);

function ladderLength(string $begin, string $end, array $words): int {
    $unseen = array_fill_keys($words, true);
    if (!isset($unseen[$end])) return 0;
    unset($unseen[$begin]);
    $queue = new SplQueue();
    $queue->enqueue([$begin, 1]);
    while (!$queue->isEmpty()) {
        [$word, $distance] = $queue->dequeue();
        if ($word === $end) return $distance;
        for ($i = 0; $i < strlen($word); $i++) {
            $neighbor = $word;
            for ($ch = ord('a'); $ch <= ord('z'); $ch++) {
                $neighbor[$i] = chr($ch);
                if (isset($unseen[$neighbor])) {
                    unset($unseen[$neighbor]);
                    $queue->enqueue([$neighbor, $distance + 1]);
                }
            }
        }
    }
    return 0;
}

$cases = [
    ['hit','cog',['hot','dot','dog','lot','log','cog'],5],
    ['hit','cog',['hot','dot','dog','lot','log'],0],
    ['hit','cog',['cog','cat'],0],
    ['a','c',['a','b','c'],2],
    ['aaa','bbb',['aab','aba','abb','bbb','aaa'],4],
];
foreach ($cases as [$begin, $end, $words, $expected]) {
    if (!(ladderLength($begin, $end, $words) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
