<?php
// LeetCode 76, Minimum Window Substring: ba cách, một bản sai, test.
// Chạy: php min-window.php
declare(strict_types=1);

// Cách 1, vét cạn: từ mỗi đầu trái, kéo đầu phải tới khi chứa đủ t. O(n²).
function bruteForce(string $s, string $t): string {
    $need = count_chars($t, 1); // mã ký tự → số lần, chỉ các ký tự có mặt
    $best = '';
    for ($l = 0; $l < strlen($s); $l++) {
        $left = $need; // mảng PHP là giá trị: gán là chép
        $missing = strlen($t);
        for ($r = $l; $r < strlen($s); $r++) {
            $c = ord($s[$r]);
            if (($left[$c] ?? 0) > 0) $missing--;
            $left[$c] = ($left[$c] ?? 0) - 1;
            if ($missing === 0) {
                if ($best === '' || $r - $l + 1 < strlen($best)) $best = substr($s, $l, $r - $l + 1);
                break;
            }
        }
    }
    return $best;
}

// Cách 2, cửa sổ, nhưng mỗi bước so cả bảng đếm 128 ô để biết cửa sổ đã đủ chưa. O(128·n).
function windowCompareAll(string $s, string $t): string {
    $need = array_fill(0, 128, 0);
    $have = array_fill(0, 128, 0);
    for ($i = 0; $i < strlen($t); $i++) $need[ord($t[$i])]++;
    $covers = function () use (&$need, &$have): bool {
        for ($c = 0; $c < 128; $c++) if ($have[$c] < $need[$c]) return false;
        return true;
    };
    $bestL = 0;
    $bestLen = PHP_INT_MAX;
    $l = 0;
    for ($r = 0; $r < strlen($s); $r++) {
        $have[ord($s[$r])]++;
        while ($covers()) {
            if ($r - $l + 1 < $bestLen) { $bestL = $l; $bestLen = $r - $l + 1; }
            $have[ord($s[$l++])]--;
        }
    }
    return $bestLen === PHP_INT_MAX ? '' : substr($s, $bestL, $bestLen);
}

// Cách 3, cửa sổ với bảng "còn thiếu" và một biến missing: biết cửa sổ đủ hay chưa trong O(1). O(n + m).
function windowMissing(string $s, string $t): string {
    $need = array_fill(0, 128, 0); // need[c] > 0: còn thiếu c; < 0: cửa sổ có thừa c
    for ($i = 0; $i < strlen($t); $i++) $need[ord($t[$i])]++;
    $missing = strlen($t);
    $l = 0;
    $bestL = 0;
    $bestLen = PHP_INT_MAX;
    for ($r = 0; $r < strlen($s); $r++) {
        if ($need[ord($s[$r])]-- > 0) $missing--; // ký tự này lấp một chỗ thiếu
        while ($missing === 0) { // đủ: co từ trái chừng nào còn đủ, ghi đáp án TRONG lúc co
            if ($r - $l + 1 < $bestLen) { $bestL = $l; $bestLen = $r - $l + 1; }
            if (++$need[ord($s[$l++])] > 0) $missing++; // bỏ đi một ký tự cần thiết: lại thiếu
        }
    }
    return $bestLen === PHP_INT_MAX ? '' : substr($s, $bestL, $bestLen);
}

// SAI: chỉ xét t có những CHỮ nào, quên số lần. t = "aa" chỉ cần một chữ a.
function ignoreMultiplicity(string $s, string $t): string {
    $need = array_flip(str_split($t));
    $best = '';
    for ($l = 0; $l < strlen($s); $l++) {
        $seen = [];
        for ($r = $l; $r < strlen($s); $r++) {
            if (isset($need[$s[$r]])) $seen[$s[$r]] = true;
            if (count($seen) === count($need)) {
                if ($best === '' || $r - $l + 1 < strlen($best)) $best = substr($s, $l, $r - $l + 1);
                break;
            }
        }
    }
    return $best;
}

$cases = [
    ["ADOBECODEBANC", "ABC", "BANC"], ["a", "a", "a"], ["a", "aa", ""], ["aa", "aa", "aa"], ["ab", "b", "b"],
    ["bba", "ab", "ba"], ["cabwefgewcwaefgcf", "cae", "cwae"], ["abc", "d", ""],
];
foreach (['bruteForce', 'windowCompareAll', 'windowMissing', 'ignoreMultiplicity'] as $fn) {
    $bad = [];
    foreach ($cases as [$s, $t, $want]) {
        $got = $fn($s, $t);
        if ($got !== $want) $bad[] = "(\"$s\", \"$t\") → \"$got\"";
    }
    echo str_pad($fn, 18) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
