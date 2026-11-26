<?php
// LC 1448 Count Good Nodes in Binary Tree: vét cạn leo lên gốc, DFS mang max (đệ quy và lặp), BFS, và ba bản sai.
// Chạy: php good-nodes.php (máy có Xdebug thì thêm -d xdebug.mode=off: Xdebug chặn đệ quy quá 512 tầng)
declare(strict_types=1);

final class TreeNode {
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;
    public function __construct(public int $val = 0) {}
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(array $arr): ?TreeNode {
    if (count($arr) === 0 || $arr[0] === null) return null;
    $root = new TreeNode($arr[0]);
    $queue = new SplQueue();
    $queue->enqueue($root);
    $i = 1;
    $n = count($arr);
    while (!$queue->isEmpty() && $i < $n) {
        $node = $queue->dequeue();
        if ($i < $n && $arr[$i] !== null) { $node->left = new TreeNode($arr[$i]); $queue->enqueue($node->left); }
        $i++;
        if ($i < $n && $arr[$i] !== null) { $node->right = new TreeNode($arr[$i]); $queue->enqueue($node->right); }
        $i++;
    }
    return $root;
}

// Tháo cây bằng vòng lặp. PHP giải phóng chuỗi đối tượng lồng nhau bằng đệ quy trong C:
// để một chuỗi dài tự hủy có thể tràn ngăn xếp C và chết bằng segfault, không bắt được.
function teardown(?TreeNode $root): void {
    $stack = $root === null ? [] : [$root];
    while ($stack) {
        $node = array_pop($stack);
        if ($node->left !== null) { $stack[] = $node->left; $node->left = null; }
        if ($node->right !== null) { $stack[] = $node->right; $node->right = null; }
    }
}

function chain(int $n, callable $valueAt, string $side): TreeNode {
    $root = new TreeNode($valueAt(0));
    $cur = $root;
    for ($i = 1; $i < $n; $i++) { $cur->$side = new TreeNode($valueAt($i)); $cur = $cur->$side; }
    return $root;
}

// Cách 1: vét cạn, mỗi nút leo ngược lên gốc. O(n·h). Object không làm khóa mảng được: dùng SplObjectStorage.
function goodBrute(?TreeNode $root): int {
    if ($root === null) return 0;
    $parent = new SplObjectStorage();
    $parent[$root] = null;
    $order = [$root];
    for ($i = 0; $i < count($order); $i++) {
        $node = $order[$i];
        foreach ([$node->left, $node->right] as $child) {
            if ($child !== null) { $parent[$child] = $node; $order[] = $child; }
        }
    }
    $good = 0;
    foreach ($order as $node) {
        $ok = true;
        for ($a = $parent[$node]; $a !== null; $a = $parent[$a]) {
            if ($a->val > $node->val) { $ok = false; break; }
        }
        if ($ok) $good++;
    }
    return $good;
}

// Cách 2: DFS tiền thứ tự, mang max của đường đi xuống. O(n), O(h).
function goodDfs(?TreeNode $root): int {
    $go = function (?TreeNode $node, int $maxSoFar) use (&$go): int {
        if ($node === null) return 0;
        $good = $node->val >= $maxSoFar ? 1 : 0; // bằng max vẫn là tốt
        $m = max($maxSoFar, $node->val);
        return $good + $go($node->left, $m) + $go($node->right, $m);
    };
    return $go($root, PHP_INT_MIN);
}

// Cách 3: DFS lặp, ngăn xếp giữ cặp (nút, max tới nút đó).
function goodIterative(?TreeNode $root): int {
    if ($root === null) return 0;
    $good = 0;
    $stack = [[$root, $root->val]];
    while ($stack) {
        [$node, $maxSoFar] = array_pop($stack);
        if ($node->val >= $maxSoFar) $good++;
        $m = max($maxSoFar, $node->val);
        if ($node->right !== null) $stack[] = [$node->right, $m];
        if ($node->left !== null) $stack[] = [$node->left, $m];
    }
    return $good;
}

// Cách 4: BFS, hàng đợi SplQueue giữ cặp (nút, max).
function goodBfs(?TreeNode $root): int {
    if ($root === null) return 0;
    $good = 0;
    $queue = new SplQueue();
    $queue->enqueue([$root, $root->val]);
    while (!$queue->isEmpty()) {
        [$node, $maxSoFar] = $queue->dequeue();
        if ($node->val >= $maxSoFar) $good++;
        $m = max($maxSoFar, $node->val);
        if ($node->left !== null) $queue->enqueue([$node->left, $m]);
        if ($node->right !== null) $queue->enqueue([$node->right, $m]);
    }
    return $good;
}

// Sai 1: so ngặt.
function wrongStrict(?TreeNode $root): int {
    if ($root === null) return 0;
    $good = 1;
    $stack = [];
    if ($root->right !== null) $stack[] = [$root->right, $root->val];
    if ($root->left !== null) $stack[] = [$root->left, $root->val];
    while ($stack) {
        [$node, $maxSoFar] = array_pop($stack);
        if ($node->val > $maxSoFar) $good++; // sai: phải là >=
        $m = max($maxSoFar, $node->val);
        if ($node->right !== null) $stack[] = [$node->right, $m];
        if ($node->left !== null) $stack[] = [$node->left, $m];
    }
    return $good;
}
// Sai 2: khởi tạo max bằng 0.
function wrongInitZero(?TreeNode $root): int {
    if ($root === null) return 0;
    $good = 0;
    $stack = [[$root, 0]];
    while ($stack) {
        [$node, $maxSoFar] = array_pop($stack);
        if ($node->val >= $maxSoFar) $good++;
        $m = max($maxSoFar, $node->val);
        if ($node->right !== null) $stack[] = [$node->right, $m];
        if ($node->left !== null) $stack[] = [$node->left, $m];
    }
    return $good;
}
// Sai 3: một biến max dùng chung cho cả cây.
function wrongSharedMax(?TreeNode $root): int {
    if ($root === null) return 0;
    $max = PHP_INT_MIN; $good = 0;
    $stack = [$root];
    while ($stack) {
        $node = array_pop($stack);
        if ($node->val >= $max) { $good++; $max = $node->val; }
        if ($node->right !== null) $stack[] = $node->right;
        if ($node->left !== null) $stack[] = $node->left;
    }
    return $good;
}

$N = 100000;
$upChain = chain($N, fn($i) => -10000 + intdiv($i, 5), "right");
$downChain = chain($N, fn($i) => 10000 - intdiv($i, 5), "left");
$cases = [
    ["một nút", build([7]), 1],
    ["một nút âm", build([-10000]), 1],
    ["ba nút", build([2, 1, 3]), 2],
    ["bằng max vẫn tốt", build([5, 5, 5]), 3],
    ["toàn số âm", build([-3, -5, -1, -4, null, null, -2]), 2],
    ["max nhánh trái lớn", build([1, 9, 2, null, null, 2, 3]), 5],
    ["cây đầy 7 nút", build([4, 2, 6, 1, 3, 5, 7]), 3],
    ["xuống thấp rồi vượt lại", build([6, 2, null, 1, 7]), 2],
    ["chuỗi không giảm 10^5 nút", $upChain, $N],
    ["chuỗi không tăng 10^5 nút", $downChain, 5],
];
foreach (['goodBrute', 'goodDfs', 'goodIterative', 'goodBfs', 'wrongStrict', 'wrongInitZero', 'wrongSharedMax'] as $fn) {
    $ok = 0; $fails = [];
    foreach ($cases as [$label, $tree, $want]) {
        if ($fn === 'goodBrute' && $tree === $upChain) { $ok++; continue; } // vét cạn trên chuỗi 10^5 nút là 5·10^9 phép so
        try {
            $got = $fn($tree);
            if ($got === $want) $ok++; else $fails[] = "$label → $got";
        } catch (Throwable $e) { $fails[] = "$label → ném " . get_class($e); }
    }
    echo str_pad($fn, 15) . " $ok/" . count($cases) . " ca đúng" . ($fails ? "; sai ở " . implode(", ", $fails) : "") . "\n";
}
foreach ($cases as [, $tree]) teardown($tree);
$upChain = $downChain = $cases = null;

mt_srand(42);
function randomTree(int $n): TreeNode {
    $nodes = [new TreeNode(mt_rand(-3, 3))];
    while (count($nodes) < $n) {
        $p = $nodes[mt_rand(0, count($nodes) - 1)];
        $side = mt_rand(0, 1) === 0 ? "left" : "right";
        if ($p->$side === null) { $p->$side = new TreeNode(mt_rand(-3, 3)); $nodes[] = $p->$side; }
    }
    return $nodes[0];
}
$TRIALS = 3000; $agree = 0;
$miss = ['wrongStrict' => 0, 'wrongInitZero' => 0, 'wrongSharedMax' => 0];
for ($t = 0; $t < $TRIALS; $t++) {
    $tree = randomTree(1 + mt_rand(0, 11));
    $want = goodBrute($tree);
    if (goodDfs($tree) === $want && goodIterative($tree) === $want && goodBfs($tree) === $want) $agree++;
    foreach ($miss as $fn => $_) if ($fn($tree) !== $want) $miss[$fn]++;
}
echo "\nđối chiếu $TRIALS cây ngẫu nhiên 1..12 nút, giá trị -3..3: ba cách đúng khớp vét cạn $agree/$TRIALS\n";
echo "bản sai lệch với vét cạn: wrongStrict {$miss['wrongStrict']}, wrongInitZero {$miss['wrongInitZero']}, wrongSharedMax {$miss['wrongSharedMax']} cây\n";
