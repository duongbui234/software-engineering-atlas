<?php
declare(strict_types=1);

const EMPTY_ROOM = 2 ** 31 - 1; // phòng trống; không đặt tên INF vì PHP đã có hằng INF (số thực vô cực)
const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function fromRoom(array $rooms, int $start): array
{
    $rows = count($rooms);
    $cols = count($rooms[0]);
    $queue = [$start];
    $distance = array_fill(0, $rows * $cols, -1);
    $distance[$start] = 0;

    for ($head = 0; $head < count($queue); $head++) {
        $cell = $queue[$head];
        $r = intdiv($cell, $cols);
        $c = $cell % $cols;
        if ($rooms[$r][$c] === 0) return [$distance[$cell], $head + 1];
        foreach (DIRECTIONS as [$dr, $dc]) {
            $nr = $r + $dr;
            $nc = $c + $dc;
            $next = $nr * $cols + $nc;
            if ($nr < 0 || $nr >= $rows || $nc < 0 || $nc >= $cols) continue;
            if ($rooms[$nr][$nc] === -1 || $distance[$next] !== -1) continue;
            $distance[$next] = $distance[$cell] + 1;
            $queue[] = $next;
        }
    }
    return [EMPTY_ROOM, count($queue)];
}

function perRoom(array &$rooms): int
{
    $popped = 0;
    $cols = count($rooms[0]);
    for ($r = 0; $r < count($rooms); $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($rooms[$r][$c] !== EMPTY_ROOM) continue;
            [$distance, $visits] = fromRoom($rooms, $r * $cols + $c);
            $rooms[$r][$c] = $distance;
            $popped += $visits;
        }
    }
    return $popped;
}

function fromAllGates(array &$rooms): int
{
    $rows = count($rooms);
    $cols = count($rooms[0]);
    $queue = [];
    for ($r = 0; $r < $rows; $r++) {
        for ($c = 0; $c < $cols; $c++) {
            if ($rooms[$r][$c] === 0) $queue[] = $r * $cols + $c;
        }
    }

    for ($head = 0; $head < count($queue); $head++) {
        $cell = $queue[$head];
        $r = intdiv($cell, $cols);
        $c = $cell % $cols;
        foreach (DIRECTIONS as [$dr, $dc]) {
            $nr = $r + $dr;
            $nc = $c + $dc;
            if ($nr < 0 || $nr >= $rows || $nc < 0 || $nc >= $cols) continue;
            if ($rooms[$nr][$nc] !== EMPTY_ROOM) continue;
            $rooms[$nr][$nc] = $rooms[$r][$c] + 1;
            $queue[] = $nr * $cols + $nc;
        }
    }
    return count($queue);
}

function check(array $before, array $expected): void
{
    foreach (['perRoom', 'fromAllGates'] as $fill) {
        $work = $before;
        $fill($work);
        if ($work !== $expected) throw new RuntimeException($fill);
    }
}

$cases = [
    [
        [[0, -1, EMPTY_ROOM, EMPTY_ROOM, 0], [EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, -1, EMPTY_ROOM], [EMPTY_ROOM, -1, EMPTY_ROOM, -1, -1], [EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM, -1, EMPTY_ROOM]],
        [[0, -1, 2, 1, 0], [1, 2, 3, -1, 1], [2, -1, 4, -1, -1], [3, 4, 5, -1, EMPTY_ROOM]],
    ],
    [[[EMPTY_ROOM, 0, EMPTY_ROOM, EMPTY_ROOM, 0, EMPTY_ROOM]], [[1, 0, 1, 1, 0, 1]]],
    [[[0, -1, EMPTY_ROOM]], [[0, -1, EMPTY_ROOM]]],
    [[[EMPTY_ROOM, EMPTY_ROOM], [EMPTY_ROOM, -1]], [[EMPTY_ROOM, EMPTY_ROOM], [EMPTY_ROOM, -1]]],
    [[[0]], [[0]]],
    [[[-1], [EMPTY_ROOM], [0], [EMPTY_ROOM]], [[-1], [1], [0], [1]]],
    [[[0, -1, EMPTY_ROOM], [EMPTY_ROOM, EMPTY_ROOM, EMPTY_ROOM]], [[0, -1, 4], [1, 2, 3]]],
];
foreach ($cases as [$before, $expected]) check($before, $expected);
$n = count($cases);
echo "{$n}/{$n} ca đúng\n";

$roomByRoom = array_fill(0, 24, array_fill(0, 24, EMPTY_ROOM));
$roomByRoom[0][0] = 0;
$inOnePass = $roomByRoom;
$repeatedPops = perRoom($roomByRoom);
$sharedPops = fromAllGates($inOnePass);
if ($roomByRoom !== $inOnePass) throw new RuntimeException("24 × 24");
echo "Số lượt lấy ô khỏi hàng đợi: {$repeatedPops} / {$sharedPops}\n";
