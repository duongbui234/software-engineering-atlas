<?php
// Jump Game (LeetCode 55): quay lui, ghi nhớ, bảng DP, tham lam xuôi và tham lam ngược
// Chạy: php -d xdebug.mode=off reach.php

$calls = 0;
$steps = 0;

// Quay lui: từ ô i thử mọi bước 1..nums[i], bước dài trước
function canJumpBacktrack(array $nums): bool {
    $last = count($nums) - 1;
    $dfs = function (int $i) use (&$dfs, $nums, $last): bool {
        global $calls;
        $calls++;
        if ($i === $last) return true;
        for ($step = min($nums[$i], $last - $i); $step >= 1; $step--) {
            if ($dfs($i + $step)) return true;
        }
        return false;
    };
    return $dfs(0);
}

// Ghi nhớ từ trên xuống: memo[i] là 0 chưa biết, 1 tới đích được, 2 kẹt
function canJumpMemo(array $nums): bool {
    $last = count($nums) - 1;
    $memo = array_fill(0, count($nums), 0);
    $dfs = function (int $i) use (&$dfs, &$memo, $nums, $last): bool {
        global $calls;
        $calls++;
        if ($i === $last) return true;
        if ($memo[$i] !== 0) return $memo[$i] === 1;
        for ($step = min($nums[$i], $last - $i); $step >= 1; $step--) {
            if ($dfs($i + $step)) {
                $memo[$i] = 1;
                return true;
            }
        }
        $memo[$i] = 2;
        return false;
    };
    return $dfs(0);
}

// Bảng DP từ dưới lên: good[i] đúng khi từ i nhảy tới được một ô good bên phải
function canJumpTable(array $nums): bool {
    global $steps;
    $n = count($nums);
    $good = array_fill(0, $n, false);
    $good[$n - 1] = true;
    for ($i = $n - 2; $i >= 0; $i--) {
        $end = min($i + $nums[$i], $n - 1);
        for ($j = $i + 1; $j <= $end; $j++) {
            $steps++;
            if ($good[$j]) {
                $good[$i] = true;
                break;
            }
        }
    }
    return $good[0];
}

// Tham lam xuôi: các ô tới được luôn là một khúc liền 0..farthest
function canJump(array $nums): bool {
    global $steps;
    $farthest = 0;
    $n = count($nums);
    for ($i = 0; $i < $n; $i++) {
        $steps++;
        if ($i > $farthest) return false; // ô i nằm ngoài khúc tới được: kẹt
        $farthest = max($farthest, $i + $nums[$i]);
        if ($farthest >= $n - 1) return true;
    }
    return true;
}

// Tham lam ngược: dời đích về ô trái nhất đã biết là tới đích được
function canJumpGoal(array $nums): bool {
    $goal = count($nums) - 1;
    for ($i = count($nums) - 2; $i >= 0; $i--) {
        if ($i + $nums[$i] >= $goal) $goal = $i; // từ i nhảy tới goal, nên i thành đích mới
    }
    return $goal === 0;
}

// Bản sai 1: quên kiểm tra i > farthest, cứ cộng tiếp cả những ô không tới được
function canJumpNoGuard(array $nums): bool {
    $farthest = 0;
    foreach ($nums as $i => $v) {
        $farthest = max($farthest, $i + $v);
    }
    return $farthest >= count($nums) - 1;
}

// Bản sai 2: mỗi lượt nhảy bước dài nhất từ ô đang đứng
function canJumpLongestHop(array $nums): bool {
    $i = 0;
    while ($i < count($nums) - 1) {
        if ($nums[$i] === 0) return false;
        $i += $nums[$i];
    }
    return true;
}

// Trọng tài độc lập: lan tập ô tới được cho tới khi không đổi nữa
function referee(array $nums): bool {
    $n = count($nums);
    $reach = array_fill(0, $n, false);
    $reach[0] = true;
    $changed = true;
    while ($changed) {
        $changed = false;
        for ($i = 0; $i < $n; $i++) {
            if (!$reach[$i]) continue;
            for ($j = $i + 1; $j <= $i + $nums[$i] && $j < $n; $j++) {
                if (!$reach[$j]) {
                    $reach[$j] = true;
                    $changed = true;
                }
            }
        }
    }
    return $reach[$n - 1];
}

const CORRECT = ['canJumpBacktrack', 'canJumpMemo', 'canJumpTable', 'canJump', 'canJumpGoal'];

function allCorrect(array $nums, bool $want): bool {
    foreach (CORRECT as $f) {
        if ($f($nums) !== $want) return false;
    }
    return true;
}

// Mảng tệ nhất cho bảng DP: mọi ô đều nhảy đúng tới ô số 0 ở vị trí n - 2
function worstCase(int $n): array {
    $a = [];
    for ($i = 0; $i < $n - 1; $i++) $a[] = $n - 2 - $i;
    $a[] = 0;
    return $a;
}

$cases = [
    [[0], true],
    [[1, 0], true],
    [[0, 1], false],
    [[2, 0, 0], true],
    [[1, 0, 1], false],
    [[2, 3, 0, 0, 1], true],
    [[5, 0, 0, 0, 0, 0], true],
    [[1, 2, 0, 1, 0, 3], false],
    [[2, 0, 2, 0, 1, 0], true],
    [[4, 0, 0, 0, 0, 1], false],
    [worstCase(10), false],
];
$ok = 0;
foreach ($cases as [$nums, $want]) {
    if (allCorrect($nums, $want) && referee($nums) === $want) $ok++;
    else echo 'sai ở ', json_encode($nums), "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";

// Đối chiếu: mọi mảng dài 1–6, mỗi phần tử từ 0 đến 3
$total = 0;
$good = 0;
function build(array $arr): void {
    global $total, $good;
    if (count($arr) > 0) {
        $total++;
        if (allCorrect($arr, referee($arr))) $good++;
    }
    if (count($arr) === 6) return;
    for ($v = 0; $v <= 3; $v++) build([...$arr, $v]);
}
build([]);
echo "$good/$total ca đúng (đối chiếu trọng tài lan tập)\n";

$score = fn(string $f) => count(array_filter($cases, fn($c) => $f($c[0]) === $c[1]));
echo 'Bản quên kiểm tra i > farthest: ' . $score('canJumpNoGuard') . '/' . count($cases) . " ca đúng\n";
echo 'Bản nhảy bước dài nhất: ' . $score('canJumpLongestHop') . '/' . count($cases) . " ca đúng\n";

$small = worstCase(20);
$calls = 0;
canJumpBacktrack($small);
$bt = $calls;
$calls = 0;
canJumpMemo($small);
echo "n = 20, mảng tệ nhất: quay lui $bt lượt gọi, ghi nhớ $calls lượt gọi\n";

$big = worstCase(10000);
$steps = 0;
canJumpTable($big);
$tableSteps = $steps;
$steps = 0;
canJump($big);
echo "n = 10000, mảng tệ nhất: bảng DP $tableSteps bước, tham lam $steps bước\n";

$t = hrtime(true);
canJumpTable($big);
$tableMs = (hrtime(true) - $t) / 1e6;
$t = hrtime(true);
for ($k = 0; $k < 100; $k++) canJump($big);
$greedyMs = (hrtime(true) - $t) / 1e6 / 100;
printf("Thời gian n = 10000: bảng DP %.1f ms, tham lam %.3f ms\n", $tableMs, $greedyMs);
