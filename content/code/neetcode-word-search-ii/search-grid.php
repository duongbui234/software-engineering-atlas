<?php
declare(strict_types=1);

final class TrieNode
{
    public array $children = [];
    public ?string $word = null;
}

function findWords(array $board, array $words): array
{
    $root = new TrieNode();
    foreach ($words as $word) {
        $node = $root;
        for ($i = 0, $length = strlen($word); $i < $length; $i++) {
            $node = $node->children[$word[$i]] ??= new TrieNode();
        }
        $node->word = $word;
    }

    $found = [];
    for ($row = 0; $row < count($board); $row++) {
        for ($col = 0; $col < count($board[$row]); $col++) {
            visit($board, $root, $row, $col, $found);
        }
    }
    return $found;
}

function visit(array &$board, TrieNode $parent, int $row, int $col, array &$found): void
{
    $letter = $board[$row][$col] ?? '#';
    $node = $parent->children[$letter] ?? null;
    if ($node === null) {
        return;
    }

    if ($node->word !== null) {
        $found[] = $node->word;
        $node->word = null;
    }

    if ($node->children !== []) {
        $board[$row][$col] = '#';
        visit($board, $node, $row - 1, $col, $found);
        visit($board, $node, $row + 1, $col, $found);
        visit($board, $node, $row, $col - 1, $found);
        visit($board, $node, $row, $col + 1, $found);
        $board[$row][$col] = $letter;
    }

    if ($node->children === []) {
        unset($parent->children[$letter]);
    }
}

$cases = [
    [['oaan', 'etae', 'ihkr', 'iflv'], ['oath', 'pea', 'eat', 'rain'], ['eat', 'oath']],
    [['car', 'tpx', 'xex'], ['cap', 'cape', 'car', 'cart', 'capa', 'cat'], ['cap', 'cape', 'car']],
    [['ab', 'ba'], ['a', 'ab', 'aba', 'abab', 'ababa', 'aa'], ['a', 'ab', 'aba', 'abab']],
    [['a'], ['a', 'aa', 'b'], ['a']],
    [['ab'], ['z', 'aa'], []],
];
foreach ($cases as $i => [$rows, $words, $expected]) {
    $board = array_map('str_split', $rows);
    $actual = findWords($board, $words);
    sort($actual, SORT_STRING);
    if ($actual !== $expected) {
        throw new RuntimeException("Unexpected result in case $i");
    }
}
$total = count($cases);
echo "$total/$total ca đúng\n";
