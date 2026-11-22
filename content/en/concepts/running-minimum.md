---
title: "Running Minimum"
description: "A variable holding the smallest value among the elements passed so far, updated in O(1) per step."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

The **running minimum** is a single variable: each step, `min = min(min, x)`. When the answer for position j needs only one number about the past (such as the cheapest buy price before sell day j), this variable replaces a whole inner loop, bringing O(n²) down to O(n) with O(1) memory. Order matters: use the old value to compute the answer first, then update.

Read more in [[en/problems/best-time-to-buy-and-sell-stock|Best Time to Buy and Sell Stock]].
