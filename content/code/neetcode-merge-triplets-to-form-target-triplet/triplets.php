<?php
// Merge Triplets to Form Target Triplet (LeetCode 1899): vét cạn mọi tập con, lọc bộ an toàn, max của bộ an toàn
// Chạy: php triplets.php

$steps = 0;

// Vét cạn: thử mọi tập con khác rỗng, gộp bằng max từng thành phần, xem có ra đúng target không
function mergeTripletsBrute(array $triplets, array $target): bool {
    global $steps;
    $n = count($triplets);
    for ($mask = 1; $mask < 1 << $n; $mask++) {
        $a = $b = $c = 0;
        for ($i = 0; $i < $n; $i++) {
            $steps++;
            if (($mask >> $i) & 1) {
                $t = $triplets[$i];
                $a = max($a, $t[0]);
                $b = max($b, $t[1]);
                $c = max($c, $t[2]);
            }
        }
        if ($a === $target[0] && $b === $target[1] && $c === $target[2]) return true;
    }
    return false;
}

// Cách chính: bỏ mọi bộ có thành phần vượt target, trong số còn lại đánh dấu thành phần nào khớp đúng
function mergeTriplets(array $triplets, array $target): bool {
    global $steps;
    [$x, $y, $z] = $target;
    $found = [false, false, false];
    foreach ($triplets as $t) {
        $steps++;
        if ($t[0] > $x || $t[1] > $y || $t[2] > $z) continue; // bộ không an toàn: gộp vào là vượt, không gỡ được
        for ($k = 0; $k < 3; $k++) {
            if ($t[$k] === $target[$k]) $found[$k] = true; // bộ an toàn này mang đúng giá trị cần ở vị trí k
        }
    }
    return $found[0] && $found[1] && $found[2];
}

// Cách tương đương: gộp hết mọi bộ an toàn bằng max, so với target
function mergeTripletsMax(array $triplets, array $target): bool {
    $m = [0, 0, 0];
    foreach ($triplets as $t) {
        if ($t[0] > $target[0] || $t[1] > $target[1] || $t[2] > $target[2]) continue;
        for ($k = 0; $k < 3; $k++) $m[$k] = max($m[$k], $t[$k]);
    }
    return $m === array_values($target);
}

// Bản sai: không lọc, thấy thành phần nào bằng target là đánh dấu
function mergeTripletsNoFilter(array $triplets, array $target): bool {
    $found = [false, false, false];
    foreach ($triplets as $t) {
        for ($k = 0; $k < 3; $k++) if ($t[$k] === $target[$k]) $found[$k] = true;
    }
    return $found[0] && $found[1] && $found[2];
}

$cases = [
    [[[1, 2, 3]], [1, 2, 3], true],
    [[[2, 9, 5], [1, 7, 1]], [2, 7, 5], false],
    [[[3, 1, 1], [1, 4, 1], [1, 1, 6]], [3, 4, 6], true],
    [[[3, 4, 6], [5, 1, 1]], [3, 4, 6], true],
    [[[1, 1, 1], [2, 2, 2]], [3, 3, 3], false],
    [[[4, 2, 1], [1, 2, 4], [4, 4, 4]], [4, 2, 4], true],
    [[[2, 3, 4], [2, 3, 4]], [2, 3, 5], false],
];
$ok = 0;
foreach ($cases as [$triplets, $target, $want]) {
    $got = [mergeTripletsBrute($triplets, $target), mergeTriplets($triplets, $target), mergeTripletsMax($triplets, $target)];
    if ($got[0] === $want && $got[1] === $want && $got[2] === $want) $ok++;
    else echo "sai ở " . json_encode($triplets) . " " . json_encode($target) . " " . json_encode($got) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi danh sách 1–4 bộ, mỗi thành phần trong {1, 2, 3}, target [2, 2, 2]
$values = [];
for ($a = 1; $a <= 3; $a++) for ($b = 1; $b <= 3; $b++) for ($c = 1; $c <= 3; $c++) $values[] = [$a, $b, $c];
$total = $good = $wrong = 0;
function build(array &$list, array $values, int &$total, int &$good, int &$wrong): void {
    $target = [2, 2, 2];
    if (count($list) > 0) {
        $total++;
        $b = mergeTripletsBrute($list, $target);
        if (mergeTriplets($list, $target) === $b && mergeTripletsMax($list, $target) === $b) $good++;
        if (mergeTripletsNoFilter($list, $target) !== $b) $wrong++;
    }
    if (count($list) === 4) return;
    foreach ($values as $v) {
        $list[] = $v;
        build($list, $values, $total, $good, $wrong);
        array_pop($list);
    }
}
$list = [];
build($list, $values, $total, $good, $wrong);
echo "$good/$total ca đúng (đối chiếu vét cạn)\n";
echo "Bỏ bước lọc: sai $wrong/$total ca\n";

// Đo 1: n = 18, mọi bộ an toàn nhưng không bộ nào có z = 1000, nên vét cạn phải thử hết 2^18 - 1 tập con
$small = [];
for ($i = 0; $i < 18; $i++) $small[] = [$i === 0 ? 1000 : $i + 1, $i === 1 ? 1000 : $i + 1, $i + 1];
$big = [1000, 1000, 1000];
$steps = 0;
$t0 = hrtime(true);
$rb = mergeTripletsBrute($small, $big);
$bruteMs = (hrtime(true) - $t0) / 1e6;
$bs = $steps;
$steps = 0;
$t0 = hrtime(true);
$rg = mergeTriplets($small, $big);
$greedyMs = (hrtime(true) - $t0) / 1e6;
$gs = $steps;
printf("n = 18, đáp án %s/%s: vét cạn %d bước (%.1f ms), tham lam %d bước (%.3f ms)\n", var_export($rb, true), var_export($rg, true), $bs, $bruteMs, $gs, $greedyMs);

// Đo 2: n = 100000 (giới hạn của đề), bộ thứ i = [(7i mod 1000) + 1, (13i mod 1000) + 1, (31i mod 1000) + 1]
$full = [];
for ($i = 0; $i < 100000; $i++) $full[] = [(7 * $i) % 1000 + 1, (13 * $i) % 1000 + 1, (31 * $i) % 1000 + 1];
$goal = [700, 800, 900];
$steps = 0;
$t0 = hrtime(true);
$rf = mergeTriplets($full, $goal);
$fullMs = (hrtime(true) - $t0) / 1e6;
printf("n = 100000, đáp án %s: tham lam %d bước (%.2f ms)\n", var_export($rf, true), $steps, $fullMs);
