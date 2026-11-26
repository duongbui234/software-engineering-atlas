function distance([x, y], [a, b]) {
    return Math.abs(x - a) + Math.abs(y - b);
}
function prim(points) {
    const n = points.length;
    const inTree = Array(n).fill(false);
    const best = Array(n).fill(Infinity);
    best[0] = 0;
    let total = 0;
    for(let step = 0; step < n; step++){
        let next = -1;
        for(let i = 0; i < n; i++){
            if (!inTree[i] && (next === -1 || best[i] < best[next])) next = i;
        }
        inTree[next] = true;
        total += best[next];
        for(let i = 0; i < n; i++){
            if (!inTree[i]) best[i] = Math.min(best[i], distance(points[next], points[i]));
        }
    }
    return total;
}
function kruskal(points) {
    const n = points.length;
    const edges = [];
    for(let a = 0; a < n; a++){
        for(let b = a + 1; b < n; b++)edges.push([
            distance(points[a], points[b]),
            a,
            b
        ]);
    }
    edges.sort((a, b)=>a[0] - b[0]);
    const parent = Array.from({
        length: n
    }, (_, i)=>i);
    const size = Array(n).fill(1);
    function root(i) {
        while(parent[i] !== i){
            parent[i] = parent[parent[i]];
            i = parent[i];
        }
        return i;
    }
    let used = 0;
    let total = 0;
    for (const [weight, a, b] of edges){
        let x = root(a);
        let y = root(b);
        if (x === y) continue;
        if (size[x] < size[y]) [x, y] = [
            y,
            x
        ];
        parent[y] = x;
        size[x] += size[y];
        total += weight;
        if (++used === n - 1) break;
    }
    return total;
}
const cases = [
    [
        [
            [
                4,
                8
            ]
        ],
        0
    ],
    [
        [
            [
                -2,
                1
            ],
            [
                1,
                3
            ]
        ],
        5
    ],
    [
        [
            [
                0,
                0
            ],
            [
                2,
                0
            ],
            [
                0,
                2
            ],
            [
                2,
                2
            ]
        ],
        6
    ],
    [
        [
            [
                0,
                0
            ],
            [
                10,
                0
            ],
            [
                11,
                0
            ],
            [
                22,
                0
            ]
        ],
        22
    ],
    [
        [
            [
                -3,
                -3
            ],
            [
                -3,
                2
            ],
            [
                0,
                2
            ],
            [
                0,
                4
            ]
        ],
        10
    ],
    [
        [
            [
                -1000000,
                -1000000
            ],
            [
                1000000,
                1000000
            ]
        ],
        4000000
    ]
];
for (const [points, expected] of cases){
    if (prim(points) !== expected || kruskal(points) !== expected) throw new Error("Sai chi phí");
}
console.log(`${cases.length}/${cases.length} ca đúng`);
