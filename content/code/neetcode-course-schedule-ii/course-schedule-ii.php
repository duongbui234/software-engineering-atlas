<?php
// LC 210 Course Schedule II: tìm một thứ tự học hợp lệ, hoặc [] nếu các môn chờ nhau thành vòng.
// Chạy: php -d xdebug.mode=off course-schedule-ii.php
declare(strict_types=1);

$work = 0; // số bước cơ bản (nhìn qua một môn, xét một điều kiện), dùng cho phép đo

// Cách 1: quét lặp. Mỗi lượt đi từ môn 0, lấy môn đầu tiên đã học đủ điều kiện. O(V·(V+E)).
function orderScan(int $n, array $prereqs): array
{
    global $work;
    $need = array_fill(0, $n, []);
    foreach ($prereqs as [$a, $b]) $need[$a][] = $b; // muốn học a thì phải xong b
    $taken = array_fill(0, $n, false);
    $order = [];
    while (count($order) < $n) {
        $found = -1;
        for ($c = 0; $c < $n && $found < 0; $c++) {
            $work++; // cả môn đã học cũng tốn một lần nhìn qua
            if ($taken[$c]) continue;
            $ready = true;
            foreach ($need[$c] as $b) {
                $work++;
                if (!$taken[$b]) { $ready = false; break; }
            }
            if ($ready) $found = $c;
        }
        if ($found < 0) return []; // còn môn chưa học mà không môn nào đủ điều kiện: có vòng
        $taken[$found] = true;
        $order[] = $found;
    }
    return $order;
}

// Cách 2: Kahn. Đếm bậc vào, môn nào về 0 thì xếp hàng. Chính hàng đợi là thứ tự. O(V+E).
function orderKahn(int $n, array $prereqs): array
{
    global $work;
    $next = array_fill(0, $n, []);
    $indegree = array_fill(0, $n, 0);
    foreach ($prereqs as [$a, $b]) {
        $next[$b][] = $a; // cạnh b → a: học b xong mới mở khóa a
        $indegree[$a]++;
    }
    $queue = [];
    for ($c = 0; $c < $n; $c++) if ($indegree[$c] === 0) $queue[] = $c;
    for ($head = 0; $head < count($queue); $head++) { // chỉ số đầu thay cho array_shift
        $c = $queue[$head];
        $work++;
        foreach ($next[$c] as $d) {
            $work++;
            if (--$indegree[$d] === 0) $queue[] = $d;
        }
    }
    return count($queue) === $n ? $queue : []; // thiếu môn nghĩa là có vòng
}

// Cách 3: DFS ba màu. Môn xong hết đường phía sau thì ghi vào post; đảo post là thứ tự. O(V+E).
function orderDfs(int $n, array $prereqs): array
{
    $next = array_fill(0, $n, []);
    foreach ($prereqs as [$a, $b]) $next[$b][] = $a;
    $color = array_fill(0, $n, 0); // 0 trắng: chưa tới, 1 xám: đang trên đường đi, 2 đen: đã xong
    $post = [];
    // &$color, &$post: mảng PHP là giá trị, thiếu & thì closure sửa bản sao
    $visit = function (int $c) use (&$visit, &$color, &$post, $next): bool {
        global $work;
        $color[$c] = 1;
        $work++;
        foreach ($next[$c] as $d) {
            $work++;
            if ($color[$d] === 1) return false; // quay lại một môn đang xám: vòng
            if ($color[$d] === 0 && !$visit($d)) return false;
        }
        $color[$c] = 2;
        $post[] = $c;
        return true;
    };
    for ($c = 0; $c < $n; $c++) {
        if ($color[$c] === 0 && !$visit($c)) return [];
    }
    return array_reverse($post); // nối vào cuối rồi đảo một lần, không array_unshift từng phần tử
}

// Bản sai 1: lật chiều cạnh (a → b). Thứ tự ra ngược hẳn.
function wrongEdgeDirection(int $n, array $prereqs): array
{
    return orderKahn($n, array_map(fn($p) => [$p[1], $p[0]], $prereqs));
}

