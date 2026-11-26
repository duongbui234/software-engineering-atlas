<?php
// NC-05 Top K Frequent Elements (LeetCode 347): sắp xếp, heap, bucket sort, quickselect.
// Chạy: php top-k-frequent.php   (PHP 8.2)
declare(strict_types=1);

// Đếm: array_count_values làm sẵn việc này (giá trị → số lần).
function countAll(array $nums): array { return array_count_values($nums); }

// Cách 1, đếm rồi sắp xếp m giá trị theo tần suất: O(n + m log m). arsort giữ khóa.
function bySorting(array $nums, int $k): array {
    $count = countAll($nums);
    arsort($count);
    return array_slice(array_keys($count), 0, $k);
}

// Heap nhỏ nhất theo tần suất. Bẫy: SplHeap::compare trả DƯƠNG khi $a phải nằm TRÊN $b.
// Với SplMinHeap, "nằm trên" nghĩa là nhỏ hơn, nên compare($a, $b) = $b[1] <=> $a[1].
class FreqMinHeap extends SplMinHeap {
    protected function compare(mixed $a, mixed $b): int { return $b[1] <=> $a[1]; }
}

// Cách 2, heap giữ k phần tử phổ biến nhất: O(n + m log k).
function byHeap(array $nums, int $k): array {
    $heap = new FreqMinHeap();
    foreach (countAll($nums) as $v => $c) {
        $heap->insert([$v, $c]);
        if ($heap->count() > $k) $heap->extract(); // đẩy kẻ yếu nhất ra
    }
    $out = [];
    while (!$heap->isEmpty()) $out[] = $heap->extract()[0];
    return array_reverse($out);
}

// Cách 3, bucket sort theo tần suất: O(n).
function byBuckets(array $nums, int $k): array {
    $buckets = array_fill(0, count($nums) + 1, []);
    foreach (countAll($nums) as $v => $c) $buckets[$c][] = $v;
    $out = [];
    for ($f = count($nums); $f > 0; $f--)
        foreach ($buckets[$f] as $v) { $out[] = $v; if (count($out) === $k) return $out; }
    return $out;
}

// Cách 4, quickselect với chốt ngẫu nhiên: O(m) trung bình.
function byQuickselect(array $nums, int $k): array {
    $e = [];
    foreach (countAll($nums) as $v => $c) $e[] = [$v, $c];
    $want = count($e) - $k;
    $lo = 0; $hi = count($e) - 1;
    while ($lo < $hi) {
        $p = random_int($lo, $hi);
        [$e[$p], $e[$hi]] = [$e[$hi], $e[$p]];
        $s = $lo;
        for ($i = $lo; $i < $hi; $i++)
            if ($e[$i][1] < $e[$hi][1]) { [$e[$i], $e[$s]] = [$e[$s], $e[$i]]; $s++; }
        [$e[$s], $e[$hi]] = [$e[$hi], $e[$s]];
        if ($s === $want) break;
        if ($s < $want) $lo = $s + 1; else $hi = $s - 1;
    }
    return array_column(array_slice($e, $want), 0);
}

$cases = [
    [[1, 1, 1, 2, 2, 3], 2, [1, 2]],
    [[1], 1, [1]],
    [[4, 4, 4, 4, -1, -1, -1, 2, 2, 7], 3, [-1, 2, 4]],
    [[5, 3, 5, 3, 5, 9, 9, 9, 9], 1, [9]],
];
$sorted = function (array $a): array { sort($a); return $a; };
foreach (['bySorting', 'byHeap', 'byBuckets', 'byQuickselect'] as $fn) {
    $ok = count(array_filter($cases, fn($c) => $sorted($fn($c[0], $c[1])) === $c[2]));
    printf("%-14s %d/%d ca đúng\n", $fn, $ok, count($cases));
}

// ── bẫy: viết compare theo thói quen ($a <=> $b) biến min-heap thành max-heap ──
$h = new class extends SplMinHeap { protected function compare(mixed $a, mixed $b): int { return $a <=> $b; } };
foreach ([3, 1, 2] as $x) $h->insert($x);
echo "\nSplMinHeap với compare(\$a, \$b) = \$a <=> \$b lấy ra trước: ", $h->top(), " (tưởng là 1)\n";
