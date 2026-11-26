<?php
// LC 102 Binary Tree Level Order Traversal: BFS chụp kích thước tầng (SplQueue và array_shift), hai danh sách,
// vạch ngăn tầng, DFS mang độ sâu, và các bản sai.
// Chạy: php level-order.php (máy có Xdebug thì thêm -d xdebug.mode=off: Xdebug chặn đệ quy quá 512 tầng)
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

// Cách 1: BFS, chụp số nút của tầng trước khi đẩy con vào. SplQueue lấy đầu hàng O(1).
function levelSnapshot(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = new SplQueue();
    $queue->enqueue($root);
    while (!$queue->isEmpty()) {
        $size = count($queue); // chụp một lần cho cả tầng
        $level = [];
        for ($i = 0; $i < $size; $i++) {
            $node = $queue->dequeue();
            $level[] = $node->val;
            if ($node->left !== null) $queue->enqueue($node->left);
            if ($node->right !== null) $queue->enqueue($node->right);
        }
        $res[] = $level;
    }
    return $res;
}

// Cùng cách đó nhưng hàng đợi là mảng thường và lấy đầu bằng array_shift: O(n) mỗi lần vì PHP đánh lại chỉ số.
function levelSnapshotShift(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = [$root];
    while ($queue) {
        $size = count($queue);
        $level = [];
        for ($i = 0; $i < $size; $i++) {
            $node = array_shift($queue);
            $level[] = $node->val;
            if ($node->left !== null) $queue[] = $node->left;
            if ($node->right !== null) $queue[] = $node->right;
        }
        $res[] = $level;
    }
    return $res;
}

// Cách 2: hai danh sách, tầng hiện tại và tầng sau.
function levelTwoLists(?TreeNode $root): array {
    $res = [];
    $cur = $root === null ? [] : [$root];
    while ($cur) {
        $res[] = array_map(fn($n) => $n->val, $cur);
        $next = [];
        foreach ($cur as $node) {
            if ($node->left !== null) $next[] = $node->left;
            if ($node->right !== null) $next[] = $node->right;
        }
        $cur = $next;
    }
    return $res;
}

// Cách 3: vạch ngăn tầng (null) trong hàng đợi. SplQueue chứa được null.
function levelMarker(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = new SplQueue();
    $queue->enqueue($root);
    $queue->enqueue(null);
    $level = [];
    while (!$queue->isEmpty()) {
        $node = $queue->dequeue();
        if ($node === null) {
            $res[] = $level;
            $level = [];
            if (!$queue->isEmpty()) $queue->enqueue(null); // còn tầng sau thì đặt vạch cho nó
        } else {
            $level[] = $node->val;
            if ($node->left !== null) $queue->enqueue($node->left);
            if ($node->right !== null) $queue->enqueue($node->right);
        }
    }
    return $res;
}

// Cách 4: DFS tiền thứ tự mang độ sâu. $res truyền bằng tham chiếu (&), nếu không mỗi lần gọi sửa một bản sao.
function levelDfs(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use (&$res, &$go): void {
        if ($node === null) return;
        if (count($res) === $depth) $res[] = []; // lần đầu xuống tới tầng này
        $res[$depth][] = $node->val;
        $go($node->left, $depth + 1);
        $go($node->right, $depth + 1);
    };
    $go($root, 0);
    return $res;
}

// Sai: đọc lại độ dài hàng đợi trong điều kiện vòng.
function wrongLiveLength(?TreeNode $root): array {
    $res = [];
    if ($root === null) return $res;
    $queue = new SplQueue();
    $queue->enqueue($root);
    while (!$queue->isEmpty()) {
        $level = [];
        for ($i = 0; $i < count($queue); $i++) {
            $node = $queue->dequeue();
            $level[] = $node->val;
            if ($node->left !== null) $queue->enqueue($node->left);
            if ($node->right !== null) $queue->enqueue($node->right);
        }
        $res[] = $level;
    }
    return $res;
}

// Sai: DFS đi phải trước.
function wrongRightFirst(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use (&$res, &$go): void {
        if ($node === null) return;
        if (count($res) === $depth) $res[] = [];
        $res[$depth][] = $node->val;
        $go($node->right, $depth + 1);
        $go($node->left, $depth + 1);
    };
    $go($root, 0);
    return $res;
}

// Sai: cây rỗng trả null.
function wrongEmptyNull(?TreeNode $root): ?array {
    if ($root === null) return null;
    return levelSnapshot($root);
}

// Sai riêng PHP: closure nhận $res theo giá trị (use ($res) thiếu &): mọi thay đổi bên trong mất.
function wrongUseByValue(?TreeNode $root): array {
    $res = [];
    $go = function (?TreeNode $node, int $depth) use ($res, &$go): void {
        if ($node === null) return;
        if (count($res) === $depth) $res[] = [];
        $res[$depth][] = $node->val;
        $go($node->left, $depth + 1);
        $go($node->right, $depth + 1);
    };
    $go($root, 0);
    return $res;
}

