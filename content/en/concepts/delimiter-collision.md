---
title: "Delimiter Collision"
description: "A delimiter breaks when the data contains it: parts get split wrongly, and an empty list is confused with one empty string."
tags: ["algorithms"]
type: note
region: Algorithms Region
lang: en
---

Joining `["a,b", "c"]` with commas gives `a,b,c`, which splits back into three parts. A rarer character only makes the bug rarer. Two fixes: [[en/concepts/escaping|escaping]] or a [[en/concepts/length-prefix-encoding|length prefix]]. It is also the root of many injection-style security bugs, where user data gets read as structure.

Read more in [[en/problems/encode-and-decode-strings|Encode and Decode Strings]].
