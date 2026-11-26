import assert from "node:assert/strict";

class DisjointSet {
  parent;
  size;
  count;

  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.count = n;
  }

  find(node) {
    while (node !== this.parent[node]) {
      this.parent[node] = this.parent[this.parent[node]];
      node = this.parent[node];
    }
    return node;
  }

  union(a, b) {
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

function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [a, b] of edges) {
    adj[a].push(b);
    adj[b].push(a);
  }
  return adj;
}

function walk(adj, start, seen) {
  const pending = [start];
  seen[start] = true;
  let visited = 0;
  while (pending.length) {
    const node = pending.pop();
    visited++;
    for (const next of adj[node]) {
      if (seen[next]) continue;
      seen[next] = true;
      pending.push(next);
    }
  }
  return visited;
}

function treeByDsu(n, edges) {
  if (edges.length !== n - 1) return false;
  const ds = new DisjointSet(n);
  return edges.every(([a, b]) => ds.union(a, b));
}

function treeByWalk(n, edges) {
  if (edges.length !== n - 1) return false;
  return walk(adjacency(n, edges), 0, new Array(n).fill(false)) === n;
}

function check() {
  assert.deepEqual(treeByDsu(1, []), true);
  assert.deepEqual(treeByWalk(1, []), true);
  assert.deepEqual(
    treeByDsu(3, [
      [0, 2],
      [2, 1],
    ]),
    true,
  );
  assert.deepEqual(
    treeByWalk(3, [
      [0, 2],
      [2, 1],
    ]),
    true,
  );
  assert.deepEqual(
    treeByDsu(5, [
      [0, 1],
      [1, 2],
      [0, 2],
      [3, 4],
    ]),
    false,
  );
  assert.deepEqual(
    treeByWalk(5, [
      [0, 1],
      [1, 2],
      [0, 2],
      [3, 4],
    ]),
    false,
  );
  assert.deepEqual(
    treeByDsu(5, [
      [0, 1],
      [1, 2],
      [3, 4],
    ]),
    false,
  );
  assert.deepEqual(
    treeByWalk(5, [
      [0, 1],
      [1, 2],
      [3, 4],
    ]),
    false,
  );
  assert.deepEqual(
    treeByDsu(4, [
      [0, 1],
      [1, 3],
      [2, 3],
      [0, 2],
    ]),
    false,
  );
  assert.deepEqual(
    treeByWalk(4, [
      [0, 1],
      [1, 3],
      [2, 3],
      [0, 2],
    ]),
    false,
  );
  console.log("10/10 ca đúng");
}

check();
