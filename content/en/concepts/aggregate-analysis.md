---
title: "Aggregate Analysis"
description: "Count the total steps of the whole algorithm instead of multiplying the number of loop iterations by each loop's worst case."
tags: ["algorithms", "complexity"]
type: note
region: Algorithms Region
lang: en
---

**Aggregate analysis** asks "how many steps does the whole algorithm take in total?" instead of "the outer loop runs n times, and each time the inner loop takes at most n steps". When each element can only be processed a fixed number of times over the **entire** algorithm, the total work is O(n) even though the code has nested loops. It is also how you prove [[en/concepts/amortized-o1|Amortized O(1)]]: the total cost of n operations divided by n.

Read more in [[en/problems/longest-consecutive-sequence|Longest Consecutive Sequence]].
