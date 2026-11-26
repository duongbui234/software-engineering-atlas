<?php
// LC 105: dựng cây từ tiền thứ tự và trung thứ tự. Ba cách: quét, tra chỉ mục, ngăn xếp.
// Chạy: php rebuild.php (máy có Xdebug thì thêm -d xdebug.mode=off)
declare(strict_types=1);

final class TreeNode {
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;
    public function __construct(public int $value) {}
}

// $findRoot($value, $lo) trả vị trí của gốc trong trung thứ tự.
function buildRanges(array $preorder, callable $findRoot): ?TreeNode {
    $next = 0;
    // $next phải đi vào closure bằng tham chiếu (&): bản sao thì mọi nút đều lấy $preorder[0].
    $build = function (int $lo, int $hi) use (&$build, &$next, $preorder, $findRoot): ?TreeNode {
        if ($lo === $hi) return null;
        $root = new TreeNode($preorder[$next++]);
        $mid = $findRoot($root->value, $lo);
        $root->left = $build($lo, $mid);
        $root->right = $build($mid + 1, $hi);
        return $root;
    };
    return $build(0, count($preorder));
}

function scanFrom(array $inorder, int $value, int $lo): int {
    while ($inorder[$lo] !== $value) $lo++;
    return $lo;
}

function byScan(array $preorder, array $inorder): ?TreeNode {
    return buildRanges($preorder, fn(int $value, int $lo): int => scanFrom($inorder, $value, $lo));
}

function byIndex(array $preorder, array $inorder): ?TreeNode {
    $index = array_flip($inorder); // giá trị → vị trí; giá trị trùng thì vị trí sau đè vị trí trước
    return buildRanges($preorder, fn(int $value, int $lo): int => $index[$value]);
}

function byStack(array $preorder, array $inorder): ?TreeNode {
    if (count($preorder) === 0) return null;
    $root = new TreeNode($preorder[0]);
    $pending = [$root];
    $nextIn = 0;

    for ($i = 1; $i < count($preorder); $i++) {
        $child = new TreeNode($preorder[$i]);
        $parent = end($pending);

        if ($parent->value !== $inorder[$nextIn]) {
            $parent->left = $child;
        } else {
            while ($pending && end($pending)->value === $inorder[$nextIn]) {
                $parent = array_pop($pending);
                $nextIn++;
            }
            $parent->right = $child;
        }

        $pending[] = $child;
    }

    return $root;
}

function check(?TreeNode $root, array $preorder, array $inorder): void {
    $before = [];
    $between = [];
    $pending = [];
    while ($root !== null || $pending) {
        while ($root !== null) {
            $before[] = $root->value;
            $pending[] = $root;
            $root = $root->left;
        }
        $root = array_pop($pending);
        $between[] = $root->value;
        $root = $root->right;
    }
    if ($before !== $preorder || $between !== $inorder) throw new RuntimeException("cây sai");
}

$cases = [
    [[-3000], [-3000]],
    [[8, 14, 5, -2, 4, 0], [14, 5, 8, 4, -2, 0]],
    [[1, 2, 3, 4], [4, 3, 2, 1]],
    [[1, 2, 3, 4], [1, 2, 3, 4]],
    [[1, -2, 3, -4], [-2, -4, 3, 1]],
];

$ok = 0;
foreach (['byScan', 'byIndex', 'byStack'] as $rebuild) {
    foreach ($cases as [$preorder, $inorder]) {
        check($rebuild($preorder, $inorder), $preorder, $inorder);
        $ok++;
    }
}

$straight = range(1, 3000);
foreach ([$straight, array_reverse($straight)] as $inorder) {
    check(byStack($straight, $inorder), $straight, $inorder);
    $ok++;
}
echo "$ok/" . (count($cases) * 3 + 2) . " ca đúng\n";
