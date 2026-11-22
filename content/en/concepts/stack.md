---
title: "Stack"
description: "A list you only add to and take from at one end: last in, first out (LIFO), with O(1) push and pop."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

A **stack** answers "what is the most recent unfinished item?" in O(1): the top is always the element added last. In most languages a dynamic array that only grows and shrinks at its **end** is enough: a JS array, a Python `list`, a Go slice, a Java `ArrayDeque`. Adding or removing at the **front** of an array is O(n). Popping an empty stack is the most common bug, and each language reacts differently. See [[en/concepts/bracket-matching|Bracket Matching]].

Read more in [[en/posts/2026-11-23-neetcode-stack|station 6: Stack]].
