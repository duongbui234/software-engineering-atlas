<?php
// LeetCode 981: Time Based Key-Value Store. Chạy: php time-map.php
// get(key, t) trả giá trị của lần set có timestamp lớn nhất ≤ t, không có thì "".
declare(strict_types=1);

// Cách 2, chia đôi: đếm số mốc ≤ t (cận trên) rồi lùi một ô. O(log k) mỗi lần get.
class TimeMap
{
    protected array $times = [];  // key → [timestamp, …], tăng dần vì đề hứa set theo thứ tự tăng
    protected array $values = []; // key → [value, …]

    public function set(string $key, string $value, int $timestamp): void
    {
        $this->times[$key][] = $timestamp; // tự tạo mảng con nếu key chưa có
        $this->values[$key][] = $value;
    }

    public function get(string $key, int $timestamp): ?string
    {
        $ts = $this->times[$key] ?? []; // key chưa có: ?? tránh warning "undefined array key"
        $lo = 0;
        $hi = count($ts); // nửa mở [lo, hi): đếm số mốc ≤ timestamp
        while ($lo < $hi) {
            $mid = ($lo + $hi) >> 1;
            if ($ts[$mid] <= $timestamp) $lo = $mid + 1;
            else $hi = $mid;
        }
        return $lo === 0 ? "" : $this->values[$key][$lo - 1]; // lo − 1 là mốc cuối cùng ≤ timestamp
    }
}

// Cách 1, quét lùi: duyệt lịch sử của key từ cuối về đầu, dừng ở mốc đầu tiên ≤ t. O(k) mỗi lần get.
class LinearTimeMap extends TimeMap
{
    public function get(string $key, int $timestamp): ?string
    {
        $ts = $this->times[$key] ?? [];
        for ($i = count($ts) - 1; $i >= 0; $i--) if ($ts[$i] <= $timestamp) return $this->values[$key][$i];
        return "";
    }
}

// SAI: dùng cận dưới (mốc đầu tiên ≥ t): khi t nằm giữa hai mốc thì trả giá trị "từ tương lai".
class LowerBoundTimeMap extends TimeMap
{
    public function get(string $key, int $timestamp): ?string
    {
        $ts = $this->times[$key] ?? [];
        $lo = 0;
        $hi = count($ts);
        while ($lo < $hi) {
            $mid = ($lo + $hi) >> 1;
            if ($ts[$mid] < $timestamp) $lo = $mid + 1;
            else $hi = $mid;
        }
        return $lo === count($ts) ? "" : $this->values[$key][$lo];
    }
}

// SAI: trả null khi không có thay vì chuỗi rỗng "".
class NullTimeMap extends TimeMap
{
    public function get(string $key, int $timestamp): ?string
    {
        $v = parent::get($key, $timestamp);
        return $v === "" ? null : $v;
    }
}

$cases = [
    ["ví dụ của đề", [["set", "foo", "bar", 1], ["get", "foo", 1, "bar"], ["get", "foo", 3, "bar"], ["set", "foo", "bar2", 4], ["get", "foo", 4, "bar2"], ["get", "foo", 5, "bar2"]]],
    ["key chưa từng set", [["get", "x", 10, ""]]],
    ["t nhỏ hơn mốc đầu", [["set", "a", "v", 5], ["get", "a", 4, ""], ["get", "a", 5, "v"]]],
    ["t nằm giữa hai mốc", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 15, "v1"]]],
    ["t lớn hơn mốc cuối", [["set", "a", "v1", 10], ["set", "a", "v2", 20], ["get", "a", 99, "v2"]]],
    ["hai key xen kẽ", [["set", "a", "a1", 1], ["set", "b", "b1", 2], ["set", "a", "a2", 3], ["get", "b", 3, "b1"], ["get", "a", 2, "a1"], ["get", "b", 1, ""]]],
    ["trùng mốc ở giữa", [["set", "k", "1", 1], ["set", "k", "2", 2], ["set", "k", "3", 3], ["get", "k", 2, "2"]]],
    ["timestamp 10⁷", [["set", "k", "lo", 1], ["set", "k", "hi", 10_000_000], ["get", "k", 9_999_999, "lo"], ["get", "k", 10_000_000, "hi"]]],
];
foreach (['LinearTimeMap', 'TimeMap', 'LowerBoundTimeMap', 'NullTimeMap'] as $cls) {
    $bad = [];
    foreach ($cases as [$label, $ops]) {
        $m = new $cls();
        $got = [];
        $ok = true;
        foreach ($ops as $op) {
            if ($op[0] === "set") $m->set($op[1], $op[2], $op[3]);
            else { $r = $m->get($op[1], $op[2]); $got[] = json_encode($r); if ($r !== $op[3]) $ok = false; }
        }
        if (!$ok) $bad[] = "$label → [" . implode(", ", $got) . "]";
    }
    echo str_pad($cls, 18) . " " . (count($cases) - count($bad)) . "/" . count($cases) . " ca đúng"
        . ($bad ? "; sai ở: " . implode("; ", $bad) : "") . "\n";
}
