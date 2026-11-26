<?php
// LC 207 Course Schedule: có học hết được mọi môn không? Cùng bộ ca với năm ngôn ngữ kia.
// Chạy: php -d xdebug.mode=off course-schedule.php
declare(strict_types=1);

$work = 0; // số lần nhìn một cạnh (một môn tiên quyết), dùng cho phép đo
$passes = 0;

const WHITE = 0;
const GRAY = 1;
const BLACK = 2;

// Cặp [a, b] nghĩa là "muốn học a phải học b trước": cạnh đi từ b sang a.
function buildGraph(int $n, array $prerequisites): array
{
    $adj = array_fill(0, $n, []);
    $indegree = array_fill(0, $n, 0);
    foreach ($prerequisites as [$a, $b]) {
        $adj[$b][] = $a;
        $indegree[$a]++;
    }
    return [$adj, $indegree];
}

// Cách 1: quét lặp. Mỗi lượt quét mọi môn, học môn nào đã đủ tiên quyết.
function canFinishScan(int $n, array $prerequisites): bool
{
    global $work, $passes;
    $needs = array_fill(0, $n, []);
    foreach ($prerequisites as [$a, $b]) $needs[$a][] = $b;
    $done = array_fill(0, $n, false);
    $count = 0;
    $passes = 0;
    $progress = true;
    while ($progress) {
        $progress = false;
        $passes++;
        for ($c = 0; $c < $n; $c++) {
            if ($done[$c]) continue;
            $ready = true;
            foreach ($needs[$c] as $b) {
                $work++;
                if (!$done[$b]) { $ready = false; break; }
            }
            if ($ready) { $done[$c] = true; $count++; $progress = true; }
        }
    }
    return $count === $n;
}

// Cách 2: Kahn. Môn có bậc vào 0 thì học được ngay; học xong thì trừ bậc vào
// của các môn đứng sau. Đếm số môn học được. O(V + E).
function canFinishKahn(int $n, array $prerequisites): bool
{
    global $work;
    [$adj, $indegree] = buildGraph($n, $prerequisites);
    $queue = [];
    for ($c = 0; $c < $n; $c++) if ($indegree[$c] === 0) $queue[] = $c;
    $taken = 0;
    for ($head = 0; $head < count($queue); $head++) { // giữ chỉ số đầu, không array_shift
        $u = $queue[$head];
        $taken++;
        foreach ($adj[$u] as $v) {
            $work++;
            if (--$indegree[$v] === 0) $queue[] = $v;
        }
    }
    return $taken === $n; // thiếu môn nào là môn đó kẹt trong một vòng
}

// Cách 3: DFS ba màu, đệ quy. Trắng = chưa đụng, xám = đang trên đường đi,
// đen = đã xong. Gặp lại một đỉnh xám là có vòng. O(V + E).
function canFinishDfs(int $n, array $prerequisites): bool
{
    [$adj] = buildGraph($n, $prerequisites);
    $color = array_fill(0, $n, WHITE);
    // $color truyền theo tham chiếu (&): mảng PHP là giá trị, không có & thì mỗi lời gọi sửa một bản sao
    $visit = function (int $u) use (&$visit, &$color, $adj): bool {
        global $work;
        $color[$u] = GRAY;
        foreach ($adj[$u] as $v) {
            $work++;
            if ($color[$v] === GRAY) return false; // quay về đỉnh đang trên đường: vòng
            if ($color[$v] === WHITE && !$visit($v)) return false;
        }
        $color[$u] = BLACK;
        return true;
    };
    for ($u = 0; $u < $n; $u++) {
        if ($color[$u] === WHITE && !$visit($u)) return false;
    }
    return true;
}

// Cách 3b: cùng DFS ba màu nhưng tự giữ ngăn xếp, không đệ quy.
function canFinishDfsStack(int $n, array $prerequisites): bool
{
    global $work;
    [$adj] = buildGraph($n, $prerequisites);
    $color = array_fill(0, $n, WHITE);
    $next = array_fill(0, $n, 0); // hàng xóm kế tiếp cần xem của mỗi đỉnh
    for ($s = 0; $s < $n; $s++) {
        if ($color[$s] !== WHITE) continue;
        $stack = [$s];
        $color[$s] = GRAY;
        while ($stack) {
            $u = $stack[count($stack) - 1];
            if ($next[$u] < count($adj[$u])) {
                $v = $adj[$u][$next[$u]++];
                $work++;
                if ($color[$v] === GRAY) return false;
                if ($color[$v] === WHITE) { $color[$v] = GRAY; $stack[] = $v; }
            } else {
                $color[$u] = BLACK;
                array_pop($stack);
            }
        }
    }
    return true;
}

// Bản sai 1: DFS chỉ có một tập "đã thăm", gặp lại đỉnh đã thăm là kết luận có vòng.
function wrongOneVisitedSet(int $n, array $prerequisites): bool
{
    [$adj] = buildGraph($n, $prerequisites);
    $visited = [];
    $visit = function (int $u) use (&$visit, &$visited, $adj): bool {
        if (isset($visited[$u])) return false;
        $visited[$u] = true;
        foreach ($adj[$u] as $v) if (!$visit($v)) return false;
        return true;
    };
    for ($u = 0; $u < $n; $u++) if (!isset($visited[$u]) && !$visit($u)) return false;
    return true;
}

// Bản sai 2: chỉ hỏi "có môn nào học được ngay không?".
function wrongHasStart(int $n, array $prerequisites): bool
{
    [, $indegree] = buildGraph($n, $prerequisites);
    return in_array(0, $indegree, true);
}

