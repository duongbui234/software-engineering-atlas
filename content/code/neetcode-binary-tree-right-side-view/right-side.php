<?php
// LC 199 Binary Tree Right Side View: BFS lấy nút cuối mỗi tầng, BFS phải trước, DFS phải trước (đệ quy và lặp),
// DFS ghi đè, và ba cách sai.
// Chạy: php right-side.php (máy có Xdebug thì thêm -d xdebug.mode=off: Xdebug chặn đệ quy quá 512 tầng)
declare(strict_types=1);

final class TreeNode {
    public ?TreeNode $left = null;
    public ?TreeNode $right = null;
    public function __construct(public int $val = 0) {}
}

// Dựng cây từ mảng theo tầng kiểu LeetCode: null là chỗ trống.
function build(array $arr): ?TreeNode {
    if (count($arr) === 0 || $arr[0] === null) return null;
    $root = new TreeNode($arr[0]);
    $queue = new SplQueue();
    $queue->enqueue($root);
    $i = 1;
    $n = count($arr);
    while (!$queue->isEmpty() && $i < $n) {
        $node = $queue->dequeue();
        if ($i < $n && $arr[$i] !== null) { $node->left = new TreeNode($arr[$i]); $queue->enqueue($node->left); }
        $i++;
        if ($i < $n && $arr[$i] !== null) { $node->right = new TreeNode($arr[$i]); $queue->enqueue($node->right); }
        $i++;
    }
    return $root;
}

// Tháo cây bằng vòng lặp. PHP giải phóng chuỗi đối tượng lồng nhau bằng đệ quy trong C:
// để một chuỗi dài tự hủy có thể tràn ngăn xếp C và chết bằng segfault, không bắt được.
function teardown(?TreeNode $root): void {
    $stack = $root === null ? [] : [$root];
    while ($stack) {
        $node = array_pop($stack);
        if ($node->left !== null) { $stack[] = $node->left; $node->left = null; }
        if ($node->right !== null) { $stack[] = $node->right; $node->right = null; }
    }
}

function leftChain(int $n): ?TreeNode {
    $root = null;
    for ($v = $n; $v >= 1; $v--) { $t = new TreeNode($v); $t->left = $root; $root = $t; }
    return $root;
}
function complete(int $n): ?TreeNode { return build(range(1, $n)); }

// Cách 1: BFS, chụp cỡ tầng, nút cuối của tầng là nút nhìn thấy.
function bfsLast(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = [$root];
    while ($queue) {
        $size = count($queue); // chụp cỡ tầng
        $next = [];
        foreach ($queue as $i => $node) {
            if ($i === $size - 1) $res[] = $node->val;
            if ($node->left !== null) $next[] = $node->left;
            if ($node->right !== null) $next[] = $node->right;
        }
        $queue = $next;
    }
    return $res;
}

// Cách 2: BFS đẩy con phải trước, nút đầu của tầng là nút nhìn thấy.
function bfsRightFirst(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = new SplQueue();
    $queue->enqueue($root);
    while (!$queue->isEmpty()) {
        $size = count($queue);
        $res[] = $queue->bottom()->val; // bottom() là đầu hàng của SplQueue
        for ($i = 0; $i < $size; $i++) {
            $node = $queue->dequeue();
            if ($node->right !== null) $queue->enqueue($node->right);
            if ($node->left !== null) $queue->enqueue($node->left);
        }
    }
    return $res;
}

// Cách 3: DFS phải trước; nút đầu tiên chạm tới một độ sâu mới là nút nhìn thấy.
function dfsRightFirst(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use (&$res, &$go): void {
        if ($node === null) return;
        if ($depth === count($res)) $res[] = $node->val;
        $go($node->right, $depth + 1);
        $go($node->left, $depth + 1);
    };
    $go($root, 0);
    return $res;
}

// Cách 3b: DFS phải trước bằng ngăn xếp tự quản.
function dfsRightFirstIterative(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $stack = [[$root, 0]];
    while ($stack) {
        [$node, $depth] = array_pop($stack);
        if ($depth === count($res)) $res[] = $node->val;
        if ($node->left !== null) $stack[] = [$node->left, $depth + 1]; // đẩy trái trước để phải ra trước
        if ($node->right !== null) $stack[] = [$node->right, $depth + 1];
    }
    return $res;
}

