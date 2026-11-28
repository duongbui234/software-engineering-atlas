<?php
// Gas Station (LeetCode 134): vét cạn từ mọi trạm, tham lam một lượt, tổng tiền tố nhỏ nhất
// Chạy: php -d xdebug.mode=off circuit.php

$steps = 0;

// Vét cạn: thử xuất phát ở từng trạm, chạy trọn vòng hoặc tới khi bình âm
function canCompleteBrute(array $gas, array $cost): int {
    global $steps;
    $n = count($gas);
    for ($s = 0; $s < $n; $s++) {
        $tank = 0;
        $ok = true;
        for ($k = 0; $k < $n; $k++) {
            $j = ($s + $k) % $n;
            $tank += $gas[$j] - $cost[$j];
            $steps++;
            if ($tank < 0) {
                $ok = false; // hụt xăng trên đoạn j -> j+1
                break;
            }
        }
        if ($ok) return $s;
    }
    return -1;
}

// Cách chính: một lượt, bình âm ở i thì bỏ mọi trạm từ start tới i, đặt start = i + 1
function canCompleteCircuit(array $gas, array $cost): int {
    global $steps;
    $total = 0; // tổng gas - cost của cả vòng
    $tank = 0; // xăng còn lại tính từ start
    $start = 0;
    $n = count($gas);
    for ($i = 0; $i < $n; $i++) {
        $d = $gas[$i] - $cost[$i];
        $total += $d;
        $tank += $d;
        $steps++;
        if ($tank < 0) {
            $start = $i + 1; // không trạm nào trong [start, i] đi qua được i
            $tank = 0;
        }
    }
    return $total < 0 ? -1 : $start; // tổng không âm thì start chắc chắn đi trọn vòng
}

// Tổng tiền tố: xuất phát ngay sau chỗ tổng tiền tố thấp nhất (lần đầu đạt mức thấp nhất)
function canCompletePrefix(array $gas, array $cost): int {
    $prefix = 0;
    $lowest = 0; // tiền tố rỗng (trước trạm 0) bằng 0
    $lowestAt = -1;
    $n = count($gas);
    for ($i = 0; $i < $n; $i++) {
        $prefix += $gas[$i] - $cost[$i];
        if ($prefix < $lowest) {
            $lowest = $prefix;
            $lowestAt = $i;
        }
    }
    return $prefix < 0 ? -1 : $lowestAt + 1;
}

// Bản sai: quên kiểm tra tổng, luôn trả start cuối cùng
function canCompleteNoTotal(array $gas, array $cost): int {
    $tank = 0;
    $start = 0;
    $n = count($gas);
    for ($i = 0; $i < $n; $i++) {
        $tank += $gas[$i] - $cost[$i];
        if ($tank < 0) {
            $start = $i + 1;
            $tank = 0;
        }
    }
    return $start;
}

// Mô phỏng một điểm xuất phát, dùng để xác nhận đáp án
function completes(array $gas, array $cost, int $s): bool {
    $n = count($gas);
    if ($s < 0 || $s >= $n) return false;
    $tank = 0;
    for ($k = 0; $k < $n; $k++) {
        $j = ($s + $k) % $n;
        $tank += $gas[$j] - $cost[$j];
        if ($tank < 0) return false;
    }
    return true;
}

// Đúng khi: tham lam khớp tiền tố, và trả -1 đúng lúc vét cạn trả -1, còn không thì trạm trả về đi trọn vòng
function agrees(array $gas, array $cost): bool {
    $g = canCompleteCircuit($gas, $cost);
    $p = canCompletePrefix($gas, $cost);
    $b = canCompleteBrute($gas, $cost);
    if ($g !== $p) return false;
    if ($b === -1) return $g === -1;
    return completes($gas, $cost, $g);
}

$cases = [
    [[5], [5], 0],
    [[2], [3], -1],
    [[1, 6, 2], [3, 1, 4], 1],
    [[4, 0, 5, 1, 2], [2, 3, 1, 4, 2], 2],
    [[0, 0, 0, 9], [2, 2, 2, 1], 3],
    [[3, 3, 3], [3, 3, 4], -1],
    [[0, 2, 0], [1, 0, 1], 1],
];
$ok = 0;
foreach ($cases as [$gas, $cost, $want]) {
    $got = [canCompleteBrute($gas, $cost), canCompleteCircuit($gas, $cost), canCompletePrefix($gas, $cost)];
    if ($got === [$want, $want, $want]) $ok++;
    else echo "sai ở ", json_encode($gas), " ", json_encode($cost), " ", json_encode($got), "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi vòng 1–4 trạm với gas, cost trong {0, 1, 2}
$total = 0;
$good = 0;
$wrong = 0;
function build(array $gas, array $cost): void {
    global $total, $good, $wrong;
    if (count($gas) > 0) {
        $total++;
        if (agrees($gas, $cost)) $good++;
        $b = canCompleteBrute($gas, $cost);
        $w = canCompleteNoTotal($gas, $cost);
        if ($b === -1 ? $w !== -1 : !completes($gas, $cost, $w)) $wrong++;
    }
    if (count($gas) === 4) return;
    for ($g = 0; $g <= 2; $g++) {
        for ($c = 0; $c <= 2; $c++) {
            build([...$gas, $g], [...$cost, $c]);
        }
    }
}
build([], []);
echo "$good/$total ca đúng (đối chiếu vét cạn)\n";
echo "Bỏ kiểm tra tổng: sai $wrong/$total ca\n";

// Đo: n trạm, trạm n-2 tốn rất nhiều xăng, chỉ trạm cuối đi trọn vòng
$n = 10000;
$gas = array_fill(0, $n, 1);
$cost = array_fill(0, $n, 0);
$cost[$n - 2] = $n + 1; // trạm n-2: gas 1, cost n+1, tức hụt n
$gas[$n - 1] = 2;
$steps = 0;
$t0 = hrtime(true);
$b = canCompleteBrute($gas, $cost);
$bruteMs = (hrtime(true) - $t0) / 1e6;
$bs = $steps;
$steps = 0;
$t0 = hrtime(true);
$g = canCompleteCircuit($gas, $cost);
$greedyMs = (hrtime(true) - $t0) / 1e6;
printf("n = %d, đáp án %d/%d: vét cạn %d bước (%.1f ms), tham lam %d bước (%.2f ms)\n", $n, $b, $g, $bs, $bruteMs, $steps, $greedyMs);
