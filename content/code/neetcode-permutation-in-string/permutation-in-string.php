<?php
// LeetCode 567, Permutation in String: ba cách, hai bản "sai" của các ngôn ngữ khác, test.
// Chạy: php permutation-in-string.php
declare(strict_types=1);

function at(string $s, int $i): int { return ord($s[$i]) - 97; } // đề chỉ có chữ thường a–z

// Cách 1: mọi cửa sổ dài m, sắp xếp rồi so với s1 đã sắp xếp. O(n · m log m).
function sortEachWindow(string $s1, string $s2): bool {
    $sorted = function (string $x): string { $a = str_split($x); sort($a); return implode('', $a); };
    $key = $sorted($s1);
    for ($i = 0; $i + strlen($s1) <= strlen($s2); $i++) {
        if ($sorted(substr($s2, $i, strlen($s1))) === $key) return true;
    }
    return false;
}

// Cách 2: cửa sổ cố định dài m, trượt bảng đếm 26 ô, so cả 26 ô mỗi bước. O(26 · n).
function slideCompare26(string $s1, string $s2): bool {
    $m = strlen($s1);
    if ($m > strlen($s2)) return false;
    $need = array_fill(0, 26, 0);
    $have = array_fill(0, 26, 0);
    for ($i = 0; $i < $m; $i++) { $need[at($s1, $i)]++; $have[at($s2, $i)]++; }
    if ($need === $have) return true; // mảng PHP so theo GIÁ TRỊ: cùng khóa, cùng giá trị, cùng thứ tự
    for ($r = $m; $r < strlen($s2); $r++) {
        $have[at($s2, $r)]++;      // ký tự vào bên phải
        $have[at($s2, $r - $m)]--; // ký tự ra bên trái
        if ($need === $have) return true;
    }
    return false;
}

// Cách 3: đếm số chữ cái đang khớp (0..26). Mỗi bước chỉ hai ô đổi, nên chỉ cập nhật hai ô đó. O(n).
function matchesCounter(string $s1, string $s2): bool {
    $m = strlen($s1);
    if ($m > strlen($s2)) return false;
    $diff = array_fill(0, 26, 0); // diff[c] = số lần c trong cửa sổ − số lần c trong s1
    for ($i = 0; $i < $m; $i++) { $diff[at($s1, $i)]--; $diff[at($s2, $i)]++; }
    $matches = count(array_filter($diff, fn($d) => $d === 0));
    // closure PHP chép biến vào lúc tạo: phải "use (&...)" thì mới sửa được diff và matches bên ngoài
    $bump = function (int $c, int $delta) use (&$diff, &$matches): void {
        if ($diff[$c] === 0) $matches--; // ô đang khớp sắp lệch
        $diff[$c] += $delta;
        if ($diff[$c] === 0) $matches++; // ô vừa khớp lại
    };
    for ($r = $m; $r < strlen($s2) && $matches < 26; $r++) {
        $bump(at($s2, $r), 1);
        $bump(at($s2, $r - $m), -1);
    }
    return $matches === 26;
}

// SAI: so tập ký tự, bỏ qua số lần xuất hiện.
function wrongSetOnly(string $s1, string $s2): bool {
    $want = array_unique(str_split($s1));
    sort($want);
    for ($i = 0; $i + strlen($s1) <= strlen($s2); $i++) {
        $got = array_unique(str_split(substr($s2, $i, strlen($s1))));
        sort($got);
        if ($got === $want) return true;
    }
    return false;
}

// Bản "so mảng bằng ===" sai trong JS và Java (so tham chiếu). Ở PHP, === trên mảng so giá trị nên nó ĐÚNG.
function arrayIdentical(string $s1, string $s2): bool {
    return slideCompare26($s1, $s2);
}

// Bản closure quên "&": bump sửa bản sao của diff và matches, nên matches không bao giờ đổi.
function wrongClosureByValue(string $s1, string $s2): bool {
    $m = strlen($s1);
    if ($m > strlen($s2)) return false;
    $diff = array_fill(0, 26, 0);
    for ($i = 0; $i < $m; $i++) { $diff[at($s1, $i)]--; $diff[at($s2, $i)]++; }
    $matches = count(array_filter($diff, fn($d) => $d === 0));
    $bump = function (int $c, int $delta) use ($diff, $matches): void {
        if ($diff[$c] === 0) $matches--;
        $diff[$c] += $delta;
        if ($diff[$c] === 0) $matches++;
    };
    for ($r = $m; $r < strlen($s2) && $matches < 26; $r++) {
        $bump(at($s2, $r), 1);
        $bump(at($s2, $r - $m), -1);
    }
    return $matches === 26;
}

$cases = [
    ["ab", "eidbaooo", true], ["ab", "eidboaoo", false], ["adc", "dcda", true], ["abc", "ab", false],
    ["a", "a", true], ["aab", "abbab", false], ["aab", "xxbaa", true], ["hello", "ooolleoooleh", false],
];
foreach (['sortEachWindow', 'slideCompare26', 'matchesCounter', 'wrongSetOnly', 'arrayIdentical', 'wrongClosureByValue'] as $fn) {
    $bad = [];
    foreach ($cases as [$a, $b, $want]) if ($fn($a, $b) !== $want) $bad[] = "($a, $b)";
    echo str_pad($fn, 19) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
