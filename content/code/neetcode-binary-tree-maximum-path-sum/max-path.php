<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function maxPathSum(TreeNode $root): int {
    $best = $root->val;
    $gain = function (?TreeNode $node) use (&$gain, &$best): int {
        if ($node === null) return 0;
        $left = max(0, $gain($node->left));
        $right = max(0, $gain($node->right));
        $best = max($best, $node->val + $left + $right);
        return $node->val + max($left, $right);
    };
    $gain($root);
    return $best;
}

if (!(maxPathSum(new TreeNode(-10, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)))) === 42)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(maxPathSum(new TreeNode(-3, new TreeNode(-2), new TreeNode(-1))) === -1)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(maxPathSum(new TreeNode(1, new TreeNode(2), new TreeNode(3))) === 6)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!(maxPathSum(new TreeNode(-1000)) === -1000)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "4/4 ca đúng\n";
