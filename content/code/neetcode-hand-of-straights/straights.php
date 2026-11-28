<?php
// Hand of Straights (LeetCode 846, trùng với 1296): trọng tài thử mọi nhóm, lá nhỏ nhất theo từng lá, theo từng giá trị, hàng nhóm đang mở
// Chạy: php -d xdebug.mode=off straights.php

$steps = 0;

function countOf(array $hand): array {
    $count = [];
    foreach ($hand as $x) $count[$x] = ($count[$x] ?? 0) + 1;
    return $count;
}

// Trọng tài: lấy một lá còn lại bất kỳ (không nhất thiết nhỏ nhất), thử mọi nhóm k lá liên tiếp chứa nó
function isStraightBrute(array $hand, int $k): bool {
    $count = countOf($hand);
    return goFrom($hand, $k, $count, 0);
}

function goFrom(array $hand, int $k, array &$count, int $idx): bool {
    $n = count($hand);
    while ($idx < $n && $count[$hand[$idx]] === 0) $idx++;
    if ($idx === $n) return true; // mọi lá đã vào nhóm
    $x = $hand[$idx];
    for ($s = $x - $k + 1; $s <= $x; $s++) {
        $ok = true;
        for ($v = $s; $v < $s + $k; $v++) {
            if (($count[$v] ?? 0) === 0) {
                $ok = false;
                break;
            }
        }
        if (!$ok) continue;
        for ($v = $s; $v < $s + $k; $v++) $count[$v]--;
        if (goFrom($hand, $k, $count, $idx)) return true;
        for ($v = $s; $v < $s + $k; $v++) $count[$v]++;
    }
    return false;
}

// Cách 1, theo từng lá: duyệt lá đã sắp xếp, lá nào còn thì nó là lá nhỏ nhất còn lại và phải mở nhóm x..x+k-1
function isNStraightHand(array $hand, int $k): bool {
    global $steps;
    if (count($hand) % $k !== 0) return false; // dừng sớm: không chia đều được
    $count = countOf($hand);
    $sorted = $hand; // mảng PHP truyền theo giá trị, sort() chỉ đổi bản sao
    sort($sorted);
    foreach ($sorted as $x) {
        if ($count[$x] === 0) continue; // lá này đã nằm trong một nhóm trước
        for ($v = $x; $v < $x + $k; $v++) {
            $steps++;
            $c = $count[$v] ?? 0;
            if ($c === 0) return false; // thiếu lá v để nối nhóm
            $count[$v] = $c - 1;
        }
    }
    return true;
}

// Cách 2, theo từng giá trị: c lá x cùng mở c nhóm, trừ c khỏi x..x+k-1 trong một lần
function isNStraightByValue(array $hand, int $k): bool {
    global $steps;
    if (count($hand) % $k !== 0) return false;
    $count = countOf($hand);
    $keys = array_keys($count);
    sort($keys); // chỉ sắp các giá trị khác nhau
    foreach ($keys as $x) {
        $c = $count[$x];
        if ($c === 0) continue;
        for ($v = $x; $v < $x + $k; $v++) {
            $steps++;
            $have = $count[$v] ?? 0;
            if ($have < $c) return false; // không đủ lá v cho c nhóm
            $count[$v] = $have - $c;
        }
    }
    return true;
}

// Cách 3, hàng nhóm đang mở: nhớ số nhóm mở ở mỗi giá trị, nhóm mở từ k giá trị trước thì đóng
function isNStraightOpen(array $hand, int $k): bool {
    if (count($hand) % $k !== 0) return false;
    $count = countOf($hand);
    ksort($count);
    $started = []; // số nhóm mới mở tại từng giá trị, theo thứ tự
    $head = 0;
    $open = 0; // số nhóm đang chờ lá kế tiếp
    $prev = 0;
    foreach ($count as $x => $c) {
        if ($open > 0 && $x !== $prev + 1) return false; // nhóm đang mở cần prev+1 mà không có
        if ($c < $open) return false; // không đủ lá x để nối mọi nhóm đang mở
        $started[] = $c - $open; // phần dư mở nhóm mới tại x
        $open = $c;
        if (count($started) - $head === $k) $open -= $started[$head++]; // nhóm mở từ x-k+1 vừa đủ k lá
        $prev = $x;
    }
    return $open === 0;
}

