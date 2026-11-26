<?php
declare(strict_types=1);

final class TreeNode
{
    public function __construct(
        public int $value,
        public ?TreeNode $left = null,
        public ?TreeNode $right = null,
    ) {}
}

function addChildren(SplDoublyLinkedList $pending, mixed $left, mixed $right, bool $byLevel): void
{
    if ($byLevel) {
        $pending->push($left);
        $pending->push($right);
    } else {
        $pending->push($right);
        $pending->push($left);
    }
}

function serializeTree(?TreeNode $root, bool $byLevel = false): string
{
    $pending = new SplDoublyLinkedList();
    $pending->push($root);
    $tokens = [];

    while (!$pending->isEmpty()) {
        $node = $byLevel ? $pending->shift() : $pending->pop();
        if ($node === null) {
            $tokens[] = '#';
        } else {
            $tokens[] = (string) $node->value;
            addChildren($pending, $node->left, $node->right, $byLevel);
        }
    }

    return implode(',', $tokens);
}

function deserializeTree(string $wire, bool $byLevel = false): ?TreeNode
{
    $holder = new TreeNode(0);
    $pending = new SplDoublyLinkedList();
    $pending->push([$holder, 'left']);

    foreach (explode(',', $wire) as $token) {
        if ($pending->isEmpty()) {
            throw new InvalidArgumentException('extra token');
        }
        [$parent, $side] = $byLevel ? $pending->shift() : $pending->pop();
        if ($token === '#') {
            continue;
        }
        $value = (int) $token;
        if ($value < -1000 || $value > 1000 || (string) $value !== $token) {
            throw new InvalidArgumentException('invalid token');
        }
        $node = new TreeNode($value);
        $parent->$side = $node;
        addChildren($pending, [$node, 'left'], [$node, 'right'], $byLevel);
    }

    if (!$pending->isEmpty()) {
        throw new InvalidArgumentException('missing token');
    }
    return $holder->left;
}

function check(bool $ok): void
{
    if (!$ok) {
        throw new RuntimeException('test failed');
    }
}

$leaf = new TreeNode(5);
$examples = [
    [null, '#', '#'],
    [new TreeNode(0), '0,#,#', '0,#,#'],
    [new TreeNode(5, $leaf), '5,5,#,#,#', '5,5,#,#,#'],
    [new TreeNode(5, null, $leaf), '5,#,5,#,#', '5,#,5,#,#'],
    [
        new TreeNode(8, new TreeNode(-4, null, new TreeNode(0)), new TreeNode(8, new TreeNode(-1000), new TreeNode(1000))),
        '8,-4,#,0,#,#,8,-1000,#,#,1000,#,#',
        '8,-4,8,#,0,-1000,1000,#,#,#,#,#,#',
    ],
];
$invalid = ['', '1,#', '#,', '1x,#,#', '1001,#,#'];

foreach ([false, true] as $byLevel) {
    foreach ($examples as [$tree, $preorder, $level]) {
        $wire = $byLevel ? $level : $preorder;
        check(serializeTree($tree, $byLevel) === $wire);
        check(deserializeTree($wire, $byLevel) == $tree);
    }
    foreach (['left', 'right'] as $side) {
        $other = $side === 'left' ? 'right' : 'left';
        $chain = null;
        for ($i = 9_999; $i >= 0; $i--) {
            $node = new TreeNode($i % 11 - 5);
            $node->$side = $chain;
            $chain = $node;
        }
        $wire = serializeTree($chain, $byLevel);
        check(substr_count($wire, ',') === 20_000);
        $restored = deserializeTree($wire, $byLevel);
        for ($i = 0; $i < 10_000; $i++) {
            check($restored !== null && $restored->value === $i % 11 - 5 && $restored->$other === null);
            $restored = $restored->$side;
        }
        check($restored === null);
    }
    foreach ($invalid as $wire) {
        try {
            deserializeTree($wire, $byLevel);
        } catch (InvalidArgumentException) {
            continue;
        }
        throw new RuntimeException('accepted invalid wire');
    }
}
echo (count($examples) + 2 + count($invalid)) . "/12 ca đúng\n";