// Bản sai 2: DFS chỉ có một tập "đã thăm". Gặp lại môn đã xong cũng tưởng là vòng.
function wrongOneSetDfs(int $n, array $prereqs): array
{
    $next = array_fill(0, $n, []);
    foreach ($prereqs as [$a, $b]) $next[$b][] = $a;
    $seen = array_fill(0, $n, false);
    $post = [];
    $visit = function (int $c) use (&$visit, &$seen, &$post, $next): bool {
        $seen[$c] = true;
        foreach ($next[$c] as $d) {
            if ($seen[$d]) return false;
            if (!$visit($d)) return false;
        }
        $post[] = $c;
        return true;
    };
    for ($c = 0; $c < $n; $c++) {
        if (!$seen[$c] && !$visit($c)) return [];
    }
    return array_reverse($post);
}

// Bản sai 3: Kahn nhưng quên kiểm số môn đã xếp. Có vòng vẫn trả một thứ tự thiếu.
function wrongNoCycleCheck(int $n, array $prereqs): array
{
    $next = array_fill(0, $n, []);
    $indegree = array_fill(0, $n, 0);
    foreach ($prereqs as [$a, $b]) { $next[$b][] = $a; $indegree[$a]++; }
    $queue = [];
    for ($c = 0; $c < $n; $c++) if ($indegree[$c] === 0) $queue[] = $c;
    for ($head = 0; $head < count($queue); $head++) {
        foreach ($next[$queue[$head]] as $d) if (--$indegree[$d] === 0) $queue[] = $d;
    }
    return $queue;
}

// Bộ chấm: không so với một đáp án cố định, mà kiểm mọi điều kiện đều đi xuôi.
function isValid(int $n, array $prereqs, array $order, bool $possible): bool
{
    if (!$possible) return count($order) === 0;
    if (count($order) !== $n) return false;
    $pos = array_fill(0, $n, -1);
    foreach ($order as $i => $c) {
        if ($c < 0 || $c >= $n || $pos[$c] !== -1) return false;
        $pos[$c] = $i;
    }
    foreach ($prereqs as [$a, $b]) if (!($pos[$b] < $pos[$a])) return false;
    return true;
}

$cases = [
    ["ví dụ sáu môn", 6, [[4, 3], [4, 0], [1, 4], [5, 4], [2, 1], [2, 5]], true],
    ["không có điều kiện", 3, [], true],
    ["một môn", 1, [], true],
    ["hai môn", 2, [[0, 1]], true],
    ["vòng hai môn", 2, [[0, 1], [1, 0]], false],
    ["vòng ba môn", 3, [[0, 1], [1, 2], [2, 0]], false],
    ["hình kim cương", 4, [[0, 2], [1, 2], [3, 0], [3, 1]], true],
    ["vòng ở một góc", 5, [[1, 0], [2, 1], [1, 2], [3, 0], [4, 3]], false],
];

$solvers = ['orderScan', 'orderKahn', 'orderDfs', 'wrongEdgeDirection', 'wrongOneSetDfs', 'wrongNoCycleCheck'];
foreach ($solvers as $name) {
    $wrong = [];
    foreach ($cases as [$label, $n, $p, $possible]) {
        if (!isValid($n, $p, $name($n, $p), $possible)) $wrong[] = $label;
    }
    $tail = $wrong ? '; sai ở ' . implode(', ', $wrong) : '';
    printf("%-20s %d/%d ca đúng%s\n", $name, count($cases) - count($wrong), count($cases), $tail);
}

