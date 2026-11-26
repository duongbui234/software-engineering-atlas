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

function componentsByDsu(n, edges) {
  const ds = new DisjointSet(n);
  for (const [a, b] of edges) ds.union(a, b);
  return ds.count;
}

function componentsByWalk(n, edges) {
  const adj = adjacency(n, edges);
  const seen = new Array(n).fill(false);
  let count = 0;
  for (let vertex = 0; vertex < n; vertex++) {
    if (seen[vertex]) continue;
    walk(adj, vertex, seen);
    count++;
  }
  return count;
}

function check() {
  assert.deepEqual(
    componentsByDsu(7, [
      [0, 2],
      [2, 4],
      [0, 4],
      [1, 3],
    ]),
    4,
  );
  assert.deepEqual(
    componentsByWalk(7, [
      [0, 2],
      [2, 4],
      [0, 4],
      [1, 3],
    ]),
    4,
  );
  assert.deepEqual(
    componentsByDsu(5, [
      [3, 4],
      [1, 2],
      [0, 4],
      [2, 3],
    ]),
    1,
  );
  assert.deepEqual(
    componentsByWalk(5, [
      [3, 4],
      [1, 2],
      [0, 4],
      [2, 3],
    ]),
    1,
  );
  assert.deepEqual(componentsByDsu(1, []), 1);
  assert.deepEqual(componentsByWalk(1, []), 1);
  assert.deepEqual(componentsByDsu(6, [[2, 5]]), 5);
  assert.deepEqual(componentsByWalk(6, [[2, 5]]), 5);
  assert.deepEqual(componentsByDsu(4, []), 4);
  assert.deepEqual(componentsByWalk(4, []), 4);
  console.log("10/10 ca đúng");
}

check();
