<?php
declare(strict_types=1);

final class TrieNode
{
    public array $children = [];
    public bool $terminal = false;
}

final class WordDictionary
{
    private TrieNode $root;

    public function __construct()
    {
        $this->root = new TrieNode();
    }

    public function addWord(string $word): void
    {
        $node = $this->root;
        for ($i = 0, $length = strlen($word); $i < $length; $i++) {
            $node = $node->children[$word[$i]] ??= new TrieNode();
        }
        $node->terminal = true;
    }

    public function search(string $pattern): bool
    {
        return $this->matches($this->root, $pattern, 0);
    }

    private function matches(TrieNode $node, string $pattern, int $offset): bool
    {
        if ($offset === strlen($pattern)) {
            return $node->terminal;
        }

        $letter = $pattern[$offset];
        if ($letter !== '.') {
            $child = $node->children[$letter] ?? null;
            return $child !== null && $this->matches($child, $pattern, $offset + 1);
        }

        foreach ($node->children as $child) {
            if ($this->matches($child, $pattern, $offset + 1)) {
                return true;
            }
        }
        return false;
    }
}

$dictionary = new WordDictionary();
if ($dictionary->search('.')) {
    throw new RuntimeException('Empty dictionary matched');
}
foreach (['bad', 'dad', 'mad', 'bad', 'cap', 'cape', str_repeat('a', 25)] as $word) {
    $dictionary->addWord($word);
}
$cases = [
    ['pad', false],
    ['bad', true],
    ['.ad', true],
    ['b..', true],
    ['..z', false],
    ['.', false],
    ['ca', false],
    ['ca.', true],
    ['ca..', true],
    ['ca..e', false],
    [str_repeat('a', 24) . '.', true],
];
foreach ($cases as [$pattern, $expected]) {
    if ($dictionary->search($pattern) !== $expected) {
        throw new RuntimeException("Unexpected result for $pattern");
    }
}
$total = count($cases) + 1;
echo "$total/$total ca đúng\n";
