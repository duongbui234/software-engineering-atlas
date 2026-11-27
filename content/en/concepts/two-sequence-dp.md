---
title: "Two-Sequence DP"
description: "Let dp[i][j] be the answer for the first i characters of one string and the first j of the other."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Algorithms Region
lang: en
---

With two strings, I ask about two prefixes at once: `a[0:i]` and `b[0:j]`. Row 0 and column 0 stand for the empty prefix, so the table is (m + 1) × (n + 1). Each cell reads only the cell above, the cell to the left and the upper-left diagonal, which means dropping the last character of one string or of both. That is why one row plus a temporary for the diagonal is enough when only the final number matters.

Read more in [[en/posts/2026-11-27-neetcode-grid-two-strings|DP-05]].
