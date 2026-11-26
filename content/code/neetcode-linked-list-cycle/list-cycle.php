<?php
// LC 141 Linked List Cycle: tập các nút đã thăm, rùa và thỏ (Floyd), Brent, tìm đầu vòng (LC 142), và các bản sai.
// Chạy: php list-cycle.php
declare(strict_types=1);

final class ListNode
{
    public ?ListNode $next = null;
    public function __construct(public int $val) {}
}

// Dựng danh sách từ mảng; $pos ≥ 0 thì nút cuối trỏ ngược về nút thứ $pos.
function build(array $vals, int $pos): array
{
    $nodes = array_map(fn($v) => new ListNode($v), $vals);
    for ($i = 0; $i + 1 < count($nodes); $i++) $nodes[$i]->next = $nodes[$i + 1];
    if ($pos >= 0 && $nodes) $nodes[count($nodes) - 1]->next = $nodes[$pos];
    return [$nodes[0] ?? null, $nodes];
}

// Cách 1: SplObjectStorage là tập object theo danh tính (khóa là chính object, không phải giá trị).
function hasCycleSet(?ListNode $head): bool
{
    $seen = new SplObjectStorage();
    for ($cur = $head; $cur !== null; $cur = $cur->next) {
        if ($seen->contains($cur)) return true;
        $seen->attach($cur);
    }
    return false;
}

// Cách 2: rùa 1 bước, thỏ 2 bước. === so danh tính object.
function hasCycleFloyd(?ListNode $head): bool
{
    $slow = $fast = $head;
    while ($fast !== null && $fast->next !== null) {
        $slow = $slow->next;
        $fast = $fast->next->next;
        if ($slow === $fast) return true;
    }
    return false;
}

// Cách 3: Brent. Rùa đứng ở mốc, thỏ đi; sau mỗi lũy thừa của 2 bước thì rùa nhảy tới chỗ thỏ.
function hasCycleBrent(?ListNode $head): bool
{
    if ($head === null) return false;
    $power = $steps = 1;
    $tortoise = $head;
    $hare = $head->next;
    while ($hare !== null && $hare !== $tortoise) {
        if ($steps === $power) { $tortoise = $hare; $power *= 2; $steps = 0; }
        $hare = $hare->next;
        $steps++;
    }
    return $hare !== null;
}

// LC 142: gặp nhau xong, đưa một con về đầu; cùng đi 1 bước, chỗ gặp lại là đầu vòng.
function detectCycle(?ListNode $head): ?ListNode
{
    $slow = $fast = $head;
    while ($fast !== null && $fast->next !== null) {
        $slow = $slow->next;
        $fast = $fast->next->next;
        if ($slow === $fast) {
            $a = $head;
            while ($a !== $slow) { $a = $a->next; $slow = $slow->next; }
            return $a;
        }
    }
    return null;
}

// SAI: nhớ giá trị thay vì nút.
function wrongValueSet(?ListNode $head): bool
{
    $seen = [];
    for ($cur = $head; $cur !== null; $cur = $cur->next) {
        if (isset($seen[$cur->val])) return true;
        $seen[$cur->val] = true;
    }
    return false;
}

// SAI: so trước khi bước, lúc đầu rùa và thỏ cùng ở head.
function wrongCompareFirst(?ListNode $head): bool
{
    $slow = $fast = $head;
    while ($fast !== null && $fast->next !== null) {
        if ($slow === $fast) return true;
        $slow = $slow->next;
        $fast = $fast->next->next;
    }
    return false;
}

// SAI ở ngôn ngữ khác: quên kiểm $fast->next. PHP đọc ->next của null chỉ cảnh báo và trả null.
function wrongNoNextCheck(?ListNode $head): bool
{
    $slow = $fast = $head;
    while ($fast !== null) {
        $slow = $slow->next;
        $fast = $fast->next->next;
        if ($slow === $fast) return true;
    }
    return false;
}

// SAI: == thay vì ===. Với object, == so từng thuộc tính theo thứ tự khai báo. Ở đây $next khai báo trước $val,
// nên PHP so ->next trước, rồi ->next->next…, và trong vòng thì không bao giờ dừng.
function wrongLooseEquals(?ListNode $head): bool
{
    $slow = $fast = $head;
    while ($fast !== null && $fast->next !== null) {
        $slow = $slow->next;
        $fast = $fast->next->next;
        if ($slow == $fast) return true;
    }
    return false;
}

