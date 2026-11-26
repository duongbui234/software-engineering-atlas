<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function isValidBst(?TreeNode $node, ?int $lo = null, ?int $hi = null): bool {
    if ($node === null) return true;
    if (($lo !== null && $node->val <= $lo) || ($hi !== null && $node->val >= $hi)) {
        return false;
    }
    return isValidBst($node->left, $lo, $node->val)
        && isValidBst($node->right, $node->val, $hi);
}

if (!(isValidBst(null))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(isValidBst(new TreeNode(0, new TreeNode(-2147483648), new TreeNode(2147483647))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isValidBst(new TreeNode(1, new TreeNode(1))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isValidBst(new TreeNode(1, null, new TreeNode(1))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(!isValidBst(new TreeNode(5, new TreeNode(3, null, new TreeNode(6)), new TreeNode(8))))) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "5/5 ca đúng\n";
