<?php
// LeetCode 4, Median of Two Sorted Arrays: bốn cách, một bản sai chia nguyên, test và đối chiếu ngẫu nhiên.
// Chạy: php median-two-arrays.php
declare(strict_types=1);

// Cách 1, trộn rồi lấy giữa: O(m + n) thời gian, O(m + n) bộ nhớ.
function mergeThenPick(array $a, array $b): float
{
    $all = [];
    $i = $j = 0;
    while ($i < count($a) || $j < count($b)) {
        if ($j === count($b) || ($i < count($a) && $a[$i] <= $b[$j])) $all[] = $a[$i++];
        else $all[] = $b[$j++];
    }
    $t = count($all);
    return $t % 2 ? (float) $all[$t >> 1] : ($all[$t / 2 - 1] + $all[$t / 2]) / 2;
}

// Cách 2, hai con trỏ không trộn: chỉ nhớ hai giá trị gần nhất. O(m + n) thời gian, O(1) bộ nhớ.
function twoPointer(array $a, array $b): float
{
    $t = count($a) + count($b);
    $i = $j = $prev = $cur = 0;
    for ($k = 0; $k <= $t >> 1; $k++) {
        $prev = $cur;
        if ($j === count($b) || ($i < count($a) && $a[$i] <= $b[$j])) $cur = $a[$i++];
        else $cur = $b[$j++];
    }
    return $t % 2 ? (float) $cur : ($prev + $cur) / 2;
}

// Cách 3, loại bỏ để tìm phần tử thứ k (k đếm từ 1): mỗi bước bỏ k/2 phần tử chắc chắn đứng trước. O(log(m + n)).
function kth(array $a, array $b, int $k): int
{
    $i = $j = 0;
    while (true) {
        if ($i === count($a)) return $b[$j + $k - 1];
        if ($j === count($b)) return $a[$i + $k - 1];
        if ($k === 1) return min($a[$i], $b[$j]);
        $h = $k >> 1;
        $ni = min($i + $h, count($a)) - 1;
        $nj = min($j + $h, count($b)) - 1;
        if ($a[$ni] <= $b[$nj]) { $k -= $ni - $i + 1; $i = $ni + 1; } // a[i..ni] đều đứng trước phần tử thứ k: bỏ
        else { $k -= $nj - $j + 1; $j = $nj + 1; }
    }
}

function kthElimination(array $a, array $b): float
{
    $t = count($a) + count($b);
    return $t % 2 ? (float) kth($a, $b, ($t >> 1) + 1) : (kth($a, $b, intdiv($t, 2)) + kth($a, $b, intdiv($t, 2) + 1)) / 2;
}

// Cách 4, chia đôi vị trí cắt trên mảng ngắn hơn: O(log min(m, n)).
// Cắt a ở i và b ở j = half − i; cắt đúng khi aL ≤ bR và bL ≤ aR. Phần tử canh là PHP_INT_MIN / PHP_INT_MAX.
function partition(array $a, array $b): float
{
    if (count($a) > count($b)) [$a, $b] = [$b, $a]; // mảng PHP được chép khi gán: đổi chỗ không đụng tới mảng của người gọi
    $m = count($a);
    $n = count($b);
    $half = ($m + $n + 1) >> 1;
    $lo = 0;
    $hi = $m;
    while ($lo <= $hi) {
        $i = ($lo + $hi) >> 1;
        $j = $half - $i;
        $aL = $i > 0 ? $a[$i - 1] : PHP_INT_MIN;
        $aR = $i < $m ? $a[$i] : PHP_INT_MAX;
        $bL = $j > 0 ? $b[$j - 1] : PHP_INT_MIN;
        $bR = $j < $n ? $b[$j] : PHP_INT_MAX;
        if ($aL <= $bR && $bL <= $aR) {
            return ($m + $n) % 2 ? (float) max($aL, $bL) : (max($aL, $bL) + min($aR, $bR)) / 2; // / ra float khi tổng lẻ
        }
        if ($aL > $bR) $hi = $i - 1;
        else $lo = $i + 1;
    }
    throw new RuntimeException("mảng chưa sắp xếp");
}

