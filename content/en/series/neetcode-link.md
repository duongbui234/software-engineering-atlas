---
title: "The NeetCode Line: Linked Structures"
description: "NeetCode 150's Linked List, Trees and Tries groups as 7 stations: pointer moves, advanced lists, tree recursion, search trees, level-order traversal, building trees and tries."
series: neetcode-link
code: LINK
region: Algorithms Region
draft: false
lang: en
stations:
  - name: "Linked List Pointers"
  - name: "Advanced Linked Lists"
  - name: "Tree Recursion"
  - name: "Binary Search Trees"
  - name: "Level Order and Carried State"
  - name: "Building and Serializing Trees"
  - name: "Tries"
---

## If you are just starting

This line needs the hash map and the heap from the two earlier lines ([[en/series/neetcode-arr|Arrays and Strings]], [[en/series/neetcode-srch|Search and Heaps]]) and some comfort with recursion.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in five languages (TypeScript, Python, Go, Java, JavaScript), with complexity, measurements and common traps.

## Why this order

- **Stations 1–2** are linked lists: reversing, merging, fast and slow pointers, then combining with a hash map (LRU Cache) and a heap (merging k lists).
- **Stations 3–6** are binary trees: recursion that returns results bottom-up, the properties of search trees, level-order traversal with a queue, and building or serializing a whole tree.
- **Station 7** is the trie, a tree keyed by string prefixes.

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
