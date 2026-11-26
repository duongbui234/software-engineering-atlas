---
title: "The NeetCode Line: Graphs"
description: "NeetCode 150's Graphs and Advanced Graphs groups as 6 stations: grid traversal, graph traversal and BFS, topological sort, Union-Find, shortest paths, spanning trees."
series: neetcode-grph
code: GRPH
region: Algorithms Region
draft: false
lang: en
stations:
  - name: "Grid Traversal"
    concepts: [Grid Graph, Flood Fill, Connected Component, Multi-source BFS, Mark on Enqueue]
  - name: "Graph Traversal and BFS"
    concepts: [Adjacency List, Clone Map, Reverse Reachability, Implicit Graph, Bidirectional BFS]
  - name: "Topological Sort"
    concepts: [Directed Acyclic Graph, Topological Sort, In-degree, Three-Color DFS, Precedence Constraint]
  - name: "Union-Find"
  - name: "Shortest Paths"
  - name: "Spanning Trees and Itineraries"
---

## If you are just starting

This line needs queues, stacks, recursion and heaps from the earlier lines.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in five languages (TypeScript, Python, Go, Java, JavaScript), with complexity, measurements and common traps.

## Why this order

- **Stations 1–2** are DFS and BFS, first on grids (each cell is a vertex), then on general graphs.
- **Stations 3–4** are two structural tools: topological order for directed graphs, Union-Find for connected components.
- **Stations 5–6** add weights: Dijkstra, Bellman-Ford with a step limit, minimum spanning trees and Eulerian paths.

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
