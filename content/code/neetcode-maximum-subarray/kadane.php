<?php
// Maximum Subarray (LeetCode 53): vét O(n³), vét O(n²), chia để trị, tổng tiền tố, Kadane
// Chạy: php kadane.php        (thêm tham số bench để đo thời gian)

// Cách chính: Kadane. Tổng đang mang mà âm thì bỏ, bắt đầu lại từ phần tử hiện tại
function maxSubArray(array $nums): int {
    $cur = $nums[0]; // tổng tốt nhất của đoạn kết thúc tại i
    $best = $nums[0];
    for ($i = 1, $n = count($nums); $i < $n; $i++) {
        $cur = $cur < 0 ? $nums[$i] : $cur + $nums[$i]; // phần đầu âm chỉ kéo tổng xuống
        if ($cur > $best) $best = $cur;
    }
    return $best;
}

// Kadane kèm biên: nhớ chỗ bắt đầu lại, chép biên mỗi khi phá kỷ lục
function maxSubArrayBounds(array $nums): array {
    $cur = $best = $nums[0];
    $start = $lo = $hi = 0;
    for ($i = 1, $n = count($nums); $i < $n; $i++) {
        if ($cur < 0) {
            $cur = $nums[$i];
            $start = $i; // đoạn mới bắt đầu tại i
        } else {
            $cur += $nums[$i];
        }
        if ($cur > $best) {
            [$best, $lo, $hi] = [$cur, $start, $i];
        }
    }
    return [$best, $lo, $hi];
}

// Tổng tiền tố: đoạn i..j có tổng P[j+1] - P[i], nên trừ đi tiền tố nhỏ nhất đứng trước
function maxSubArrayPrefix(array $nums): int {
    $prefix = 0;
    $minPrefix = 0; // P[0] = 0: tiền tố rỗng
    $best = PHP_INT_MIN;
    foreach ($nums as $x) {
        $prefix += $x;
        $best = max($best, $prefix - $minPrefix);
        $minPrefix = min($minPrefix, $prefix);
    }
    return $best;
}

// Chia để trị: đáp án nằm hẳn bên trái, hẳn bên phải, hoặc vắt qua điểm giữa
function maxSubArrayDivide(array $nums): int {
    return solveRange($nums, 0, count($nums) - 1);
}

function solveRange(array $nums, int $lo, int $hi): int {
    if ($lo === $hi) return $nums[$lo];
    $mid = intdiv($lo + $hi, 2);
    $sum = 0;
    $leftBest = PHP_INT_MIN; // tổng lớn nhất của đoạn kết thúc tại mid
    for ($i = $mid; $i >= $lo; $i--) {
        $sum += $nums[$i];
        $leftBest = max($leftBest, $sum);
    }
    $sum = 0;
    $rightBest = PHP_INT_MIN; // tổng lớn nhất của đoạn bắt đầu tại mid + 1
    for ($i = $mid + 1; $i <= $hi; $i++) {
        $sum += $nums[$i];
        $rightBest = max($rightBest, $sum);
    }
    return max(solveRange($nums, $lo, $mid), solveRange($nums, $mid + 1, $hi), $leftBest + $rightBest);
}

// Vét O(n²): cố định điểm đầu i, cộng dồn sang phải
function maxSubArrayQuadratic(array $nums, int &$adds = 0): int {
    $best = PHP_INT_MIN;
    $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        $sum = 0;
        for ($j = $i; $j < $n; $j++) {
            $sum += $nums[$j];
            $adds++;
            if ($sum > $best) $best = $sum;
        }
    }
    return $best;
}

// Trọng tài O(n³): cộng lại từ đầu mọi đoạn i..j, không dùng chung dòng nào với các cách trên
function maxSubArrayCubic(array $nums): int {
    $best = PHP_INT_MIN;
    $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        for ($j = $i; $j < $n; $j++) {
            $sum = 0;
            for ($k = $i; $k <= $j; $k++) $sum += $nums[$k];
            $best = max($best, $sum);
        }
    }
    return $best;
}

