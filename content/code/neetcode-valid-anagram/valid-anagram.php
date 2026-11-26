<?php
// NC-02 Valid Anagram (LeetCode 242): ba cách, test, và bẫy Unicode.
// Chạy: php valid-anagram.php   (PHP 8.2, cần mbstring và intl cho phần Unicode)
declare(strict_types=1);

// Cách 1, sắp xếp rồi so: O(n log n). str_split tách theo BYTE, không theo chữ.
function bySorting(string $s, string $t): bool {
    if (strlen($s) !== strlen($t)) return false;
    $a = str_split($s); $b = str_split($t);
    sort($a); sort($b);
    return $a === $b;
}

// Cách 2, mảng đếm 26 ô: chỉ đúng khi input là 'a'..'z'. O(n), O(1) bộ nhớ.
function byCount26(string $s, string $t): bool {
    if (strlen($s) !== strlen($t)) return false;
    $count = array_fill(0, 26, 0);
    for ($i = 0, $n = strlen($s); $i < $n; $i++) {
        $count[ord($s[$i]) - 97]++; // $s[$i] là một byte
        $count[ord($t[$i]) - 97]--;
    }
    foreach ($count as $c) if ($c !== 0) return false;
    return true;
}

// Cách 3, đếm theo ký tự Unicode sau khi chuẩn hóa NFC.
function byMap(string $s, string $t): bool {
    $s = Normalizer::normalize($s, Normalizer::FORM_C);
    $t = Normalizer::normalize($t, Normalizer::FORM_C);
    if ($s === false || $t === false) return false; // không phải UTF-8 hợp lệ
    $count = [];
    foreach (mb_str_split($s) as $ch) $count[$ch] = ($count[$ch] ?? 0) + 1;
    foreach (mb_str_split($t) as $ch) {
        if (empty($count[$ch])) return false; // không có hoặc đã dùng hết
        $count[$ch]--;
    }
    foreach ($count as $c) if ($c !== 0) return false;
    return true;
}

$cases = [
    ['anagram', 'nagaram', true],
    ['rat', 'car', false],
    ['a', 'ab', false],
    ['aacc', 'ccac', false],
    ['', '', true],
];
$failed = 0;
foreach (['bySorting', 'byCount26', 'byMap'] as $fn)
    foreach ($cases as [$s, $t, $want])
        if ($fn($s, $t) !== $want) { $failed++; echo "SAI $fn(\"$s\", \"$t\")\n"; }
printf("test chữ thường: 3 cách × %d ca, %d ca sai\n\n", count($cases), $failed);

// ── bẫy: chuỗi PHP là dãy byte ──────────────────────────────────────────────
$composed = "caf\u{00E9}";     // é là một code point
$decomposed = "e\u{0301}fac"; // e + dấu sắc kết hợp
printf("\"%s\" vs \"%s\": strlen %d vs %d, mb_strlen %d vs %d\n", $composed, $decomposed,
    strlen($composed), strlen($decomposed), mb_strlen($composed), mb_strlen($decomposed));
printf("  bySorting: %s, byMap (NFC): %s\n", var_export(bySorting($composed, $decomposed), true), var_export(byMap($composed, $decomposed), true));
// Sắp xếp theo byte làm vỡ chữ nhiều byte: hai chuỗi cùng tập byte được coi là anagram.
$x = "\u{00E9}\u{00E8}"; // é è: C3 A9 C3 A8
$y = "\u{00E8}\u{00E9}"; // è é
$z = "\xC3\xC3\xA9\xA8"; // cùng 4 byte, không còn là UTF-8 hợp lệ
printf("  \"%s\" vs byte xáo trộn: bySorting %s (sai), byMap %s\n", $x, var_export(bySorting($x, $z), true), var_export(byMap($x, $z), true));
printf("  \"%s\" vs \"%s\": bySorting %s, byMap %s\n", $x, $y, var_export(bySorting($x, $y), true), var_export(byMap($x, $y), true));
