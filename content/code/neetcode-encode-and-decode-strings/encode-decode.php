<?php
// LeetCode 271, Encode and Decode Strings: ba cách mã hóa và test.
// Chạy: php encode-decode.php   (PHP 8.2)
declare(strict_types=1);

// Cách 1 (SAI): nối bằng dấu phân cách.
function joinEncode(array $strs): string { return implode(',', $strs); }
function joinDecode(string $s): array { return $s === '' ? [] : explode(',', $s); }

// Cách 2: thoát ký tự. "/" thành "//", "," thành "/,", mỗi chuỗi kết thúc bằng ",".
function escapeEncode(array $strs): string {
    // strtr thay nhiều cặp trong MỘT lượt, nên "/" vừa sinh ra không bị thay lần nữa
    return implode('', array_map(fn($s) => strtr($s, ['/' => '//', ',' => '/,']) . ',', $strs));
}
function escapeDecode(string $s): array {
    $out = []; $cur = '';
    for ($i = 0, $n = strlen($s); $i < $n; $i++) {
        if ($s[$i] === '/') $cur .= $s[++$i]; // byte sau "/" luôn là chữ thật
        elseif ($s[$i] === ',') { $out[] = $cur; $cur = ''; }
        else $cur .= $s[$i];
    }
    return $out;
}

// Cách 3: tiền tố độ dài "<độ dài>#<nội dung>". strlen và substr đều đếm BYTE: hai bên khớp nhau.
function lengthEncode(array $strs): string {
    return implode('', array_map(fn($s) => strlen($s) . '#' . $s, $strs));
}
function lengthDecode(string $s): array {
    $out = []; $i = 0;
    while ($i < strlen($s)) {
        $hash = strpos($s, '#', $i); // "#" đầu tiên từ $i luôn thuộc phần độ dài
        $len = (int) substr($s, $i, $hash - $i);
        $out[] = substr($s, $hash + 1, $len);
        $i = $hash + 1 + $len; // nhảy qua nội dung, không đọc bên trong
    }
    return $out;
}

// Bản sai: mã hóa đếm byte (strlen) nhưng giải mã đếm ký tự (mb_substr).
function lengthDecodeChars(string $s): array {
    $out = []; $i = 0; $n = mb_strlen($s);
    while ($i < $n) {
        $rest = mb_substr($s, $i);
        $hash = mb_strpos($rest, '#');
        if ($hash === false) break; // đọc lệch: không còn "#", dừng thay vì lặp mãi
        $len = (int) mb_substr($rest, 0, $hash);
        $out[] = mb_substr($rest, $hash + 1, $len);
        $i += $hash + 1 + $len;
    }
    return $out;
}

$cases = [
    ['neet', 'code', 'love', 'you'], ['we', 'say', ':', 'yes'], [], [''], ['', ''],
    ['a,b', 'c'], ['12#ab', '#'], ['a/', '/,'], ['😀é', 'x'],
];
$show = fn(array $a): string => json_encode($a, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$variants = [
    ['join(",")', 'joinEncode', 'joinDecode'],
    ['thoát ký tự', 'escapeEncode', 'escapeDecode'],
    ['tiền tố độ dài', 'lengthEncode', 'lengthDecode'],
    ['độ dài lệch đơn vị', 'lengthEncode', 'lengthDecodeChars'],
];
foreach ($variants as [$name, $enc, $dec]) {
    $bad = array_map($show, array_filter($cases, fn($c) => $show($dec($enc($c))) !== $show($c)));
    printf("%s%s %d/%d ca đúng%s\n", $name, str_repeat(' ', 19 - mb_strlen($name)), count($cases) - count($bad), count($cases),
        $bad ? '; sai ở ' . implode(' ', $bad) : '');
}
printf("\nví dụ: %s → %s\n", $show(['12#ab', '#']), json_encode(lengthEncode(['12#ab', '#'])));
printf("strlen(\"😀\") = %d, mb_strlen(\"😀\") = %d\n", strlen('😀'), mb_strlen('😀'));
