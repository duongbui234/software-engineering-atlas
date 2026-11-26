<?php
declare(strict_types=1);

final class GraphNode {
    public array $neighbors = [];
    public function __construct(public int $val) {}
}

function cloneGraph(?GraphNode $root): ?GraphNode {
    if ($root === null) return null;
    $copies = new SplObjectStorage();
    $queue = new SplQueue();
    $copies[$root] = new GraphNode($root->val);
    $queue->enqueue($root);
    while (!$queue->isEmpty()) {
        $node = $queue->dequeue();
        $copy = $copies[$node];
        foreach ($node->neighbors as $neighbor) {
            if (!$copies->contains($neighbor)) {
                $copies[$neighbor] = new GraphNode($neighbor->val);
                $queue->enqueue($neighbor);
            }
            $copy->neighbors[] = $copies[$neighbor];
        }
    }
    return $copies[$root];
}

if (!(cloneGraph(null) === null)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$single = new GraphNode(1);
$clone = cloneGraph($single);
if (!($clone !== $single && $clone->val === 1 && $clone->neighbors === [])) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$a = new GraphNode(1);
$b = new GraphNode(2);
$c = new GraphNode(3);
$a->neighbors = [$b, $c];
$b->neighbors = [$a, $c];
$c->neighbors = [$a, $b];
$copy = cloneGraph($a);
[$bCopy, $cCopy] = $copy->neighbors;
if (!($copy !== $a && $bCopy !== $b && $cCopy !== $c)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!([$copy->val, $bCopy->val, $cCopy->val] === [1,2,3])) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
if (!($bCopy->neighbors === [$copy, $cCopy] && $cCopy->neighbors === [$copy, $bCopy])) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "3/3 ca đúng\n";
