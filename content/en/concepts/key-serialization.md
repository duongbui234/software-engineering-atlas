---
title: "Key Serialization"
description: "Turn a structured value into a string key so that no two different values produce the same string."
tags: ["algorithms", "hashing"]
type: note
region: Algorithms Region
lang: en
---

Joining the count tables `[1, 11, …]` and `[11, 1, …]` without a separator gives `"1110…"` for both, so two words that are not anagrams get grouped together, and this bug still passes every example in the problem. Correct **key serialization** needs a separator (`count.join('#')`) or a fixed-width format (Java: one `char` per slot). The rule: you must be able to read the string back into exactly the original value.

Read more in [[en/problems/group-anagrams|Group Anagrams]].
