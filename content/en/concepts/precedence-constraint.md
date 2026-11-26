---
title: "Precedence Constraint"
description: 'A rule "x must come before y", extracted from the data and turned into a directed edge.'
tags: [algorithms, graph, topological-sort]
type: note
region: Algorithms Region
lang: en
---

A **precedence constraint** says `x` must come before `y`. Some problems give them directly (course prerequisites); others make you extract them: in Alien Dictionary, two adjacent words in the sorted list give exactly one constraint, at their first differing letter. The letters after it say nothing more.

Each constraint is an edge `x → y`; collect them all, then run a [[en/concepts/topological-sort|topological sort]]. Two traps: a longer word placed before its own prefix (`abc` before `ab`) means the input is contradictory, and a letter that appears in no constraint must still be in the result.

Read more in [[en/posts/2026-11-26-neetcode-topological-sort|station 3: Topological Sort]].
