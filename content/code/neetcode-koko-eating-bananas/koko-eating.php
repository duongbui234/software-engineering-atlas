<?php
// LeetCode 875, Koko Eating Bananas: thử tốc độ lần lượt, tìm nhị phân trên đáp án và ba bản sai.
// Chạy: php koko-eating.php
declare(strict_types=1);

// Số giờ để ăn hết với tốc độ k: mỗi đống mất ⌈p / k⌉ giờ. intdiv giữ mọi thứ là int.
function hoursNeeded(array $piles, int $k): int
{
    $hours = 0;
    foreach ($piles as $p) $hours += intdiv($p + $k - 1, $k); // int PHP 64 bit: tổng tới 10¹³ không tràn
    return $hours;
}

// Thử k = 1, 2, 3… tới tốc độ đầu tiên kịp giờ. Đúng, nhưng O(max(piles) · n).
function linearScan(array $piles, int $h): int
{
    $k = 1;
    while (hoursNeeded($piles, $k) > $h) $k++;
    return $k;
}

// Tìm nhị phân trên đáp án. Bất biến: hi luôn kịp; mọi tốc độ nhỏ hơn lo đều không kịp.
function minEatingSpeed(array $piles, int $h): int
{
    $lo = 1;
    $hi = max($piles); // tốc độ max(piles) ăn mỗi đống trong 1 giờ, luôn kịp vì h >= n
    while ($lo < $hi) {
        $mid = $lo + intdiv($hi - $lo, 2);
        if (hoursNeeded($piles, $mid) <= $h) $hi = $mid; // mid kịp: có thể chính là đáp án, giữ lại
        else $lo = $mid + 1;
    }
    return $lo;
}

// SAI 1: chia làm tròn xuống, nên tốc độ quá chậm cũng "kịp".
function wrongFloorDiv(array $piles, int $h): int
{
    $lo = 1;
    $hi = max($piles);
    while ($lo < $hi) {
        $mid = $lo + intdiv($hi - $lo, 2);
        $hours = 0;
        foreach ($piles as $p) $hours += intdiv($p, $mid);
        if ($hours <= $h) $hi = $mid;
        else $lo = $mid + 1;
    }
    return $lo;
}

// SAI 2: mid kịp thì gán hi = mid - 1, bỏ luôn ô có thể là đáp án.
function wrongDropMid(array $piles, int $h): int
{
    $lo = 1;
    $hi = max($piles);
    while ($lo < $hi) {
        $mid = $lo + intdiv($hi - $lo, 2);
        if (hoursNeeded($piles, $mid) <= $h) $hi = $mid - 1;
        else $lo = $mid + 1;
    }
    return $lo;
}

// SAI 3: lo = 0. Khi khoảng còn [0, 1], mid = 0 và intdiv(p, 0) ném DivisionByZeroError (khác JS, nơi p / 0 = Infinity).
function loFromZero(array $piles, int $h): int
{
    $lo = 0;
    $hi = max($piles);
    while ($lo < $hi) {
        $mid = $lo + intdiv($hi - $lo, 2);
        if (hoursNeeded($piles, $mid) <= $h) $hi = $mid;
        else $lo = $mid + 1;
    }
    return $lo;
}

$cases = [
    [[3, 6, 7, 11], 8, 4], [[30, 11, 23, 4, 20], 5, 30], [[30, 11, 23, 4, 20], 6, 23],
    [[1], 1, 1], [[1, 1], 5, 1], [[1000000000], 2, 500000000], [[312884470], 312884469, 2],
    [[805306368, 805306368, 805306368], 1000000000, 3], [[2, 2], 2, 2], [[7], 3, 3],
];
foreach (['linearScan', 'minEatingSpeed', 'wrongFloorDiv', 'wrongDropMid', 'loFromZero'] as $fn) {
    $bad = [];
    $n = 0;
    foreach ($cases as [$piles, $h, $want]) {
        if ($fn === 'linearScan' && $want > 1000) continue; // thử từng tốc độ tới 5·10⁸ thì quá lâu
        $n++;
        try { $got = $fn($piles, $h); } catch (DivisionByZeroError $e) { $got = 'DivisionByZeroError'; }
        if ($got !== $want) $bad[] = json_encode($piles) . " h=$h → $got";
    }
    echo str_pad($fn, 15) . " " . ($n - count($bad)) . "/$n ca đúng" . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}

// Kiểm ngẫu nhiên: so tìm nhị phân với thử lần lượt trên 2 000 bộ nhỏ.
mt_srand(7);
$agree = 0;
for ($t = 0; $t < 2000; $t++) {
    $n = mt_rand(1, 8);
    $piles = [];
    for ($i = 0; $i < $n; $i++) $piles[] = mt_rand(1, 50);
    $h = $n + mt_rand(0, 39);
    if (minEatingSpeed($piles, $h) === linearScan($piles, $h)) $agree++;
}
echo "\nngẫu nhiên: tìm nhị phân khớp thử lần lượt ở $agree/2000 bộ\n";
