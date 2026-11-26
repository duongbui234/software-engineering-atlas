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

// Cách 1: đệ quy. Độ sâu = 1 + độ sâu lớn hơn của hai cây con; cây rỗng sâu 0.
function maxDepthRecursive(?TreeNode $root): int
{
    if ($root === null) return 0;
    return 1 + max(maxDepthRecursive($root->left), maxDepthRecursive($root->right));
}

// Cách 2: ngăn xếp tự quản, mỗi phần tử là cặp [nút, độ sâu của nút].
function maxDepthStack(?TreeNode $root): int
{
    if ($root === null) return 0;
    $stack = [[$root, 1]];
    $best = 0;
    while ($stack) {
        [$node, $d] = array_pop($stack);
        $best = max($best, $d);
        if ($node->left !== null) $stack[] = [$node->left, $d + 1];
        if ($node->right !== null) $stack[] = [$node->right, $d + 1];
    }
    return $best;
}

// Cách 3: BFS theo tầng với SplQueue; mỗi vòng ngoài lấy ra đúng số nút của một tầng.
function maxDepthBfs(?TreeNode $root): int
{
    if ($root === null) return 0;
    $queue = new SplQueue();
    $queue->enqueue($root);
    $depth = 0;
    while (!$queue->isEmpty()) {
        $depth++;
        for ($k = $queue->count(); $k > 0; $k--) {
            $node = $queue->dequeue();
            if ($node->left !== null) $queue->enqueue($node->left);
            if ($node->right !== null) $queue->enqueue($node->right);
        }
    }
    return $depth;
}

// Sai: BFS quên vòng trong theo tầng, tăng depth mỗi lần lấy một nút ra, nên đếm ra số nút.
function wrongBfsPerNode(?TreeNode $root): int
{
    if ($root === null) return 0;
    $queue = [$root];
    $depth = 0;
    for ($head = 0; $head < count($queue); $head++) {
        $node = $queue[$head];
        $depth++;
        if ($node->left !== null) $queue[] = $node->left;
        if ($node->right !== null) $queue[] = $node->right;
    }
    return $depth;
}

$cases = [
    ['cây rỗng', [], 0],
    ['một nút', [5], 1],
    ['chỉ có con phải', [1, null, 2], 2],
    ['cây đủ 3 tầng', [1, 2, 3, 4, 5, 6, 7], 3],
    ['nhánh sâu bên phải', [8, 3, 10, 1, 6, null, 14, null, null, 4, 7, 13], 4],
    ['chuỗi trái 6 nút', [1, 2, null, 3, null, 4, null, 5, null, 6], 6],
    ['zigzag 5 tầng', [1, 2, null, null, 3, 4, null, null, 5], 5],
    ['giá trị âm và 0', [0, -1, -2, null, -3], 3],
];

$fns = ['maxDepthRecursive', 'maxDepthStack', 'maxDepthBfs', 'wrongBfsPerNode'];
foreach ($fns as $fn) {
    $bad = [];
    foreach ($cases as [$name, $input, $want]) {
        $got = $fn(fromLevel($input));
        if ($got !== $want) $bad[] = "$name → $got (đúng là $want)";
    }
    report($fn, count($cases), $bad, 18);
}

// Cây ngẫu nhiên tới 40 nút; độ sâu đúng được ghi lại ngay lúc dựng.
function randomTree(int $n): array
{
    if ($n === 0) return [null, 0];
    $root = new TreeNode(0);
    $slots = [[$root, 'left', 2], [$root, 'right', 2]];
    $depth = 1;
    for ($i = 1; $i < $n; $i++) {
        $j = mt_rand(0, count($slots) - 1);
        [$parent, $side, $d] = $slots[$j];
        $slots[$j] = $slots[count($slots) - 1];
        array_pop($slots);
        $node = new TreeNode($i);
        $parent->$side = $node;
        $depth = max($depth, $d);
        $slots[] = [$node, 'left', $d + 1];
        $slots[] = [$node, 'right', $d + 1];
    }
    return [$root, $depth];
}
mt_srand(104);
$T = 2000;
$ok = [0, 0, 0];
for ($t = 0; $t < $T; $t++) {
    [$root, $want] = randomTree(mt_rand(0, 40));
    foreach (array_slice($fns, 0, 3) as $j => $fn) {
        if ($fn($root) === $want) $ok[$j]++;
    }
}
echo "\nngẫu nhiên: " . implode(', ', array_map(fn($j) => "{$fns[$j]} {$ok[$j]}/$T", [0, 1, 2])) . "\n";

// Chuỗi lệch trái 10⁴ nút, cỡ lớn nhất của đề: PHP không giới hạn số tầng đệ quy
// (trừ khi Xdebug bật), vì khung hàm PHP nằm trên heap.
$chain = null;
for ($i = 0; $i < 10000; $i++) {
    $node = new TreeNode($i);
    $node->left = $chain;
    $chain = $node;
}
echo "chuỗi trái 10000 nút: đệ quy → " . maxDepthRecursive($chain) . ", ngăn xếp → " . maxDepthStack($chain) . "\n";
