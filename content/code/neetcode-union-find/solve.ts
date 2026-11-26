import assert from "node:assert/strict";

type Edge = readonly [number, number];

class DisjointSet {
  private parent: number[];
  private size: number[];
  count: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array<number>(n).fill(1);
    this.count = n;
  }

  find(node: number): number {
    while (node !== this.parent[node]) {
      this.parent[node] = this.parent[this.parent[node]];
      node = this.parent[node];
    }
    return node;
  }

  union(a: number, b: number): boolean {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.count--;
    return true;
  }
}

function adjacency(n: number, edges: readonly Edge[]): number[][] {
  const adj = Array.from({ length: n }, () => [] as number[]);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  return adj;
}

function walk(adj: number[][], start: number, seen: boolean[]): number {
  const pending = [start];
  seen[start] = true;
  let visited = 0;
  while (pending.length) {
    const node = pending.pop()!;
    visited++;
    for (const next of adj[node]) {
      if (seen[next]) continue;
      seen[next] = true;
      pending.push(next);
    }
  }
  return visited;
}

function redundantByDsu(n: number, edges: readonly Edge[]): Edge {
  const ds = new DisjointSet(n + 1);
  for (const edge of edges) {
    if (!ds.union(...edge)) return edge;
  }
  throw new Error("Cần đúng một cạnh dư");
}

function redundantByWalk(n: number, edges: readonly Edge[], stats?: { visits: number }): Edge {
  const adj = adjacency(n + 1, []);
  for (const [a, b] of edges) {
    const seen = new Array<boolean>(n + 1).fill(false);
    const reached = walk(adj, a, seen);
    if (stats) stats.visits += reached;
    if (seen[b]) return [a, b];
    adj[a].push(b);
    adj[b].push(a);
  }
  throw new Error("Cần đúng một cạnh dư");
}

function componentsByDsu(n: number, edges: readonly Edge[]): number {
  const ds = new DisjointSet(n);
  for (const [a, b] of edges) ds.union(a, b);
  return ds.count;
}

function componentsByWalk(n: number, edges: readonly Edge[]): number {
  const adj = adjacency(n, edges);
  const seen = new Array<boolean>(n).fill(false);
  let count = 0;
  for (let vertex = 0; vertex < n; vertex++) {
    if (seen[vertex]) continue;
    walk(adj, vertex, seen);
    count++;
  }
  return count;
}

function treeByDsu(n: number, edges: readonly Edge[]): boolean {
  if (edges.length !== n - 1) return false;
  const ds = new DisjointSet(n);
  return edges.every(([a, b]) => ds.union(a, b));
}

function treeByWalk(n: number, edges: readonly Edge[]): boolean {
  if (edges.length !== n - 1) return false;
  return walk(adjacency(n, edges), 0, new Array<boolean>(n).fill(false)) === n;
}

function check() {
  assert.deepEqual(redundantByDsu(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]), [1, 2]);
  assert.deepEqual(redundantByWalk(5, [[1, 4], [2, 4], [1, 2], [4, 5], [3, 5]]), [1, 2]);
  assert.deepEqual(redundantByDsu(4, [[1, 4], [1, 3], [2, 4], [2, 3]]), [2, 3]);
  assert.deepEqual(redundantByWalk(4, [[1, 4], [1, 3], [2, 4], [2, 3]]), [2, 3]);
  assert.deepEqual(redundantByDsu(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]), [3, 4]);
  assert.deepEqual(redundantByWalk(6, [[1, 4], [3, 5], [1, 5], [3, 4], [2, 6], [2, 5]]), [3, 4]);

  assert.deepEqual(componentsByDsu(7, [[0, 2], [2, 4], [0, 4], [1, 3]]), 4);
  assert.deepEqual(componentsByWalk(7, [[0, 2], [2, 4], [0, 4], [1, 3]]), 4);
  assert.deepEqual(componentsByDsu(5, [[3, 4], [1, 2], [0, 4], [2, 3]]), 1);
  assert.deepEqual(componentsByWalk(5, [[3, 4], [1, 2], [0, 4], [2, 3]]), 1);
  assert.deepEqual(componentsByDsu(1, []), 1);
  assert.deepEqual(componentsByWalk(1, []), 1);
  assert.deepEqual(componentsByDsu(6, [[2, 5]]), 5);
  assert.deepEqual(componentsByWalk(6, [[2, 5]]), 5);
  assert.deepEqual(componentsByDsu(4, []), 4);
  assert.deepEqual(componentsByWalk(4, []), 4);

  assert.deepEqual(treeByDsu(1, []), true);
  assert.deepEqual(treeByWalk(1, []), true);
  assert.deepEqual(treeByDsu(3, [[0, 2], [2, 1]]), true);
  assert.deepEqual(treeByWalk(3, [[0, 2], [2, 1]]), true);
  assert.deepEqual(treeByDsu(5, [[0, 1], [1, 2], [0, 2], [3, 4]]), false);
  assert.deepEqual(treeByWalk(5, [[0, 1], [1, 2], [0, 2], [3, 4]]), false);
  assert.deepEqual(treeByDsu(5, [[0, 1], [1, 2], [3, 4]]), false);
  assert.deepEqual(treeByWalk(5, [[0, 1], [1, 2], [3, 4]]), false);
  assert.deepEqual(treeByDsu(4, [[0, 1], [1, 3], [2, 3], [0, 2]]), false);
  assert.deepEqual(treeByWalk(4, [[0, 1], [1, 3], [2, 3], [0, 2]]), false);
  console.log("28/28 ca đúng");
  const n = 1000;
  const chain: Edge[] = Array.from({ length: n - 1 }, (_, i) => [i + 1, i + 2]);
  chain.push([1, n]);
  const stats = { visits: 0 };
  assert.deepEqual(redundantByWalk(n, chain, stats), [1, n]);
  assert.deepEqual(redundantByDsu(n, chain), [1, n]);
  assert.equal(stats.visits, 500_500);
  console.log("1000 cạnh: DFS thăm", stats.visits, "đỉnh; DSU thử", chain.length, "lần gộp");

}

check();