// Thứ tự không duy nhất: đếm mọi hoán vị hợp lệ của ví dụ sáu môn.
function permutations(int $n): array
{
    if ($n === 0) return [[]];
    $out = [];
    foreach (permutations($n - 1) as $p) {
        for ($i = 0; $i <= count($p); $i++) {
            $out[] = [...array_slice($p, 0, $i), $n - 1, ...array_slice($p, $i)];
        }
    }
    return $out;
}
[, $exN, $exP] = $cases[0];
$fromKahn = orderKahn($exN, $exP);
$fromDfs = orderDfs($exN, $exP);
$allValid = count(array_filter(permutations($exN), fn($o) => isValid($exN, $exP, $o, true)));
$both = isValid($exN, $exP, $fromKahn, true) && isValid($exN, $exP, $fromDfs, true);
printf("ví dụ sáu môn: Kahn → [%s], DFS → [%s]; cả hai hợp lệ: %s; có %d/720 thứ tự hợp lệ\n",
    implode(',', $fromKahn), implode(',', $fromDfs), $both ? 'true' : 'false', $allValid);
printf("chấm bằng cách so với đáp án cố định [%s]: DFS bị chấm %s\n", implode(',', $fromKahn), $fromDfs === $fromKahn ? 'đúng' : 'sai');

// Số ngẫu nhiên MINSTD: các ngôn ngữ sinh cùng một dãy.
$seed = 42;
function rnd(int $k): int
{
    global $seed;
    $seed = ($seed * 48271) % 2147483647;
    return $seed % $k;
}

// Đối chiếu với vét cạn: n ≤ 6, thử mọi hoán vị để biết có thứ tự hợp lệ hay không.
$agree = 0;
$cyclic = 0;
$trials = 1000;
$permsOf = [];
for ($t = 0; $t < $trials; $t++) {
    $n = 1 + rnd(6);
    $m = rnd($n * ($n - 1) + 1);
    $keys = [];
    $p = [];
    for ($i = 0; $i < $m; $i++) {
        $a = rnd($n);
        $b = rnd($n);
        if ($a !== $b && !isset($keys[$a * $n + $b])) { $keys[$a * $n + $b] = true; $p[] = [$a, $b]; }
    }
    $permsOf[$n] ??= permutations($n);
    $possible = false;
    foreach ($permsOf[$n] as $o) if (isValid($n, $p, $o, true)) { $possible = true; break; }
    if (!$possible) $cyclic++;
    $ok = true;
    foreach (['orderScan', 'orderKahn', 'orderDfs'] as $f) if (!isValid($n, $p, $f($n, $p), $possible)) $ok = false;
    if ($ok) $agree++;
}
echo "ngẫu nhiên: $agree/$trials đồ thị, ba cách đều hợp lệ ($cyclic đồ thị có vòng)\n";

// Đo trên 2 000 môn.
const N = 2000;
$forward = [];  // môn i+1 cần môn i
$backward = []; // môn i cần môn i+1
for ($i = 0; $i + 1 < N; $i++) { $forward[] = [$i + 1, $i]; $backward[] = [$i, $i + 1]; }
$rank = range(0, N - 1);
for ($i = N - 1; $i > 0; $i--) {
    $j = rnd($i + 1);
    [$rank[$i], $rank[$j]] = [$rank[$j], $rank[$i]];
}
$randomDag = [];
$dagKeys = [];
while (count($randomDag) < 20000) {
    $u = rnd(N);
    $v = rnd(N);
    if ($u === $v) continue;
    [$a, $b] = $rank[$u] > $rank[$v] ? [$u, $v] : [$v, $u]; // môn hạng cao cần môn hạng thấp
    if (isset($dagKeys[$a * N + $b])) continue;
    $dagKeys[$a * N + $b] = true;
    $randomDag[] = [$a, $b];
}
$graphs = [
    ['chuỗi xuôi (i+1 cần i)', $forward],
    ['chuỗi ngược (i cần i+1)', $backward],
    ['DAG ngẫu nhiên, 20000 điều kiện', $randomDag],
];
foreach ($graphs as [$label, $p]) {
    echo "$label, " . N . " môn:\n";
    foreach (array_slice($solvers, 0, 3) as $name) {
        $work = 0;
        $t0 = hrtime(true);
        $order = $name(N, $p);
        $ms = (hrtime(true) - $t0) / 1e6;
        printf("  %-10s hợp lệ: %s, %d bước, %.2f ms\n", $name, isValid(N, $p, $order, true) ? 'true' : 'false', $work, $ms);
    }
}
