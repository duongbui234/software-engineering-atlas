---
title: "Prefix and Suffix Products"
description: "The product of everything except position i equals the product on the left times the product on the right, computed in two passes without division."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

A left → right pass writes the product of `nums[0..i-1]`, a right → left pass multiplies in the product of `nums[i+1..n-1]`. No division is needed, so a zero breaks nothing. Each cell is used once in scan order, so the two helper arrays shrink to two running variables and O(1) extra space. A relative of [[en/concepts/prefix-sum|Prefix Sum]].

Read more in [[en/problems/product-of-array-except-self|Product of Array Except Self]].
