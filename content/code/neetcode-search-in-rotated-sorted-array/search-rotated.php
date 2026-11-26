<?php
// LeetCode 33, Search in Rotated Sorted Array: ba cách, một bản sai, kiểm toàn bộ ca nhỏ và bản có số trùng (81).
// Chạy: php search-rotated.php
declare(strict_types=1);

function linearScan(array $nums, int $target): int
{
    $i = array_search($target, $nums, true); // O(n); không thấy thì trả false, không phải -1
    return $i === false ? -1 : $i;
}

// Cách một lượt: ở mỗi bước, ít nhất một nửa [lo, mid] hoặc [mid, hi] đã sắp xếp. Hỏi target có nằm trong nửa đó không.
function onePass(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo <= $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$lo] <= $nums[$mid]) { // nửa trái tăng dần (dấu = cần cho ca lo == mid)
            if ($nums[$lo] <= $target && $target < $nums[$mid]) $hi = $mid - 1;
            else $lo = $mid + 1;
        } else { // nửa phải tăng dần
            if ($nums[$mid] < $target && $target <= $nums[$hi]) $lo = $mid + 1;
            else $hi = $mid - 1;
        }
    }
    return -1;
}

// Cách hai lượt: tìm điểm gãy (chỉ số của min, như bài 153), rồi chia đôi thường trên nửa chứa target.
function pivotThenSearch(array $nums, int $target): int
{
    $n = count($nums);
    $lo = 0;
    $hi = $n - 1;
    while ($lo < $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] > $nums[$hi]) $lo = $mid + 1;
        else $hi = $mid;
    }
    $pivot = $lo; // nums[pivot..] và nums[..pivot-1] đều tăng dần
    [$a, $b] = $target >= $nums[$pivot] && $target <= $nums[$n - 1] ? [$pivot, $n - 1] : [0, $pivot - 1];
    return binarySearch($nums, $target, $a, $b);
}

function binarySearch(array $nums, int $target, int $lo, int $hi): int
{
    while ($lo <= $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$mid] < $target) $lo = $mid + 1;
        else $hi = $mid - 1;
    }
    return -1;
}

// SAI: dùng < thay cho <= khi kiểm nửa trái. Khi lo == mid (còn hai phần tử), nó tưởng nửa phải đã sắp xếp.
function wrongStrict(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    while ($lo <= $hi) {
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $mid;
        if ($nums[$lo] < $nums[$mid]) {
            if ($nums[$lo] <= $target && $target < $nums[$mid]) $hi = $mid - 1;
            else $lo = $mid + 1;
        } else {
            if ($nums[$mid] < $target && $target <= $nums[$hi]) $lo = $mid + 1;
            else $hi = $mid - 1;
        }
    }
    return -1;
}

// LeetCode 81 (có số trùng): nums[lo] == nums[mid] == nums[hi] thì chỉ thu hẹp hai đầu được. Trả số bước.
function searchWithDuplicatesSteps(array $nums, int $target): int
{
    $lo = 0;
    $hi = count($nums) - 1;
    $steps = 0;
    while ($lo <= $hi) {
        $steps++;
        $mid = ($lo + $hi) >> 1;
        if ($nums[$mid] === $target) return $steps;
        if ($nums[$lo] === $nums[$mid] && $nums[$mid] === $nums[$hi]) { $lo++; $hi--; }
        elseif ($nums[$lo] <= $nums[$mid]) {
            if ($nums[$lo] <= $target && $target < $nums[$mid]) $hi = $mid - 1; else $lo = $mid + 1;
        } else {
            if ($nums[$mid] < $target && $target <= $nums[$hi]) $lo = $mid + 1; else $hi = $mid - 1;
        }
    }
    return $steps;
}

$cases = [
    [[4, 5, 6, 7, 0, 1, 2], 0, 4], [[4, 5, 6, 7, 0, 1, 2], 3, -1], [[1], 0, -1], [[1], 1, 0],
    [[3, 1], 1, 1], [[5, 1, 3], 3, 2], [[1, 3], 3, 1], [[6, 7, 1, 2, 3, 4, 5], 6, 0], [[1, 2, 3, 4, 5], 4, 3],
];
foreach (['linearScan', 'onePass', 'pivotThenSearch', 'wrongStrict'] as $fn) {
    $bad = [];
    foreach ($cases as [$n, $t, $w]) if (($g = $fn($n, $t)) !== $w) $bad[] = json_encode($n) . " t=$t → $g";
    echo str_pad($fn, 16) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở " . implode(" ", $bad) : "") . "\n";
}

// Kiểm ngẫu nhiên: mọi mảng xoay của 0..n-1 với n ≤ 12, mọi target trong -1..n.
$mismatches = $wrongMismatches = $checked = 0;
for ($n = 1; $n <= 12; $n++)
    for ($k = 0; $k < $n; $k++) {
        $a = [];
        for ($i = 0; $i < $n; $i++) $a[] = ($i + $k) % $n;
        for ($t = -1; $t <= $n; $t++) {
            $checked++;
            $want = linearScan($a, $t);
            if (onePass($a, $t) !== $want || pivotThenSearch($a, $t) !== $want) $mismatches++;
            if (wrongStrict($a, $t) !== $want) $wrongMismatches++;
        }
    }
echo "\nđối chiếu với array_search: $checked bộ (mảng, target), $mismatches bộ lệch; bản sai wrongStrict lệch $wrongMismatches bộ\n";

echo "\nLeetCode 81, số bước khi target không có\n";
foreach ([1_000, 10_000, 100_000] as $n) {
    $same = array_fill(0, $n, 1);
    $same[intdiv($n * 9, 10)] = 0;
    $k = intdiv($n * 37, 100);
    $distinct = [];
    for ($i = 0; $i < $n; $i++) $distinct[] = ($i + $k) % $n;
    printf("n = %-7d toàn số 1 trừ một số 0: %6d bước;  không trùng: %d bước\n",
        $n, searchWithDuplicatesSteps($same, 2), searchWithDuplicatesSteps($distinct, -1));
}
