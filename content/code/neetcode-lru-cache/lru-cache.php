<?php
declare(strict_types=1);

final class Entry {
    public ?Entry $previous = null;
    public ?Entry $next = null;

    public function __construct(public int $key, public int $value) {}
}

final class LRUCache {
    private array $entries = [];
    private Entry $head;
    private Entry $tail;

    public function __construct(private int $capacity) {
        $this->head = new Entry(0, 0);
        $this->tail = new Entry(0, 0);
        $this->head->next = $this->tail;
        $this->tail->previous = $this->head;
    }

    public function get(int $key): int {
        $entry = $this->entries[$key] ?? null;
        if ($entry === null) return -1;
        $this->detach($entry);
        $this->addFirst($entry);
        return $entry->value;
    }

    public function put(int $key, int $value): void {
        if (isset($this->entries[$key])) {
            $entry = $this->entries[$key];
            $entry->value = $value;
            $this->detach($entry);
        } else {
            if (count($this->entries) === $this->capacity) {
                $oldest = $this->tail->previous;
                $this->detach($oldest);
                unset($this->entries[$oldest->key]);
            }
            $entry = $this->entries[$key] = new Entry($key, $value);
        }
        $this->addFirst($entry);
    }

    private function detach(Entry $entry): void {
        $entry->previous->next = $entry->next;
        $entry->next->previous = $entry->previous;
        $entry->previous = $entry->next = null;
    }

    private function addFirst(Entry $entry): void {
        $first = $this->head->next;
        $entry->previous = $this->head;
        $entry->next = $first;
        $first->previous = $entry;
        $this->head->next = $entry;
    }
}

$cache = new LRUCache(2);
if (!($cache->get(1) === -1)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$cache->put(1, 10);
$cache->put(2, 20);
if (!($cache->get(1) === 10)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$cache->put(3, 30);
if (!($cache->get(2) === -1)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$cache->put(1, 11);
$cache->put(4, 40);
if (!($cache->get(3) === -1 && $cache->get(1) === 11)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$cache->put(2, 0);
if (!($cache->get(4) === -1 && $cache->get(2) === 0)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}

$single = new LRUCache(1);
$single->put(1, 10);
$single->put(1, 20);
if (!($single->get(1) === 20)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
$single->put(2, 30);
if (!($single->get(1) === -1 && $single->get(2) === 30)) {
    throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
}
echo "7/7 ca đúng\n";
