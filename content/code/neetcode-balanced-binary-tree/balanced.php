<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function isBalanced(?TreeNode $root): bool {
    return balancedHeight($root) !== -1;
}

function balancedHeight(?TreeNode $node): int {
    if ($node === null) return 0;
    $left = balancedHeight($node->left);
    if ($left === -1) return -1;
    $right = balancedHeight($node->right);
    return $right === -1 || abs($left - $right) > 1 ? -1 : 1 + max($left, $right);
}

$leaf = new TreeNode(3);
$child = new TreeNode(2, $leaf);
if (!(isBalanced(null))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(isBalanced($leaf))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(isBalanced(new TreeNode(1, $child, $leaf)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isBalanced(new TreeNode(1, $child)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isBalanced(new TreeNode(0, new TreeNode(1, $child), $child)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "5/5 ca đúng\n";
