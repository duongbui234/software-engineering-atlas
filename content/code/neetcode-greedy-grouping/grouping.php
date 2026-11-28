<?php
// Tham lam theo nhóm (NeetCode MISC-04): bốn bài, mỗi bài một luật cục bộ bị ép buộc.

// Hand of Straights: lá nhỏ nhất còn lại chỉ có thể mở một nhóm, nên mở nhóm ở đó.
function isNStraightHand(array $hand, int $groupSize): bool {
    if (count($hand) % $groupSize !== 0) return false;
    $count = array_count_values($hand);
    ksort($count); // mảng PHP giữ thứ tự chèn: phải sắp theo khóa
    foreach (array_keys($count) as $x) {
        $c = $count[$x]; // c lá x còn lại: cả c lá đều phải mở nhóm
        if ($c === 0) continue;
        for ($v = $x; $v < $x + $groupSize; $v++) {
            $have = $count[$v] ?? 0;
            if ($have < $c) return false; // thiếu lá v: có nhóm không đi tiếp được
            $count[$v] = $have - $c;
        }
    }
    return true;
}

// Merge Triplets: bỏ bộ ba nào vượt target ở bất kỳ vị trí nào; các bộ còn lại gộp hết cũng không hại.
function mergeTriplets(array $triplets, array $target): bool {
    $good = [false, false, false]; // vị trí i đã có bộ an toàn chạm đúng target[i] chưa
    foreach ($triplets as $t) {
        if ($t[0] > $target[0] || $t[1] > $target[1] || $t[2] > $target[2]) continue; // dùng là hỏng vĩnh viễn
        for ($i = 0; $i < 3; $i++) if ($t[$i] === $target[$i]) $good[$i] = true;
    }
    return $good[0] && $good[1] && $good[2];
}

// Partition Labels: phần phải kéo tới lần xuất hiện cuối của mọi chữ trong nó.
function partitionLabels(string $s): array {
    $last = [];
    for ($i = 0; $i < strlen($s); $i++) $last[$s[$i]] = $i;
    $sizes = [];
    $start = 0;
    $end = 0; // mốc xa nhất mà phần hiện tại buộc phải chạm
    for ($i = 0; $i < strlen($s); $i++) {
        $end = max($end, $last[$s[$i]]);
        if ($i === $end) { // không chữ nào của phần này còn ở phía sau: cắt
            $sizes[] = $end - $start + 1;
            $start = $i + 1;
        }
    }
    return $sizes;
}

// Valid Parenthesis String: giữ khoảng [lo, hi] số ngoặc mở chưa đóng có thể có.
function checkValidString(string $s): bool {
    $lo = 0; // ít nhất (mọi '*' nghiêng về ')')
    $hi = 0; // nhiều nhất (mọi '*' nghiêng về '(')
    foreach (str_split($s) as $c) {
        if ($c === '(') { $lo++; $hi++; }
        elseif ($c === ')') { $lo--; $hi--; }
        else { $lo--; $hi++; }
        if ($hi < 0) return false; // kể cả khi mọi '*' là '(' vẫn thừa ')'
        $lo = max($lo, 0); // số ngoặc mở không âm: bỏ các cách đọc vô nghĩa
    }
    return $lo === 0;
}

// Đáp án mong đợi tính trước bằng vét cạn độc lập (thử mọi cách chia, mọi tập con, mọi cách đọc '*').
$cases = [
    ["hand thiếu lá 7", fn() => isNStraightHand([3, 1, 5, 8, 2, 6, 4, 5, 3], 3), false],
    ["hand ba nhóm", fn() => isNStraightHand([1, 2, 2, 3, 3, 4, 4, 5, 6], 3), true],
    ["hand không chia hết", fn() => isNStraightHand([1, 2, 3, 4, 5], 4), false],
    ["hand nhóm cỡ 1", fn() => isNStraightHand([7], 1), true],
    ["hand chưa sắp", fn() => isNStraightHand([2, 1], 2), true],
    ["hand hai nhóm giống nhau", fn() => isNStraightHand([1, 1, 2, 2, 3, 3], 3), true],
    ["hand hở ở 3", fn() => isNStraightHand([1, 2, 4, 5, 6, 7], 3), false],
    ["triplets bỏ bộ vượt", fn() => mergeTriplets([[1, 4, 2], [3, 1, 5], [2, 6, 9], [3, 4, 1]], [3, 4, 5]), true],
    ["triplets thiếu vị trí 3", fn() => mergeTriplets([[4, 1, 1], [1, 4, 1]], [4, 4, 4]), false],
    ["triplets một bộ đúng", fn() => mergeTriplets([[5, 5, 5]], [5, 5, 5]), true],
    ["triplets bộ duy nhất chạm bị vượt", fn() => mergeTriplets([[2, 9, 1], [1, 1, 3]], [2, 2, 3]), false],
    ["triplets không chạm", fn() => mergeTriplets([[1, 2, 3], [1, 2, 3]], [1, 2, 4]), false],
    ["labels hai phần", fn() => partitionLabels("abacdcbe"), [7, 1]],
    ["labels từng chữ", fn() => partitionLabels("xyz"), [1, 1, 1]],
    ["labels một chữ", fn() => partitionLabels("aaaa"), [4]],
    ["labels nối dài", fn() => partitionLabels("abcab"), [5]],
    ["labels năm phần", fn() => partitionLabels("ccbbaddx"), [2, 2, 1, 2, 1]],
    ["paren sao ở giữa", fn() => checkValidString("(*)"), true],
    ["paren sao làm (", fn() => checkValidString("(*))"), true],
    ["paren mở ở cuối", fn() => checkValidString("*)("), false],
    ["paren đóng trước", fn() => checkValidString(")*"), false],
    ["paren thừa mở", fn() => checkValidString("(((*"), false],
    ["paren một sao", fn() => checkValidString("*"), true],
    ["paren hai sao", fn() => checkValidString("((*)*)"), true],
    ["paren sao làm )", fn() => checkValidString("(*(*)"), true],
    ["paren sao không cứu", fn() => checkValidString("**(("), false],
];

$ok = 0;
foreach ($cases as [$name, $run, $want]) {
    $got = $run();
    if ($got === $want) $ok++;
    else echo "SAI $name: được " . json_encode($got) . ", cần " . json_encode($want) . "\n";
}
echo "$ok/" . count($cases) . " ca đúng\n";
