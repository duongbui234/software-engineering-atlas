// LC 417 Pacific Atlantic Water Flow: bốn cách đúng, ba cách sai, kiểm chung và phép đo.
// Chạy: node pacific-atlantic.js
const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
// Cách 1: vét cạn. Từ mỗi ô, cho nước chảy xuôi (sang ô thấp hơn hoặc bằng)
// và xem nó chạm được bờ nào. O((mn)^2).
function bruteForce(heights) {
    const m = heights.length, n = heights[0].length;
    const result = [];
    for (let r = 0; r < m; r++) {
        for (let c = 0; c < n; c++) {
            let pacific = false, atlantic = false;
            const seen = new Uint8Array(m * n);
            const queue = [r * n + c];
            seen[r * n + c] = 1;
            for (let head = 0; head < queue.length && !(pacific && atlantic); head++) {
                const cr = Math.floor(queue[head] / n), cc = queue[head] % n;
                if (cr === 0 || cc === 0)
                    pacific = true;
                if (cr === m - 1 || cc === n - 1)
                    atlantic = true;
                for (const [dr, dc] of DIRS) {
                    const nr = cr + dr, nc = cc + dc;
                    if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                        continue;
                    if (seen[nr * n + nc] || heights[nr][nc] > heights[cr][cc])
                        continue;
                    seen[nr * n + nc] = 1;
                    queue.push(nr * n + nc);
                }
            }
            if (pacific && atlantic)
                result.push([r, c]);
        }
    }
    return result;
}
// Cách 2: đi ngược từ bờ. BFS nhiều nguồn, leo lên ô cao hơn hoặc bằng. O(mn).
function climbBfs(heights, seeds) {
    const m = heights.length, n = heights[0].length;
    const seen = new Uint8Array(m * n);
    const queue = [];
    for (const s of seeds) {
        if (!seen[s]) {
            seen[s] = 1;
            queue.push(s);
        }
    }
    for (let head = 0; head < queue.length; head++) {
        const cr = Math.floor(queue[head] / n), cc = queue[head] % n;
        for (const [dr, dc] of DIRS) {
            const nr = cr + dr, nc = cc + dc;
            if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                continue;
            if (seen[nr * n + nc] || heights[nr][nc] < heights[cr][cc])
                continue;
            seen[nr * n + nc] = 1;
            queue.push(nr * n + nc);
        }
    }
    return seen;
}
function borders(m, n) {
    const pacific = [], atlantic = [];
    for (let c = 0; c < n; c++) {
        pacific.push(c);
        atlantic.push((m - 1) * n + c);
    }
    for (let r = 0; r < m; r++) {
        pacific.push(r * n);
        atlantic.push(r * n + n - 1);
    }
    return { pacific, atlantic };
}
function intersect(a, b, n) {
    const result = [];
    for (let i = 0; i < a.length; i++)
        if (a[i] && b[i])
            result.push([Math.floor(i / n), i % n]);
    return result;
}
function reverseBfs(heights) {
    const m = heights.length, n = heights[0].length;
    const { pacific, atlantic } = borders(m, n);
    return intersect(climbBfs(heights, pacific), climbBfs(heights, atlantic), n);
}
// Cách 3: cùng ý, DFS lặp bằng ngăn xếp.
function climbStack(heights, seeds) {
    const m = heights.length, n = heights[0].length;
    const seen = new Uint8Array(m * n);
    const stack = [];
    for (const s of seeds) {
        if (!seen[s]) {
            seen[s] = 1;
            stack.push(s);
        }
    }
    while (stack.length > 0) {
        const cur = stack.pop();
        const cr = Math.floor(cur / n), cc = cur % n;
        for (const [dr, dc] of DIRS) {
            const nr = cr + dr, nc = cc + dc;
            if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                continue;
            if (seen[nr * n + nc] || heights[nr][nc] < heights[cr][cc])
                continue;
            seen[nr * n + nc] = 1;
            stack.push(nr * n + nc);
        }
    }
    return seen;
}
function reverseDfsIterative(heights) {
    const m = heights.length, n = heights[0].length;
    const { pacific, atlantic } = borders(m, n);
    return intersect(climbStack(heights, pacific), climbStack(heights, atlantic), n);
}
// Cách 4: DFS đệ quy. Gọn nhất, nhưng độ sâu lời gọi có thể bằng số ô.
function reverseDfsRecursive(heights) {
    const m = heights.length, n = heights[0].length;
    const climb = (seeds) => {
        const seen = new Uint8Array(m * n);
        const visit = (r, c) => {
            seen[r * n + c] = 1;
            for (const [dr, dc] of DIRS) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                    continue;
                if (seen[nr * n + nc] || heights[nr][nc] < heights[r][c])
                    continue;
                visit(nr, nc);
            }
        };
        for (const s of seeds)
            if (!seen[s])
                visit(Math.floor(s / n), s % n);
        return seen;
    };
    const { pacific, atlantic } = borders(m, n);
    return intersect(climb(pacific), climb(atlantic), n);
}
// Sai 1: đi ngược nhưng vẫn so như lúc nước chảy xuôi (xuống ô thấp hơn).
function wrongDirection(heights) {
    const m = heights.length, n = heights[0].length;
    const climbDown = (seeds) => {
        const seen = new Uint8Array(m * n);
        const queue = [];
        for (const s of seeds)
            if (!seen[s]) {
                seen[s] = 1;
                queue.push(s);
            }
        for (let head = 0; head < queue.length; head++) {
            const cr = Math.floor(queue[head] / n), cc = queue[head] % n;
            for (const [dr, dc] of DIRS) {
                const nr = cr + dr, nc = cc + dc;
                if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                    continue;
                if (seen[nr * n + nc] || heights[nr][nc] > heights[cr][cc])
                    continue;
                seen[nr * n + nc] = 1;
                queue.push(nr * n + nc);
            }
        }
        return seen;
    };
    const { pacific, atlantic } = borders(m, n);
    return intersect(climbDown(pacific), climbDown(atlantic), n);
}
// Sai 2: so ngặt (chỉ leo lên ô cao hơn hẳn), quên rằng nước chảy qua ô bằng nhau.
function wrongStrict(heights) {
    const m = heights.length, n = heights[0].length;
    const climbStrict = (seeds) => {
        const seen = new Uint8Array(m * n);
        const queue = [];
        for (const s of seeds)
            if (!seen[s]) {
                seen[s] = 1;
                queue.push(s);
            }
        for (let head = 0; head < queue.length; head++) {
            const cr = Math.floor(queue[head] / n), cc = queue[head] % n;
            for (const [dr, dc] of DIRS) {
                const nr = cr + dr, nc = cc + dc;
                if (nr < 0 || nr >= m || nc < 0 || nc >= n)
                    continue;
                if (seen[nr * n + nc] || heights[nr][nc] <= heights[cr][cc])
                    continue;
                seen[nr * n + nc] = 1;
                queue.push(nr * n + nc);
            }
        }
        return seen;
    };
    const { pacific, atlantic } = borders(m, n);
    return intersect(climbStrict(pacific), climbStrict(atlantic), n);
}
// Sai 3: mỗi đại dương chỉ gieo một cạnh (Thái Bình Dương: hàng trên; Đại Tây Dương: hàng dưới).
function wrongOneEdge(heights) {
    const m = heights.length, n = heights[0].length;
    const pacific = [], atlantic = [];
    for (let c = 0; c < n; c++) {
        pacific.push(c);
        atlantic.push((m - 1) * n + c);
    }
    return intersect(climbBfs(heights, pacific), climbBfs(heights, atlantic), n);
}
// ---------- Kiểm chung ----------
function key(cells) {
    return cells.map(([r, c]) => `${r},${c}`).sort().join(' ');
}
// Lưới tăng theo hàng: ô (r, c) cao r*n + c. Nước chảy được về góc trên trái,
// nhưng chỉ ô ở hàng dưới cùng hoặc cột phải cùng chạm Đại Tây Dương.
function rowMajor(m, n) {
    return Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => r * n + c));
}
function flatGrid(m, n) {
    return Array.from({ length: m }, () => new Array(n).fill(1));
}
function allCells(m, n) {
    const out = [];
    for (let r = 0; r < m; r++)
        for (let c = 0; c < n; c++)
            out.push([r, c]);
    return out;
}
function rowMajorAnswer(m, n) {
    const out = [];
    for (let r = 0; r < m; r++)
        for (let c = 0; c < n; c++)
            if (r === m - 1 || c === n - 1)
                out.push([r, c]);
    return out;
}
const cases = [
    { name: 'một ô', heights: [[7]], want: [[0, 0]] },
    { name: 'một hàng', heights: [[4, 1, 6]], want: [[0, 0], [0, 1], [0, 2]] },
    { name: 'một cột', heights: [[2], [9], [2]], want: [[0, 0], [1, 0], [2, 0]] },
    { name: 'mặt phẳng 3×3', heights: [[5, 5, 5], [5, 5, 5], [5, 5, 5]],
        want: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { name: 'cái chén', heights: [[3, 3, 3], [3, 1, 3], [3, 3, 3]],
        want: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { name: 'góc trũng', heights: [[9, 9, 1], [9, 9, 9], [1, 9, 9]],
        want: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { name: 'sống núi giữa', heights: [[1, 2, 3], [8, 9, 4], [7, 6, 5]],
        want: [[0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]] },
    { name: 'bậc bằng nhau', heights: [[1, 1, 1, 1], [1, 2, 2, 1], [1, 2, 2, 1], [1, 1, 1, 1]],
        want: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [1, 3],
            [2, 0], [2, 1], [2, 2], [2, 3], [3, 0], [3, 1], [3, 2], [3, 3]] },
    { name: 'lưới tăng 200×200', heights: rowMajor(200, 200), want: rowMajorAnswer(200, 200) },
    { name: 'mặt phẳng 200×200', heights: flatGrid(200, 200), want: allCells(200, 200) },
];
const solvers = [
    ['bruteForce', bruteForce],
    ['reverseBfs', reverseBfs],
    ['reverseDfsIterative', reverseDfsIterative],
    ['reverseDfsRecursive', reverseDfsRecursive],
    ['wrongDirection', wrongDirection],
    ['wrongStrict', wrongStrict],
    ['wrongOneEdge', wrongOneEdge],
];
for (const [name, solve] of solvers) {
    let ok = 0, total = 0;
    const bad = [];
    for (const t of cases) {
        if (name === 'bruteForce' && t.heights.length > 50)
            continue; // 40 000 ô: vét cạn quá chậm, đo riêng bên dưới
        total++;
        try {
            if (key(solve(t.heights)) === key(t.want))
                ok++;
            else
                bad.push(t.name);
        }
        catch (e) {
            bad.push(`${t.name} → ném ${e.constructor.name}`);
        }
    }
    const tail = bad.length ? `; sai ở ${bad.join(', ')}` : '';
    const skipped = total < cases.length ? ' (bỏ hai ca 200×200)' : '';
    console.log(`${name.padEnd(20)} ${ok}/${total} ca đúng${skipped}${tail}`);
}
// Lưới ngẫu nhiên: mọi cách đúng phải khớp vét cạn.
let seed = 42;
const rand = (k) => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed % k;
};
const randomGrid = (m, n, k) => Array.from({ length: m }, () => Array.from({ length: n }, () => rand(k)));
let agree = 0;
const trials = 2000;
for (let t = 0; t < trials; t++) {
    const h = randomGrid(1 + rand(7), 1 + rand(7), 1 + rand(5));
    const want = key(bruteForce(h));
    if (key(reverseBfs(h)) === want && key(reverseDfsIterative(h)) === want && key(reverseDfsRecursive(h)) === want)
        agree++;
}
console.log(`ngẫu nhiên: ${agree}/${trials} lưới, ba cách đi ngược khớp vét cạn`);
// Phép đo: vét cạn so với đi ngược.
function time(fn) {
    const t0 = performance.now();
    fn();
    return performance.now() - t0;
}
// Vét cạn tệ nhất trên mặt phẳng: mỗi ô loang ra cả lưới.
for (const size of [20, 40, 80]) {
    const h = flatGrid(size, size);
    const brute = time(() => bruteForce(h));
    const rev = time(() => reverseBfs(h));
    console.log(`mặt phẳng ${size}×${size}: vét cạn ${brute.toFixed(1)} ms, đi ngược ${rev.toFixed(2)} ms`);
}
const big = flatGrid(200, 200);
console.log(`mặt phẳng 200×200: đi ngược BFS ${time(() => reverseBfs(big)).toFixed(1)} ms`);