$cases = [
    ["hai môn", 2, [[1, 0]], true],
    ["hai môn chờ nhau", 2, [[1, 0], [0, 1]], false],
    ["kim cương", 4, [[1, 0], [2, 0], [3, 1], [3, 2]], true],
    ["ví dụ năm môn", 5, [[1, 0], [2, 0], [3, 1], [3, 2], [4, 3]], true],
    ["học được một môn rồi kẹt", 4, [[1, 0], [2, 1], [3, 2], [1, 3]], false],
    ["môn tự cần chính nó", 2, [[1, 1]], false],
    ["không có tiên quyết", 3, [], true],
    ["hai mảnh, mảnh sau có vòng", 6, [[1, 0], [3, 2], [4, 3], [2, 4]], false],
];

function show(bool $b): string { return $b ? 'true' : 'false'; }

function check(string $name, callable $solve): void
{
    global $cases;
    $ok = 0;
    $wrong = [];
    foreach ($cases as [$label, $n, $pre, $want]) {
        $got = $solve($n, $pre);
        if ($got === $want) $ok++;
        else $wrong[] = "$label → " . show($got);
    }
    printf("%-20s %d/%d ca đúng%s\n", $name, $ok, count($cases), $wrong ? '; sai ở ' . implode(', ', $wrong) : '');
}

foreach (['canFinishScan', 'canFinishKahn', 'canFinishDfs', 'canFinishDfsStack', 'wrongOneVisitedSet', 'wrongHasStart'] as $f) {
    check($f, $f);
}

// Bộ sinh số giả ngẫu nhiên MINSTD: các ngôn ngữ ra cùng một dãy, cùng đồ thị.
$seed = 20261126;
function rnd(int $k): int
{
    global $seed;
    $seed = ($seed * 48271) % 2147483647; // tích < 2^63 nên int 64 bit không tràn
    return $seed % $k;
}

$agree = 0;
$finishable = 0;
for ($t = 0; $t < 2000; $t++) {
    $n = 1 + rnd(8);
    $m = rnd($n * 2 + 1);
    $seen = [];
    $pre = [];
    for ($i = 0; $i < $m; $i++) {
        $a = rnd($n);
        $b = rnd($n);
        if (isset($seen[$a * $n + $b])) continue;
        $seen[$a * $n + $b] = true;
        $pre[] = [$a, $b];
    }
    $r = array_map(fn($f) => $f($n, $pre), ['canFinishScan', 'canFinishKahn', 'canFinishDfs', 'canFinishDfsStack']);
    if (count(array_unique($r)) === 1) $agree++;
    if ($r[0]) $finishable++;
}
printf("ngẫu nhiên: %d/2000 đồ thị, bốn cách khớp nhau (%d học hết được, %d có vòng)\n", $agree, $finishable, 2000 - $finishable);

function measure(string $name, callable $solve, int $n, array $pre, bool $withPasses = false): void
{
    global $work, $passes;
    $best = INF;
    $got = false;
    $w = 0;
    for ($r = 0; $r < 3; $r++) {
        $work = 0;
        $t0 = hrtime(true);
        $got = $solve($n, $pre);
        $best = min($best, (hrtime(true) - $t0) / 1e6);
        $w = $work;
    }
    printf("  %-18s %s, %d lần nhìn cạnh%s, %.1f ms\n", $name, show($got), $w, $withPasses ? ", $passes lượt quét" : '', $best);
}

const N = 2000;
$reversedChain = [];
for ($i = 0; $i + 1 < N; $i++) $reversedChain[] = [$i, $i + 1];
echo "chuỗi " . N . " môn, môn i cần môn i+1:\n";
measure('canFinishScan', 'canFinishScan', N, $reversedChain, true);
measure('canFinishKahn', 'canFinishKahn', N, $reversedChain);
measure('canFinishDfs', 'canFinishDfs', N, $reversedChain);
measure('canFinishDfsStack', 'canFinishDfsStack', N, $reversedChain);

$perm = range(0, N - 1);
for ($i = N - 1; $i > 0; $i--) {
    $j = rnd($i + 1);
    [$perm[$i], $perm[$j]] = [$perm[$j], $perm[$i]];
}
$dagSeen = [];
$dag = [];
while (count($dag) < 5000) {
    $x = rnd(N);
    $y = rnd(N);
    if ($x === $y) continue;
    $lo = min($x, $y);
    $hi = max($x, $y);
    if (isset($dagSeen[$lo * N + $hi])) continue;
    $dagSeen[$lo * N + $hi] = true;
    $dag[] = [$perm[$hi], $perm[$lo]];
}
echo "ngẫu nhiên " . N . " môn, 5000 cặp, không vòng:\n";
measure('canFinishScan', 'canFinishScan', N, $dag, true);
measure('canFinishKahn', 'canFinishKahn', N, $dag);
measure('canFinishDfs', 'canFinishDfs', N, $dag);
measure('canFinishDfsStack', 'canFinishDfsStack', N, $dag);

// Đệ quy sâu: lời gọi hàm PHP nằm trên heap của máy ảo, nên 100 000 tầng chỉ tốn bộ nhớ.
echo "đệ quy sâu, chuỗi môn i+1 cần môn i:\n";
foreach ([2000, 100000] as $len) {
    $chain = [];
    for ($i = 0; $i + 1 < $len; $i++) $chain[] = [$i + 1, $i];
    $parts = [];
    foreach (['canFinishDfs', 'canFinishDfsStack', 'canFinishKahn'] as $f) {
        try {
            $parts[] = "$f " . show($f($len, $chain));
        } catch (Error $e) {
            $parts[] = "$f lỗi " . get_class($e) . ' (' . $e->getMessage() . ')';
        }
    }
    echo "  $len môn: " . implode('; ', $parts) . "\n";
}
