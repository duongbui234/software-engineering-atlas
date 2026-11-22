---
title: "The NeetCode Line: Dynamic Programming"
description: "NeetCode 150's 1-D and 2-D Dynamic Programming groups as 7 stations: one-dimensional recurrences, palindromes, knapsack, word break, grids and two strings, state machines, interval DP."
series: neetcode-dp
code: DP
region: Algorithms Region
draft: false
lang: en
stations:
  - name: "One-Dimensional Recurrences"
  - name: "Expanding Palindromes"
  - name: "Knapsack and Coin Change"
  - name: "Word Break and Increasing Subsequences"
  - name: "Grids and Two Strings"
  - name: "State Machines and Memoized Search"
  - name: "Interval DP and Pattern Matching"
---

## If you are just starting

This line needs recursion and hash maps. Tree traversal on [[en/series/neetcode-link|the Linked Structures line]] helps you see each problem's recursion tree.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in five languages (TypeScript, Python, Go, Java, JavaScript), with complexity, measurements and common traps.

## Why this order

- **Stations 1–2** build the habit: write the recurrence, then store sub-results instead of recomputing them.
- **Stations 3–4** are take-or-skip problems: knapsack, coin change, word break, increasing subsequences.
- **Stations 5–7** go two-dimensional: tables over a grid or over two strings, buy-and-sell states, and DP over sub-ranges.

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