// SAI: chia nguyên khi tổng chẵn: intdiv(-3, 2) = -1, mất phần .5.
function partitionIntMedian(array $a, array $b): float
{
    if (count($a) > count($b)) [$a, $b] = [$b, $a];
    $m = count($a);
    $n = count($b);
    $half = ($m + $n + 1) >> 1;
    $lo = 0;
    $hi = $m;
    while ($lo <= $hi) {
        $i = ($lo + $hi) >> 1;
        $j = $half - $i;
        $aL = $i > 0 ? $a[$i - 1] : PHP_INT_MIN;
        $aR = $i < $m ? $a[$i] : PHP_INT_MAX;
        $bL = $j > 0 ? $b[$j - 1] : PHP_INT_MIN;
        $bR = $j < $n ? $b[$j] : PHP_INT_MAX;
        if ($aL <= $bR && $bL <= $aR) return ($m + $n) % 2 ? (float) max($aL, $bL) : (float) intdiv(max($aL, $bL) + min($aR, $bR), 2);
        if ($aL > $bR) $hi = $i - 1;
        else $lo = $i + 1;
    }
    throw new RuntimeException("không tìm được vị trí cắt");
}

$cases = [
    [[1, 3], [2], 2], [[1, 2], [3, 4], 2.5], [[], [1], 1], [[2], [], 2], [[], [2, 3], 2.5],
    [[-5, -3, -1], [-4, -2], -3], [[1, 1, 1], [1, 1], 1], [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11], 6],
    [[1, 2, 3, 4, 5, 6], [7], 4], [[-2, -1], [3], -1],
];
$fns = ['mergeThenPick', 'twoPointer', 'kthElimination', 'partition', 'partitionIntMedian'];
foreach ($fns as $fn) {
    $bad = [];
    foreach ($cases as [$a, $b, $want]) {
        $got = $fn($a, $b);
        if ($got !== (float) $want) $bad[] = json_encode($a) . " " . json_encode($b) . " → $got";
    }
    echo str_pad($fn, 21) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}

// Đối chiếu ngẫu nhiên với nối rồi sort: 10⁵ cặp, mỗi mảng 0..20 phần tử, giá trị trong [-50, 50].
function bruteForce(array $a, array $b): float
{
    $all = array_merge($a, $b);
    sort($all); // sort() của PHP so số với số đúng kiểu, không như sort() mặc định của JS
    $t = count($all);
    return $t % 2 ? (float) $all[$t >> 1] : ($all[$t / 2 - 1] + $all[$t / 2]) / 2;
}
mt_srand(42);
$sortedRandom = function (int $len): array {
    $r = [];
    for ($i = 0; $i < $len; $i++) $r[] = mt_rand(-50, 50);
    sort($r);
    return $r;
};
$wrong = array_fill_keys($fns, 0);
$PAIRS = 100_000;
for ($p = 0; $p < $PAIRS; $p++) {
    $a = $sortedRandom(mt_rand(0, 20));
    $b = $sortedRandom(mt_rand(0, 20));
    if (count($a) + count($b) === 0) $a = [0];
    $want = bruteForce($a, $b);
    foreach ($fns as $fn) if ($fn($a, $b) !== $want) $wrong[$fn]++;
}
echo "\nĐối chiếu với nối rồi sort, $PAIRS cặp ngẫu nhiên:\n";
foreach ($wrong as $name => $w) echo str_pad($name, 21) . " sai $w cặp\n";
echo "\nintdiv(-3, 2) = " . intdiv(-3, 2) . "   -3 / 2 = " . (-3 / 2) . "   intdiv(3, 2) = " . intdiv(3, 2) . "   3 / 2 = " . (3 / 2) . "\n";
