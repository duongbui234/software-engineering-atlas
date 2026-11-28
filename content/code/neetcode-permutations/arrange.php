<?php
// Permutations (LeetCode 46): đánh dấu phần tử đã dùng, đổi chỗ tại chỗ, chèn vào mọi khe
// Chạy: php arrange.php

$calls = 0;

// Cách chính: path cộng mảng used đánh dấu phần tử đã nằm trong path
function permute(array $nums): array {
    global $calls;
    $n = count($nums);
    $result = [];
    $path = [];
    $used = array_fill(0, $n, false);
    $walk = function () use (&$walk, &$result, &$path, &$used, &$calls, $nums, $n) {
        $calls++;
        if (count($path) === $n) {
            $result[] = $path; // mảng PHP được chép khi gán, nên đây đã là bản chép
            return;
        }
        for ($i = 0; $i < $n; $i++) {
            if ($used[$i]) continue; // phần tử này đã nằm trong path
            $used[$i] = true;
            $path[] = $nums[$i];
            $walk();
            array_pop($path);
            $used[$i] = false; // gỡ dấu để nhánh anh em được dùng lại
        }
    };
    $walk();
    return $result;
}

// Đổi chỗ tại chỗ: vị trí k lần lượt nhận từng phần tử đang nằm ở k..n-1
function permuteSwap(array $nums): array {
    $a = $nums;
    $result = [];
    $walk = function (int $k) use (&$walk, &$a, &$result) {
        if ($k === count($a)) {
            $result[] = $a;
            return;
        }
        for ($i = $k; $i < count($a); $i++) {
            [$a[$k], $a[$i]] = [$a[$i], $a[$k]];
            $walk($k + 1);
            [$a[$k], $a[$i]] = [$a[$i], $a[$k]]; // đổi lại để mảng về như cũ
        }
    };
    $walk(0);
    return $result;
}

// Cách lặp: chèn phần tử mới vào mọi khe của từng hoán vị đã có
function permuteInsert(array $nums): array {
    $layer = [[]];
    foreach ($nums as $x) {
        $next = [];
        foreach ($layer as $p) {
            for ($slot = 0; $slot <= count($p); $slot++) {
                $q = $p;
                array_splice($q, $slot, 0, [$x]);
                $next[] = $q;
            }
        }
        $layer = $next;
    }
    return $layer;
}

// Bản sai: mượn chỉ số bắt đầu của bài tổ hợp, chỉ ghi khi path đủ n phần tử
function permuteWithStart(array $nums): array {
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        if (count($path) === count($nums)) {
            $result[] = $path;
            return;
        }
        for ($i = $start; $i < count($nums); $i++) {
            $path[] = $nums[$i];
            $walk($i + 1); // không bao giờ quay lại phần tử đứng trước i
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Trọng tài độc lập: vét mọi bộ n chỉ số (n^n bộ), giữ bộ có chỉ số đôi một khác nhau
function bruteForce(array $nums): array {
    $n = count($nums);
    $total = $n ** $n;
    $result = [];
    for ($code = 0; $code < $total; $code++) {
        $c = $code;
        $idx = [];
        for ($k = 0; $k < $n; $k++) {
            $idx[] = $c % $n;
            $c = intdiv($c, $n);
        }
        if (count(array_unique($idx)) === $n) {
            $result[] = array_map(fn($i) => $nums[$i], $idx);
        }
    }
    return $result;
}

function canonical(array $list): string {
    $keys = array_map(fn($p) => implode(',', $p), $list);
    sort($keys, SORT_STRING);
    return implode('|', $keys);
}

function factorial(int $n): int {
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}

function check(array $nums, ?array $expected): bool {
    $want = canonical($expected ?? bruteForce($nums));
    foreach ([permute($nums), permuteSwap($nums), permuteInsert($nums)] as $got) {
        if (count($got) !== factorial(count($nums))) return false;
        $keys = array_map(fn($p) => implode(',', $p), $got);
        if (count(array_unique($keys)) !== count($got)) return false;
        if (canonical($got) !== $want) return false;
    }
    return true;
}

$cases = [
    [[7], [[7]]],
    [[4, 9], [[4, 9], [9, 4]]],
    [[3, 8, 1], [[3, 8, 1], [3, 1, 8], [8, 3, 1], [8, 1, 3], [1, 3, 8], [1, 8, 3]]],
    [[0, -5, 10], null],
    [[-10, 10, 0, 5], null],
    [[2, 4, 6, 8, 10], null],
    [[-3, -2, -1, 0, 1, 2], null],
];
$ok = 0;
foreach ($cases as [$nums, $expected]) {
    if (check($nums, $expected)) $ok++;
    else echo "sai ở " . json_encode($nums) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi mảng dài 1–5 gồm các giá trị khác nhau lấy từ {1, 2, 3, 4, 5}
$total = 0;
$good = 0;
$build = function (array $arr) use (&$build, &$total, &$good) {
    if (count($arr) > 0) {
        $total++;
        if (check($arr, null)) $good++;
    }
    if (count($arr) === 5) return;
    for ($v = 1; $v <= 5; $v++) {
        if (!in_array($v, $arr, true)) $build([...$arr, $v]);
    }
};
$build([]);
echo "$good/$total ca đúng (đối chiếu vét mọi bộ chỉ số)\n";

echo "Dùng chỉ số bắt đầu như bài tổ hợp với [3,8,1]: " . count(permuteWithStart([3, 8, 1])) . "/6 hoán vị\n";

$calls = 0;
$six = permute([1, 2, 3, 4, 5, 6]);
echo "n = 6: " . count($six) . " hoán vị, $calls lượt gọi\n";
