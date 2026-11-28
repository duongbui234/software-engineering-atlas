<?php
// Combination Sum II (LeetCode 40): mỗi vị trí dùng tối đa một lần, mảng có thể có số trùng.
$calls = 0;

// Sắp xếp, bỏ số trùng ở cùng một tầng, cắt nhánh khi số đã lớn hơn phần còn lại.
function combinationSum2(array $candidates, int $target): array {
    $nums = $candidates;
    sort($nums);
    $out = [];
    $path = [];
    $dfs = function (int $start, int $remain) use (&$dfs, &$out, &$path, $nums) {
        global $calls;
        $calls++;
        if ($remain === 0) {
            $out[] = $path; // mảng PHP được chép theo giá trị
            return;
        }
        for ($i = $start; $i < count($nums); $i++) {
            if ($i > $start && $nums[$i] === $nums[$i - 1]) continue; // cùng tầng đã thử giá trị này rồi
            if ($nums[$i] > $remain) break;
            $path[] = $nums[$i];
            $dfs($i + 1, $remain - $nums[$i]); // i + 1: vị trí này đã dùng
            array_pop($path);
        }
    };
    $dfs(0, $target);
    return $out;
}

// Cùng cây đó nhưng không bỏ trùng: sinh lặp rồi khử bằng tập khóa.
function combinationSum2Set(array $candidates, int $target): array {
    $nums = $candidates;
    sort($nums);
    $seen = [];
    $path = [];
    $dfs = function (int $start, int $remain) use (&$dfs, &$seen, &$path, $nums) {
        global $calls;
        $calls++;
        if ($remain === 0) {
            $seen[implode(",", $path)] = $path; // khóa chuỗi: lần sau ghi đè, không thêm dòng
            return;
        }
        for ($i = $start; $i < count($nums); $i++) {
            if ($nums[$i] > $remain) break;
            $path[] = $nums[$i];
            $dfs($i + 1, $remain - $nums[$i]);
            array_pop($path);
        }
    };
    $dfs(0, $target);
    return array_values($seen);
}

// Vét mọi tập con theo bitmask, sắp từng tập rồi khử trùng.
function brute(array $candidates, int $target): array {
    $seen = [];
    $n = count($candidates);
    for ($mask = 0; $mask < 1 << $n; $mask++) {
        $pick = [];
        for ($i = 0; $i < $n; $i++) if ($mask >> $i & 1) $pick[] = $candidates[$i];
        if (array_sum($pick) === $target) {
            sort($pick);
            $seen[implode(",", $pick)] = $pick;
        }
    }
    return array_values($seen);
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
    [[3, 1, 3, 5, 1, 1], 8, [[1, 1, 1, 5], [1, 1, 3, 3], [3, 5]]],
    [[2, 2, 2], 4, [[2, 2]]],
    [[5], 3, []],
    [[4, 1, 4, 1], 5, [[1, 4]]],
    [array_fill(0, 20, 1), 10, [array_fill(0, 10, 1)]],
    [[6, 2, 4, 2], 6, [[2, 4], [6]]],
    [[50, 30], 30, [[30]]],
];
$ok = 0;
foreach ($cases as [$cand, $target, $want]) {
    $a = combinationSum2($cand, $target);
    if (norm($a) === norm($want) && norm(combinationSum2Set($cand, $target)) === norm($want)) $ok++;
    else echo "sai ở ", json_encode($cand), " $target\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

$good = 0;
$total = 0;
for ($n = 1; $n <= 6; $n++) {
    $digits = array_fill(0, $n, 0);
    for ($step = 0; $step < 3 ** $n; $step++) {
        $cand = array_map(fn($d) => $d + 1, $digits);
        for ($target = 1; $target <= 8; $target++) {
            $total++;
            $want = norm(brute($cand, $target));
            if (norm(combinationSum2($cand, $target)) === $want && norm(combinationSum2Set($cand, $target)) === $want) $good++;
            else echo "sai ở ", json_encode($cand), " $target\n";
        }
        for ($j = $n - 1; $j >= 0; $j--) {
            if (++$digits[$j] < 3) break;
            $digits[$j] = 0;
        }
    }
}
echo "$good/$total ca đúng (đối chiếu vét tập con)\n";

$calls = 0;
combinationSum2Set(array_fill(0, 20, 1), 10);
$setCalls = $calls;
$calls = 0;
combinationSum2(array_fill(0, 20, 1), 10);
echo "20 số 1, target 10: khử trùng bằng tập $setCalls lượt gọi, bỏ trùng cùng tầng $calls lượt gọi\n";
