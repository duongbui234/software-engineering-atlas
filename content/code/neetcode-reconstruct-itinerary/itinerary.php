<?php
declare(strict_types=1);

function findItinerary(array $tickets): array
{
    $outgoing = [];
    foreach ($tickets as [$from, $to]) {
        $outgoing[$from][] = $to;
    }
    foreach (array_keys($outgoing) as $airport) {
        rsort($outgoing[$airport], SORT_STRING);
    }

    $stack = ['JFK'];
    $suffix = [];
    while ($stack !== []) {
        $current = $stack[array_key_last($stack)];
        if (!empty($outgoing[$current])) {
            $stack[] = array_pop($outgoing[$current]);
        } else {
            $suffix[] = array_pop($stack);
        }
    }
    return array_reverse($suffix);
}

// TESTS
$cases = [
    [[['BBB', 'CCC'], ['JFK', 'AAA'], ['AAA', 'BBB']], 'JFK AAA BBB CCC'],
    [[['JFK', 'AAA'], ['JFK', 'BBB'], ['BBB', 'JFK']], 'JFK BBB JFK AAA'],
    [[['JFK', 'AAA'], ['JFK', 'AAA'], ['AAA', 'JFK']], 'JFK AAA JFK AAA'],
    [[['JFK', 'BBB'], ['BBB', 'JFK'], ['JFK', 'AAA'], ['AAA', 'JFK']], 'JFK AAA JFK BBB JFK'],
    [[['JFK', 'AAA'], ['AAA', 'CCC'], ['CCC', 'JFK'], ['AAA', 'BBB'], ['BBB', 'AAA']], 'JFK AAA BBB AAA CCC JFK'],
];
foreach ($cases as [$tickets, $expected]) {
    if (implode(' ', findItinerary($tickets)) !== $expected) {
        throw new RuntimeException('Sai hành trình');
    }
}
printf("%d/%d ca đúng\n", count($cases), count($cases));
