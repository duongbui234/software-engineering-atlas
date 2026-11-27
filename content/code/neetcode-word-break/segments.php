<?php
declare(strict_types=1);

function searchWordBreak(string $s, array $words, int $i, ?array &$cache): bool {
    if ($i === strlen($s)) return true;
    if (isset($cache[$i])) return $cache[$i];

    $found = false;
    foreach ($words as $word) {
        if (substr_compare($s, $word, $i, strlen($word)) === 0
            && searchWordBreak($s, $words, $i + strlen($word), $cache)) {
            $found = true;
            break;
        }
    }
    if ($cache !== null) $cache[$i] = $found;
    return $found;
}

function wordBreakDp(string $s, array $words): bool {
    $n = strlen($s);
    $reachable = array_fill(0, $n + 1, false);
    $reachable[0] = true;
    for ($i = 0; $i < $n; $i++) {
        if (!$reachable[$i]) continue;
        foreach ($words as $word) {
            if (substr_compare($s, $word, $i, strlen($word)) === 0) {
                $reachable[$i + strlen($word)] = true;
            }
        }
    }
    return $reachable[$n];
}

$maxWord = 'abcdefghijklmnopqrst';
$cases = [
    ['cabin', ['cab', 'ca', 'bin'], true],
    ['cabin', ['cab', 'bin'], false],
    ['cabin', ['c', 'ca', 'bin'], true],
    ['mintminttea', ['mint', 'tea'], true],
    ['teas', ['teashop', 'tea', 's'], true],
    ['s', ['ss'], false],
    ['bot', ['bot'], true],
    ['ababab', ['ab', 'aba'], true],
    [str_repeat('a', 18) . 'b', ['a', 'aa'], false],
    [str_repeat($maxWord, 15), [$maxWord], true],
    [str_repeat('a', 299) . 'b', ['a', 'aa'], false],
];
foreach ($cases as [$s, $words, $expected]) {
    $cache = [];
    $noCache = null;
    if (wordBreakDp($s, $words) !== $expected ||
        searchWordBreak($s, $words, 0, $cache) !== $expected ||
        (strlen($s) <= 20 && searchWordBreak($s, $words, 0, $noCache) !== $expected)) {
        throw new RuntimeException('ca kiểm tra sai');
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
