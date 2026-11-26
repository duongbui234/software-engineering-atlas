---
title: "Directed Acyclic Graph"
description: "A directed graph with no cycle: following the arrows never brings you back to where you started."
tags: [algorithms, graph, topological-sort]
type: note
region: Algorithms Region
lang: en
---

A **DAG** (directed acyclic graph) is a graph whose edges have a direction, where `u → v` reads "u must finish before v", and that has no cycle. Course prerequisites, build steps and the order you get dressed in the morning are all DAGs.

Having no cycle is exactly what lets me line up every vertex so that every arrow points forward, which is a [[en/concepts/topological-sort|topological order]]. One cycle `a → b → a` is enough to make that impossible.

Read more in [[en/posts/2026-11-26-neetcode-topological-sort|station 3: Topological Sort]].
