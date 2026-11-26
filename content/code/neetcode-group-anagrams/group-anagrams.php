<?php
// NC-04 Group Anagrams (LeetCode 49): khóa sắp xếp, khóa đếm, bẫy nối khóa.
// Chạy: php group-anagrams.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1, khóa = chữ cái đã sắp xếp. O(n · k log k).
function bySortedKey(array $strs): array {
    $groups = [];
    foreach ($strs as $s) {
        $chars = str_split($s); // str_split('') trả [] từ PHP 8.2; implode([]) vẫn là ''
        sort($chars);
        $groups[implode('', $chars)][] = $s; // $a[$k][] = …: tự tạo nhóm rỗng khi chưa có
    }
    return array_values($groups);
}

// Cách 2, khóa = bảng đếm 26 chữ, nối có dấu phân cách. O(n · k).
function byCountKey(array $strs): array {
    $groups = [];
    foreach ($strs as $s) {
        $count = array_fill(0, 26, 0);
        for ($i = 0, $n = strlen($s); $i < $n; $i++) $count[ord($s[$i]) - 97]++;
        $groups[implode('#', $count)][] = $s; // mảng không làm khóa được: phải nối thành chuỗi
    }
    return array_values($groups);
}

// Biến thể lỗi: nối bảng đếm KHÔNG có dấu phân cách.
function byCountKeyNoSeparator(array $strs): array {
    $groups = [];
    foreach ($strs as $s) {
        $count = array_fill(0, 26, 0);
        for ($i = 0, $n = strlen($s); $i < $n; $i++) $count[ord($s[$i]) - 97]++;
        $groups[implode('', $count)][] = $s;
    }
    return array_values($groups);
}

// Đề cho phép thứ tự bất kỳ: chuẩn hóa trước khi so.
function normalizeGroups(array $gs): string {
    foreach ($gs as &$g) sort($g);
    unset($g); // bỏ tham chiếu, nếu không lần foreach sau sẽ ghi đè phần tử cuối
    sort($gs);
    return json_encode($gs);
}
$cases = [
    [['eat', 'tea', 'tan', 'ate', 'nat', 'bat'], [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]],
    [[''], [['']]],
    [['a'], [['a']]],
    [['abc', 'bca', 'cab', 'abd'], [['abc', 'bca', 'cab'], ['abd']]],
];
foreach (['bySortedKey', 'byCountKey', 'byCountKeyNoSeparator'] as $fn) {
    $ok = count(array_filter($cases, fn($c) => normalizeGroups($fn($c[0])) === normalizeGroups($c[1])));
    printf("%-22s %d/%d ca đúng\n", $fn, $ok, count($cases));
}

// ── bẫy: 1 chữ a + 11 chữ b, và 11 chữ a + 1 chữ b ───────────────────────────
$x = 'a' . str_repeat('b', 11); $y = str_repeat('a', 11) . 'b';
echo "\n\"$x\" và \"$y\" không phải anagram\n";
echo '  byCountKeyNoSeparator gom chung: ', json_encode(byCountKeyNoSeparator([$x, $y])), "\n";
echo '  byCountKey tách riêng:           ', json_encode(byCountKey([$x, $y])), "\n";
echo '  mảng PHP giữ thứ tự chèn:       ', json_encode(byCountKey(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])), "\n";
