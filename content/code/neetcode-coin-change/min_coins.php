<?php
declare(strict_types=1);

function minCoins(array $coins, int $amount): int {
    $impossible = $amount + 1;
    $dp = array_fill(0, $amount + 1, $impossible);
    $dp[0] = 0;

    foreach ($coins as $coin) {
        for ($sum = $coin; $sum <= $amount; $sum++) {
            $dp[$sum] = min($dp[$sum], $dp[$sum - $coin] + 1);
        }
    }
    return $dp[$amount] === $impossible ? -1 : $dp[$amount];
}

function byAmount(array $coins, int $amount): int {
    $impossible = $amount + 1;
    $dp = [0];
    for ($sum = 1; $sum <= $amount; $sum++) {
        $dp[$sum] = $impossible;
        foreach ($coins as $coin) {
            if ($coin <= $sum) {
                $dp[$sum] = min($dp[$sum], $dp[$sum - $coin] + 1);
            }
        }
    }
    return $dp[$amount] === $impossible ? -1 : $dp[$amount];
}

function search(array $coins, int $amount, bool $useMemo): array {
    $impossible = $amount + 1;
    $memo = [];
    $calls = 0;
    $visit = function (int $remaining) use (&$visit, &$memo, &$calls, $coins, $useMemo, $impossible): int {
        $calls++;
        if ($remaining === 0) return 0;
        if ($useMemo && isset($memo[$remaining])) return $memo[$remaining];

        $best = $impossible;
        foreach ($coins as $coin) {
            if ($coin <= $remaining) {
                $best = min($best, $visit($remaining - $coin) + 1);
            }
        }
        if ($useMemo) $memo[$remaining] = $best;
        return $best;
    };

    $best = $visit($amount);
    return [$best === $impossible ? -1 : $best, $calls];
}

$cases = [
    [[4, 7], 14, 2],
    [[4, 7], 13, -1],
    [[1, 5, 7], 10, 2],
    [[1], 10000, 10000],
    [[2147483647, 3], 9, 3],
    [[8, 9], 0, 0],
    [[4, 6], 7, -1],
    [[9, 4], 12, 3],
    [[14, 21], 28, 2],
    [[10, 15, 25], 30, 2],
];
foreach ($cases as [$coins, $amount, $want]) {
    if (minCoins($coins, $amount) !== $want || byAmount($coins, $amount) !== $want) {
        throw new RuntimeException('DP sai');
    }
    if ($amount <= 30 && (search($coins, $amount, false)[0] !== $want || search($coins, $amount, true)[0] !== $want)) {
        throw new RuntimeException('Đệ quy sai');
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));

[$brute, $bruteCalls] = search([4, 6, 9], 36, false);
[$memoized, $memoCalls] = search([4, 6, 9], 36, true);
if ($brute !== 4 || $memoized !== $brute) throw new RuntimeException('Ca đo sai');
printf("A=36: vét cạn %d, memo %d lượt gọi\n", $bruteCalls, $memoCalls);
