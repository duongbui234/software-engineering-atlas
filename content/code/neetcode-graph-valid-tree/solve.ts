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
  console.log("10/10 ca đúng");
}

check();
