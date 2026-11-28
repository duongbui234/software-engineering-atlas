<?php
// Ga MISC-03: tham lam trên mảng, một lượt trái sang phải với một trạng thái nhỏ.
// Chạy: php greedy.php

// Maximum Subarray (Kadane): tổng chạy âm thì bỏ, bắt đầu lại từ phần tử hiện tại.
function maxSubArray(array $nums): int {
    $run = $nums[0]; // tổng của đoạn tốt nhất kết thúc tại i
    $best = $nums[0]; // tốt nhất từ trước tới giờ
    for ($i = 1; $i < count($nums); $i++) {
        $run = $run < 0 ? $nums[$i] : $run + $nums[$i]; // tiền tố âm chỉ kéo tổng xuống: bỏ nó
        $best = max($best, $run);
    }
    return $best;
}

// Jump Game: giữ chỗ xa nhất có thể tới; đứng ở ô ngoài tầm là kẹt.
function canJump(array $nums): bool {
    $reach = 0;
    foreach ($nums as $i => $x) {
        if ($i > $reach) return false; // không ô nào trước đó nhảy tới được i
        $reach = max($reach, $i + $x);
    }
    return true;
}

// Jump Game II: quét theo lớp; hết lớp hiện tại thì nhảy thêm một bước.
function jump(array $nums): int {
    $jumps = 0;
    $end = 0; // ô cuối của lớp đang quét
    $far = 0; // chỗ xa nhất mà lớp kế tiếp tới được
    for ($i = 0; $i < count($nums) - 1; $i++) {
        $far = max($far, $i + $nums[$i]);
        if ($i === $end) { // đã quét hết lớp này
            $jumps++;
            $end = $far;
        }
    }
    return $jumps;
}

// Gas Station: bình hụt ở trạm i thì không điểm nào từ start tới i xuất phát được.
function canCompleteCircuit(array $gas, array $cost): int {
    $total = 0;
    $tank = 0;
    $start = 0;
    foreach ($gas as $i => $g) {
        $diff = $g - $cost[$i];
        $total += $diff;
        $tank += $diff;
        if ($tank < 0) { // xuất phát lại từ trạm kế tiếp
            $start = $i + 1;
            $tank = 0;
        }
    }
    return $total < 0 ? -1 : $start;
}

$cases = [
    ["maxSubArray đoạn giữa", fn() => maxSubArray([2, -5, 4, -1, 3, -7, 2]), 6],
    ["maxSubArray toàn âm", fn() => maxSubArray([-3, -1, -2]), -1],
    ["maxSubArray một phần tử", fn() => maxSubArray([5]), 5],
    ["maxSubArray toàn dương", fn() => maxSubArray([1, 2, 3]), 6],
    ["maxSubArray vượt qua số âm", fn() => maxSubArray([-1, 4, -2, 4, -10, 3]), 6],
    ["canJump kẹt ở số 0", fn() => canJump([2, 0, 1, 0, 3]), false],
    ["canJump tới đích", fn() => canJump([1, 2, 0, 1, 0]), true],
    ["canJump một ô", fn() => canJump([0]), true],
    ["canJump đứng yên", fn() => canJump([0, 1]), false],
    ["canJump kẹt giữa đường", fn() => canJump([3, 0, 0, 1, 0, 2]), false],
    ["jump ba bước", fn() => jump([1, 2, 0, 1, 0]), 3],
    ["jump hai bước", fn() => jump([3, 1, 1, 1, 1]), 2],
    ["jump một ô", fn() => jump([0]), 0],
    ["jump một bước", fn() => jump([4, 1, 1, 1, 1]), 1],
    ["jump từng ô", fn() => jump([1, 1, 1, 1]), 3],
    ["gas không đủ xăng", fn() => canCompleteCircuit([2, 3, 4], [3, 4, 3]), -1],
    ["gas xuất phát ở trạm 3", fn() => canCompleteCircuit([3, 1, 2, 5], [2, 4, 3, 1]), 3],
    ["gas một trạm", fn() => canCompleteCircuit([5], [4]), 0],
    ["gas tổng bằng 0", fn() => canCompleteCircuit([1, 4, 1], [2, 1, 3]), 1],
];

$ok = 0;
foreach ($cases as [$name, $run, $want]) {
    $got = $run();
    if ($got === $want) $ok++;
    else echo "SAI $name: được " . var_export($got, true) . ", cần " . var_export($want, true) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";
