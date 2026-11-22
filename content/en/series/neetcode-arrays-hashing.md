---
title: "The NeetCode 150 Line: Arrays & Hashing"
description: "A careful walk through every problem in the first group of NeetCode 150 in five languages (TypeScript, JavaScript, Python, Go, Java): not just the optimal solution, but why it is fast, real measurements of how fast it is, and the traps each language hides under its hash table and its sort function."
series: neetcode-arrays-hashing
code: NC
region: Algorithms Region
draft: false
lang: en
stations:
  - name: Contains Duplicate
    concepts: [Big-O Notation, Brute Force, Hash Set, Sort Then Scan, Space-Time Tradeoff]
  - name: Valid Anagram
    concepts: [Frequency Counting, Counting Array, Hash Map, Unicode Normalization]
  - name: Two Sum
    concepts: [Complement Lookup, One-pass Hash Map, Two Pointers, Hash Collision, Amortized O(1)]
  - name: Group Anagrams
    concepts: [Canonical Key, Count Key, Key Serialization, Group By]
  - name: Top K Frequent Elements
    concepts: [Heap, Bucket Sort, Quickselect, Sorting Lower Bound]
  - name: Product of Array Except Self
  - name: Valid Sudoku
  - name: Encode and Decode Strings
  - name: Longest Consecutive Sequence
---

## If you are just starting

[NeetCode 150](https://neetcode.io/practice) is a list of 150 LeetCode problems picked and ordered by **solution pattern**, not by difficulty. The first group, **Arrays & Hashing**, has 9 problems, and all 9 revolve around the same question: *how do I quickly tell "have I seen this before?"*. The answer is almost always a hash table, that is, the `Set` or `Map` every language ships with.

All you need is to be able to write a `for` loop and a function in any language. Each station opens with **"Picture it first"**, which puts the problem into an everyday situation (checking tickets, rearranging letters, finding someone to pair up with, sorting mail into pigeonholes, counting votes), together with a **quick glossary** for the new terms.

## What each station has

- **The problem restated in my own words**, with the input limits (because the limits are what decide which solution gets accepted).
- **Every approach**, from brute force to optimal, each with its time and space complexity.
- **Runnable solutions in five languages**: TypeScript, JavaScript, Python, Go, Java. Each file runs its own tests.
- **A real measurement** on my machine, because Big-O only describes the shape of the curve, not the constants. At some stations the "O(n)" approach is actually slower than the "O(n log n)" one.
- **Under each language**: where V8's `Set`, Python's `dict`, Go's `map` and Java's `HashMap` differ, and which traps only one language has.

## Why this order

This is exactly NeetCode's order, and it builds up layer by layer:

- **Station 1** teaches how to measure (Big-O) and the most basic tool: a set of things already seen.
- **Station 2** moves from "seen it or not" to "seen it how many times": counting.
- **Station 3** stores the *position* next to the value, and asks about something *not yet* seen (the missing number). This station also opens the hash table up to look inside: collisions, resizing the table.
- **Station 4** uses station 2's count table itself as a *key* to group things.
- **Station 5** has to rank after counting: heap, bucket sort, quickselect.

The next four stations (starting with Product of Array Except Self) are still to be written.

## Versions and sources

The examples really run on **Node.js 24** (running `.ts` files directly), **Python 3.12**, **Go 1.25** and **Java 21** (`java File.java`, no `javac` needed). The timings change with the machine and the run; the ratios between approaches stay stable.

The problem statements belong to LeetCode; each station only summarizes the problem in my own words and links to it. The problem order comes from NeetCode's public data. The solutions, measurements and diagrams are my own. Details about hash tables and sorting come from the ECMAScript specification, the OpenJDK source code, the Go spec and release notes, and the CPython documentation.
