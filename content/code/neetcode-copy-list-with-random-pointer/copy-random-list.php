<?php
declare(strict_types=1);

final class Node {
    public ?Node $next = null;
    public ?Node $random = null;

    public function __construct(public int $val) {}
}

function copyRandomList(?Node $head): ?Node {
    if ($head === null) return null;
    $copies = new SplObjectStorage();
    for ($old = $head; $old !== null; $old = $old->next) {
        $copies[$old] = new Node($old->val);
    }
    for ($old = $head; $old !== null; $old = $old->next) {
        $new = $copies[$old];
        $new->next = $old->next === null ? null : $copies[$old->next];
        $new->random = $old->random === null ? null : $copies[$old->random];
    }
    return $copies[$head];
}

if (!(copyRandomList(null) === null)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$single = new Node(-1);
$single->random = $single;
$copy = copyRandomList($single);
if (!($copy !== $single && $copy->val === -1 && $copy->next === null && $copy->random === $copy)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$a = new Node(7);
$b = new Node(7);
$a->next = $b;
$a->random = $b;
$b->random = $a;
$copy = copyRandomList($a);
if (!($copy !== $a && $copy->next !== $b && $copy !== $copy->next)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!($copy->val === 7 && $copy->next->val === 7 && $copy->next->next === null)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!($copy->random === $copy->next && $copy->next->random === $copy)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!($a->next === $b && $a->random === $b && $b->random === $a)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "3/3 ca đúng\n";
