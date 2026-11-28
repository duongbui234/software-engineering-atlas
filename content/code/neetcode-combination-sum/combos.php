<?php
// Combination Sum (LeetCode 39): liệt kê mọi tổ hợp, mỗi số được dùng lại nhiều lần.
$calls = 0;

// Quay lui không sắp xếp, không cắt nhánh: đi tới khi phần còn lại âm.
function combinationSumPlain(array $candidates, int $target): array {
    $out = [];
    $path = [];
    $dfs = function (int $start, int $remain) use (&$dfs, &$out, &$path, $candidates) {
        global $calls;
        $calls++;
        if ($remain === 0) {
            $out[] = $path; // mảng PHP được chép theo giá trị
            return;
        }
        if ($remain < 0) return;
        for ($i = $start; $i < count($candidates); $i++) {
            $path[] = $candidates[$i];
            $dfs($i, $remain - $candidates[$i]); // vẫn là i: được dùng lại số này
            array_pop($path);
        }
    };
    $dfs(0, $target);
    return $out;
}

// Sắp xếp rồi cắt nhánh: số đầu tiên lớn hơn phần còn lại thì mọi số sau cũng vậy.
function combinationSum(array $candidates, int $target): array {
    $nums = $candidates;
    sort($nums);
    $out = [];
    $path = [];
    $dfs = function (int $start, int $remain) use (&$dfs, &$out, &$path, $nums) {
        global $calls;
        $calls++;
        if ($remain === 0) {
            $out[] = $path;
            return;
        }
        for ($i = $start; $i < count($nums); $i++) {
            if ($nums[$i] > $remain) break;
            $path[] = $nums[$i];
            $dfs($i, $remain - $nums[$i]); // vẫn là i: được dùng lại số này
            array_pop($path);
        }
    };
    $dfs(0, $target);
    return $out;
}

// DP đếm số tổ hợp (như Coin Change II): chỉ ra con số, không ra danh sách.
function countWays(array $candidates, int $target): int {
    $ways = array_fill(0, $target + 1, 0);
    $ways[0] = 1;
    foreach ($candidates as $c) {
        for ($t = $c; $t <= $target; $t++) $ways[$t] += $ways[$t - $c];
    }
    return $ways[$target];
}

// Vét mọi vector số lần dùng (0..target/c cho từng số), giữ vector có tổng đúng.
function brute(array $candidates, int $target): array {
    $out = [];
    $counts = array_fill(0, count($candidates), 0);
    $gen = function (int $i) use (&$gen, &$out, &$counts, $candidates, $target) {
        if ($i === count($candidates)) {
            $sum = 0;
            foreach ($counts as $j => $k) $sum += $k * $candidates[$j];
            if ($sum === $target) {
                $combo = [];
                foreach ($counts as $j => $k) for ($r = 0; $r < $k; $r++) $combo[] = $candidates[$j];
                $out[] = $combo;
            }
            return;
        }
        for ($k = 0; $k <= intdiv($target, $candidates[$i]); $k++) {
            $counts[$i] = $k;
            $gen($i + 1);
        }
        $counts[$i] = 0;
    };
    $gen(0);
    return $out;
}

function norm(array $combos): string {
    $keys = [];
    foreach ($combos as $c) {
        sort($c);
        $keys[] = implode(",", $c);
    }
    sort($keys, SORT_STRING);
    return implode("|", $keys);
}

$cases = [
    [[4, 5, 9], 9, [[4, 5], [9]]],
    [[3, 4, 7], 10, [[3, 3, 4], [3, 7]]],
    [[6], 4, []],
    [[8, 2, 5], 10, [[2, 2, 2, 2, 2], [2, 8], [5, 5]]],
    [[2, 3], 1, []],
    [[40], 40, [[40]]],
    [[39, 2], 3, []],
];
$ok = 0;
foreach ($cases as [$cand, $target, $want]) {
    $got = combinationSum($cand, $target);
    if (norm(combinationSumPlain($cand, $target)) === norm($want) && norm($got) === norm($want) && count($got) === countWays($cand, $target)) $ok++;
    else echo "sai ở ", json_encode($cand), " $target\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

$pool = [2, 3, 4, 5, 6, 7];
$good = 0;
$total = 0;
for ($mask = 1; $mask < 1 << count($pool); $mask++) {
    $cand = [];
    foreach ($pool as $i => $v) if ($mask >> $i & 1) $cand[] = $v;
    for ($target = 1; $target < 15; $target++) {
        $total++;
        $want = norm(brute($cand, $target));
        $a = combinationSum($cand, $target);
        if (norm($a) === $want && norm(combinationSumPlain($cand, $target)) === $want && count($a) === countWays($cand, $target)) $good++;
        else echo "sai ở ", json_encode($cand), " $target\n";
    }
}
echo "$good/$total ca đúng (đối chiếu vét số lần dùng)\n";

$primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
$calls = 0;
combinationSumPlain($primes, 40);
$plainCalls = $calls;
$calls = 0;
$found = count(combinationSum($primes, 40));
echo "12 số nguyên tố tới 37, target 40: không cắt nhánh $plainCalls lượt gọi, sắp xếp + cắt nhánh $calls lượt gọi, $found tổ hợp\n";
