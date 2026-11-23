---
title: "The NeetCode Line: Search and Heaps"
description: "NeetCode 150's Binary Search and Heap groups as 4 stations: halving an array, halving the answer space, heaps for top K, and two heaps for data streams."
series: neetcode-srch
code: SRCH
region: Algorithms Region
draft: false
lang: en
stations:
  - name: "Binary Search on Arrays"
    concepts: [Binary Search, Loop Invariant, Half-open Interval, Midpoint Overflow, Lower Bound, Rotated Sorted Array]
  - name: "Binary Search on the Answer"
    concepts: [Search on the Answer, Monotonic Predicate, Ceiling Division]
  - name: "Heaps and Top K"
    concepts: [Sift Up and Sift Down, Heapify, Size-K Heap, Three-way Partition]
  - name: "Two Heaps and Scheduling"
    concepts: [Two Heaps, Running Median, K-way Merge, Idle Slot Counting]
---

## If you are just starting

This line needs loops, arrays and Big-O (see [[en/series/neetcode-arr|the Arrays and Strings line]]). The heap already showed up once in [[en/problems/top-k-frequent-elements|Top K Frequent Elements]]; here it gets stations of its own.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in five languages (TypeScript, Python, Go, Java, JavaScript), with complexity, measurements and common traps.

## Why this order

- **Station 1** is classic halving on a sorted array, including rotated arrays and matrices.
- **Station 2** halves the *answer space*: guess a value, check whether it works, then narrow down.
- **Station 3** moves to heaps: keep the k best elements without sorting the whole array.
- **Station 4** combines two heaps and priority queues to handle data streams and scheduling.

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
