<?php
// Valid Parenthesis String (LeetCode 678): vét cạn 3^k cách hiểu, DP nhớ (i, số mở), hai ngăn xếp, khoảng [lo, hi]
// Chạy: php -d xdebug.mode=off wildcard.php

$steps = 0;

// Vét cạn: thử mọi cách hiểu của từng dấu * (")" , rỗng, "("), kiểm từng chuỗi ngoặc thu được
function checkBrute(string $s): bool {
    $buf = [];
    return bruteGo($s, 0, $buf);
}

function balanced(array $buf): bool {
    $open = 0;
    foreach ($buf as $c) {
        $open += $c === '(' ? 1 : -1;
        if ($open < 0) return false;
    }
    return $open === 0;
}

function bruteGo(string $s, int $i, array &$buf): bool {
    global $steps;
    if ($i === strlen($s)) {
        $steps++; // một cách hiểu trọn vẹn
        return balanced($buf);
    }
    if ($s[$i] !== '*') {
        $buf[] = $s[$i];
        $r = bruteGo($s, $i + 1, $buf);
        array_pop($buf);
        return $r;
    }
    $found = false;
    foreach ([')', '', '('] as $pick) {
        if ($pick !== '') $buf[] = $pick;
        if (bruteGo($s, $i + 1, $buf)) $found = true; // không dừng sớm: đếm đủ 3^k cách hiểu
        if ($pick !== '') array_pop($buf);
    }
    return $found;
}

// DP nhớ: f(i, open) = phần s[i..] có đóng được đúng open ngoặc đang mở không
function checkDP(string $s): bool {
    $n = strlen($s);
    $memo = array_fill(0, ($n + 1) * ($n + 2), -1); // -1: chưa tính, 0: sai, 1: đúng
    return dp($s, 0, 0, $memo);
}

function dp(string $s, int $i, int $open, array &$memo): bool {
    global $steps;
    $n = strlen($s);
    if ($open < 0) return false; // đóng nhiều hơn mở ở một tiền tố
    if ($i === $n) return $open === 0;
    $key = $i * ($n + 2) + $open;
    if ($memo[$key] !== -1) return $memo[$key] === 1;
    $steps++; // một trạng thái mới
    $c = $s[$i];
    if ($c === '(') $r = dp($s, $i + 1, $open + 1, $memo);
    elseif ($c === ')') $r = dp($s, $i + 1, $open - 1, $memo);
    else $r = dp($s, $i + 1, $open - 1, $memo) || dp($s, $i + 1, $open, $memo) || dp($s, $i + 1, $open + 1, $memo);
    $memo[$key] = $r ? 1 : 0;
    return $r;
}

// Hai ngăn xếp chỉ số: ")" ăn "(" gần nhất trước, hết thì ăn "*"; cuối cùng mỗi "(" còn lại cần một "*" đứng sau nó
function checkStacks(string $s): bool {
    $opens = [];
    $stars = [];
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        if ($s[$i] === '(') $opens[] = $i;
        elseif ($s[$i] === '*') $stars[] = $i;
        elseif ($opens) array_pop($opens);
        elseif ($stars) array_pop($stars);
        else return false; // ")" không có gì để khớp
    }
    while ($opens && $stars) {
        if (array_pop($opens) > array_pop($stars)) return false; // "*" đứng trước "(" thì không đóng được nó
    }
    return !$opens;
}

// Cách chính: giữ khoảng [lo, hi] các số ngoặc mở có thể có
function checkValidString(string $s): bool {
    global $steps;
    $lo = 0; // số ngoặc mở ít nhất có thể
    $hi = 0; // số ngoặc mở nhiều nhất có thể
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        $c = $s[$i];
        $steps++;
        if ($c === '(') {
            $lo++;
            $hi++;
        } elseif ($c === ')') {
            $lo--;
            $hi--;
        } else {
            $lo--; // "*" là ")"
            $hi++; // "*" là "("
        }
        if ($hi < 0) return false; // kể cả coi mọi "*" là "(" vẫn đóng thừa
        if ($lo < 0) $lo = 0; // bỏ các cách hiểu làm số mở âm
    }
    return $lo === 0; // 0 nằm trong khoảng: có cách hiểu đóng hết
}

// Bản sai: không kẹp lo về 0, rồi "sửa" bằng lo <= 0
function checkNoClamp(string $s): bool {
    $lo = 0;
    $hi = 0;
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        $c = $s[$i];
        if ($c === '(') {
            $lo++;
            $hi++;
        } elseif ($c === ')') {
            $lo--;
            $hi--;
        } else {
            $lo--;
            $hi++;
        }
        if ($hi < 0) return false;
    }
    return $lo <= 0;
}

$cases = [
    ['*', true],
    [')', false],
    ['*(', false],
    ['(*', true],
    ['((*', false],
    ['(()*', true],
    ['*)(*', true],
    ['(*)*)(', false],
    ['**())', true],
    ['((**)', true],
];
$ok = 0;
foreach ($cases as [$s, $want]) {
    $got = [checkBrute($s), checkDP($s), checkStacks($s), checkValidString($s)];
    if (count(array_filter($got, fn($x) => $x === $want)) === 4) $ok++;
    else echo "sai ở $s " . json_encode($got) . "\n";
}
printf("%d/%d ca đúng\n", $ok, count($cases));

// Đối chiếu: mọi chuỗi độ dài 1–8 trên ba ký tự ( ) *
$total = 0;
$good = 0;
$wrong = 0;
function gen(string $prefix): void {
    global $total, $good, $wrong;
    if ($prefix !== '') {
        $total++;
        $b = checkBrute($prefix);
        if (checkDP($prefix) === $b && checkStacks($prefix) === $b && checkValidString($prefix) === $b) $good++;
        if (checkNoClamp($prefix) !== $b) $wrong++;
    }
    if (strlen($prefix) === 8) return;
    foreach (['(', ')', '*'] as $c) gen($prefix . $c);
}
gen('');
printf("%d/%d ca đúng (đối chiếu vét cạn)\n", $good, $total);
printf("Không kẹp lo: sai %d/%d ca\n", $wrong, $total);

$js = fn(bool $x) => $x ? 'true' : 'false';

// Đo ở giới hạn n = 100: 99 dấu * rồi một "(", đáp án sai nên DP phải đi hết mọi trạng thái
$big = str_repeat('*', 99) . '(';
$steps = 0;
$t0 = hrtime(true);
$d = checkDP($big);
$dpMs = (hrtime(true) - $t0) / 1e6;
$dc = $steps;
$steps = 0;
$t0 = hrtime(true);
$g = checkValidString($big);
$greedyMs = (hrtime(true) - $t0) / 1e6;
$gc = $steps;
printf("n = 100, đáp án %s/%s: DP %d trạng thái (%.2f ms), khoảng [lo, hi] %d bước (%.3f ms)\n", $js($d), $js($g), $dc, $dpMs, $gc, $greedyMs);

// Vét cạn ở cỡ nhỏ: 12 dấu * rồi một "("
$small = str_repeat('*', 12) . '(';
$steps = 0;
$t0 = hrtime(true);
$b = checkBrute($small);
$bruteMs = (hrtime(true) - $t0) / 1e6;
printf("n = 13, đáp án %s: vét cạn %d cách hiểu (%.1f ms)\n", $js($b), $steps, $bruteMs);
