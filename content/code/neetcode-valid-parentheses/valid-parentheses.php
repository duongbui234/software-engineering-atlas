<?php
// LeetCode 20, Valid Parentheses: các cách đúng, ba bản sai, test.
// Chạy: php valid-parentheses.php
declare(strict_types=1);

const OPEN = [')' => '(', ']' => '[', '}' => '{'];

// SAI: một bộ đếm chung. Không phân biệt loại ngoặc: "(]" thành hợp lệ.
function singleCounter(string $s): bool {
    $depth = 0;
    foreach (str_split($s) as $ch) {
        $depth += str_contains('([{', $ch) ? 1 : -1;
        if ($depth < 0) return false;
    }
    return $depth === 0;
}

// SAI: ba bộ đếm riêng. Đúng số lượng từng loại nhưng không biết thứ tự lồng: "([)]" thành hợp lệ.
function threeCounters(string $s): bool {
    $depth = ['(' => 0, '[' => 0, '{' => 0];
    foreach (str_split($s) as $ch) {
        if (isset($depth[$ch])) $depth[$ch]++;
        elseif (--$depth[OPEN[$ch]] < 0) return false;
    }
    return array_sum(array_map('abs', $depth)) === 0;
}

// Đúng nhưng O(n²): xóa lặp lại các cặp kề nhau "()", "[]", "{}" tới khi không xóa được nữa.
function replacePairs(string $s): bool {
    do {
        $prev = $s;
        $s = str_replace(['()', '[]', '{}'], '', $s);
    } while ($s !== $prev);
    return $s === '';
}

// Ngăn xếp: ngoặc mở thì đẩy vào, ngoặc đóng thì phải khớp với ngoặc mở trên đỉnh.
function stack(string $s): bool {
    if (strlen($s) % 2 === 1) return false; // độ dài lẻ thì chắc chắn có ngoặc lẻ đôi
    $st = [];
    foreach (str_split($s) as $ch) {
        if (!isset(OPEN[$ch])) $st[] = $ch;
        elseif (array_pop($st) !== OPEN[$ch]) return false; // array_pop trên mảng rỗng trả null, khác "(" nên vẫn đúng
    }
    return !$st; // còn ngoặc mở chưa đóng thì sai
}

// SAI: quên kiểm ngăn xếp rỗng ở cuối: "((" thành hợp lệ.
function stackNoFinalCheck(string $s): bool {
    $st = [];
    foreach (str_split($s) as $ch) {
        if (!isset(OPEN[$ch])) $st[] = $ch;
        elseif (array_pop($st) !== OPEN[$ch]) return false;
    }
    return true;
}

// Cùng thuật toán nhưng dùng SplStack: pop() trên ngăn xếp rỗng ném RuntimeException, như Python.
function splStackUnguarded(string $s): bool {
    $st = new SplStack();
    foreach (str_split($s) as $ch) {
        if (!isset(OPEN[$ch])) $st->push($ch);
        elseif ($st->pop() !== OPEN[$ch]) return false;
    }
    return $st->isEmpty();
}

$cases = [
    ["()", true], ["()[]{}", true], ["(]", false], ["([)]", false], ["{[]}", true],
    ["((", false], ["){", false], ["", true], ["(((([]))))", true],
];
foreach (['singleCounter', 'threeCounters', 'replacePairs', 'stack', 'stackNoFinalCheck', 'splStackUnguarded'] as $fn) {
    $bad = [];
    foreach ($cases as [$s, $want]) {
        try {
            if ($fn($s) !== $want) $bad[] = json_encode($s);
        } catch (Throwable $e) {
            $bad[] = json_encode($s) . ': ' . get_class($e) . '(' . $e->getMessage() . ')';
        }
    }
    echo str_pad($fn, 18) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở " . implode(' ', $bad) : '') . "\n";
}
