<?php
declare(strict_types=1);

final class ListNode {
    public function __construct(public int $val, public ?ListNode $next = null) {}
}

function addTwoNumbers(?ListNode $a, ?ListNode $b): ?ListNode {
    $dummy = $tail = new ListNode(0);
    $carry = 0;
    while ($a !== null || $b !== null || $carry !== 0) {
        $sum = ($a->val ?? 0) + ($b->val ?? 0) + $carry;
        $carry = intdiv($sum, 10);
        $tail->next = new ListNode($sum % 10);
        $tail = $tail->next;
        $a = $a->next ?? null;
        $b = $b->next ?? null;
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

$cases = [[[2,4,3],[5,6,4],[7,0,8]], [[0],[0],[0]], [[9,9,9],[1],[0,0,0,1]], [[5],[5],[0,1]]];
foreach ($cases as [$a, $b, $want]) {
    if (!(valuesOf(addTwoNumbers(listFrom($a), listFrom($b))) === $want)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