// Cách 4: DFS trái trước, ghi đè res[depth].
function dfsOverwrite(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use (&$res, &$go): void {
        if ($node === null) return;
        $res[$depth] = $node->val;
        $go($node->left, $depth + 1);
        $go($node->right, $depth + 1);
    };
    $go($root, 0);
    ksort($res); // khóa của mảng PHP giữ thứ tự chèn, không phải thứ tự số; ở đây chèn theo độ sâu tăng dần nên ksort chỉ để chắc
    return $res;
}

function wrongRightPointers(?TreeNode $root): array {
    $res = [];
    for ($node = $root; $node !== null; $node = $node->right) $res[] = $node->val;
    return $res;
}
function wrongLeftFirst(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use (&$res, &$go): void {
        if ($node === null) return;
        if ($depth === count($res)) $res[] = $node->val;
        $go($node->left, $depth + 1);
        $go($node->right, $depth + 1);
    };
    $go($root, 0);
    return $res;
}
function wrongLiveLength(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = [$root];
    while ($queue) {
        $last = $queue[0];
        for ($i = 0; $i < count($queue); $i++) {
            $node = array_shift($queue);
            $last = $node;
            if ($node->left !== null) $queue[] = $node->left;
            if ($node->right !== null) $queue[] = $node->right;
        }
        $res[] = $last->val;
    }
    return $res;
}

$cases = [
    ["cây rỗng", fn() => build([]), []],
    ["một nút", fn() => build([7]), [7]],
    ["cây đầy 7 nút", fn() => build([1, 2, 3, 4, 5, 6, 7]), [1, 3, 7]],
    ["nhánh trái sâu hơn", fn() => build([1, 2, 3, 4]), [1, 3, 4]],
    ["chỉ có nhánh trái", fn() => build([1, 2, null, 3]), [1, 2, 3]],
    ["chỉ có nhánh phải", fn() => build([1, null, 2, null, 3]), [1, 2, 3]],
    ["đáy nằm dưới cây con trái", fn() => build([1, 2, 3, null, 5, null, null, 6]), [1, 3, 5, 6]],
    ["zíc zắc", fn() => build([1, 2, 3, 4, null, null, null, null, 5]), [1, 3, 4, 5]],
    ["giá trị âm và biên", fn() => build([0, -100, 100, -50]), [0, 100, -50]],
    ["chuỗi trái 100 nút", fn() => leftChain(100), range(1, 100)],
    ["cây đầy đủ 100 nút", fn() => complete(100), [1, 3, 7, 15, 31, 63, 100]],
];
function show(array $a): string {
    return count($a) > 8 ? "[" . implode(",", array_slice($a, 0, 3)) . ",…," . end($a) . "] (" . count($a) . " số)" : "[" . implode(",", $a) . "]";
}
foreach (['bfsLast', 'bfsRightFirst', 'dfsRightFirst', 'dfsRightFirstIterative', 'dfsOverwrite', 'wrongRightPointers', 'wrongLeftFirst', 'wrongLiveLength'] as $fn) {
    $bad = [];
    foreach ($cases as [$label, $make, $want]) {
        $root = $make();
        try { $got = show($fn($root)); } catch (Throwable $e) { $got = "ném " . get_class($e); }
        teardown($root);
        if ($got !== show($want)) $bad[] = "$label → $got";
    }
    $n = count($cases);
    echo str_pad($fn, 22) . " " . ($n - count($bad)) . "/$n ca đúng" . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}

mt_srand(42);
function randomTree(int $n): ?TreeNode {
    if ($n === 0) return null;
    $all = [new TreeNode(mt_rand(-100, 100))];
    while (count($all) < $n) {
        $p = $all[mt_rand(0, count($all) - 1)];
        $t = new TreeNode(mt_rand(-100, 100));
        if (mt_rand(0, 1) === 0) { if ($p->left === null) { $p->left = $t; $all[] = $t; } }
        elseif ($p->right === null) { $p->right = $t; $all[] = $t; }
    }
    return $all[0];
}
$agree = 0; $rightWrong = 0; $TRIALS = 3000;
for ($t = 0; $t < $TRIALS; $t++) {
    $root = randomTree(mt_rand(0, 30));
    $ref = bfsLast($root);
    if ($ref === bfsRightFirst($root) && $ref === dfsRightFirst($root) && $ref === dfsRightFirstIterative($root) && $ref === dfsOverwrite($root)) $agree++;
    if (wrongRightPointers($root) !== $ref) $rightWrong++;
}
echo "\nđối chiếu $TRIALS cây ngẫu nhiên 0..30 nút: năm cách đúng khớp nhau $agree/$TRIALS; wrongRightPointers sai $rightWrong cây\n";
