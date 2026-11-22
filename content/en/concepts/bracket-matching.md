---
title: "Bracket Matching"
description: "Pairing each closer with the nearest unclosed opener; it needs a stack because counting cannot remember order."
tags: ["algorithms", "stack"]
type: note
region: Algorithms Region
lang: en
---

With one kind of bracket a counter is enough. With several kinds, counting fails: three separate counters still let `"([)]"` through. A [[en/concepts/stack|stack]] keeps the openers in order, so a closer only has to be compared with the top. The same idea covers nested HTML tags, `begin`/`end` blocks and parsers.

Read more in [[en/problems/valid-parentheses|Valid Parentheses]].
