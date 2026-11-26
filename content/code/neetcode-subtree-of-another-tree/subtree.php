<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function sameTree(?TreeNode $a, ?TreeNode $b): bool {
    if ($a === null || $b === null) return $a === $b;
    return $a->val === $b->val
        && sameTree($a->left, $b->left)
        && sameTree($a->right, $b->right);
}

function isSubtree(?TreeNode $root, ?TreeNode $sub): bool {
    if ($sub === null) return true;
    if ($root === null) return false;
    return sameTree($root, $sub) || isSubtree($root->left, $sub) || isSubtree($root->right, $sub);
}

$sub = new TreeNode(4, new TreeNode(1), new TreeNode(2));
if (!(isSubtree(new TreeNode(3, $sub, new TreeNode(5)), new TreeNode(4, new TreeNode(1), new TreeNode(2))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSubtree($sub, new TreeNode(4, new TreeNode(1))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSubtree(new TreeNode(12), new TreeNode(2)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isSubtree(new TreeNode(4, null, new TreeNode(1)), new TreeNode(4, new TreeNode(1))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(isSubtree($sub, new TreeNode(2)))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "5/5 ca đúng\n";
