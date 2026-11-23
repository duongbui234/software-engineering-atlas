---
title: "Carry Propagation"
description: "Add two numbers digit by digit from the lowest place up, carrying the overflow into the next place; the loop stops only when both numbers and the carry are used up."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

Adding by hand: add the two digits in the same place plus the carry from the previous place, write `s % 10`, carry `s / 10` (0 or 1 when adding two decimal numbers) into the next place. **Carry propagation** is exactly that procedure written as a loop. Two spots go wrong: numbers of different lengths (once one runs out, treat its digits as 0), and the final carry (999 + 1 needs one more digit), so the loop condition is `a || b || carry`.

Used in [[en/problems/add-two-numbers|Add Two Numbers]], where each number is a [[en/concepts/linked-list|linked list]] of digits in reverse order (the head is the ones place), and the result hangs off a [[en/concepts/dummy-node|dummy node]]. The same idea shows up in Plus One, Add Binary, and in the big-number addition of libraries like `BigInt`.

Read more in [[en/posts/2026-11-24-neetcode-advanced-linked-list|Advanced Linked Lists]].
