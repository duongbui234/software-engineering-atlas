<?php
declare(strict_types=1);

final class ListNode {
    public function __construct(public int $val, public ?ListNode $next = null) {}
}

function reverseKGroup(?ListNode $head, int $k): ?ListNode {
    $dummy = new ListNode(0, $head);
    $before = $dummy;
    while (true) {
        $end = $before;
        for ($i = 0; $i < $k && $end !== null; $i++) $end = $end->next;
        if ($end === null) return $dummy->next;
        $after = $end->next;
        $first = $current = $before->next;
        $prev = $after;
        while ($current !== $after) {
            $next = $current->next;
            $current->next = $prev;
            $prev = $current;
            $current = $next;
        }
        $before->next = $end;
        $before = $first;
    }
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

$cases = [
    [[1,2,3,4,5],2,[2,1,4,3,5]], [[1,2,3,4,5],3,[3,2,1,4,5]],
    [[1,2],1,[1,2]], [[1,1,2,3],4,[3,2,1,1]], [[1],1,[1]],
];
foreach ($cases as [$list, $k, $expected]) {
    if (!(valuesOf(reverseKGroup(listFrom($list), $k)) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
