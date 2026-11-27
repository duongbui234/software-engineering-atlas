<?php
declare(strict_types=1);

function lisByBrute(array $nums, int $i = 0, int $last = -1): int {
    if ($i === count($nums)) return 0;
    $skip = lisByBrute($nums,$i+1,$last);
    if ($last < 0 || $nums[$last] < $nums[$i]) {
        return max($skip,1+lisByBrute($nums,$i+1,$i));
    }
    return $skip;
}

function lisByEndpoint(array $nums): int {
    $longest = array_fill(0,count($nums),1);
    $best = 0;
    foreach ($nums as $i => $x) {
        for ($j = 0; $j < $i; $j++) {
            if ($nums[$j] < $x) $longest[$i] = max($longest[$i],$longest[$j]+1);
        }
        $best = max($best,$longest[$i]);
    }
    return $best;
}

function lisByTails(array $nums): int {
    $tails = [];
    foreach ($nums as $x) {
        $lo = 0;
        $hi = count($tails);
        while ($lo < $hi) {
            $mid = $lo + intdiv($hi - $lo,2);
            if ($tails[$mid] < $x) $lo = $mid+1;
            else $hi = $mid;
        }
        $tails[$lo] = $x;
    }
    return count($tails);
}

$ascending = range(-1250,1249);
$cases = [
    [[],0],[[-10000],1],[[4,8,1,6,9,2],3],[[1,4,9,-1],3],
    [[3,3,3,3],1],[[8,6,4,2],1],[[-10000,-2,0,10000],4],[[1,3,3,8],3],
    [[-3,-1,-2,0],3],[[2,6,3,4,1,5],4],[$ascending,2500],[array_reverse($ascending),1],
];
foreach ($cases as [$nums,$want]) {
    if (lisByEndpoint($nums) !== $want || lisByTails($nums) !== $want ||
        (count($nums) <= 10 && lisByBrute($nums) !== $want)) throw new RuntimeException('Ca kiểm tra sai');
}
printf("%d/%d ca đúng\n",count($cases),count($cases));
