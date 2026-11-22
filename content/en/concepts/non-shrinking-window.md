---
title: "Non-shrinking Window"
description: "A sliding window that, each step, only grows or slides as a whole: its length never decreases, so its final length is the answer."
tags: ["algorithms", "sliding-window"]
type: note
region: Algorithms Region
lang: en
---

When the problem asks for the **longest** range satisfying a condition, the window doesn't have to stay valid. Each step adds one element on the right; if the window breaks, drop just **one** element on the left (`if` instead of `while`), so the window slides without shrinking. The length only grows when a truly longer range is found, so the answer is the final length `n − left`. As a result, information such as the top frequency only needs to be a **record**, not exact for the current window. A variant of the [[en/concepts/sliding-window|Sliding Window]] with a relaxed [[en/concepts/window-invariant|invariant]].

Read more in [[en/problems/longest-repeating-character-replacement|Longest Repeating Character Replacement]].