// Bản sai: khởi tạo best = 0, coi như được chọn đoạn rỗng
function maxSubArrayZeroInit(array $nums): int {
    $cur = $best = 0;
    foreach ($nums as $x) {
        $cur = max(0, $cur + $x);
        $best = max($best, $cur);
    }
    return $best;
}

function check(array $nums, int $expected): bool {
    [$best, $lo, $hi] = maxSubArrayBounds($nums);
    if ($lo < 0 || $lo > $hi || $hi >= count($nums)) return false;
    if ($best !== $expected || array_sum(array_slice($nums, $lo, $hi - $lo + 1)) !== $best) return false;
    $answers = [maxSubArray($nums), maxSubArrayPrefix($nums), maxSubArrayDivide($nums), maxSubArrayQuadratic($nums), maxSubArrayCubic($nums)];
    foreach ($answers as $a) if ($a !== $expected) return false;
    return true;
}

// Sinh số giả ngẫu nhiên MINSTD, để bảy ngôn ngữ cùng sinh một dãy
$seed = 2026;
function nextRand(): int {
    global $seed;
    $seed = $seed * 48271 % 2147483647;
    return $seed;
}

$cases = [
    [[7], 7],
    [[-4], -4],
    [[-3, -1, -2], -1],
    [[0, 0, 0], 0],
    [[3, -2, 5, -1], 6],
    [[2, -8, 3, -2, 4, -10], 5],
    [[-1, 6, -7, 5, 3, -2], 8],
    [[10000, 10000, -1, 10000], 29999],
    [[-10000, -10000, -10000], -10000],
];
$ok = 0;
foreach ($cases as [$nums, $expected]) {
    if (check($nums, $expected)) $ok++;
    else echo 'sai ở ' . json_encode($nums) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: 3000 mảng ngẫu nhiên dài 1–12, giá trị −10..10, so với trọng tài O(n³)
$good = 0;
$rounds = 3000;
for ($r = 0; $r < $rounds; $r++) {
    $n = 1 + nextRand() % 12;
    $nums = [];
    for ($k = 0; $k < $n; $k++) $nums[] = nextRand() % 21 - 10;
    if (check($nums, maxSubArrayCubic($nums))) $good++;
}
echo "$good/$rounds ca đúng (đối chiếu vét O(n³))\n";

echo 'Khởi tạo best = 0 với [-3,-1,-2]: ra ' . maxSubArrayZeroInit([-3, -1, -2]) . ', đúng là ' . maxSubArray([-3, -1, -2]) . "\n";

// Phép đo: n = 10000, giá trị −10000..10000
$big = [];
for ($k = 0; $k < 10000; $k++) $big[] = nextRand() % 20001 - 10000;
$adds = 0;
$slow = maxSubArrayQuadratic($big, $adds);
$fast = maxSubArray($big);
echo 'n = ' . count($big) . ": O(n²) cộng $adds lần, Kadane " . count($big) . ' lần, cùng ra ' . ($slow === $fast ? $fast : 'KHÁC NHAU') . "\n";

if (in_array('bench', $argv, true)) {
    // chạy cách nhanh nhiều lượt rồi chia, vì một lượt Kadane ngắn hơn độ phân giải của đồng hồ
    $timed = function (callable $f, int $reps): string {
        $t = hrtime(true);
        for ($r = 0; $r < $reps; $r++) $f();
        return sprintf('%.3f', (hrtime(true) - $t) / 1e6 / $reps);
    };
    echo 'thời gian mỗi lượt: O(n²) ' . $timed(fn() => maxSubArrayQuadratic($big), 1)
        . ' ms, chia để trị ' . $timed(fn() => maxSubArrayDivide($big), 10)
        . ' ms, Kadane ' . $timed(fn() => maxSubArray($big), 100) . " ms\n";
}
