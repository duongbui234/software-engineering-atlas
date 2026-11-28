<?php
// Ga MISC-01: quay lui trên cây lựa chọn (tập con và tổ hợp).
// Chạy: php choices.php

// Subsets: ghi lại ở MỌI nút, nhánh con chỉ xét phần tử sau i.
function subsets(array $nums): array {
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        $result[] = $path; // mảng PHP được chép khi gán, nên đây là một bản chụp
        for ($i = $start; $i < count($nums); $i++) {
            $path[] = $nums[$i]; // chọn
            $walk($i + 1); // đi sâu, mỗi phần tử dùng một lần
            array_pop($path); // gỡ lựa chọn
        }
    };
    $walk(0);
    return $result;
}

// Subsets II: sắp xếp, rồi ở cùng một tầng bỏ giá trị trùng với anh em đứng trước.
function subsetsWithDup(array $nums): array {
    sort($nums);
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        $result[] = $path;
        for ($i = $start; $i < count($nums); $i++) {
            if ($i > $start && $nums[$i] === $nums[$i - 1]) continue; // trùng ở cùng tầng
            $path[] = $nums[$i];
            $walk($i + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Combination Sum (dùng lại: nhánh con bắt đầu từ i) và Combination Sum II
// (mỗi số dùng một lần: i + 1, bỏ trùng ở cùng tầng). Chỉ ghi khi còn lại đúng 0.
function combinationSum(array $candidates, int $target, bool $reuse = true): array {
    sort($candidates);
    $result = [];
    $path = [];
    $walk = function (int $start, int $remaining) use (&$walk, &$result, &$path, $candidates, $reuse) {
        if ($remaining === 0) {
            $result[] = $path;
            return;
        }
        for ($i = $start; $i < count($candidates); $i++) {
            if (!$reuse && $i > $start && $candidates[$i] === $candidates[$i - 1]) continue;
            if ($candidates[$i] > $remaining) break; // đã sắp xếp: các số sau còn lớn hơn
            $path[] = $candidates[$i];
            $walk($reuse ? $i : $i + 1, $remaining - $candidates[$i]);
            array_pop($path);
        }
    };
    $walk(0, $target);
    return $result;
}

const KEYS = ['2' => 'abc', '3' => 'def', '4' => 'ghi', '5' => 'jkl',
              '6' => 'mno', '7' => 'pqrs', '8' => 'tuv', '9' => 'wxyz'];

// Letter Combinations: tầng thứ k chọn một chữ của chữ số thứ k; ghi ở lá.
function letterCombinations(string $digits): array {
    if ($digits === '') return [];
    $result = [];
    $path = '';
    $walk = function (int $depth) use (&$walk, &$result, &$path, $digits) {
        if ($depth === strlen($digits)) {
            $result[] = $path;
            return;
        }
        foreach (str_split(KEYS[$digits[$depth]]) as $letter) {
            $path .= $letter;
            $walk($depth + 1);
            $path = substr($path, 0, -1);
        }
    };
    $walk(0);
    return $result;
}

// So sánh không phụ thuộc thứ tự: sắp xếp trong từng tổ hợp, rồi sắp xếp cả danh sách.
function normalize(array $lists): array {
    $out = [];
    foreach ($lists as $x) {
        if (is_string($x)) {
            $out[] = $x;
        } else {
            sort($x);
            $out[] = implode(',', $x);
        }
    }
    sort($out, SORT_STRING);
    return $out;
}

$cases = [
    ['subsets [2,5,9]', fn() => subsets([2, 5, 9]), [[], [2], [2, 5], [2, 5, 9], [2, 9], [5], [5, 9], [9]]],
    ['subsets [7]', fn() => subsets([7]), [[], [7]]],
    ['subsets 10 số', fn() => subsets(range(1, 10)), 1024],
    ['subsetsWithDup [3,1,3]', fn() => subsetsWithDup([3, 1, 3]), [[], [1], [1, 3], [1, 3, 3], [3], [3, 3]]],
    ['subsetsWithDup [6,6,6]', fn() => subsetsWithDup([6, 6, 6]), [[], [6], [6, 6], [6, 6, 6]]],
    ['subsetsWithDup [4,4,1,4,2]', fn() => subsetsWithDup([4, 4, 1, 4, 2]), 16],
    ['combinationSum [3,4,5] 8', fn() => combinationSum([3, 4, 5], 8), [[3, 5], [4, 4]]],
    ['combinationSum [2,3,7] 9', fn() => combinationSum([2, 3, 7], 9), [[2, 2, 2, 3], [2, 7], [3, 3, 3]]],
    ['combinationSum [4] 3', fn() => combinationSum([4], 3), []],
    ['combinationSum [2,3,5,7] 20', fn() => combinationSum([2, 3, 5, 7], 20), 18],
    ['combinationSum2 [1,4,1,2,3,4] 6', fn() => combinationSum([1, 4, 1, 2, 3, 4], 6, false), [[1, 1, 4], [1, 2, 3], [2, 4]]],
    ['combinationSum2 [3,3,2,4,3] 6', fn() => combinationSum([3, 3, 2, 4, 3], 6, false), [[2, 4], [3, 3]]],
    ['combinationSum2 [5] 3', fn() => combinationSum([5], 3, false), []],
    ['letterCombinations 47', fn() => letterCombinations('47'), ['gp', 'gq', 'gr', 'gs', 'hp', 'hq', 'hr', 'hs', 'ip', 'iq', 'ir', 'is']],
    ['letterCombinations 9', fn() => letterCombinations('9'), ['w', 'x', 'y', 'z']],
    ['letterCombinations 7979', fn() => letterCombinations('7979'), 256],
    ['letterCombinations rỗng', fn() => letterCombinations(''), []],
];

$ok = 0;
$fails = [];
foreach ($cases as [$name, $run, $want]) {
    $got = normalize($run());
    $pass = is_int($want)
        ? count($got) === $want && count(array_unique($got)) === $want
        : $got === normalize($want);
    if ($pass) $ok++;
    else $fails[] = $name;
}
echo "$ok/" . count($cases) . " ca đúng\n";
if ($fails) echo 'sai ở: ' . implode('; ', $fails) . "\n";
