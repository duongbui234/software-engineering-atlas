<?php
declare(strict_types=1);

function decodeCount(string $digits): int {
    $beforePrevious = 0;
    $previous = 1;
    for ($i = 0; $i < strlen($digits); $i++) {
        $digit = $digits[$i];
        $current = $digit === '0' ? 0 : $previous;
        if ($i > 0 && ($digits[$i - 1] === '1' || ($digits[$i - 1] === '2' && $digit <= '6'))) {
            $current += $beforePrevious;
        }
        if ($current === 0) {
            return 0;
        }
        $beforePrevious = $previous;
        $previous = min($current, 2147483647);
    }
    return $previous;
}

function decodeByCuts(string $digits, bool $memoized): int {
    $memo = [];
    $visit = static function (int $i) use (&$visit, $digits, $memoized, &$memo): int {
        if ($i === strlen($digits)) return 1;
        if ($digits[$i] === '0') return 0;
        if (isset($memo[$i])) return $memo[$i];
        $count = $visit($i + 1);
        if ($i + 1 < strlen($digits) &&
            ($digits[$i] === '1' || ($digits[$i] === '2' && $digits[$i + 1] <= '6'))) {
            $count += $visit($i + 2);
        }
        if ($memoized) $memo[$i] = $count;
        return $count;
    };
    return $visit(0);
}

function check(int $got, int $want): void {
    if ($got !== $want) {
        throw new RuntimeException("want $want, got $got");
    }
}

check(decodeCount("11204"), 2);
check(decodeByCuts("11204", true), 2);
check(decodeByCuts("11204", false), 2);
check(decodeCount("27"), 1);
check(decodeByCuts("27", true), 1);
check(decodeByCuts("27", false), 1);
check(decodeCount("1010"), 1);
check(decodeByCuts("1010", true), 1);
check(decodeByCuts("1010", false), 1);
check(decodeCount("100"), 0);
check(decodeByCuts("100", true), 0);
check(decodeByCuts("100", false), 0);
check(decodeCount("07"), 0);
check(decodeByCuts("07", true), 0);
check(decodeByCuts("07", false), 0);
check(decodeCount("1234"), 3);
check(decodeByCuts("1234", true), 3);
check(decodeByCuts("1234", false), 3);
check(decodeCount("301"), 0);
check(decodeByCuts("301", true), 0);
check(decodeByCuts("301", false), 0);
check(decodeCount("9"), 1);
check(decodeByCuts("9", true), 1);
check(decodeByCuts("9", false), 1);
check(decodeCount("0"), 0);
check(decodeByCuts("0", true), 0);
check(decodeByCuts("0", false), 0);
check(decodeCount("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300"), 0);
check(decodeByCuts("1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111300", true), 0);
echo "10/10 ca đúng\n";
