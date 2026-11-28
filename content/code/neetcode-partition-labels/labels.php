<?php
// Partition Labels (LeetCode 763): vét cạn từng vết cắt, gộp khoảng [đầu, cuối], tham lam một lượt
// Chạy: php -d xdebug.mode=off labels.php

$steps = 0;

// Vét cạn: vết cắt sau vị trí i an toàn khi không chữ nào nằm ở cả hai bên
function partitionBrute(string $s): array {
    global $steps;
    $n = strlen($s);
    $sizes = [];
    $prev = -1; // vết cắt an toàn gần nhất
    for ($i = 0; $i < $n; $i++) {
        $left = array_fill(0, 26, false);
        $right = array_fill(0, 26, false);
        for ($j = 0; $j <= $i; $j++) $left[ord($s[$j]) - 97] = true;
        for ($j = $i + 1; $j < $n; $j++) $right[ord($s[$j]) - 97] = true;
        $steps += $n;
        $safe = true;
        for ($c = 0; $c < 26; $c++) if ($left[$c] && $right[$c]) $safe = false;
        if ($safe) {
            $sizes[] = $i - $prev; // cắt ở mọi chỗ an toàn
            $prev = $i;
        }
    }
    return $sizes;
}

// Gộp khoảng: mỗi chữ là một khoảng [lần đầu, lần cuối]; khoảng chồng nhau phải chung một phần
function partitionIntervals(string $s): array {
    $first = array_fill(0, 26, -1);
    $last = array_fill(0, 26, -1);
    $n = strlen($s);
    for ($i = 0; $i < $n; $i++) {
        $c = ord($s[$i]) - 97;
        if ($first[$c] === -1) $first[$c] = $i;
        $last[$c] = $i;
    }
    $spans = [];
    for ($c = 0; $c < 26; $c++) if ($first[$c] !== -1) $spans[] = [$first[$c], $last[$c]];
    usort($spans, fn($a, $b) => $a[0] <=> $b[0]);
    $sizes = [];
    [$lo, $hi] = $spans[0];
    for ($k = 1; $k < count($spans); $k++) {
        [$a, $b] = $spans[$k];
        if ($a > $hi) {
            $sizes[] = $hi - $lo + 1; // khoảng mới không chạm khoảng đang gộp: chốt một phần
            [$lo, $hi] = [$a, $b];
        } else $hi = max($hi, $b);
    }
    $sizes[] = $hi - $lo + 1;
    return $sizes;
}

// Cách chính: bảng lần xuất hiện cuối, kéo end tới lần cuối xa nhất, cắt khi i chạm end
function partitionLabels(string $s): array {
    global $steps;
    $n = strlen($s);
    $last = array_fill(0, 26, 0);
    for ($i = 0; $i < $n; $i++) {
        $last[ord($s[$i]) - 97] = $i;
        $steps++;
    }
    $sizes = [];
    $start = 0;
    $end = 0; // phần hiện tại phải kéo ít nhất tới đây
    for ($i = 0; $i < $n; $i++) {
        $end = max($end, $last[ord($s[$i]) - 97]);
        $steps++;
        if ($i === $end) {
            $sizes[] = $end - $start + 1; // mọi chữ trong phần đã hết: cắt sớm nhất có thể
            $start = $i + 1;
        }
    }
    return $sizes;
}

// Bản sai: cắt khi chữ hiện tại hết, quên các chữ khác trong phần
function partitionNoMax(string $s): array {
    $n = strlen($s);
    $last = array_fill(0, 26, 0);
    for ($i = 0; $i < $n; $i++) $last[ord($s[$i]) - 97] = $i;
    $sizes = [];
    $start = 0;
    for ($i = 0; $i < $n; $i++) {
        if ($last[ord($s[$i]) - 97] === $i) {
            $sizes[] = $i - $start + 1;
            $start = $i + 1;
        }
    }
    return $sizes;
}

$cases = [
    ['a', [1]],
    ['abc', [1, 1, 1]],
    ['aaaa', [4]],
    ['abca', [4]],
    ['abbacdc', [4, 3]],
    ['xyzzyxw', [6, 1]],
    ['aabbccab', [8]],
    ['qwqeer', [3, 2, 1]],
];
$ok = 0;
foreach ($cases as [$s, $want]) {
    $got = [partitionBrute($s), partitionIntervals($s), partitionLabels($s)];
    if ($got[0] === $want && $got[1] === $want && $got[2] === $want) $ok++;
    else echo "sai ở $s ", json_encode($got), "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi chuỗi dài 1–7 trên bảng chữ {a, b, c}
$total = 0;
$good = 0;
$wrong = 0;
function walk(string $s): void {
    global $total, $good, $wrong;
    if ($s !== '') {
        $total++;
        $b = partitionBrute($s);
        if ($b === partitionIntervals($s) && $b === partitionLabels($s)) $good++;
        if ($b !== partitionNoMax($s)) $wrong++;
    }
    if (strlen($s) === 7) return;
    foreach (['a', 'b', 'c'] as $ch) walk($s . $ch);
}
walk('');
echo "$good/$total ca đúng (đối chiếu vét cạn)\n";
echo "Cắt khi chữ hiện tại hết (bỏ max): sai $wrong/$total ca\n";

// Đo: n = 10000, 5 khối 2000 ký tự, khối k chỉ dùng 5 chữ của riêng nó
$n = 10000;
$big = '';
for ($i = 0; $i < $n; $i++) $big .= chr(97 + 5 * intdiv($i, 2000) + ($i * 3) % 5);
$steps = 0;
$t0 = hrtime(true);
$b = partitionBrute($big);
$bruteMs = (hrtime(true) - $t0) / 1e6;
$bs = $steps;
$steps = 0;
$t0 = hrtime(true);
$g = partitionLabels($big);
$greedyMs = (hrtime(true) - $t0) / 1e6;
printf("n = %d, %d phần (%s): vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)\n",
    $n, count($g), $b === $g ? 'khớp' : 'lệch', $bs, $bruteMs, $steps, $greedyMs);