$limitArr = [];
for ($i = 0; $i < 2000; $i++) $limitArr[] = ($i * 37) % 2001 - 1000;
function splitLevels(array $arr): array {
    $out = [];
    for ($start = 0, $w = 1; $start < count($arr); $start += $w, $w *= 2) $out[] = array_slice($arr, $start, $w);
    return $out;
}
$chainWant = [];
for ($i = 1; $i <= 2000; $i++) $chainWant[] = [$i];
$cases = [
    ["cây rỗng", fn() => null, []],
    ["một nút", fn() => build([7]), [[7]]],
    ["ba tầng có chỗ trống", fn() => build([5, 2, 8, null, 4, 7, 9]), [[5], [2, 8], [4, 7, 9]]],
    ["chỉ con trái", fn() => build([1, 2, null, 3, null, 4]), [[1], [2], [3], [4]]],
    ["chỉ con phải", fn() => build([1, null, 2, null, 3]), [[1], [2], [3]]],
    ["cây đầy 15 nút", fn() => build(range(1, 15)), [[1], [2, 3], [4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14, 15]]],
    ["nhánh so le", fn() => build([1, 2, 3, 4, null, null, 5, 6, null, null, 7]), [[1], [2, 3], [4, 5], [6, 7]]],
    ["giá trị âm và trùng", fn() => build([0, -1000, 1000, -1000, null, null, 1000]), [[0], [-1000, 1000], [-1000, 1000]]],
    ["cây đủ 2000 nút", fn() => build($limitArr), splitLevels($limitArr)],
    ["chuỗi trái 2000 nút", fn() => leftChain(2000), $chainWant],
];

function short(mixed $x): string {
    $s = json_encode($x);
    return strlen($s) > 40 ? substr($s, 0, 37) . "..." : $s;
}
function run(string $name, array $cases): void {
    $ok = 0;
    $bad = [];
    foreach ($cases as [$label, $make, $want]) {
        $root = $make();
        try {
            $got = $name($root);
            if ($got === $want) $ok++; // === trên mảng: cùng khóa, cùng thứ tự, cùng kiểu
            else $bad[] = "$label → " . short($got);
        } catch (Throwable $e) {
            $bad[] = "$label → ném " . get_class($e);
        }
        teardown($root);
    }
    echo str_pad($name, 18) . " $ok/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(", ", $bad) : "") . "\n";
}
foreach (['levelSnapshot', 'levelSnapshotShift', 'levelTwoLists', 'levelMarker', 'levelDfs', 'wrongLiveLength', 'wrongRightFirst', 'wrongEmptyNull', 'wrongUseByValue'] as $fn) run($fn, $cases);

// Đối chiếu ngẫu nhiên.
mt_srand(42);
function randomTree(int $n): ?TreeNode {
    if ($n === 0) return null;
    $nodes = [new TreeNode(mt_rand(-1000, 1000))];
    while (count($nodes) < $n) {
        $parent = $nodes[mt_rand(0, count($nodes) - 1)];
        $child = new TreeNode(mt_rand(-1000, 1000));
        if (mt_rand(0, 1) === 0) { if ($parent->left === null) { $parent->left = $child; $nodes[] = $child; } }
        elseif ($parent->right === null) { $parent->right = $child; $nodes[] = $child; }
    }
    return $nodes[0];
}
$agree = 0;
$RANDOM = 3000;
for ($t = 0; $t < $RANDOM; $t++) {
    $root = randomTree(mt_rand(0, 59));
    $a = levelSnapshot($root);
    if ($a === levelTwoLists($root) && $a === levelMarker($root) && $a === levelDfs($root) && $a === levelSnapshotShift($root)) $agree++;
}
echo "\nđối chiếu $RANDOM cây ngẫu nhiên 0..59 nút: năm cách khớp nhau $agree/$RANDOM\n";

// Đo: SplQueue so với array_shift trên cây đầy.
echo "\nthời gian trung vị 5 lần (ms), cây đầy\n";
echo "        n  SplQueue  array_shift\n";
foreach ([2000, 16383, 32767] as $n) {
    $root = build(range(0, $n - 1));
    $row = [];
    foreach (['levelSnapshot', 'levelSnapshotShift'] as $fn) {
        $ts = [];
        for ($r = 0; $r < 5; $r++) { $t0 = hrtime(true); $fn($root); $ts[] = (hrtime(true) - $t0) / 1e6; }
        sort($ts);
        $row[] = $ts[2];
    }
    printf("%9d %9.2f %12.2f\n", $n, $row[0], $row[1]);
    teardown($root);
}
