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
function findItinerary(tickets) {
    const outgoing = new Map();
    for (const [from, to] of tickets){
        const list = outgoing.get(from) ?? [];
        list.push(to);
        outgoing.set(from, list);
    }
    for (const list of outgoing.values())list.sort().reverse();
    const stack = [
        "JFK"
    ];
    const suffix = [];
    while(stack.length){
        const list = outgoing.get(stack.at(-1));
        if (list?.length) stack.push(list.pop());
        else suffix.push(stack.pop());
    }
    return suffix.reverse();
}
const points = [
    [
        0,
        0
    ],
    [
        4,
        0
    ],
    [
        5,
        0
    ],
    [
        5,
        2
    ]
];
const tickets = [
    [
        "JFK",
        "AAA"
    ],
    [
        "JFK",
        "BBB"
    ],
    [
        "BBB",
        "JFK"
    ]
];
if (prim(points) !== 7 || kruskal(points) !== 7) throw new Error("Sai giá nối");
if (findItinerary(tickets).join(" ") !== "JFK BBB JFK AAA") throw new Error("Sai hành trình");
console.log("2/2 ca đúng");
