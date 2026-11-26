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

// Cách 1: đệ quy. Gán phá cấu trúc: PHP dựng xong mảng vế phải rồi mới gán.
function invertRecursive(?TreeNode $root): ?TreeNode
{
    if ($root === null) return null;
    [$root->left, $root->right] = [invertRecursive($root->right), invertRecursive($root->left)];
    return $root;
}

// Cách 2: ngăn xếp tự quản; thứ tự thăm không quan trọng.
function invertStack(?TreeNode $root): ?TreeNode
{
    $stack = $root === null ? [] : [$root];
    while ($stack) {
        $node = array_pop($stack);
        [$node->left, $node->right] = [$node->right, $node->left];
        if ($node->left !== null) $stack[] = $node->left;
        if ($node->right !== null) $stack[] = $node->right;
    }
    return $root;
}

// Cách 3: BFS, hàng đợi là mảng với chỉ số đầu.
function invertBfs(?TreeNode $root): ?TreeNode
{
    $queue = $root === null ? [] : [$root];
    for ($head = 0; $head < count($queue); $head++) {
        $node = $queue[$head];
        [$node->left, $node->right] = [$node->right, $node->left];
        if ($node->left !== null) $queue[] = $node->left;
        if ($node->right !== null) $queue[] = $node->right;
    }
    return $root;
}

// Sai: hai câu gán nối tiếp, câu sau đọc giá trị câu trước vừa ghi đè.
function wrongOverwrite(?TreeNode $root): ?TreeNode
{
    if ($root === null) return null;
    $root->left = wrongOverwrite($root->right);
    $root->right = wrongOverwrite($root->left);
    return $root;
}

$cases = [
    ['cây rỗng', [], []],
    ['một nút', [1], [1]],
    ['chỉ có con trái', [1, 2], [1, null, 2]],
    ['ba nút', [2, 1, 3], [2, 3, 1]],
    ['cây đủ 3 tầng', [5, 3, 8, 1, 4, 7, 9], [5, 8, 3, 9, 7, 4, 1]],
    ['chuỗi trái thành chuỗi phải', [1, 2, null, 3], [1, null, 2, null, 3]],
    ['lệch hai bên', [1, 2, 3, null, 4, null, 5], [1, 3, 2, 5, null, 4]],
    ['giá trị âm và 0', [0, -1, null, -2, -3], [0, null, -1, -3, -2]],
];

$fns = ['invertRecursive', 'invertStack', 'invertBfs', 'wrongOverwrite'];
foreach ($fns as $fn) {
    $bad = [];
    foreach ($cases as [$name, $input, $want]) {
        $got = show(toLevel($fn(fromLevel($input))));
        if ($got !== show($want)) $bad[] = "$name → $got";
    }
    report($fn, count($cases), $bad);
}

// Đối chiếu ngẫu nhiên: viết cây gốc theo thứ tự phải, gốc, trái
// phải ra đúng chuỗi của cây đã đảo viết theo thứ tự trái, gốc, phải.
function ser(?TreeNode $t): string
{
    return $t === null ? '#' : '(' . ser($t->left) . ' ' . $t->val . ' ' . ser($t->right) . ')';
}
function serMirror(?TreeNode $t): string
{
    return $t === null ? '#' : '(' . serMirror($t->right) . ' ' . $t->val . ' ' . serMirror($t->left) . ')';
}
function randomTree(int $n): ?TreeNode
{
    if ($n === 0) return null;
    $root = new TreeNode(0);
    $slots = [[$root, 'left'], [$root, 'right']];
    for ($i = 1; $i < $n; $i++) {
        $j = mt_rand(0, count($slots) - 1);
        [$parent, $side] = $slots[$j];
        $slots[$j] = $slots[count($slots) - 1];
        array_pop($slots);
        $node = new TreeNode($i);
        $parent->$side = $node;
        $slots[] = [$node, 'left'];
        $slots[] = [$node, 'right'];
    }
    return $root;
}
$T = 2000;
$ok = [0, 0, 0];
for ($t = 0; $t < $T; $t++) {
    $n = mt_rand(0, 40);
    $seed = mt_rand();
    foreach (array_slice($fns, 0, 3) as $j => $fn) {
        mt_srand($seed);
        $root = randomTree($n); // mỗi cách đảo một bản riêng của cùng một cây
        $want = serMirror($root);
        if (ser($fn($root)) === $want) $ok[$j]++;
    }
    mt_srand($seed + 1);
}
echo "\nngẫu nhiên: " . implode(', ', array_map(fn($j) => "{$fns[$j]} {$ok[$j]}/$T", [0, 1, 2])) . "\n";
