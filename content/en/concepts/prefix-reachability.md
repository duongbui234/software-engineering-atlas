---
title: "Prefix Reachability"
description: "Mark boundaries whose entire prefix can be assembled from valid pieces."
tags: [algorithms, neetcode, dynamic-programming]
type: note
region: Algorithms Region
lang: en
---

I use i as the boundary after prefix s[0:i]. Boundary zero is reachable before any cut. A valid piece extends a reachable boundary without storing its earlier cuts.

Read more in [[en/posts/2026-11-27-neetcode-word-break-lis|DP-04]].
