---
title: "Complement Lookup"
description: "Instead of searching for a pair, compute the missing value and look up whether you have seen it."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

**Complement lookup**: at element x, the only value that pairs with it to reach target is `target − x`. The question "is there a pair?" (O(n²)) becomes "have I seen target − x yet?" (one map lookup, O(1)). The trick is reused for counting subarrays with sum k (the complement over prefix sums), 4Sum II and many other problems.

Read more in [[en/posts/2026-11-22-neetcode-two-sum|Two Sum]].
