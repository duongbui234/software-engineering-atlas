---
title: "Bitmask"
description: "Using each bit of an integer as a true/false slot: a small set fits in one number, checked and recorded with AND and OR."
tags: ["algorithms", "bits"]
type: note
region: Algorithms Region
lang: en
---

When the possible elements lie in a small range (digits 1..9, 26 letters), a **bitmask** replaces a whole Set: bit k set means "element k is present". Checking is `mask & (1 << k)`, recording is `mask |= 1 << k`, and the union of two sets is `a | b`. No hashing and no allocation, so it is many times faster than a [[en/concepts/hash-set|Hash Set]] even though both are O(1). The limit: the number of elements must fit in the bits of the integer type (32 or 64), and in JavaScript bitwise operations always truncate to 32 bits.

Read more in [[en/problems/valid-sudoku|Valid Sudoku]].
