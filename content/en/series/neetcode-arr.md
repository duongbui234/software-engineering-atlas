---
title: "The NeetCode Line: Arrays and Strings"
description: "The first four groups of NeetCode 150 (Arrays & Hashing, Two Pointers, Sliding Window, Stack) grouped into 7 stations by technique: hash lookup, canonical keys, two pointers, sliding windows and stacks."
series: neetcode-arr
code: ARR
region: Algorithms Region
draft: false
lang: en
aliases: [en/series/neetcode-arrays-hashing]
stations:
  - name: "Hash Lookup"
    concepts: [Big-O Notation, Brute Force, Hash Set, Sort Then Scan, Space-Time Tradeoff, Complement Lookup, One-pass Hash Map, Two Pointers, Hash Collision, Amortized O(1), Aggregate Analysis]
  - name: "Canonical Keys and Counting"
    concepts: [Frequency Counting, Counting Array, Hash Map, Unicode Normalization, Canonical Key, Count Key, Key Serialization, Group By, Heap, Bucket Sort, Quickselect, Sorting Lower Bound, Bitmask]
  - name: "Prefix, Suffix and Encoding"
    concepts: [Prefix Sum, Prefix and Suffix Products, Length-prefix Encoding, Delimiter Collision, Escaping]
  - name: "Two Pointers"
    concepts: [Search Space Pruning, k-Sum Reduction, Duplicate Skipping, Prefix Maximum]
  - name: "Sliding Window"
    concepts: [Sliding Window, Window Invariant, Last-seen Index, Running Minimum, Fixed-size Window, Monotonic Deque, Non-shrinking Window]
  - name: "Stack"
    concepts: [Stack, Bracket Matching, Auxiliary Min Stack, Reverse Polish Notation, Backtracking, Catalan Number]
  - name: "Monotonic Stack"
    concepts: [Monotonic Stack, Next Greater Element, Sentinel Value]
---

## If you are just starting

[NeetCode 150](https://neetcode.io/practice) is a list of 150 LeetCode problems picked and ordered by **solution pattern**, not by difficulty. This line gathers the first 27. The whole line is about arrays and strings, and the question that comes back most often is *how do I quickly tell "have I seen this before?"*.

All you need is to be able to write a `for` loop and a function in any language. Each post opens with **"Picture it first"**, which puts the technique into an everyday situation, together with a **quick glossary** for the new terms.

## One station, many problems

Each **station** is a *pattern*, a solving technique that repeats across several problems. The station's post teaches the technique through one anchor problem, then shows where each other problem uses it differently. Every LeetCode problem has **its own page** in [[en/problems/index|the NeetCode 150 problem set]], solved in depth in five languages (TypeScript, Python, Go, Java, JavaScript), with complexity, measurements and common traps.

## Why this order

- **Stations 1–2** build the basic tools: hash sets and hash maps answer "seen it?" and "seen it how many times?" in O(1) on average, then the count table becomes a *key* for grouping.
- **Station 3** swaps hashing for helper arrays: running products from the left and from the right (prefix, suffix), and a way to encode a list of strings as one string.
- **Stations 4–5** exploit order: two pointers walking in from both ends, then a sliding window that grows and shrinks over a contiguous range, often reusing station 2's count table.
- **Stations 6–7** add the stack: matching brackets, evaluating expressions, then the monotonic stack that finds the "next greater element" in O(n).

## Versions and sources

The solutions really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). Timings change with the machine and the run; the ratios between approaches stay stable.

The problems belong to LeetCode; each problem page only restates the problem in my own words and links to it. The list and its groups come from the public data of [NeetCode 150](https://neetcode.io/practice); grouping problems into stations is my own. The solutions, measurements and diagrams are my own.
