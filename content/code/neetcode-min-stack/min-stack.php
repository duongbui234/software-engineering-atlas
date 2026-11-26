<?php
// LeetCode 155, Min Stack: bốn cách, một bản sai, test.
// Chạy: php min-stack.php
declare(strict_types=1);

interface MinStackLike { function push(int $x): void; function pop(): void; function top(): int; function getMin(): int; }

// Cách 1: chỉ một mảng; getMin duyệt cả mảng, O(n).
class ScanMinStack implements MinStackLike {
    private array $a = [];
    function push(int $x): void { $this->a[] = $x; }
    function pop(): void { array_pop($this->a); }
    function top(): int { return $this->a[count($this->a) - 1]; }
    function getMin(): int { return min($this->a); }
}

// Cách 2: mỗi tầng nhớ cặp [giá trị, min tới tầng này].
class PairMinStack implements MinStackLike {
    private array $a = [];
    function push(int $x): void {
        $m = $this->a ? min($x, $this->a[count($this->a) - 1][1]) : $x;
        $this->a[] = [$x, $m];
    }
    function pop(): void { array_pop($this->a); }
    function top(): int { return $this->a[count($this->a) - 1][0]; }
    function getMin(): int { return $this->a[count($this->a) - 1][1]; }
}

// Cách 3: hai ngăn xếp; ngăn phụ chỉ nhận x khi x <= min hiện tại (phải có dấu =).
class TwoStackMinStack implements MinStackLike {
    protected array $a = [];
    protected array $mins = [];
    function push(int $x): void {
        $this->a[] = $x;
        if (!$this->mins || $x <= $this->mins[count($this->mins) - 1]) $this->mins[] = $x;
    }
    function pop(): void {
        // so int với int bằng ===: không có bẫy tham chiếu như Integer của Java
        if (array_pop($this->a) === $this->mins[count($this->mins) - 1]) array_pop($this->mins);
    }
    function top(): int { return $this->a[count($this->a) - 1]; }
    function getMin(): int { return $this->mins[count($this->mins) - 1]; } // ngăn rỗng: đọc khóa -1, PHP chỉ báo warning rồi trả null
}

// Cách 4: lưu hiệu x − min cũ và một biến min; hiệu âm nghĩa là tầng này đổi min.
// int của PHP là 64 bit, nên hiệu của hai số 32 bit không tràn.
class DiffMinStack implements MinStackLike {
    private array $d = [];
    private int $min = 0;
    function push(int $x): void {
        if (!$this->d) { $this->d[] = 0; $this->min = $x; return; }
        $this->d[] = $x - $this->min;
        if ($x < $this->min) $this->min = $x;
    }
    function pop(): void {
        $diff = array_pop($this->d);
        if ($diff < 0) $this->min -= $diff; // khôi phục min cũ
    }
    function top(): int { $diff = $this->d[count($this->d) - 1]; return $diff < 0 ? $this->min : $this->min + $diff; }
    function getMin(): int { return $this->min; }
}

// Bản sai: ngăn phụ chỉ nhận x khi x < min (thiếu dấu =). Hai số min bằng nhau, pop một cái là mất min.
class StrictLessMinStack extends TwoStackMinStack {
    function push(int $x): void {
        $this->a[] = $x;
        if (!$this->mins || $x < $this->mins[count($this->mins) - 1]) $this->mins[] = $x;
    }
}

// Biến warning thành ngoại lệ để thấy bản sai hỏng ở đâu (mặc định PHP chỉ in warning rồi chạy tiếp).
set_error_handler(function (int $no, string $msg): never { throw new ErrorException($msg); });

$cases = [
    ["ví dụ của đề", [["push", -2], ["push", 0], ["push", -3], ["getMin"], ["pop"], ["top"], ["getMin"]], [-3, 0, -2]],
    ["min lặp lại", [["push", 0], ["push", 1], ["push", 0], ["getMin"], ["pop"], ["getMin"]], [0, 0]],
    ["tăng dần", [["push", 1], ["push", 2], ["push", 3], ["getMin"], ["pop"], ["pop"], ["getMin"]], [1, 1]],
    ["giảm dần", [["push", 3], ["push", 2], ["push", 1], ["getMin"], ["pop"], ["getMin"], ["pop"], ["getMin"]], [1, 2, 3]],
    ["biên 32 bit", [["push", 2147483647], ["push", -2147483648], ["getMin"], ["top"], ["pop"], ["getMin"], ["top"]], [-2147483648, -2147483648, 2147483647, 2147483647]],
    ["số lớn hơn 127", [["push", 500], ["pop"], ["push", 700], ["getMin"]], [700]],
];
foreach (['ScanMinStack', 'PairMinStack', 'TwoStackMinStack', 'DiffMinStack', 'StrictLessMinStack'] as $cls) {
    $bad = [];
    foreach ($cases as [$name, $ops, $want]) {
        $s = new $cls();
        $out = [];
        try {
            foreach ($ops as $op) {
                if ($op[0] === 'push') $s->push($op[1]);
                elseif ($op[0] === 'pop') $s->pop();
                else $out[] = $op[0] === 'top' ? $s->top() : $s->getMin();
            }
            if ($out !== $want) $bad[] = $name;
        } catch (Throwable $e) {
            $bad[] = "$name (" . get_class($e) . ": " . $e->getMessage() . ")";
        }
    }
    echo str_pad($cls, 19) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng" . ($bad ? "; sai ở: " . implode(', ', $bad) : '') . "\n";
}
