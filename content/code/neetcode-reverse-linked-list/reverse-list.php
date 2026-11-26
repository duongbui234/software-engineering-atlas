<?php
// LC 206 Reverse Linked List: lật chiều mọi con trỏ next.
// Chạy: php reverse-list.php
// Nếu máy có Xdebug ở chế độ develop, nó chặn đệ quy ở 512 tầng: chạy php -d xdebug.mode=off reverse-list.php
declare(strict_types=1);

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

// Đọc tối đa $limit nút; còn nút sau đó thì danh sách có vòng.
function toArray(?ListNode $head, int $limit = 10_000_000): array|string
{
    $out = [];
    for ($p = $head; $p !== null; $p = $p->next) {
        if (count($out) === $limit) return 'VÒNG';
        $out[] = $p->val;
    }
    return $out;
}

// Lặp: giữ $next trước khi lật $cur->next.
function reverseIterative(?ListNode $head): ?ListNode
{
    $prev = null;
    $cur = $head;
    while ($cur !== null) {
        $next = $cur->next; // giữ phần còn lại trước khi cắt
        $cur->next = $prev; // lật một con trỏ
        $prev = $cur;
        $cur = $next;
    }
    return $prev;
}

// Đệ quy: lật phần sau head, rồi gắn head vào cuối.
function reverseRecursive(?ListNode $head): ?ListNode
{
    if ($head === null || $head->next === null) return $head;
    $newHead = reverseRecursive($head->next);
    $head->next->next = $head;
    $head->next = null;
    return $newHead;
}

// Chép giá trị ra mảng rồi ghi ngược lại: O(n) bộ nhớ phụ.
function reverseViaArray(?ListNode $head): ?ListNode
{
    $vals = [];
    for ($p = $head; $p !== null; $p = $p->next) $vals[] = $p->val;
    $i = count($vals) - 1;
    for ($p = $head; $p !== null; $p = $p->next) $p->val = $vals[$i--];
    return $head;
}

// SAI: lật rồi mới đi theo $cur->next, nên quay về $prev.
function wrongLoseNext(?ListNode $head): ?ListNode
{
    $prev = null;
    $cur = $head;
    while ($cur !== null) {
        $cur->next = $prev;
        $prev = $cur;
        $cur = $cur->next;
    }
    return $prev;
}

// SAI: đệ quy quên $head->next = null, hai nút đầu trỏ vào nhau thành vòng.
function wrongNoNullHead(?ListNode $head): ?ListNode
{
    if ($head === null || $head->next === null) return $head;
    $newHead = wrongNoNullHead($head->next);
    $head->next->next = $head;
    return $newHead;
}

// Giải phóng từng nút một. Để PHP tự hủy một chuỗi dài thì nó hủy đệ quy:
// khoảng 10⁵ nút là tiến trình sập (segfault), dù code của mình không đệ quy.
function freeList(?ListNode $head): void
{
    while ($head !== null) {
        $next = $head->next;
        $head->next = null;
        $head = $next;
    }
}

// Tiến trình con: chạy bản đệ quy trên n nút, để tiến trình cha xem có sập không.
if (($argv[1] ?? '') === 'deep') {
    $n = (int) $argv[2];
    if ($argv[3] === 'free') {
        $h = fromArray(range(0, $n - 1));
        $h = null; // để PHP tự hủy cả chuỗi
        echo "ok\n";
        exit(0);
    }
    $h = reverseRecursive(fromArray(range(0, $n - 1)));
    echo "ok\n";
    freeList($h);
    exit(0);
}

$cases = [[1, 2, 3, 4, 5], [1, 2], [], [1], [3, 3, 1], range(0, 4999)];
$names = ['ví dụ 1', 'ví dụ 2', 'rỗng', 'một nút', 'trùng giá trị', '5000 nút (giới hạn đề)'];
foreach (['reverseIterative', 'reverseRecursive', 'reverseViaArray', 'wrongLoseNext', 'wrongNoNullHead'] as $fn) {
    $bad = [];
    foreach ($cases as $k => $c) {
        $got = toArray($fn(fromArray($c)), count($c) + 1);
        if ($got === 'VÒNG' || $got !== array_reverse($c)) {
            $show = $got === 'VÒNG' ? 'VÒNG' : '[' . implode(',', array_slice($got, 0, 5)) . (count($got) > 5 ? ',…' : '') . ']';
            $bad[] = "{$names[$k]} → $show";
        }
    }
    printf("%-17s %d/%d ca đúng%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');
}

// PHP 8.2 không có giới hạn độ sâu đệ quy: đệ quy quá sâu làm cả tiến trình sập (segfault), không ném lỗi bắt được.
function child(int $n, string $mode): string
{
    $out = [];
    exec(sprintf('%s -d xdebug.mode=off %s deep %d %s 2>&1', escapeshellarg(PHP_BINARY), escapeshellarg(__FILE__), $n, $mode), $out, $code);
    return $code === 0 ? 'chạy xong' : "tiến trình sập, mã thoát $code";
}
foreach ([10_000, 100_000, 1_000_000] as $n) {
    printf("n = %d: đệ quy %s; để PHP tự hủy danh sách %s\n", $n, child($n, 'rec'), child($n, 'free'));
}

// Đo thời gian: trung vị 5 lần, không tính thời gian dựng danh sách.
function bench(string $fn, int $n): float
{
    $ts = [];
    for ($r = 0; $r < 5; $r++) {
        $h = fromArray(range(0, $n - 1));
        $t0 = hrtime(true);
        $h = $fn($h);
        $ts[] = (hrtime(true) - $t0) / 1e6;
        freeList($h);
    }
    sort($ts);
    return $ts[2];
}
foreach ([100_000, 1_000_000] as $n) {
    printf("n = %d: lặp %.2f ms, chép ra mảng %.2f ms (PHP %s)\n", $n, bench('reverseIterative', $n), bench('reverseViaArray', $n), PHP_VERSION);
}
