<?php
declare(strict_types=1);

final class TreeNode {
    public function __construct(
        public int $val,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function kthSmallest(?TreeNode $root, int $k): int {
    $stack = [];
    while ($root !== null || $stack) {
        while ($root !== null) {
            $stack[] = $root;
            $root = $root->left;
        }
        $root = array_pop($stack);
        if (--$k === 0) return $root->val;
        $root = $root->right;
    }
    throw new InvalidArgumentException('k nằm ngoài số nút');
}

$tree = new TreeNode(3, new TreeNode(1, new TreeNode(0), new TreeNode(2)), new TreeNode(4));
foreach ([0,1,2,3,4] as $i => $expected) {
    if (!(kthSmallest($tree, $i + 1) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo "5/5 ca đúng\n";
