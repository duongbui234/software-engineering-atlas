<?php
// LeetCode 125, Valid Palindrome: hai cách, một bản sai, và test.
// Chạy: php valid-palindrome.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1: lọc ra chuỗi sạch, đảo ngược, so. O(n) thời gian, O(n) bộ nhớ phụ.
// strrev đảo theo BYTE: đúng với ASCII của đề, làm vỡ chữ UTF-8 nhiều byte.
function cleanReverse(string $s): bool {
    $clean = preg_replace('/[^a-z0-9]/', '', strtolower($s));
    return $clean === strrev($clean);
}

// Cách 2: hai con trỏ từ hai đầu, bỏ qua ký tự không phải chữ hoặc số. O(1) bộ nhớ phụ.
function twoPointers(string $s): bool {
    $i = 0; $j = strlen($s) - 1;
    while ($i < $j) {
        if (!ctype_alnum($s[$i])) { $i++; continue; } // ctype_alnum nhận một CHUỖI, theo locale "C": chỉ ASCII
        if (!ctype_alnum($s[$j])) { $j--; continue; }
        if (strtolower($s[$i]) !== strtolower($s[$j])) return false; // khác nhau: dừng ngay
        $i++; $j--;
    }
    return true;
}

// SAI: dùng \W để lọc. \w gồm cả dấu gạch dưới "_", mà đề chỉ giữ chữ và số.
function wordRegex(string $s): bool {
    $clean = preg_replace('/\W/', '', strtolower($s));
    return $clean === strrev($clean);
}

$cases = [
    ["A man, a plan, a canal: Panama", true], ["race a car", false], [" ", true], ["", true],
    ["0P", false], ["a_", true], ["No 'x' in Nixon", true], [".,", true],
];
foreach (['cleanReverse', 'twoPointers', 'wordRegex'] as $fn) {
    $bad = array_map(fn($c) => json_encode($c[0]), array_filter($cases, fn($c) => $fn($c[0]) !== $c[1]));
    printf("%-13s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(' ', $bad) : '');
}
