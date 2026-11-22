---
title: "Backtracking"
description: "Try a choice, go on, then undo it to try another; prune branches that can never become an answer early."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

The solution being built is a [[en/concepts/stack|stack]] of choices: add a choice (`push`), recurse, then remove it (`pop`). Its power lies in the pruning condition: Generate Parentheses only adds `)` when there are fewer `)` than `(`, so it never builds a wrong string only to filter it out. Forgetting to undo the choice is the most common bug.

Read more in [[en/posts/2026-11-23-neetcode-stack|station 6: Stack]].
