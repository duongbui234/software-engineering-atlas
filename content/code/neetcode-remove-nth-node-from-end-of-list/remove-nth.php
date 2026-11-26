<?php
// LeetCode 19: Remove Nth Node From End of List. Chạy: php remove-nth.php
declare(strict_types=1);

// PHP 8 đọc ->next của null chỉ phát Warning rồi trả null, không dừng chương trình.
// Biến mọi cảnh báo thành ngoại lệ để bản sai lộ ra như ở các ngôn ngữ khác.
set_error_handler(function (int $no, string $msg): bool {
    throw new ErrorException($msg, 0, $no);
});

final class ListNode
{
    public function __construct(public int $val = 0, public ?ListNode $next = null) {}
}

function fromArray(array $a): ?ListNode
{
    $head = null;
    for ($i = count($a) - 1; $i >= 0; $i--) $head = new ListNode($a[$i], $head);
    return $head;
}

function toArray(?ListNode $h): array
{
    $out = [];
    for (; $h !== null; $h = $h->next) $out[] = $h->val;
    return $out;
}

// Hai lượt: đếm độ dài L, rồi đi L − n bước từ nút giả để đứng ngay trước nút cần xóa.
function twoPass(?ListNode $head, int $n): ?ListNode
{
    $len = 0;
    for ($p = $head; $p !== null; $p = $p->next) $len++;
    $dummy = new ListNode(0, $head);
    $prev = $dummy;
    for ($i = 0; $i < $len - $n; $i++) $prev = $prev->next;
    $prev->next = $prev->next->next; // bỏ qua nút thứ n từ cuối
    return $dummy->next;
}

// Một lượt: fast đi trước n + 1 bước từ nút giả, rồi hai con trỏ cùng đi.
function onePass(?ListNode $head, int $n): ?ListNode
{
    $dummy = new ListNode(0, $head);
    $fast = $dummy;
    $slow = $dummy; // cùng trỏ một đối tượng: object trong PHP đi theo handle, không bị chép
    for ($i = 0; $i <= $n; $i++) $fast = $fast->next;
    while ($fast !== null) {
        $fast = $fast->next;
        $slow = $slow->next;
    }
    $slow->next = $slow->next->next;
    return $dummy->next;
}

// Mảng các nút: một lượt, nhưng tốn O(L) bộ nhớ cho mảng.
function nodeArray(?ListNode $head, int $n): ?ListNode
{
    $nodes = [];
    for ($p = $head; $p !== null; $p = $p->next) $nodes[] = $p;
    $i = count($nodes) - $n; // chỉ số nút cần xóa
    if ($i === 0) return $head->next;
    $nodes[$i - 1]->next = $nodes[$i]->next;
    return $head;
}

// SAI: không có nút giả; fast đi n bước từ head. Khi n = L (xóa chính đầu), fast thành null.
function wrongNoDummy(?ListNode $head, int $n): ?ListNode
{
    $fast = $head;
    $slow = $head;
    for ($i = 0; $i < $n; $i++) $fast = $fast->next;
    while ($fast->next !== null) {
        $fast = $fast->next;
        $slow = $slow->next;
    }
    $slow->next = $slow->next->next;
    return $head;
}

// SAI: có nút giả nhưng fast chỉ đi trước n bước (thiếu 1): slow dừng ở chính nút cần xóa.
function wrongGap(?ListNode $head, int $n): ?ListNode
{
    $dummy = new ListNode(0, $head);
    $fast = $dummy;
    $slow = $dummy;
    for ($i = 0; $i < $n; $i++) $fast = $fast->next;
    while ($fast !== null) {
        $fast = $fast->next;
        $slow = $slow->next;
    }
    if ($slow->next !== null) $slow->next = $slow->next->next;
    return $dummy->next;
}

$cases = [
    [[1, 2, 3, 4, 5], 2], // ví dụ 1 của đề
    [[1], 1],             // ví dụ 2
    [[1, 2], 1],          // ví dụ 3
    [[1, 2], 2],          // xóa đầu
    [[1, 2, 3], 3],       // xóa đầu
    [[1, 2, 3], 1],       // xóa đuôi
    [[5, 6, 7, 8], 3],
    [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5],
];
$show = fn(array $a): string => '[' . implode(',', $a) . ']';
foreach (['twoPass', 'onePass', 'nodeArray', 'wrongNoDummy', 'wrongGap'] as $fn) {
    $bad = [];
    foreach ($cases as [$a, $n]) {
        $want = $a;
        array_splice($want, count($a) - $n, 1);
        try {
            $got = $show(toArray($fn(fromArray($a), $n)));
        } catch (Throwable $e) {
            $got = get_class($e);
        }
        if ($got !== $show($want)) $bad[] = $show($a) . " n=$n → $got";
    }
    printf("%-12s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}
