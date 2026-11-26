<?php
// LeetCode 150, Evaluate Reverse Polish Notation: hai cách đúng, hai bản sai, test.
// Chạy: php eval-rpn.php
// Nếu máy có Xdebug ở chế độ develop, nó chặn đệ quy ở 512 tầng: chạy php -d xdebug.mode=off eval-rpn.php
declare(strict_types=1);

const OPS = ['+' => true, '-' => true, '*' => true, '/' => true];

function apply(string $op, int $a, int $b): int {
    return match ($op) {
        '+' => $a + $b,
        '-' => $a - $b,
        '*' => $a * $b,
        default => intdiv($a, $b), // intdiv làm tròn về 0; $a / $b trả float khi không chia hết
    };
}

// Cách 1: ngăn xếp. Số lấy ra SAU là vế trái.
function evalStack(array $tokens): int {
    $st = [];
    foreach ($tokens as $t) {
        if (isset(OPS[$t])) { // so cả token: "-11" không phải khóa của OPS
            $b = array_pop($st);
            $a = array_pop($st);
            $st[] = apply($t, $a, $b);
        } else {
            $st[] = (int) $t;
        }
    }
    return $st[0];
}

// Cách 2: đệ quy từ token cuối.
function evalRecursive(array $tokens): int {
    $i = count($tokens) - 1;
    $go = function () use (&$go, &$i, $tokens): int { // &$i: closure phải mượn biến, không chép
        $t = $tokens[$i--];
        if (!isset(OPS[$t])) return (int) $t;
        $b = $go();
        $a = $go();
        return apply($t, $a, $b);
    };
    return $go();
}

// SAI: chia bằng floor, làm tròn xuống thay vì về 0.
function evalFloorDiv(array $tokens): int {
    $st = [];
    foreach ($tokens as $t) {
        if (isset(OPS[$t])) {
            $b = array_pop($st);
            $a = array_pop($st);
            $st[] = $t === '/' ? (int) floor($a / $b) : apply($t, $a, $b);
        } else {
            $st[] = (int) $t;
        }
    }
    return $st[0];
}

// SAI: chia bằng "/", kết quả là float rồi strict_types làm apply() ném TypeError.
function evalSlash(array $tokens): int {
    $st = [];
    foreach ($tokens as $t) {
        if (isset(OPS[$t])) {
            $b = array_pop($st);
            $a = array_pop($st);
            $st[] = $t === '/' ? $a / $b : apply($t, $a, $b);
        } else {
            $st[] = (int) $t;
        }
    }
    return $st[0];
}

$cases = [
    [['2', '1', '+', '3', '*'], 9],
    [['4', '13', '5', '/', '+'], 6],
    [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'], 22],
    [['3', '4', '-'], -1],
    [['7', '-2', '/'], -3],
    [['-7', '2', '/'], -3],
    [['42'], 42],
];
foreach (['evalStack', 'evalRecursive', 'evalFloorDiv', 'evalSlash'] as $fn) {
    $bad = [];
    foreach ($cases as [$tokens, $want]) {
        try {
            $got = $fn($tokens);
        } catch (TypeError $e) {
            $got = 'TypeError';
        }
        if ($got !== $want) $bad[] = '[' . implode(' ', $tokens) . "] → $got";
    }
    $ok = count($cases) - count($bad);
    printf("%-14s %d/%d ca đúng%s\n", $fn, $ok, count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}

echo "\n-7 / 2 = " . var_export(-7 / 2, true) . ", intdiv(-7, 2) = " . intdiv(-7, 2) . ", (int) floor(-7 / 2) = " . (int) floor(-7 / 2) . "\n";
$deep = ['1'];
for ($k = 0; $k < 100000; $k++) { $deep[] = '1'; $deep[] = '+'; }
echo 'đệ quy 10⁵ tầng: ' . evalRecursive($deep) . "\n";
echo 'ngăn xếp 10⁵ tầng: ' . evalStack($deep) . "\n";
