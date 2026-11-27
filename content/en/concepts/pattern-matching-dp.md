---
title: "Pattern Matching DP"
description: "A two-string table between a text and a pattern, where a symbol such as * can consume zero or more characters."
tags: [algorithms, neetcode, dynamic-programming, string]
type: note
region: Algorithms Region
lang: en
---

Cell `dp[i][j]` asks whether the first i characters of the text match the first j characters of the pattern in full. Plain characters and `.` move diagonally, as in any two-string table. A `*` belongs to the character before it: taking zero copies looks two columns back, taking one more copy looks at the cell directly above if the text character matches. Row 0 is not all false, because a pattern like `a*b*` still matches the empty string.

Read more in [[en/posts/2026-11-27-neetcode-interval-dp|DP-07]] and on the [[en/problems/regular-expression-matching|Regular Expression Matching]] page.
