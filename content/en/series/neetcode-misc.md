---
title: "The NeetCode Line: Mixed Techniques"
description: "NeetCode 150's Backtracking, Greedy, Intervals, Math & Geometry and Bit Manipulation groups as 8 stations."
series: neetcode-misc
code: MISC
region: Algorithms Region
draft: false
lang: en
stations:
  - name: "Backtracking: Subsets and Combinations"
    concepts: ["Backtracking", "Choice Tree", "Start Index", "Duplicate Skipping"]
  - name: "Backtracking: Permutations and Search"
  - name: "Greedy on Arrays"
  - name: "Greedy Grouping"
  - name: "Intervals"
  - name: "Matrices"
  - name: "Arithmetic"
  - name: "Bit Manipulation"
---

## If you are just starting

The stations on this line are fairly independent of each other; backtracking uses recursion, intervals use sorting.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in seven languages (TypeScript, Python, Go, Java, JavaScript, PHP, Rust), with complexity, measurements and common traps.

## Why this order

- **Stations 1–2** are backtracking: try, go deeper, then undo the choice.
- **Stations 3–5** are greedy and intervals: proving why a local choice is still optimal, sorting by start or by end.
- **Stations 6–8** are small tricks: walking a matrix, arithmetic without overflow, and working bit by bit.

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25**, **Java 21** (`java File.java`, no `javac` needed), **PHP 8.2** and **Rust 1.99** (`rustc -O`, standard library only). A few problems have no Rust option on LeetCode (those built on node identity, like Clone Graph), so their pages have six languages. Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
