<?php
// LC 143 Reorder List: ba bước (tìm giữa, đảo nửa sau, đan xen), mảng các nút, và các bản sai về chỗ cắt.
// Chạy: php reorder-list.php
declare(strict_types=1);

final class ListNode
{
    public ?ListNode $next = null;
    public function __construct(public int $val) {}
}

function build(array $vals): ?ListNode
{
    $head = null;
    for ($i = count($vals) - 1; $i >= 0; $i--) { $n = new ListNode($vals[$i]); $n->next = $head; $head = $n; }
    return $head;
}

// Đọc ra mảng; đi quá $limit bước thì coi là có vòng.
function toArray(?ListNode $head, int $limit): array|string
{
    $out = [];
    for ($cur = $head; $cur !== null; $cur = $cur->next) {
        if (count($out) >= $limit) return 'vòng';
        $out[] = $cur->val;
    }
    return $out;
}

function expected(array $v): array
{
    $out = [];
    for ($i = 0, $j = count($v) - 1; $i <= $j; $i++, $j--) { $out[] = $v[$i]; if ($i !== $j) $out[] = $v[$j]; }
    return $out;
}

// Cắt từng mũi tên trước khi bỏ danh sách dài (PHP tự hủy chuỗi bằng đệ quy, sập ở khoảng 10⁵ nút).
function freeList(?ListNode $h): void
{
    while ($h !== null) { $n = $h->next; $h->next = null; $h = $n; }
}

// Đảo một danh sách tại chỗ, trả đầu mới.
function reverse(?ListNode $head): ?ListNode
{
    $prev = null;
    $cur = $head;
    while ($cur !== null) { $nxt = $cur->next; $cur->next = $prev; $prev = $cur; $cur = $nxt; }
    return $prev;
}

// Cách 1: ba bước, O(1) bộ nhớ thêm.
function reorderThreeSteps(?ListNode $head): void
{
    if ($head === null || $head->next === null) return;
    // bước 1: slow dừng ở cuối nửa đầu
    $slow = $fast = $head;
    while ($fast->next !== null && $fast->next->next !== null) { $slow = $slow->next; $fast = $fast->next->next; }
    // bước 2: cắt rồi đảo nửa sau
    $second = reverse($slow->next);
    $slow->next = null;
    // bước 3: đan xen
    $first = $head;
    while ($second !== null) {
        $n1 = $first->next;
        $n2 = $second->next;
        $first->next = $second;
        $second->next = $n1;
        $first = $n1;
        $second = $n2;
    }
}

// Cách 2: chép các nút vào mảng rồi nối lại bằng hai chỉ số.
function reorderArray(?ListNode $head): void
{
    $nodes = [];
    for ($cur = $head; $cur !== null; $cur = $cur->next) $nodes[] = $cur;
    $i = 0;
    $j = count($nodes) - 1;
    while ($i < $j) {
        $nodes[$i]->next = $nodes[$j];
        $i++;
        if ($i === $j) break;
        $nodes[$j]->next = $nodes[$i];
        $j--;
    }
    if ($nodes) $nodes[$i]->next = null;
}

// Cùng ý nhưng lấy đầu mảng bằng array_shift: mỗi lần PHP đánh số lại cả mảng, O(n).
function reorderShift(?ListNode $head): void
{
    $nodes = [];
    for ($cur = $head; $cur !== null; $cur = $cur->next) $nodes[] = $cur;
    if (!$nodes) return;
    $tail = array_shift($nodes);
    $fromBack = true;
    while ($nodes) {
        $next = $fromBack ? array_pop($nodes) : array_shift($nodes);
        $tail->next = $next;
        $tail = $next;
        $fromBack = !$fromBack;
    }
    $tail->next = null;
}

// SAI: quên cắt ($slow->next = null): sinh vòng.
function wrongNoCut(?ListNode $head): void
{
    if ($head === null || $head->next === null) return;
    $slow = $fast = $head;
    while ($fast->next !== null && $fast->next->next !== null) { $slow = $slow->next; $fast = $fast->next->next; }
    $second = reverse($slow->next);
    $first = $head;
    while ($second !== null) {
        $n1 = $first->next; $n2 = $second->next;
        $first->next = $second; $second->next = $n1; $first = $n1; $second = $n2;
    }
}

// SAI: cắt trước giữa thứ hai, nửa sau dài hơn nửa đầu.
function wrongSecondLonger(?ListNode $head): void
{
    if ($head === null || $head->next === null) return;
    $prev = null;
    $slow = $fast = $head;
    while ($fast !== null && $fast->next !== null) { $prev = $slow; $slow = $slow->next; $fast = $fast->next->next; }
    $prev->next = null;
    $second = reverse($slow);
    $first = $head;
    while ($second !== null) {
        $n1 = $first->next; $n2 = $second->next;
        $first->next = $second; $second->next = $n1; $first = $n1; $second = $n2;
    }
}

$cases = [[1, 2, 3, 4], [1, 2, 3, 4, 5], [1], [1, 2], [1, 2, 3], [], [10, 20, 30, 40, 50, 60], [7, 7, 7, 8, 8]];
// PHP chỉ cảnh báo khi đọc thuộc tính của null; biến cảnh báo thành ngoại lệ để thấy chỗ sai.
set_error_handler(function (int $no, string $msg) { throw new ErrorException($msg); });
foreach (['reorderThreeSteps', 'reorderArray', 'reorderShift', 'wrongNoCut', 'wrongSecondLonger'] as $fn) {
    $bad = [];
    foreach ($cases as $vals) {
        $head = build($vals);
        try { $fn($head); $r = toArray($head, 2 * count($vals) + 2); $got = $r === 'vòng' ? $r : '[' . implode(',', $r) . ']'; }
        catch (Throwable $e) { $got = 'ném ' . get_class($e); }
        if ($got !== '[' . implode(',', expected($vals)) . ']') $bad[] = '[' . implode(',', $vals) . "] → $got";
    }
    printf("%-19s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}
restore_error_handler();

echo "\n";
foreach ([10_000, 100_000] as $n) {
    $row = [];
    foreach (['reorderThreeSteps', 'reorderArray', 'reorderShift'] as $fn) {
        $h = build(range(1, $n));
        $t0 = hrtime(true);
        $fn($h);
        $row[] = sprintf('%s %.2f ms', $fn, (hrtime(true) - $t0) / 1e6);
        freeList($h);
    }
    printf("n = %d: %s\n", $n, implode(', ', $row));
}
