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

function check() {
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
  console.log("10/10 ca đúng");
}

check();
