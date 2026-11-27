<?php
// Regular Expression Matching (LeetCode 10): vét cạn, ghi nhớ và bảng trên hai tiền tố.
// Chạy: php -d xdebug.mode=off matcher.php

function matchBrute(string $s, string $p, int &$calls): bool {
    // Đệ quy thuần trên hậu tố s[i:] và p[j:]; $calls đếm số lần gọi.
    $go = function (int $i, int $j) use (&$go, $s, $p, &$calls): bool {
        $calls++;
        if ($j === strlen($p)) return $i === strlen($s);
        $first = $i < strlen($s) && ($p[$j] === $s[$i] || $p[$j] === '.');
        if ($j + 1 < strlen($p) && $p[$j + 1] === '*') {
            // bỏ qua cặp "x*" (0 lần) hoặc ăn một ký tự và giữ nguyên "x*"
            return $go($i, $j + 2) || ($first && $go($i + 1, $j));
        }
        return $first && $go($i + 1, $j + 1);
    };
    return $go(0, 0);
}

function matchMemo(string $s, string $p, int &$calls): bool {
    // Cùng đệ quy, nhưng lưu kết quả của từng cặp (i, j). Hỏi bằng array_key_exists:
    // kiểm tra kiểu "if (!empty($memo[$k]))" sẽ coi ô đã lưu false là chưa tính.
    $memo = [];
    $go = function (int $i, int $j) use (&$go, &$memo, $s, $p, &$calls): bool {
        $calls++;
        $key = $i * (strlen($p) + 1) + $j;
        if (array_key_exists($key, $memo)) return $memo[$key];
        if ($j === strlen($p)) {
            $ans = $i === strlen($s);
        } else {
            $first = $i < strlen($s) && ($p[$j] === $s[$i] || $p[$j] === '.');
            if ($j + 1 < strlen($p) && $p[$j + 1] === '*') {
                $ans = $go($i, $j + 2) || ($first && $go($i + 1, $j));
            } else {
                $ans = $first && $go($i + 1, $j + 1);
            }
        }
        $memo[$key] = $ans;
        return $ans;
    };
    return $go(0, 0);
}

function isMatch(string $s, string $p): bool {
    // dp[i][j]: tiền tố s[0:i] có khớp trọn mẫu p[0:j] không.
    $n = strlen($s);
    $m = strlen($p);
    $dp = array_fill(0, $n + 1, array_fill(0, $m + 1, false));
    $dp[0][0] = true;
    for ($j = 2; $j <= $m; $j++) {
        // chuỗi rỗng chỉ khớp được các cặp "x*" lấy 0 lần
        $dp[0][$j] = $p[$j - 1] === '*' && $dp[0][$j - 2];
    }
    for ($i = 1; $i <= $n; $i++) {
        for ($j = 1; $j <= $m; $j++) {
            if ($p[$j - 1] === '*') {
                $zero = $dp[$i][$j - 2];
                $more = ($p[$j - 2] === $s[$i - 1] || $p[$j - 2] === '.') && $dp[$i - 1][$j];
                $dp[$i][$j] = $zero || $more;
            } else {
                $dp[$i][$j] = ($p[$j - 1] === $s[$i - 1] || $p[$j - 1] === '.') && $dp[$i - 1][$j - 1];
            }
        }
    }
    return $dp[$n][$m];
}

function product(array $items, int $k): array {
    $out = [''];
    for ($r = 0; $r < $k; $r++) {
        $next = [];
        foreach ($out as $pre) foreach ($items as $x) $next[] = $pre . $x;
        $out = $next;
    }
    return $out;
}

$cases = [
    ['ba', 'b', false],
    ['bb', 'b*', true],
    ['xy', '.*', true],
    ['kkd', 'z*k*d', true],
    ['tomato', 'to*ma*to', true],
    ['tomato', 't.m*a*t', false],
    ['ab', '.*z', false],
    ['aaa', 'a*a', true],
    ['aaa', 'ab*a*c*a', true],
    ['a', 'ab*', true],
    ['bbbba', '.*a*a', true],
    ['abcd', 'd*', false],
    ['', 'a*b*', true],
    ['a', '.*..a*', false],
    [str_repeat('a', 20), str_repeat('a*', 7) . 'b', false],
];
$ok = 0;
foreach ($cases as [$s, $p, $want]) {
    $x = 0;
    $y = 0;
    $got = [isMatch($s, $p), matchMemo($s, $p, $x), matchBrute($s, $p, $y)];
    if ($got === [$want, $want, $want]) $ok++;
    else echo "sai: $s $p\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Vét mọi chuỗi a/b dài 0–4 và mọi mẫu 0–3 phần tử (a, b, . có hoặc không có *).
$strings = [];
for ($n = 0; $n <= 4; $n++) $strings = array_merge($strings, product(['a', 'b'], $n));
$patterns = [];
for ($k = 0; $k <= 3; $k++) $patterns = array_merge($patterns, product(['a', 'a*', 'b', 'b*', '.', '.*'], $k));
$good = 0;
$total = 0;
foreach ($patterns as $p) {
    $native = '/^(?:' . $p . ')$/D'; // D: $ không cho khớp trước một "\n" ở cuối
    foreach ($strings as $s) {
        $total++;
        $want = preg_match($native, $s) === 1;
        $x = 0;
        $y = 0;
        if (isMatch($s, $p) === $want && matchMemo($s, $p, $x) === $want && matchBrute($s, $p, $y) === $want) $good++;
    }
}
echo "$good/$total ca đúng (đối chiếu regex của ngôn ngữ)\n";

$brute = 0;
$memo = 0;
matchBrute(str_repeat('a', 20), str_repeat('a*', 7) . 'b', $brute);
matchMemo(str_repeat('a', 20), str_repeat('a*', 7) . 'b', $memo);
echo "20 chữ a với (a*)×7 rồi b: vét cạn $brute lượt gọi, memo $memo lượt gọi\n";
