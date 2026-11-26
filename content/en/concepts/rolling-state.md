---
title: Rolling State
description: "Reuse the memory of states after their final read."
tags: [algorithms, dynamic-programming, neetcode]
type: note
region: Algorithms Region
lang: en
---

I check which old values the next iteration still reads. When it needs only the previous two, I can reuse the older slot after reading both. When reconstructing a solution, I keep the table or record the choices separately.

Read more in [[en/posts/2026-11-27-neetcode-linear-dp|DP-01]].
