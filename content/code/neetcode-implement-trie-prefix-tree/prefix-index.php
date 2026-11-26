<?php
declare(strict_types=1);

final class TrieNode
{
    public array $children = [];
    public bool $terminal = false;
}

final class Trie
{
    private TrieNode $root;

    public function __construct()
    {
        $this->root = new TrieNode();
    }

    public function insert(string $word): void
    {
        $node = $this->root;
        for ($i = 0, $length = strlen($word); $i < $length; $i++) {
            $node = $node->children[$word[$i]] ??= new TrieNode();
        }
        $node->terminal = true;
    }

    private function find(string $text): ?TrieNode
    {
        $node = $this->root;
        for ($i = 0, $length = strlen($text); $i < $length; $i++) {
            $node = $node->children[$text[$i]] ?? null;
            if ($node === null) {
                return null;
            }
        }
        return $node;
    }

    public function search(string $word): bool
    {
        return $this->find($word)?->terminal ?? false;
    }

    public function startsWith(string $prefix): bool
    {
        return $this->find($prefix) !== null;
    }
}

$trie = new Trie();
$long = str_repeat('a', 2000);
$cases = [
    ['startsWith', 'c', false],
    ['insert', 'cart', null],
    ['startsWith', 'car', true],
    ['search', 'car', false],
    ['search', 'cart', true],
    ['insert', 'car', null],
    ['insert', 'car', null],
    ['insert', 'cab', null],
    ['search', 'car', true],
    ['search', 'cab', true],
    ['search', 'cad', false],
    ['insert', $long, null],
    ['startsWith', substr($long, 0, -1), true],
    ['search', substr($long, 0, -1), false],
    ['search', $long, true],
];
$passed = 0;
foreach ($cases as [$method, $input, $expected]) {
    if ($trie->$method($input) !== $expected) {
        throw new RuntimeException("$method failed for length " . strlen($input));
    }
    $passed++;
}
echo "$passed/" . count($cases) . " ca đúng\n";
