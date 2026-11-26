<?php
// LeetCode 424, Longest Repeating Character Replacement: ba cách, một bản sai, test.
// Chạy: php character-replacement.php
declare(strict_types=1);

// Cách 1, vét cạn: mọi điểm bắt đầu, kéo dài và đếm. O(n²).
function bruteForce(string $s, int $k): int {
    $best = 0;
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        $count = array_fill(0, 26, 0);
        $maxFreq = 0;
        for ($j = $i; $j < $n; $j++) {
            $maxFreq = max($maxFreq, ++$count[ord($s[$j]) - 65]);
            if ($j - $i + 1 - $maxFreq <= $k) $best = max($best, $j - $i + 1);
        }
    }
    return $best;
}

// Cách 2, cửa sổ co bằng while, tính lại maxFreq đúng từ 26 ô mỗi lần co. O(26·n).
function windowRecount(string $s, int $k): int {
    $count = array_fill(0, 26, 0);
    $left = 0;
    $best = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        $count[ord($s[$right]) - 65]++;
        while ($right - $left + 1 - max($count) > $k) $count[ord($s[$left++]) - 65]--;
        $best = max($best, $right - $left + 1);
    }
    return $best;
}

// Cách 3, cửa sổ không bao giờ co: maxFreq chỉ tăng, không giảm khi bỏ ký tự bên trái. O(n).
function windowStaleMax(string $s, int $k): int {
    $count = array_fill(0, 26, 0);
    $left = 0;
    $maxFreq = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        $maxFreq = max($maxFreq, ++$count[ord($s[$right]) - 65]);
        if ($right - $left + 1 - $maxFreq > $k) $count[ord($s[$left++]) - 65]--; // "if", không phải "while"
    }
    return strlen($s) - $left; // cửa sổ không bao giờ co, nên độ dài cuối là độ dài lớn nhất từng đạt
}

// SAI: coi ký tự ở đầu trái là ký tự giữ lại, thay vì ký tự nhiều nhất trong cửa sổ.
function wrongKeepLeftChar(string $s, int $k): int {
    $count = array_fill(0, 26, 0);
    $left = 0;
    $best = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        $count[ord($s[$right]) - 65]++;
        while ($right - $left + 1 - $count[ord($s[$left]) - 65] > $k) $count[ord($s[$left++]) - 65]--;
        $best = max($best, $right - $left + 1);
    }
    return $best;
}

$cases = [
    ["ABAB", 2, 4], ["AABABBA", 1, 4], ["A", 0, 1], ["ABCDE", 1, 2],
    ["AAAA", 0, 4], ["BAAAB", 2, 5], ["ABBB", 2, 4], ["ABCABCAA", 2, 5],
];
foreach (['bruteForce', 'windowRecount', 'windowStaleMax', 'wrongKeepLeftChar'] as $fn) {
    $bad = [];
    foreach ($cases as [$s, $k, $want]) {
        $got = $fn($s, $k);
        if ($got !== $want) $bad[] = "$s k=$k → $got";
    }
    echo str_pad($fn, 17) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(', ', $bad) : '') . "\n";
}
