<?php
declare(strict_types=1);

final class MedianFinder
{
    private SplMaxHeap $lower;
    private SplMinHeap $upper;

    public function __construct()
    {
        $this->lower = new SplMaxHeap();
        $this->upper = new SplMinHeap();
    }

    public function addNum(int $num): void
    {
        $this->lower->insert($num);
        $this->upper->insert($this->lower->extract());
        if ($this->lower->count() < $this->upper->count()) {
            $this->lower->insert($this->upper->extract());
        }
    }

    public function findMedian(): float
    {
        if ($this->lower->count() > $this->upper->count()) {
            return (float) $this->lower->top();
        }
        return ($this->lower->top() + $this->upper->top()) / 2.0;
    }
}

$cases = [
    [1, 2, 3],
    [7],
    [5, 4, 3, 2, 1],
    [1, 2, 3, 4, 5],
    [7, 7, 7, 7],
    [-1, -2, -3, -4, -5],
    [9, -9, 8, -8, 7, -7, 6, -6, 5, -5, 0],
    [-100000, 100000, -100000, 100000],
];
foreach ($cases as $nums) {
    $finder = new MedianFinder();
    $sorted = [];
    foreach ($nums as $num) {
        $finder->addNum($num);
        $sorted[] = $num;
        sort($sorted, SORT_NUMERIC);
        $size = count($sorted);
        $expected = (float) (($sorted[intdiv($size - 1, 2)] + $sorted[intdiv($size, 2)]) / 2);
        if ($finder->findMedian() !== $expected) {
            throw new RuntimeException('Sai với ' . json_encode($sorted));
        }
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
