<?php
declare(strict_types=1);

final class ListNode {
    public function __construct(public int $val, public ?ListNode $next = null) {}
}

function mergeKLists(array $lists): ?ListNode {
    $heap = new SplPriorityQueue();
    foreach ($lists as $node) {
        if ($node !== null) $heap->insert($node, -$node->val);
    }
    $dummy = $tail = new ListNode(0);
    while (!$heap->isEmpty()) {
        $node = $heap->extract();
        if ($node->next !== null) $heap->insert($node->next, -$node->next->val);
        $tail->next = $node;
        $tail = $node;
    }
    return $dummy->next;
}

function listFrom(array $values): ?ListNode {
    $head = null;
    foreach (array_reverse($values) as $val) $head = new ListNode($val, $head);
    return $head;
}

function valuesOf(?ListNode $head): array {
    $values = [];
    for (; $head !== null; $head = $head->next) $values[] = $head->val;
    return $values;
}

$cases = [[[[1,4,5],[1,3,4],[2,6]],[1,1,2,3,4,4,5,6]], [[],[]], [[[],[-2,0],[],[-2,10]],[-2,-2,0,10]], [[[9],[10]],[9,10]]];
foreach ($cases as [$lists, $expected]) {
    if (!(valuesOf(mergeKLists(array_map('listFrom', $lists))) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
