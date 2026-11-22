---
title: "Prefix Sum"
description: "An array P where P[i] is the sum of a[0..i-1]: the sum of any range is the difference of two cells."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A **prefix sum** is computed once in O(n): `P[0] = 0`, `P[i+1] = P[i] + a[i]`. After that the sum of `a[l..r]` is `P[r+1] − P[l]`, answered in O(1). The idea extends to any associative operation (product, max, XOR), but only **invertible** ones such as addition and XOR can extract a middle range with one subtraction; a product has to be joined with a [[en/concepts/prefix-and-suffix-products|suffix]].

Read more in [[en/posts/2026-11-23-neetcode-prefix-suffix-encoding|station 3: Prefix, Suffix and Encoding]].
