---
title: "Midpoint Overflow"
description: "(lo + hi) / 2 overflows a 32-bit integer once the sum passes 2³¹ − 1 and yields a negative index; write lo + (hi − lo) / 2 or (lo + hi) >>> 1."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

With a 32-bit `int`, `lo = 1,500,000,000` and `hi = 2,000,000,000` give `(lo + hi) / 2 = −397,483,648`. In 2006 Joshua Bloch pointed out this bug in the JDK's `java.util.Arrays.binarySearch`, where it lay dormant for about 9 years because it only shows on arrays of about 2³⁰ elements or more. Two fixes: `lo + (hi − lo) / 2` (the difference never exceeds `hi`), or `(lo + hi) >>> 1` in Java and JavaScript (the unsigned shift reads an overflowed sum as positive). Go writes `int(uint(i+j) >> 1)` in `sort.Search`. Python is immune because `int` is unbounded; JavaScript's addition does not overflow, but `>> 1` casts to a signed int32 and hits exactly this bug. See [[en/concepts/binary-search|Binary Search]].

Read more in [[en/problems/binary-search|Binary Search (LC 704)]] and [[en/posts/2026-11-23-neetcode-binary-search|station 1: Binary Search on Arrays]].
