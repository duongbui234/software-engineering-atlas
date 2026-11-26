<?php
// LeetCode 703, Kth Largest Element in a Stream: sắp lại mỗi lần, min-heap k chỗ (SplMinHeap), bản sai dùng SplPriorityQueue.
// Chạy: php kth-largest-stream.php
declare(strict_types=1);

interface Stream { public function add(int $val): int; }

// Cách thẳng: giữ mọi số, mỗi lần add thì sắp lại và đọc ô thứ k từ cuối. O(n log n) mỗi lần add.
final class SortEachAdd implements Stream
{
    private array $nums;
    public function __construct(private int $k, array $nums) { $this->nums = $nums; }
    public function add(int $val): int
    {
        $this->nums[] = $val;
        sort($this->nums); // sort() của PHP so số theo giá trị, không như sort() mặc định của JS
        return $this->nums[count($this->nums) - $this->k];
    }
}

// Min-heap k chỗ: SplMinHeap giữ k số lớn nhất đã thấy; đỉnh (top) là số lớn thứ k.
final class KthLargest implements Stream
{
    private SplMinHeap $heap;
    public function __construct(private int $k, array $nums)
    {
        $this->heap = new SplMinHeap();
        foreach ($nums as $x) $this->add($x);
    }
    public function add(int $val): int
    {
        if ($this->heap->count() < $this->k) $this->heap->insert($val);
        elseif ($val > $this->heap->top()) { // mạnh hơn ứng viên yếu nhất: thay nó
            $this->heap->extract(); // SplMinHeap không có "thay đỉnh": lấy ra rồi thêm vào
            $this->heap->insert($val);
        }
        return $this->heap->top();
    }
}

// SAI: SplPriorityQueue lấy phần tử ưu tiên CAO nhất ra trước, tức là max-heap.
// Bỏ bớt bằng extract() thì bỏ số lớn nhất: giữ k số nhỏ nhất, đỉnh là số lớn nhất trong đó.
final class PriorityQueueKthLargest implements Stream
{
    private SplPriorityQueue $pq;
    public function __construct(private int $k, array $nums)
    {
        $this->pq = new SplPriorityQueue();
        foreach ($nums as $x) $this->add($x);
    }
    public function add(int $val): int
    {
        $this->pq->insert($val, $val);
        if ($this->pq->count() > $this->k) $this->pq->extract();
        return $this->pq->top();
    }
}

// Ca thử: [tên, k, nums, các số add, các kết quả mong đợi]
$cases = [
    ["ví dụ của đề", 3, [4, 5, 8, 2], [3, 5, 10, 9, 4], [4, 5, 5, 8, 8]],
    ["nhiều số 7 trùng", 4, [7, 7, 7, 7, 8, 3], [2, 10, 9, 9], [7, 7, 7, 8]],
    ["nums rỗng, k = 1", 1, [], [-3, -2, -4, 0, 4], [-3, -2, -2, 0, 4]],
    ["nums thiếu một số", 2, [0], [-1, 1, -2, -4, 3], [-1, 0, 0, 0, 1]],
    ["số trùng", 2, [5, 5], [5, 1, 6], [5, 5, 5]],
    ["k bằng cả luồng", 3, [1, 2], [3, 0], [1, 1]],
    ["số âm", 2, [-10, -20], [-5, -30, -1], [-10, -10, -5]],
];

// Cùng bộ sinh số với bản TS (LCG 32 bit), nên ca ngẫu nhiên giống hệt. & 0xFFFFFFFF giữ kết quả trong 32 bit.
function makeRandom(int $seed): Closure
{
    $s = $seed & 0xFFFFFFFF;
    return function () use (&$s): float {
        $s = ($s * 1664525 + 1013904223) & 0xFFFFFFFF;
        return $s / 2 ** 32;
    };
}

$rnd = makeRandom(7);
$k = 50;
$nums = [];
for ($i = 0; $i < 200; $i++) $nums[] = (int) floor($rnd() * 20001) - 10000;
$adds = [];
for ($i = 0; $i < 500; $i++) $adds[] = (int) floor($rnd() * 20001) - 10000;
$ref = new SortEachAdd($k, $nums);
$cases[] = ["ngẫu nhiên 200 + 500 số, k = 50", $k, $nums, $adds, array_map(fn($v) => $ref->add($v), $adds)];

foreach ([SortEachAdd::class, KthLargest::class, PriorityQueueKthLargest::class] as $cls) {
    $bad = [];
    foreach ($cases as [$name, $k, $nums, $adds, $want]) {
        $s = new $cls($k, $nums);
        $got = array_map(fn($v) => $s->add($v), $adds);
        if ($got !== $want) $bad[] = count($adds) <= 5 ? "$name → [" . implode(", ", $got) . "]" : $name;
    }
    echo str_pad($cls, 24) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở: " . implode("; ", $bad) : "") . "\n";
}

// SplPriorityQueue với hai phần tử cùng ưu tiên: thứ tự lấy ra không được bảo đảm theo thứ tự thêm.
$pq = new SplPriorityQueue();
foreach (["a", "b", "c"] as $x) $pq->insert($x, 1);
$out = [];
while (!$pq->isEmpty()) $out[] = $pq->extract();
echo "\nSplPriorityQueue, ba phần tử cùng ưu tiên 1, thêm a, b, c, lấy ra: " . implode(", ", $out) . "\n";