$cases = [
    ['ví dụ 1 của đề', [3, 2, 0, -4], 1, true],
    ['ví dụ 2 của đề', [1, 2], 0, true],
    ['ví dụ 3 của đề', [1], -1, false],
    ['rỗng', [], -1, false],
    ['một nút tự trỏ', [1], 0, true],
    ['giá trị trùng, không vòng', [1, 1, 1], -1, false],
    ['chẵn, không vòng', [1, 2, 3, 4, 5, 6], -1, false],
    ['lẻ, không vòng', [1, 2, 3, 4, 5], -1, false],
    ['nút cuối tự trỏ', [1, 2, 3, 4, 5], 4, true],
    ['toàn số 0, có vòng', [0, 0, 0, 0, 0], 1, true],
];
// wrongLooseEquals có thể gây lỗi Fatal (không bắt được bằng try), nên mỗi ca chạy trong một tiến trình con.
if (($argv[1] ?? '') === 'loose') {
    [, $vals, $pos] = $cases[(int) $argv[2]];
    [$head] = build($vals, $pos);
    echo wrongLooseEquals($head) ? 'true' : 'false';
    exit(0);
}

// Đếm cảnh báo thay vì in ra: PHP vẫn chạy tiếp sau cảnh báo.
$warnings = 0;
set_error_handler(function () use (&$warnings) { $warnings++; return true; });
foreach (['hasCycleSet', 'hasCycleFloyd', 'hasCycleBrent', 'wrongValueSet', 'wrongCompareFirst', 'wrongNoNextCheck'] as $fn) {
    $bad = [];
    $warnings = 0;
    foreach ($cases as [$name, $vals, $pos, $want]) {
        [$head] = build($vals, $pos);
        try { $got = $fn($head) ? 'true' : 'false'; }
        catch (Throwable $e) { $got = 'ném ' . get_class($e) . ' (' . $e->getMessage() . ')'; }
        if ($got !== ($want ? 'true' : 'false')) $bad[] = "$name → $got";
    }
    printf("%-17s %d/%d ca đúng%s%s\n", $fn, count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '',
        $warnings ? "; $warnings cảnh báo đọc thuộc tính của null" : '');
}
restore_error_handler();

$bad = [];
foreach ($cases as $i => [$name, , , $want]) {
    $out = [];
    exec(sprintf('%s -d xdebug.mode=off %s loose %d 2>/dev/null', escapeshellarg(PHP_BINARY), escapeshellarg(__FILE__), $i), $out, $code);
    $got = $code === 0 ? $out[0] : 'Fatal error: Nesting level too deep';
    if ($got !== ($want ? 'true' : 'false')) $bad[] = "$name → $got";
}
printf("%-17s %d/%d ca đúng%s\n", 'wrongLooseEquals', count($cases) - count($bad), count($cases), $bad ? '; sai ở ' . implode(', ', $bad) : '');

$ok = 0;
foreach ($cases as [, $vals, $pos]) {
    [$head, $nodes] = build($vals, $pos);
    if (detectCycle($head) === ($pos >= 0 ? $nodes[$pos] : null)) $ok++;
}
printf("detectCycle       %d/%d ca đúng (LC 142: trả nút đầu vòng)\n", $ok, count($cases));

// Đo: danh sách toàn số 0 có vòng ở giữa, trung vị 5 lần.
foreach ([100_000, 1_000_000] as $n) {
    [$head, $nodes] = build(array_fill(0, $n, 0), intdiv($n, 2));
    $row = [];
    foreach (['hasCycleSet', 'hasCycleFloyd', 'hasCycleBrent'] as $fn) {
        $ts = [];
        for ($r = 0; $r < 5; $r++) { $t0 = hrtime(true); $fn($head); $ts[] = (hrtime(true) - $t0) / 1e6; }
        sort($ts);
        $row[] = sprintf('%s %.2f ms', $fn, $ts[2]);
    }
    printf("n = %d, vòng ở giữa: %s\n", $n, implode(', ', $row));
    foreach ($nodes as $x) $x->next = null; // cắt vòng và chuỗi trước khi bỏ
}
