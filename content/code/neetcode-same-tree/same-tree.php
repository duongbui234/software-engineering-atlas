<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function isSameTree(?TreeNode $a, ?TreeNode $b): bool {
    if ($a === null || $b === null) return $a === $b;
    return $a->val === $b->val
        && isSameTree($a->left, $b->left)
        && isSameTree($a->right, $b->right);
}

if (!(isSameTree(null, null))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSameTree(null, new TreeNode(0)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(isSameTree(new TreeNode(-1, new TreeNode(200)), new TreeNode(-1, new TreeNode(200))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSameTree(new TreeNode(1, new TreeNode(2)), new TreeNode(1, null, new TreeNode(2))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSameTree(new TreeNode(1), new TreeNode(2)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "5/5 ca đúng\n";
