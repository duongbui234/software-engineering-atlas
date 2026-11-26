<?php
// LeetCode 3, Longest Substring Without Repeating Characters: ba cách, một bản sai, test.
// Chạy: php longest-substring.php
declare(strict_types=1);

// Cách 1, vét cạn: từ mỗi vị trí đầu i, kéo dài tới khi gặp ký tự lặp.
function bruteForce(string $s): int {
    $best = 0;
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        $seen = [];
        for ($j = $i; $j < $n && !isset($seen[$s[$j]]); $j++) $seen[$s[$j]] = true;
        $best = max($best, count($seen));
    }
    return $best;
}

// Cách 2, cửa sổ trượt với tập: thêm s[right]; nếu trùng thì bỏ dần từ bên trái tới khi hết trùng.
function windowSet(string $s): int {
    $inWindow = [];
    $left = 0;
    $best = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        while (isset($inWindow[$s[$right]])) unset($inWindow[$s[$left++]]); // mỗi ký tự bị xóa tối đa một lần
        $inWindow[$s[$right]] = true;
        $best = max($best, $right - $left + 1);
    }
    return $best;
}

// Cách 3, cửa sổ trượt với vị trí gặp gần nhất: nhảy left thẳng qua ký tự trùng.
function windowLastSeen(string $s): int {
    $last = [];
    $left = 0;
    $best = 0;
    for ($right = 0; $right < strlen($s); $right++) { // $s[$right] là một BYTE, không phải một ký tự
        $prev = $last[$s[$right]] ?? -1;
        if ($prev >= $left) $left = $prev + 1; // chỉ nhảy khi lần gặp trước nằm TRONG cửa sổ
        $last[$s[$right]] = $right;
        $best = max($best, $right - $left + 1);
    }
    return $best;
}

// SAI: nhảy left mà không kiểm tra lần gặp trước còn trong cửa sổ không, nên left có thể lùi lại.
function windowJumpBack(string $s): int {
    $last = [];
    $left = 0;
    $best = 0;
    for ($right = 0; $right < strlen($s); $right++) {
        if (isset($last[$s[$right]])) $left = $last[$s[$right]] + 1; // "abba": tới chữ a cuối, left lùi từ 2 về 1
        $last[$s[$right]] = $right;
        $best = max($best, $right - $left + 1);
    }
    return $best;
}

$cases = [["abcabcbb", 3], ["bbbbb", 1], ["pwwkew", 3], ["", 0], [" ", 1], ["abba", 2], ["dvdf", 3], ["tmmzuxt", 5]];
foreach (['bruteForce', 'windowSet', 'windowLastSeen', 'windowJumpBack'] as $fn) {
    $bad = [];
    foreach ($cases as [$s, $want]) {
        $got = $fn($s);
        if ($got !== $want) $bad[] = json_encode($s) . " → $got";
    }
    echo str_pad($fn, 15) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
echo "\nstrlen(\"a😀😀\") = " . strlen("a😀😀") . "; windowLastSeen(\"a😀😀\") = " . windowLastSeen("a😀😀") . " (đúng phải là 2)\n";