// Bản sai: bỏ bước sắp xếp, mở nhóm tại lá theo thứ tự đề cho
function isNStraightNoSort(array $hand, int $k): bool {
    if (count($hand) % $k !== 0) return false;
    $count = countOf($hand);
    foreach ($hand as $x) {
        if ($count[$x] === 0) continue;
        for ($v = $x; $v < $x + $k; $v++) {
            $c = $count[$v] ?? 0;
            if ($c === 0) return false;
            $count[$v] = $c - 1;
        }
    }
    return true;
}

$cases = [
    [[5, 1, 3, 2, 4, 6], 3, true],
    [[1, 1, 2, 2, 3, 3], 3, true],
    [[3, 2, 2, 1, 4, 3], 3, true],
    [[1, 2, 4, 5, 6, 7], 3, false],
    [[7, 8, 9, 10], 3, false],
    [[4], 1, true],
    [[3, 3, 4, 4, 5, 6], 3, false],
    [[12, 10, 11, 13, 11, 12], 3, true],
    [[1000000000, 999999998, 999999999], 3, true],
    [[0, 1, 2, 3], 2, true],
];
$ok = 0;
foreach ($cases as [$hand, $k, $want]) {
    $got = [isStraightBrute($hand, $k), isNStraightHand($hand, $k), isNStraightByValue($hand, $k), isNStraightOpen($hand, $k)];
    if (count(array_filter($got, fn($g) => $g === $want)) === 4) $ok++;
    else echo "sai ở ", json_encode($hand), " $k ", json_encode($got), "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi tay bài với giá trị 0..4, mỗi giá trị 0..3 lá, k = 1..5; lá xếp tăng rồi xoay nửa sau lên trước
$total = 0;
$good = 0;
$wrong = 0;
for ($mask = 1; $mask < 1024; $mask++) {
    $sorted = [];
    $m = $mask;
    for ($v = 0; $v < 5; $v++) {
        for ($r = 0; $r < $m % 4; $r++) $sorted[] = $v;
        $m = intdiv($m, 4);
    }
    $half = intdiv(count($sorted), 2);
    $hand = array_merge(array_slice($sorted, $half), array_slice($sorted, 0, $half));
    for ($k = 1; $k <= 5; $k++) {
        $total++;
        $want = isStraightBrute($hand, $k);
        if (isNStraightHand($hand, $k) === $want && isNStraightByValue($hand, $k) === $want && isNStraightOpen($hand, $k) === $want) $good++;
        if (isNStraightNoSort($hand, $k) !== $want) $wrong++;
    }
}
echo "$good/$total ca đúng (đối chiếu trọng tài)\n";
echo "Bỏ sắp xếp: sai $wrong/$total ca\n";

// Đo: n = 200000 lá, 1000 giá trị mỗi giá trị 200 lá, xáo bằng (i * 7919) % 1000, k = 10
$n = 200000;
$big = [];
for ($i = 0; $i < $n; $i++) $big[] = ($i * 7919) % 1000;
$kBig = 10;
$steps = 0;
$t0 = hrtime(true);
$a = isNStraightHand($big, $kBig);
$cardMs = (hrtime(true) - $t0) / 1e6;
$cardSteps = $steps;
$steps = 0;
$t0 = hrtime(true);
$b = isNStraightByValue($big, $kBig);
$valueMs = (hrtime(true) - $t0) / 1e6;
printf("n = %d, k = %d, kết quả %s/%s: theo từng lá %d bước (%.1f ms), theo từng giá trị %d bước (%.1f ms)\n", $n, $kBig, $a ? 'true' : 'false', $b ? 'true' : 'false', $cardSteps, $cardMs, $steps, $valueMs);
