<?php
declare(strict_types=1);

function palindromes(string $text, bool $reuseMirror): array
{
    $last = 2 * strlen($text);
    $radius = $reuseMirror ? array_fill(0, $last + 1, 0) : [];
    $center = $right = $start = $best = $count = 0;

    for ($i = 0; $i <= $last; $i++) {
        $length = $reuseMirror && $i < $right ? min($radius[2 * $center - $i], $right - $i) : 0;
        while ($i - $length > 0 && $i + $length < $last) {
            $left = $i - $length - 1;
            $next = $i + $length + 1;
            if ($left % 2 && $text[intdiv($left, 2)] !== $text[intdiv($next, 2)]) {
                break;
            }
            $length++;
        }
        if ($reuseMirror) {
            $radius[$i] = $length;
            if ($i + $length > $right) {
                [$center, $right] = [$i, $i + $length];
            }
        }
        if ($length > $best) {
            [$start, $best] = [intdiv($i - $length, 2), $length];
        }
        $count += intdiv($length + 1, 2);
    }
    return [$start, $best, $count];
}

function longestPalindrome(string $text, bool $reuseMirror = false): string
{
    [$start, $length] = palindromes($text, $reuseMirror);
    return substr($text, $start, $length);
}

// TESTS
$cases = [
    ['', ''], ['c', 'c'], ['xabbaq', 'abba'], ['tacocatx', 'tacocat'],
    ['abab', 'aba'], ['zzzz', 'zzzz'], ['xyz', 'x'], [str_repeat('a', 1000), str_repeat('a', 1000)],
];
foreach ($cases as [$text, $expected]) {
    if (longestPalindrome($text) !== $expected || longestPalindrome($text, true) !== $expected) {
        throw new RuntimeException('Sai đoạn đối xứng');
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
