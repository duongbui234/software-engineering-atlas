---
title: "Unicode Normalization"
description: "Bring the different encodings of the same letter to one canonical form (NFC, NFD)."
tags: ["unicode", "strings"]
type: note
region: Algorithms Region
lang: en
---

The letter `é` can be one code point (U+00E9) or `e` plus a combining acute accent (U+0301): they display identically but compare as different. **Normalizing** to NFC brings both to the precomposed form. JS has `s.normalize('NFC')`, Python has `unicodedata.normalize`, Java has `Normalizer`, and Go needs the `golang.org/x/text/unicode/norm` package. On top of that, JS and Java store strings as UTF-16, so `length` and `split('')` count code units and break emoji apart.

Read more in [[en/problems/valid-anagram|Valid Anagram]].
