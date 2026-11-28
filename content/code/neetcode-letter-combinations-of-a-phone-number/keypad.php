<?php
// Letter Combinations of a Phone Number (LeetCode 17): ba cách cho cùng một bài.
// Chạy: php -d xdebug.mode=off keypad.php

const KEYS = [
    '2' => 'abc', '3' => 'def', '4' => 'ghi', '5' => 'jkl',
    '6' => 'mno', '7' => 'pqrs', '8' => 'tuv', '9' => 'wxyz',
];

$calls = 0;

// Cách 1: quay lui với một mảng ký tự làm bộ đệm, thêm rồi gỡ ở mỗi tầng.
function combineBacktrack(string $digits): array {
    $result = [];
    if ($digits === '') return $result; // chuỗi rỗng cho [], không phải [""]
    $buffer = [];
    walk($digits, 0, $buffer, $result);
    return $result;
}

function walk(string $digits, int $index, array &$buffer, array &$result): void {
    global $calls;
    $calls++;
    if ($index === strlen($digits)) {
        $result[] = implode('', $buffer);
        return;
    }
    foreach (str_split(KEYS[$digits[$index]]) as $letter) {
        $buffer[] = $letter;
        walk($digits, $index + 1, $buffer, $result);
        array_pop($buffer);
    }
}

// Cách 2: dựng dần theo từng chữ số, nối mỗi tiền tố với mọi chữ cái của phím kế tiếp.
function combineIterative(string $digits): array {
    if ($digits === '') return [];
    $layer = [''];
    foreach (str_split($digits) as $digit) {
        $next = [];
        foreach ($layer as $prefix) {
            foreach (str_split(KEYS[$digit]) as $letter) $next[] = $prefix . $letter;
        }
        $layer = $next;
    }
    return $layer;
}

// Cách 3: bộ đếm hỗn cơ số, mỗi vị trí đếm từ 0 tới số chữ cái của phím đó.
function combineCounter(string $digits): array {
    $n = strlen($digits);
    if ($n === 0) return [];
    $odometer = array_fill(0, $n, 0);
    $result = [];
    while (true) {
        $word = '';
        for ($i = 0; $i < $n; $i++) $word .= KEYS[$digits[$i]][$odometer[$i]];
        $result[] = $word;
        $pos = $n - 1;
        while ($pos >= 0 && $odometer[$pos] === strlen(KEYS[$digits[$pos]]) - 1) {
            $odometer[$pos] = 0;
            $pos--;
        }
        if ($pos < 0) return $result;
        $odometer[$pos]++;
    }
}

const CASES = [
    ['23', 9, 'ad', 'cf', 'ad,ae,af,bd,be,bf,cd,ce,cf'],
    ['', 0, '', '', ''],
    ['2', 3, 'a', 'c', 'a,b,c'],
    ['7', 4, 'p', 's', 'p,q,r,s'],
    ['9', 4, 'w', 'z', 'w,x,y,z'],
    ['22', 9, 'aa', 'cc', 'aa,ab,ac,ba,bb,bc,ca,cb,cc'],
    ['79', 16, 'pw', 'sz', null],
    ['56', 9, 'jm', 'lo', null],
    ['234', 27, 'adg', 'cfi', null],
    ['2345', 81, 'adgj', 'cfil', null],
    ['7999', 256, 'pwww', 'szzz', null],
];

function fits(array $got, array $case): bool {
    [, $count, $first, $last, $full] = $case;
    if (count($got) !== $count) return false;
    if ($count > 0 && ($got[0] !== $first || $got[$count - 1] !== $last)) return false;
    if ($full !== null && implode(',', $got) !== $full) return false;
    return count(array_unique($got)) === count($got);
}

$ok = 0;
foreach (CASES as $case) {
    $d = $case[0];
    if (fits(combineBacktrack($d), $case) && fits(combineIterative($d), $case) && fits(combineCounter($d), $case)) $ok++;
    else echo "sai ở \"$d\"\n";
}
echo "$ok/" . count(CASES) . " ca đúng\n";

// Đối chiếu: mọi chuỗi chữ số 2–9 dài 0–4, so với cách dựng lặp.
$total = 0;
$same = 0;
function each(string $prefix): void {
    global $total, $same;
    $total++;
    $want = combineIterative($prefix);
    if (combineBacktrack($prefix) === $want && combineCounter($prefix) === $want) $same++;
    if (strlen($prefix) < 4) foreach (str_split('23456789') as $d) each($prefix . $d);
}
each('');
echo "$same/$total ca đúng (đối chiếu tích Descartes lặp)\n";

$calls = 0;
$sample = combineBacktrack('7999');
echo "7999: " . count($sample) . " tổ hợp, $calls lượt gọi quay lui\n";
