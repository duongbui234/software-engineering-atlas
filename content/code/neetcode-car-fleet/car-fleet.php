<?php
declare(strict_types=1);

function carFleet(int $target, array $position, array $speed): int {
    $cars = array_combine($position, $speed);
    krsort($cars, SORT_NUMERIC);
    $fleets = 0;
    [$lastDistance, $lastSpeed] = [0, 1];
    foreach ($cars as $start => $velocity) {
        $distance = $target - $start;
        if ($distance * $lastSpeed > $lastDistance * $velocity) {
            $fleets++;
            [$lastDistance, $lastSpeed] = [$distance, $velocity];
        }
    }
    return $fleets;
}

$cases = [[12,[10,8,0,5,3],[2,4,1,1,3],3], [10,[3],[3],1], [100,[0,2,4],[4,2,1],1], [10,[6,8],[2,1],1], [1000000,[0,1],[999999,1000000],2]];
foreach ($cases as [$target, $position, $speed, $expected]) {
    if (!(carFleet($target, $position, $speed) === $expected)) {
        throw new RuntimeException('Ca kiểm tra thất bại tại dòng ' . __LINE__);
    }
}
echo count($cases) . '/' . count($cases) . " ca đúng\n";
