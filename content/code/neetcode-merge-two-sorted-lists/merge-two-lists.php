<?php
// LeetCode 21: Merge Two Sorted Lists. Chạy: php merge-two-lists.php
// (Xdebug ở chế độ develop chặn đệ quy ở 512 tầng: chạy php -d xdebug.mode=off merge-two-lists.php)
declare(strict_types=1);

final class ListNode
{
    // $tag: nhãn để xem nút đến từ danh sách nào (chỉ dùng khi kiểm tính ổn định)
    public function __construct(public int $val = 0, public ?ListNode $next = null, public string $tag = '') {}
}

function fromArray(array $a, string $tag = ''): ?ListNode
{
    $head = null;
    for ($i = count($a) - 1; $i >= 0; $i--) $head = new ListNode($a[$i], $head, $tag);
    return $head;
}

function toArray(?ListNode $h): array
{
    $out = [];
    for (; $h !== null; $h = $h->next) $out[] = $h->val;
    return $out;
}

// Cắt từng mũi tên trước khi bỏ danh sách: PHP tự hủy chuỗi dài bằng đệ quy và sập ở khoảng 10⁵ nút.
function freeList(?ListNode $h): void
{
    while ($h !== null) { $n = $h->next; $h->next = null; $h = $n; }
}

// Nút giả đứng trước đầu kết quả: không cần trường hợp riêng cho đầu danh sách.
function mergeDummy(?ListNode $a, ?ListNode $b): ?ListNode
{
    $dummy = new ListNode();
    $tail = $dummy;
    while ($a !== null && $b !== null) {
        if ($a->val <= $b->val) { $tail->next = $a; $a = $a->next; } // <= giữ nút của a trước khi bằng nhau
        else { $tail->next = $b; $b = $b->next; }
        $tail = $tail->next;
    }
    $tail->next = $a ?? $b; // phần còn lại đã sắp sẵn: nối nguyên đuôi
    return $dummy->next;
}

function mergeNoDummy(?ListNode $a, ?ListNode $b): ?ListNode
{
    if ($a === null) return $b;
    if ($b === null) return $a;
    if ($a->val <= $b->val) { $head = $a; $a = $a->next; } else { $head = $b; $b = $b->next; }
    $tail = $head;
    while ($a !== null && $b !== null) {
        if ($a->val <= $b->val) { $tail->next = $a; $a = $a->next; } else { $tail->next = $b; $b = $b->next; }
        $tail = $tail->next;
    }
    $tail->next = $a ?? $b;
    return $head;
}

// Đệ quy: đầu nhỏ hơn đứng trước, phần sau là kết quả trộn phần còn lại.
function mergeRecursive(?ListNode $a, ?ListNode $b): ?ListNode
{
    if ($a === null) return $b;
    if ($b === null) return $a;
    if ($a->val <= $b->val) { $a->next = mergeRecursive($a->next, $b); return $a; }
    $b->next = mergeRecursive($a, $b->next);
    return $b;
}

function mergeCopy(?ListNode $a, ?ListNode $b): ?ListNode
{
    $dummy = new ListNode();
    $tail = $dummy;
    while ($a !== null || $b !== null) {
        if ($b === null || ($a !== null && $a->val <= $b->val)) { $tail->next = new ListNode($a->val); $a = $a->next; }
        else { $tail->next = new ListNode($b->val); $b = $b->next; }
        $tail = $tail->next;
    }
    return $dummy->next;
}

function concatSort(?ListNode $a, ?ListNode $b): ?ListNode
{
    $all = array_merge(toArray($a), toArray($b));
    sort($all); // sort() của PHP so số với số, không biến thành chuỗi như sort() của JS
    return fromArray($all);
}

