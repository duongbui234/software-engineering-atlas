<?php

$calls = 0;
$generated = 0;

// Cách chính: sắp xếp, rồi ở mỗi tầng chỉ dùng phần tử đầu của mỗi nhóm giá trị bằng nhau
function subsetsWithDup(array $nums): array {
    global $calls;
    sort($nums);
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, &$calls, $nums) {
        $calls++;
        $result[] = $path;
        for ($i = $start; $i < count($nums); $i++) {
            // i > start: cùng tầng, giá trị này đã được thử ở anh em đứng trước
            if ($i > $start && $nums[$i] === $nums[$i - 1]) continue;
            $path[] = $nums[$i];
            $walk($i + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Bản sai: bỏ mọi phần tử bằng phần tử đứng trước, kể cả khi nó là lựa chọn đầu của tầng
function subsetsSkipAlways(array $nums): array {
    sort($nums);
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        $result[] = $path;
        for ($i = $start; $i < count($nums); $i++) {
            if ($i > 0 && $nums[$i] === $nums[$i - 1]) continue;
            $path[] = $nums[$i];
            $walk($i + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Cách lọc sau: sinh đủ 2^n tập của mảng đã sắp, dùng khóa chuỗi của mảng kết hợp để bỏ trùng
function subsetsWithSet(array $nums): array {
    global $generated;
    sort($nums);
    $seen = [];
    $n = count($nums);
    for ($mask = 0; $mask < (1 << $n); $mask++) {
        $subset = [];
        for ($i = 0; $i < $n; $i++) {
            if ($mask & (1 << $i)) $subset[] = $nums[$i];
        }
        $generated++;
        $seen[implode(',', $subset)] = $subset;
    }
    return array_values($seen);
}

// Tham chiếu độc lập: đếm số lần xuất hiện, mỗi giá trị lấy 0..count bản
function subsetsByCount(array $nums): array {
    $result = [[]];
    foreach (array_count_values($nums) as $value => $count) {
        $next = [];
        foreach ($result as $subset) {
            for ($k = 0; $k <= $count; $k++) {
                $next[] = array_merge($subset, array_fill(0, $k, (int) $value));
            }
        }
        $result = $next;
    }
    return $result;
}

function canonical(array $sets): array {
    $keys = [];
    foreach ($sets as $s) {
        sort($s);
        $keys[] = json_encode($s);
    }
    sort($keys);
    return $keys;
}

function check(array $nums, ?array $expected): bool {
    $reference = canonical(subsetsByCount($nums));
    foreach ([subsetsWithDup($nums), subsetsWithSet($nums)] as $got) {
        $keys = canonical($got);
        if (count(array_unique($keys)) !== count($keys)) return false; // không được có tập lặp
        if ($keys !== $reference) return false;
        if ($expected !== null && $keys !== canonical($expected)) return false;
    }
    return true;
}

$cases = [
    [[3, 3], [[], [3], [3, 3]]],
    [[5, 5, 1], [[], [1], [1, 5], [1, 5, 5], [5], [5, 5]]],
    [[4, 4, 4, 4], [[], [4], [4, 4], [4, 4, 4], [4, 4, 4, 4]]],
    [[0, -1, 0], [[], [-1], [-1, 0], [-1, 0, 0], [0], [0, 0]]],
    [[7], [[], [7]]],
    [[1, 1, 2, 2, 3], null],
    [array_fill(0, 10, 2), null],
    [range(-5, 4), null],
];
$ok = 0;
foreach ($cases as [$nums, $expected]) {
    if (check($nums, $expected)) $ok++;
    else echo "sai ở " . json_encode($nums) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi mảng dài 0–5 với giá trị trong {1, 2, 3}
$total = 0;
$good = 0;
$build = function (array $arr) use (&$build, &$total, &$good) {
    $total++;
    if (check($arr, null)) $good++;
    if (count($arr) === 5) return;
    foreach ([1, 2, 3] as $v) $build([...$arr, $v]);
};
$build([]);
echo "$good/$total ca đúng (đối chiếu đếm theo nhóm)\n";

$wrong = count(subsetsSkipAlways([5, 5, 1]));
$right = count(subsetsWithDup([5, 5, 1]));
echo "Bỏ trùng mọi lúc với [5,5,1]: $wrong tập, đúng là $right\n";

$heavy = [4, 4, 4, 4, 4, 9, 9, 9, 9, 9];
$generated = 0;
$kept = count(subsetsWithSet($heavy));
$calls = 0;
subsetsWithDup($heavy);
echo "[4×5, 9×5]: Set sinh $generated tập để giữ $kept, cắt cùng tầng sinh $calls\n";
