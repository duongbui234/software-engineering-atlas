<?php
// LeetCode 309: mua bán cổ phiếu, bán xong phải nghỉ một ngày
const NEG = -1_000_000_000; // trạng thái chưa thể xảy ra

// Vét cạn trên (ngày, đang cầm cổ phiếu hay không)
function maxProfitBrute(array $prices, int &$calls = 0): int {
    $go = function (int $day, bool $holding) use (&$go, $prices, &$calls): int {
        $calls++;
        if ($day >= count($prices)) return 0;
        $wait = $go($day + 1, $holding);
        if ($holding) return max($wait, $prices[$day] + $go($day + 2, false)); // bán, nhảy qua ngày nghỉ
        return max($wait, -$prices[$day] + $go($day + 1, true)); // mua
    };
    return $go(0, false);
}

// Ghi nhớ: chỉ có 2n cặp (ngày, đang cầm); dùng isset vì 0 cũng là một đáp án đã tính
function maxProfitMemo(array $prices, int &$calls = 0): int {
    $n = count($prices);
    $memo = [[], []];
    $go = function (int $day, int $holding) use (&$go, &$memo, $prices, $n, &$calls): int {
        $calls++;
        if ($day >= $n) return 0;
        if (isset($memo[$holding][$day])) return $memo[$holding][$day];
        $wait = $go($day + 1, $holding);
        $act = $holding ? $prices[$day] + $go($day + 2, 0) : -$prices[$day] + $go($day + 1, 1);
        return $memo[$holding][$day] = max($wait, $act);
    };
    return $go(0, 0);
}

// Bảng ba trạng thái theo ngày: cầm, vừa bán, tay không
function maxProfitTable(array $prices): int {
    $n = count($prices);
    $hold = array_fill(0, $n, 0);
    $sold = array_fill(0, $n, 0);
    $rest = array_fill(0, $n, 0);
    $hold[0] = -$prices[0];
    $sold[0] = NEG;
    for ($i = 1; $i < $n; $i++) {
        $hold[$i] = max($hold[$i - 1], $rest[$i - 1] - $prices[$i]);
        $sold[$i] = $hold[$i - 1] + $prices[$i];
        $rest[$i] = max($rest[$i - 1], $sold[$i - 1]);
    }
    return max($sold[$n - 1], $rest[$n - 1]);
}

// Ba biến cuộn: mỗi ngày chỉ đọc giá trị của hôm trước
function maxProfit(array $prices): int {
    [$hold, $sold, $rest] = [-$prices[0], NEG, 0];
    for ($i = 1; $i < count($prices); $i++) {
        $prevSold = $sold;
        $sold = $hold + $prices[$i];
        $hold = max($hold, $rest - $prices[$i]);
        $rest = max($rest, $prevSold);
    }
    return max($sold, $rest);
}

// Đối chiếu độc lập: liệt kê mọi tập giao dịch (mua b, bán s), lần mua sau từ s + 2
function bestByTrades(array $prices, int $start = 0): int {
    $best = 0;
    $n = count($prices);
    for ($b = $start; $b < $n; $b++) {
        for ($s = $b + 1; $s < $n; $s++) {
            $best = max($best, $prices[$s] - $prices[$b] + bestByTrades($prices, $s + 2));
        }
    }
    return $best;
}

function allEqual(array $results, int $expected): bool {
    foreach ($results as $r) if ($r !== $expected) return false;
    return true;
}

$zigzag = [];
$ramps = [];
for ($i = 0; $i < 5000; $i++) {
    $zigzag[] = $i % 2 === 0 ? 1 : 3;
    $ramps[] = $i % 1000;
}
$cases = [
    [[7], 0],
    [[4, 2], 0],
    [[2, 9], 7],
    [[2, 6, 1, 7], 6],
    [[1, 3, 1, 5], 4],
    [range(1, 10), 9],
    [[9, 8, 7, 6, 5], 0],
    [[1, 3, 1, 3, 1, 3, 1, 3], 4],
    [[3, 3, 3, 3], 0],
    [[6, 1, 6, 1, 6, 0, 9], 14],
    [[4, 1, 2, 8, 0, 5, 6], 8],
    [$zigzag, 2500],
    [$ramps, 4991],
];
$ok = 0;
foreach ($cases as [$prices, $expected]) {
    $results = [maxProfit($prices), maxProfitTable($prices), maxProfitMemo($prices)];
    if (count($prices) <= 16) $results[] = maxProfitBrute($prices);
    if (count($prices) <= 10) $results[] = bestByTrades($prices);
    if (allEqual($results, $expected)) $ok++;
}
echo "$ok/" . count($cases) . " ca đúng\n";

$exhaustiveOk = 0;
$total = 0;
$arrays = [[]];
for ($k = 0; $k < count($arrays); $k++) {
    if (count($arrays[$k]) === 6) continue;
    for ($v = 0; $v <= 3; $v++) {
        $prices = [...$arrays[$k], $v];
        $arrays[] = $prices;
        $total++;
        $results = [maxProfitBrute($prices), maxProfitMemo($prices), maxProfitTable($prices), maxProfit($prices)];
        if (allEqual($results, bestByTrades($prices))) $exhaustiveOk++;
    }
}
echo "$exhaustiveOk/$total ca đúng (đối chiếu liệt kê giao dịch)\n";

$sample = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4];
$bruteCalls = 0;
$memoCalls = 0;
maxProfitBrute($sample, $bruteCalls);
maxProfitMemo($sample, $memoCalls);
echo "20 ngày: vét cạn $bruteCalls lượt gọi, memo $memoCalls lượt gọi\n";
