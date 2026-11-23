---
title: "Ceiling Division"
description: "Rounding-up division ⌈p / k⌉ with integers only: (p + k − 1) / k, or -(-p // k) in Python; avoids going through floating point, which breaks once numbers pass 2⁵³."
tags: ["algorithms", "numbers"]
type: note
region: Algorithms Region
lang: en
---

Integer division in most languages rounds **down** (for positive numbers), but many problems need rounding **up**: 7 bananas eaten 4 per hour take ⌈7 / 4⌉ = 2 hours, not 1. For p ≥ 0 and k > 0, `(p + k − 1) / k` gives exactly ⌈p / k⌉. Python writes `-(-p // k)`, because `//` rounds down even for negative numbers. `Math.ceil(p / k)` goes through a 64-bit float: correct while p and k are small (up to 10⁹ it never differs), but wrong once p passes 2⁵³; for example `math.ceil((2**53 + 1) / 1)` in Python gives 2⁵³. The other trap is overflow: `p + k − 1` can exceed a 32-bit `int` when p and k are both near 2³¹; `(p − 1) / k + 1` avoids that, but for p = 0 Java, Go and C give 1 instead of 0, because their division truncates toward zero.

Read more in [[en/problems/koko-eating-bananas|Koko Eating Bananas (LC 875)]].
