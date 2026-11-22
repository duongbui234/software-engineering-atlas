---
title: "Reverse Polish Notation"
description: "Writing the operator after its operands, like 3 4 +; evaluated with one stack and no brackets needed."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

Read left to right: push numbers onto a [[en/concepts/stack|stack]]; on an operator, pop the top two (the one popped first is the right operand), compute, push the result back. `2 1 + 3 *` is `(2 + 1) · 3`. The order of operations is already in the order of writing, so no brackets or precedence are needed. HP calculators, the Forth language and the JVM all evaluate this way.

Read more in [[en/posts/2026-11-23-neetcode-stack|station 6: Stack]].
