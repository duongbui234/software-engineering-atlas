<?php
declare(strict_types=1);

final class TreeNode
{
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;
    public function __construct(public int $val) {}
}

// Dựng cây từ mảng theo tầng kiểu LeetCode (null là chỗ trống).
function fromLevel(array $vals): ?TreeNode
{
    if (count($vals) === 0 || $vals[0] === null) return null;
    $root = new TreeNode($vals[0]);
    $queue = [$root];
    $head = 0;
    $i = 1;
    $n = count($vals);
    while ($i < $n) {
        $node = $queue[$head++];
        foreach (['left', 'right'] as $side) {
            $v = $i < $n ? $vals[$i] : null;
            if ($v !== null) {
                $child = new TreeNode($v);
                $node->$side = $child;
                $queue[] = $child;
            }
            $i++;
        }
    }
    return $root;
}

// Đọc cây ra mảng theo tầng, bỏ các null ở cuối.
function toLevel(?TreeNode $root): array
{
    $out = [];
    $queue = [$root];
    for ($head = 0; $head < count($queue); $head++) {
        $node = $queue[$head];
        $out[] = $node?->val;
        if ($node !== null) {
            $queue[] = $node->left;
            $queue[] = $node->right;
        }
    }
    while ($out && end($out) === null) array_pop($out);
    return $out;
}

function show(mixed $x): string
{
    return json_encode($x);
}

// In một dòng "<tên> <đúng>/<tổng> ca đúng; sai ở ...".
function report(string $name, int $total, array $bad, int $pad = 16): void
{
    echo str_pad($name, $pad) . ' ' . ($total - count($bad)) . "/$total ca đúng"
        . ($bad ? '; sai ở ' . implode(', ', $bad) : '') . "\n";
}

function leftChain(int $n): ?TreeNode
{
    $root = null;
    for ($i = 0; $i < $n; $i++) {
        $node = new TreeNode($i);
        $node->left = $root;
        $root = $node;
    }
    return $root;
}

// Chiều cao tính theo số nút trên đường dài nhất đi xuống: cây rỗng 0, một nút 1.
function height(?TreeNode $node): int
{
    if ($node === null) return 0;
    return 1 + max(height($node->left), height($node->right));
}

// Cách 1: đường kính = max(đi qua nút này, đường kính cây trái, đường kính cây phải). O(n²) với chuỗi lệch.
function diameterNaive(?TreeNode $root): int
{
    if ($root === null) return 0;
    $through = height($root->left) + height($root->right);
    return max($through, diameterNaive($root->left), diameterNaive($root->right));
}

// Cách 2: một lượt hậu thứ tự. Closure bắt $best THEO THAM CHIẾU (&$best) để ghi được ra ngoài,
// và bắt chính $dfs theo tham chiếu để gọi đệ quy. O(n).
function diameterOnePass(?TreeNode $root): int
{
    $best = 0;
    $dfs = function (?TreeNode $node) use (&$dfs, &$best): int {
        if ($node === null) return 0;
        $l = $dfs($node->left);
        $r = $dfs($node->right);
        $best = max($best, $l + $r); // đường đi rẽ ở node: l cạnh xuống trái + r cạnh xuống phải
        return 1 + max($l, $r);
    };
    $dfs($root);
    return $best;
}

// Cách 3: không đệ quy. Duyệt tiền thứ tự bằng ngăn xếp rồi xử lý theo thứ tự ngược;
// chiều cao từng nút cất trong SplObjectStorage (bảng băm theo danh tính object).
function diameterIterative(?TreeNode $root): int
{
    if ($root === null) return 0;
    $order = [];
    $stack = [$root];
    while ($stack) {
        $node = array_pop($stack);
        $order[] = $node;
        if ($node->left !== null) $stack[] = $node->left;
        if ($node->right !== null) $stack[] = $node->right;
    }
    $h = new SplObjectStorage();
    $best = 0;
    for ($i = count($order) - 1; $i >= 0; $i--) {
        $node = $order[$i];
        $l = $node->left === null ? 0 : $h[$node->left];
        $r = $node->right === null ? 0 : $h[$node->right];
        $best = max($best, $l + $r);
        $h[$node] = 1 + max($l, $r);
    }
    return $best;
}

// SAI: use ($best) không có &: closure nhận một BẢN SAO của $best lúc tạo,
// mọi phép gán bên trong ghi vào bản sao đó. Kết quả luôn 0.
function wrongByValue(?TreeNode $root): int
{
    $best = 0;
    $dfs = function (?TreeNode $node) use (&$dfs, $best): int {
        if ($node === null) return 0;
        $l = $dfs($node->left);
        $r = $dfs($node->right);
        $best = max($best, $l + $r);
        return 1 + max($l, $r);
    };
    $dfs($root);
    return $best;
}

$cases = [
    ['một nút', fn() => fromLevel([7]), 0],
    ['hai nút', fn() => fromLevel([7, 3]), 1],
    ['rẽ ở gốc', fn() => fromLevel([1, 2, 3, null, 4, 5, 6]), 4],
    ['không đi qua gốc', fn() => fromLevel([1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8]), 6],
    ['cây đầy 15 nút', fn() => fromLevel(range(0, 14)), 6],
    ['giá trị âm', fn() => fromLevel([-1, -2, -3, -4, null, null, -5]), 4],
    ['chuỗi lệch 10⁴ nút (giới hạn đề)', fn() => leftChain(10000), 9999],
];

foreach (['diameterNaive', 'diameterOnePass', 'diameterIterative', 'wrongByValue'] as $fn) {
    $bad = [];
    foreach ($cases as [$name, $make, $want]) {
        $got = $fn($make());
        if ($got !== $want) $bad[] = "$name → $got";
    }
    report($fn, count($cases), $bad, 18);
}
