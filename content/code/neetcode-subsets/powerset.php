<?php

// Cách 1: lấy hoặc bỏ từng phần tử, mỗi lá của cây là một tập con
function subsetsTakeSkip(array $nums): array {
    $result = [];
    $path = [];
    $walk = function (int $i) use (&$walk, &$result, &$path, $nums) {
        if ($i === count($nums)) {
            $result[] = $path; // mảng PHP là giá trị: phép gán này đã là một bản sao
            return;
        }
        $path[] = $nums[$i]; // lấy nums[i]
        $walk($i + 1);
        array_pop($path);
        $walk($i + 1); // bỏ nums[i]
    };
    $walk(0);
    return $result;
}

// Cách 2: chỉ số bắt đầu, mỗi nút của cây là một tập con
function subsetsStart(array $nums): array {
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        $result[] = $path;
        for ($i = $start; $i < count($nums); $i++) {
            $path[] = $nums[$i];
            $walk($i + 1); // chỉ xét các phần tử sau i, nên [a, b] không có bản sao [b, a]
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Cách 3: bit thứ i của mask cho biết có lấy nums[i] hay không
function subsetsBitmask(array $nums): array {
    $result = [];
    $n = count($nums);
    for ($mask = 0; $mask < (1 << $n); $mask++) {
        $subset = [];
        for ($i = 0; $i < $n; $i++) {
            if ($mask & (1 << $i)) $subset[] = $nums[$i];
        }
        $result[] = $subset;
    }
    return $result;
}

// Cách 4: nhân đôi danh sách, mỗi tập cũ sinh thêm một bản có x
function subsetsDoubling(array $nums): array {
    $result = [[]];
    foreach ($nums as $x) {
        foreach ($result as $subset) {
            $subset[] = $x; // $subset là bản sao, không đụng tới tập cũ
            $result[] = $subset;
        }
    }
    return $result;
}

// "Bản lỗi" của các ngôn ngữ khác: đẩy thẳng path, không sao chép tường minh
function subsetsNoCopy(array $nums): array {
    $result = [];
    $path = [];
    $walk = function (int $start) use (&$walk, &$result, &$path, $nums) {
        $result[] = $path;
        for ($i = $start; $i < count($nums); $i++) {
            $path[] = $nums[$i];
            $walk($i + 1);
            array_pop($path);
        }
    };
    $walk(0);
    return $result;
}

// Dạng chuẩn để so không phụ thuộc thứ tự: sắp từng tập, rồi sắp cả danh sách
function canonical(array $sets): array {
    $keys = [];
    foreach ($sets as $s) {
        sort($s);
        $keys[] = json_encode($s);
    }
    sort($keys);
    return $keys;
}

// Mọi cách phải cho đủ 2^n tập, không tập nào lặp, và khớp đáp án viết tay nếu có
function check(array $nums, ?array $expected): bool {
    $reference = canonical(subsetsBitmask($nums));
    foreach (['subsetsTakeSkip', 'subsetsStart', 'subsetsBitmask', 'subsetsDoubling'] as $solve) {
        $got = $solve($nums);
        if (count($got) !== (1 << count($nums))) return false;
        $keys = canonical($got);
        if (count(array_unique($keys)) !== count($got)) return false;
        if ($expected !== null && $keys !== canonical($expected)) return false;
        if ($keys !== $reference) return false;
    }
    return true;
}

$cases = [
    [[5], [[], [5]]],
    [[4, -2], [[], [4], [-2], [4, -2]]],
    [[7, 1, 9], [[], [7], [1], [9], [7, 1], [7, 9], [1, 9], [7, 1, 9]]],
    [[-10, 10], [[], [-10], [10], [-10, 10]]],
    [[3, -1, 0, 8], null],
    [[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4], null],
    [[6, -6, 2], [[], [6], [-6], [2], [6, -6], [6, 2], [-6, 2], [6, -6, 2]]],
];
$ok = 0;
foreach ($cases as [$nums, $expected]) {
    if (check($nums, $expected)) $ok++;
    else echo "sai ở " . json_encode($nums) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu chéo: mọi mảng gồm các giá trị khác nhau lấy từ {-2..2}, dài 0–4, mọi thứ tự
$total = 0;
$good = 0;
$build = function (array $arr) use (&$build, &$total, &$good) {
    $total++;
    if (check($arr, null)) $good++;
    if (count($arr) === 4) return;
    foreach ([-2, -1, 0, 1, 2] as $v) {
        if (!in_array($v, $arr, true)) $build([...$arr, $v]);
    }
};
$build([]);
echo "$good/$total ca đúng (đối chiếu chéo bốn cách)\n";

$broken = array_flip(canonical(subsetsNoCopy([1, 2, 3])));
$matched = 0;
foreach (canonical(subsetsBitmask([1, 2, 3])) as $key) {
    if (isset($broken[$key])) $matched++;
}
echo "Quên sao chép path với [1,2,3]: $matched/8 tập con đúng\n";
