<?php
// LC 235 Lowest Common Ancestor of a Binary Search Tree: LCA tổng quát (hậu thứ tự), so hai đường đi,
// đi xuống theo thứ tự của BST (đệ quy và vòng lặp), và hai cách hiểu sai.
// Chạy: php lca.php (máy có Xdebug thì thêm -d xdebug.mode=off: Xdebug chặn đệ quy quá 512 tầng)
declare(strict_types=1);

final class TreeNode {
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;
    public function __construct(public int $val) {}
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

function find(?TreeNode $root, int $v): TreeNode {
    $node = $root;
    while ($node !== null && $node->val !== $v) $node = $v < $node->val ? $node->left : $node->right;
    if ($node === null) throw new RuntimeException("không có nút $v");
    return $node;
}

// Chuỗi lệch phải 0 → 1 → … → n-1: BST hợp lệ, cao n.
function rightChain(int $n): ?TreeNode {
    $root = null;
    for ($i = $n - 1; $i >= 0; $i--) { $t = new TreeNode($i); $t->right = $root; $root = $t; }
    return $root;
}

// Tháo cây bằng vòng lặp. PHP giải phóng chuỗi đối tượng lồng nhau bằng đệ quy trong C:
// để chuỗi 10⁵ nút tự hủy là tràn ngăn xếp C và chết bằng segfault, không bắt được.
function teardown(?TreeNode $root): void {
    $stack = $root === null ? [] : [$root];
    while ($stack) {
        $node = array_pop($stack);
        if ($node->left !== null) { $stack[] = $node->left; $node->left = null; }
        if ($node->right !== null) { $stack[] = $node->right; $node->right = null; }
    }
}

// Cách 1: LCA của cây nhị phân bất kỳ (LC 236), hậu thứ tự, O(n).
function lcaGeneral(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    if ($root === null || $root === $p || $root === $q) return $root; // === trên object: cùng một đối tượng
    $l = lcaGeneral($root->left, $p, $q);
    $r = lcaGeneral($root->right, $p, $q);
    if ($l !== null && $r !== null) return $root;
    return $l ?? $r;
}

// Cách 2: ghi đường từ gốc tới p và tới q, nút chung cuối cùng là đáp án.
function pathTo(?TreeNode $root, TreeNode $target): array {
    $path = [];
    $node = $root;
    while ($node !== null) {
        $path[] = $node;
        if ($node === $target) break;
        $node = $target->val < $node->val ? $node->left : $node->right;
    }
    return $path;
}
function lcaPaths(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    $a = pathTo($root, $p);
    $b = pathTo($root, $q);
    $i = 0;
    while ($i < count($a) && $i < count($b) && $a[$i] === $b[$i]) $i++;
    return $a[$i - 1];
}

// Cách 3: đi xuống theo thứ tự, đệ quy.
function lcaRecursive(?TreeNode $node, TreeNode $p, TreeNode $q): ?TreeNode {
    if ($node === null) return null;
    if ($p->val < $node->val && $q->val < $node->val) return lcaRecursive($node->left, $p, $q);
    if ($p->val > $node->val && $q->val > $node->val) return lcaRecursive($node->right, $p, $q);
    return $node;
}

// Cách 4: vòng lặp, O(1) bộ nhớ.
function lcaIterative(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    $node = $root;
    while ($node !== null) {
        if ($p->val < $node->val && $q->val < $node->val) $node = $node->left;
        elseif ($p->val > $node->val && $q->val > $node->val) $node = $node->right;
        else return $node;
    }
    return null;
}

// Hiểu sai 1: tưởng p nhỏ hơn q.
function wrongAssumeOrdered(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    $node = $root;
    while ($node !== null) {
        if ($q->val < $node->val) $node = $node->left;
        elseif ($p->val > $node->val) $node = $node->right;
        else return $node;
    }
    return null;
}

// Hiểu sai 2: dùng <= và >=.
function wrongNonStrict(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    $node = $root;
    while ($node !== null) {
        if ($p->val <= $node->val && $q->val <= $node->val) $node = $node->left;
        elseif ($p->val >= $node->val && $q->val >= $node->val) $node = $node->right;
        else return $node;
    }
    return null;
}

// Nhân hai hiệu: int của PHP là 64 bit, tích 4·10¹⁸ vẫn vừa nên dấu đúng.
function lcaProduct(?TreeNode $root, TreeNode $p, TreeNode $q): ?TreeNode {
    $node = $root;
    while ($node !== null) {
        $s = ($node->val - $p->val) * ($node->val - $q->val);
        if ($s <= 0) return $node;
        $node = $p->val < $node->val ? $node->left : $node->right;
    }
    return null;
}

$T = [20, 10, 30, 5, 15, 25, 35, null, null, 12, 17];
$cases = [
    ["hai phía của gốc (5, 35)", fn() => build($T), 5, 35, 20],
    ["cùng bên trái (5, 17)", fn() => build($T), 5, 17, 10],
    ["p là tổ tiên của q (10, 12)", fn() => build($T), 10, 12, 10],
    ["p lớn hơn q (17, 12)", fn() => build($T), 17, 12, 15],
    ["cùng bên phải (25, 35)", fn() => build($T), 25, 35, 30],
    ["gốc là p (20, 17)", fn() => build($T), 20, 17, 20],
    ["cây 2 nút (2, 1)", fn() => build([2, 1]), 2, 1, 2],
    ["giá trị ±10⁹ (10⁹, 10⁹ − 1)", fn() => build([-1000000000, null, 1000000000, 999999999]), 1000000000, 999999999, 1000000000],
    ["cùng phía, hiệu cỡ 5·10⁴ (50000, 50001)", fn() => build([0, null, 50000, null, 50001]), 50000, 50001, 50000],
    ["chuỗi tăng 10⁵ nút (99998, 99999)", fn() => rightChain(100000), 99998, 99999, 99998],
];

function check(string $name, array $cases): void {
    $bad = [];
    foreach ($cases as [$label, $make, $pv, $qv, $want]) {
        $root = $make();
        try {
            $r = $name($root, find($root, $pv), find($root, $qv));
            $got = $r === null ? "null" : (string)$r->val;
        } catch (Throwable $e) {
            $got = "ném " . get_class($e);
        }
        teardown($root);
        if ($got !== (string)$want) $bad[] = "$label → $got";
    }
    $n = count($cases);
    echo str_pad($name, 18) . " " . ($n - count($bad)) . "/$n ca đúng" . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}
foreach (['lcaGeneral', 'lcaPaths', 'lcaRecursive', 'lcaIterative', 'lcaProduct', 'wrongAssumeOrdered', 'wrongNonStrict'] as $fn) check($fn, $cases);

// Đối chiếu trên BST ngẫu nhiên.
mt_srand(235);
$agree = 0;
$N = 3000;
for ($t = 0; $t < $N; $t++) {
    $n = 2 + mt_rand(0, 29);
    $vals = [];
    for ($i = 0; $i < $n; $i++) $vals[] = $i * 3 - 40;
    shuffle($vals);
    $root = null;
    foreach ($vals as $v) {
        $t2 = new TreeNode($v);
        if ($root === null) { $root = $t2; continue; }
        $cur = $root;
        while (true) {
            if ($v < $cur->val) { if ($cur->left === null) { $cur->left = $t2; break; } $cur = $cur->left; }
            else { if ($cur->right === null) { $cur->right = $t2; break; } $cur = $cur->right; }
        }
    }
    $i = mt_rand(0, $n - 1);
    $j = mt_rand(0, $n - 2); if ($j >= $i) $j++;
    $p = find($root, $vals[$i]); $q = find($root, $vals[$j]);
    $a = lcaGeneral($root, $p, $q);
    $ok = $a === lcaPaths($root, $p, $q) && $a === lcaRecursive($root, $p, $q) && $a === lcaIterative($root, $p, $q) && $a === lcaProduct($root, $p, $q);
    if ($ok) $agree++;
}
echo "\nđối chiếu $N BST ngẫu nhiên 2..31 nút: năm cách khớp nhau $agree/$N\n";