// SAI: bỏ nút giả nhưng quên trường hợp một danh sách rỗng: đọc ->val của null.
function wrongNoDummy(?ListNode $a, ?ListNode $b): ?ListNode
{
    if ($a->val <= $b->val) { $head = $a; $a = $a->next; } else { $head = $b; $b = $b->next; }
    $tail = $head;
    while ($a !== null && $b !== null) {
        if ($a->val <= $b->val) { $tail->next = $a; $a = $a->next; } else { $tail->next = $b; $b = $b->next; }
        $tail = $tail->next;
    }
    $tail->next = $a ?? $b;
    return $head;
}

// SAI: quên nối phần còn lại.
function wrongForgetTail(?ListNode $a, ?ListNode $b): ?ListNode
{
    $dummy = new ListNode();
    $tail = $dummy;
    while ($a !== null && $b !== null) {
        if ($a->val <= $b->val) { $tail->next = $a; $a = $a->next; } else { $tail->next = $b; $b = $b->next; }
        $tail = $tail->next;
    }
    return $dummy->next;
}

// SAI: quên tiến $tail, mỗi lần nối đè lên $dummy->next.
function wrongNoAdvance(?ListNode $a, ?ListNode $b): ?ListNode
{
    $dummy = new ListNode();
    $tail = $dummy;
    while ($a !== null && $b !== null) {
        if ($a->val <= $b->val) { $tail->next = $a; $a = $a->next; } else { $tail->next = $b; $b = $b->next; }
    }
    $tail->next = $a ?? $b;
    return $dummy->next;
}

if (($argv[1] ?? '') === 'deep') { // tiến trình con: trộn đệ quy tổng n nút
    $n = (int) $argv[2];
    $r = mergeRecursive(fromArray(range(0, $n - 2, 2)), fromArray(range(1, $n - 1, 2)));
    echo "ok\n";
    freeList($r);
    exit(0);
}

$cases = [[[1, 2, 4], [1, 3, 4]], [[], []], [[], [0]], [[5], [1, 2, 3]], [[1, 2, 3], []],
    [[-100, 0, 100], [-100, -50]], [[2, 2, 2], [2, 2]], [[1, 5, 9], [2, 3, 4, 6, 7, 8, 10]]];
$show = fn(array $a) => '[' . implode(',', $a) . ']';
// PHP mặc định chỉ cảnh báo khi đọc thuộc tính của null rồi chạy tiếp với giá trị null.
// Biến cảnh báo thành ngoại lệ để thấy chỗ sai, như ở các ngôn ngữ kia.
set_error_handler(function (int $no, string $msg) { throw new ErrorException($msg); });
foreach (['mergeDummy', 'mergeNoDummy', 'mergeRecursive', 'mergeCopy', 'concatSort', 'wrongNoDummy', 'wrongForgetTail', 'wrongNoAdvance'] as $fn) {
    $bad = [];
    foreach ($cases as [$a, $b]) {
        $want = array_merge($a, $b);
        sort($want);
        try { $got = $show(toArray($fn(fromArray($a), fromArray($b)))); }
        catch (Throwable $e) { $got = get_class($e) . ' (' . $e->getMessage() . ')'; }
        if ($got !== $show($want)) $bad[] = $show($a) . '+' . $show($b) . " → $got";
    }
    printf("%-15s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}
restore_error_handler();

$tags = function (?ListNode $h): string { $t = []; for (; $h !== null; $h = $h->next) $t[] = $h->val . $h->tag; return implode(' ', $t); };
echo "\nổn định, [1,2,2] (a) với [2,3] (b):\n";
echo '  <= : ' . $tags(mergeDummy(fromArray([1, 2, 2], 'a'), fromArray([2, 3], 'b'))) . "\n";

echo "\n";
foreach ([10_000, 100_000, 1_000_000] as $n) {
    $out = [];
    exec(sprintf('%s -d xdebug.mode=off %s deep %d 2>&1', escapeshellarg(PHP_BINARY), escapeshellarg(__FILE__), $n), $out, $code);
    printf("đệ quy, tổng %d nút: %s\n", $n, $code === 0 ? 'chạy xong' : "tiến trình sập, mã thoát $code");
}
