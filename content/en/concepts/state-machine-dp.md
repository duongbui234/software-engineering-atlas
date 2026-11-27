---
title: "State Machine DP"
description: "Add a small state such as holding, just sold or resting to the index, then write the transitions between them."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

When knowing the day i is not enough to decide, I also ask: which situation am I in right now? Each situation is a node of a state machine, and each action (buy, sell, rest) is an arrow to a situation on the next day. The best value for day i + 1 reads only the states of day i, so a few variables are enough.

Read more in [[en/posts/2026-11-27-neetcode-state-machine-dp|DP-06]] and on the [[en/problems/best-time-to-buy-and-sell-stock-with-cooldown|Best Time to Buy and Sell Stock with Cooldown]] page.
