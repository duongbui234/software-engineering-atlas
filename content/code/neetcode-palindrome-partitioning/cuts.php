<?php
// Palindrome Partitioning (LeetCode 131): cắt tại mọi tiền tố đối xứng của phần còn lại
// Chạy: php cuts.php

$compares = 0;

// Kiểm tra s[lo..hi] bằng hai con trỏ, đếm số phép so ký tự
function isPalindrome(string $s, int $lo, int $hi): bool {
    global $compares;
    while ($lo < $hi) {
        $compares++;
        if ($s[$lo] !== $s[$hi]) return false;
        $lo++;
        $hi--;
    }
    return true;
}

// Cách 1: ở mỗi vị trí start, thử mọi điểm cắt end và kiểm tra lại đoạn s[start..end] mỗi lần
function partitionCheck(string $s): array {
    $n = strlen($s);
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $s, $n) {
        if ($start === $n) {
            $result[] = $path;
            return;
        }
        for ($end = $start; $end < $n; $end++) {
            if (!isPalindrome($s, $start, $end)) continue;
            $path[] = substr($s, $start, $end - $start + 1);
            $walk($end + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Cách chính: dựng bảng isPal[i][j] một lần (i đi từ phải sang trái), rồi quay lui chỉ tra bảng
function partition(string $s): array {
    global $compares;
    $n = strlen($s);
    $isPal = array_fill(0, $n, array_fill(0, $n, false));
    for ($i = $n - 1; $i >= 0; $i--) {
        for ($j = $i; $j < $n; $j++) {
            $compares++;
            // đối xứng khi hai đầu bằng nhau và phần bên trong (ngắn hơn, đã tính) cũng đối xứng
            $isPal[$i][$j] = $s[$i] === $s[$j] && ($j - $i < 2 || $isPal[$i + 1][$j - 1]);
        }
    }
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $s, $n, $isPal) {
        if ($start === $n) {
            $result[] = $path; // cắt hết chuỗi: ghi một cách chia
            return;
        }
        for ($end = $start; $end < $n; $end++) {
            if (!$isPal[$start][$end]) continue; // mảnh đầu không đối xứng: bỏ cả nhánh
            $path[] = substr($s, $start, $end - $start + 1);
            $walk($end + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Trọng tài độc lập: vét mọi 2^(n-1) cách đặt vết cắt, giữ cách mà mọi mảnh đọc xuôi ngược như nhau
function bruteForce(string $s): array {
    $n = strlen($s);
    $result = [];
    for ($mask = 0; $mask < 1 << ($n - 1); $mask++) {
        $parts = [];
        $from = 0;
        for ($gap = 0; $gap < $n - 1; $gap++) {
            if ($mask & (1 << $gap)) {
                $parts[] = substr($s, $from, $gap + 1 - $from);
                $from = $gap + 1;
            }
        }
        $parts[] = substr($s, $from);
        $all = true;
        foreach ($parts as $p) {
            if ($p !== strrev($p)) {
                $all = false;
                break;
            }
        }
        if ($all) $result[] = $parts;
    }
    return $result;
}

function canonical(array $list): string {
    $keys = array_map(fn($p) => implode('/', $p), $list);
    sort($keys, SORT_STRING);
    return implode('|', $keys);
}

function check(string $s, ?array $expected): bool {
    $want = canonical($expected ?? bruteForce($s));
    foreach ([partition($s), partitionCheck($s)] as $got) {
        $keys = array_map(fn($p) => implode('/', $p), $got);
        if (count(array_unique($keys)) !== count($got)) return false;
        if (canonical($got) !== $want) return false;
    }
    return true;
}

$cases = [
    ['x', [['x']]],
    ['noon', [['n', 'o', 'o', 'n'], ['n', 'oo', 'n'], ['noon']]],
    ['abc', [['a', 'b', 'c']]],
    ['aaaa', null],
    ['level', null],
    ['racecar', null],
    ['abcdefghijklmnop', [str_split('abcdefghijklmnop')]],
    [str_repeat('a', 16), null],
];
$ok = 0;
foreach ($cases as [$s, $expected]) {
    if (check($s, $expected)) $ok++;
    else echo "sai ở $s\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi chuỗi trên {a, b} dài 1–9
$total = 0;
$good = 0;
$build = function (string $s) use (&$build, &$total, &$good) {
    if ($s !== '') {
        $total++;
        if (check($s, null)) $good++;
    }
    if (strlen($s) === 9) return;
    $build($s . 'a');
    $build($s . 'b');
};
$build('');
echo "$good/$total ca đúng (đối chiếu vét mọi cách đặt vết cắt)\n";

$sixteen = str_repeat('a', 16);
$compares = 0;
$count = count(partitionCheck($sixteen));
$viaCheck = $compares;
$compares = 0;
partition($sixteen);
echo "16 chữ a: $count cách chia; kiểm tra lại mỗi lần $viaCheck phép so, bảng isPal $compares phép so\n";
