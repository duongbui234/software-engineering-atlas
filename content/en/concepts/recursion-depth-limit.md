---
title: "Recursion Depth Limit"
description: "The maximum number of nested calls before a program reports a stack overflow; every language sets it differently, and skewed trees hit it first."
tags: ["algorithms", "recursion"]
type: note
region: Algorithms Region
lang: en
---

Every call that has not returned yet takes a frame on the **call stack**. Recursion on a [[en/concepts/binary-tree|tree]] goes as deep as the tree is tall, so a balanced tree of 10⁶ nodes needs about 20 levels, while a skewed tree of 10⁶ nodes needs 10⁶. Measured on my machine with `maxDepth` on a skewed chain:

| Language | Default limit | Measured | Past the limit |
|---|---|---|---|
| Python 3.12 | `sys.getrecursionlimit()` = 1000 levels | 997 nodes | `RecursionError`, catchable |
| Node.js 24 | V8 stack of 984 KB (`--stack-size`) | 7,000 to 15,600 nodes, depending on whether the JIT has optimized the function yet | `RangeError`, catchable |
| Java 21 | `-Xss` of 1 MB for the main thread | about 39,000 nodes | `StackOverflowError`, catchable |
| Go 1.25 | goroutine stack grows on demand up to 1 GB | 10⁶ nodes run in 62.8 ms | `fatal error: stack overflow`, cannot be `recover`ed |

There are two ways out: raise the limit (`sys.setrecursionlimit`, `node --stack-size`, `new Thread(null, r, name, stackSize)` in Java), or rewrite with an explicit [[en/concepts/stack|stack]] on the heap. The iterative version never overflows the call stack, but it is not free: on a random tree 25 levels tall, the iterative Diameter of Binary Tree (which needs a hash map from node to height) is about 8 to 10 times slower than the recursive one in Node, Go and Java, and 1.7 times slower in Python.

Read more in [[en/posts/2026-11-25-neetcode-tree-recursion|station 3: Tree Recursion]].
